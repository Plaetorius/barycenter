# Probe: SEC EDGAR (card: docs/sources/edgar.yaml)

Probed 2026-10-05. All raw bytes in `pipeline/raw/` (manifest source_id `edgar`); sha256 prefixes below.

## Access, limits, terms
| Item | Finding | Evidence |
|---|---|---|
| Submissions API | `https://data.sec.gov/submissions/CIK{10-digit}.json`, JSON, `filings.recent` arrays (form, filingDate, items, primaryDocument, accessionNumber; older filings in `filings.files`). No auth. | e.g. Oklo `0fbaf788c029` (76 kB, 468 recent filings) |
| Filing documents | `https://www.sec.gov/Archives/edgar/data/{cik}/{adsh-nodash}/primary_doc.xml` (Form D) or primaryDocument (HTML). Robots explicitly allows `/Archives/edgar/data`. | Form D table below |
| Full-text search | `https://efts.sec.gov/LATEST/search-index?q="name"&forms=D` returns Elasticsearch-style JSON (`hits.hits[]._source`: ciks, display_names, form, file_date, adsh, items, biz_locations, sics). Unofficial/undocumented but what sec.gov UI uses; works with our UA, 403 `{"message":"Forbidden"}` for `/robots.txt`. | `ab0e2cd4f644` (Helion), `bc13620039a3` |
| Auth / UA | No key. Descriptive User-Agent with contact required (archive tool sends BarycenterBot + email). | https://www.sec.gov/about/developer-resources (`3669f09942e3`) |
| Rate limit | "no more than 10 requests per second regardless of number of machines"; block on excess. We ran at 1 req/s. | same page |
| Bulk | Form D Data Sets, quarterly zips, Sept 2009 to June 2026 ("updated quarterly"), flattened XML as filed. Daily/full index at `/Archives/edgar/daily-index`, `/full-index`. | https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets (`0680be3549ea`) |
| robots.txt | sec.gov: `Disallow: /cgi-bin`, `/Archives/bin`..., `/search*`; `Allow: /Archives/edgar/data`. data.sec.gov: none (404). | `f83678ce2bb4` |
| Licence | Federal government work; filings are public. SEC permissions: very little not free to reuse. | https://www.sec.gov/about/webmaster-frequently-asked-questions (`d3c263574618`) |

