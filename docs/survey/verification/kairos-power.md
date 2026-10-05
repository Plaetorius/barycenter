# Verification: kairos-power

Status: **verified** (3 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **ARDP Risk Reduction money counted up to three times.** Three events described the same DOE award for Hermes (round_group `ardp-risk-reduction-hermes`), and all three were `new_money`: the 2020 DOE selection announcement ($303M DOE share), the 2024 TIA ("up to $303 million", fixed-price milestones) and USAspending DENE0009325 ($135.0M obligated, $126.858M outlaid). Fixes:
   - `ardp-doe-tia-2024` → `amount_kind: ceiling`. It is a milestone programme maximum that has not been fully paid.
   - `ardp-doe-announced-2020` → `amount_kind: duplicate`, `supersedes: ardp-doe-tia-2024`. It is the same $303M, announced at selection.
   - `ardp-usaspending-obligated` stays `new_money` ($135M). It is the only figure that counts.
2. **Samsung C&T "up to $100 million"** → `ceiling`. It is a binding term sheet, not a closed round, it is subject to regulatory approvals, and part of it is in-kind engineering services.

## Confirmed
- The $500K DOE Industry Opportunities grant (DENE0008862, recipient KAIROS POWER LLC) matches USAspending.
- The Google (500 MW), TVA (50 MW Hermes 2 PPA) and DOE HALEU agreements are recorded as agreements only.

## Residual doubts
- The gap between the $135M obligation and the $303M ceiling is not explained by any source. Incremental milestone obligation is plausible but is not evidenced.
- Lifetime equity is not evidenced: the company is private, with no Form D and no round releases.
- The SBA loan ($3.3M, 2020) and the University of Wisconsin pass-through ($0.8M) are left out.
