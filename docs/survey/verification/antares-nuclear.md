# Verification: antares-nuclear

Status: **verified** (1 correction). Verifier: claude-opus-5-5, 2026-10-05.

## Issues found and fixes
1. **$161M Space Force Strategic Breakthrough award** (2026-09-11): the company post says "Selected for $161M" and gives no contract value, obligation, period or payment, so it is an upper bound and not money received. It is now `amount_kind: ceiling` (still `up_to`), and the program field notes that it is a selection. Web search budget was exhausted, so no DoD contract announcement could be checked.

Checked and left as is: Seed $8M (Caffeinated as lead is confirmed by the Series A post), Series A $30M (co-leads Alt Cap and Caffeinated), Series C $470M = $370M equity + $100M debt from the company post (co-leads Paradigm and Caffeinated), the Series B date from the CEO letter, the $3.75M SBIR total from the company, and the GAIN voucher without an amount. The agreements carry no money.

## Residual doubts
- The Series B $71M equity / $25M debt split and the Series B investors rest on ANS Nuclear Newswire only (basis reported). The CEO letter states $96M and names no investors.
- The debt components ($25M Series B, $100M Series C) name no lender and no terms. They may be undrawn facilities and should become ceilings if that is confirmed.
- The SBIR $3.75M is not matched to USAspending/SBIR award records.
