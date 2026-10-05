# USAspending vs DOE announcements: reconciliation (2026-10-05)

Purpose: list every place where a USAspending figure for DOE nuclear/fusion money differs from what DOE (or a filing) announced, with evidence, so we can decide how to display each. Written by the public-money ledger run (scope: Milestone, FIRE, INFUSE, GAIN, ARDP/Pilot/HALEU awardees not assigned to other agents). Evidence format: `<first 12 hex of snapshot sha256>` then the exact JSON/text fragment as it appears in `pipeline/raw/<sha[:2]>/<sha>.*` (every fragment below was machine-checked against the stored snapshot text). POST responses were archived with request body in `pipeline/raw/manifest.jsonl` (`method: POST`, `source_id: usaspending-post`; request bodies are also saved as `pipeline/raw/usaspending-post-requests/<response sha>.request.json`).

Summary table

| # | Item | DOE / filing says | USAspending says | Nature of gap | Suggested display |
|---|---|---|---|---|---|
| R1 | Milestone-Based Fusion Development, 8 awards | USD 46M obligated for the first 18 months | USD 173.3M cumulative obligation (sum of 8 awards) | Time: 46M = first tranche (June 2024); later modifications add 127M. Not a conflict. | Show obligations as a dated series; label 46M as 'initial tranche (DOE, Jan 2025)', 173.3M as 'obligated to date' |
| R2 | Kairos ARDP risk reduction (Hermes) | total award USD 629M, DOE share USD 303M over 7 years (2020 page) | USD 135.0M obligated, 126.9M outlaid | Ceiling over 7 years vs cumulative obligation | Show 303M as 'DOE share, announced ceiling', 135M as obligated; never sum |
| R3 | TerraPower ARDP Natrium | TerraPower LLC, USD 80M initial funding (2020) | recipient 'US SFR OWNER LLC', USD 1,696.9M obligated, cost share 2,016.8M | Recipient SPV name plus initial vs cumulative | Resolve SPV to TerraPower via alias table (already done in terrapower ledger); show obligated as the counted figure, 80M as history |
| R4 | Constellation Crane restart loan | SEC 8-K: USD 1.0B FFB commitment under DOE loan guarantee | USAspending loan value USD 3.0B (DELP0000204), obligation 0, subsidy cost 0 | Unexplained 3x gap | Display the 8-K figure (1.0B max principal); flag USAspending loan value as unreliable for this award |
| R5 | 'Honeywell' USD 187.5M under CFDA 81.121 | (DOE page not retrieved) | Award DENE0009553 is to SOLSTICE ADVANCED MATERIALS US, INC.: OTA to offset Metropolis Works litigation costs and raise output; the same USD 187.5M is attributed to 'HONEYWELL INTERNATIONAL INC' by the category endpoint | Recipient attribution differs by endpoint; purpose is not reactor development | Exclude from developer/fusion totals; classify as fuel-cycle (conversion) supply support; recipient = Solstice |
| R6 | X-energy ARDP Xe-100 | USD 80M initial funding (2020) | USD 921.7M obligated, cost share 1,231.5M | Initial vs cumulative | Same treatment as R3 |
| R7 | ARPA-E selection vs obligation | CFS BETHE selection USD 2.39M | DEAR0001259 USD 1,288,316.58 obligated | Selection amount vs obligation | Show obligation as the amount, selection as a note |
| R8 | Reactor Pilot Program | 'no federal money'; each company bears all costs | 10 OTAs recorded with USD 0.0 obligation | Consistent, but appears as awards | Agreement rows with no amount; never as USD 0 funding events |
| R9 | Default grant filter hides type 11 | (probe `usaspending.md` concluded Milestone and Kairos ARDP were absent) | present under award type 09/11 | Method | Fetchers must query the 'direct/other' groups too |
| R10 | Recipient name variants | one company | different names/UEIs per award | Aliasing | UEI + alias table (list below) |
| R11 | LPO conditional commitments | (DOE announcement not retrieved) | SHINE DELP0000207 'Loan Value' USD 262.9M with description 'conditional commitment' | Loan face value is not funding, and a conditional commitment is not a closed loan | Do not count until closing; show as 'conditional commitment' |

