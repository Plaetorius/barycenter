# Public money for nuclear (fusion + fission): landscape and attribution (R5)

Date 2026-10-05. Files: `public-programs.csv` (54 rows), `public-funders.csv` (65 funders), `samples/doe-recipients-fy20-26.csv` (582 recipient rows, class assigned by heuristic).
Method: USAspending API (POST searches archived by a scratch helper, same `raw/<sha>/` layout, manifest lines carry `method: POST` and `request_body`). Programme pages archived with `barycenter.archive`. Other probes (`probes/*.md`) are cited for non-US facts. All USAspending figures are `disclosed` (government record). The web-search quota ran out during this task (after 200 calls), so rows marked "not verified" in the CSV were not researched: DoD/Pele, NASA, Korea, India, Australia, UK Advanced Nuclear Framework/NWS, Canada Infrastructure Bank, EUROfusion budget, Japan GX fund.

## 1. Headline: how much DOE money can be attributed to companies?

Scope: assistance awards (grants, cooperative agreements, type-11 reimbursable/contingent agreements), net obligations by fiscal year, FY2020 to FY2026 (2019-10-01 to 2026-09-30), by recipient, filtered by assistance listing (CFDA). Loans are shown separately (face value is not an obligation). Recipient classes are a regex heuristic plus manual review of the top rows (see `samples/doe-recipients-fy20-26.csv`): `dev/vendor` = nuclear or fusion developers, fuel and vendors (including SPVs like US SFR OWNER LLC); `GA` = General Atomics, shown apart because it operates the DIII-D national facility under a cooperative agreement.

| Programme filter | Total FY20-26 | Developers/vendors | General Atomics | Universities | Other companies | Utilities | Nonprofit/other | Labs |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| NE, CFDA 81.121 (all awards) | USD 4,558M | 3,694M (81.0%) | 59M (1.3%) | 378M (8.3%) | 231M (5.1%) | 177M (3.9%) | 19M (0.4%) | 0 |
| ARPA-E, CFDA 81.135, nuclear/fusion keywords (noisy) | USD 267M | 36M (13.6%) | 3M (1.2%) | 161M (60.1%) | 63M (23.6%) | 0 | 4M (1.6%) | 0 |
| Office of Science, CFDA 81.049, fusion keywords (proxy for FES) | USD 1,460M | 143M (9.8%, all FY2024+) | 679M (46.5%) | 549M (37.6%) | 88M (6.0%) | 0 | 1M (0.1%) | 0.2M |
| Pooled | USD 6,286M | 3,873M (61.6%) | 741M (11.8%) | 1,088M (17.3%) | 382M (6.1%) | 177M (2.8%) | 25M (0.4%) | ~0 |

Sample shas (first page of the FY2025 query each; all FY shas are in the manifest, search `request_body.filters.program_numbers`): NE `d4940b9a1497`, ARPA-E keyword `224275953b83`, Office of Science fusion keyword `655d3d4cedd8`; FY2020 NE `7f52dea9627d`. The combined per-FY file is `24b1225f9b7c` (derived). Check: the NE FY2025 query returns exactly 100 rows because the tail is negative de-obligations, so the list is complete.

Developer/vendor obligations by FY (all three programmes pooled, USD M): 2020 142 of 424; 2021 366 of 643; 2022 278 of 599; 2023 753 of 1,124; 2024 434 of 821; 2025 1,120 of 1,379; 2026 781 of 1,296. The ARDP pair (US SFR OWNER 1,696.9M, X-energy 934.0M = 2,631M) is 41.9% of the pooled total; excluding them the developer/vendor share of the remaining USD 3,655M is 34.0%.

Company-level totals, all DOE (any office, contracts included), FY20-26, from `spending_by_category/recipient` per name (shas e.g. CFS `0000aa4da56d`, US SFR OWNER `37a369d6d2fd`, X-energy `40673c73028b`, Kairos `243d1e1fb669`, General Matter `fc9abaf48f6f`):
- Fusion developers (CFS 50.9, Xcimer 43.1, Type One 27.9, Zap 18.8, Thea 13.7, Realta 13.0, Tokamak Energy 14.8, Focused 7.5, Marathon Fusion 4.1; Helion 0 in the window): USD 193.7M. TAE: zero rows in any group (probe `usaspending.md`).
- Fission and fuel companies listed in `comp.json` (US SFR 1,696.9 + TerraPower 3.0, X-energy 939.3, Kairos 135.5, NuScale 263.8, Westinghouse 177.2, Holtec Gov 106.1, SHINE 93.5, ACO/Centrus 1,376.0, General Matter 903.9, Orano Federal Services 909.7, Framatome 135.8, ARC 20.2, Oklo 2.7, Radiant 1.3 and a few small ones): USD ~6.77B, but about USD 3.2B of that is enrichment contracts and HALEU task orders (obligations with near-zero outlays: General Matter outlays USD 0.4M), and part of Westinghouse/Orano/Framatome/Holtec is legacy services. Do not read it as "funding raised".

