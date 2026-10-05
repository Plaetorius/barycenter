# USAspending supplement merge (2026-10-05)

By: merge-verifier-agent (opus). Sources: `docs/survey/usaspending-supplements/*.yaml`, `docs/survey/usaspending-reconciliation.md`.
All 11 ledgers re-checked with `barycenter.ledger check` (all OK), and each verification block was re-signed (status verified; the earlier sign-off is kept in the note).

## What changed in each ledger

| Ledger | Added | Skipped (already in ledger) | Other changes |
|---|---|---|---|
| centrus-energy | Event DE-NE0000530 (2012 cascade demo, 147.95M obligated, parent Centrus/USEC). Agreement: LEU IDIQ report task order 89243225FNE400178 (0.5M) | 89303519CNE000005 (= HALEU Demonstration event), 89243226FNE400212 (= 900M HALEU task order event), 89243223CNE000030 (= HALEU Operation events; 332.0M cumulative, noted) | obligated/disbursed set on the demo (172.97M / 107.36M) and the task order (900M / 0); note corrected: an LEU task order to ACO now exists |
| curio | Event DE-AR0001695 (100,107 obligated, 30,007 outlaid) | none | The 5M ARPA-E NuCycle selection was re-kinded to `ceiling`. It is the same CURIE award, and only 100k of it is obligated (R7 / VERIFY rule 6) |
| general-matter | Agreement: LEU IDIQ report task order 89243225FNE400179 (395,254.90) | none | USAspending evidence attached to the 900M task-order agreement (contract 89243226FNE400213). **Still no funding event, so still unpublishable (D1)**: the supplement contains contracts only, with no grant or OTA |
| global-laser-enrichment | Agreement: LEU IDIQ report task order 89243225FNE400180 (376,893.74) | DE-NE0009559 (= DOE 28M award) | 28.44M obligated and 3.01M outlaid attached to the DOE event |
| holtec-international | 4 events to Holtec Government Services LLC: ARDP SMR-160 DE-NE0009055 (104.15M), DE-NE0008833 (5.01M), DE-NE0008843 (0.18M), consent-based siting DE-NE0009336 (1.99M) | DELP0000153 Palisades loan | Not evidenced: that HGS is a subsidiary of Holtec (the ARDP description names Holtec International) |
| lis-technologies | Agreement: LEU IDIQ report task order 89243225FNE400182 (0.5M) | none | none |
| marathon-fusion | Event: ARPA-E OPEN 2024 DE-AR0002075 (3.63M obligated, 0.24M outlaid) | DE-AR0001790 (= CREATE event) | 449,065.26 obligated attached to CREATE as disclosed evidence |
| moltex-energy | 2 ARPA-E events to Moltex Energy USA LLC: MEITNER (239k) and GEMINA (19.7k) | none | The note "only a negative transaction" is superseded |
| nuscale-power | none | all 5 FAINs already present | disbursed_usd set for 0008928, 0008820 and 0008369; left unset for 0000633 and 0008742, where outlays show 0.0 |
| terrestrial-energy | 3 DOE-NE events to Terrestrial Energy USA, Inc. (495k, 299k, 500k). Agreement: Reactor Pilot OTA DENE0009580 (USD 0) | none | Fixed a shell-mangled "$0.0" in the supplement summary and replaced a non-specific quote |
| ultra-safe-nuclear | 2 DOE SC grants: DE-SC0021948 (196k, recipient USNC-Technologies, separate UEI) and DE-SC0022735 (199k) | none | Not evidenced: that USNC-Tech is a subsidiary |

Totals: 14 events added, 5 agreements added, 1 event re-kinded (Curio, to ceiling) and obligated/outlay data attached to 8 existing events or agreements. Skipped as duplicates: 11 supplement items (5 NuScale, 3 Centrus, GLE DE-NE0009559, Marathon DE-AR0001790, Holtec DELP0000153).

## Rules applied
- The counted amount is the USAspending `Award Amount`, which is the cumulative obligation, with `obligated_usd` set. `disbursed_usd` comes from `Total Outlays` when that field is present and non-zero, except on new awards where 0 is a real value. Outlays are reported only from FY2017/FY2020, so they can understate payments on older awards.
- A DOE or ARPA-E announced or selected amount that is far above the obligation is a `ceiling` (Curio). Where the announcement matches the obligation, one event carries both (GLE, Marathon CREATE).
- DOE procurement task orders (LEU/HALEU IDIQ) are `gov_contract` agreements, not funding.
- A subsidiary operating company counts as the company, with a note in `notes` (Holtec Government Services, Terrestrial Energy USA, Moltex Energy USA, USNC-Tech). A project SPV would not count.

## Open points for review
1. General Matter is still unpublishable. The only DOE money is a 900M HALEU task order, which this ledger treats as an agreement. The Centrus ledger records the parallel 900M ACO task order as an event (`other`, up_to), so one rule should be chosen for both.
2. Holtec Government Services LLC and USNC-Technologies are linked to their parent company by name and description only.
3. Curio's 2026 USD 2.5M ARPA-E follow-on is still unrecorded (its source could not be archived).
