# Barycenter: plan and benchmark

The centre of mass of nuclear capital. Served at `labs.mertia.xyz/barycenter`.

How it is built (pipeline, fetchers, evidence model, reconnaissance): [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md).

Status: v1 built 2026-10-05, see `docs/STATUS.md`. Decisions in section 8.

## 1. What we're building

A free Mertia Labs tool that maps who funds nuclear energy, covering fission and fusion. It shows every company that
has raised money, everyone who funded it, how much, when and for what. It works in three lenses:

| Lens | Who is in it | Click one to see |
|---|---|---|
| **Companies** | Fusion and fission developers, fuel, enrichment, components, enabling tech | Every round, grant, loan and listing: who, how much, when, what for. Co-investors, offtakers, peers |
| **Investors** | VCs, corporates, family offices, angels (only when publicly disclosed), sovereign funds | Portfolio, check sizes, stages, technology bets, co-investor network |
| **Public funders** | Governments, agencies, programs (DOE, ARPA-E, UKAEA, France 2030, Euratom...) | Programs, awards per company, committed vs disbursed |

On top of the lens, a global **sector switch: Fusion / Fission / All** filters every view, total and graph.
Lens and sector are independent, both live in the URL.

The questions it should answer:

- *Founder:* "Who funds my technology at my stage? Which companies share investors with me, so I can ask for a warm intro?"
- *Investor:* "Who raised, when do they need money next, and who are my natural co-investors?"
- *Analyst / policy:* "How much capital went into stellarators vs FRCs, or into the US vs the EU, and how much was public money?"

### Fit with mertia-labs

mertia-labs is a hall of separate apps (Next.js multi-zones). This tool is **its own repo and Vercel project** with
`basePath: "/<slug>"`, registered in `TOOLS` in `content.config.ts`. It should copy the Asterism dashboard stack:
Next 16, React 19, Tailwind 4, shadcn, cmdk, plus sigma and graphology for the network view. Visitors will move
between the two, so the look should match.

## 2. Benchmark

