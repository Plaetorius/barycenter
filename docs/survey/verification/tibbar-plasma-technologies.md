# Verification: tibbar-plasma-technologies

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (3 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
5 changes: 3 participant evidence items re-sourced; obligated evidence added; disbursed 0.0 removed on DEAR0000677 and DESC0018278 (pre-2019 awards with no outlay reporting). Recipient is the company. Scope OK (fusion developer); note that the largest award (ARPA-E transformers) is non-fusion work.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| tibbar-plasma-technologies-dear0000677 | 2,290,106 | new_money | n/r |
| tibbar-plasma-technologies-desc0018278 | 90,000 | new_money | n/r |
| tibbar-plasma-technologies-desc0019016 | 299,975 | new_money | 201570.0 |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
