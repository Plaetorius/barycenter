# Verification: deep-fission

Status: **verified** (4 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **2025 PIPE**: `announced_on` 2025-09-05 was the 8-K "Date of Report" (the closing date). It is now the 8-K filing/signature date 2025-09-11, and 2025-09-05 is kept as `closed_on` with its own evidence.
2. **2026 private placement ($80M)**: the `announced_on` quote ("The Offering closed on February 5, 2026") proved only the closing. It is replaced with "On February 10, 2026, the Company issued a press release announcing the Offering", and the old quote moves to `closed_on`.
3. **Blue Owl $20M**: the 424B4 quote ties the investment to the MOU, not explicitly to this placement. Added the 8-K quote "The private placement includes an investment by funds affiliated with Blue Owl Digital Infrastructure Advisors LLC".
4. **GAIN voucher**: the `announced_on` evidence did not contain a date. It now uses the 8-K signature date (2025-09-11).

## PIPE vs IPO
They are distinct money and are not double counted:
- The PIPE: $30M, 10,000,000 shares at $3.00, sold to accredited investors at the reverse merger into Surfside.
- The Nasdaq IPO: $40M gross, 2,500,000 shares at $16.00, completed 2026-06-22. The 424B4 calls it "our first listed public offering". The over-allotment and up to $10M of cornerstone interest are not counted.

The $80M February 2026 placement is a third, separate raise.

## Residual doubts
- SAFE aggregates ($1.5M in 2023, $8.2M in 2024, $1.6M in H1 2025) differ from cash-flow lines in the same 8-K ($1.0M of financing cash in 2023, $8.6M of SAFE proceeds in 2024). The aggregates are kept as `approx`.
- SAFE events are dated by period end.
