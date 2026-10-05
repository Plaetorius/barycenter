# Verification: advanced-conductor-technologies

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**, 18 events. `ledger check` OK.

Method: every fact re-read against the archived USAspending award-level search (`spending_level: awards`, one row per award with modifications already netted). There is one event per award and there are no duplicates from modifications. "Award Amount" is the obligation to date, not a ceiling. `disbursed_usd` is "Total Outlays". `announced_on` is the first-obligation date, not a press date.

## Issues and fixes (15)
- `disbursed_usd` had no evidence. I added a `disbursed_usd` quote ("Award Amount" + "Total Outlays") for each of the 15 events that has outlays.
- Amounts, dates and award IDs: 0 errors. The recipient on every row is ADVANCED CONDUCTOR TECHNOLOGIES LLC (UEI CLNQLMBDRLH3), the company itself.

## Scope (added to notes)
ACT supplies HTS cable (CORC). It is not a fusion developer. Its 18 awards total $16.2M obligated:

| Purpose | Awards | Obligated |
|---|---|---|
| Accelerator or collider magnets (HEP SBIR topics) | 6 | ~$4.0M |
| ARPA-E TINA aviation cables (DEAR0001459) | 1 | $1.5M |
| Name fusion | 6 | ~$5.1M |
| Generic cable work | rest | rest |

Keep ACT as enabling tech, with the caveat that much of this money is not for fusion.

## Residual doubts
- Some closed early awards show outlays of 0 or null (DESC0018710, DESC0007660, DESC0009485). This is a reporting gap in USAspending, not a sign the money was never paid.
- The Office of Science vs ARPA-E split rests on the award-ID prefix (DESC vs DEAR). The participant quote only says "Department of Energy".
- Non-DOE SBIRs and private funding were not searched.
