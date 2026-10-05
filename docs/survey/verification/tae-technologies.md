# Verification: tae-technologies

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. `ledger check` OK.

## P2 compliance
All tae.com facts use Wayback copies with `original_url` set. Each amount is backed by an independent source: the SEC TMTG 8-Ks and S-4, CNBC or TechCrunch.

## Issues found and fixes (5)
1. **Series 12 double count.** The SAFE event ($97.6M), Series 12 FY2025 ($146.6M), Series 12 FY2026 ($56.8M) and the June 2025 ">$150M" release were all `new_money`, which summed to about $451M. The S-4 says the $146.6M already includes the non-cash conversion of the SAFEs ($97.6M) and of short-term notes ($30.0M). The SAFE event is now `duplicate` of `tae-series-12-fy2025`. The S-4 conversion quote is added as amount evidence.
2. **June 2025 ">$150M" release** is the 12th round (TechCrunch), so it is the same Series 12 money. It is now `duplicate` of `tae-series-12-fy2025`. Series 12 now counts $203.4M.
3. **TMTG convertible note, tranche 2** ($100M, up_to) was `new_money`. The amended note of 2026-09-30 shows it is still only a drawdown right, so it is now `ceiling`, with that evidence added. Tranche 1 ($200M, funded 2025-12-19 per the S-4) stays `new_money` (debt).
4. **2021 $280M round_label "Series G"**: the S-4 quote only lists share series and does not tie Series G to 2021. The label is replaced and the TechCrunch byline date is added.
5. Notes record the verifier's findings below.

## SPAC / merger / PIPE / convertible
- The TMTG merger is all-stock and not closed (expected Q4 2026). It is recorded as `valuation_only` (">$6B", CNBC). That figure may be the deal value rather than TAE's own valuation.
- TMTG's May 2025 PIPE and its $1B convertible notes appear in the S-4. They are TMTG's own financing and are correctly **not** recorded as TAE money.
- Money TAE actually received from TMTG: $200M (tranche 1). Committed but undrawn: $100M.

## Doubts I could not resolve
- The 2007 $40M and Rusnano 2012 rest on Wikipedia citations only.
- `tae-series-12-fy2026.announced_on` (2025-04-01) is a fiscal-year placeholder, not a release date.
- G-2 participants Reimagined Ventures and TIFF are named as "most recent investors", not explicitly as G-2 investors.
- The DOE awards ("over eight") have no amounts.
- The TAE Power Solutions Series A was raised by a subsidiary; its total ($45.3M in the related-persons table) covers related persons only.
