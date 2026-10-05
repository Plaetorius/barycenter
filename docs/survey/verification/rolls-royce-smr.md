# Verification: rolls-royce-smr

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 1 correction.

## Issues found and fixes
1. **NWF loan** (up to GBP599M, 2026-04-13): the source says NWF is "making a loan of up to £599M available" and that it "would be issued" at market rates. That is a facility with no evidenced drawdown, so it is now `amount_kind: ceiling`, not new money.

## Checked, no change
- GBP195M launch equity (2021-11-09, WNN): the investors are Rolls-Royce Group, BNF Resources UK and Exelon Generation, all named in the quote. QIA is correctly left out: no dated source puts it in this round.
- GBP210M UKRI grant: from a gov.uk primary, a separate event from the equity.
- CEZ 20% stake (2024-10-29): no amount was recorded, which is correct.
- GBE-N contract: an agreement with no value, which is correct (GBP2.6bn is GBE-N's allocation, not an award).

## Residual doubts
- The NWF loan rests on press (New Civil Engineer) only. No gov.uk or NWF page is archived.
- The GBP195M is committed "over about three years". How much has been paid in is unknown.
- It is not evidenced whether CEZ bought new shares or existing ones.
