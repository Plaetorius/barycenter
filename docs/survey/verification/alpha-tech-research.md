# Verification: alpha-tech-research

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**, 1 event. `ledger check` OK.

Method: every fact re-read against the archived USAspending award-level search (`spending_level: awards`, one row per award with modifications already netted). There is one event per award and there are no duplicates from modifications. "Award Amount" is the obligation to date, not a ceiling. `disbursed_usd` is "Total Outlays". `announced_on` is the first-obligation date, not a press date.

## Issues and fixes (1)
- Added evidence for `disbursed_usd`.
- DESC0022922: $198,753 obligated and fully outlaid. The recipient is ALPHA TECH RESEARCH CORP., the company itself.

## Scope and gaps
- MSR developer, in scope.
- No private rounds were found. Later DOE or GAIN support was not found either (GAIN vouchers are lab money under D5).
