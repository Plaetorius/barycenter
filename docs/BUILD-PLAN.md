# Barycenter: build plan

Status: plan, 2026-10-05. Companion to [`../PLAN.md`](../PLAN.md), which covers the product, benchmark and decisions.
This document covers **how** Barycenter is built: the data pipeline, the fetchers, the evidence model and the app.
It ends with the reconnaissance phase (section 11). Agents gather data first, we survey what exists, and only then
lock the remaining build decisions.

---

## 0. Non-negotiables

1. **Every published fact can be traced to evidence.** Any number, date, investor link or classification on the site
   opens a drawer showing:
   - the source (publisher, URL, date)
   - the exact passage or field it came from
   - an archived copy
   - how it was extracted (parser version, or model and prompt)
   - who reviewed it

   A fact without evidence does not ship. The build fails.
2. **Claims, not truths.** We store what each source *says* (claims) and derive a canonical value with explicit
   rules. Disagreements between sources are kept and shown, never silently overwritten.
3. **Raw data is immutable.** Every fetched document is stored byte-for-byte, content-addressed by SHA-256, with
   fetch metadata. Parsers can be re-run on old snapshots at any time. A source changing or disappearing never
   breaks the audit trail.
4. **Reproducible builds.** A dataset release is a function of (raw snapshots + review decisions + code version).
   Re-running the pipeline on the same inputs gives byte-identical outputs.
5. **Legal and polite collection.** We use official APIs and bulk data first, and Scrapling for HTML. Robots.txt is
   obeyed, we identify ourselves, requests are throttled, paywalls are never bypassed, and paid databases are not
   used (section 3.4).
6. **Disclosed only.** We never invent per-investor amounts. When something is unknown, we say "undisclosed".

---

## 1. System map

```
                         ┌────────────────────────────────────────────────────────────┐
  SOURCES                │  PIPELINE  (Python, uv, `barycenter` package)              │        SITE (Next.js)
                         │                                                            │
 ┌─────────────────┐     │  1 DISCOVER    2 FETCH         3 ARCHIVE                   │
 │ Official APIs   │──┐  │  source lists  Scrapling       raw/sha256/…  (immutable)   │
 │ EDGAR, USAspend │  │  │  of locators ─▶ Fetcher /    ─▶ snapshots.jsonl manifest   │
 │ CORDIS, UKRI…   │  │  │  (URLs, IDs,   Spiders /       + Wayback "Save Page Now"   │
 ├─────────────────┤  ├─▶│  queries)      API clients     for public verifiability    │
 │ Gov program     │  │  │                                       │                    │
 │ pages, registers│  │  │                                       ▼                    │
 ├─────────────────┤  │  │  4 EXTRACT ──────────────────────────────────────────────  │
 │ Company & inv.  │  │  │   structured → deterministic parsers (JSON pointer/XPath)  │
 │ newsrooms, RSS  │  │  │   prose → LLM extractor with verbatim-quote guard          │
 ├─────────────────┤  │  │                    │  emits CLAIMS (atomic, evidenced)     │
 │ Trade press     │──┘  │                    ▼                                       │
 └─────────────────┘     │  5 RESOLVE  entities (IDs: CIK, LEI, UEI, PIC, SIREN,      │
                         │             Companies House no., Wikidata QID, domain)     │
 ┌─────────────────┐     │                    │                                       │
 │ Reference only  │     │                    ▼                                       │
 │ FIA report, FEB,│────▶│  6 REVIEW   queue → human decisions (review/*.jsonl, git)  │
 │ IAEA ARIS, NEA  │ (coverage checks, never a source of record)                      │
 └─────────────────┘     │                    │                                       │
                         │                    ▼                                       │
                         │  7 RECONCILE claims → canonical facts (rules, conflicts)   │
                         │  8 VALIDATE  build fails on bad data                       │
                         │  9 PUBLISH   release vYYYY.MM.DD: JSON shards, CSV,        │──▶ site/public/data/
                         │              Parquet, provenance bundle, changelog         │    static, prerendered
                         └────────────────────────────────────────────────────────────┘    evidence drawer on
                                                                                           every fact
```

### Repository layout

Mirrors public-money: Python pipeline plus web app, one repo.

