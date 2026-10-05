# Verification: canyon-magnet-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**, 1 event. `ledger check` OK.

Method: every fact re-read against the archived USAspending award-level search (`spending_level: awards`, one row per award with modifications already netted). There is one event per award and there are no duplicates from modifications. "Award Amount" is the obligation to date, not a ceiling. `disbursed_usd` is "Total Outlays". `announced_on` is the first-obligation date, not a press date.

## Issues and fixes (1)
- Added evidence for `disbursed_usd`.
- DESC0025965: $195,629 obligated and $72,670 outlaid. The recipient is CANYON MAGNET ENERGY INC, the company itself.

## Doubts and scope
- The period of performance starts 2025-02-18, but the first obligation is dated 2025-08-18. `announced_on` uses the obligation date.
- Enabling tech (HTS magnets), in scope. No private funding was found.
