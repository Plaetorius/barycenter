# Probe: USAspending.gov (card: docs/sources/usaspending.yaml)

Probed 2026-10-05, ~70 calls. The archive CLI is GET-only, so POST searches were archived with a scratch helper that writes the same `raw/<sha>/` layout and manifest lines (extra fields `method: POST`, `request_body`). Recommend adding POST support (body hashed into the manifest key) to `barycenter.archive`.

## Access
| Item | Finding |
|---|---|
| Endpoint | `POST https://api.usaspending.gov/api/v2/search/spending_by_award/` (filters: keywords, recipient_search_text, award_ids, award_type_codes, agencies[{type,tier,name}], time_period; fields list; sort; page/limit up to 100; pagination via `page_metadata.hasNext`). `GET /api/v2/awards/{generated_internal_id}/` (detail). `POST /api/v2/transactions/` (modifications with action_date and federal_action_obligation). `GET /api/v2/awards/last_updated/`. |
| Auth / limits | none / unpublished; no 429 observed at 1 req/s. |
| Bulk | `https://files.usaspending.gov/award_data_archive/` (`199c8e03d91b`), `/api/v2/bulk_download/`, data dictionary `3d0f2e3a9522`. Search window floor is 2007-10-01 (API message), bulk goes back to FY2001. |
| Licence | US public domain. |
| Gotchas on API | `award_type_codes` must come from ONE group per call: grants 02-05; other-financial-assistance 06,10; direct 09,11; loans 07,08; contracts A-D; IDV_*. Mixing returns 422 listing the groups (`b7d5a8d96a5b`). Loans cannot sort by "Award Amount" (use "Loan Value", `2a20911efb92` shows valid fields). `generated_internal_id` format `ASST_NON_<FAIN>_<agency 3-digit>` e.g. `ASST_NON_DENE0009040_089`. |

## Obligated vs outlayed
Search rows carry `Award Amount` (total obligation) and `Total Outlays` (cumulative outlays from account data). Award detail adds `total_obligation`, `total_account_outlay`, `non_federal_funding` (recipient cost share), `total_funding`, `subaward_count`, `total_subaward_amount`, DEFC breakdown, CFDA info, `recipient` block with UEI, parent, business categories. Transactions list each modification (`modification_number`, `action_date`, obligation delta); last X-energy mods 2025-06-04, 2026-05-19, 2026-08-06 (non-financial, 0.0).

## Per-company results (keyword/recipient search, all assistance and contract groups)
| Company | Awards found (FAIN, recipient name as recorded) | Obligated USD | Outlayed USD | Period | Sample sha |
|---|---|---|---|---|---|
| Commonwealth Fusion Systems | DESC0021623 (project grant, HTS central solenoid) ; DEAR0001259 (ARPA-E BETHE coop. agr.) | 1,537,791 ; 1,288,316.58 | 1,537,791 ; 1,199,161.48 | 2021-03-01 to 2025-02-28 ; 2020-10-01 to 2023-08-30 | `3c14f267e1cd` |
| Helion Energy | DEAR0000563 (ARPA-E ALPHA, staged magnetic compression of FRC targets) | 3,971,263 | none reported | 2015-09-28 to 2018-09-29 | `2ad9b8707be8` |
| Zap Energy | DEAR0001010 (OPEN 2018) ; DEAR0001260 (BETHE) | 6,767,334 ; 999,189.16 | 4,092,066.87 ; 537,961.64 | 2019-07-30 to 2022-07-29 ; 2020-07-01 to 2023-06-30 | `b623232ae08b` |
| TAE Technologies | none (all groups, 0 rows) | - | - | - | `26041f24c850` |
| TerraPower | DEAR0001612 (ONWARDS, "TERRAPOWER LLC") 2,472,777.06 ; DENE0008924 (US Industry Opportunities) 492,137 ; **DENE0009054 under recipient "US SFR OWNER LLC" (ARDP Natrium): obligated 1,696,938,130.80, outlayed 972,362,176.09, cost share (`non_federal_funding`) 2,016,788,515, total_funding 3,713,726,645.80, period 2021-05-03 to 2028-03-31, UEI HVKCEHKLJ921, no subawards** | see left | | | `66f18a992af6`, `219c0a4d34d0`, detail `f1b652900cf6` |
| X-energy | **DENE0009040 (ARDP XE-100 demo): obligated 921,717,024, outlayed 581,350,171.29, non-federal funding 1,231,504,986.50, total funding 2,153,222,010.50, 3 subawards totalling 183,596,914.16, period 2021-02-02 to 2027-12-31, UEI G9VTBQMKSTQ8**; DENE0008472 25,499,999.98 (XE-100 2016); DENE0008745 18,617,645 (FOA 2018); DEAR0001292 5,251,693.96 (GEMINA); DENE0008931 2,968,323; DENE0009434 1,706,324 | | 581.35M for ARDP | | `8359cbc321ac`, detail `3df5bb439607`, transactions `e883e5eddcdb` |
| Kairos Power | DENE0008862 500,000 (outlays 0.0; 2020) ; DENE0008854 0.0 ; plus passthroughs to University of Wisconsin DEAR0001293 799,009. **ARDP Hermes award ($629M total, $303M DOE share per DOE page) not found under Kairos** | | | | `f033ca72663e` |
| Oklo | DEAR0001696 1,900,000 (ANL, outlays 1,463,901.69, 2023-02-16 to 2026-05-15); DEAR0001619 660,000 (585,556.09); DEAR0001606 140,000 (139,749.22); recipient recorded as "OKLO TECHNOLOGIES, INC." | 2,700,000 total | 2,189,207 | 2022-2026 | `b666e4d06f07` |
| Radiant Industries | DESC0022800 (STTR TRISO modelling) 1,348,048 (fully outlaid); Air Force contracts FA864923P0464 1,249,967 (2023-02-10 to 2024-11-08) and FA864921P1143 45,299; recipient "RADIANT INDUSTRIES, INCORPORATED", UEI EHLLKECCBTX8 (per SBIR) | | 1,348,048 | | `f70913f45b2f`, `fdde8207282a` |
| Aalo Atomics | none | - | - | - | `26041f24c850` |

