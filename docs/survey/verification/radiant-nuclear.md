# Verification: radiant-nuclear (2026-10-05, claude-opus-5-5)

## Issues found
- **Single-aggregator investor lists.** The Series B (5 names) and Series C (7 names) participants rested only on startupintros.com, and each quote was just a bare name.
  - The aggregator's Series C page is "$170M November 2024". It merges the November 2024 round with the 2025 tranche and includes names such as Decisive Point and Chevron that look like later (Series D era) investors.
  - So it cannot place any investor in a specific round.
- The Series C amount rested on DCVC (press) alone, although the SEC Form D (3178f30407c3) was already in raw.

## Fixes
1. Removed all 12 participants that rested only on the aggregator. The names are kept in the notes as leads for a future pass.
2. Series C amount now also cites the Form D ("0 99999999 99999999 0", signed 2024-11-15, first sale 2024-10-23), with basis `disclosed`.

## Checked
Amounts against Form D:
- Series A: $12.62M (USV calls it "$10mm"; the conflict is already noted).
- Series B: $40.71M.
- Series C: $100M.
- 2025 tranche: $66.05M, first sale 2025-02-13. It is a separate offering, consistent with a second Series C close (SiliconANGLE says the Series D came "six months after its Series C"). It is not a duplicate.
- Series D: kept as ">$300M" from press. The Form D shows $268.8M sold of $350M offered, which looks like a partial close, so it is not added.
- USAspending awards: STTR $1.35M, plus USAF $1.25M and $45K. These are SBIR-type contracts recorded as grants.

## Residual doubts
- The Series A and B round labels come from the aggregator only.
- The label of the 2025 $66M tranche is unconfirmed.
- No Series D participants are known beyond Draper Associates and Boost VC.
- The $750M Army award has a single source (a DCVC blog post) and is recorded as an agreement only.
- **P2 breach in the raw store (not used as evidence):** probe-era programmatic fetches of radiantnuclear.com.
