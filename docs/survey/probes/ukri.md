# Probe: UKRI Gateway to Research (Innovate UK, EPSRC, STFC)

Date 2026-10-05. Card `docs/sources/ukri.yaml`. Sample `samples/ukri-gtr-company-projects.csv`. Archived: org search `ac5acc63d248`, Tokamak projects `6193e848e80c`, fund `d11294ec7999`.

## Access
- REST `https://gtr.ukri.org/gtr/api/organisations?q=<name>&s=<n>`, `/organisations/<uuid>/projects`, `/projects/<uuid>`, `/funds/<uuid>`. Default XML; send `Accept: application/json`. No key. robots.txt = JSON 404. Used 0.4 s between calls with no throttling. Licence OGL v3 believed.
- Note: `rtk`/curl output filtering in this environment shows JSON as a schema; fetch to files.
- Project record: title, status, leadFunder, grantCategory, RCUK identifier, abstract, links LEAD_ORG / PARTICIPANT_ORG / FUND. Fund: `valuePounds.amount`, start, end.

## Results by company
| Company | GtR orgs | Findings |
|---|---|---|
| Tokamak Energy | 3 UUIDs (1FF55152..., 426319EE..., 83FFF426...) | 26 linked projects. Lead on 4 Innovate UK grants: GBP 25,000 (2011), GBP 100,000 (2011), GBP 250,000 (2012-14), GBP 987,707 (2018-09 to 2021-12). Partner on Innovate UK projects 2023-25 (project totals GBP 356,515 and 314,434; participant share not given). Many EPSRC university projects with Tokamak Energy as collaborator (no company money) |
| First Light Fusion | 3 UUIDs | 18 projects; Innovate UK GBP 5,000 (2015) as lead; EPSRC projects led by universities (e.g. GBP 6.14M IFE grant EP/X025373/1, project total) |
| Astral Systems | 1 ("Astral Systems") | STFC MicroNOVA GBP 790,900 (2021-12 to 2024-08) and EPSRC GBP 9.98M (start 2026-01-05) as participant; lead orgs not the company |
| Moltex Energy | 4 UUIDs | 6 projects; Innovate UK ICON GBP 66,518 (2017); rest EPSRC |
| Terrestrial Energy | 1 | EPSRC EP/V027239/1 GBP 1,284,484 (project total, partner) |
| newcleo, General Fusion, Rolls-Royce SMR (extra) | none / noisy | newcleo 0 hits; "General Fusion" returns unrelated orgs; Rolls-Royce UK SMR org exists |

## Fill and traps
- Fund value = whole project; participant share needs the participant-values endpoint (not tested). For collaborative projects do NOT credit the company with the project total.
- Organisation duplicates (3-4 UUIDs per company): resolve by name+address, store all.
- Recency: latest company rows are 2023-25; recent Innovate UK, ARIA, DESNZ and UKAEA awards are not in GtR. GtR does not carry Companies House numbers (not verified).

## Adapter sketch
Seed org UUIDs per company (manual review once). Weekly: `/organisations/<uuid>/projects` -> project -> fund; keep rows where company role = LEAD_ORG (full value) or PARTICIPANT with participant value. Claim type `grant`, source = UKRI, `disclosed`. ~30 requests per company. Effort 1 day.
