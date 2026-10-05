# Verification: fuse-energy-technologies

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 2 corrections.

## Issues found and fixes
1. Removed `valuation_post_usd` from the Apr 2025 cumulative row. It had no valuation evidence and repeated the Sep 2024 valuation.
2. Corrected the notes: $20M + $32M = $52M, so the cumulative figures are consistent with the $32M being new money.

## Checked, no change
- The $32M round, the "over $200M" valuation (stored as a 200M floor) and both cumulative rows: each quote is in the company library page and is correctly `reported`.
- The Bloomberg valuation URL is dated 2024-09-12, which supports linking the valuation to the Sep 2024 round.

## Residual doubts
- No primary source for any amount, and no investors named.
- announced_on may be 2024-09-12 (Bloomberg) rather than 2024-09-16 (Ignition).
