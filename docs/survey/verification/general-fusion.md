# Verification: general-fusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. `ledger check` OK.

## Issues found and fixes (8)
1. **CNL + BDC CA$20M (Aug 2024)** was the same money as the July 2024 US$15.8M secured convertible notes. 2024 financing inflows were only those notes plus US$1.5M of SIF warrants. It is now `duplicate` of `general-fusion-convertible-notes-2024`, with the cash-flow quote as evidence. The notes later converted into Class B Series 2 shares in the rights offering. That conversion was non-cash and is not in the US$18.4M.
2. **Spring Valley III IPO US$230M** was `new_money`. It is the SPAC's own trust, and 21,075,896 of 23,000,000 shares were redeemed. It is now `ceiling`, with the redemption and "assuming no redemptions" quotes added.
3. **valuation_post_usd US$1B removed** from the SPAC listing. The figure was pro forma "assuming no redemptions" and about 92% was redeemed. The quote is kept and relabelled.
4. **PIPE: Alyeska changed from lead to participant.** The 8-K names only an unnamed "Anchor PIPE Investor". The 20-F shows Alyeska holds 7.84M of the 10.56M PIPE units, so it is very likely the anchor, but this is inferred. A PIPE-warrant quote is added.
5. **Series E: Jeff Bezos, Tobias Lütke and Kam Ghaffarian removed.** The release calls them part of the company's "portfolio of important individual investors", not Series E participants.
6. **2019 round_label "Series D" replaced.** The quote only says "latest round of financing".
7. The SIF cumulative event now has evidence that **CAD 74.3M was actually received** by 2026-06-02, equal to the agreement value. The SIF increments are real money.
8. A note now says INFUSE vouchers fund the national lab (SRNL), not General Fusion.

## SPAC / PIPE: funded vs announced
- Funded: the PIPE (about US$105M announced; 10,556,367 units at $10.20 is about US$107.7M; anchor funding was a closing condition) and the residual SPAC trust after redemptions.
- Announced only: the US$230M trust and the US$1B pro-forma value.
- The residual trust cash is not stated in any snapshot. The company says it had about US$150M of cash at listing; FusionX says US$127M net.

## Doubts
- The 2019 US$65M comes from a Globe and Mail digest. POWER says ">$100 million", probably in CAD or including other money.
- SAFEs: US$44.5M (SEC) vs US$51.1M (Canadian filings via TechCrunch).
- The prospectus is internally inconsistent: it says the final SIF CAD 5M was fully received and elsewhere that CAD 3.9M had been funded.
- Series A to C are missing.
