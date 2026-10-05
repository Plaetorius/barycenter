# Verification: terrestrial-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 3 corrections.

## Issues found and fixes
1. SIF CAD18.923M: changed from `grant` to `debt`, and ISED's role from `grantor` to `lender` ("this is a repayable contribution").
2. Added `round_label` evidence for "Series A-1" from the 10-K equity statement.

## Checked, no change
- Series A-1 USD25.8M on 2025-07-01: the 10-K cash-flow statement gives USD25,797,201, consistent with the approx figure recorded.
- SPAC: "in excess of $292,000" is in thousands (USD292M) and already includes the USD50M PIPE. BCA announced 2025-03-26, closed 2025-10-28.

## Residual doubts
- PIPE investors are not named.
- The SIF announced_on is the agreement start date, not an announcement date.
- Convertible notes and the USD795K of DOE transactions are not recorded.
