# Universe: private fusion companies (R1-fusion)

Date: 2026-10-05. Output: `universe-fusion.csv` (108 rows: 79 developers, 29 enabling-tech). Total count: **108**.
Status: 103 active, 2 public (General Fusion; American Fusion via OTC reverse merger), 3 defunct (HyperJet, CTFusion, Fusion Power Corp), 0 acquired. TAE is `active`, not public: the Trump Media all-stock merger was announced Dec 2025 and a Form S-4 was filed Sep 2026, but it had not closed on 2026-10-05 (TAE news page via A-agent; verify before launch).

## Method
1. Pulled the coverage lists: Fusion Energy Base (FEB) organizations API (1,054 orgs; 161 tagged fusion machine/technology/software/propulsion/spinoff developer; 250 component suppliers; archived page 1, sha256 204ed8c1c508), FIA members page (sha256 42b19cc0b49a, 46 full members plus affiliates), FIA 2026 report PDF (sha256 f1cae54001da, 56 profiled companies, `$14.24bn` cumulative), Wikipedia "List of nuclear fusion companies" (sha256 9ef92e59a860, 66 rows incl. defunct), The Fusion Report funding post (sha256 d973039bc7d7), TechCrunch "every fusion startup over $100M" (sha256 7348b1c72d3, 17 rows).
2. Union by name into slugs, then four parallel enrichment passes (US large, US small, Europe/UK/CA/AU, Asia) for HQ, approach, status, funding, newsroom, identifiers.
3. Enabling-tech firms included only when fusion-focused AND with outside money or a verifiable fusion-specific business (HTS tape, fuel cycle, isotope separation, magnets, gyrotrons, enabling software). Large diversified suppliers (Furukawa, Fujikura, Bruker, TRUMPF, Thales, Air Liquide, Westinghouse...) and the 250 FEB "component suppliers" are NOT in the census.
4. FEB, FIA and Fusion Report are reference-only: used for coverage and for classification fields (approach, fuel, founding year, HQ) when no primary source was reached. They are never the `funding_source_url`. Classification fields taken that way are marked in the Doubtful section.

## Per-source counts (companies from this census appearing in each source)
| Source | Rows listing a census company | Notes |
|---|---|---|
| Fusion Energy Base | 98 | developer/technology/software tags plus mapped component suppliers; about 74 more FEB developer-tagged orgs not included (mostly software, consultancies, large suppliers) (see below) |
| Wikipedia list | 62 of 66 | 4 rows excluded: General Atomics Fusion Division, Lockheed Martin, KMS Fusion (1969-90), plus the Princeton name merged into one row |
| FIA report 2026 (profiled/timeline) | 58 | FIA itself says 56 active companies |
| FIA members (full + EnableFusion affiliate) | 47 | |
| TechCrunch >$100M | 17 | |
| The Fusion Report | 10 | only the 10 named in the extractable table (11 stated as >$250M plus long tail) |
| Company website found | 65 | |
No list is complete: only 17 companies appear in 5+ lists; 43 appear in exactly one (UltraFast Innovations appears in none of the six lists; company site only).

## Where lists disagree
- Wikipedia not in FEB: American Fusion, ASPL Fusion, Cortex Fusion Systems, Dante Fusion, Fusion Power Corp (defunct), Hylenr, Norront, Tibbar.
- FIA report not in Wikipedia: Astral Systems, GenF, Infroton, Liberty Fusion, Maritime Fusion, Pulsar Fusion, Starlight Engine, YAN Fusion.
- FIA report not in FEB: ASPL Fusion, Infroton Fusion, Tibbar.
- FIA member but not profiled in report: EnableFusion (affiliate, software).
- Totals differ by source and cannot be summed: CFS ($4bn company, $3.94bn TechCrunch, $2.92bn Fusion Report as of Jun 2026 before the July $1bn); Helion ($3.2bn TechCrunch vs $1.5bn Fusion Report/FIA); TAE ($1.65bn vs $1.32bn vs $1.5bn FIA); Proxima ($740M company incl. EUR95M grants vs $683M TechCrunch vs $668M Fusion Report); Focused Energy ($500M vs $277M vs $415M); Marvel ($416M company incl. public projects vs $208M TechCrunch vs $250M); General Fusion ($442M TC vs ~$500M FIA vs $612M Wikipedia). The CSV carries the best-sourced figure only; the sum of the column (~$14.9bn) double counts grants, projects and unconverted totals and must not be used as an industry total.
- HQ conflicts: EX-Fusion (company site Kyoto; FIA/FEB Osaka), Fuse (Wikidata San Leandro; site Albuquerque), GenF (Bordeaux vs Elancourt), Anubal (FIA Hyderabad vs FEB Gurgaon), Type One (Knoxville FIA vs Oak Ridge FEB), Stellarex (set to Princeton from FEB/Wikipedia; one agent inferred Ottawa from a news dateline, unconfirmed), Avalanche (Tukwila vs Enumclaw vs Seattle area).

