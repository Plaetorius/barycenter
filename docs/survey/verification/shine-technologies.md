# Verification: shine-technologies

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (6 events, 0 agreements). `ledger check` OK.

## Summary of findings and fixes
4 changes: DELP0000207 LPO conditional commitment $262.9M changed to amount_kind ceiling with obligated_usd 0 (award detail total_obligation 0.0); disbursed 0.0 removed on DENA0002598 and DEAR0002077 (outlays not reported); 6 participant evidence items re-sourced; obligated evidence added. Recipient is SHINE Technologies, LLC. SCOPE: SHINE is a fusion-neutron isotope producer; ~$117M of NNSA money is Mo-99 isotope work, not energy. Keep it only as adjacent (fusion-enabled isotopes, recycling ambitions), flagged, outside nuclear-energy-developer totals. Private rounds (>$1B reported) are not in the ledger. Purpose of the LPO loan not confirmed.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| shine-technologies-dena0002598 | 14,313,536 | new_money | n/r |
| shine-technologies-dena0003923 | 15,000,000 | new_money | 8294431.11 |
| shine-technologies-dena0004010 | 87,274,432 | new_money | 79294317.65 |
| shine-technologies-desc0024023 | 1,129,412 | new_money | 866484.94 |
| shine-technologies-dear0002077 | 3,780,306 | new_money | n/r |
| shine-technologies-delp0000207 | 262,881,867 | ceiling | n/r |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
- The purpose of LPO conditional commitment 1512 and whether the loan has closed are unknown; DOE's announcement was not retrieved.
