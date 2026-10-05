# Verification: niowave

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (35 events, 1 agreements). `ledger check` OK.

## Summary of findings and fixes
37 changes: 3 new-format rows marked duplicate (same award as the legacy FG02 row); 35 participant evidence items re-sourced; obligated evidence added; disbursed 0.0 removed on 3 awards whose outlays were never reported. Recipient is Niowave, Inc. throughout. SCOPE: evidence is right, but Niowave is an isotope/accelerator company. I recommend excluding it from a nuclear-energy funding map, or keeping it only in an isotopes/fuel-cycle layer with just the 5 reactor-related SBIRs. The ~$40M+ of accelerator SBIRs must not count as nuclear-energy funding.

## Method
Each event was compared field by field with its archived `spending_by_award` row (amount, outlays, base obligation date). All values matched. A per-award detail snapshot was then archived (`api/v2/awards/<generated_internal_id>/`, source `verify-usaspending`) to confirm the recipient, the program (CFDA title or awarding office), `total_obligation`, `total_outlay` and non-federal cost share.

- Labels: `amount` = `obligated_usd` = USAspending total obligation (actual money committed, not a ceiling); `disbursed_usd` = outlays where reported.
- Rows are award-level, so there is one event per award (no per-modification duplicates), except the legacy/new-ID pairs handled above.

## Events
| id | amount | kind | disbursed |
|---|---|---|---|
| niowave-fg02-07er84861 | 1,074,807 | new_money | n/r |
| niowave-fg02-08er85172 | 850,000 | new_money | n/r |
| niowave-fg02-08er85014 | 850,000 | new_money | n/r |
| niowave-desc0001215 | 2,200,000 | new_money | n/r |
| niowave-defg0208er85172 | 750,000 | duplicate | n/r |
| niowave-defg0208er85014 | 750,000 | duplicate | n/r |
| niowave-desc0001709 | 1,700,000 | new_money | n/r |
| niowave-desc0001706 | 200,000 | new_money | n/r |
| niowave-defg0207er84861 | 600,000 | duplicate | n/r |
| niowave-desc0001206 | 200,000 | new_money | n/r |
| niowave-desc0004202 | 200,000 | new_money | n/r |
| niowave-desc0004220 | 1,325,000 | new_money | n/r |
| niowave-desc0004219 | 200,000 | new_money | n/r |
| niowave-desc0006345 | 1,300,000 | new_money | n/r |
| niowave-desc0006341 | 1,300,000 | new_money | n/r |
| niowave-desc0007519 | 2,150,000 | new_money | n/r |
| niowave-desc0007518 | 150,000 | new_money | n/r |
| niowave-desc0007517 | 150,000 | new_money | n/r |
| niowave-desc0007520 | 1,150,000 | new_money | n/r |
| niowave-desc0009512 | 1,150,000 | new_money | n/r |
| niowave-desc0009523 | 1,150,000 | new_money | n/r |
| niowave-desc0009704 | 150,000 | new_money | n/r |
| niowave-desc0011236 | 1,150,000 | new_money | n/r |
| niowave-desc0011355 | 2,725,000 | new_money | n/r |
| niowave-desc0011356 | 1,150,000 | new_money | n/r |
| niowave-desc0013851 | 1,150,000 | new_money | n/r |
| niowave-desc0015821 | 1,150,000 | new_money | n/r |
| niowave-desc0017733 | 1,150,000 | new_money | 451629.0 |
| niowave-desc0017734 | 1,106,088 | new_money | 587388.96 |
| niowave-desc0018529 | 1,109,082 | new_money | 926316.0 |
| niowave-desc0018544 | 150,000 | new_money | n/r |
| niowave-desc0018691 | 866,148 | new_money | 716148.0 |
| niowave-dena0003925 | 15,000,000 | new_money | 10305489.46 |
| niowave-desc0020857 | 179,835 | new_money | 159673.96 |
| niowave-dena0004012 | 3,254,448 | new_money | 3254448.0 |

## Residual doubts
- Completeness: only DOE (and INFUSE/GAIN) records were swept. Private rounds and non-DOE grants are not in this ledger.
- The legacy/new-ID overlap is inferred from amounts (legacy total = Phase I + later obligations). Transaction-level data was not fetched. If the records are additive instead, the duplicate rows undercount by the duplicated amounts.
