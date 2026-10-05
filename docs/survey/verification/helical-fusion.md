# Verification: helical-fusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 1 correction.

## Issues found and fixes
1. Tokyo Zero Emission programme: "Selected projects may receive up to JPY 1 billion … over a three-year period" is the programme maximum, so it is now `amount_kind: ceiling`.

## Checked, no change
- Cumulative figures reconcile. JPY 2.3bn + 0.87bn = 3.17bn, which matches the "total Series A funding, including loans" of about JPY 3.2bn. JPY 5.2bn + 0.87bn = 6.07bn, which matches the total of about JPY 6.0bn including grants and loans. No cumulative rows are recorded, which is correct.
- Series A participants (SBI Investment, KII) and the extension participant (Ecrowd NEXT) are verbatim in the company releases.

## Residual doubts
- The JPY 2.3bn "Series A" headline appears to include undisclosed loans from public financial institutions. The equity/debt split is unknown.
- The Aichi JPY 40M payer is not named explicitly in the release.
- The Tokyo release shows "Apr 6" without a year; 2026 is inferred from "FY2026".
- MEXT SBIR JPY 2bn is not evidenced.
