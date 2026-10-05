# Verification: transmutex

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (1 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
1 change: participant evidence re-sourced (ARPA-E, plus the NEWTON FOA in the award detail); obligated evidence added; notes now name the recipient as the US subsidiary. Scope: Transmutex is a Swiss accelerator-driven subcritical (thorium/transmutation) developer, so it is a legitimate nuclear-energy developer; keep it, with the award attributed to the group via its US subsidiary. Swiss and private rounds (~$43M reported) are not in the ledger.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| transmutex-dear0002079 | 2,805,624 | new_money | n/r |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
