# Verification: nano-nuclear-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (13 events). `ledger check` OK.

## Issues found and fixes (2, plus 1 added event under check 6)
1. **$400M ATM (2025-07-25)**: set `amount_kind: ceiling` and removed `committed_usd: 400000000`. An ATM maximum is not committed money.
2. **Added `nano-atm-sales-2026-06`: $26.75M gross.** Source: the 10-Q filed 2026-08-12 (snapshot 7319fbdb...). It reports 1,000,000 shares sold at $26.75 in June 2026, "the first sales under the 2025 ATM Program". $373.25M remained available and nothing more was sold through the 10-Q date.
3. Notes corrected: they said no sales disclosure had been found.

## Checked, no change
- Pre-IPO rounds: Seed, Angel (two fiscal-year tranches summed), Series A and Series B, from the 424B4, with Form D used as corroboration.
- IPO $10.25M and the July and October 2024 follow-ons: base amounts, with the over-allotments kept as separate evidence only.
- PIPEs: Nov 2024 $60.0M, May 2025 $105.0M, Oct 2025 ~$400M.
- GAIN voucher: no amount recorded.
- No convertible notes exist for NANO.
- No participants recorded: none are named in the filings.

## Doubts I could not resolve
- Pre-IPO `announced_on` dates are first-of-month approximations taken from period text.
- ATM sales after 2026-08-12 are unknown.
- The 2026-10-02 8-K concerns the Radnostix asset purchase, which is already recorded as an agreement.
