# Verification: terrapower

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 5 corrections.

## Issues found and fixes
1. **The ARDP award was counted the wrong way round**: the DOE 2020-10-13 "$80 million each in initial funding" was counted as `new_money`, while the USAspending DENE0009054 obligation ($1,696,938,130.80 obligated, $972,362,176.09 outlaid) was marked `cumulative` and not counted. Both describe the same award.
   - The USAspending event is now `new_money`.
   - The $80M event is now `duplicate`, with `supersedes: terrapower-ardp-natrium-usaspending`.
2. **US SFR OWNER LLC identity**: I added evidence that the USAspending record's recipient address is 15800 Northup Way, Bellevue WA (TerraPower HQ), under ARDP FOA DE-FOA-0002271, and DOE names TerraPower LLC as the ARDP awardee. On that basis I treat US SFR OWNER LLC as TerraPower's project entity, and `notes` says so. Its ownership is not evidenced.
3. **2022 first-phase qualifier**: changed from `over` to `exact` $750M. The Nov 2022 release says the first phase "secured $750 million", and I added that quote. The $80M extension stays a separate event, and the $830M total is not an event.
4. **KHNP 2026 event**: now `duplicate`, superseding the 2022-08 raise. KHNP invested "through SK's previously announced $250 million investment", so this is no new money.
5. **Pennsylvania $10M grant removed**: the recipient is TerraPower Isotopes, a separate entity, and the source does not name TerraPower LLC. The grant date is also unknown (the source is a groundbreaking release dated 2026-05-06). The facts are kept in `notes`.

## Checked, no change
- The 2025 $650M raise (no lead stated; NVentures, Gates and HD Hyundai participate), SK's $250M participant amount, the ARPA-E DEAR0001612 and DOE DENE0008924 USAspending awards, and the GAIN voucher (no amount) all match their quotes.
- Agreements are not counted as funding. The Meta funding amount is undisclosed.

## Residual doubts
- Ownership of US SFR OWNER LLC (wholly owned by TerraPower, or with co-owners) is not evidenced. USAspending lists no parent.
- The $1.70B is an obligation; $972M has been disbursed. The full ARDP federal ceiling is not evidenced from a DOE source.
- Pre-2022 private rounds (2010 Series B and others), HALEU allocation, Wyoming money and LPO are not evidenced.
