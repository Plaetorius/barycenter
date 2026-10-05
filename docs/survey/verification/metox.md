# Verification: metox

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (6 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
4 changes: DEFG0207ER84691 marked duplicate of FG02-07ER84691 (same award, two USAspending IDs); 6 participant evidence items re-sourced (MESC via awarding office); obligated evidence added; DEMS0000131 disbursed 0.0 removed (award detail: outlays null). Recipient is the company throughout. Scope: MetOx is an HTS-wire manufacturer (enabler), not a fusion developer; the early SBIRs were for HEP collider conductors and the $80M MESC grant is a manufacturing plant. Keep as fusion supply chain, exclude from fusion-developer totals. $80M is obligated, not disbursed.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| metox-fg02-07er84691 | 841,835 | new_money | n/r |
| metox-defg0207er84691 | 371,179 | duplicate | n/r |
| metox-desc0001005 | 98,509 | new_money | n/r |
| metox-desc0004707 | 199,047 | new_money | n/r |
| metox-dear0001816 | 3,000,000 | new_money | 2438507.36 |
| metox-dems0000131 | 80,001,256 | new_money | n/r |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
- The legacy/new-ID overlap is inferred from amounts (legacy total = Phase I + later obligations). Transaction-level data was not fetched. If the records are additive instead, the duplicate rows undercount by the duplicated amounts.
