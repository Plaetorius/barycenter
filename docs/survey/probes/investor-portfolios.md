# Investor portfolio page probes (R4)

Date: 2026-10-05. Each page fetched once with `barycenter.archive` (BarycenterBot, httpx, robots obeyed, source id `investor-portfolio-probe`). Raw bytes in `pipeline/raw/<sha[:2]>/`, manifest `pipeline/raw/manifest.jsonl`. The fetcher does not run JavaScript, so "SSR" means the data is in the delivered HTML and "JS" means it is not. "Nuclear listed" = known nuclear companies found as real company entries in the raw HTML (substring hits were checked by hand; false positives are noted).

Pages were picked from the top investors by number of nuclear deals found (see `investors.csv`), plus well-known VCs. Many top-ranked "investors" have no public portfolio page (angels, family offices, corporates, funds in the bottom rows). 41 pages were fetched; investors are ranked by nuclear company count (ties alphabetical).

## Ranked table

| # | Investor | nuclear cos. found | Portfolio URL probed | HTTP | sha256 (12) | robots | Nuclear listed on page | Format | Rendering | Amounts / dates / sector tag | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Alumni Ventures | 7 | https://www.av.vc/portfolio | 200 | 332fb2a3ffb1 | allowed | Pacific Fusion, Thea, Realta, Radiant, Aalo, Valar (6 of 7 known) | Next.js; full company list embedded as __NEXT_DATA__ JSON (name, description, co-investors, geo/stage/sector tags) | SSR (data in HTML) | no amounts; no dates; sector tag (e.g. CleanTech, not nuclear-specific) | Best structured page found. Co-investor names per company: useful for edges. |
| 2 | Breakthrough Energy Ventures | 5 | https://www.breakthroughenergy.org/our-work/breakthrough-energy-ventures/portfolio | 500 | afd42ff380fb | allowed | n/a (HTTP 500, 54 bytes) | unknown | unknown | n/a | Server rejected the bot; mark access: manual. |
| 3 | Lowercarbon Capital | 5 | https://lowercarboncapital.com/companies/ | 200 | c78d87820bd8 | allowed | CFS, Pacific Fusion, Thea, Xcimer (4 of 5; Zap not found) | WordPress; cards with tagline + company page link; JSON-LD present | SSR (redirects lowercarboncapital.com -> lowercarbon.com) | no amounts; no dates; no sector tag on cards | Domain moved to lowercarbon.com. |
| 4 | Chevron Technology Ventures | 4 | https://www.chevron.com/technology/chevron-technology-ventures | 403 | b1fca3b6f127 | allowed | n/a (HTTP 403) | unknown | unknown | n/a | WAF block; access: manual. |
| 5 | DCVC (Data Collective) | 4 | https://www.dcvc.com/companies | 200 | bcf29a776707 | allowed | Pacific Fusion, Zap, Radiant, Oklo | Server-rendered cards with data-portfolio / data-sector / data-status attributes and links to company pages | SSR; filters are client-side (data attributes) | sector tag (energy-climate etc.) and current/exited status; no amounts; no dates | Only investor with a machine-readable sector facet. Proxima and Valar Labs here are unrelated companies. |
| 6 | Emerson Collective | 4 | https://www.emersoncollective.com/ | 200 | 9491d8e2908d | allowed | CFS (editorial mention only) | Next.js, Contentful JSON; no portfolio list | JS-heavy | none | No public portfolio page found. |
| 7 | Starlight Ventures | 4 | https://starlight.vc/ | 403 | d8b3db1dbb1a | allowed | n/a (HTTP 403) | unknown | unknown | n/a | WAF block; access: manual. |
| 8 | Gaingels | 3 | https://www.gaingels.com/portfolio | 200 | c7180b75f1b0 | allowed | none (Valar Ventures is unrelated) | WordPress; filter options in JSON, list loaded by AJAX | Partly JS (list not in HTML) | none | Form D shows Gaingels SPVs for Aalo (e.g. "Gaingels Aalo Atomics LLC") that the page does not list. |
| 9 | Khosla Ventures | 3 | https://www.khoslaventures.com/portfolio | 200 | d539bb2df764 | allowed | CFS, Realta (2 of 3) | Webflow CMS cards: logo, one-line tagline, round label ("Seed"), ticker | SSR (Webflow) | round label only; no amounts; no dates; no sector tag seen | Round label is first-check stage, not nuclear-specific. |
| 10 | Leitmotif | 3 | https://www.leitmotif.com/ | 200 | 164724371c80 | allowed | none | Static 5 KB page | SSR | n/a | No portfolio list. |
| 11 | Lightspeed Venture Partners | 3 | https://lsvp.com/portfolio/ | 200 | 1f7a142c5755 | allowed | Helion, Pacific Fusion, Proxima Fusion (3 of 3) | WordPress; A-Z list of ~864 names in page script plus JSON-LD | SSR (names only) | none: names only | Radiant Security and Antares Therapeutics are different companies (false positives). |
| 12 | Point72 / Point72 Ventures | 3 | https://point72.com/ventures/ | 404 | 48b60b2e592f | allowed | n/a (HTTP 404) | WordPress shell | -- | n/a | Correct portfolio URL unknown. |
| 13 | Valor Equity Partners | 3 | https://www.valorep.com/portfolio | 200 | 7f17336562c9 | allowed | Zap Energy, Aalo Atomics (2 of 3) | Squarespace static A-Z list of h3 names | SSR (names only) | none | Final URL valorep.com/growth-investments. |
| 14 | XTX Ventures | 3 | https://www.xtxmarkets.com/ventures | 200 | 421da1aceb87 | allowed | none | Static page, 2 KB text | SSR | n/a | No portfolio list. |
| 15 | Andreessen Horowitz (a16z) | 2 | https://a16z.com/portfolio/ | 200 | 10342e1a93ca | allowed | Radiant, Standard Nuclear | WordPress; embedded JSON (title, overview, stage, invest_date, exit_date, announcement, socials) | SSR (JSON in HTML) | invest_date empty for 813 of 864 entries; no amounts; no sector tag | Valar Labs (oncology) is a false positive. |
| 16 | ARK Invest | 2 | https://www.ark-invest.com/ark-venture-fund | 403 | b9110b9a8c78 | allowed | n/a (HTTP 403) | unknown | unknown | n/a | WAF block; access: manual. |
| 17 | Bayern Kapital | 2 | https://bayernkapital.de/beteiligungen/ | 404 | 43d9d1857290 | allowed | n/a (HTTP 404) | -- | -- | n/a | Correct URL unknown. |
| 18 | Brevan Howard Macro Venture Fund | 2 | https://www.brevanhoward.com/ | 200 | 1103aadb4f59 | allowed | none | Next.js | JS-heavy | n/a | -- |
| 19 | Draper Associates | 2 | https://www.draper.vc/portfolio | 200 | 24caa0a478b5 | allowed | none (match is a gsap plugin) | Webflow, CMS list | SSR | n/a | Radiant and Boost VC relationships not on this page. |
| 20 | East X Ventures | 2 | https://www.eastx.com/ | 200 | fea221ecc2c4 | allowed | none | Static | SSR | n/a | -- |
| 21 | European Innovation Council Fund | 2 | https://eic.ec.europa.eu/eic-funding-opportunities/eic-fund_en | 404 | 50bea986d612 | allowed | n/a (HTTP 404) | -- | -- | n/a | Public funder; list investee companies on EC portal instead. |
| 22 | Fine Structure Ventures | 2 | https://www.finestructure.vc/ | 200 | 7d4c5cbcc9e9 | allowed | none | WordPress | SSR | n/a | -- |
| 23 | Future Ventures | 2 | https://future.ventures/ | 200 | 71d5f295dc9d | allowed | CFS (mentioned in prose) | Squarespace; prose mentions CFS; /investments/ is the list | SSR | none | Portfolio list at /investments/ not probed (404 at /portfolio). |
| 24 | Hitachi Ventures | 2 | https://www.hitachi-ventures.com/ | 200 | 5a5a85e0d80a | allowed | Thea Energy, Aalo Atomics | Homepage logo wall (images with alt text) | SSR (images) | none | No dedicated portfolio list found. |
| 25 | Prelude Ventures | 2 | https://www.preludeventures.com/portfolio | 200 | db558bb9129d | allowed | Thea Energy, Xcimer | Cards with company page links | SSR | none seen | -- |
| 26 | Segra Capital Management | 2 | https://www.segracapital.com/ | 200 | f45564546bb7 | allowed | none | WordPress | SSR | n/a | -- |
| 27 | StepStone Group | 2 | https://www.stepstonegroup.com/ | 200 | d02032286070 | allowed | n/a (212 bytes) | bot challenge/redirect stub | unknown | n/a | access: manual. |
| 28 | Temasek | 2 | https://www.temasek.com.sg/en/our-investments | 403 | 2295fde461c4 | allowed | n/a (HTTP 403) | unknown | unknown | n/a | WAF block; access: manual. |
| 29 | Engine Ventures (formerly The Engine, MIT) | 2 | https://engineventures.com/companies | 200 | ec31bcfdab9c | allowed | CFS, Blue Energy | Custom CMS list, name + one-line description | SSR | none | Engine rebranded; engine.xyz redirects to engineventures.com. |
| 30 | Y Combinator | 2 | https://www.ycombinator.com/companies | 200 | 561edf23c823 | allowed | none (match is the "inertia" JS asset name) | Vite/Inertia.js app; directory loads from API | JS-rendered | n/a | Needs headless browser or Algolia endpoint; check ToS first. |
| 31 | Bessemer Venture Partners | 1 | https://www.bvp.com/portfolio | 200 | 77e4bea21d7c | allowed | "Inertia" (ambiguous, probably Inertia Enterprises; unverified) | Next.js; embedded Sanity JSON (name, sectors, stages, partner names) | SSR (JSON in HTML) | sector tag (e.g. "Deep Tech & Defense"), first-stage; no amounts; no dates | Name-only match; do not count as an edge. |
| 32 | Capricorn Investment Group | 1 | https://capricornllc.com/ | 200 | 83f6eed76578 | allowed | none found | WordPress, home page only | SSR | n/a | Portfolio path not found (/portfolio 404). Domain is capricornllc.com, not capricorninvest.com. |
| 33 | 8VC | 1 | https://www.8vc.com/companies | 200 | eb1f738d2456 | allowed | none found | Webflow/Gatsby | Partly JS | n/a | -- |
| 34 | Energy Impact Partners | 1 | https://www.energyimpactpartners.com/portfolio/equity/ | 404 | d8531a1ac331 | allowed | n/a (HTTP 404, 60 bytes) | probably SPA | probably JS | n/a | Needs headless render. |
| 35 | Eni / Eni Next | 1 | https://www.eni.com/en-IT/innovation/eni-next.html | 404 | 4aadb2234482 | allowed | n/a (HTTP 404) | -- | -- | n/a | Correct Eni Next portfolio URL unknown. |
| 36 | Founders Fund | 1 | https://foundersfund.com/portfolio/ | 200 | 0398ef1b2f33 | allowed | none found in HTML | React app shell (id="root") + WP | JS-rendered | n/a | Needs headless render. |
| 37 | General Catalyst | 1 | https://www.generalcatalyst.com/portfolio | 200 | 82a2dc88dbee | allowed | none found | Webflow; list probably paginated or loaded later | Partly JS | n/a | Pacific Fusion (a known GC lead) not in raw HTML. Match on "aalo" was inside base64 image data. |
| 38 | GV (Google Ventures) | 1 | https://www.gv.com/portfolio | 200 | 7e6f6b8f6877 | allowed | "Inertia" (ambiguous; same caveat) | Nuxt; JSON-LD ItemList of names | SSR (names only) | none | -- |
| 39 | Mithril Capital | 1 | https://www.mithril.com/ | 200 | 29d083a4a9f0 | allowed | Helion | Homepage portfolio boxes (static HTML/CSS ids) | SSR | none | -- |
| 40 | Thrive Capital | 1 | https://thrivecapital.com/companies | 200 | 17a3e65d6939 | allowed | n/a | Redirects to an unrelated domain (thrivent.com) | n/a | n/a | Probe invalid; correct URL unknown. |
| 41 | equinor-ventures | 0 | https://www.equinorventures.com/portfolio | 200 | 695136bff136 | allowed | none | Next.js | JS-heavy | n/a | Redirects to equinor.com/energy/ventures. |

