# Verification: lis-technologies (2026-10-05, verifier-agent claude-opus-5-5)

**Status: verified. Corrections: 9.**

## Fixes
- **7 Form D events:** `announced_on` moved from the first-sale date to the filing's signature date, which is the date of the source. The first-sale date is kept in `round_label`.

  | First sale | Signed |
  |---|---|
  | 2023-03-15 | 2023-08-22 |
  | 2023-08-02 | 2023-08-22 |
  | 2024-03-15 | 2024-03-22 |
  | 2024-08-16 | 2024-08-19 |
  | 2024-12-04 | 2024-12-04 |
  | 2025-05-16 | 2025-05-16 |
  | 2026-03-18 | 2026-03-24 |

- **Release round (2026-01-13):** `closed_on` removed. The release only says "has closed", with no closing date.
- **Same money, release vs Form D:** the Jan 2026 Form D (signed 2026-01-12, $16,014,029 sold, 88 investors) is the same money as the release's "$17 Million". It is now attached to the release event as an `amount_conflict_form_d` evidence item rather than as a second event, so the money is counted once at $17M.

## Reconciliation
- Form Ds before Jan 2026 total $41.5M.
- Adding the Jan 2026 Form D ($16.0M) gives $57.5M.
- Adding Mar 2026 ($7.0M) gives $64.5M.
- The release says "Totaling $64 Million" as of 2026-01-13. That figure stays `cumulative` and is never counted.
- Neither gap is explained: $17M vs $16.0M, and $64M vs $57.5M at that date.

## Residual doubts
- EDGAR acceptance dates were not checked; the signature dates are used instead.
- No investors are named.