## Companies that appear in only one list (43)
- Wikipedia only: American Fusion, Cortex Fusion Systems, Dante Fusion, Fusion Power Corp, Hylenr, Norront.
- FIA report only: Infroton Fusion.
- FEB only (developers): Agni Fusion Energy, Cambridge Heavy Industries, HHMAX-Energy, Jupiter Volta, KFT Konzepte, LINEA Innovations, Neo Fusion, SunUp Fusion, Xeonova, Proton Scientific Technologies.
- FEB only (enabling): Absolut System, Advanced Conductor Technologies, Bridge12, Canyon Magnet Energy, Daedal Systems, Eastern Superconducting, Eos Atomics, ExoFusion, Faraday Factory Japan, Fusion Fuel Cycles, Fusionality, Hexium, high-E Photonics, High Temperature Superconductors, Marathon Fusion, MetOx, MiRESSO, Molten Salt Solutions, Next Step Fusion, Oxford Sigma, Shanghai Creative Superconductor, Shanghai Superconductor, SuNAM, SuperOx, THEVA, UltraFast Innovations (company site only), Zhongke Qingneng.
Several of these are major (Neo Fusion, Faraday Factory, Shanghai Superconductor, Marathon, Hexium, MetOx): the Wikipedia/FIA/TechCrunch lists under-cover enabling tech and Chinese state-backed firms.

## Doubtful entries (kept, flagged)
- Government or state-owned, outside money is public budget: China Fusion Energy Co (CNNC-led, 2025), Neo Fusion (Hefei state-backed), ENN Energy Research Institute (parent-funded subsidiary of privately held ENN Group, no outside raise found), Gauss Fusion (industry consortium; EUR17M known, total blank).
- Not verified at all (web search cap hit): Deutelio, Dante, Norront, KFT, Astral Systems, Crossfield (Wikipedia says reactor work ended 2021), nT-Tao, Next Step Fusion, Fusionality, Absolut System, Oxford Sigma, UltraFast, THEVA, Daedal, high-E, SunUp, Xeonova, YAN Fusion, HHMAX, NovaFusionX, Zhongke Qingneng (identity unclear), SuperOx, Faraday Factory Japan, Shanghai Superconductor (STAR IPO status unconfirmed), Shanghai Creative, Eastern Superconducting, SuNAM (possibly KOSDAQ-listed), MiRESSO, EnableFusion, Hylenr, Anubal, ASPL, Starlight Engine (appears to be a Kyoto Fusioneering FAST spin-out, so possibly not independent), Molten Salt Solutions, ExoFusion. Their rows hold only name, country and list membership; classification fields come from Wikipedia/FIA/FEB.
- Might not have raised outside money / not fusion-focused: Jupiter Volta, Liberty Fusion, Agni, Cambridge Heavy Industries, Eos Atomics, Longview (customer Fluor, no round found), Princeton Fusion Systems (grant-funded via parent), Electric Fusion Systems (winding down per own site), Pulsar Fusion (propulsion), Helicity Space (propulsion), American Fusion (OTC reverse merger, status `public` is unlisted-shell level).
- Blue Laser Fusion: reverse merger into an SEC-reporting shell on 2026-09-04 (8-K); stock not listed or quoted, so `active` not `public`. $62.85M summed from the 8-K.
- Zap Energy partial pivot adding sodium-cooled fission (Apr 2026, TechCrunch headline); First Light Fusion pivoted in 2025 to licensing amplifier tech, still counted.
- Approach/fuel for ~40 rows are taken from Wikipedia/FIA classification, not company statements. Fuel is `unknown` where not found.
- Excluded after review: SuperPower Inc (Furukawa subsidiary, no outside raise), Step Fusion (STEP is government-owned UKIFS), General Atomics and Lockheed Martin (fusion is a division), KMS Fusion (1969-90), TAE Life Sciences, Neuboron (not fusion-power), FEB developer-tagged orgs with no funding or non-fusion focus (e.g. Alpha Ring, Zephyr Fusion, Xtus Energy, Innoven Energy, Breakthrough Fusion International, Wuhan Senmu Leishi, Centre for Fusion Energy (Ontario public body, FEB lists $33M), Copenhagen Atomics, software firms Sophelio/NumerEx/Polymath/Xinzhu Shidai with FEB-listed money). Re-check Zephyr, Xtus, Innoven, Wuhan Senmu Leishi and Alpha Ring in the next pass.

## Data quality of the CSV (be honest)
- Funding present for 28 of 108 rows; 4 of those (Acceleron, Helicity, Hexium, Maritime Fusion) lost their source URL because the enrichment pass only found a generic homepage, so the amount is kept but `funding_source_url` is blank (fix in next pass). Most large totals are `reported` via TechCrunch (2026-08-15); `disclosed` only where a company release or SEC filing gave the figure (CFS, Proxima, Marvel, GenF, Kyoto Fusioneering, Blue Laser, LPP, Tibbar, Cortex). Pacific Fusion cites Wikipedia only (TechCrunch says $1B+).
- Identifiers: CIK 16, Wikidata QID 10, Companies House 0, SIREN 0, LEI 0. Not filled because the session WebSearch cap (200) was exhausted by earlier work; WebFetch-only passes could not reach EDGAR/CH/INSEE search reliably.
- `newsroom_url` present for 23. `last_round` blank for ~60 rows.
- Non-USD amounts converted at approximate announcement-date rates by the enrichment agents (EUR~1.08, JPY~157); original currency amounts are in the agents' notes, not the CSV. Revisit for Barycenter's ledger.
- FIA 2026 cross-check: FIA counts 56 survey respondents and $14.24bn cumulative since 2021; this census is a superset (108) because it includes enabling-tech, defunct and non-respondent firms. Known big FIA respondents are all present.
- Missing coverage likely: Chinese private firms (only 14 CN rows, mostly unverified), Korean private developers (none found), Russia (SuperOx only), and enabling-tech SMEs. Next pass needs the raised WebSearch budget.

## Access notes
FEB API (`/api/v1/organizations/`) is public JSON and allowed by robots.txt; reference-only. FIA PDF and members page archived via the archive tool. Wikipedia fetched via archive tool. The Fusion Report and TechCrunch pages were archived and are readable.