### Committed vs obligated vs outlaid (visible in USAspending)
| Award | Obligated / award amount | Outlays | Notes |
|---|---:|---:|---|
| ARDP Natrium, US SFR OWNER LLC, DENE0009054 | 1,696.9M | 972.4M | cost share 2,016.8M (award detail), period to 2028-03-31 |
| ARDP Xe-100, X-energy, DENE0009040 | 921.7M | 581.4M | cost share 1,231.5M, 3 subawards 183.6M |
| ARDP risk reduction, Kairos, DENE0009325 (type 11) | 135.0M | 126.9M | DOE page says DOE share USD 303M of USD 629M total: mismatch to reconcile |
| Milestone program, 8 awards (type 11) | 173.3M | 35.5M | DOE press: USD 46M initial for 18 months. CFS 48.09M/9.7M, Xcimer 39.5M/8.5M, Type One 26.73M/2.0M, Zap 17.8M/4.0M, Thea 13.7M/3.0M, Realta 12.47M/3.14M, Focused 7.5M/2.15M, Tokamak Energy 7.5M/3.0M |
| LPO loan Holtec Palisades, DELP0000153 | face 1,450.2M, subsidy cost 18.06M | n/a | 2024-07-31 (loans sha `6d929dd87795`) |
| LPO loan Constellation (Crane restart), DELP0000204 | face 3,000M as recorded | n/a | sha `9feaf9c54aeb`; verify vs DOE announcement |
| HALEU task order, General Matter | 900.4M | 0.4M | Jan 2026 |

Important correction to the sibling probe (`probes/usaspending.md`): the Milestone awards and the Kairos ARDP risk-reduction award are present in USAspending. They have award type "Other reimbursable, contingent, intangible, or indirect financial assistance" (type 11), which a query restricted to grant codes 02-05 misses. Any production fetcher must include codes 09/11/-1 (a mixed-group list is accepted by `spending_by_category` but not by `spending_by_award`, which needs one group per call).

## 2. Where the lab and university money is, and what can be attributed

National labs do not appear as grant recipients. They are paid through management-and-operating (M&O) contracts to LLC contractors (UT-Battelle, Battelle Energy Alliance, Triad...), where the programme office is only visible one level down. Recipient totals for these contractors cover all DOE programmes (e.g. Battelle Energy Alliance USD 12.97B FY20-26) and are not attributable to NE or FES. A per-award `awards/funding` call splits by Treasury account (sampled, pulling the 4,000 most recent funding lines per contract, so these are lower bounds):

| Lab contract | Account | Obligations in sampled lines FY2020+ | sha |
|---|---|---:|---|
| INL, Battelle Energy Alliance DEAC0705ID14517 | 089-0319 Nuclear Energy | 2,147M (also 580M other defence activities, 185M weapons) | `08843e6d35a7` |
| PPPL, Trustees of Princeton DEAC0209CH11466 | 089-0222 Science (FES) | 1,092M | `3f74f5163fac` |
| ORNL, UT-Battelle DEAC0500OR22725 | 089-0222 Science | 2,324M (all Science programmes) | `cbf3933708ef` |
| DIII-D, General Atomics DEFC0204ER54698 | 089-0222 Science | 636M | `fc1502619b7c` |

(The category endpoint `spending_by_category/federal_account` with `recipient_search_text` repeats the full recipient total on every account, so it cannot be used for this split.)

