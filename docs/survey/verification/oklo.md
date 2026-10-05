# Verification: oklo

Status: **verified** (6 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **SPAC double counting**: `altc-ipo-2021` ($500M raised by AltC Acquisition Corp in 2021) and `oklo-spac-merger-2024` (~$305.1M trust at the 2024-04-05 record date) describe the same pool of money. The IPO proceeds went to the SPAC trust, not to Oklo. Before the deal, SPAC holders redeemed about $195M (an extension redemption is implied: only 710 shares were redeemed at closing). The IPO event is now `amount_kind: duplicate`, `supersedes: oklo-spac-merger-2024`.
2. **Underwritten offering June 2025**: the amount was the base deal ($400,000,020). The FY2025 10-K states gross proceeds of $460.0M for 7,666,667 shares, including the 1,000,000-share over-allotment. The amount is now $460.0M, with the 10-K quote. The prospectus quote is kept as `round_label` evidence.
3. **June 2025 ATM**: it was entered as an `up_to` $539,999,000 ceiling counted as new money. The 10-K states realised gross proceeds of $540.0M (7,384,019 shares, Aug 2 to Sep 3, 2025), so it is now `approx` $540.0M new_money, and committed_usd keeps the ceiling.
4. **September 2026 ATM** ($1.0B): nothing sold is evidenced, so it is now `amount_kind: ceiling`. Its announced_on quote was the termination of the May agreement on 2026-09-10. It now quotes the 2026-09-11 entry into the new agreement.
5. **SAFE roles**: DCVC IV and Liberty Oilfield Services were `lead`. The S-4 says only "sold ... to", so both are now `participant`.
6. **Reactor Pilot Program agreement**: the evidence did not name Oklo. I added a quote listing "Oklo Inc." from the same DOE snapshot.

Checked and left as is: the December 2025 ATM ($1,499,867,429 realised) and May 2026 ATM ($1.0B realised) both have realised sales stated in later 8-Ks. ARPA-E obligations match USAspending. Equinix $25M is an agreement value. No PIPE.

## Residual doubts
- The SAFE announced_on days are placeholders for month-only dates (Jul 2022, Jul 2023, Jan to Mar 2024).
- The merger amount is the gross trust balance at the record date. Net cash at closing, after transaction costs, is not stated in the snapshots.
- The binding level of the Switch 12 GW master agreement (recorded as mou) is unverified.
- Gaps: pre-2022 priced rounds (YC, Series A-x), the Meta prepayment amount, and the ARPA-E ONWARDS selection ($4.0M) vs obligation ($0.66M).
