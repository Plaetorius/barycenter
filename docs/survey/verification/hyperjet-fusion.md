# Verification: hyperjet-fusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (3 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
5 changes: 3 participant evidence items re-sourced (ARPA-E x2, Office of Science), obligated evidence added, disbursed_usd 0.0 removed on DESC0018765 (outlays not reported for that 2018-19 award). All 3 awards go to HyperJet Fusion Corp itself; DEAR0001268 has 2 subawards (amounts not split out). Scope OK (fusion developer); DESC0018765 is a non-fusion powder project. No private rounds in ledger.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| hyperjet-fusion-desc0018765 | 150,000 | new_money | n/r |
| hyperjet-fusion-dear0001236 | 500,000 | new_money | 150000.0 |
| hyperjet-fusion-dear0001268 | 2,838,034 | new_money | 2066080.46 |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