Reading: for NE the lab side (INL alone, at least USD 2.1B of NE account money) is the same order of magnitude as the USD 3.7B going to developers; for fusion the lab and university side (PPPL 1.1B + DIII-D 0.64B + universities 0.55B) is about 16 times what private fusion developers have obligated (USD 143M, all since the 2024 Milestone awards). FIRE ($107M of $180M anticipated) goes to INL, SRNL, MIT and U Tennessee, no company is a prime recipient. EU and UK show the same shape: EUROfusion and UKAEA are lab-type funding; UK STEP (GBP 1.3B of the GBP 2.5B+ five-year plan) goes to a government-owned company.

So: company-attributable public money is well measurable only in the US (USAspending), Canada (SIF), and partially EU grants (CORDIS) and UK grants (GtR). Elsewhere it is programme-level.

## 3. Easy vs hard funders

| Easy (API/bulk, per-award amounts, identifiers) | Hard (aggregates, press, access blocked) |
|---|---|
| DOE via USAspending (UEI, obligated, outlaid, cost share in award detail, transactions) | France 2030/Bpifrance: laureate lists, per-company amounts undisclosed (EUR 129.8M across 11) |
| ARPA-E project DB (undocumented JSON:API, 1,721 projects) | Germany: Foerderkatalog 403 (manual); hubs EUR ~125M with no split |
| SBIR CSV (91 MB; API down) | UK: FIP/LIBRTI per-org amounts not published; OCDS keyword search broken; STEP is intra-government |
| Canada G&C (CKAN datastore; SIF values, amendments) | EIC Fund, EIB, KfW, SPRIND: amount undisclosed per company |
| CORDIS (grants EUR 0.1-2.5M; bulk path robots-disallowed for our tool) | Sovereign funds (Temasek, GIC, KIA, Khazanah): participation only, never amounts; Mubadala, PIF, CPP, JIC, Bpifrance, JBIC, NWF, BBB: none found in R4 edges |
| UKRI GtR REST (small grants) | China (CFEC): shareholder table from Chinese listed-company filing; Japan/Korea: Japanese/Korean PDFs |
| LPO loans (USAspending type 07/08: Loan Value, Subsidy Cost) | DoD (Pele, DIU, Air Force), NASA: not probed; OTAs likely incomplete; US states: statutes without awards |

Traps to design for: recipient SPV names (US SFR OWNER LLC, CFPP LLC); selection amount vs obligation vs ceiling (ARPA-E CFS 2.39M vs 1.29M; ARDP ceilings over 7 years); type-11 awards missed by default filters; "award amount" on type-11 may be a multi-year ceiling (Milestone 173M vs 46M announced); keyword filters catch non-nuclear "plasma"/"uranium" awards; in-kind support (GAIN, INFUSE, HALEU material, Reactor Pilot authorisation) has no cash; loan face value is not funding; cancelled ARPA-E projects remain listed.

## 4. Recommendation: lab/university money as context?

Yes, as context, never in company totals.
1. Company ledger ("public money to companies"): only awards whose recipient (or SPV) is a company, with `committed` (ceiling), `obligated`, `outlaid` stored separately, grants and loans separate. This is the US 3.9B/6.3B pooled slice (61.6% developers/vendors), Canada SIF, EU grants.
2. Public-funder lens: show programme envelopes and lab/university recipients (FIRE, EUROfusion, UKAEA, INL/PPPL contracts) on the funder page as "ecosystem funding, not attributable to companies", with the share numbers above. Without it the funder view would understate fusion public support by roughly an order of magnitude (private fusion developers hold about 10% of FES-like assistance, 143M vs 1.46B, and the lab contracts add billions more).
3. Where a company benefits indirectly (INFUSE, GAIN, CRADAs, lab subawards, HALEU allocations, Reactor Pilot), add `non_cash` agreements without dollars.
4. Treat General Atomics as a labelled exception (company operating a national facility; USD 679M FES-keyword, 59M NE).
5. Never sum public-money rows with equity rounds or into "raised"; sovereign funds appear only as investor links with amount undisclosed.

## 5. Open questions
- Reconcile Milestone type-11 amounts (173.3M) with DOE's USD 46M and Kairos 135M with DOE's 303M.
- Honeywell International USD 187.5M under CFDA 81.121 (purpose not checked).
- Decide how to attribute INL/ORNL/PNNL M&O money (needs award-level funding lines paged fully: BEA and UT-Battelle exceeded the 4,000-line cap).
- Probe DoD (Pele, Janus, Eielson), NASA, Korea, India, Australia, CIB, EUROfusion, UK ANF/NWS when search access returns.
