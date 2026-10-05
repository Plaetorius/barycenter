# Verification: nucube-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (1 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
0 corrections. GAIN voucher (2024-12-19, with INL) confirmed; the DOE page states that recipients do not receive direct financial awards. Per D5 it is lab money, in-kind, never counted. The project (heat exchanger for CO2-to-carbon) is only loosely reactor-related. Private funding (~$13M reported in census) is not in the ledger.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| nucube-energy-gain-voucher-2024-12 | - | None | - |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
