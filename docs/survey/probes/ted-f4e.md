# Probe: TED and Fusion for Energy (ITER) awards

Date 2026-10-05. Card `docs/sources/ted-f4e.yaml`.

## Access (verified)
- Anonymous POST `https://api.ted.europa.eu/v3/notices/search` with JSON `{"query": "...", "fields": [...], "limit": n, "page": k}`; returns `notices[]`, `totalNoticeCount`, pagination token. No key. TED robots allows notice pages; API host has no robots.txt (404).
- Query syntax used: `buyer-name="Fusion for Energy" AND notice-type=can-standard AND publication-date>=20240101`; full text `FT~"name"` (fuzzy).
- Usable fields: `publication-number`, `publication-date`, `notice-type`, `buyer-name` (multilingual map), `winner-name`, `winner-country`, `tender-value`, `tender-value-cur`, `total-value`, `contract-conclusion-date`, `notice-title`, `links`.
- Licence believed CC BY 4.0 (verify). Rate limit not read: self-limit 1 req/s.

## F4E volume and fill
390 F4E notices total; 332 since 2024-01-01; 111 `can-standard` (award) since 2024-01. In 8 sampled can-standard rows: winner-name present in 5, tender-value in 6, total-value in 5 (partial; eForms-era notices have winner lots, others only totals). Fill rate for winner identity about 60% in this sample (n=8, indicative only).

## Per-company results
| Company | Found | Detail |
|---|---|---|
| newcleo | yes | Notice **419818-2025**, buyer Istituto Italiano di Tecnologia, winner `NEWCLEO spa`, Lot 5 (chemical-physical-mechanical materials testing lab for energy-transition technologies), tender value **EUR 2,260,423.70**. Archived XML `1fd4ba17abe9`, HTML `7fb902643b06`. Date: 2025 (exact award date not extracted). `disclosed` |
| Focused Energy | no (noise) | one fuzzy hit (HAUS kehittamiskeskus, 194175-2020) unrelated |
| Others | none | Tokamak Energy, First Light, Proxima, Marvel, Thorizon, Copenhagen Atomics, Jimmy, Gauss, Terrestrial, Steady: 0 hits. Stellaria 47, Naarea 235, General Fusion 48, Moltex 9 hits are fuzzy matches on other words (checked top 3, all unrelated buyers/ITER ads) |

Conclusion: TED is low-yield for venture-backed nuclear companies; one real hit (newcleo as a lab supplier to IIT). F4E awards go to engineering/industrial suppliers (ITER) which belong to the later "Accretion" phase.

## Gaps
Winner fields sparse before eForms; value is contract ceiling not spend; `FT~` unreliable for company names. Subcontractors invisible.

## Adapter sketch
Weekly job: POST query on `winner-name` (exact, per `universe.yaml` alias list) plus `buyer-name=Fusion for Energy` can-standard. Store raw JSON per page and the notice XML for evidence. Claim type `gov_contract` with `tender-value`, buyer, notice id. Effort 1 day; ongoing review load small.
