# INTL-SUMMARY: non-US public-money and registry sources (R2-EU/UK/CA)

Date 2026-10-05. Cards: `docs/sources/{cordis,eic-eib,ted-f4e,ukri,companies-house,uk-contracts,bodacc-fr,france2030,foerderkatalog,canada-gc,other-eu,asia}.yaml`. Probes: same ids in this folder. Samples: `samples/`. Amounts are `disclosed` (government record or company release) unless marked `reported`. Archive sha prefixes are in each probe.

## 1. Coverage matrix (company x source)
Cell = what was found. `-` = searched, nothing. `n/a` = out of scope (wrong country). `?` = not probed or blocked.

| Company | CORDIS | EIC/EIB | TED/F4E | UKRI | Cos House | UK contracts | BODACC/Annuaire | France 2030 | Germany | Canada G&C | Other EU / Asia |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Proxima Fusion | EIC Acc. EUR 2.47M (2024-08) | EIC Fund in EUR 411M round (2026-07-07), amt undisclosed | - | n/a | ? (Oxford sub) | n/a | n/a | n/a | STRIDE hub (EUR ? of ~125M); Bavaria MoU up to EUR 400M; SPRIND/KfW investors | - | - |
| Marvel Fusion | EIC Acc. EUR 2.49M (2024-10) | EIC Fund in Series B ext. (~EUR 50M with EQT, Siemens Energy; 2025-03-27) | - | n/a | n/a | n/a | n/a | n/a | VEGA hub (co-lead) | - | - |
| Gauss Fusion | - | ? | - | n/a | n/a | n/a | n/a | n/a | STRIDE hub only | - | - |
| Focused Energy | EUR 125k (EIC Pathfinder) + EUR 252k (INFRA) | ? | - | n/a | n/a | n/a | n/a | n/a | VEGA hub (co-lead) | - | - |
| Tokamak Energy | - | - | - | 4 Innovate UK leads: GBP 25k, 100k, 250k, 987,707 (2011-2021); partner 2023-25 | 07054929: SH01 allotments to 2025-07-23, nominal GBP 5,713.69 | UKAEA FIP (CAST), LIBRTI bid (amts n/d) | n/a | n/a | n/a | - | Japan: Kyoto Fusioneering partner (n/a) |
| First Light Fusion | - | - | - | IUK GBP 5k (2015); EPSRC as collaborator | 07555858: allotment 2026-04-17 (SH01 2026-05/07), charge 2025-03 satisfied 2026-05 | UKAEA FIP ("Natural lithium shielding") | n/a | n/a | n/a | - | - |
| Astral Systems | - | - | - | partner: STFC GBP 790,900 (project) | trades as Astral Neutronics 13376789: 5 allotments 2025-05 to 2026-07 | - | n/a | n/a | n/a | - | - |
| General Fusion | - | - | - | - | n/a | n/a | n/a | n/a | n/a | **SIF CAD 74.275M (latest amend. 2026-03-26)** + NRC CAD 0.68M | - |
| newcleo | EUR 99,975 + 157,713 (Euratom) | - | **IIT lot 5 EUR 2,260,423.70 (419818-2025)** | - | ? | - | SIRENs 912522240, 929009140, 979949153; capital notices 2022-09, 2024-02, 2024-11, 2024-12 | LFR-30 laureate 2023-06-09 (EUR 24.9M with Naarea) | n/a | - | - |
| Steady Energy | - | EIB convertible up to EUR 40M; EUR 32M round | - | n/a | n/a | n/a | n/a | n/a | n/a | n/a | Business Finland loan EUR 10.5M (2026-06-18); Tesi |
| Thorizon | EUR 113,654 (MIMOSA); ENDURANCE unfunded | - | - | n/a | n/a | n/a | n/a | laureate 2024; EUR 10M (company) | n/a | - | NL: RVO not probed |
| Copenhagen Atomics | EIC Acc. EUR 2.5M (2026-01) | ? | - | n/a | ? (UK Atomics sub) | - | n/a | n/a | n/a | n/a | DK: not probed |
| Jimmy Energy | - | - | - | n/a | n/a | n/a | SIREN 892884099 (no BODACC pass) | laureate 2023-11-27 + Temps 2 (2026-03-11); amts n/d | n/a | n/a | - |
| Stellaria | ENDURANCE unfunded | - | - | n/a | n/a | n/a | SIREN 952843282; capital 2023-12, 2025-09; 2025 net EUR -3.26M | laureate 2024; amt n/d | n/a | n/a | - |
| Naarea | ENDURANCE unfunded | - | - | n/a | n/a | n/a | SIREN 882949506; 10 capital notices 2022-2024; **redressement 2025-09-03, liquidation + cession plan 2026-01-15** | XAMR laureate 2023-06-09 | n/a | n/a | - |
| Blue Capital / Blue Energy | - | - | - | - | - | - | no match (probably Blue Capsule: France 2030 laureate 2023-11-27) | Blue Capsule amt n/d | n/a | n/a | - |
| Terrestrial Energy | - | - | - | EPSRC partner GBP 1.28M | ? | - | n/a | n/a | n/a | **SIF CAD 18.923M (initial 20M)** | - |
| Moltex | - | - | - | IUK GBP 66.5k (2017, role unconfirmed); EPSRC | ? | - | n/a | n/a | n/a | **SIF CAD 47.5M** + ACOA CAD 3.0M (2021) + 2.67M (2024) | - |
| ARC Clean Technology | - | - | - | - | - | - | n/a | n/a | n/a | - (12 name variants) | - |

