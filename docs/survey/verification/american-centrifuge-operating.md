# Verification: american-centrifuge-operating

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Evidence status: **verified**. 4 agreements, 0 events. `ledger check` OK.

## Findings
- Award IDs, the recipient (AMERICAN CENTRIFUGE OPERATING, LLC), obligations and first-obligation dates all match the contract search. There is one row per award.
- The agreement values are obligations to date, not ceilings. I added outlays to each summary, with a quote (**4 corrections**):

  | Contract | Obligated | Outlaid |
  |---|---|---|
  | 89303519CNE000005 | $173.0M | $107.4M |
  | 89243223CNE000030 | $332.0M | $294.4M |
  | 89243225FNE400178 | $0.5M | $0.15M |
  | 89243226FNE400212 | $900M | $0 (milestone-paid) |

- The contracts are DOE purchases of HALEU and enrichment services. They are correctly recorded as agreements, not funding.

## Scope
- ACO is a wholly owned Centrus subsidiary. It is not a separate company.
- It has no funding events, so under D1 it must not ship as an entity.
- `centrus-energy` already carries these contracts through its USAspending ACO total (b121). Flagged for merge in notes; nothing merged.