## Per-company results (10 sampled)
| Company | CIK(s) | Form D (operating issuer) | Public-market filings | Rounds visible |
|---|---|---|---|---|
| Commonwealth Fusion Systems | 1744079 (LLC); 1826637 (PML SPV 1 LP) | 4 filings 2018-06-27, 2019-07-01 (D/A), 2020-05-26, 2021-12-02; submissions `fa8b7a01e958` | none | 2018 Series A $64.6M sold (offering $100.0M); 2019 amendment $115.0M; 2020 $80.6M of $100.0M; **2021-12 $1,816,074,299 sold (72 investors, first sale 2021-11-19) = the $1.8B Series B2**. No Form D after 2021 under this CIK (the 2025 round has none). SPV D 2020-10-19 $1.975M (10 investors) |
| Helion Energy | 1615940; 2155060 (HII Helion Energy-01 series) | 2014-08-12 ($1.50M, 3 investors), 2015-07-06 ($10.6M sold of $21.2M, 6 inv.) only; `f90ad0adaae1` | none | Nothing after 2015 by issuer. SPV `HII Helion Energy-01` D 2026-09-11: $4,552,131, 53 investors |
| Zap Energy | 1714402 | 5 filings: 2019-09-09 ($1.1M sold of $7.2M, 1 inv.), 2021-04-23 ($25.2M), 2022-06-07 ($110.4M of $160.6M), D/A 2022-07-06 ($162.6M, 15 inv.), 2024-07-31 ($130.0M, 40 inv., first sale 2024-07-15); `75491d39d0a0` | none | Clean series: A/B/C visible; 2024 matches the $130M Series D |
| TAE Technologies | no operating issuer CIK found | none. Only `Linqto Liquidshares LLC` (1841356) D filings 2023-08-17 and D/A 2024-06-13 (retail secondary vehicle) | TAE is counterparty to Trump Media & Technology Group (CIK 1849635): 8-K 2025-12-18 merger agreement, TMTG funds $200M unsecured convertible note within 5 business days plus up to $100M more, $90M termination fees (`4b8201eccb14`); 8-K and S-4 2026-09-30, amended note (`41694fe1dab4`) | Merger + bridge note, not a Form D |
| TerraPower | none (0 Form D hits for "terrapower"/"TerraPower, LLC") | none | efts full text: 105 8-K/S-1/424B4 mentions across other issuers (Centrus, ASP Isotopes...) (`2f5ded5282f1`) | Not visible in EDGAR as issuer |
| X-energy | 2088896 (X-Energy, Inc., ticker XE); 1840743 (X Energy Reactor Company LLC); 2073997 (X-Energy Management LLC) | 2021-01-26 reactor co D: $1.885M, 9 inv. Management LLC D 2025-07-01: $22.8M sold, 74 inv. (likely employee equity). | **IPO**: S-1 2026-03-20 (confidential DRS 2025-11-12), 424B4 2026-04-27: 44,254,659 Class A shares at $23.00 = about $1.02B (computed from prospectus cover and price; `db86c83fcbef`). ARK indicated interest up to $105M | SPV Form Ds: Ares X-Energy Co-Invest LP 2024-10-09 ($40.55M, 18 inv.), SCP X-Energy Holdco 2024-12-19 ($19.2M of $150M) and D/A 2025-12-02 ($29.9M of $30M), Lightcone Series D SPV 2026-02-05 ($19.0M), IBX SPV (0 sold) |
| Kairos Power | none | none (0 hits "kairos power" as issuer; 35 8-K mentions in other filers) | none | Not visible in EDGAR |
| Oklo | 1849056 (ex AltC Acquisition Corp.) | none | 468 recent filings. 424B5 2025-06-13 (net proceeds approx $383.0M, `ca6ff28b0405`); ATM 424B5 2025-09-03 up to $539,999,000 (`926306ce2093`), 2025-12-04 up to $1.5B (`d022ebfdc592`), 2026-05-13 up to $1.0B (`f81173b67f95`), 2026-09-11 up to $1.0B (`2aea3b043816`); 8-K 2026-09-11 says prior $1.0B ATM fully sold: 17,971,448 shares, gross approx $1,000,000,000 (`2912ab807611`); shelf S-3 up to $3.5B | Public equity raises/ATMs; SPAC closing 8-K 2024-05-13 (items 1.01,2.01,3.03,5.01...) |
| Radiant Industries | 1914078; SPVs 2030456, 2126203 | 5 filings: 2022-03-03 ($12.6M), 2023-04-18 ($40.7M of $45.1M), 2024-11-15 ($100.0M), 2025-06-10 ($66.0M), 2025-12-30 (**$268.8M sold of $350.0M**, 40 inv., first sale 2025-12-15); `a4be58869357` | none | Complete round ladder; SPVs Decisive Point I (0 sold) and II ($7.85M, 16 inv.) |
| Aalo Atomics | no issuer CIK found | none by "Aalo Atomics" itself | none | 16 SPV/syndicate D filings 2024-08 to 2026-09 (Gaingels, GV, BBVC series, HII, CC Ltd...) with amounts $0.1M to $9.0M each. These are investor vehicles; summing them does not give the company's round |

Other listed nuclear names noted from `company_tickers.json` (`eb943bdc3d23`, 798 kB): GFUZ General Fusion Group (SPAC with Spring Valley III, CIK 2074850, F-4/A, 425 filings, `00e1c18ef46a`), IMSR Terrestrial Energy (ex HCM II SPAC; D 2026-03-31 $85,320), NNE Nano Nuclear (4 pre-listing D, $0.29M to $3.7M), NKLR Terra Innovatum, FISN Deep Fission, HDRN Hadron, NUCL Eagle Nuclear, NWCL newcleo, STDN Standard Nuclear, FRMI Fermi, DJT. The listed universe is wider than the 10 sampled; the ticker file is the cheapest way to enumerate it.

