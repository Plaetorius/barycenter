# Verification: centrus-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (19 events). `ledger check` OK.

## Issues found and fixes (11, plus 5 added events under check 6)
1. **ATM ceilings.** Three programmes are now `amount_kind: ceiling`:
   - Dec 2020, $50M. A Dec 2022 supplement added $24M; that quote is relabelled `ceiling_increase_2022`.
   - Feb 2024, $100M, raised to $200M.
   - Nov 2025, $1B.
2. Feb 2024 ATM: the `announced_on` quote did not contain a date. I replaced it with the supplement's own date line ("February 9, 2024") and kept the $100M quote as `amount_initial`.
3. **Actual ATM sales added** (all gross):

   | Period | Amount | Programme | Source |
   |---|---|---|---|
   | to 2022-12-05 | ~$48M | Dec 2020 supplement | 424B5 of 2022-12-05 |
   | 2023 | $24.4M | Dec 2020 agreement | FY2025 10-K |
   | 2024 | $56.7M | Feb 2024 agreement | FY2025 10-K |
   | 2025 | $533.6M | Feb 2024, then Nov 2025 agreement | FY2025 10-K |
   | Q2 2026 | $55.0M | Nov 2025 agreement | 10-Q filed 2026-08-06 (new snapshot 3f1219d4) |

   Cross-check: $1B minus the $554.5M remaining at 2026-06-30 gives $445.5M sold under the Nov 2025 programme. The figures in the table are consistent with that.
4. **Convertible notes.** Instrument `debt` and the dates are confirmed. I added `closed_on` evidence from the 10-K for both issues:
   - 2.25% notes due 2030: $402.5M, priced 2024-11-05, issued 2024-11-07.
   - 0% notes due 2032: $805M, announced 2025-08-12, issued 2025-08-18.
5. **HALEU Demonstration $115M**: changed to `up_to`. The 2019 8-K says DOE reimburses "up to 80 percent ... up to a maximum amount of $115 million". I added that quote. The 10-K says the contract was later funded up to $173M.
6. **$900M HALEU task order (2026-06-30)**: changed to `up_to`. It is paid as performance-based milestone payments.
7. **The two USAspending totals.** Both rows have the same recipient hash (d527144c, American Centrifuge Operating, LLC):
   - The "CENTRUS ENERGY CORP." text search returns $197.4M. It only matches the subset of ACO transactions whose records carry the Centrus name.
   - The ACO recipient search returns $1.376B. It is the more complete figure.

   I marked c235 (the $197.4M row) `duplicate` of b121 (the $1.376B row). b121 stays `cumulative` and is not counted. It includes procurement contract obligations, which plausibly sum to about $1.3B (demo + operation + increments + $900M task order).
8. Notes updated for items 3 and 7.

## Doubts I could not resolve
- The ~$150M base value of the HALEU Operation contract includes Centrus's ~$30M Phase 1 cost share. No source quotes the DOE-only share (about $120M).
- The HALEU and enrichment contracts are DOE purchases of product and services. They sit closer to revenue than to funding, so treat them carefully in totals.
- The 2023 ATM figure ($24.4M) is slightly above the $24M Dec 2022 supplement ceiling.
- All DOE awards go to American Centrifuge Operating, LLC, a wholly owned subsidiary, not to Centrus Energy Corp. itself.