## R1. Milestone-Based Fusion Development Program: USD 46M (DOE) vs USD 173.3M (USAspending)

DOE (press release 2025-01-16, FES): `69b6dcec82c9` `Initially, $46 million has been obligated for the first 18 months of the program.`; also `69b6dcec82c9` `compared to the $46 million of federal funding initially committed for negotiated milestones`; programme authorisation `69b6dcec82c9` `The program is authorized for a total of $415 million through fiscal year 2027`

USAspending: eight type-11 awards ('OTHER REIMBURSABLE, CONTINGENT, INTANGIBLE, OR INDIRECT FINANCIAL ASSISTANCE', CFDA 81.049). Per-award detail (GET `/api/v2/awards/ASST_NON_<FAIN>_089/`) and transaction history (POST `/api/v2/transactions/`):

| Recipient (as recorded) | FAIN | Detail sha + `total_obligation` | Transactions sha | Obligations by action date (USD M) | Sum |
|---|---|---|---|---|---|
| COMMONWEALTH FUSION SYSTEMS LLC | DESC0024885 | `a8ebe2db8e78` `"total_obligation": 48085000.0` | `10a58289aad4` | 2024-06-03 15; 2025-01-13 4.5; 2026-07-13 13.585; 2026-09-21 15 | 48.085 |
| XCIMER ENERGY, INC. | DESC0024890 | `075ca71d72c8` `"total_obligation": 39500000.0` | `2b2e1b4169b7` | 2024-06-04 9; 2025-01-10 4.5; 2026-09-17 26 | 39.500 |
| TYPE ONE ENERGY GROUP, INC. | DESC0024888 | `dc31ac295157` `"total_obligation": 26725000.0` | `eedb132e9fe8` | 2024-06-05 5; 2025-01-14 4.5; 2026-09-25 17.225 | 26.725 |
| ZAP ENERGY INC | DESC0024886 | `24dba8871162` `"total_obligation": 17800000.0` | `49223fe51273` | 2024-06-03 5; 2025-01-14 4.5; 2026-06-01 8.3 | 17.800 |
| THEA ENERGY, INC. | DESC0024881 | `5f5e0bf1f608` `"total_obligation": 13700000.0` | `f0b6ad1f2031` | 2024-06-03 3; 2025-01-10 4.5; 2026-06-09 6.2 | 13.700 |
| REALTA FUSION INC. | DESC0024887 | `68a662a61791` `"total_obligation": 12467500.0` | `20ea8b72ca37` | 2024-06-03 3; 2025-01-13 5.1; 2026-08-14 4.3675 | 12.467 |
| FOCUSED ENERGY INC | DESC0024883 | `348cb2f48957` `"total_obligation": 7500000.0` | `c4cda69ee21a` | 2024-06-03 3; 2025-01-15 4.5 | 7.500 |
| TOKAMAK ENERGY INC | DESC0024889 | `ec8269a289de` `"total_obligation": 7500000.0` | `7fb638947160` | 2024-06-04 3; 2025-01-13 4.5 | 7.500 |

Totals: first tranche (earliest transaction of each award, all dated 2024-06-03..05) = USD 46.0M, which equals DOE's USD 46M; cumulative `total_obligation` of the eight awards = USD 173.2775M (the 173.3M in `public-money.md`). Later modifications: January 2025 (+4.5M to 5.1M each, total +36.6M) and June to September 2026 (+90.7M, tracked in the series above). Outlays differ by endpoint and date: `total_account_outlay` in the 2026-10-05 detail snapshots (e.g. CFS `13600000.0`) is higher than the 9.7M recorded in the earlier sample, so outlays move and must be dated.
Evidence for outlays: `a8ebe2db8e78` `"total_account_outlay": 13600000.0`; award type: `a8ebe2db8e78` `"type_description": "OTHER REIMBURSABLE, CONTINGENT, INTANGIBLE, OR INDIRECT FINANCIAL ASSISTANCE"`