## Form D field fill-rate (49 Form D XMLs parsed: 29 issuer, 20 SPV/pooled)
| Field | Filled | Note |
|---|---|---|
| totalOfferingAmount | 49/49 | 9 are the literal string "Indefinite" (SPVs, Management LLC) |
| totalAmountSold | 49/49 | 6 are 0 (SPV registered before closing) |
| dateOfFirstSale | 43/49 | blank when nothing sold yet |
| totalNumberAlreadyInvested | 49/49 | SPV counts can be large (373, 513 for "CC Ltd" feeder funds) |
| industryGroup | 49/49 | values seen: Other Energy, Other, Pooled Investment Fund |
| typesOfSecuritiesOffered.isEquityType | 29/49 | pooled funds flag pooledInvestmentFund instead |
| yearOfInc | 45/49 | |
| federalExemptionsExclusions | 49/49 | 06b (Rule 506(b)); 3C, 3C.1/3C.7 for SPV funds |
Parsed fields kept: offering, sold, first sale, investors, exemption, entity type. relatedPersons ignored (personal data).

### Form D sample table (sha256 of the primary_doc.xml, first 12 chars)
| Company (query) | Issuer (CIK) | Accession | Signed | First sale | Offering USD | Sold USD | Investors | Kind | sha256[:12] |
|---|---|---|---|---|---|---|---|---|---|
| CFS | Commonwealth Fusion Systems LLC (1744079) | 0001744079-18-000002 | 2018-06-25 | 2018-05-30 | 100,000,008 | 64,594,246 | 5 | issuer | 4bd60a964af5 |
| CFS | Commonwealth Fusion Systems LLC (1744079) | 0001744079-19-000002 | 2019-07-01 | 2018-05-30 | 114,999,971 | 114,999,971 | 24 | issuer | 713ca7162f8c |
| CFS | Commonwealth Fusion Systems LLC (1744079) | 0001744079-20-000001 | 2020-05-26 | 2020-05-11 | 100,000,004 | 80,600,007 | 23 | issuer | 606e36e58cfa |
| Commonwealth | Commonwealth Fusion Systems PML SPV 1 LP (1826637) | 0001567619-20-017943 | 2020-10-15 | 2020-10-09 | Indefinite | 1,975,000 | 10 | SPV/pooled | b57d93d64ee3 |
| CFS | Commonwealth Fusion Systems LLC (1744079) | 0001744079-21-000001 | 2021-12-02 | 2021-11-19 | 1,816,074,299 | 1,816,074,299 | 72 | issuer | 447852a1bcae |
| Helion | Helion Energy, Inc. (1615940) | 0001615940-14-000001 | 2014-08-11 | 2014-07-29 | 1,499,986 | 1,499,986 | 3 | issuer | 7a656329de11 |
| Helion | Helion Energy, Inc. (1615940) | 0001615940-15-000001 | 2015-07-06 | 2015-06-19 | 21,228,400 | 10,614,202 | 6 | issuer | 87e29dda2d24 |
| Helion | HII Helion Energy-01, a Series of HII Helion Energy LLC (2155060) | 0002155060-26-000001 | 2026-09-11 | 2026-09-10 | 4,552,131 | 4,552,131 | 53 | SPV/pooled | 86363878eff3 |
| Zap | ZAP ENERGY, INC. (1714402) | 0001714402-19-000002 | 2019-09-09 | 2019-08-28 | 7,200,000 | 1,100,000 | 1 | issuer | 557e22501dcb |
| Zap | ZAP ENERGY, INC. (1714402) | 0001714402-21-000002 | 2021-04-23 | 2021-04-20 | 27,500,000 | 25,249,943 | 8 | issuer | ae6d88f19ef7 |
| Zap | ZAP ENERGY, INC. (1714402) | 0001714402-22-000001 | 2022-06-07 | 2022-05-24 | 160,610,830 | 110,423,000 | 9 | issuer | 2917041ea8ad |
| Zap | ZAP ENERGY, INC. (1714402) | 0001714402-22-000002 | 2022-07-06 | 2022-05-24 | 162,610,820 | 162,610,820 | 15 | issuer | ee58b565e031 |
| Zap | ZAP ENERGY, INC. (1714402) | 0001714402-24-000001 | 2024-07-30 | 2024-07-15 | 129,997,713 | 129,997,713 | 40 | issuer | 609ac645f0fe |
| Radiant | Radiant Industries, Inc (1914078) | 0001914078-22-000001 | 2022-03-03 | 2022-02-18 | 12,619,987 | 12,619,987 | 34 | issuer | c409fb8f3631 |
| Radiant | Radiant Industries, Inc (1914078) | 0001914078-23-000001 | 2023-04-18 | 2023-04-04 | 45,075,413 | 40,714,963 | 12 | issuer | 006d51f52b2f |
| Radiant | Decisive Point-Radiant Industries I, LLC (2030456) | 0002030456-24-000001 | 2024-07-16 |  | Indefinite | 0 | 0 | SPV/pooled | 9333cbcad387 |
| Radiant | Radiant Industries, Inc (1914078) | 0001914078-24-000003 | 2024-11-15 | 2024-10-23 | 99,999,999 | 99,999,999 | 27 | issuer | 3178f30407c3 |
| Radiant | Radiant Industries, Inc (1914078) | 0001914078-25-000002 | 2025-06-10 | 2025-02-13 | 66,049,991 | 66,049,991 | 30 | issuer | 34d3b7dcdb24 |
| Radiant | Radiant Industries, Inc (1914078) | 0001914078-25-000005 | 2025-12-29 | 2025-12-15 | 350,000,018 | 268,805,033 | 40 | issuer | 413137b8c165 |
| Radiant | Decisive Point - Radiant Industries II, LLC (2126203) | 0002126203-26-000001 | 2026-06-24 | 2026-01-05 | 7,854,961 | 7,854,961 | 16 | SPV/pooled | e9c0f0dd5404 |
| XEnergyReactorCo | X Energy Reactor Company, LLC (1840743) | 0001567619-21-001501 | 2021-01-26 | 2021-01-11 | 1,885,000 | 1,885,000 | 9 | issuer | 38c02a876ad9 |
| X-Energy | Ares X-Energy Co-Invest LP (2040454) | 0002040454-24-000001 | 2024-10-09 | 2024-10-02 | Indefinite | 40,550,000 | 18 | SPV/pooled | 7ab2bd22cf15 |
| X-Energy | IBX X-Energy SPV Fund I (2033800) | 0002033800-24-000001 | 2024-10-16 |  | Indefinite | 0 | 0 | SPV/pooled | d233d5a6564b |
| X-Energy | SCP X-Energy Holdco LLC (2046262) | 0002046262-24-000001 | 2024-12-19 | 2024-11-12 | 150,000,000 | 19,222,340 | 10 | issuer | 67af41046e9b |
| X-Energy | X-Energy Management, LLC (2073997) | 0001123292-25-000302 | 2025-07-01 | 2025-06-16 | Indefinite | 22,796,720 | 74 | issuer | 14da1c6cf62e |
| X-Energy | SCP X-Energy Holdco LLC (2046262) | 0002046262-25-000003 | 2025-12-02 | 2024-11-12 | 30,000,000 | 29,922,336 | 17 | issuer | af61e48990fe |
| X-Energy | Lightcone X-Energy Series D SPV LLC (2099512) | 0002099512-26-000001 | 2026-02-05 | 2025-10-26 | 19,000,000 | 19,000,000 | 1 | SPV/pooled | 0cd1c11d9631 |
| Aalo | Aalo Atomics SPV, a series of HENRY Collective Ops, LP (2020144) | 0002020144-24-000002 | 2024-08-20 | 2024-08-07 | 124,520 | 124,520 | 33 | SPV/pooled | f66805ae1ed5 |
| Aalo | Gaingels Aalo Atomics LLC (2073923) | 0002073923-25-000001 | 2025-08-07 | 2025-07-25 | 618,072 | 618,072 | 32 | issuer | bba2f2da7e85 |
| Aalo | GV Aalo Atomics SPV Jul 2025 a Series of CGF2021 LLC (2080449) | 0002080449-25-000002 | 2025-08-07 | 2025-07-31 | 105,700 | 105,700 | 12 | SPV/pooled | 82e46aedec6e |
| Aalo | Aalo Atomics CC Ltd (2089377) | 0002089377-25-000001 | 2025-10-01 | 2025-07-25 | 2,581,900 | 2,581,900 | 513 | SPV/pooled | 92efe3625c81 |
| Aalo | Gaingels Aalo Atomics NOV 2025 LLC (2097578) | 0002097578-25-000001 | 2025-12-01 | 2025-11-21 | 478,681 | 478,681 | 13 | issuer | d03cf1ee80e1 |
| Aalo | Aalo Atomics Oct 2025 a Series of CGF2021 LLC (2101186) | 0002101186-26-000001 | 2026-02-05 | 2026-02-04 | 475,000 | 475,000 | 9 | SPV/pooled | 1ebf7aca542b |
| Aalo | Aalo Atomics Jan 2026 a Series of CGF2021 LLC (2111161) | 0002111161-26-000001 | 2026-02-13 | 2026-02-03 | 1,440,856 | 1,440,856 | 28 | SPV/pooled | 193486f598b9 |
| Aalo | Aalo Atomics Two CC Ltd (2105182) | 0002105182-26-000001 | 2026-03-02 | 2025-11-05 | 1,592,409 | 1,592,409 | 373 | SPV/pooled | 89da41094b9a |
| Aalo | Aalo Atomics BBVC II, a Series of A Master Series, LLC (2126918) | 0002126918-26-000001 | 2026-04-13 |  | Indefinite | 0 | 0 | SPV/pooled | 1525d6fa41aa |
| Aalo | Aalo Atomics BBVC III, a Series of A Master Series, LLC (2134404) | 0002134404-26-000001 | 2026-05-08 |  | Indefinite | 0 | 0 | SPV/pooled | 8b8d3ee5a548 |
| Aalo | Aalo Atomics BBVC IV, a Series of A Master Series, LLC (2139384) | 0002139384-26-000001 | 2026-06-12 |  | Indefinite | 0 | 0 | SPV/pooled | 02a1c971b16a |
| Aalo | HII Aalo Atomics-01, a Series of HII Aalo Atomics LLC (2146941) | 0002146941-26-000001 | 2026-07-22 | 2026-07-10 | 2,000,000 | 2,000,000 | 69 | SPV/pooled | d2ad8b6a77ac |
| Aalo | Solist Aalo Atomics Holdings LLC (2141064) | 0002141064-26-000001 | 2026-07-22 | 2026-06-04 | 2,290,638 | 2,290,638 | 21 | SPV/pooled | 0dff3d62a9a2 |
| Aalo | Gaingels Aalo Atomics 2026 LLC (2146337) | 0002146337-26-000001 | 2026-08-11 | 2026-07-31 | 673,043 | 673,043 | 8 | SPV/pooled | cdab574f492c |
| Aalo | HII Aalo Atomics-02, a Series of HII Aalo Atomics LLC (2156184) | 0002156184-26-000001 | 2026-09-18 | 2026-07-10 | 9,000,000 | 9,000,000 | 177 | SPV/pooled | 5da1e40de198 |
| Aalo | Aalo Atomics BBVC X, a Series of A Master Series, LLC (2156442) | 0002156442-26-000001 | 2026-09-22 |  | Indefinite | 0 | 0 | SPV/pooled | 11b6d44b6270 |
| NNE | Nano Nuclear Energy Inc. (1923891) | 0001534122-22-000011 | 2022-04-26 | 2022-04-11 | 290,000 | 290,000 | 18 | public co. (pre-listing D) | eb54c15d8acb |
| NNE | Nano Nuclear Energy Inc. (1923891) | 0001534122-23-000002 | 2023-02-14 | 2023-02-08 | 3,681,869 | 3,681,869 | 56 | public co. (pre-listing D) | f5d9b9db6c61 |
| NNE | Nano Nuclear Energy Inc. (1923891) | 0001534122-23-000005 | 2023-06-08 | 2023-06-02 | 1,945,000 | 1,945,000 | 12 | public co. (pre-listing D) | ffaeb7d49da1 |
| NNE | Nano Nuclear Energy Inc. (1923891) | 0001814587-24-000002 | 2024-01-22 | 2024-01-08 | 2,166,437 | 2,166,437 | 14 | public co. (pre-listing D) | df2bf65e2998 |
| IMSR | Terrestrial Energy Inc. /DE/ (2019804) | 0002019804-26-000001 | 2026-03-31 | 2026-03-19 | 85,320 | 85,320 | 1 | public co. (pre-listing D) | 4202d851c206 |
| DJT | Digital World Acquisition Corp. (1849635) | 0001465818-21-000016 | 2021-12-15 | 2021-12-04 | 1,000,000,000 | 1,000,000,000 | 36 | public co. (pre-listing D) | 2398d9bb3f32 |

