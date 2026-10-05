# Verification: ultra-safe-nuclear

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 4 corrections.

## Issues found and fixes
1. Removed the Standard Nuclear ($28M stalking horse) and NANO Nuclear ($8.5M) Section 363 asset-sale events. They are purchases of assets from the bankruptcy estate, not funding of USNC, and they would have been counted as money raised. Their facts and snapshots are kept in `notes`.
2. JMB DIP $23M commitment: changed to `up_to` / `ceiling`. It is a committed facility with no draw evidenced, and the source is an aggregator.
3. Form D announced_on: moved from the first-sale date (2020-01-30) to the filing signature date (2020-02-07). The first-sale date is kept as its own evidence item.

## Checked, no change
- Form D $17,398,650 (one investor, equity) matches the EDGAR XML.

## Residual doubts
- No pre-2024 rounds or grants are evidenced apart from the 2020 Form D.
- The DIP figure comes from the ElevenFlo summary, not from court filings.
