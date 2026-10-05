# Verification: realta-fusion (2026-10-05, verifier-agent claude-opus-5-5)

**Status: verified. Corrections: 3.**

## Fixes
1. **$3M DOE award, attribution and double counting.** The seed release of 2023-05-31 says "$3 million from the US Department of Energy's Fusion Development Program". The Milestone-Based Fusion Development Program selections were announced the same day, and USAspending holds the matching award DESC0024887: recipient REALTA FUSION INC., CFDA 81.049 Office of Science, $12,467,500 obligated, $3,140,000 outlaid, signed 2024-06-03. The award is not ARPA-E, as TechCrunch claimed (ARPA-E only funded the earlier UW-Madison WHAM experiment). The $3M event is now `amount_kind: duplicate` with `supersedes: realta-doe-milestone-desc0024887`, so the award is counted once.
2. Series A `announced_on`: 2025-05-14 (ESG Today) → **2025-05-13**, the date of the PR Newswire release.
3. The SVB $9.5M growth capital facility is now `amount_kind: ceiling`, because no drawn amount is stated.

## Checked
- Seed $9M matches Form D ($8,999,996).
- Series A $36M matches Form D ($35,510,568, which includes converted SAFEs).
- Leads match their quotes: Khosla for the seed, Future Ventures for the Series A.

## Residual doubts
- The Milestone obligation is milestone-tranched, and only $3.14M has been paid.
- The earlier SAFE money inside the Series A is not separately evidenced.
