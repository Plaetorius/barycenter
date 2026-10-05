# Verification: x-energy (2026-10-05, claude-opus-5-5)

## Issues found
- **ARDP: nothing was being counted.** The DOE $1.2B commitment was `new_money` with qualifier `up_to`, which is a programme maximum and not money received. The USAspending obligation was `cumulative`, so it was not counted either. Following the Kairos convention, the DOE figure becomes a ceiling and the USAspending obligation becomes the counted figure.
- The 48C tax credit (about $150M) was counted as `new_money`. Per the prospectus it applies only on placement in service, so it is not cash.
- ARK was listed as an IPO participant, but the prospectus only says ARK "indicated an interest" in buying up to $105M. A non-binding indication of interest is not a purchase.
- Series C-1 2024 was marked `exact`, but the notes to the financial statements say "approximately $626.5 million".
- The IPO amount is the base deal only. The Q2 2026 10-Q (b695297148c4, newly archived) says the underwriters' option was exercised: about 50.9M shares at $23, about $1.1B net.

## Fixes
1. `ardp-xe100-doe-commitment-2021` is now `ceiling`.
2. `ardp-xe100-usaspending-obligated` is now `new_money`, with obligated_usd 921,717,024 and disbursed_usd 581,350,171.29.
3. `triso-x-48c-2024` is now `ceiling`.
4. ARK removed from the IPO participants.
5. Series C-1 2024 qualifier set to `approx`, with a second quote.
6. The 10-Q quote on the option exercise added to the IPO event. The stated base gross of $1,017,857,157 is kept, because the full gross of about $1.17B is computed rather than stated.

## Checked, no double count
- The $626.5M Series C-1 is cash only. The $20.0M Amazon note converted separately (3.1M units), so it is not inside that figure.
- The $53.4M January 2025 C-1 closing is a real later tranche.
- The two USAspending pre-ARDP awards are separate awards.

## Residual doubts
- USAspending shows `total_account_obligation` of $1.08B against `total_obligation` of $921.7M for the same award.
- No investor names are recorded for Series C-1 or D. The prospectus does not name them, and x-energy.com is ToS-blocked.
- **P2 breach in the raw store (not used as evidence):** the manifest holds programmatic fetches of x-energy.com pages (99ae3885af90, 9ed88311461b, 8ea3206a702a).
