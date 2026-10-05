# Investor landscape (R4)

Date: 2026-10-05. Public sources only (company releases, Wikipedia, SEC filings, press). No Crunchbase, PitchBook, Dealroom or CB Insights. Files: `investors.csv` (339 investors), `investor-edges.csv` (606 investor-company links), `probes/investor-portfolios.md`.

## Scope and honest coverage

- 30 seed companies covered; 108 distinct rounds (company + round + date) have at least one named investor. Edge basis: 290 press, 258 company release, 29 Wikipedia, 23 SEC filing, 6 investor portfolio page.
- **Coverage is partial.** The web search quota ran out during discovery (agents fell back to Exa, WebFetch and archived filings). Known holes: CFS's $1B round of 2026-07-30 (no investors named by the company; only Hyundai and Plynth named separately), Helion Series A-D (2015-2020), Tokamak Energy 2019-2022, Marvel seed/Series A, Thea and Xcimer seeds, Zap Series A, TerraPower 2018-2021, Kairos Power private investors (only Samsung C&T found), Oklo preferred-round dates, Terrestrial PIPE allocations, newcleo PIPE ($220M, unnamed), Aalo Series C (unclosed), General Fusion pre-2025 rounds (Wikipedia only), 11 edges with only a year or month date.
- Counts below are therefore lower bounds. Rankings of investors by "nuclear companies found" are indicative, not definitive.
- Pre-IPO rounds of listed companies (Oklo, X-energy, Standard Nuclear, Deep Fission, Terrestrial, General Fusion, newcleo) are dominated by public-market holders and underwriters. Underwriters, ATM sales agents and SPAC sponsors were excluded as non-investors. PIPE holders that were resale-registered (Terrestrial, General Fusion) were included with `basis=filing` and a role of participant; PIPE attribution there is inferred from resale tables, not from allocation disclosure.

## Investor type mix (339 investors, 606 edges)

| Type | Investors | Edges | Comment |
|---|---:|---:|---|
| vc | 175 | 327 | 52% of investors, 54% of edges |
| corporate | 41 | 58 | utilities, miners, steel, industrials, Korean/Japanese groups, Eni, Dow |
| angel | 34 | 48 | only those publicly named in a release; name and role only |
| asset_manager | 33 | 60 | hedge funds, crossover and public-market holders (mostly from IPO/PIPE resale tables); type is an extension of the brief's list |
| family_office | 16 | 41 | Emerson Collective, Gates, Moskovitz/Good Ventures, JIMCO, Exor |
| cvc | 14 | 29 | Chevron Technology Ventures, GV, NVentures, Hitachi Ventures, RTX Ventures, XTX Ventures |
| government | 12 | 22 | Bayern Kapital, EIC Fund, SPRIND, BDC Capital, In-Q-Tel, KHNP, Ontario Power Generation |
| bank | 5 | 5 | lenders (SVB, Stifel, Mizuho) |
| sovereign_fund | 4 | 6 | Temasek, GIC, Kuwait Investment Authority, Khazanah |
| pension | 3 | 5 | Hostplus, Inarcassa, CERN pension fund; CFS 2026 round mentions unnamed pensions/SWFs |
| accelerator | 1 | 4 | Y Combinator (Helion seed, Oklo) |
| dfi | 1 | 1 | KfW Capital |

Types are my classification from public descriptions. Borderline: GV (cvc, parent Alphabet) vs Google (corporate); Government-owned corporates (BDC, KHNP, OPG) are labelled `government`; Gates Frontier / Bill Gates is merged under one slug flagged `family_office`, although the Form D and press treat BEV, Gates Frontier and the individual separately (see data quality).

