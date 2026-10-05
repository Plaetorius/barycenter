# Probe: FX and inflation (R2-prose, 2026-10-05)

Source id: `fx`. Archived under `pipeline/raw/` (source_id `fx`).

## Frankfurter (ECB reference rates)
- Base `https://api.frankfurter.dev/v1/`; no key; no stated quota ("There are no quotas" in site FAQ, 4687e8c6d894); robots.txt trivial (16ceb5ee3e0d). Open source, self-hostable. The site now documents a `/v2/` API (`/v2/rates?date=...`); `/v1/` still answers. Pin `/v1/` and re-test.
- Tests:
  - latest: `/v1/latest?base=EUR&symbols=USD,GBP,JPY,CAD,CNY,KRW` -> date 2026-10-05, USD 1.1204, GBP 0.8472, JPY 177.28 (81301449beda)
  - history depth: `/v1/1999-01-04?base=EUR&symbols=USD` -> USD 1.1789 (74047a7601cf). ECB series starts 1999-01-04 (the site says 1948 across all providers, not checked)
  - deal dates: `/v1/2026-07-07?base=EUR&symbols=USD` -> 1.1433 (daec91a5e46c). Cross-check against the Proxima release: EUR 411M stated as $468M, which implies 1.1387, so the company's own rate differs from the ECB reference rate by 0.4%. `/v1/2024-11-20?base=GBP&symbols=USD` -> 1.2667 (501966e1c83d)
  - range: `/v1/2025-01-01..2025-01-10` returns working days only (the response skipped 2025-01-01 and weekends; start date was clamped to 2024-12-31) (ecce6955f897)
  - currency list: 703 bytes (d943666faf93), roughly 30 ECB-published currencies
- Behaviour: a weekend or holiday date returns the previous working day's rate (the `date` field in the response shows which). Store both requested and returned date. Rates are ECB reference rates (about 14:15 CET), not transaction rates.
- Use: convert EUR/GBP/JPY... amounts at announcement date; store the rate, returned date and response sha as an evidence snapshot. Direct ECB API (`data-api.ecb.europa.eu`) is the primary alternative (not probed).

## FRED CPI
- Key-less CSV: `https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL` -> 956 monthly rows, 1947-01-01 to **2026-08-01 = 334.131** (f8ecddf53a9a). Latest month lags by about 5-6 weeks. Series is seasonally adjusted CPI-U; for deflating use CPIAUCNS (not seasonally adjusted) or annual averages as a documented choice.
- JSON API `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&file_type=json` -> **HTTP 400 "api_key is not set"** (da3c632f9a98). A free key is required; register once and store as a secret; supports `realtime_start` vintages.
- Terms (https://fred.stlouisfed.org/legal/, f53982655c11): FRED asks users to credit FRED as the source and keep copyright notices; free for non-commercial, educational, personal use, and commercial use needs a permissions check. CPIAUCSL is a BLS series (US government data) with no third-party copyright notice, but the project should cite BLS as origin and FRED as retrieval. Alternative: the BLS API directly (not probed).
- Use: real-dollar view, base year chosen once (e.g. 2025 dollars); show nominal and constant values side by side; snapshot the CSV per refresh (monthly).

## Recommendation
Frankfurter for FX (no key), FRED CSV for CPI (no key) with a free API key as the fallback; both snapshotted. Evidence for a converted number: original amount and currency, date, rate source URL, response sha, returned rate date.