Programme-level checks:
- ARDP keyword: 2 hits only (US SFR Owner, X-energy) (`219c0a4d34d0`). Other ARDP cooperative agreements visible by "reactor" search: Holtec DENE0009055 $104.1M, Southern Co (MCRE) DENE0009045 $64.4M, GE Vernova DENE0009047 $89.7M, Advanced Reactor Concepts DENE0009223 $20.2M, CFPP LLC (UAMPS NuScale) DENE0008935 $164.7M (`0163761d62b8`).
- **Milestone-Based Fusion Development awardees (CFS, Zap, Type One, Xcimer, Realta, Thea, Tokamak Energy, Focused) are not present**: Type One shows only a 2020 ARPA-E award and an INFUSE grant to Florida State; Realta, Thea: 0 hits; Xcimer shows DEAR0002030 ($3.57M, 2025-11-18, ARPA-E) only. DOE states $46M initially committed across 8 awardees (see doe-programs). Likely not reported as assistance (other-transaction style) or not yet published.
- FES recipients: General Atomics DIII-D DEFC0204ER54698 $1.25B obligated, U Rochester NIF/LLE, MIT: showing FES money flows mostly to labs/universities.
- LPO loans (type 07/08): top rows are non-nuclear; nuclear = HOLTEC PALISADES LLC DELP0000153 loan value 1,450,241,177, subsidy cost 18,058,475.02, 2024-07-31 (`cef3331431b5`); Georgia Power DELP0000206 $22.4B (Vogtle); a DOE press release on a Pennsylvania restart loan exists (energy.gov slug, not fetched). Kairos Power also shows an SBA loan 4181827109 ($3,304,100, 2020-04-13), apparently a pandemic loan, not DOE.
- HALEU keyword: 4 hits, all 2026 small fuel-transport cooperative agreements (Container Technologies DENE0009542 $2.998M, NAC DENE0009540 $1.67M ...).

## Fill rates (spending_by_award rows used, about 150)
Recipient name, FAIN, amount, start date: 100%. End date: about 85% (null for old FC02-style legacy awards). Total outlays: null on some old and some new awards (Helion DEAR0000563, many FC02-era). UEI: returned on every row where requested (not checked for completeness on legacy rows). Assistance listing: all assistance rows. Description: free text, sometimes shouts ("OLKO INC." typo). Awarding office detail (NE vs SC) not in search fields; inferred from FAIN prefix: DENE = Nuclear Energy, DESC = Science (FES/BES), DEAR = ARPA-E, DELP = LPO, DEFE = Fossil/CESER, DENA = NNSA.

## Gotchas
1. Recipient aliasing: same firm appears under LLC, "INC", holding or project SPV (US SFR OWNER LLC; CFPP LLC; "OKLO TECHNOLOGIES, INC."). Needs a UEI/alias table in `universe.yaml`.
2. Selection amount vs obligation vs ceiling: ARPA-E says CFS BETHE $2.39M, USAspending obligated $1.288M; X-energy GEMINA $5.83M vs $5.25M.
3. Obligation for multi-year ARDP is cumulative and revised by modification; time series need `transactions`.
4. Cost share only exposed in award detail (`non_federal_funding`), not search rows: one extra call per award.
5. Keyword search is full-text across descriptions: "Kairos" matched schools; "reactor" matches physics. Prefer `recipient_search_text` + UEI once known.
6. No Milestone, Kairos ARDP, eVinci rows: treat USAspending as incomplete for DOE other-transaction style agreements and corroborate with DOE pages.

## Adapter sketch
1. Resolve recipients to UEIs (seed from SBIR/ARPA-E/USAspending recipient lookups: `POST /api/v2/autocomplete/recipient/` unprobed) and store in `universe.yaml`.
2. Nightly per UEI: `spending_by_award` with all four assistance/contract/loan groups, awarding agency DOE, plus keyword set for ARDP-like programme words; for every award new or `Last Modified Date` changed, GET detail and page `transactions`.
3. Emit `Agreement(kind=grant|cost_share|loan)` with `obligated`, `outlayed`, `non_federal_funding`, period, FAIN, UEI, assistance listing; evidence = the archived POST body + response sha.
4. Backfill via bulk archive for pre-2007.
5. Effort: 3 days (incl. POST archiving, pagination, alias handling, tests).
