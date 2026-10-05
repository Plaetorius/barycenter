# Probe: GLEIF LEI API and OpenCorporates (R2-prose, 2026-10-05)

Source id: `gleif` (OpenCorporates probed under `wikidata`/this note). Archived under `source_id` `gleif`.

## GLEIF
- Endpoint: `https://api.gleif.org/api/v1/lei-records?filter[fulltext]=<name>` (also `filter[entity.legalName]=` which is exact-match, and `/fuzzycompletions`). No key, JSON:API. LEI data is CC0.
- Exact `legalName` filter returned nothing for "Helion Energy" because legal names carry suffixes; `fulltext` is the right filter but still name-based. Matching must verify jurisdiction and address.
- Coverage on the 12 (fulltext, 8 per page, 12 archived responses):

| Company | Result |
|---|---|
| Commonwealth Fusion Systems | **2 LEIs**: COMMONWEALTH FUSION SYSTEMS INC. `984500C9760BDCD78B38` (US, ISSUED) and COMMONWEALTH FUSION SYSTEMS LLC `549300O1LBRD36GKUG82` (US, ISSUED) |
| Proxima Fusion | Proxima Fusion GmbH `3912006JENIXRJ4ROT37` (DE, ISSUED) |
| Tokamak Energy | Tokamak Energy Ltd `254900ICX0JW97RR1482` (GB, **LAPSED**) |
| Oklo | OKLO INC. `529900WDIA7LYI9ILD14` (US, ISSUED); also OKLO RESOURCES LIMITED (AU, retired) and several leveraged ETFs named for OKLO (noise) |
| TerraPower | only TERRAPOWER GLOBAL ENERGY SL `5299000H1ST6OJ5LPW05` (ES): a Spanish entity, **not** the Bellevue parent |
| Helion, TAE, Zap, Pacific Fusion, Kairos, X-energy | none |
| Radiant | only unrelated Indian "Radiant Industries" records |

Result: usable parent-level LEIs for 3 of 12 (CFS, Proxima, Oklo), plus one lapsed (Tokamak). Private US startups rarely hold LEIs (they are mandatory only for regulated-market activity). GLEIF is useful for corporate group structure (Level 2 parent relationships) and for public/regulated entities, not as the resolution backbone. LEI status must be stored (a LAPSED LEI is not a current one). A search by name returns noise (ETFs, homonyms), so only attach an LEI after a jurisdiction + address check or when Wikidata P1278 or the filing agrees.

## OpenCorporates
- `https://api.opencorporates.com/v0.4/companies/search?q=helion+energy&jurisdiction_code=us_de` returned **HTTP 401 `Invalid Api Token`** (e76fc386dae8). An API token is required.
- Pricing page (7d2d9557d946): API-only plans from GBP 2,250/year (Essentials, 500 calls/month, 200/day) to GBP 12,000/year; bulk delivery is Enterprise. The page also states **free at-scale access for public-benefit projects** (journalism, NGOs, academia) by application. Licence text page `/info/licence` returned 404 under the path tried; the open-data licence (ODbL with share-alike and attribution) is from vendor background knowledge, **not verified in this probe**.
- robots.txt (ad18359ba750) disallows many paths for `*` and bans GPTBot entirely.
- Recommendation: do not depend on OpenCorporates. Use official registries directly (SEC EDGAR, Companies House, Delaware via Wikidata ids only as pointers). Wikidata P1320 gives OpenCorporates ids for 5 of 12 companies for free, which can be stored as an external link without calling the API. Apply for the public-benefit tier only if registry coverage proves insufficient, and keep its data out of the published CSVs until its licence is read.