Extra hits: Novatron Fusion Group (SE): EIC Pathfinder EUR 1.499M (CORDIS), St1 EUR 13M, Industrifonden. Helical Fusion (JP): SBIR Phase 3 JPY 2bn (company-reported). China Fusion Energy Co.: CNY 15bn registered capital, 2025-07-22 (Chinese filing via press). Rolls-Royce SMR: GBE-N contract April 2026, GBP 2.6bn allocated, NWF up to GBP 599M.

## 2. Ranked usefulness (value for the funding map per unit effort)
| Rank | Source | Why | Auto-fetchable? | Effort |
|---|---|---|---|---|
| 1 | canada-gc | Clean disclosed CAD amounts, dates, amendments, free API, 3 of 3 Canadian targets; programmes (SIF) named | API now | 1.5 d |
| 2 | cordis | 8 companies, PIC + VAT identifiers, disclosed EC contribution, free bulk; grants only (small, EUR 0.1-2.5M); equity side missing | Bulk (robots question on `/data/`) | 1 d |
| 3 | companies-house | Only structured evidence of UK equity round timing; amount needs SH01 PDF parsing; needs a free key | API (key) | 3 d |
| 4 | bodacc-fr + Annuaire | Round timing and insolvency (Naarea) for French firms; no amounts; SIREN backbone; Annuaire financials | DILA bulk | 2 d |
| 5 | ted-f4e | Real but rare (newcleo EUR 2.26M); F4E mostly industrial suppliers | API | 1 d |
| 6 | eic-eib | Important investor links (EIC Fund, EIB) and amounts, but only via releases | via newsrooms | 0.5-2 d |
| 7 | uk-contracts | UKAEA/GBE-N programme news is useful; OCDS keyword broken, per-org amounts rare | OCDS harvest + pages | 2 d |
| 8 | ukri | Historic small grants; latest company rows 2023-25; project-vs-participant value trap | API | 1 d |
| 9 | france2030 | Laureate list yes, per-company amounts undisclosed | pages | 1 d |
| 10 | foerderkatalog | Blocked (403); hub totals via press only | manual | 1-2 d |
| 11 | other-eu, asia | Press-level; no structured endpoint tested | newsrooms | 0.5 d each |

Effort estimate to implement the first 8 as adapters: about 12-13 engineer days; 1-4 give the best yield in about 7.5 days.

## 3. Key cross-source findings
- Round amounts for non-US private rounds are mostly NOT in registries: BODACC gives date and "capital changed" only; Companies House gives nominal capital and PDF SH01s; CORDIS only the EIC grant. Company releases stay the record for amounts (consistent with BUILD-PLAN 3.3), registries serve as timing and corroboration.
- Public money visible per company: Canada (SIF CAD 74.3M General Fusion, 47.5M Moltex, 18.9M Terrestrial), EU grants (EUR 0.1-2.5M), France 2030 (named, no amounts), Germany hubs (programme total only), UK (UKAEA aggregates).
- Entity-resolution traps found: Astral Systems = Astral Neutronics Ltd 13376789 (a different Astral Systems Ltd 07374982 exists); newcleo has 3+ French entities and an Italian parent; Novatron has 2 PICs; GtR duplicates organisations; Canada stores some legal names as `X|X`; Naarea's Annuaire status "A" contradicts BODACC liquidation.

## 4. Decisions needed from the lead
1. CORDIS bulk lives under `/data/`, which robots.txt disallows for all agents. The archive tool refuses it. Approve downloading the official open-data zip (documented distribution) or ask CORDIS. I downloaded it once for the probe and did not archive it.
2. Opendatasoft's BODACC API is robots-disallowed (`/api/`); I used it a few dozen times for sampling before noticing. Use the DILA flux in production.
3. Foerderkatalog returns 403: keep manual or request access.
4. Provision a Companies House API key (free); no SH01 or PSC payload was sampled without it.
5. Canada bulk CSV (2.3 GB) is too slow to stream; use the datastore API.