```
barycenter/
├── PLAN.md                    product, benchmark, decisions
├── docs/
│   ├── BUILD-PLAN.md          this file
│   ├── sources/               one source card per source (YAML + notes), see §3.1
│   ├── survey/                reconnaissance outputs (§11)
│   └── internal/              gitignored notes
├── pipeline/
│   ├── pyproject.toml         uv; scrapling, pydantic, httpx, polars, duckdb, rapidfuzz, anthropic
│   ├── barycenter/
│   │   ├── sources/           one adapter module per source (edgar.py, usaspending.py, cordis.py, …)
│   │   ├── fetch/             Scrapling wrappers, politeness policy, archive writer, wayback client
│   │   ├── extract/           deterministic parsers + llm_extract.py (+ prompts/, versioned)
│   │   ├── resolve/           entity resolution, alias tables, external-ID crosswalk
│   │   ├── review/            review CLI (accept / edit / reject / merge)
│   │   ├── reconcile/         claim → fact rules, dedup of funding events
│   │   ├── validate/          quality gates
│   │   ├── publish/           release writer (JSON shards, CSV, Parquet, provenance)
│   │   └── models.py          pydantic models: the single schema source
│   ├── seeds/                 hand-curated: taxonomy.yaml, universe.yaml, aliases.yaml
│   ├── review/                decisions.jsonl (committed: the human audit log)
│   ├── raw/                   content-addressed snapshots (gitignored, synced to private blob storage)
│   └── tests/                 parsers tested offline on stored fixtures
├── site/                      Next.js 16 app, basePath /barycenter
└── Makefile                   make survey | fetch | extract | review | build-data | site | test
```

---

## 2. Evidence model

This is the core of auditability. There are three layers: **Snapshot → Claim → Fact**.

### 2.1 Snapshot (what we fetched)

```
Snapshot
  id            sha256 of body                          # content address, also the file path
  url           requested URL
  final_url     after redirects
  fetched_at    UTC timestamp
  http_status, content_type, bytes
  fetcher       "scrapling.Fetcher@0.x" | "api:usaspending@v2" | "manual-upload"
  robots_ok     bool (checked at fetch time)
  wayback_url   archive.org copy (requested via Save Page Now for HTML sources; null for APIs)
  source_id     → source card (edgar, usaspending, newsroom:helion, …)
  text_sha256   sha256 of the extracted plain text (what quotes are matched against)
```

APIs: we store the exact request (endpoint and parameters) and the response JSON. Anyone can replay the query.
For press articles we never republish the body (copyright). We publish the URL, the Wayback copy, a short quote and
the hash, so anyone can prove the passage existed.

### 2.2 Claim (what a source says)

```
Claim
  id            ULID
  subject       entity or event ID                     (org:helion-energy, evt:helion-2025-01-series-f)
  predicate     controlled vocabulary                  (raised_amount, round_label, announced_on, led_by,
                                                        participated_in, awarded, hq_country, approach, …)
  value         typed (Money{amount, currency}, Date, EntityRef, Enum, Text)
  snapshot_id   → Snapshot
  locator       where exactly: JSON pointer / XPath / char offsets in text / PDF page+bbox
  quote         verbatim excerpt (≤ 300 chars) for prose sources; null for structured fields
  method        "parser:edgar_formd@1.2" | "llm:claude-sonnet-5-5|prompt:sha256…" | "manual:<reviewer>"
  confidence    disclosed | reported | estimated  (estimated is never shown as a fact)
  status        pending | accepted | rejected | superseded
  reviewed_by, reviewed_at, review_note
```

### 2.3 Fact (what we publish)

```
Fact
  subject, predicate, value
  chosen_claim_id            the claim whose value we display
  supporting_claim_ids[]     agree with it (within tolerance)
  conflicting_claim_ids[]    disagree: shown as "Sources differ" in the UI
  rule                       which reconciliation rule picked it (§6.2)
```

### 2.4 Domain entities (the canonical layer, built from facts)

