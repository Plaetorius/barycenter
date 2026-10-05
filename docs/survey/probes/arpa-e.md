# Probe: ARPA-E project database (card: docs/sources/arpa-e.yaml)

## Access
The `/technologies/projects` page is a React shell (`3afe6d9677bc`, 1.7 kB). Its bundle (`7a6805d8fd4f`, 980 kB) calls Drupal JSON:API endpoints `/jsonapi/custom/index/{project,program,news,foa,...}`. The project index returns JSON:API (`application/vnd.api+json`), 50 per page, `meta.count` = 1721 projects, `links.next/last`, filter option lists (Research Area, Sub-Area...). Pages: `https://arpa-e.energy.gov/JSONAPI/custom/index/project?page%5Boffset%5D=0..1700&page%5Blimit%5D=50`; first `4fd7e52aa36c` (2.4 MB), all 35 archived (offsets 0 `e769e4255074`, 1700 `b2723cd015b9`). No auth, no documented limits, no official API docs: this is the site's own front end (risk: undocumented, may change). Robots allow. Public-domain US government content. Alternative: `arpa-e-foa.energy.gov` (FOA system, not probed).

## Fields per project
title, `award` (USD, comma string), `release_date`, `status` (Selected/Active/Alumni/Cancelled), `location`, `state`, `organization[]` (title, type e.g. Private Company, spinoff flags), `related_programs[]` (acronym, summary), `program_director`, `term_start`, `term_end`, `partner_organizations`, `funding_organization`, project_description, `about_team`, `related_press`, drupal nid/uuid.

Fill rates over all 1,721: award 1,703 (99%), status 100%, state 100%, release_date 1,435 (83%), term_start 745 and term_end 743 (43%), follow-on `funding` 12 (0.7%). No UEI, no DOE award number: join to USAspending by organization name + award amount/date (names differ: "Commonwealth Fusion Systems (CFS)").

## Per-company
| Company | ARPA-E project | Program | Award (selection) USD | Released | Status | Term | USAspending match |
|---|---|---|---|---|---|---|---|
| Commonwealth Fusion Systems (CFS) | nid 3482 | BETHE | 2,390,000 | 2019-11-07 | Alumni | not set | DEAR0001259 obligated 1,288,316.58 |
| Helion Energy | nid 3375 | ALPHA | 3,971,263 | 2014-08-24 | Alumni | not set | DEAR0000563 3,971,263 (exact) |
| Zap Energy | nid 4198 | OPEN 2018 | 6,767,334 | 2017-12-13 | Alumni | 2019-07-30 to 2022-07-29 | DEAR0001010 6,767,334 (exact) |
| Zap Energy | nid 4014 | BETHE | 1,000,000 | 2019-11-07 | Alumni | 2020-07-01 to 2023-06-30 | DEAR0001260 999,189.16 |
| TerraPower | nid 3642 | ONWARDS | 8,550,000 | 2021-05-19 | **Cancelled** | none | no matching obligation found; the TerraPower DEAR0001612 $2.47M (2022) is a separate ONWARDS-labelled award |
| X-Energy | nid 3753 | GEMINA | 5,834,931 | 2019-10-02 | Alumni | 2021-01-05 to 2023-10-07 | DEAR0001292 5,251,693.96 |
| Oklo | nid 3794 | ONWARDS | 3,999,836 | 2021-05-19 | Active | none | DEAR0001696/1619/1606 sum 2.7M |
| Kairos, Radiant, Aalo, TAE | none | | | | | | |
Programme counts in the table: BETHE 18, GAMOW 14, CHADWICK 12, ONWARDS 11, GEMINA 9, MEITNER 9, ALPHA 9 (fusion and fission programmes, many to universities).

## Gotchas
- Selection amount != obligated amount; cancelled projects remain listed with their announced amount (TerraPower ONWARDS $8.55M cancelled: do not count as funding received).
- `award` strings need parsing; amounts are DOE share only (cost share in `funding_organization`/description text, not structured).
- Dates: `release_date` is announcement, `term_*` often missing; USAspending carries the real period.

## Adapter sketch
Weekly full crawl of 35 pages (about 85 MB, 35 s at 1 req/s) or incremental by `release_date` desc, stop at first page with known nids. Parse with pydantic, filter organizations in the universe or programme in a nuclear watch-list (BETHE, GAMOW, CHADWICK, ONWARDS, GEMINA, MEITNER, ALPHA, plus keyword fusion/reactor), emit `Agreement(kind=grant, amount=selection, status=...)` flagged `announced`, reconcile with USAspending obligations. Store only organization/program/amount, not contact emails. Effort: 1 day.
