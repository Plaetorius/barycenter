# Probe: NRC pre-application list and ADAMS (card: docs/sources/nrc.yaml)

## Access
- Pre-application list: https://www.nrc.gov/facilities-safety/new-reactors/advanced-reactors/who-were-working-with/pre-application-activities (`54c142aad56d`, "Page last reviewed/updated Friday, October 02, 2026"). Old `.html` URLs 404 or redirect; URL moved to new structure.
- Static HTML, ~40 entries grouped by technology (HTGR, LWR, MSR/MCFR, liquid metal, other) with "*" marking microreactors and an "Inactive Projects" group. Activity rule: active if a Regulatory Engagement Plan or substantial interactions; inactive after one year without activity.
- Each applicant has a sub-page with product table (title, type, ML accession, status such as Feedback Provided/Under Review/No review requested) and the docket number.
- **Akamai bot manager returned 403 "Access Denied" on 3 of 7 sub-pages** (Radiant Kaleidos `a30cba301038`, TerraPower `eed58a8e304e`, X-energy XE-100 `1b857edd1f21`) after four successful fetches at 1 req/s; contact/developer pages also 403 (`48f07015100a`). Expect to need `access: manual` fallback or slower pacing with retry.
- ADAMS: legacy `adams.nrc.gov/wba` no longer resolves (DNS error); NRC points to `adams-search.nrc.gov` (SPA shell, `73708ca537d1`, 10 kB). The ADAMS Public Search API guess `adams-api.nrc.gov/aps/api/search` returned 404 (`3494d22a0b9a`); key/registration requirement **not verified**. robots on nrc.gov: only `/site-help/search` blocked for all agents.
- Licence: US government public record.

## Per-company
| Company | On list? | Detail from archived pages |
|---|---|---|
| Aalo Atomics | yes ("Aalo Atomics – Idaho Nuclear Project", microreactor) | docket 99902128; Regulatory Engagement Plan June 2024; QA program topical report feedback provided (ML26117A134); NRC observations on DOE review of Critical Assembly Facility; ESP methodology white paper under review (ML26210A323); R-COLA engagement plan ML26258A190; page updated 2026-10-01 (`e231bedd69f0`) |
| Kairos Power | yes | pre-app since Nov 2018, docket 99902069; separate Hermes and Hermes 2 review pages; topical reports KP-TR-003..009 with feedback (`f7e15159de47`) |
| Oklo | yes ("Oklo Aurora Powerhouse", 75 MWe liquid-metal fast reactor) | docket 99902095; white papers with feedback through 2024 (`015edc20c74b`) |
| Radiant | yes ("Radiant Kaleidos", microreactor) | on list page; sub-page 403 |
| TerraPower | yes (Natrium 345 MWe sodium fast reactor with HALEU metal fuel; TerraPower LLC; MCFR) | dockets 99902100 and 99902087; page links "Kemmerer Power Station Unit 1 Application" review page (stage lives there, not fetched) (`a071434f8e93`) |
| X-energy | yes (XE-100; XENITH separate) | sub-page 403 |
| Commonwealth Fusion, Helion, Zap, TAE | no | fusion is outside this list (regulated as byproduct material, state/agreement-state route) |
Also listed: Antares, Abilene Christian, Deep Fission, Hadron, Last Energy, Natura, newcleo Americas, Terrestrial, Terra Innovatum, NANO Nuclear (UIUC), Holtec SMR-LLC, Westinghouse eVinci/AP300, Rolls-Royce SMR, etc.

## What it yields
Stage, not money: engagement start, docket, topical-report count and status, applications under review (separate pages: Hermes, Kemmerer, Long Mott, etc.). Good for the `licensing_status` facet; dockets give stable IDs. No identifiers beyond docket numbers and names. Cadence: weekly updates.

## Adapter sketch
Scrape the list page (one request) for names + group + microreactor flag, then each sub-page for dockets and product rows, 1 request per 5 s with retry/backoff and Akamai-aware fallback to manual-upload. Parse `Docket \d{8}` and `ML\d{11}`. Derive `licensing_stage` from known review pages (CP application accepted/issued, COL) via a small hand-maintained map until the ADAMS API is confirmed. Effort: 2 days; ADAMS API integration unknown (+2 days after verifying access).
