# Verification: marvel-fusion (2026-10-05, claude-opus-5-5)

## Checked
- **Series B tranches.** The first close was EUR 62.8M (b2venture and TechCrunch, Sept 2024) and the extension was EUR 50M (company release, 2025-03-27). The company says these bring "the total round to EUR 113 million" (62.8 + 50, rounded). These are real tranches, not duplicates, and both stay `new_money` in `round_group: series-b`.
- The EIC Fund equity is inside the EUR 50M extension. TechCrunch says the EIC equity, "if made will be an extension of this round", so it must not be added separately.
- The EUR 385M total is correctly marked `cumulative`.
- The Series B date of 2024-09-26 is right: TechCrunch posted at 10:00 PM PDT on Sept 25, which is Sept 26 in Europe.

## Fixes
1. EIC Accelerator grant amount set to the exact CORDIS figure, EUR 2,489,221.49 (it had been truncated).
2. Notes now flag that the DOE INFUSE award is "in partnership with Colorado State University". INFUSE money normally goes to the partner institution, so it should not count as Marvel funding even if an amount turns up.

## Residual doubts
- The first-close investor list is press and investor-page only. TechCrunch and b2venture list different sets, and the ledger keeps the union.
- SPRIND's participation is press-only.
- The 2021 round, the Series A and the seed have no evidenced events.