```
Organization   id (stable slug), kind: company|investor|public_funder|person, name, aliases[], country,
               hq {city, lat, lon}, website, parent_id, external_ids {cik, lei, uei, pic, siren,
               companies_house, wikidata, ror}
Company        sector: fusion|fission, approach (fusion) / reactor_type (fission), fuel, value_chain_role,
               stage, licensing_status, founded, status: active|acquired|public|defunct
Investor       type: vc|cvc|corporate|family_office|sovereign_fund|angel|accelerator|bank|dfi|pension
PublicFunder   country, level: national|supranational|regional|state
Program        id, funder_id, name, instrument, url
FundingEvent   id, company_id, instrument: equity|grant|cost_share|voucher|debt|ipo|spac|follow_on|other,
               round_label, round_group, announced_on, closed_on, amount {orig, currency, usd, fx_date},
               committed / obligated / disbursed (public money), valuation_post?, use_of_proceeds,
               program_id?, form_d_ids[]
Participation  event_id, org_id, role: lead|participant|grantor|lender, amount? (disclosed only)
Agreement      id, company_id, counterparty_id, type: offtake|ppa|fuel_supply|site|gov_contract|partnership,
               binding: loi|mou|definitive, announced_on, capacity_mw?, value?, term_years?
```

Every field of every entity is a Fact, so every field has evidence. IDs are stable slugs, never reused, and shared
with the future Accretion tool.

---

## 3. Sources

### 3.1 Source cards

Every source gets `docs/sources/<id>.yaml` before any code is written:

```yaml
id: usaspending
name: USAspending.gov
owner: US Treasury
access: api            # api | bulk | html | rss | pdf | manual
endpoint: https://api.usaspending.gov/api/v2/
auth: none
rate_limit: unpublished, self-limit 2 req/s
licence: US public domain
robots: n/a (API)
yields: [grant, cost_share, contract awards; obligated vs outlayed; recipient UEI]
identifiers: [uei, award_id, assistance_listing]
cadence: weekly
tier: A
known_gaps: "Subawards incomplete; DOE lab work (FWP) not company-level"
probe: docs/survey/probes/usaspending.md      # filled in by reconnaissance
```

### 3.2 Catalogue

Tiers:
- **A**: official structured data, the source of record
- **B**: official but unstructured (government pages, company releases)
- **C**: press, corroborating
- **R**: reference only, used for coverage checks and never cited as the source of a fact

