# Probe: UK Companies House

Date 2026-10-05. Card `docs/sources/companies-house.yaml`.

## Access
- REST API `https://api.company-information.service.gov.uk/` needs a free key (register at developer hub; HTTP Basic, key as username). Unauthenticated call returned `401 {"error":"Empty Authorization header"}` (verified). **No key was available in this environment, so no API payloads were sampled.** Limit: 600 requests per 5 minutes; ban without notice if exceeded (docs, archived `df7e1977a7b8`). Higher limits on request.
- Public HTML (`find-and-update.company-information.service.gov.uk/company/<no>/filing-history`) has no robots.txt (404) and was archived: Tokamak `baf2fbd1ec73`, First Light `9530ed187f34`, Astral Systems Ltd (shell) `531460bb33d0`, Astral Neutronics `10a1eb28712f`. Production use should go through the API (filing-history endpoint, `category=capital`, then Document API for the PDF).
- Bulk: Companies House publishes monthly BasicCompanyData and PSC snapshots at download.companieshouse.gov.uk (index page reachable, 200; file list not parsed here). Accounts as iXBRL only for filers who file digitally.
- Licence: OGL v3 (believed).

## What a share allotment looks like (verified on the public pages)
- Filing type `SH01`: "Statement of capital following an allotment of shares on <date>" with **aggregate nominal capital in GBP** (e.g. GBP 5,713.6875), PDF 3-4 pages. The page shows no amount raised. The PDF form lists number of shares and amount paid per share incl. premium: **amount raised = parse the PDF** (unverified here; needs the Document API, key). Allotments are tranches (investors close in several steps), not rounds.
- Second filings appear (`RP04SH01`, `RP01SH01`): Tokamak filed corrected statements Sep 2024 and again 2026-07-22; dedup on allotment date.
- `RESOLUTIONS` (RES10/RES11, adopt articles) bracket real rounds and are cheap round-timing signals.

## Per-company results
| Company | Entity | Observed |
|---|---|---|
| Tokamak Energy | TOKAMAK ENERGY LTD 07054929 | SH01 allotments (nominal capital GBP): 2025-07-23 5,713.6875; 2025-06-22 5,713.5156; 2024-12-20 5,664.6059; 2024-08-21 two (5,525.5165, 5,614.8022); 2020-08-11 3,331.1941; 2018-2019 several. Group accounts to 2024-12-31 filed 2025-09-19. Confirmation statement 2025-10-23. Resolutions 2026-07-27 (x2) after RP01SH01 2026-07-22. Page counts: 12 allotment lines on first page of results |
| First Light Fusion | FIRST LIGHT FUSION LIMITED 07555858 | Allotment 2026-04-17: SH01 filed 2026-05-22 (nominal 1,283.173) and 2026-07-09 x2 (nominal 1,664.214 on the later ones); charge MR01 registered 2025-03-04 and satisfied 2026-05-20; two directors appointed 2026-04-17; articles/resolutions 2026-06-04 |
| Astral Systems | **trading name of ASTRAL NEUTRONICS LTD 13376789** (inc. 2021-05-05, Bristol). The similarly named ASTRAL SYSTEMS LTD 07374982 (Haywards Heath, inc. 2010, micro-company, no SH01) is a different company | Allotments: 2025-05-12 (nominal 32.15614), 2026-04-08 (42.05193), 2026-04-14 (50.95805), 2026-06-25 (53.82602), 2026-07-06 (54.00356). Fits a round announced about June 2026; amount not derivable without PDFs |
| Moltex, Terrestrial, newcleo UK, Copenhagen Atomics UK | not looked up | |
| Non-UK companies | n/a | |

## Gaps
Nominal not money; PDF parsing; legal vs trading names (Astral); group structures (holding vs operating); some companies (Proxima Oxford, newcleo UK) are subsidiaries with no round info. PSC data shows >25% holders only, useful for founders/major investors, not VCs below threshold.

## Adapter sketch
`companies_house` fetcher: key in env, token bucket 1.5 req/s. For each company number in `universe.yaml`: `/company/<n>/filing-history?category=capital&items_per_page=100` -> list SH01 with `action_date`; fetch each document via Document API (PDF) and parse "number of shares / amount paid" with a small rule-based extractor (fallback: LLM extraction with human review). Emit `equity_allotment` claims (date, shares, price, implied GBP, `disclosed`) linked to the round event as evidence only. Also `/persons-with-significant-control` snapshots. Effort 3 days incl. PDF extraction; blocked until a key is provisioned.
