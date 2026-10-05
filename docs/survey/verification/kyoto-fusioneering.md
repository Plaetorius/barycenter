# Verification: kyoto-fusioneering

Status: **verified** (6 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **Joint-venture money recorded as company funding**: `kf-ffc-general-atomics-2025-08` (USD 20M from General Atomics) was paid into **Fusion Fuel Cycles Inc.**, the KF and Canadian Nuclear Laboratories JV for UNITY-2, not into Kyoto Fusioneering. Under the different-recipient rule this is not KF funding, so the event was removed. The evidence is snapshot `0dd110e429ab...` (kyotofusioneering.com/en/news/2025/08/29/3372) if it is to be modelled under FFC or as a partnership.
2. **Series D credit and loan facilities** (JPY 9.0bn): the source says "access to" facilities, so they are undrawn. The event is now `ceiling` / `up_to`.
3. **Series C extension debt** (JPY 5.3bn): "debt financing and credit facilities" / "(including credit facilities)", with no drawn amount stated. The event is now `ceiling` / `up_to`.
4-6. **2nd close of the Series C extension**: In-Q-Tel, Marubeni and Nichicon changed from participant to `lead`, per the release title "... Series C Extension Led by In-Q-Tel (IQT), Marubeni and Nichicon". I added the title quote as evidence.

Checked and left as is: Series D first close JPY 16.72bn new equity and its investor lists. The Series C extension final close records only the JPY 1.45bn of new equity, because the ¥9.3bn headline includes earlier closes and debt, so there is no double count. NEDO JPY 499M, BMBF SyrVBreTT (over EUR 2.5M, recipient KF Europe GmbH, a subsidiary) and KaLiAS (no amount) are kept.

## Residual doubts
- The KF release pages have no in-body date. announced_on comes from the newsroom URL path (/news/YYYY/MM/DD/), which is consistent with the listing.
- The 2nd close names 3 of the "four new investors".
- History is incomplete: seed, A, B, Series C and the 1st close of the extension (about JPY 1.5bn implied) are missing, as are the INFUSE awards.
