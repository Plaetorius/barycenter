# Reconnaissance report and decisions (2026-10-05)

Seven agents surveyed the universe, sources, investors and public money. Detail lives in the files named below. This
page is the synthesis and the decisions it supports. **All numbers here are lower bounds from a first pass**; every
agent ran out of its 200-search budget before finishing its long tail.

## 1. What exists

| Area | Result | Files |
|---|---|---|
| Fusion universe | 108 entities (79 developers, 29 enabling tech). Only 28 have a lifetime funding figure. No single list is complete: Fusion Energy Base has 98 of 108, Wikipedia 62, 43 appear in only one list | `universe-fusion.*` |
| Fission universe | 153 entities. About 23 have a funding figure. 2025-26 listing wave covered (X-energy IPO Apr 2026, Deep Fission, newcleo, Terrestrial...). Enrichment and fuel tail incomplete | `universe-fission.*` |
| Investors | 339 investors, 606 investor-company links from 30 seed companies. 83% back exactly one company. Top 10 hold 11.5% of links | `investors.*`, `investor-edges.csv` |
| Per-investor amounts | **1.8%** of links (11 of 606) have an investor-specific amount | `investors.md` |
| Public money | 54 programmes, 65 funders. About 62% of nuclear-relevant DOE assistance FY20-26 ($6.29B) goes to companies, 17% universities, 12% General Atomics (DIII-D) | `public-money.md` |
| Sources probed | 31 source cards, all with access method, licence, fill-rate and gotchas | `docs/sources/*.yaml`, `probes/*` |

## 2. Source verdicts

| Tier | Source | Verdict |
|---|---|---|
| **Go (v1)** | SEC EDGAR (Form D, 424B, 8-K, S-1) | Best US source of private round size and date. No Form D for TerraPower, Kairos, TAE or the 2025 CFS/Helion rounds. Aalo's 16 Forms D are investor SPVs, not company rounds |
| **Go (v1)** | USAspending | Obligated, outlaid and cost-share. Misses some awards (recipient under a different legal name, e.g. TerraPower under "US SFR OWNER LLC"). Needs reconciling with DOE announcements |
| **Go (v1)** | Canada Grants & Contributions API | Best non-US public source: exact amounts and amendments (General Fusion CAD 74.3M) |
| **Go (v1)** | ARPA-E project JSON, SBIR bulk CSV | Usable. SBIR API is down, bulk CSV works |
| **Go (v1)** | CORDIS | Disclosed EC contributions and IDs (grants of 0.1 to 2.5M EUR). **Bulk zips are under a robots-disallowed path**: take them from the data.europa.eu mirror, not cordis.europa.eu/data |
| **Go (v1)** | Wikidata, GLEIF | Identity backbone. Coverage thin for private startups |
| **Go (v1)** | FX (ECB/Frankfurter), CPI (FRED) | Trivial |
| **Go with limits** | Company newsrooms | Primary announcements. **Terms forbid automated access at CFS, Helion, TAE, X-energy and Radiant; Oklo ambiguous.** See policy P2 |
| **Later** | UKRI, Companies House (needs free key), BODACC (use DILA bulk, not the robots-disallowed API), TED, NRC (403 on some pages), France 2030 (no per-company amounts), Förderkatalog (403) | Round timing or low yield |
| **Later** | Trade press, PR wires | Discovery and corroboration only. Business Wire blocks us |
| **No** | Crunchbase, PitchBook, Dealroom, OpenCorporates (paid key) | As decided |

## 3. Policies adopted after the survey

- **P1: robots.txt is enforced in code.** The archive tool now uses Protego (wildcard support); stdlib `robotparser` was
  silently letting SEC's `Disallow` through. Two agents used robots-disallowed endpoints during probing (BODACC API,
  CORDIS `/data/`, one SEC `cgi-bin` request, Wikidata SPARQL). **None of that data enters the dataset.** Probe notes
  stay as research only.
- **P2: ToS-forbidden newsrooms.** For CFS, Helion, TAE, X-energy, Radiant (and Oklo): do not fetch the origin
  programmatically. The evidence snapshot is the **Wayback Machine copy** of the release (archive.org's own terms
  allow research access at low rate), corroborated by at least one independent source (SEC filing for the listed
  ones, an investor release, or trade press). The page is still hashed and quoted.