Finding: no contradiction. DOE's 46M is the first-18-month obligation; USAspending's `total_obligation` is the running total of obligations (not a ceiling: the authorised programme total is USD 415M through FY2027). The earlier note that Milestone awards are 'not present' in USAspending (probe `usaspending.md`) is wrong: they are present as type 11 (see R9).

Decision needed: show a per-company obligation timeline (date, amount) with the 46M initial figure as a DOE-announced annotation, rather than one number.

## R2. Kairos Power ARDP risk reduction: DOE share USD 303M vs USD 135.0M

DOE (ARDP risk-reduction announcement): `2c7fc612a074` `Total award value over seven years: $629 million (DOE share is $303 million)`; `2c7fc612a074` `Hermes Reduced-Scale Test Reactor - Kairos Power, LLC`

USAspending DENE0009325 (recipient `KAIROS POWER LLC`, UEI QLJ3HALQKFH4, CFDA 81.121, type 11): `fb21264a09bc` `"total_obligation": 135000000.0`; `fb21264a09bc` `"total_account_outlay": 126858000.0`; `fb21264a09bc` `"non_federal_funding": 0.0`; description `fb21264a09bc` `"description": "RISK REDUCTION AWARD UNDER DE-FOA-0002271 - TECHNOLOGY INVESTMENT AGREEMENT"`

Transactions `2b32f3bae5c6`: 2024-02-12 100M (mod None); 2025-04-09 15M (mod 0001); 2025-09-11 20M (mod 0002). Sum 135.0M.

Finding: 303M is DOE's announced share of a 7-year award value, stated on DOE's initial-funding page for the FY2020 risk-reduction awards; 135.0M is cumulative obligation to 2025-09-11 with period of performance to 2027-01-31. USAspending shows no cost share (`non_federal_funding` 0.0), so the 629M total cannot be reproduced from USAspending. The sibling probe's 'not found under Kairos' came from querying grant codes only (see R9); the Kairos search `f033ca72663e` returned only 500,000 DENE0008862.

Decision needed: show announced ceiling (303M DOE share, DOE page) and obligated-to-date (135M) as two labelled numbers; count only obligated in totals.

## R3. TerraPower: recipient 'US SFR OWNER LLC'

DOE (first ARDP awards page): `51c14e4204af` `DOE is awarding TerraPower LLC (Bellevue, Washington) and X-energy (Rockville, Maryland) $80 million each in initial funding`