| # | Source | Tier | Access | Yields | Key notes |
|---|---|---|---|---|---|
| 1 | **SEC EDGAR**: Form D, S-1, 10-K/Q, 8-K | A | API (`data.sec.gov` submissions, `efts` full-text search) | US private raises (offering size, amount sold, first sale date), public-company financing, SPAC deals | User-Agent with contact required, ≤10 req/s. Form D "amount sold" is often a tranche, so it links to an event as evidence rather than creating a new one. Ignore `relatedPersons` (personal data, not needed) |
| 2 | **USAspending.gov** | A | API, no key | DOE (NE, FES, ARPA-E, LPO) awards: obligations, outlays, recipient UEI | `spending_by_award` + award detail + transactions |
| 3 | DOE program pages: ARDP, Milestone-Based Fusion Development, FIRE, INFUSE, GAIN vouchers, HALEU availability, LPO announcements | B | HTML (Scrapling) | Program → awardee → amount, announced dates | Joined to USAspending awards by recipient and date |
| 4 | ARPA-E project database | A/B | HTML/JSON | Project awards (fusion programs such as BETHE, GAMOW; fission such as MEITNER, GEMINA) | |
| 5 | SBIR.gov awards | A | API (verify availability in recon) | SBIR/STTR awards for small nuclear firms | Historically unstable API; bulk CSV fallback |
| 6 | NRC: pre-application list, ADAMS | A | HTML + ADAMS API | Licensing status (stage, not money) | Drives the `licensing_status` facet |
| 7 | **EU CORDIS** (Horizon Europe, Euratom) | A | Bulk CSV/JSON on data.europa.eu | EU grants per participant (PIC), EC contribution | |
| 8 | EIC Fund, EIB, EU Innovation Fund | B | HTML/press | EU equity and loans | |
| 9 | EU TED (tenders) / Fusion for Energy | A | API | Public contracts, e.g. ITER/F4E suppliers | Into `Agreement: gov_contract`. Mostly relevant to Accretion later |
| 10 | **UKRI Gateway to Research** | A | API | UK grants (Innovate UK, EPSRC) per organisation | |
| 11 | **UK Companies House** | A | API (free key, 600 req/5 min) | SH01 share allotments (dated equity issues), PSC, accounts | Strong evidence of UK rounds (Tokamak Energy, First Light, Astral) |
| 12 | UK Contracts Finder / Find a Tender, UKAEA, GBE-N SMR programme | A/B | API + HTML | UK public contracts and programme awards | |
| 13 | **France: BODACC** (capital changes), RNE/INPI, France 2030 / Bpifrance laureates | A/B | Opendatasoft API + HTML | Capital increases, laureate grants (Réacteurs nucléaires innovants) | SIREN as ID |
| 14 | Germany: Förderkatalog (federal grants DB), SPRIND | A/B | HTML search | Federal grants (fusion: Proxima, Marvel, Gauss, Focused Energy) | |
| 15 | Canada: open.canada.ca Grants & Contributions, Strategic Innovation Fund | A | Bulk CSV | Federal contributions (General Fusion, ARC, Moltex…) | |
| 16 | Japan (Moonshot, J-Fusion), China, Korea | C | Press | Asian fusion and fission rounds | Lower confidence, flagged as press-only |
| 17 | **Company newsrooms** | B | RSS / sitemap / HTML (Scrapling spiders) | Primary announcements of rounds and agreements | One spider config per company, from `universe.yaml` |
| 18 | **Investor portfolio pages** | B | HTML (Scrapling) | Investor → company links (often without amount) | Confidence `disclosed` for the link only |
| 19 | PR wires (Business Wire, PR Newswire, GlobeNewswire) | B | RSS | Official releases | Feeds only, respect ToS |
| 20 | Trade press: World Nuclear News, NucNet, ANS Newswire, Neutron Bytes, FIA news, TechCrunch | C | RSS + HTML | Discovery and corroboration | Never the sole source for an amount if a primary source exists |
| 21 | **Wikidata**, **GLEIF** (LEI) | A | SPARQL / API (CC0) | IDs, HQ coordinates, founding dates, parent companies | Entity resolution backbone |
| 22 | FX and inflation: ECB via Frankfurter, FRED CPI | A | API | Deal-date FX, constant dollars | Rates stored as snapshots too |
| 23 | **Logos**: company's own site (header SVG, `apple-touch-icon`, `og:image`), Wikimedia Commons, Brandfetch as fallback (check ToS) | B | HTML (Scrapling) / API | Logo per organization | Stored as a snapshot like any other fact (URL, hash, date). Normalised to square WebP. Monogram fallback. Removed on request |
| 24 | FIA annual report, Fusion Energy Base, The Fusion Report, IAEA ARIS, NEA SMR Dashboard | R | Manual | Universe and totals for coverage checks | Not cited as fact sources (licensing and secondary data) |

### 3.3 What each source is the record for

| Fact | Best source, then fallbacks |
|---|---|
| Equity round amount (US) | Company release → Form D (corroboration) → lead investor release → press |
| Equity round amount (UK) | Company release → Companies House SH01 → press |
| Grant / cost-share | USAspending / CORDIS / UKRI / Canada G&C → program page → company release |
| Public-market financing | SEC filings (S-1, 424B, 8-K) |
| Investor participation | Company release → investor release / portfolio page → press |
| Agreement (offtake, PPA) | Joint release from both parties → one party → press |
| Approach / technology | Company website → IAEA ARIS / NEA → press |
| HQ, founded, IDs | Registries (Companies House, SEC, SIREN) → Wikidata |

### 3.4 Collection policy, applied in code

- Use the official API or bulk file whenever one exists. Scrapling is for HTML that has no API.
- **Allowed Scrapling features:**
  - `Fetcher` / `FetcherSession` for HTTP
  - `DynamicFetcher` for JS-rendered newsrooms
  - Spiders (`SitemapSpider`, `XMLFeedSpider` for RSS, `CrawlSpider`), with `robots_txt_obey=True` and AutoThrottle
  - Checkpointed pause and resume
  - `page.markdown()` to produce LLM input
- **Not used:**
  - `StealthyFetcher`'s anti-bot and Cloudflare bypass
  - Fingerprint spoofing
  - Proxy rotation to evade blocks

  If a site blocks us or its ToS forbids automated access, the source becomes `access: manual`. A human saves the
  page through the "manual-upload" fetcher, which still archives it and hashes it. Evading a block would undermine
  the "auditable and legit" promise.
