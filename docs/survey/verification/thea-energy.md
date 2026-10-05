# Verification: thea-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (9 events). `ledger check` OK.

## Issues found and fixes (3)
1. **INFUSE Feb 2023 (~$500K)**: the PPPL article says "the two PPPL collaborations ... will receive nearly $500,000". That is lab money (D5, check 6), not money paid to Thea. I removed the amount, kept the event, and relabelled the quote as `recipient`.
2. **Milestone $13.7M (DESC0024881)**: I archived the USAspending award record (snapshot 5f5e0bf1...). It shows:
   - award type "other reimbursable, contingent";
   - `non_federal_funding` 0, so the $13.7M is federal money only and does not include Thea's cost share;
   - total obligation $13.7M and outlays $3.0M;
   - `date_signed` 2024-06-03, the same day as Realta's Milestone award DESC0024887.

   I changed the qualifier from exact to `up_to` (milestone-contingent money), added `obligated_usd` and `disbursed_usd`, and added three evidence items.
3. Notes updated to match (1).

## Checked, no change
- Series A $20M: Prelude Ventures lead, seven other investors named.
- Series B $100M: USIT lead; GICP and Linse named as participants; seven existing investors.
- Series B extension: the amount is undisclosed in the release, so none is recorded.
- TechCrunch $130M is correctly a `cumulative` statement.
- ARPA-E SCALEUP $20M: Thea calls it "a $20 million award" and says it was "selected". Kept as exact.
- INFUSE 2023-07 and 2025-09: no amounts recorded, which is correct.

## Doubts I could not resolve
- The link between DESC0024881 and the Milestone programme rests on several signals: the project title (planar-coil stellarator pilot plant), the contingent award type, CFDA 81.049 (Office of Science) and the signing date. The `funding_opportunity` number is null in USAspending. The DOE awardee pages I archived did not render the list.
- `announced_on` is the 2023-06-01 selection release, but the amount comes from the 2024-06-03 obligation.