## Findings

- **Fetched OK (HTTP 200):** 31 of 41, of which 12 list at least one known nuclear company in the delivered HTML: Alumni Ventures, Lowercarbon, Khosla, Lightspeed, Valor, DCVC, a16z, Engine Ventures, Prelude, Hitachi Ventures, Mithril, Future Ventures (mention only). Bessemer and GV show an ambiguous "Inertia" name only.
- **Blocked or failing for the bot:** Breakthrough Energy (HTTP 500), Chevron CTV, Starlight, ARK, Temasek (403), StepStone (stub). These are `access: manual`. Breakthrough Energy Ventures and Lowercarbon are the two most connected nuclear investors found and BEV cannot be read automatically.
- **Format:** 3 shapes. (1) Embedded JSON in the HTML (Alumni Ventures, a16z, Bessemer): richest. (2) Server-rendered cards or lists (Lowercarbon, Khosla, DCVC, Engine, Prelude, Valor, Lightspeed). (3) JS app shells needing a headless browser (YC, Founders Fund, EIP, probably General Catalyst, Gaingels list). No page exposes a sitemap-style API; none states ToS limits on the page itself (ToS pages were not reviewed one by one; only robots.txt was checked by the fetcher and all fetched hosts allowed the path).
- **Sector tagging:** only DCVC (data-sector="energy-climate"), Alumni Ventures (sector "CleanTech") and Bessemer (sector "Deep Tech & Defense") tag sector, and none has a nuclear or fusion tag. Nuclear identification therefore has to come from the company side (our company list), never from the investor's taxonomy.
- **Amounts:** no probed portfolio page shows an investment amount per company. **Dates:** only a16z has an `invest_date` field, and it is filled for only 51 of 864 companies (6%). Khosla shows a stage label ("Seed"); Bessemer a first stage; Alumni Ventures a co-investor list.
- **Coverage vs press:** for the 12 investors whose page lists nuclear companies, the page confirmed 31 company links; 6 were not already in our press-derived edges (added to `investor-edges.csv` with basis `investor_portfolio_page`, no date or round). A page is therefore a good corroboration and discovery source but never a source of amounts.
- **False positives to guard against in matching:** Valar Labs / Valar Ventures vs Valar Atomics; Radiant Security vs Radiant; Antares Therapeutics vs Antares; Proxima (DCVC techbio) vs Proxima Fusion; "Inertia" vs Inertia Enterprises; "Helion Venture Partners" vs Helion Energy.
- **Moved or renamed domains:** lowercarboncapital.com -> lowercarbon.com; engine.xyz -> engineventures.com; Capricorn is capricornllc.com; thrivecapital.com redirected to thrivent.com (probe invalid).