- User-Agent: `BarycenterBot/0.1 (+https://labs.mertia.xyz/barycenter/methodology; <contact>)`.
- Per-domain concurrency of 1 and AutoThrottle, plus a global daily request budget per source.
- No paywalled content, no logins, no Crunchbase, PitchBook, Dealroom or CB Insights. Their terms forbid
  scraping and republishing. Their data can't be verified by our users (it's behind a paywall), so it would
  break the evidence chain anyway. The only legitimate route is a **licensed data partnership** permitting
  public display. If we ever take one, its records enter as a separate tier with their own source card and the
  licensor's attribution. Never mixed in silently.
- Personal data: angels only when the investment is publicly announced by them or the company. No personal
  addresses, no Form D related persons. Removal requests are honoured, and logged as review decisions.

---

## 4. Fetch layer

### 4.1 Adapter interface

```python
class Source(Protocol):
    id: str                                   # matches docs/sources/<id>.yaml
    def discover(self, ctx) -> Iterable[Locator]: ...        # URLs, API queries, IDs to fetch
    def fetch(self, loc: Locator, ctx) -> Snapshot: ...      # via fetch/ (Scrapling or API client), archives it
    def extract(self, snap: Snapshot, ctx) -> Iterable[Claim]: ...   # deterministic or LLM
```

- **Discovery is seeded by `seeds/universe.yaml`.** It lists companies (with websites, newsroom feeds and
  identifiers), investors (with portfolio URLs) and public funders (with program URLs). New entities found in
  claims go to review before they join the universe.
- **Fetch is idempotent.** If the same URL returns the same bytes, no new snapshot is made, only a `seen_at` entry.
  Changed bytes make a new snapshot, and the old one is kept. That gives us change history for free, for example a
  company quietly editing a release.
- **Archive writer:**
  - `raw/<sha[0:2]>/<sha>.{html,json,pdf}` plus one manifest line per fetch
  - Text normalisation (to match quotes against) is stored next to it
  - HTML sources are queued to Wayback Save Page Now, rate-limited, and the archive URL is written back
- **Storage:** local `pipeline/raw/` while developing, synced to private Vercel Blob (or R2) so a release's
  snapshots are retained indefinitely. The manifest is committed to git, the bytes are not.

### 4.2 Cadence before the database exists

Fetch runs are manual (`make fetch SOURCE=…`) or a weekly local run. Daily fetching waits for Postgres, as decided.

---

## 5. Extraction

### 5.1 Structured sources

These are EDGAR XML, USAspending JSON, CORDIS CSV, UKRI and Companies House. Each field is mapped by a versioned
parser, and the locator is the exact JSON pointer or XPath. Unit tests run against stored fixtures.

### 5.2 Prose sources

These are press releases and program pages. LLM extraction is guarded:

1. Input: `page.markdown()` of the snapshot, plus the target schema (event, participations, agreements).
2. Claude (temperature 0, JSON schema output) must return, **for every field**, a verbatim `quote` that supports it.
3. **Quote guard:** the quote must appear in the snapshot's normalised text (exact match after whitespace and
   Unicode normalisation). If it doesn't, the claim is rejected automatically. This blocks hallucinated facts.
4. **Number guard:** amounts and dates are re-parsed deterministically from the quote ("$863 million",
   "€130M", "1.2 milliard d'euros"). If the parse disagrees with the model's value, the claim goes to review flagged.
5. The model ID, prompt file hash and schema version are stored on every claim. Prompts live in
   `extract/prompts/` and are versioned in git.
6. Every LLM claim starts `pending`. Nothing reaches the site without passing review (§5.3) or an auto-accept rule
   we have validated on the gold set (§11).

### 5.3 Review (no database yet)

- `make review` opens a terminal queue. For each claim it shows the quote with surrounding context, the snapshot
  link and conflicting claims. Actions: accept / edit (records the corrected value and why) / reject / merge
  entities.
- Each decision is appended to `pipeline/review/decisions.jsonl` with reviewer and timestamp, and committed.
  **Git history is the audit log of every human judgement.**
- Later, with Postgres, the same decisions table moves to the database and the CLI becomes an admin page.

---

## 6. Resolution and reconciliation

### 6.1 Entity resolution

1. **Hard IDs first:** CIK, LEI, UEI, EU PIC, SIREN, Companies House number, Wikidata QID, and the website domain.
2. **Then fuzzy matching** on normalised name (strip Inc/Ltd/SAS/GmbH, "Ventures"/"Capital" kept) plus country,
   using rapidfuzz. Matches above the threshold are proposed and **always human-confirmed** the first time. The
   confirmed alias goes to `seeds/aliases.yaml`.
