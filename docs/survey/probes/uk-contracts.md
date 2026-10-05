# Probe: UK Find a Tender, Contracts Finder, UKAEA and GBE-N awards

Date 2026-10-05. Card `docs/sources/uk-contracts.yaml`.

## Access
- Find a Tender OCDS: `GET https://www.find-tender.service.gov.uk/api/1.0/ocdsReleasePackages?updatedFrom=...&limit=...` returned 200, OCDS 1.1 (archived `95457f45eabf`). Contracts Finder OCDS: `.../Published/Notices/OCDS/Search?publishedFrom=...&limit=100` returned 200. No key; robots.txt 404 on both.
- **Keyword search does not work through the OCDS endpoint:** the same 100 newest notices came back for "Tokamak Energy", "First Light Fusion", "Astral Systems", "UKAEA fusion", "Great British Energy Nuclear", "Rolls-Royce SMR". Supplier lookup therefore needs date-window harvesting plus local filter (volume not measured).
- Only 1 genuine nuclear-relevant award appeared in the 2026-10-05 window: UK Atomic Energy Authority, Corporate Clothing, GBP 175,000 to Arco Ltd (not relevant to the map).

## Programme awards (HTML, tier B) found via search
| Programme | Fact | Date | Evidence |
|---|---|---|---|
| UKAEA Fusion Industry Programme | GBP 8.1M contracts to 14 organisations for shielding/fusion fuel tech; list includes Tokamak Energy Ltd ("CAST: Cermet Advancement for Shielding in Tokamaks") and First Light Fusion Ltd ("Natural lithium shielding"); per-org amount not on page | 2026-02-02 | `1ebb611e264a` |
| UKAEA Fusion Industry Programme cycle 1 phase 2 | GBP 9.6M to six organisations, contracts GBP 460k to 1.9M | 2024-05-15 | `03ad42ed3c5d` (gov.uk) |
| UKAEA LIBRTI | GBP 200M programme; Tokamak Energy won a LIBRTI bid (company release 2025-01-22, amount not stated) | 2025-01-22 | Tokamak Energy page `3c86b1f351fe` |
| GBE-N | Rolls-Royce SMR technology-partner contract signed April 2026; GBP 2.6bn allocated in 2025 Spending Review; National Wealth Fund up to GBP 599M financing to Rolls-Royce SMR; GBE-N awarded >GBP 350M of supply chain contracts "this year" | 2026-04-13 | `bbe467088d7b` (gov.uk) |

Per target company: Tokamak Energy (FIP/LIBRTI, amounts per org not published), First Light Fusion (FIP), Astral Systems (none found), others none.

## Gaps
No per-org amounts in many UKAEA releases; contract values below GBP 25k/threshold are not in FTS; programme money often flows through Innovate UK/ARIA/NWF; NWF investments are equity/debt (investor type "public financial institution") and appear on NWF site (not probed).

## Adapter sketch
Two parts. (1) OCDS harvester: daily FTS+CF windows, filter `awards[].suppliers[].name` and `buyer.name` against alias list (UKAEA, GBE-N, DESNZ). (2) Programme-page watcher: UKAEA news and gov.uk search RSS with LLM extraction to claims and human review. Effort 2 days (1 harvester, 1 pages).