## Disclosed per-investor amounts (any source)

11 rows in `investor-edges.csv` carry an investor-specific amount, against 600 press/release-derived investor-round rows (1.8%), and 9 of 108 rounds with named investors (8%). See `investors.md`.

## Entity-resolution notes (Form D and press names)

Source: EDGAR full-text index fetched via the archive tool (source id `investor-recon`; shas in the examples). Form D lists issuer, related persons (mostly individual executives/directors/promoters), offering and sold totals, number of investors and broker-dealers. It does not list investors. Investor-side vehicles appear only when they file as issuers (SPVs).

| Same investor | Names seen | Evidence |
|---|---|---|
| Breakthrough Energy Ventures | "Breakthrough Energy Ventures, LLC" (CIK 1691687), "Breakthrough Energy Ventures II, L.P.", "...III", "...Select Fund", "oneworld BEV Fund, L.P."; press: "BEV", "Breakthrough Energy" (a different entity: foundation/Catalyst) | sha 1b424cb390d5, query 8daeaf7210c6 |
| Lowercarbon Capital | coded fund names "LOWERCARBON 411.2, LP", "Lowercarbon Q 10, LP", "Lowercarbon Surge, LP" + "Parallel Fund"; press "Lowercarbon Capital", "Lowercarbon", CFS 2019 release "Lowercase Capital" (typo) | query d7541354c6fe |
| Khosla Ventures | "Khosla Ventures III, L.P.", "KHOSLA VENTURES SEED G, L.P.", "KHOSLA VENTURES VI (AIV), L.P.", "Khosla Ventures IFSPV II-A, LLC", "Khosla Ventures CFS SPV, LLC" | sha 7210591b3086, query 8d9391575a73 |
| Capricorn | funds file as "Technology Impact Fund, LP", "Technology Impact Fund II/III", "Technology Impact Growth Fund"; press "Capricorn Investment Group", "Capricorn Technology Impact Funds" | query 1a84b797ffc5 |
| Founders Fund | "Founders Fund Growth II/III/IV, LP", "CCI Founders Fund Growth IV, L.P." (feeder); look-alike "Spark Capital Growth Founders' Fund" is unrelated | sha 8ff214977197 |
| Valor Equity Partners | "VALOR EQUITY PARTNERS V L.P.", "...V FEEDER", "iCapital-Valor Equity Partners VII Access Fund", "SFG VALOR EQUITY PARTNERS VII" | query b28f8387e797 |
| Google / GV | "GV Aalo Atomics SPV Jul 2025 a Series of CGF2021 LLC" (GV via an SPV platform); press "GV", "Google Ventures", "Google", "Alphabet" | sha 82e46aedec6e |
| Gaingels | three entities for one syndicate: "Gaingels Aalo Atomics LLC", "...NOV 2025 LLC", "...2026 LLC" | sha bba2f2da7e85 |
| Ares | "Ares X-Energy Co-Invest LP" (RP "Ares X-Energy Co-Invest GP LLC"); press "Ares Management", "Ares Management funds" | sha 7ab2bd22cf15 |
| Eni | "Eni", "ENI Next LLC", "Eni Next" | press, CFS releases |
| Samsung | "Samsung C&T Corporation", "Samsung Group" (press for Kairos) | TechCrunch 2026-09-21 |

Normalization rules recommended (from the Form D scan): two-layer model brand -> fund vehicle (CIK) -> filing; casefold and strip legal form (LP, L.P., LLC, Ltd, Inc, SCSp) into a field; keep fund numbers (Roman, Arabic, letter, -A/-B) as attributes; drop role tokens (Fund, Parallel, Feeder, Opportunity, AIV, Co-Invest, SPV, Management, GP, Advisors, "a Series of ... LLC"); treat SPV platforms (CGF2021 LLC/Sydecar, HII, Invext, AVSF, Allocations, Hiive) as platforms, not investors; maintain a seed alias table (BEV, "Technology Impact Fund" -> Capricorn, coded Lowercarbon names); block-list collisions (Helion Venture Partners, Kairos*, Antares Holdings/Senior Loan/Therapeutics, Valor Mining, Spark Capital Growth Founders' Fund, Valar Ventures); Form D related-person names are inverted ("LLC Sydecar"); a Form D director has no firm affiliation, so person-to-firm links need a press source. Kairos in newcleo's investor list is an Italian VC, not Kairos Power. Full notes: scratchpad `formd_notes.md`, summarised here.
