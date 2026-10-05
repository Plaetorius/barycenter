# Probe: France 2030 laureates ("Reacteurs nucleaires innovants") and Bpifrance

Date 2026-10-05. Card `docs/sources/france2030.yaml`.

## Access
HTML/PDF only. No machine-readable laureate dataset found (data.gouv.fr API search for "France 2030 laureats" returned 1 unrelated dataset; "Bpifrance aides innovation" 0). Pages archived: DGE laureate page `dd584c2ad4e0`; press kit 2024-03-21 `a748ad8f0968`; press kit 2026-03-11 `40ab2a0ac4b8`. Robots: allowed. Operator is Bpifrance; its per-project aid is not published as open data in anything I found (Bpifrance sites not probed).

## Facts (official, `disclosed` at tranche level only)
- AAP no. 1 "Reacteurs nucleaires innovants": launched 2022-03-02, closed 2023-06-28; 15 submitted, 11 selected, EUR 129.8M total (press kit); phase caps EUR 10M / 80M / 300M (Assemblee Nationale report).
- Tranches: 2023-06-09 XAMR (Naarea) + Newcleo LFR-30 = EUR 24.9M together; 2023-11-27 six laureates (Jimmy Energy, Otrera Nuclear Energy, Renaissance Fusion, Calogena, Blue Capsule, Hexana) = EUR 77.2M (+ CEA EUR 18.9M); Jan-Feb 2024 three (Stellaria, Thorizon, Taranis) = EUR 27.8M (announced 2024-03-21).
- "Temps 2" (press kit 2026-03-11): Calogena and Jimmy selected for complementary subsidies + repayable advances; "over EUR 180M of investment mobilised" for the two first laureates of the "Premiers reacteurs innovants" scheme; no per-company figure.
- Per-company amounts: **undisclosed** officially. Company statement: Thorizon EUR 10M (WNN, archived `f69527602aa4`, `reported` from company). Inconsistency: EUR 27.8M is quoted both as the last-three tranche and as CEA support to nine projects; resolve before quoting.

## Per target company
Naarea (XAMR, 2023-06-09), newcleo (LFR-30, 2023-06-09; French entity), Jimmy (2023-11-27; Temps 2 2026-03-11), Stellaria (2024-01/02), Thorizon (2024-01/02; EUR 10M company-stated), Hexana (not target). Blue Capital/Blue Energy: no match, likely Blue Capsule. Proxima/Marvel/Gauss/Focused/Copenhagen/Steady/UK firms: not eligible/not found.

## Adapter sketch
Page-level fetcher on the DGE/gouv.fr laureate pages and press-kit PDFs -> LLM/regex extraction to `grant` claims with `amount: undisclosed`, announcement date, programme, and tranche total as a note; human review. Add Bpifrance press search later. Effort 1 day; low yield beyond the laureate links.
