# Probe: Germany (Foerderkatalog, BMFTR fusion action plan, SPRIND)

Date 2026-10-05. Card `docs/sources/foerderkatalog.yaml`.

## Access
- `foerderportal.bund.de` returns **HTTP 403** to BarycenterBot for both `/robots.txt` and `/foekat/jsp/StartAction.do` (curl and archive tool; manifest sha `ab7686230701`). Marked `access: manual`; no workaround attempted. A search-engine snippet of the page describes it: >310,000 Vorhaben of BMFTR, BMUKN, BMWE, BMLEH, BMV, BMJV; only projects ministries release; no Laender or other funders. Fields (FKZ, recipient, Foerdersumme, term, topic) and any CSV export are **not verified**.
- Foerderdatenbank (different DB, schemes not awards) has an open XML export per its FAQ; irrelevant to awards.

## What primary data exists instead (BMFTR press releases, archived)
- 2026-07-29: BMFTR decision on three Fusion Hubs, EUR ~125M first round, funding from August 2026, six phases to 2029 (`d8902313d633`, `4d4f0eb08905`): VEGA (laser fusion; coordinated by Marvel Fusion and Focused Energy; sites Hamburg/Schleswig-Holstein and Biblis, Hesse), STRIDE (stellarator; Proxima Fusion, Gauss Fusion, Max Planck IPP), third hub on fuel cycle and materials. Per-company split undisclosed. Marvel release `fcc7cd26501e` confirms role. Milestone-based funding for companies is "next building block" (planned).
- Action plan approved by cabinet 2025-10-01: >EUR 2bn for fusion to 2029 incl. EUR 755M from the infrastructure fund (NEI, reported secondary).
- Bavaria: MoU with Proxima, RWE, IPP 2026-02-26; potential state contribution up to EUR 400M (Proxima release `b1ff584f345d`, reported/company); Bavaria High-Tech Agenda EUR 400M mentioned in trade press.
- SPRIND appears as an investor in Proxima's 2026-07-07 round (company release); SPRIND challenge funding amounts not probed.
- Company-stated public totals: Proxima "EUR 95M public grants"; Marvel "EUR 215M public cooperation projects" of EUR 385M total (company releases, `reported`).

## Per company
Proxima, Marvel, Focused Energy, Gauss Fusion: hub participation (EUR undisclosed each) plus CORDIS EIC grants (see cordis probe). No Foerderkatalog row seen (blocked). Others: n/a.

## Adapter sketch
Manual-upload fetcher for Foerderkatalog searches by recipient (human saves CSV/HTML, archived and hashed). Auto: BMFTR press-release RSS/HTML -> claims with programme totals and `undisclosed` per-company amounts. Ask the ministry/Projekttraeger for permitted access (they may offer a data export). Effort 1 day manual path, 2 days if access is granted.
