# Probe: DOE programme pages (card: docs/sources/doe-programs.yaml)

## Access
- energy.gov is Drupal, public, robots permissive; every page archived with 1 req/s without blocks. No API or feed. `sitemap.xml` is a 50-page index (about 99,500 URLs, `938d6e13e0e1`) but last regenerated 2026-04-20, so recent announcements are missing from it. Slugs are unpredictable: guessed `/science/fes/milestone-based-fusion-development-program`, `/science/fes/fusion-innovation-research-engine-fire-collaboratives`, `/ne/nuclear-fuel-supply` returned 404 (`01c5cf2a934b`, `92a9fae48574`). Discovery route that worked: grep the sitemap for programme words plus follow links from the ARDP page.
- Dates are in page chrome; pages carry "View Next/Previous Press Release" lines that give neighbouring dates (not parsed here).
- Licence: US government work.

## Programmes and what they yield (all archived)
| Programme | URL (archived sha) | What it gives |
|---|---|---|
| ARDP landing | https://www.energy.gov/ne/advanced-reactor-demonstration-program (`a877cc91d17f`) | structure: Advanced Reactor Demonstrations, Risk Reduction, ARC-20; links to awards articles |
| ARDP demos | https://www.energy.gov/ne/articles/us-department-energy-announces-160-million-first-awards-under-advanced-reactor (`51c14e4204af`) | "TerraPower LLC (Bellevue) and X-energy (Rockville) $80 million each in initial funding"; programme total $3.2B over seven years subject to appropriations, industry matching |
| ARDP risk reduction | .../energy-departments-advanced-reactor-demonstration-program-awards-30-million-initial (`2c7fc612a074`) | five teams, $30M FY20. **Kairos Hermes: total award value over seven years $629 million, DOE share $303 million**; Westinghouse eVinci $9.3M total/$7.4M DOE; BWXT BANR, Holtec, MCRE (Southern) follow |
| Milestone-Based Fusion Development + FIRE | https://www.energy.gov/articles/us-department-energy-announces-selectees-107-million-fusion-innovation-research-engine (`69b6dcec82c9`) | FIRE: six projects $107M of $180M anticipated (INL blanket testing, U Tennessee materials, MIT materials/simulation, target injector, SRNL fuel cycle): labs/universities, no company awardees. Milestone: 8 awardees (Commonwealth Fusion Systems, Focused Energy, Realta Fusion, Thea Energy, Tokamak Energy, Type One Energy, Xcimer Energy, Zap Energy), "$46 million of federal funding initially committed", awardees "collectively raised over $350 million of new private funding since May 2023"; per-company amounts not given; company contributes more than 50% of milestone cost; payment on verified milestone. Helion, TAE are not in the programme |
| HALEU allocation round 2 | https://www.energy.gov/articles/us-department-energy-distribute-next-round-haleu-us-nuclear-industry (`04760c24bff7`) | conditional commitments to Antares Nuclear, Standard Nuclear, Abilene Christian University/Natura Resources; says round 1 went "to five companies earlier this year" (round 1 article not fetched, so names unverified here). Allocations are material, not dollars |
| HALEU criticality benchmarking | .../us-department-energy-awards-17-million-first-round-haleu-criticality-benchmarking (`b790e35bdc52`) | $17M to 16 projects (recipient detail not extracted) |
| Reactor Pilot Program | https://www.energy.gov/articles/department-energy-announces-initial-selections-new-reactor-pilot-program (`d92aed237e3d`) | 11 projects named in text: Aalo Atomics, Antares, Atomic Alchemy, Deep Fission, Last Energy, **Oklo**, Natura Resources, **Radiant Industries**, Terrestrial Energy, Valar Atomics (page says 11; ten names in text); target criticality by 2026-07-04; "Each company will be responsible for all costs": no federal money |
| GAIN vouchers | https://www.energy.gov/ne/articles/orano-and-terrapower-awarded-gain-vouchers-help-advance-nuclear-technologies (`9016bf37d12b`); 4 vouchers incl. Antares, Nano Nuclear (`0bc6147aa755`); recycling (`0b19b583b8d6`) | "GAIN voucher recipients do not receive direct financial awards"; labs are paid; min 20% recipient cost share. TerraPower voucher: chlorine-isotope neutron measurements at LANL for MCFR. Voucher dollar value not stated on these pages |
| INFUSE | https://infuse.ornl.gov/ (`5b3fd345a954`, 399 kB) | separate FES/ORNL portal; awardee lists in page, not parsed (JS-heavy?); INFUSE-linked USAspending grant seen: Florida State Univ DESC0025436 "Type One Energy collaboration" $374,244 |
| LPO | https://www.energy.gov/edf/articles/record-decision-issuance-loan-guarantee-holtec-palisades-llc (`1739f378a255`), portfolio `8c98535ee587` | Holtec Palisades loan; disbursement announcements numbered 1 to 6 exist in sitemap; cross-check with USAspending DELP0000153 $1.45B |

## Per-company
| Company | Items found |
|---|---|
| Commonwealth Fusion Systems | Milestone Program awardee (amount undisclosed; no USAspending row) |
| Helion Energy | nothing in DOE programmes sampled (ARPA-E ALPHA 2014 only) |
| Zap Energy | Milestone Program awardee (amount undisclosed) |
| TAE | none |
| TerraPower | ARDP $80M initial (page above), cost share and total in USAspending ($1.70B obligated); GAIN voucher (MCFR) |
| X-energy | ARDP $80M initial; USAspending shows $921.7M obligated |
| Kairos Power | ARDP risk reduction, $629M total / $303M DOE (the only public per-company figure for this award) |
| Oklo | Reactor Pilot Program selection (no money), pre-existing ARPA-E ONWARDS, GAIN history not checked |
| Radiant | Reactor Pilot Program selection; HALEU round 1 recipient per prior reporting (unverified here) |
| Aalo | Reactor Pilot Program selection |

## Gotchas
Programme announcements give "total award value" (including industry share) and "DOE share" differently across articles; ARDP numbers are ceilings over 7 years, obligations come from USAspending; pilot/HALEU/GAIN are in-kind, so must not be counted as funding amounts; a `non_cash` agreement kind is required. Press releases name company (legal name varies) with no identifier; FAIN absent.

## Adapter sketch
Curated list of programme URLs plus a watch of the energy.gov sitemap and the NE/FES/LPO news listings (diff by lastmod), fetch new `/articles/` pages whose title matches programme keywords, extract `dateline`, companies and `$` amounts with a regex + LLM structured extraction into candidate `Agreement` rows flagged `programme_announced`; join to USAspending by company + date window. Table pages (selectee lists) are small, so a per-programme parser is cheap. Effort: 3 to 4 days including review queue, because extraction is the weak step.
