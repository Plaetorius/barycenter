# Verification: holosgen

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (1 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
1 change: participant evidence re-sourced (ARPA-E via CFDA 81.135 title); obligated evidence added. Amount $1.95M obligated, $1.03M outlaid, confirmed. Recipient is the company; scope OK (fission microreactor developer). Only one DOE award found; completeness not checked (no equity rounds in ledger).

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| holosgen-dear0000984 | 1,948,613 | new_money | 1030287.49 |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