## Gotchas
- **Form D is a tranche, not a round.** Cumulative "amount sold" at filing time; D/A restates (Zap 2022: $110.4M then $162.6M). Link as evidence to a round event, never create events from it. First-sale date is the best event date proxy; filing deadline is 15 days after first sale, so signature date lags by days.
- **Missing big rounds:** CFS 2025 and Helion 2025 have no Form D under the issuer CIK; the issuer may rely on a different exemption, file late, or use another vehicle. Absence of a D is not absence of a round.
- **SPVs:** names embed the company ("Aalo Atomics BBVC II, a Series of A Master Series, LLC"). They are good for "which syndicates/platforms back X" (Gaingels, GV, Ares, Decisive Point) but are separate offerings. Tag `kind=spv`, never sum into company totals.
- **Name search noise:** efts "X-energy" returned Strata-X, Earth X, Lithium X; always confirm by CIK and SIC/state.
- **TAE and Kairos/TerraPower** have no Form D: private placement without Reg D filing or filed under names not matching; rely on company releases. TAE exposure comes via DJT filings.
- **robots parsing bug in our archive tool** (found while probing): Python `urllib.robotparser` stops a group at a blank line, so SEC's `#SEC` block (Disallow /cgi-bin, etc.) is ignored; and it also turns `Disallow: /search?` into `/search`, which false-blocks `/search-filings/...` pages. One request to `/cgi-bin/browse-edgar` (disallowed) slipped through during this probe (`d228dc52a250`); no further use. Fix: use a robots parser that handles blank lines (e.g. `protego`).
- efts may omit `Disallow` semantics for API but sec.gov "fair access" still applies: keep 1-2 req/s.