3. **Hierarchies:**
   - Fund vehicles roll up to the firm ("Lowercarbon Capital Fund II LP" → Lowercarbon Capital)
   - CVCs roll up to their parent (GV → Alphabet, with GV kept as the investor of record)
   - Subsidiaries roll up to the group (Rolls-Royce SMR → Rolls-Royce)
   - The UI can show either level

### 6.2 Funding-event dedup and fact rules

- **Same event** when: same company, same instrument family, amounts within 10% **or** one is a stated tranche of
  the other, and dates within 60 days. Candidates go to review the first time.
- **Form D** links to an event as evidence. It never creates an event on its own unless there's no announcement,
  in which case it becomes an "Unannounced raise (Form D)" event, clearly labelled.
- **Choosing the displayed value:** take the highest-tier source, then the most specific (exact number over
  "more than $X"), then the most recent revision. Any other value more than 2% away becomes a visible conflict.
- **Round groups** (B, B2, extensions): each tranche is its own event linked by `round_group`. Totals sum the
  events, never the group headline *and* the tranches.
- **Public money:** "raised" totals use `committed` by default and show `disbursed` next to it. Tooltips explain
  the difference.
- **Agreements** are never added to any money total.

### 6.3 Money normalisation

- Keep the original amount and currency.
- Convert to USD at the ECB/FRED rate on `announced_on`. The rate snapshot is evidence too.
- Optionally convert to constant USD (CPI, base year set in config) for time series.
- Ranges and "over $X" are stored as such (`amount_min`, `amount_qualifier`) and never rounded into exact numbers.

---

## 7. Validation: build fails on bad data

| Gate | Rule |
|---|---|
| Schema | Every record validates against `models.py` (pydantic). JSON Schema is exported for the site |
| Evidence | Every published fact has a chosen claim, and every claim has a snapshot with hash and `fetched_at` |
| Quote | Every prose claim's quote is still found in its snapshot text |
| Integrity | No orphan participations, agreements or events. Every slug is unique and stable (a renamed slug needs a redirect entry) |
| Money | Currency is ISO 4217, amounts > 0, sum of disclosed participations ≤ round amount, USD conversion present |
| Dates | announced_on ≤ closed_on ≤ release date, founded ≤ first round |
| Disclosure | No participation amount without a `disclosed` claim |
| Coverage (warn) | Fusion lifetime equity total within ±15% of FIA / Fusion Energy Base / The Fusion Report. Gold-set companies at 100% |
| Freshness (warn) | Sources not fetched within their cadence are listed in the release notes |
| Reproducibility | CI rebuilds the release from manifest + decisions, and checksums must match |

---

## 8. Publish

Each run produces a release `vYYYY.MM.DD`, committed under `site/public/data/<release>/` with a `latest` pointer:

```
index/companies.json        light rows for table, map, filters (id, name, sector, approach, country, lat/lon,
                            totals by instrument, last round date, investor count)
index/investors.json        light rows (id, type, country, portfolio count, total disclosed, sectors, approaches)
index/funders.json
entities/<id>.json          full detail for the side panel and entity page (events, participations, agreements)
graph/edges.json            investor↔company edges (sector, instrument, year), for the network view
evidence/<id>.json          facts → claims → sources for that entity (loaded only when the drawer opens)
sources.json                every snapshot cited: URL, publisher, date, wayback, sha256, method
search.json                 prebuilt MiniSearch index
exports/barycenter.csv | .parquet | evidence.csv
CHANGELOG.md                facts added, changed and removed vs the previous release, with reasons
checksums.sha256
```

- **Licence:** our compilation is CC BY 4.0. Government data stays public domain. Press quotes are short excerpts
  with attribution.
- The **methodology page** is generated from the source cards and gates, so it can't drift from the code.

### 8.1 Coverage disclosure (required on every release)

Barycenter is a best-effort compilation of public information, **not an exhaustive record**. This is stated, not
buried:

- **Site-wide footer:**
  > Compiled from public filings, government data and company announcements. Not exhaustive: undisclosed rounds and
  > amounts are missing. Data as of {release date}. Sources on every figure. [Methodology] · [Report an error]
- **Next to every total** (overview, company, investor, funder): "Disclosed amounts only. Actual totals may be
  higher."
