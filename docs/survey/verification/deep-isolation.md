# Verification: deep-isolation

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**, 3 events. `ledger check` OK.

Method: every fact re-read against the archived USAspending award-level search (`spending_level: awards`, one row per award with modifications already netted). There is one event per award and there are no duplicates from modifications. "Award Amount" is the obligation to date, not a ceiling. `disbursed_usd` is "Total Outlays". `announced_on` is the first-obligation date, not a press date.

## Issues and fixes (3)
- Added evidence for `disbursed_usd` on all 3 events.
- Amounts and dates are correct:
  - DEAR0001621: $3.59M, ARPA-E ONWARDS STTR.
  - DEAR0001797: $0.44M, ARPA-E CREATE.
  - DESC0025094: $0.20M, SBIR.
- Identity: the recipient is DEEP ISOLATION US, LLC, the US operating entity of Deep Isolation Nuclear, Inc. Treated as the company and noted.

## Scope
- Deep Isolation does back-end waste disposal (deep boreholes). It is not a generation developer.
- The fission census lists it as `back_end`. Keep it only if the map covers the fuel cycle, and tag it as non-generation.

## Gaps
- Equity rounds are missing, including the ~$33M private placement listed in the census.
