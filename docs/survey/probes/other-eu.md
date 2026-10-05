# Probe: other EU national funders (FI, SE, DK, NL, CZ, PL, IT, ES)

Date 2026-10-05. Card `docs/sources/other-eu.yaml`. Narrow probe: company and agency releases only; national open-data endpoints were **not** tested.

| Company | Funder and item | Amount | Date | Evidence |
|---|---|---|---|---|
| Steady Energy (FI) | Business Finland R&D loan for Helsinki pilot plant | EUR 10.5M | 2026-06-18 | company release `cea33c83d8b6` (disclosed) |
| Steady Energy | EUR 32M funding round (92 Ventures/92 Capital led; Tesi named in the 2026 combination as investor) | EUR 32M | 2025-07-01 | `da76a163a6a4` (disclosed) |
| Steady Energy | EIB convertible loan to 3North Partners for Steady's R&D, up to EUR 40M (first EIB SMR financing); private placement commitments ~EUR 69.8M incl. Tesi, Fortum, Elo, Ilmarinen, Varma | EUR 40M; EUR 69.8M | Sept-Oct 2026 (listing process) | `450ad2ad2db8` (issuer document, disclosed) |
| Novatron Fusion Group (SE) | St1 investment; Industrifonden (state-backed VC) among backers; EIC Pathfinder grant EUR 1,499,000 | EUR 13M (St1); EUR 1.499M | 2025 spring; 2024-11-01 | St1 release (search snippet, not archived); CORDIS |
| Thorizon (NL) | France 2030 grant EUR 10M (company); EU MIMOSA EUR 113,654 | | 2024-03; 2022-06 | WNN `f69527602aa4`; CORDIS |
| Copenhagen Atomics (DK) | EIC Accelerator grant EUR 2.5M; EUR 20M raise (press, 2023) | | 2026-01; 2023 | CORDIS; NEI snippet (reported) |

Not probed: RVO/Invest-NL, Innovationsfonden/EUDP, Energimyndigheten, TACR, NCBR, CDTI, ENEA/MIMIT. Recommendation: do not build national scrapers now; CORDIS + EIB + Business Finland/Tesi releases cover the visible money. Revisit Business Finland (project database) and Innovation Fund Denmark only if the universe adds more companies from those countries.

Adapter: company-newsroom spiders (source 17) plus a small `state_investor` watch list (Tesi, Industrifonden, Bayern Kapital, KfW Capital, CDP Venture) matched in releases. Effort negligible beyond newsroom work; national databases 1-2 days each if needed.