- **Investor pages:** "Portfolio limited to publicly announced investments."
- **Methodology / About page:** a generated "Coverage and limitations" section per release:
  - Measured coverage vs FIA, Fusion Energy Base and The Fusion Report (our total, theirs, gap)
  - Gold-set result
  - Count of events with undisclosed amounts and of participations without amounts
  - Regions and instruments known to be thin (e.g. China, unannounced seed rounds outside the US)
  - Sources not refreshed within their cadence
- **Per entity:** "last checked {date}" and a "may be incomplete" marker when a company has fewer verified events
  than the benchmarks suggest.
- **Not advice:** "Not investment, legal or financial advice. Figures may contain errors; check the linked sources."
- **Corrections:** a "Report an error" link on every entity, through the mertia-labs contact flow. Corrections and
  removals are logged as review decisions and listed in the release CHANGELOG.
- **Downloads:** the same disclaimer in `README` of every export, plus the CC BY 4.0 licence and source attribution
  rules.
- Gate: the release build fails if the coverage section can't be generated (missing benchmark comparison or
  gold-set result).

---

## 9. Site

### 9.1 Stack

Matches Asterism:
- Next.js 16 App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, cmdk
- `basePath: "/barycenter"`, registered in mertia-labs `content.config.ts`, plain `<a>` links across zones

Additions:
- TanStack Table: Notion-like tables
- nuqs: URL state
- sigma + graphology: network view, reusing Asterism code
- d3-geo + topojson world map in SVG/canvas for v1. No tile provider, light, works offline. MapLibre only if zoom or
  street-level detail is ever needed
- MiniSearch
- Types generated from the pipeline's JSON Schema, so site and pipeline share one schema

### 9.2 Routes

```
/barycenter                         Explore: lens (companies|investors|funders) × sector (fusion|fission|all)
                                    × view (table|map|network|timeline), all in the URL
/barycenter/company/[slug]          full page (also opened as a side peek via intercepting route @peek)
/barycenter/investor/[slug]
/barycenter/funder/[slug]
/barycenter/overview                capital by year × sector × instrument; approach breakdown; top rounds
/barycenter/methodology             sources, rules, gates, known gaps (generated)
/barycenter/data                    releases, downloads, changelog, licence
```

All pages are prerendered from the release JSON, with no runtime server data. The evidence JSON loads lazily when
the drawer opens.

### 9.3 Interaction details

- **Side peek:**
  - **Company:** totals split by instrument, a round timeline with an agreements lane, investors with role and
    disclosed amount, "shares investors with", "investors in your approach who haven't invested yet", and
    co-investor intro paths.
  - **Investor:** portfolio, stage and approach mix, median disclosed check, first and last deal, co-investors.
  - **Funder:** programs, awards per company, committed vs disbursed.
- **Evidence drawer** on every value: source chips, quote, archived link, method, review status, and
  "Sources differ" when facts conflict.
- **Facets:**
  - Sector, approach, fuel, reactor type, value-chain role
  - Stage and licensing status, country
  - Instrument, investor type, year range
- **Performance budget:** app page JS < 300 kB gz, and sigma and the map are dynamically imported only on their
  views.
- **Accessibility:** the table is the accessible fallback for the map and network.

---

## 10. Testing

| Layer | Tests |
|---|---|
| Parsers | pytest on stored fixtures for each source (no network in CI) |
| LLM extraction | Gold-set evaluation: precision and recall per field, quote-guard rejection rate. Rerun on every prompt or model change, and fail if below threshold |
| Resolution | Labelled alias pairs, false-merge rate must be 0 on the gold set |
| Reconciliation | Table tests for dedup and tranche rules, using real tricky cases (CFS B2, Helion F, X-energy D + IPO) |
| Gates | Each gate has a failing fixture |
| Site | vitest for data utils. Playwright smoke and screenshots at 320 / 768 / 1024 / 1440 for both themes, keyboard navigation, axe |
| Release | Reproducibility check in CI |

---

## 11. Reconnaissance: what the agents do first

The goal is to survey what data actually exists before committing to the remaining build decisions. Agents write to
`docs/survey/` and save raw samples through the real archive writer, so even reconnaissance is traceable.

### R1. Universe census

Two agents, one for fusion and one for fission.
- List every company that has raised outside money, with name, website, country, approach / reactor type, value-chain
  role, newsroom URL or feed, and known identifiers (CIK, Companies House, SIREN…).
