# Probe: Canada Grants & Contributions (incl. Strategic Innovation Fund)

Date 2026-10-05. Card `docs/sources/canada-gc.yaml`. Sample `samples/canada-gc-nuclear-companies.csv`. Package metadata archived `a214f4f6bd91` (OGL-Canada, modified 2026-10-05, CSV 2,318,108,314 bytes).

## Access
- Full CSV (38 columns, 2.3 GB) is impractical: a streaming download died and a resumed curl ran at about 100 KB/s. Do not plan on the bulk file without a long background job.
- **CKAN datastore API works without a key**: `datastore_search?resource_id=1d15a62f-5656-49ad-8c88-f40ce689d831&filters={"recipient_legal_name":"General Fusion Inc."}`. Exact-match filters only; full-text `q` is rejected for >100k rows; `datastore_search_sql` is not usable. robots allows `/data/en/api/`. Licence OGL-Canada.
- Columns of interest: ref_number, amendment_number, amendment_date, recipient_legal_name, recipient_business_number, agreement_value, agreement_start_date, agreement_end_date, owner_org, prog_name_en, description_en, recipient_province, naics_identifier.

## Results (archived queries; `disclosed`; CAD; each amendment is a row, latest amendment is the current value)
| Company | Rows | Latest value | Detail |
|---|---|---|---|
| General Fusion Inc. | 6 | **CAD 74,275,000** (SIF Stream 1 R&D, ref 033-2019-2020-Q1-811346, amendment 4 on 2026-03-26, end 2034-03-31) | Amendments: 49.275M (2019), 54.275M (2023-11-27), 69.275M (2025-01-22), 74.275M (2026-03-26). Also NRC IAP CAD 680,988 (2020-04-01). Archive `c638ee082e54` |
| Terrestrial Energy Inc. | 3 | CAD 18,923,000 (SIF; initial 20,000,000 in 2019-04; amendment 2 on 2026-03-31 end 2052-04-30) | `d14e22db1c82` |
| Moltex Energy Canada Inc. | 2 (+2 ACOA rows) | CAD 47,500,000 SIF (ref 033-2020-2021-Q4-814523; amendment 1 2026-03-31, end 2054-07-31); ACOA REGI: CAD 3,000,000 (2021-02-12), CAD 2,666,667 (2024-01-30) | `0c98ab98618c`; ACOA rows archived `0128b1980b53` |
| Canadian Nuclear Laboratories | 3 small | CAD 200,000 (Transport Canada, 2022-07-22); CAD 999,831 (Canadian Space Agency, 2023-02-13) | name variants with and without `|` duplicate |
| ARC Clean Technology, Prodigy, newcleo, First Light Fusion | 0 | | about 12 legal-name variants tried, plain and `A|A` form |
| Others (Tokamak, Proxima...) | n/a | | |

SIF agreement_value is the authorised maximum; contributions are generally conditionally repayable (not a field here; confirm per programme). Disbursed amounts not given.

## Gaps and traps
Exact names, and the legal-name field is sometimes stored duplicated with a pipe (`Moltex Energy Canada Inc.|Moltex Energy Canada Inc.`, which the plain-name filter misses): query both forms; amendment duplicates (do not sum); no investor/equity data; CNL and AECL are funded by appropriation, and Canada Infrastructure Bank / SDTC financings are outside this dataset; value is CAD, convert on agreement date.

## Adapter sketch
`canada_gc` fetcher via datastore API with a filter list of legal names (from `universe.yaml` aliases and business numbers; add `recipient_business_number` filter when known). Keep all amendments, resolve latest per `ref_number`. Quarterly refresh; also run a periodic slow bulk scan with a keyword regex to discover unknown nuclear recipients (needs a resumable downloader). Effort 1.5 days.
