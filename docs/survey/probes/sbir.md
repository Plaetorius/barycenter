# Probe: SBIR.gov awards (card: docs/sources/sbir.yaml)

## API status
`https://www.sbir.gov/api` (`a013977005c9`): "Please be advised that the SBIR.gov APIs are currently undergoing maintenance"; documented endpoints `https://api.www.sbir.gov/public/api/awards?firm=...|agency=DOE&year=...|ri=...`, JSON/XML. A live call returned 403 `{"message":"Forbidden"}` (`12a22880bc2e`). The docs also state more fields are in the downloads than in the API.

## Bulk
`https://www.sbir.gov/data-resources` (`5294f47aeb9a`) links:
- no abstracts: `https://data.www.sbir.gov/mod_awarddatapublic_no_abstract/award_data_no_abstract.csv`: fetched, 91,504,083 bytes, sha256 `0fda9088e19f` (page says 65 MB: outdated), 219,649 rows, 42 columns
- with abstracts (about 290 MB): `.../awarddatapublic/award_data.csv` (not fetched)
- the old path `.../awarddatadownload/award_data.csv` returns AccessDenied XML (`a824bc7739e2`)
No auth. Robots fine. Data dictionary pages exist.

## Fields and fill rate (219,649 rows)
Company, Award Title, Agency, Phase, Program, Award Year, Address-block: 100%. Award Amount 219,608 (99.98%). Agency Tracking Number 99.9%. Contract (award number) 76%. Proposal Award Date 51%, Contract End Date 49%. UEI 152,957 (70%), DUNS 178,908 (81%). Company Website 56%. Number Employees 84%. Branch 66%. Contacts/PI email, phone present: personal data, drop at ingest. Max Award Year 2026 (303 rows: FY26 partial). Dates are sparse: use Award Year or USAspending for timing.

## Per-company (name regex on 219,649 rows)
| Company | Rows | Detail |
|---|---|---|
| Radiant Industries, Incorporated (UEI EHLLKECCBTX8) | 4 | DOE STTR Phase I 2022 $199,158 and Phase II 2023 $1,148,890 (DE-SC0022800, TRISO fuel; sum 1,348,048 = USAspending DESC0022800 obligation); Air Force SBIR Phase II 2023 $1,249,967 (FA8649-23-P-0464, microreactor installation) and Phase I 2021 $45,299 (FA8649-21-P-1143); award dates 2021-04-19, 2022, 2023-02-08, 2023-08-21 |
| CFS, Helion, Zap, TAE, TerraPower, X-energy, Kairos, Oklo, Aalo | 0 | (regex hits on Atrex, Hyrax, Thermex etc. were false positives) |
Other: DOE awards whose titles mention fusion/nuclear/reactor/HALEU/TRISO/molten salt/microreactor: 1,127 awards to 408 firms (supply chain: Radiation Monitoring Devices 46, Analysis and Measurement Services 43, Tech-X 26, Bridge12 gyrotrons, Ampeers REBCO tape, Nusenics bolometers, Sydor Pockels cells...). Valuable for the later supplier/Accretion layer; noisy because "fusion" also matches "data fusion".

## Gotchas
API down; file is a monolith (91 MB, re-download daily is wasteful: use HTTP HEAD/ETag). Company names inconsistent over time (case, punctuation). Not every SBIR is DOE. DUNS-era rows lack UEI. Award Amount per phase, not cumulative. Personal data columns.

## Adapter sketch
Daily/weekly conditional GET of no-abstract CSV (check `Last-Modified`), load with polars, drop PI/contact columns, filter by universe UEIs/names plus nuclear keyword on title for DOE/DoD/NASA, emit `Agreement(kind=grant, program=SBIR-PhaseII)`, key `agency_tracking_number|contract`; link to USAspending by contract = FAIN. If API returns, use `firm=` for single-company refresh. Effort: 1 day.
