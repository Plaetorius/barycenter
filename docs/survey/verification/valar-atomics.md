# Verification: valar-atomics (2026-10-05, claude-opus-5-5)

## Issues found
- **Double counting (main issue).** The March 2026 Bloomberg items ($340M equity, $110M debt, $2B valuation) were both `new_money`. TechCrunch on 2026-07-17 (snapshot a429e41a316e) says of the $1B Series B: "Part of that capital has been raised previously at a lower valuation ... Valar has raised $450 million, including $340 million in equity and $110 million in debt". Counting them next to the $1B adds money twice.
- The $200M credit facility was counted as `new_money`. No source says how much was drawn, so it is a ceiling.
- Credit facility date (08-04, company post) did not match the Series B date (08-03) for the same announcement.
- The Series A had only two participants (Luckey, Sankar). The CNBC snapshot already in raw (64426d34beb3) names the leads.

## Fixes
1. `valar-equity-debt-2026-03` and `valar-debt-2026-03` are now `duplicate`, with `supersedes: valar-series-b-2026` and the TechCrunch evidence.
2. `valar-credit-facility-2026` is now `ceiling` and dated 2026-08-03, with TechCrunch evidence.
3. Series A: added leads Snowpoint Ventures, Day One Ventures and Dream Ventures, plus John Donovan, with CNBC evidence for the amount and for Luckey and Sankar.

## Residual doubts
- The $110M of debt may sit outside the $1B equity (for example inside the $200M facility, or as a separate loan). It is excluded either way until a primary source settles it.
- The Series A rests on press only, because the company release could not be reached.
- Both valuations ($2B and $6B) come from Bloomberg only.
