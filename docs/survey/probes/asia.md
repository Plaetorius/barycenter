# Probe: Japan, Korea, China (what primary data exists)

Date 2026-10-05. Card `docs/sources/asia.yaml`. Report only; no deep dive.

## Japan (Japanese, partial English)
- MEXT SBIR Phase 3 for fusion: total JPY 6.5bn, four awardees, Helical Fusion JPY 2bn (largest) - company slide (GRIPS PDF, `reported`) and Business Wire release (2025-10-27). Primary MEXT notice (Japanese) not fetched.
- NEDO Deep-Tech Startups Support: Kyoto Fusioneering "high-power continuous millimeter-wave generator", JPY 499M, FY2024-2026, English table with phase, field and amount (`711fea036e91`, tier B, structured per company page).
- Cabinet Office (CAO) fusion task-force decks (Japanese PDFs) describe FAST (Starlight Engine/Kyoto Fusioneering); Kyoto Fusioneering release on FAST CDR 2025-11-27 (`c31ee478b9a4`). Moonshot goal 10 budget JPY 20bn / 5 years (company slide, reported).
- No API/bulk found. Company releases in JP/EN carry most amounts; Helical raised JPY 5.2bn to date (company, reported).

## Korea
Not probed. Candidates: MSIT/KFE announcements (Korean), K-DEMO; expect press-only.

## China (Chinese)
- China Fusion Energy Co. (CNNC subsidiary): registered capital CNY 15bn, launched 2025-07-22 in Shanghai; shareholders CNNC 50.35%, China Nuclear Power 6.65%, Kunlun Capital (PetroChina) 20%, Shanghai Future Fusion + National Green Development Fund 15% combined, Zheneng Electric 5%, Sichuan Heavy Industry Fusion 3%; capital increase CNY ~11.49bn at 1.0019 per registered-capital unit. Source of record is the listed-company announcement (China Nuclear Power 601985 on SSE, evening of 2025-07-22) as reported by The Paper (Chinese) and Xinhua/NEI (English, capital figure only). Not archived in this probe (search snippets), tier C until the SSE filing is fetched.
- Primary registry (National Enterprise Credit Information Publicity System, SAMR) and Tianyancha are not machine-friendly/ToS-limited: treat as manual; listed-company filings on SSE/SZSE/Cninfo are the practical primary source.

## Recommendation
Keep as tier C/B press-and-filings sources; add China via listed-company announcements only when a company in `universe.yaml` is listed-parent-backed. Needs JP/ZH-capable extraction (LLM translate-then-extract with human review). Effort 1-2 days per country for a watch list, no structured ingestion.
