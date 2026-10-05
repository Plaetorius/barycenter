# Verification: type-one-energy

Status: **verified** (2 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **ARPA-E BETHE**: the second `amount` evidence quoted only the USAspending award ID and recipient name. It is replaced with a quote that includes `"Award Amount":1180000.0`.
2. **DOE Milestone `announced_on` 2023-05-31**: the energy.gov quote proves only "May 2023". Added corroboration from Tokamak Energy's 31 May 2023 release of the same selection (basis reported).

## Checked (no change)
- **Seed vs Series A naming.** The $29M seed (2023-03-28, co-led by BEV, TDK Ventures and Doral) is the only counted equity round from that period. The $82.5M total is a `cumulative` statement and is not counted. TechCrunch (Jan 2026) calls it a seed extended in 2024. FusionX via TechCrunch (Aug 2026) calls it an "extended Series A". The conflict is documented, and the round label carries both names.
- **Trade-press-only amounts.** The $29M seed, the $87M convertible note (Jan 2026) and the $82.5M, $160M+ and $174.5M cumulative figures all rest on TechCrunch. All are `basis: reported`, which is correct. No company release or Form D exists; the only Form D is the INVEXT investor SPV, which is not recorded.
- The Series B is not closed (the company "prepares to close"). It has no amount, and the $250M target is not counted.

## Residual doubts
- The 2024 extension tranche (about $53.5M implied) has no dated event.
- The Milestone amount per company is unknown. A FY25 USAspending recipient listing (ALN 81.049, fusion keywords) shows TYPE ONE ENERGY GROUP at $4.5M, but that is not award-level, so it was not added.
- The convertible note is kept as instrument `other`.