- **P3: documented APIs with their own usage policy** (Wikidata SPARQL, Commons API) may skip robots.txt via
  `--api-policy "<reason>"`, which is logged in the manifest. Never for HTML crawling.
- **P4: personal data.** Form D related persons are ignored. Angels only when publicly named by the company or the
  person.
- **P5: probe leftovers.** The probe wrote one unarchived scratch helper for USAspending POSTs; production uses an
  archived POST wrapper that stores the request body alongside the response.

## 4. Decisions D1 to D8

| # | Decision | Reason from the survey |
|---|---|---|
| D1 | **Ship an entity only if it has at least one evidenced funding event** (equity, grant, loan, listing). The rest of the census is published as a count ("tracked, no verified funding yet") and as a downloadable candidate list, not as entities | 261 candidates but fewer than 60 have any funding figure; empty cards would look broken and invite wrong guesses |
| D2 | **v1 sources:** EDGAR, USAspending, Canada G&C, ARPA-E, SBIR bulk, CORDIS (mirror), company releases via P2, Wikidata/GLEIF, FX. Everything else is v2 | Section 2 |
| D3 | **No LLM auto-accept in v1.** Deterministic parser claims (EDGAR, USAspending, Canada G&C, ARPA-E, CORDIS) are auto-accepted. Release-derived claims require a second independent verification pass (separate agent re-reads snapshot and quote) before acceptance, plus a spot-check by a human. Auto-accept rules wait for a measured gold set | Release traps (edited in place, "up to", tranches) |
| D4 | **Asia (China, Japan, Korea): include listed developers; funding only where an English primary or reputable report exists, tagged `reported`.** Otherwise "undisclosed" | Primary data is non-English or absent |
| D5 | **Lab and university money is funder-page context only,** never in company "raised" totals | INL, PPPL and DIII-D money flows via M&O contracts, not attributable per programme |
| D6 | **Map = HQ only in v1.** Sites (plants, test facilities) are a later layer | Site data too sparse |
| D7 | **Snapshots:** bytes stay in gitignored `pipeline/raw/` (316 MB so far), manifest and Wayback URLs are committed, public users verify through Wayback and source URLs. Move bytes to private Blob/R2 when the DB phase starts | Keeps repo small; auditable without hosting third-party content |
| D8 | **Public companies:** record the IPO, registered offerings and ATM programs as separate events (instrument `ipo`, `follow_on`); do not model every share sale | Oklo's $1.0B ATM alone would swamp the ledger |

## 5. Schema additions from the probes

Adopted into `models.py`:
- `FundingEvent.amount_kind`: `new_money | cumulative | valuation_only`, so "has raised over $X to date" never becomes a round.
- `FundingEvent.supersedes`: an event id, for releases edited in place (Helion Series G went from $465M to $500M).
- `Participation.role` adds `lender`; investor entities carry `parent_id` for SPV roll-up (e.g. "GV Aalo Atomics SPV" → GV).
- `Organization.legal_names[]`: Canada stores `X|X`, TerraPower is "US SFR OWNER LLC" in USAspending, newcleo has three French entities.
- Investor type `asset_manager` added.

## 6. Known gaps (will be published as limitations)

- Private fusion/fission rounds without any registered filing or release remain unknown.
- Most investor-company amounts will read "undisclosed" (98% of links).
- Asia is thin. Sovereign funds appear as participants, never with amounts.
- Several US awards in USAspending disagree with DOE announcements (Kairos ARDP $135M vs $303M DOE share; Milestone fusion awards $173M vs $46M announced). These need reconciliation before display, and are shown as "sources differ" until then.

## 7. What happens next

1. **Ledger phase:** agents build the evidenced funding ledger for about 60 priority companies (the R3 gold set plus the next tier), each fact with a snapshot hash and a verbatim quote, then a separate agent verifies each ledger.
2. **Pipeline:** ledger loader, quote guard, entity resolution, FX, reconciliation, gates, release writer.
3. **Site MVP** on the release JSON.
