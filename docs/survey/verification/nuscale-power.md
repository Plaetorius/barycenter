# Verification: nuscale-power

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 9 corrections.

## Issues found and fixes
1. **ATM programmes counted as money raised**: the six ATM events (Aug 2023 $150M, Nov 2024 $200M, Aug 2025 $500M, Nov 2025 $750M, Feb 2026 $1B, Aug 2026 $750M) defaulted to `new_money`. All six are now `amount_kind: ceiling`, so $3.35B of programme maximums is no longer counted.
2. **Realised proceeds added** (VERIFY rule 6), both from primary filings:
   - `nuscale-atm-sales-fy2025`: gross $1,327.6M (net $1,299.7M) across the 2024, Q3 2025 and Q4 2025 programmes. Source: FY2025 10-K, dated 2026-02-26.
   - `nuscale-atm-sales-2026-02-programme`: about $1B (`approx`). The Aug 2026 424B5 says "completed sales of all shares … available under our prior 'at the market offering' program pursuant to our sales agreement, dated as of February 26, 2026", and that programme's ceiling was $1B.
3. **CFPP award DE-NE0008935 removed**: the recipient is CFPP LLC (UAMPS), a different legal entity, and the USAspending record does not name NuScale as recipient or beneficiary. The figures ($164.7M obligated, $145.5M outlaid) and snapshot c860ee0c4152 are kept in `notes` so the award can be attributed to CFPP LLC.

## Checked, no change
- SPAC: the Spring Valley IPO ($230M) and the PIPE ($235M) are `duplicate` of the closing contribution ($145,497,965). The quotes match.
- DOE: five USAspending cooperative agreements to NUSCALE POWER LLC ($585.9M obligated in total) match their JSON. The 10-K "more than $578.3 million from DOE" is `cumulative` and not counted.
- The ENTRA1 PMA ($35M to $55M) and the CFPP tri-party LLM purchase ($32.3M) are outflows from NuScale and are correctly recorded as agreements.

## Residual doubts
- Realised ATM proceeds are not evidenced for 2023 to 2024 (the Aug 2023 programme, and calendar-2024 sales under the Nov 2024 programme) or for the Aug 2026 programme. The FY2023 and FY2024 10-Ks and the 2026 10-Qs are not archived.
- The Feb 2026 programme figure is "all shares sold" against a $1B ceiling. The filing gives no exact gross figure.
- No DOE press announcements could be retrieved (the URLs returned 404). Pre-SPAC private rounds are not evidenced.