- Cross-check against FIA membership, IAEA ARIS, the NEA SMR Dashboard, Wikipedia lists and the benchmark sites.
- Output: `docs/survey/universe-{fusion,fission}.csv`, plus a note on where the lists disagree.
- Expected size: about 60 to 80 fusion companies and 120 to 200 fission companies, including fuel and enrichment.

### R2. Source probes

One agent per group of sources in §3.2.
- For each source:
  - Confirm access, auth, rate limits, robots.txt and ToS
  - Pull a sample for 5 to 10 known companies
  - Record which fields exist and how often they are filled
  - Record identifiers available and anything surprising
- Output: one filled `docs/sources/<id>.yaml` and `docs/survey/probes/<id>.md` per source, plus sample snapshots.

### R3. Gold set

Build ground truth by hand, with full evidence, for 20 companies:
- **Fusion:** CFS, Helion, TAE, Tokamak Energy, Proxima, Marvel, Zap, General Fusion, Pacific Fusion, Thea
- **Fission:** TerraPower, X-energy, Kairos, Oklo, newcleo, Last Energy, Radiant, Aalo, Valar Atomics, Deep Fission

For each, record every round, grant, loan and agreement. It becomes the test set for every source and for the LLM
extractor.

### R4. Investor landscape

- Take the top 40 investors by appearance in R3 and R1.
- Probe their portfolio pages (format, whether amounts appear, how they tag nuclear companies).
- Note the fund-vehicle names seen in Form Ds.

### R5. Public money landscape

Run USAspending queries for DOE NE, FES, ARPA-E and LPO recipients matched against the universe, plus CORDIS
Euratom, UKRI, Canada G&C and France 2030. Measure how much public money we can attribute to companies vs labs and
universities.

### Survey report

The deliverable is `docs/survey/REPORT.md`:
- **Coverage matrix:** company × source, showing which sources say anything about whom
- **Field availability matrix:** source × field
- Conflicts found across sources, and their typical size
- Estimated manual review effort per 100 events
- A recommendation for each open decision (§12)

### Running it

About 7 agents in parallel (R1 ×2, R2 ×3 groups, R4, R5). R3 is sequential and human-checked. They use Scrapling
under the policy in §3.4, and share the `fetch/` archive writer so every probe sample is a real snapshot.

---

## 12. Decisions deferred until after the survey

| # | Decision | What the survey must tell us |
|---|---|---|
| D1 | v1 universe cut-off (all companies vs those with ≥1 disclosed raise ≥ $1M) | Size of the long tail, evidence quality |
| D2 | Which sources go into v1 vs later | Coverage and effort per source |
| D3 | LLM auto-accept rules (e.g. a quote-guarded amount matching a Form D within 2%) | Gold-set precision |
| D4 | Include Chinese, Japanese and Korean companies in v1, and at what confidence | Availability of primary sources |
| D5 | Public money for labs and universities: excluded, or shown as context | R5 attribution share |
| D6 | Map: HQ only, or HQ plus sites (plants, test facilities) | Field availability of sites |
| D7 | Snapshot storage: Vercel Blob vs R2, and retention | Total raw volume from probes |
| D8 | Where public companies' market raises stop (IPO only, or all follow-ons and ATM programs) | Volume of SEC filings for Oklo, NuScale, NANO Nuclear, Centrus, X-energy |

---

## 13. Phases and gates

| Phase | Output | Gate to next |
|---|---|---|
| **R** Reconnaissance | Survey report, source cards, gold set | Decisions D1 to D8 taken |
| **P0** Pipeline skeleton | Models, archive writer, Scrapling fetch wrapper, 2 structured adapters (EDGAR, USAspending), review CLI, gates | Gold set re-derived with full evidence; gates green |
| **P1** Bulk seed | All v1 sources, LLM extractor, entity resolution, first release | Coverage gate within tolerance; gold set 100% |
| **W1** Site MVP | Explore (table) × lenses × sector, side peek, evidence drawer, methodology, data downloads, registered in mertia-labs | Playwright screenshots, a11y, budget |
| **W2** Map + network + timeline + overview | | |
| **DB** Postgres + daily fetch + admin review | | Later, as decided |
| **N** Notifications: RSS first, then digest | | Later |