HQ country: US 146 of 339, then Italy 20 (newcleo's Italian base), Germany 19 (Proxima, Marvel), UK 14, Korea 8, Canada 8, Japan 6. 84 investors have a blank `hq_country` because I would not guess for obscure names. `website` is filled for 143 and `portfolio_url` for 32; blanks mean not yet verified.

## Concentration

- The investor graph is extremely long-tailed: 281 of 339 investors (83%) appear for exactly one company, 42 for two, 8 for three, 5 for four, 2 for five (Breakthrough Energy Ventures, Lowercarbon Capital), 1 for seven (Alumni Ventures, from press plus its portfolio page).
- The top 10 investors account for only 11.5% of press-derived edges. There is no dominant common investor: nuclear is syndicated widely across climate VCs, tech growth funds and strategics.
- 29 investors back both fusion and fission companies (e.g. Alumni Ventures, DCVC, Khosla, Emerson Collective, Chevron Technology Ventures, Gigascale, Valor, Starlight, Sam Altman, Bill Gates). Fusion links: 190 investors; fission links: 178.
- Most connected (companies found): Alumni Ventures 7, Breakthrough Energy Ventures 5, Lowercarbon 5, then 4 each for Chevron Technology Ventures, DCVC, Emerson Collective, Gigascale Capital, Starlight Ventures.
- Lead investors recur less: the top repeat leads are Caffeinated Capital (3 rounds), then two each for Fifty Years, Valor, Sam Altman, East X, DCVC, Decisive Point, Bill Gates, SK Group and BEV. Lead/co-lead is labelled on 75 of 606 edges; 134 are flagged `existing` (prior investors named in a later round without a stated amount).
- Time: 595 of 606 edges are dated; 2024: 129, 2025: 199, 2026 (to Oct): 105, so the graph reflects the 2024-2026 wave, with weak coverage before 2021.

## Co-investor pairs

By shared companies (distinct nuclear companies both funded):

| Pair | Shared companies |
|---|---:|
| Breakthrough Energy Ventures + Lowercarbon Capital | 4 (CFS, Pacific Fusion, Zap, Xcimer) |
| Breakthrough Energy Ventures + Emerson Collective | 3 |
| Emerson Collective + Lowercarbon Capital | 3 |
| Lowercarbon Capital + Starlight Ventures | 3 |
| BEV + Starlight / Gigascale / Soros / John Doerr / Eric Schmidt / Plynth Energy | 2 each |
| Bill Gates + Khosla Ventures / NVentures / HD Hyundai | 2 each |
| Alumni Ventures + Crosscut / Gaingels / Hitachi Ventures / Valor | 2 each |

By same round (same company + round + date): BEV + Lowercarbon 7 rounds; BEV + Starlight 5; Lowercarbon + Starlight 5; Future Ventures + Khosla 5; Starlight + Engine 4; BEV + Eni 4. Most of these come from CFS's Series A through B2, whose investor lists are long, so pair counts are inflated by CFS (43 investors found at CFS alone, 27 each at Proxima and Valar, 24 at newcleo and Radiant).

## How often per-investor amounts are disclosed

- 11 of 606 edges (1.8%) carry an amount tied to a specific investor; 9 of 108 rounds with named investors (8%) have at least one.
- Cases: Eni $50M (CFS 2018, via Wikipedia), Sam Altman $375M (Helion Series E, CNBC, reported), SK $250M (TerraPower 2022 and the extension; company release), Samsung C&T $70M equity (Kairos, TechCrunch 2026-09-21; plus $30M in-kind), Trump Media $200M convertible note (TAE; SEC S-4 summary), Silicon Valley Bank $9.5M debt (Realta, SVB release), Ares $30M (X-energy Series C-2, SEC exhibit) and $50M, Dow $20M, Kam Ghaffarian $30M (X-energy AAC PIPE commitments; the SPAC was terminated, so these were commitments not investments).
- Disclosed by company or filing: SK, Samsung C&T partly (press quoting company), Trump Media, SVB, Ares, Dow, Ghaffarian. Reported by press: Altman. Wikipedia only: Eni.
- Excluded on purpose: KHNP's about $44M in TerraPower (press estimate; the company release gives no amount); Radiant's "$100M combined check" from Draper Associates and Boost VC (no split); ARK's "indicated interest up to $105M" in the X-energy IPO (indication); General Fusion's lead Alyeska about $80M (derived from warrant counts, not disclosed).
- Investor portfolio pages never show amounts (see `probes/investor-portfolios.md`). Form D totals are per offering, not per investor.
- Product implication: show "participated, amount undisclosed" nearly always; per-investor amounts will be an exception and must be labelled disclosed or reported.

## Data quality issues

1. **Name collisions** (will break fuzzy matching): Kairos (Italian VC in newcleo's list) vs Kairos Power; Valar Labs / Valar Ventures vs Valar Atomics; Radiant Security vs Radiant; Antares Therapeutics / Antares Holdings vs Antares Nuclear; Helion Venture Partners vs Helion Energy; Proxima (DCVC techbio) vs Proxima Fusion; "Inertia" at GV/Bessemer unverified.
2. **Vehicle vs brand:** Breakthrough Energy Ventures vs Gates Frontier vs Bill Gates vs the Breakthrough Energy foundation; Lowercarbon funds filed under coded names; Capricorn funds filed as "Technology Impact Fund"; Google vs GV vs Alphabet; Eni vs ENI Next LLC; Alumni Ventures runs many sub-funds (Westwood, Towerview, Bascom, Deep Tech). I merged brands to one slug and kept alias strings, but vehicle-level resolution is not done.
3. **Syndicate and SPV layers:** Aalo has at least 16 SPV issuers on EDGAR (GV, Gaingels, BBVC, Solist, HII...). SPV existence does not equal an institutional stake; platforms (Sydecar/CGF2021, HII, Invext, AVSF) are not investors.
4. **Unnamed investors:** several rounds name none (CFS 2026, Type One 2026 note, General Fusion 2024 SAFE with 67 investors, Terrestrial PIPE, newcleo PIPE). Five rows naming only unnamed pensions/endowments were dropped.
5. **Source conflicts:** Proxima 2026 leads (company release names XTX and East X as co-leads, with RWE and Google strategic; an aggregator claimed a different lead, which was dropped); X-energy Series D new-investor lists differ by source; TerraPower round totals ($750M vs $830M after extension); Valar seed $18M vs $19M; Deep Fission $30M vs $80M; one search summary claimed a $3.85B CFS round in May 2026 that contradicts TechCrunch/WNN (treated as spurious, no rows).
6. **Wikipedia-only rows:** 29 edges (CFS early, General Fusion, Helion) rest on Wikipedia and need a primary source.
7. **Dates:** some rows have only year or month. 11 edges lack a date; 6 portfolio-page edges have no round or date.
8. **Type and country judgement:** `asset_manager` is not in the brief's type list; it is used for hedge funds, crossovers and public holders. 84 investors have no HQ country.
9. **Access:** BEV, Chevron CTV, Starlight, ARK, Temasek and StepStone portfolio pages could not be fetched by BarycenterBot (see probes). Per-company investor discovery must therefore come from the company side.
10. **Reference sites** (Fusion Energy Base, FIA report) were not cited as sources of any fact in this survey.
