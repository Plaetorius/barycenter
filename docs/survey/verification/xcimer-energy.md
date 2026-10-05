# Verification: xcimer-energy (2026-10-05, verifier-agent claude-opus-5-5)

**Status: verified. Corrections: 2.**

## Fixes
- **Milestone award DESC0024890:** the $39.5M award total is milestone-tranched and recorded as `up_to`. USAspending shows only $13.5M obligated to accounts and $8.5M outlaid. The $39.5M event is now `amount_kind: ceiling`. Following VERIFY rule 6, the money actually committed is recorded as its own `new_money` event: `xcimer-doe-milestone-desc0024890-obligated`, $13.5M, `disbursed_usd` $8.5M, sourced from the USAspending JSON.

## Checked
- Series A $100M led by Hedosophia (2024-06-04).
- RTX Ventures amount is undisclosed. The release dateline says Sept. 10, 2026; the page header says Sept 9.
- "Nearly $200M" is cumulative only.
- ARPA-E: $3,571,249 federal share plus $1,258,217 recipient cost share.

## Residual doubts
- The 2022 seed (Form D/A and a SAFE Form D) is not recorded, so the ~$200M cumulative figure cannot be reconciled with the recorded rounds.
