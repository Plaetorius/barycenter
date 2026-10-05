# Verification: aalo-atomics

Status: **verified** (10 corrections). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **Series A participants removed (10)**: the only evidence is "Special thanks to 50Y, Valor Equity Partners, Harpoon Ventures, Crosscut, SNR, Alumni Ventures, Preston Werner, Earth Venture, Garage Capital, Wayfinder, Jeff Dean, Nucleation Capital, and more." It sits under "we'd like to thank our investors". That is a general list of backers that mixes seed investors and angels, and it does not say they took part in the $27M Series A. The names are kept in `verification.note` for later entity work.

## Confirmed
- **Forms D**: none of the 16 Aalo Forms D is recorded as an event. They are investor SPVs/syndicates (Gaingels, GV via CGF2021, HII, BBVC, CC Ltd, Solist), not company rounds.
- **"$300M+"** (aalo.com/company) is recorded only as `amount_kind: cumulative` and is never counted. No primary release exists for a round after the $100M Series B, so no Series C event is recorded. That leaves about $167M or more unexplained (300 - 6.26 - 27 - 100).
- Seed $6.26M (Fifty Years lead, Valor participating) and Series A $27M (no lead stated) come from company posts.

## Residual doubts
- The Series B ($100M, Valor lead, 15 participants) rests on TechCrunch only (basis reported). No Aalo release was reachable.
- The cumulative event uses the snapshot date (2026-10-05) as announced_on because the page is undated.
- The INL/GAIN development support mentioned by TechCrunch is not recorded.
