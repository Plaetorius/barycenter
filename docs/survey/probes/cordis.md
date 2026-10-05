# Probe: CORDIS (Horizon Europe incl. Euratom, H2020)

Date 2026-10-05. Card: `docs/sources/cordis.yaml`. Sample: `samples/cordis-he-nuclear-companies.csv`.

## Access
- Bulk zips, `;`-delimited UTF-8 CSV, no key: `https://cordis.europa.eu/data/cordis-HORIZONprojects-csv.zip` (36.9 MB, sha256 `1496a16ee797...`), `.../cordis-h2020projects-csv.zip` (52.7 MB, sha256 `d4a8e3645d0b...`). Catalogue entry: data.europa.eu (archived `6c25d8e78e6c`).
- Contents: `project.csv` (id, acronym, status, title, startDate, endDate, totalCost, ecMaxContribution, topics, fundingScheme, frameworkProgramme, objective...), `organization.csv` (projectID, organisationID = PIC, vatNumber, name, SME, activityType, country, nutsCode, role, ecContribution, netEcContribution, totalCost), `topics.csv`, `euroSciVoc.csv`, `legalBasis.csv`.
- `cordis-euratom-projects-csv.zip` is NOT a file (HTTP 200 but an HTML SPA shell, 35.9 KB). Euratom 2021-27 projects are inside the HORIZON file: 73 projects with `EURATOM` in fundingScheme/topic (e.g. `HORIZON-EURATOM-2023-NRT-01-03`).
- **robots.txt conflict:** `cordis.europa.eu/robots.txt` says `Disallow: /data/` for all agents, and the archive tool therefore refuses the zips. I downloaded each once with curl (UA BarycenterBot/0.1) for this probe only; they are NOT in `raw/`. The files are the officially advertised open-data distribution, but this needs an explicit human decision (options: treat bulk as permitted because it is the documented distribution; or fetch via the data.europa.eu distribution URL; or ask CORDIS). Project HTML pages (`/project/id/<id>`) are allowed and archived: Proxima `9168827704ef`, Marvel `f974b4306a5d`, Copenhagen Atomics `f7c28655c0c8`.
- Licence: believed CC BY 4.0 (not re-verified on the page; check before publishing).
- Cadence: HTTP `Last-Modified` 2026-09-22 for HE zip; inner file timestamps 2026-08-28. Treat as monthly.

## Field fill-rate (HE file, 145,909 organisation rows)
vatNumber 89.7%; ecContribution 83.0% (blank for associatedPartner and some third parties). H2020: ecContribution 95.6%, 179,028 rows.

## Identifiers
PIC (`organisationID`) is stable across projects and gives dedup for free (Thorizon Holding BV 889511632 in two projects). Same legal entity can have two PICs (Novatron Fusion Group AB: 887579101 and 880863306). VAT gives a join to SIREN for French firms (FR + 2 check digits + SIREN: Naarea FR78882949506 -> 882949506; Stellaria Design FR95952843282 -> 952843282). Name match produced one false positive (NEXTHORIZON, FR).

## Per-company results (Horizon Europe file; H2020 file had no target company)
| Company | Found | Detail (EC contribution to that participant, `disclosed`) |
|---|---|---|
| Proxima Fusion | yes | CSFPP (101188580), EIC Accelerator 2024-08-01 to 2026-07-31, coordinator, EUR 2,471,437.50. PIC 882895650 |
| Marvel Fusion | yes | CFE-NANO (101189082), EIC Accelerator 2024-10-01 to 2027-03-31, coordinator, EUR 2,489,221.49. PIC 881811287 |
| Focused Energy | yes | EUROPA (101257418) EIC Pathfinder, EUR 125,000, from 2026-04-01; 4U-PI (101290656) HORIZON-INFRA, EUR 252,117.50, from 2026-09-01. PIC 873145113 |
| Copenhagen Atomics | yes | Th-MSR (101248098), EIC Accelerator, EUR 2,499,999, from 2026-01-01, coordinator. PIC 892985687 |
| newcleo | yes | LESTO (101166337) EUR 99,975 from 2024-11-01; CONNECT-NM (101165375, Euratom COFUND, thirdParty) EUR 157,712.50 from 2024-10-01. PIC 880414390 |
| Thorizon | yes | MIMOSA (101061142) EUR 113,653.75 from 2022-06-01; ENDURANCE (101165896) associatedPartner, no EC contribution. PIC 889511632 |
| Naarea | partial | ENDURANCE associatedPartner, blank contribution. PIC 880866216 |
| Stellaria | partial | ENDURANCE associatedPartner, blank contribution. PIC 880177516 |
| Novatron Fusion Group (extra, SE) | yes | TauEB (101186012) EIC Pathfinder EUR 1,499,000 from 2024-11-01 |
| Gauss Fusion, Steady Energy, Jimmy, First Light, Tokamak Energy, Astral, General Fusion, Terrestrial, Moltex, ARC, Blue Capsule | no | not in HE or H2020 under those names (UK firms are not funded since Brexit; Gauss is an industry consortium GmbH; Steady/Jimmy did not appear) |

## Gaps and traps
- EIC Accelerator = grant (about EUR 2.5M) in CORDIS with `totalCost` 0 in project.csv; the equity part (EIC Fund) is invisible here. Proxima's "EUR 17.5M Accelerator award" (FusionXInvest, archived `a1346d7ce107`) = this grant + equity; do not add grants and equity as one number.
- `startDate` is not a payment date; no payment/disbursement data.
- EUROfusion (the Euratom fusion consortium) money is attributed to the consortium coordinator, not to member companies.

## Adapter sketch
`cordis` bulk fetcher -> download zip (resolve robots question) -> stream `organization.csv` joined to `project.csv` on projectID. Filter by PIC list from `universe.yaml` (seed from the table above; add new PICs via VAT/name review). Emit one `grant` claim per (project, PIC) with ecContribution, start/end, topic, scheme, `disclosed`. Entity resolution: PIC -> organisation, VAT -> SIREN/other registry. Cost: 1 file per refresh (~37 MB). Effort: 1 day.