USAspending DENE0009054: `f1b652900cf6` `"recipient_name": "US SFR OWNER LLC"`; `f1b652900cf6` `"recipient_uei": "HVKCEHKLJ921"`; `f1b652900cf6` `"parent_recipient_name": null`; `f1b652900cf6` `"total_obligation": 1696938130.8`; `f1b652900cf6` `"non_federal_funding": 2016788515.0`; `f1b652900cf6` `"total_funding": 3713726645.8`; `f1b652900cf6` `"total_account_outlay": 972362176.09`; recipient address `f1b652900cf6` `"address_line1": "15800 NORTHUP WAY"` (Bellevue, WA, TerraPower's headquarters per the verified terrapower ledger); FOA `f1b652900cf6` `DE-FOA-0002271`

Transactions `acfe682a4676`: 33 actions from 2021-05-03 (65.7M) to 2026-08-05 (+713.9M); sum 1696.9M (includes de-obligations).

Finding: USAspending never names TerraPower on the ARDP award. The link rests on the DOE page (TerraPower LLC is the ARDP awardee), the shared FOA and the Bellevue address; USAspending gives no parent and ownership of the SPV is unevidenced. Other TerraPower-named awards are small (DEAR0001612 ONWARDS 2.47M, DENE0008924 0.49M: `66f18a992af6`), and the ARPA-E ONWARDS selection of USD 8.55M is Cancelled (see arpa-e probe).

Decision needed: keep an alias table `US SFR OWNER LLC -> terrapower` (UEI HVKCEHKLJ921) with the evidence above, display recipient legal name in the evidence panel, and show 80M (2020 initial) only as a historical annotation.

## R4. Constellation Crane Clean Energy Center restart loan: USD 3.0B (USAspending) vs USD 1.0B (SEC 8-K)

SEC Form 8-K filed 2025-11-18 (https://www.sec.gov/Archives/edgar/data/1868275/000186827525000099/ceg-20251117.htm): `2440b6e7c39b` `pursuant to which FFB provided a $1.0 billion commitment to Constellation for the making of advances`; `2440b6e7c39b` `in a maximum principal amount not to exceed $1.0 billion`

USAspending DELP0000204 (search row `06cc237c8082`): `06cc237c8082` `"Loan Value": 3000000000.0`; `06cc237c8082` `"Recipient Name": "CONSTELLATION ENERGY GENERATION, LLC"`; `06cc237c8082` `"Base Obligation Date": "2025-11-17"`. Award detail `06eca15ed836`: `06eca15ed836` `"total_loan_value": 3000000000.0`; `06eca15ed836` `"total_obligation": 0.0`; `06eca15ed836` `"total_subsidy_cost": 0.0`; `06eca15ed836` `"description": "THE PURPOSE OF THIS DOCUMENT IS TO ISSUE LOAN EIR0043 TO CONSTELLATION ENERGY FOR THE CRANE ENERGY CENTER RESTART"`

Finding: the filing supports USD 1.0B (max principal, FFB multi-advance facility, 80% of eligible costs, no initial borrowing at closing). USAspending records 3.0B as 'Loan Value' with zero obligation and zero subsidy cost, which does not match the filing. Cause not determinable from our sources: DOE's own announcement was not retrieved (energy.gov URL guesses returned 404 and the web-search budget was exhausted), so the DOE figure is unverified here.

Decision needed: use the SEC-filed 1.0B for display (basis disclosed, primary filing); do not use USAspending `Loan Value` for LPO loans without a second source; show loans in their own lane, never added to grants.

## R5. 'Honeywell International USD 187.5M under CFDA 81.121' is Solstice Advanced Materials (Metropolis Works)

Category endpoint (`spending_by_category/recipient`, program 81.121, FY2026): `fdc1994e122c` `"amount":187500000.0,"recipient_id":"7633e6a7-b265-9555-210b-c3443cb6d529-C","name":"HONEYWELL INTERNATIONAL INC","code":"139691877","uei":"YBVGQEYENNM6"`

Award search (program 81.121, type 09/11, FY2026): `b6dab7ae5734` `"Award ID": "DENE0009553", "Recipient Name": "SOLSTICE ADVANCED MATERIALS US, INC.", "Recipient UEI": "QM3BY4Z27UK1", "Award Amount": 187500000.0`; description `b6dab7ae5734` `OTHER TRANSACTION AUTHORITY AWARD TO OFFSET LITIGATION COSTS ASSOCIATED WITH THE METROPOLIS WORKS FACILITY`

Award detail `92ca86fdab9a`: `92ca86fdab9a` `"total_obligation": 187500000.0`; `92ca86fdab9a` `"total_account_outlay": 60531120.43`; `92ca86fdab9a` `"recipient_name": "SOLSTICE ADVANCED MATERIALS US, INC."`
Transactions `d59a691474df`: `d59a691474df` `"action_date": "2025-10-14"`; `d59a691474df` `"federal_action_obligation": 187500000.0` (single obligation; later actions 0.0).

Finding: the money is a DOE Other Transaction (type 11, CFDA 81.121, FAIN DENE0009553) to offset litigation costs tied to the Metropolis Works facility and to increase its output (from general knowledge, not evidenced in our snapshots: Metropolis Works is the US uranium conversion plant, so this is fuel-cycle support, not a reactor or fusion developer award). The award-level recipient is Solstice Advanced Materials US, Inc. (UEI QM3BY4Z27UK1, no parent recorded); the transaction-level category roll-up attributes the same 187.5M to Honeywell International Inc (UEI YBVGQEYENNM6). The obligation action is dated 2025-10-14 (FY2026) although the award start is 2025-09-26. We did not retrieve a DOE announcement or a Solstice/Honeywell filing, so the relationship between the two entities is not evidenced here.

Decision needed: classify as fuel-cycle/conversion support with recipient Solstice (not in the census). In `public-money.md` the row sits in the 'other companies' bucket (`samples/doe-recipients-fy20-26.csv`: NE_81.121, HONEYWELL INTERNATIONAL INC, other company, 187500000.0), so developer totals are not affected, but the label 'Honeywell' there is the roll-up name, not the award recipient.

## R6. X-energy ARDP: USD 80M initial vs USD 921.7M obligated

DOE: `51c14e4204af` `X-energy (Rockville, Maryland) $80 million each in initial funding`. USAspending DENE0009040 `3df5bb439607`: `3df5bb439607` `"total_obligation": 921717024.0`; `3df5bb439607` `"non_federal_funding": 1231504986.5`; `3df5bb439607` `"recipient_name": "X ENERGY, LLC"`. Same logic as R3 (initial tranche in 2020 vs cumulative obligations through 2026). The X-energy ledger belongs to another agent; this item is here only so the display rule is common to R3, R2 and R6.

## R7. ARPA-E selection amount vs obligation (CFS BETHE)

ARPA-E project JSON (`541c9d053c1a`, offset 450 page): `541c9d053c1a` `"award":"2,390,000","release_date":"Nov 07 2019"`. USAspending DEAR0001259 (`6ce8debc63bc`): `6ce8debc63bc` `"Award ID": "DEAR0001259", "Recipient Name": "COMMONWEALTH FUSION SYSTEMS LLC", "Recipient UEI": "FLSJGUF7BGS1", "Award Amount": 1288316.58`

Finding: the ARPA-E record shows the selected award (2.39M) and USAspending the amount actually obligated (1,288,316.58); the project term and cost share are not structured in either. Same pattern: X-energy GEMINA 5.83M vs 5.25M, TerraPower ONWARDS 8.55M selection with status Cancelled (arpa-e probe). Decision: show obligated amount; keep selection as a note; show Cancelled projects as 'not funded'.

## R8. Reactor Pilot Program: 'no federal money' vs 10 OTAs in USAspending

DOE (selection page, 2025-08-12): `d92aed237e3d` `Each company will be responsible for all costs associated with designing, manufacturing, constructing, operating, and decommissioning their test reactors.`; list `d92aed237e3d` `Aalo Atomics Inc., Antares Nuclear Inc., Atomic Alchemy Inc., Deep Fission Inc., Last Energy Inc., Oklo Inc., Natura Resources LLC, Radiant Industries Inc. , Terrestrial Energy Inc., and Valar Atomics Inc.`

USAspending (search `b6dab7ae5734`, program 81.121, type 09/11, FY2026): ten OTAs, each `Award Amount` 0.0:

| Recipient (as recorded) | FAIN | Fragment |
|---|---|---|
| LAST ENERGY INC. | DENE0009556 | `"Award ID": "DENE0009556", "Recipient Name": "LAST ENERGY INC.", "Recipient UEI": "LKB2QEZLME33", "Award Amount": 0.0` |
| OKLO INC. | DENE0009589 | `"Award ID": "DENE0009589", "Recipient Name": "OKLO INC.", "Recipient UEI": "G44RGGAVDQL7", "Award Amount": 0.0` |
| ATOMIC ALCHEMY INC. | DENE0009582 | `"Award ID": "DENE0009582", "Recipient Name": "ATOMIC ALCHEMY INC.", "Recipient UEI": "C281BKQGA641", "Award Amount": 0.0` |
| NATURA RESOURCES LLC | DENE0009579 | `"Award ID": "DENE0009579", "Recipient Name": "NATURA RESOURCES LLC", "Recipient UEI": "MRBPTXG4KEX3", "Award Amount": 0.0` |
| STANDARD NUCLEAR, INC. | DENE0009581 | `"Award ID": "DENE0009581", "Recipient Name": "STANDARD NUCLEAR, INC.", "Recipient UEI": "NVU3DHHPYDL7", "Award Amount": 0.0` |
| TERRESTRIAL ENERGY, INC. | DENE0009580 | `"Award ID": "DENE0009580", "Recipient Name": "TERRESTRIAL ENERGY, INC.", "Recipient UEI": "DM7DVAJ16BV6", "Award Amount": 0.0` |
| DEEP FISSION, INC. | DENE0009578 | `"Award ID": "DENE0009578", "Recipient Name": "DEEP FISSION, INC.", "Recipient UEI": "W2M7GQSA9942", "Award Amount": 0.0` |
| VALAR ATOMICS INC. | DENE0009560 | `"Award ID": "DENE0009560", "Recipient Name": "VALAR ATOMICS INC.", "Recipient UEI": "WTMAF8SVNPR3", "Award Amount": 0.0` |
| ANTARES NUCLEAR, INC. | DENE0009558 | `"Award ID": "DENE0009558", "Recipient Name": "ANTARES NUCLEAR, INC.", "Recipient UEI": "GGZRXMT37SR5", "Award Amount": 0.0` |
| AALO HOLDINGS INC. | DENE0009557 | `"Award ID": "DENE0009557", "Recipient Name": "AALO HOLDINGS INC.", "Recipient UEI": "WHPZY8KVZBG5", "Award Amount": 0.0` |

Finding: consistent (zero obligation) but visible as 'awards'. DOE's page says 11 projects but names ten (Aalo, Antares, Atomic Alchemy, Deep Fission, Last Energy, Oklo, Natura, Radiant, Terrestrial, Valar). The USAspending list has nine of those ten (no Radiant OTA row in this FY2026 type-09/11 result) plus Standard Nuclear, whose OTA description is 'PILOT PROGRAM FOR ADVANCED NUCLEAR FUEL LINE CONSTRUCTION AND OPERATION' (a fuel-line pilot, not in DOE's reactor list). Decision: record as `gov_contract` agreements without value (done for Atomic Alchemy in `pipeline/ledger/atomic-alchemy.yaml` and in the Terrestrial supplement).

## R9. Award-type groups: type 11 is invisible to a grant-only query

`spending_by_award` accepts one award-type group per call. Same recipient name search, same DOE filter: for Focused Energy the grants group (02-05) returns no rows (snapshot `f97a4875f80b`, `f97a4875f80b` `"results": []`), whereas the direct group (09, 11) returns DESC0024883 (`75aa28810090` `"Award ID": "DESC0024883", "Recipient Name": "FOCUSED ENERGY INC", "Recipient UEI": "PNHZTNGJKA45", "Award Amount": 7500000.0`). For CFS the direct group returns `b831ca35fbb7` `"Award ID": "DESC0024885", "Recipient Name": "COMMONWEALTH FUSION SYSTEMS LLC", "Recipient UEI": "FLSJGUF7BGS1", "Award Amount": 48085000.0`. The probe `usaspending.md` queried 02-05 only and concluded the Milestone and Kairos ARDP awards were absent; `public-money.md` section 1 corrects that. Decision: the fetcher must loop all five groups (grants 02-05, other 06/10, direct 09/11, loans 07/08, contracts A-D).

## R10. Recipient name variants (same firm, different recipient strings or UEIs)

| Firm | Recorded recipient names (FAIN, UEI) | Evidence |
|---|---|---|
| Tokamak Energy | TOKAMAK ENERGY INC (DESC0024889, Milestone) vs TOKAMAK ENERGY LTD (DESC0025884, LEAPS grant USD 7.25M obligated) | `3c313a7b2ff3` `"Award ID": "DESC0024889", "Recipient Name": "TOKAMAK ENERGY INC", "Recipient UEI": "N581GZDDDZE7"`; `8e67e6021891` `"Award ID": "DESC0025884", "Recipient Name": "TOKAMAK ENERGY LTD", "Recipient UEI": "FGFEE2NNBRZ6"` |
| Terrestrial Energy | TERRESTRIAL ENERGY, INC. (DENE0009580, pilot OTA) vs TERRESTRIAL ENERGY USA, INC. (DENE0009445 etc.) | `ddb3decd4034` `"Award ID": "DENE0009580", "Recipient Name": "TERRESTRIAL ENERGY, INC.", "Recipient UEI": "DM7DVAJ16BV6"`; `fbd4eb67da73` `"Award ID": "DENE0009445", "Recipient Name": "TERRESTRIAL ENERGY USA, INC.", "Recipient UEI": "GJKZMH1MMWT7"` |
| TerraPower | US SFR OWNER LLC (ARDP) vs TERRAPOWER LLC (ONWARDS/US Industry Opportunities) | see R3 and probe sha `66f18a992af6` |
| X-energy | X ENERGY, LLC (ARDP) vs X-energy LLC variants in older awards | see R6 |
| Honeywell / Solstice | HONEYWELL INTERNATIONAL INC (category roll-up) vs SOLSTICE ADVANCED MATERIALS US, INC. (award) | see R5 |
| Holtec | HOLTEC GOVERNMENT SERVICES LLC (ARDP SMR-160, DENE0009055) vs HOLTEC PALISADES LLC (loan DELP0000153) | `b8011cfb946e`; `496e1c34660b` |
| Aalo | AALO HOLDINGS INC. (pilot OTA DENE0009557) vs Aalo Atomics (company name) | see R8 |
| Centrus | CENTRUS ENERGY CORP. vs AMERICAN CENTRIFUGE OPERATING, LLC (subsidiary; HALEU task orders) | `2f408ba8ae77` |

Decision: a UEI + alias table in `registry`, with the legal-name string preserved on each evidence item (our ledgers already store `Recipient Name` in the quote).

## R11. LPO 'Loan Value' includes conditional commitments (SHINE)

USAspending loans search `60adfb9a17a0`: `60adfb9a17a0` `"Award ID": "DELP0000207", "Recipient Name": "SHINE TECHNOLOGIES, LLC", "Recipient UEI": "ULJNHSVK5AP8", "Loan Value": 262881867.11`; description `60adfb9a17a0` `THE PURPOSE OF THIS ACTION IS TO ISSUE A CONDITIONAL COMMITMENT FOR LO`. Base obligation date 2026-04-03. We did not retrieve DOE's announcement. Decision: a conditional commitment is not a closed loan; display only as 'conditional commitment' and keep it out of totals (the SHINE ledger records it as a `debt` event whose round label says 'conditional commitment, not a closed loan'; the display layer should key off that).

## What was NOT reconciled (open)

- Holtec Palisades loan: USAspending Loan Value 1,450,241,177 (DELP0000153, subsidy cost 18,058,475.02 per probe sha `cef3331431b5`); the archived DOE record-of-decision page (`1739f378a255`) states no amount, so there is no DOE figure to compare. Georgia Power Vogtle (22.4B) not checked.
- Kairos DOE-share 303M and Milestone 415M authorisation are the only DOE-announced ceilings we have; DOE has not published per-company Milestone amounts, so per-company numbers can only come from USAspending.
- Several existing ledgers (Centrus, Curio, General Matter, GLE, Holtec, LIS, NuScale, Terrestrial, USNC, Moltex, Marathon) lack some USAspending DOE awards by FAIN; ledger-formatted supplements are in `docs/survey/usaspending-supplements/` (validated with `barycenter.ledger check`), not merged.
- Searches were restricted to recipient-name text matches with DOE as awarding agency; foreign-HQ census companies were searched with grant and direct groups only. Awards under unmatched recipient names (SPVs, universities acting for a company) would be missed. FIRE awards go to labs/universities, not companies (DOE page `69b6dcec82c9`), so they produce no company ledger rows.
