# Verification: ctfusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**, 2 events. `ledger check` OK.

Method: every fact re-read against the archived USAspending award-level search (`spending_level: awards`, one row per award with modifications already netted). There is one event per award and there are no duplicates from modifications. "Award Amount" is the obligation to date, not a ceiling. `disbursed_usd` is "Total Outlays". `announced_on` is the first-obligation date, not a press date.

## Issues and fixes (2)
- Added evidence for `disbursed_usd` on both events.
- Both events check out. The recipient is CTFUSION, INC., the company itself.
  - DESC0018844: $148,483 SBIR.
  - DEAR0001098: $3.42M obligated and $2.50M outlaid, ARPA-E.

## Doubts and gaps
- DESC0018844 shows $0 outlays on a closed award. This is probably a reporting gap.
- The private seed is not recorded.
- The company's current status was not checked.
- Fusion developer, in scope.
