# Verification: pacific-fusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. `ledger check` OK.

## Issues found and fixes (4)
1. **Series A (>$900M) was `new_money` but is a milestone-tranched commitment.** The company says "committed upfront ... unlocked as we achieve predefined milestones". In June 2026 the CTO told POWER that the first two of three milestone sets were met, but no source gives the amount drawn. The event is now `amount_kind: ceiling` with `committed_usd: 900000000`, and the received-status quotes are added (POWER and TechCrunch). This matches how the Helion verifier treated milestone-contingent money. **Policy flag for the human reviewer:** if tranched VC commitments should count as raised, flip this event back to `new_money`.
2. **Albuquerque $10M incentive** is released "only when the company meets job creation milestones, with full repayment required if targets aren't met". Its qualifier is now `up_to` and its kind `ceiling` until disbursement is evidenced.
3. The **"$9M vs $10M conflict" is resolved**. CityDesk says $10M = $9M from the state (LEDA) + $1M from the city. Participant amounts are added, plus a new State of New Mexico grantor row (proposed slug `state-of-new-mexico`).
4. Notes and verification block added.

## Checked, no change
- Announcement date 2024-10-25.
- General Catalyst is the lead ("Hemant Taneja of General Catalyst led the round").
- The 14 named syndicate members come from the company post.
- The $1B / ">$1B" cumulative statement stays `cumulative`.
- The CRADA, site and MOU agreements.

## Doubts
- The ">$1B" Series A figure has no company primary source.
- Reid Hoffman appears only in EnergyCentral and not in the company's list.
- The $776.6M tax abatement is correctly not recorded.
- Actual tranche receipts are unknown.