| Product | Scope | Strengths | Gaps we can fill |
|---|---|---|---|
| [Fusion Energy Base](https://www.fusionenergybase.com/equity-funding) | Fusion only | Best fusion equity dataset, charts by year/company | No fission, weak investor-side view, no public-funding detail, no network |
| [FIA annual report](https://www.neimagazine.com/news/fusion-industry-attracts-record-annual-funding-of-4-48bn/) | Fusion, survey-based | The reference number ($4.48bn raised Jul 2025 to Jul 2026, $14.24bn since 2021) | Once a year, PDF, aggregate only, no deal-level data |
| [The Fusion Report](https://thefusionreport.substack.com/p/commercial-fusion-energy-funding) | Fusion | Half-yearly per-company totals ($11.52bn lifetime as of Jun 2026) | Newsletter format, not explorable |
| [Venture Atlas](https://www.ventureatlas.org/industry/nuclear-fission) | Generic VC, has nuclear page | Covers fission and fusion, deal flow | Generic, shallow nuclear taxonomy, no public money |
| [SMR Intel](https://smrintel.com/smr-companies-complete-list/) | SMR directory (66+ cos) | Good tech and licensing detail | Directory, not financing |
| [VCBacked](https://www.vcbacked.co/directory/industries/nuclear/page/2) | Recently funded startups | Founder contacts | Lead-gen list, no history or investors graph |
| Crunchbase / PitchBook / Dealroom | Everything | Depth, investor profiles | Paid, generic taxonomy, poor on grants and government. **Their ToS forbid scraping, so they can't be a source.** |
| IAEA ARIS, NEA SMR Dashboard | Reactor designs | Authoritative tech and licensing status | No money |
| [TechCrunch $100M+ list](https://techcrunch.com/2026/08/15/every-fusion-startup-that-has-raised-over-100m/) | Top fusion raises | Up to date | An article |

**Where we stand out:** nobody combines (a) fission and fusion, (b) equity, grants, debt and public markets in one
ledger, (c) an investor-centric and government-centric view, (d) a co-investor / warm-intro graph, and (e) a source
link on every number. And it's free.

## 3. CFO view: what to record and how to count it

Most trackers get this wrong. Rules to bake in:

1. **Split capital by instrument and never add them up blindly.**
   - Equity (priced rounds, SAFEs/convertibles)
   - Non-dilutive public money: grants, cost-share and milestone awards, vouchers (GAIN, INFUSE)
   - Debt: DOE LPO, EIB, venture debt
   - Public markets: IPO, SPAC/de-SPAC, follow-ons (Oklo, NuScale, NANO Nuclear, X-energy IPO Apr 2026)
   - **Agreements (in v1):** offtake and PPAs (Helion and Microsoft, Kairos and Google, CFS and Google...), site
     deals, fuel supply, early government contracts. These are **signals, not funding**: they get their own layer,
     their own timeline lane and are never counted in "raised". For a fusion or fission company, a credible
     offtaker is often a stronger signal than the round size.
2. **Commitment vs disbursement.** Government awards are often multi-year cost-share. ARDP and the Milestone-Based
   Fusion Development Program are examples. Store `committed`, `obligated` and `disbursed` separately.
   USAspending already distinguishes them.
3. **Tranches and extensions.** CFS's B2 and milestone-tranched rounds need a `round_group` so nothing is counted twice.
4. **Per-investor amounts are rarely disclosed.** Never invent an allocation. Show "participated, amount undisclosed".
   An even-split estimate can be an opt-in toggle, clearly labelled as an estimate.
5. **Confidence on every number:** `disclosed` (company or filing), `reported` (press), `estimated` (us).
   Each number gets a source URL and an as-of date.
6. **Currency:** store the original currency and amount, and convert to USD at the deal-date rate (ECB/FRED).
   Show the original on hover. Convert to constant dollars for long time series.
7. **Valuation** only when disclosed. It's a useful signal for investors, but optional.
8. **Fields that make a company card useful:**
   - Technology and confinement or reactor type, value-chain role
   - Stage: TRL or licensing status (NRC pre-application, construction permit...), target first-power date
   - HQ and sites, headcount band, founders, last round date, months since last raise

### Taxonomy (v1)

- **Fusion approach (first-class facet: filter, colour on map and graph, breakdown on overview):**
  - Magnetic: tokamak, spherical tokamak, stellarator, mirror, FRC
  - Inertial: laser ICF, pulsed power / z-pinch, sheared-flow z-pinch, projectile / impact
  - Magneto-inertial: magnetized target, plasma jet
  - Other / undisclosed
  - Enabling (not an approach, a value-chain role): HTS magnets, lasers, tritium and fuel cycle, materials, diagnostics
  - Fuel: D-T, D-He3, p-B11 (secondary facet; it changes the investor story a lot)
- **Fission:**
  - Large LWR, LWR SMR, HTGR, MSR, SFR, LFR, microreactor
  - Fuel: HALEU, TRISO, enrichment, deconversion
  - Back end: recycling, waste/SNF
  - Isotopes, components, services, space/naval

## 4. Data engineering view

### Model (relational, provenance-first)

```
Organization(id, kind: company|investor|public_funder|person, name, aliases[], country, hq_geo, website, parent_id)
Company(org_id, sector: fusion|fission, technology, value_chain_role, stage, licensing_status, founded, status)
Investor(org_id, type: vc|cvc|corporate|family_office|sovereign|angel|accelerator|bank|dfi)
PublicFunder(org_id, country, level: national|supranational|regional)
Program(id, funder_id, name, instrument)            # e.g. DOE Milestone Program, France 2030 "Réacteurs innovants"
FundingEvent(id, company_id, type: equity|grant|debt|ipo|spac|other, round_label, round_group,
             announced_on, closed_on, amount_orig, currency, amount_usd, committed/obligated/disbursed,
             valuation_post?, use_of_proceeds, program_id?, confidence)
Participation(event_id, org_id, is_lead, amount_usd?, confidence)
Agreement(id, company_id, counterparty_id, type: offtake|ppa|fuel_supply|site|gov_contract|partnership,
          announced_on, capacity_mw?, value_usd?, binding: loi|mou|definitive, notes)
Source(id, url, publisher, published_on, archived_url)  -- many-to-many with every fact
```

### Sources and ingestion (all legally usable)

| Source | Gives | How |
|---|---|---|
| Hand-curated seed (FIA member list, press releases, company sites) | The first ~150 companies | Manual + LLM extraction, human review |
| **SEC EDGAR Form D** | US private raises, often unannounced | Free API, match on company CIK |
| **USAspending.gov API** | Every DOE/ARPA-E award, obligated vs outlaid | Free API |
| SBIR.gov, ARPA-E, GAIN/INFUSE vouchers | Small non-dilutive awards | Scrape public lists |
| EU CORDIS (Euratom, Horizon), EIC Fund | EU grants and EIC equity | Open data dumps |
| UKRI Gateway to Research, Companies House (SH01 allotments) | UK grants, share issues | Free APIs |
| France 2030 / Bpifrance laureates | French programs (newcleo, Jimmy, Naarea, Stellaria, Renaissance...) | Press, manual |
| News / RSS (company newsrooms, ANS, NEI, World Nuclear News) | New rounds | Daily crawl, LLM extracts a draft, human approves |

The pipeline is in Python, like public-money and fusion-corpus. It does fetch, normalize, **entity resolution**
(GV vs Google Ventures, BEV vs Breakthrough Energy Ventures), FX, and validate. It ends with
**build fails on bad data**: sums match, no orphan participations, every amount has a source, and totals reconcile
to within X% of FIA and Fusion Energy Base.

### Storage

- **v1: static JSON built at deploy time.** A few thousand rows, same pattern as the Asterism map data. It's fast,
  cheap and cacheable.
- **v2: Postgres** (Neon via Vercel Marketplace), only once we add corrections from users, auth or alerts.

## 5. Product and UX

Notion-like here means **database views over the same records, plus page previews**:

- **Lens switcher:** Companies / Investors / Public funders (segmented control, URL state).
- **Views:**
  - **Table:** TanStack Table with filter, sort, group-by and column picker, Notion style.
  - **Map:** world map (MapLibre), a dot per HQ sized by capital raised, arcs from investor to company when one is
    selected.
  - **Network:** bipartite investor-company graph (sigma, reused from Asterism). Co-investor clusters show up.
  - **Timeline:** rounds over time per technology.
- **Side peek panel** (click any row, dot or node):
  - **Company:** totals split equity/grant/debt/public, a round-by-round timeline (who, how much, lead, source),
    public awards, offtakers, "companies sharing your investors", similar companies.
  - **Investor:** portfolio with amounts and dates, stage and technology mix, median check, first and last deal,
    top co-investors.
  - **Public funder:** programs, awards per company, committed vs disbursed.
- **"Who can help me":** for a selected company, list the investors in the same technology or stage who haven't
  invested yet, and the shortest co-investor path to them (the warm intro).
- **Overview page:** capital by year × sector × instrument, a Sankey of investor type → technology, top rounds.
- Cmd-K search across everything. Every number links to its source. CSV export.

## 6. Phasing

| Phase | Ships | Rough size |
|---|---|---|
| **0. Data foundation** | Schema, taxonomy, validation, seed of ~60 companies (30 fusion + 30 fission) with sourced rounds | 1 to 2 weeks |
| **1. List MVP** | Lens switcher, tables, side peek, search, register in mertia-labs | 1 week |
| **2. Map + network** | World map, investor-company graph, co-investor view | 1 week |
| **3. Database + automated ingestion** | Postgres, then EDGAR Form D, USAspending, CORDIS, news extraction with an in-app review queue | 2 to 3 weeks |
| **4. Insights** | Overview dashboards, warm-intro paths, "submit a correction", alerts on new rounds | later |

The data is the moat; the UI is the easy part. Phase 0 quality decides everything after it.

## 7. Risks

- **Accuracy and reputation.** A wrong amount next to a real company's name is the main risk. Mitigations: sources on
  everything, confidence labels, and a corrections channel.
- **Licensing.** Use no Crunchbase, PitchBook or Dealroom data. Only public filings, government open data and
  press releases.
- **Personal data.** Include angels only when they publicly announced the investment. Keep a person record minimal
  (name and public role) and honour removal requests (GDPR).
- **Staleness.** Show "data as of" everywhere, and run ingestion on a cron.

## 8. Decisions

| # | Decision |
|---|---|
| 1 | Name: **Barycenter**, slug `barycenter` |
| 2 | Sector switch Fusion / Fission / All, orthogonal to the three lenses. Both sectors in v1 |
| 3 | v1 instruments: equity + public money + debt + public markets. Agreements (offtake, PPA, early contracts) as a separate, never-summed layer |
| 4 | Per-investor amounts: disclosed only. No estimates |
| 5 | Storage: static JSON built at deploy time |
| 6 | Fusion approach is a first-class facet in v1 |
| 7 | Daily fetch only once we have a database. Notifications later. See `docs/internal/` |
| 8 | Barycenter is about capital. A nuclear-grade supplier directory is a separate future tool sharing the organization registry (see `docs/internal/ideas.md`) |
