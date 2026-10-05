# Verification: steady-energy

Status: **verified** (4 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **The B-round was double counted.** The EUR22M March 2025 "funding milestone" (the "halfway target" of the round) and the EUR32M close (July 2025) were both `new_money`. The `supersedes` link was also on the wrong event (the 32M pointed at the 22M). Fix: the 22M event is now `duplicate` with `supersedes: steady-2025-series-b-close`, and the link on the 32M event is removed. The round counts once, at EUR32M.
2. **EIB up to EUR40M senior unsecured convertible** → `ceiling`. It is a facility maximum with no drawn amount stated. The finance contract is with 3North Partners Plc, Steady's new parent (a different legal recipient), and the notes now say so.
3. **3North IPO "gross proceeds of up to EUR 5 million"** → `ceiling`. It is the offering cap, and final proceeds were not found.

## Confirmed
- The Business Finland EUR10.5M R&D loan (2026-06-18) is debt, granted to Steady Energy Oy.
- 92 Ventures (now 92 Capital) led the round. Lifeline Ventures took part in the first tranche. Valo Ventures and Move Energy are new investors at the close.

## Residual doubts
- The EUR69.8M private placement is subscribed into 3North Partners Plc, with proceeds released to the combined company. The commitments were conditional. Completion is inferred only from the listing going ahead on 2026-10-02.
- LocalTapiola and Tesi are called "major Finnish investors" in the close release. Their participation in this round is implied, not stated explicitly.
- Gaps: the seed round (EUR2M, 2024) and earlier Business Finland and Tesi money.
