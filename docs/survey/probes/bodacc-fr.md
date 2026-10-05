# Probe: BODACC (capital changes, insolvency) + Annuaire des Entreprises

Date 2026-10-05. Card `docs/sources/bodacc-fr.yaml`. Sample `samples/bodacc-capital-and-insolvency.csv`.

## Access
- Official bulk: DILA open data `https://echanges.dila.gouv.fr/OPENDATA/BODACC/` (index 200, archived `d89bc5dcc01e`): `FluxAnneeCourante/`, `FluxHistorique/`, docs and model PDFs; robots 404. This is the right production path (XML archives).
- Convenience mirror: Opendatasoft `bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records` (JSON, 9 datasets listed, no key). **Its robots.txt disallows `/api/`**, so the archive tool refused it (manifest row with `blocked by robots.txt`). I called it a few dozen times for the probe (same public data as the DILA flux); production should use the DILA flux, not this API.
- Annuaire des Entreprises `https://recherche-entreprises.api.gouv.fr/search?q=` (no key; archived `0849741ec426`): SIREN, creation date, status, size class, and `finances` {year: ca, resultat_net} from filed accounts.
- Licence: Licence Ouverte v2 (believed).

## Capital amounts: what exists
Records have `familleavis_lib` (Creations, Immatriculations, Modifications diverses, Depots des comptes, Procedures collectives, Radiations), `registre` (SIREN), `modificationsgenerales` (JSON with `descriptif` free text only), `jugement` (type, nature, date), and `url_complete`. A capital increase appears as "Modification survenue sur le capital" or "...(augmentation)": **date and flag only, no amount, no investor**. Creation notices (family A) may carry capital at incorporation (not sampled).

## Per company (SIREN, notices)
| Company | SIREN | Findings |
|---|---|---|
| Naarea | 882949506 | 23 notices. Capital-change notices on 2022-03-02, 2022-06-07, 2022-09-07, 2022-11-25, 2023-02-05, 2023-06-27, 2023-10-24, 2024-02-20, 2024-07-21, 2024-08-20 (10). **Insolvency:** redressement judiciaire opened 2025-09-03 (A202501753378, published 2025-09-12); conversion to liquidation judiciaire and plan de cession both judged 2026-01-15 (A202600176135/A202600176140, published 2026-01-27). Annuaire still shows status "A" and 2023 net result EUR -6,592,002 |
| Stellaria Design | 952843282 | 8 notices; capital changes 2023-12-17 and 2025-09-02; 2025 net result EUR -3,259,598 |
| newcleo (operations) | 912522240 | 13 notices; capital changes 2022-09-22 and 2024-02-01; 2024 revenue EUR 55.5M, net EUR -24.6M |
| newcleo (holding, Paris, created 2024-04-26) | 929009140 | capital increases 2024-11-12 and 2024-12-26; 2024 net EUR -49.2M. Third entity newcleo Fuel Innovations 979949153 exists |
| Hexana | 953636149 | exists (12 notices; not a target) |
| Jimmy Energy | 892884099 (Annuaire) | name search on BODACC is noisy; query by SIREN not done |
| Blue Capital / Blue Energy | no match | BODACC "BLUE CAPITAL" hits are an unrelated Paris/Marseille firm; France 2030 laureate is "Blue Capsule" |
| Thorizon (NL), Copenhagen Atomics, Steady Energy | n/a (non-French) | |

## Gaps and traps
Amounts absent; many "modifications" are not equity (capital reduction, par change); multiple SIREN per group (use CORDIS VAT -> SIREN link and Annuaire for parent/subsidiary); name noise; insolvency in BODACC is the authoritative status signal and conflicts with Annuaire's `etat_administratif`.

## Adapter sketch
Daily/weekly: download new DILA flux files; filter by SIREN list from `universe.yaml` (seeded by Annuaire + CORDIS VAT). Emit `capital_event` claims (date, notice id, "capital changed", no amount) as evidence/timing for rounds, and `status_event` for procedures collectives. Annuaire `finances` as `reported` financial snapshots. Effort 2 days.
