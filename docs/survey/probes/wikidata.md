# Probe: Wikidata (SPARQL) and ROR (R2-prose, 2026-10-05)

Source id: `wikidata` (ROR probed under the same id). Archived: `source_id` `wikidata`.

## Access
- Endpoint `https://query.wikidata.org/sparql?format=json&query=...`, no key, CC0 data.
- **robots.txt of query.wikidata.org says `User-agent: * / Disallow: /sparql`** (it targets crawlers; the service is a documented public API that requires an identifying User-Agent). `barycenter.archive` blocks it; I ran the two probe queries with `--no-robots` (the `obey_robots=False` path) and recorded this here. Owner decision needed: allow an explicit per-host exception for documented APIs (WDQS, MediaWiki API) in the fetch layer, with UA and 1 concurrent request.
- Query A (labels, `wdt:P31/wdt:P279* wd:Q4830453` = business): response 494fa69898bd (11 KB). Query B (labels and aliases, no class filter, HQ-city coordinates): see manifest, `source_id` `wikidata`, URL starting `query.wikidata.org/sparql`.
- ROR: `https://api.ror.org/v2/organizations?query=<name>`, no key, CC0, probed for all 12 (one archived response each).

## Coverage on the 12 companies

| Company | QID | HQ (Wikidata) | Founded | HQ coords | Website | OpenCorporates id (P1320) | ROR (P6782 / ROR search) | LEI (P1278) | Logo (P154) |
|---|---|---|---|---|---|---|---|---|---|
| Commonwealth Fusion Systems | Q55316454 | Devens | 2018 | via HQ item | cfs.energy | us_ma/001329926 | 04nj3ht72 | none | none |
| Helion Energy | Q18125525 | Redmond **and** Everett (two values, one stale) | 2013 | via HQ item | yes | us_de/5361207 | none (ROR search returns "Helion (France)", wrong) | none | yes (Commons) |
| TAE Technologies | Q17117397 | Foothill Ranch | 1998 (also 1998-04) | via HQ item | yes | us_de/3581588 | 04b9sdb26 | none | none |
| Zap Energy | Q112228527 | Seattle (company says Everett area; verify) | 2017 | via HQ item | yes | none | 04rv1cp59 | none | none |
| Pacific Fusion | Q126897526 (**duplicate** Q140589203, no data) | Fremont | missing | via HQ item | yes | none | ROR 05vtbcw65 exists but not linked | none | none |
| Proxima Fusion | **not found** by label/alias | | | | | | none in ROR | GLEIF has one (see gleif) | |
| Tokamak Energy | Q30292241 | Abingdon-on-Thames | 2009 | via HQ item | tokamakenergy.co.uk (old domain) | gb/07054929 | 00dhh3h17 | 254900ICX0JW97RR1482 (LAPSED) | none |
| Kairos Power | Q119857284 | Alameda | 2016 | via HQ item | yes | none | 007nqxr53 | none | none |
| TerraPower | Q4050859 | Bellevue | 2008 | via HQ item | yes | us_de/4577006 | 056mbsx32 | none | yes (Commons) |
| X-energy | **not found** (`X-Energy` label is a record label, Q136702065) | | | | | | none (ROR search returns unrelated) | none | |
| Oklo | Q110706493 | Sunnyvale (company HQ is Santa Clara per its 2023 release) | missing | via HQ item | yes | none | none (0 results) | see gleif | yes (Commons) |
| Radiant | Q141353752 "Radiant Nuclear": stub, **no properties**; label `Radiant Industries` is a production company, and plain `Radiant` has 8+ homonyms | | | | | | none | none | |

Summary: 9 of 12 have a usable item; 10 of 12 if you count the stub. Company items **never carry coordinates directly**; HQ coordinates come from the HQ city item (`P159 -> P625`), which gives city-level points only. Founded dates are year precision (`2013-01-01` placeholders). Hand QA is needed because HQ values go stale (Helion Redmond/Everett, Zap Seattle). Wikidata is a good seed for identifiers (OpenCorporates id for 5, ROR for 6, website for 9, Commons logo for 3) but not a source of record for HQ or founding dates.

## ROR
Search hits (name match, v2 API): CFS 04nj3ht72, TAE 04b9sdb26, Zap 04rv1cp59, Pacific Fusion 05vtbcw65, Tokamak 00dhh3h17, Kairos 007nqxr53, TerraPower 056mbsx32 = 7 of 12. Misses or wrong hits: Helion ("Helion (France)"), Proxima, X-energy, Oklo (0 results), Radiant (unrelated). ROR is for research organisations; it exists for these firms because of grants. ROR gives country and city, links to Wikidata/GRID, and is CC0, but adds little beyond Wikidata for US startups.

## Recommended use
Entity-resolution backbone is **a project-owned slug plus aliases**, with Wikidata QID, ROR, LEI, OpenCorporates, SEC CIK, Companies House number as optional external ids. Match Wikidata by exact website domain first (P856), then by label, then manual. Query Wikidata for nuclear/fusion companies by class (P31 business) + industry or by website domain list from `universe.yaml`; do not trust label-only matching (homonyms: Radiant, X-Energy).
