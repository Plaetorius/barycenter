# Verification: louisiana-energy-services

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (0 events, 1 agreements). `ledger check` OK.

## Summary of findings and fixes
0 corrections. No funding events, which is correct: the only DOE money is a $500K task order (an agreement, value = obligated amount, confirmed in the snapshot) under the LEU enrichment acquisition IDIQ, plus omitted UF6 storage service contracts. Recipient LES LLC (Urenco USA) is the company. SCOPE: LES is an enrichment-plant owner (fuel cycle), not a reactor developer, and has no evidenced funding event. Recommend keeping it only in a fuel-cycle layer with the agreement, not in funding totals.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
