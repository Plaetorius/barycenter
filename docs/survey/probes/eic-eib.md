# Probe: EIC Fund, EIB, EU Innovation Fund

Date 2026-10-05. Card: `docs/sources/eic-eib.yaml`. Tier B (releases). Equity side only reachable through company or investor releases.

## Access
- EIC Fund page `https://eic.ec.europa.eu/eic-fund_en` (archived `adeb50969040`): EUR 1.4bn+ signed, 300+ companies, "browse all companies that received grants and/or equity" (a portfolio search UI; no per-deal amounts or bulk file found).
- No API/bulk found for EIC Fund or EIB deals in this probe. EIB project database and EU Innovation Fund project list (Excel) were **not probed**.
- Robots: eic.ec.europa.eu robots has only Drupal internals.

## What was found (disclosed or reported; per-investor split undisclosed unless stated)
| Company | Item | Amount | Date | Evidence |
|---|---|---|---|---|
| Marvel Fusion | Series B extension; investors EQT Ventures, Siemens Energy Ventures, **EIC Fund** (first EIC Fund fusion equity), existing Tengelmann, Bayern Kapital | extension ~EUR 50M; round total EUR 113M; per-investor undisclosed | 2025-03-27 | company release `fa0cfb4fd50c` (disclosed); law firm note (FYB) corroborates |
| Proxima Fusion | EUR 411M round led by XTX Ventures and East X Ventures; RWE, Google; KfW Capital, SPRIND, Burda; returning incl. **EIC Fund**, Bayern Kapital, CDP Venture Capital; "EUR 95M in public grants" (company statement) | EUR 411M total (EIC share undisclosed) | 2026-07-07 | company release `b1ff584f345d` (disclosed) |
| Proxima, Marvel | EIC Accelerator awards (grant + equity option); Proxima "EUR 17.5M" | grant EUR 2.47M / 2.49M visible in CORDIS | 2024-07-15 | FusionXInvest `a1346d7ce107` (reported, press); CORDIS (disclosed) |
| Steady Energy | **EIB** convertible loan up to EUR 40M via 3North Partners reverse listing (EIB's first SMR financing); Business Finland loan EUR 10.5M; EUR 32M round | up to EUR 40M; EUR 10.5M; EUR 32M | 2026 (IPO doc, 2026-10-02 timeline); 2026-06-18; 2025-07-01 | `450ad2ad2db8`, `cea33c83d8b6` (company/issuer, disclosed) |
| Copenhagen Atomics | EIC Accelerator grant | EUR 2.5M (CORDIS) | 2026-01-01 start | CORDIS `f7c28655c0c8` |

## Gaps
No fill rate computable (no structured feed). EIC Fund and EIB state the instrument but rarely the amount per company; use company release as the record and `EIC Fund` as an investor link with `amount: undisclosed`.

## Adapter sketch
Not a fetcher: seed claims from company newsrooms (source 17) and add an `eic-fund` portfolio-page snapshot (manual or Scrapling) to validate that the EIC Fund link exists. EIB: add a watch on eib.org press releases filtered to nuclear/fusion (not tested). Effort: 0.5 day for portfolio snapshot, EIB and Innovation Fund 1 day each once endpoints are verified.