## Adapter sketch
1. **Universe**: nightly `company_tickers_exchange.json` plus a curated `universe.yaml` of CIKs (issuer and known SPV sponsors). Resolve unknown names with efts `forms=D` and a name guard.
2. **Form D**: per CIK `submissions/CIK….json`, new `D`/`D/A` accession numbers since last cursor, fetch `primary_doc.xml`, parse with ElementTree to a `FormDRecord` (issuer, adsh, filing/first-sale date, offering, sold, investors, exemption, is_pooled). Quarterly bulk datasets for backfill/discovery of SPVs: join `OFFERING`/`ISSUERS` on name regex for the universe.
3. **Public financings**: same submissions feed, keep forms S-1, S-3, 424B4/B5, 8-K with items 1.01, 2.03, 3.02, 8.01; fetch primary doc, regex for "aggregate offering price", "gross proceeds", "initial public offering", record as `evidence` with the passage; an LLM extractor only for amounts that need context. ATM size is a capacity, not money raised: record `ceiling` vs `sold` separately (Oklo 8-K reports realized sales).
4. Fetch layer: archive each document, UA header, 1 req/s, ETag/If-Modified-Since not supported broadly, so rely on accession cursors.
5. Effort: 2 to 3 days for Form D + submissions adapter with tests; +2 days for 424B/8-K extraction.
