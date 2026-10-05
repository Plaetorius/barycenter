# Fission universe census (R1-fission), 2026-10-05

Output: `universe-fission.csv` (153 rows). **Status: a first-pass census, not exhaustive.** It is below the 100-200 target only in verification depth, not row count; the long tail is thinner than it looks (see Limits).

## Method
Five parallel research passes (US developers; Europe/UK/Canada developers; APAC/ME/Africa/LatAm/Russia; fuel cycle; back end/isotopes/components), each told to follow BRIEF.md, then merged and deduplicated by slug (primary segment wins, blanks filled from duplicates, `listed_in` unioned). Evidence came from WebSearch/WebFetch of company sites, press, SEC EDGAR, Wikipedia, WNN, DOE pages. The session's WebSearch quota (200/200) ran out during round 2, so every pass was cut short; the merger could not run extra searches. No Crunchbase/PitchBook/Dealroom/CB Insights data was used. Reference-only sites (energystartups, vcbacked, ARIS, NEA) were used only for coverage, never as `funding_source_url`. **No pages were archived with `barycenter.archive`** (skipped for speed), so there are no sha256 citations yet.

## Counts
Total 153 rows. Role (primary): developer 73+, components 18, services 15, enrichment ~9, isotopes ~8, fuel ~9, back_end ~6, plus multi-role rows (`|`-joined). Status: private 83, public 44, subsidiary 12, defunct 5, spun-out 4, acquired 3, other. HQ: US 80, KR 10, FR 10, CA 8, CN 7, GB 7, JP 5, SE 4, IN 3, others 1-2 each.
Identifiers: CIK 18, SIREN 2, Companies House 0, Wikidata 0 (API returned 429; not filled), LEI 0.
`lifetime_funding_usd` filled for ~23 rows only. Rows with basis starting `LOWER-BOUND` hold a single round or IPO proceeds, not a lifetime total. Everything else is blank/undisclosed on purpose (no guessing).

## Counts per reference source (rows whose `listed_in` includes it)
press 134, company-site 52, energystartups 42, vcbacked 39, wikipedia-smr 27, smrintel 22, wna-smr 11, iaea-aris 9, nea-smr-dashboard 7.
Caveat: NEA dashboard returned 403, IAEA ARIS URL 404, SMR Intel DNS failure for some passes, WNA SMR page had no company list. The nea/aris/wna/smrintel flags are therefore partial and partly from aggregator mentions; treat as unverified. Real directory cross-check remains to be done manually (`access: manual` for NEA/ARIS).

## Disagreements between sources
- Valar Atomics: $600M vs $1.6B lifetime (aggregators); only the $1B Series B (Aug 2026, SiliconANGLE) is cited, lifetime left blank.
- Kairos: ~$300M vs $629M aggregators; the only citable figure is the $630M DOE ARDP agreement (grant, not equity). Lifetime blank.
- TerraPower: $1.5B (aggregator) vs >$1.4B (WNN). Used the WNN figure, marked lower bound, excludes DOE support.
- newcleo: sub-agent estimated ~$1.12B; Wikipedia says >EUR780M (May 2026), used ~$874M reported, SPAC (~$247M gross) excluded. HQ Paris (Wikipedia) although Italian origin / London plc.
- Holtec: IPO launched 2026-09-08 (HNUC, 50M sh at $15-18) per one pass; Wikipedia says IPO paused Sept 2026. Kept `private`.
- Terrestrial Energy / Terra Innovatum / ARC / Dual Fluid HQ country (US vs CA vs IT) unresolved.

## Doubtful entries
- Naarea: set `acquired` (cession plan to Eneris approved Jan 2026 after liquidation; one source reports Eneris withdrew) - confirm.
- Terra Innovatum HQ (IT vs US), ONE Nuclear HQ unknown, Meitner Energy ($1.2B is planned project spend, not raised), Blossom Energy (JPY350M Series A only seen in a commercial DB, not entered), Thorium Tech Solution (grants only), ThorCon (site now redirects to fleetnuclear.com).
- Aalo: $500M Series C "in progress" (Jul 2026) from an aggregator; not entered.
- Core Power $374M total: aggregator only, not entered.
- Rows with minimal verification: ulc-energy, thor-energy, norsk-kjernekraft, urenco, u-battery, global-first-power, nuclear-turbines, magics-technologies, raven-flint-nuclear, sainuc, star-energy-sa, Korean/Chinese/Indian small-cap tickers (aliases say "unverified").
- Scope-borderline: Ampera (fusion-fission hybrid), Clean Core Thorium (fuel), Elysium (possibly dormant), Sotera/Nordion, Eden Radioisotopes, Mirion, EnergySolutions, Waste Control Specialists, Studsvik, Nuward SAS (EDF subsidiary).
- Overlaps resolved by merge: newcleo/newcleo-us, alpha-tech-research (x2), urenco (x2), atomic-alchemy/oklo-atomic-alchemy. Subsidiaries kept as own rows: TRISO-X, HALEU Energy Fuel, American Centrifuge Operating, Louisiana Energy Services, Nuclear Fuel Services, Nuclear Turbines, MoltexFLEX.
- Seaborg Technologies is the same company as Saltfoss Energy (renamed April 2025, Wikipedia); one row (`saltfoss-energy`).

## Exclusions (why)
- State/OEM giants without a distinct financing vehicle: Orano, Framatome, Westinghouse OEM function is represented by `westinghouse-electric` (Brookfield/Cameco ownership; no round data), GE Vernova Hitachi, Mitsubishi Heavy, Toshiba, CNNC/CGN parents, KHNP, KAERI, NPCIL/BHAVINI/BARC, Rosatom/TVEL/Tenex/Atomenergomash, ENEC, Eskom/Necsa, Taipower, INVAP/CNEA, EDF, Vattenfall, Fortum, OPG, SaskPower, GB Energy-Nuclear, Nuclearelectrica, NWMO, Posiva, Fluor (EPC).
- Included deliberately as distinct listed vehicles: CGN Power, CNNP, CNECC, KEPCO E&C, KEPCO KPS, BHEL, Doosan Enerbility, IHI, JGC, JSW, Shanghai/Dongfang/Harbin Electric, L&T (component/service suppliers; no reactor-developer equity story, flagged for reviewer to cut).
- Uranium miners/financials: Cameco, Energy Fuels, Kazatomprom, Paladin, Boss, Deep Yellow, Bannerman, NexGen, Sprott Physical Uranium.
- Radiopharma not isotope-production: Lantheus, Perspective Therapeutics, Ionetix, Isotopia. Orano Federal Services and Sizewell C / Hinkley Point C (projects, not companies) dropped at merge.
- Fusion/not fission: Tokamak, Marvel, First Light, Alpha Ring, Kyoto Fusioneering, Helical Fusion, Hylenr (LENR), Hyme Energy (thermal storage).
- Utilities/EPC: Constellation, Dominion, Vistra, Talen, Energy Northwest, Curtiss-Wright, Amentum. General Atomics (private, no outside money; GAIN lists). Conglomerates only bidding for Indian BSR (Reliance, Adani, Tata Power, NTPC...).

## Limits / known gaps (for follow-up)
1. Searches ran out: long-tail founded/HQ/status mostly from memory or single sources; 43 rows have no website.
2. Not added for lack of verification: Eagle Enrichment, Advanced Enrichment Technologies, Entech, Nusano peers, Canadian/Australian laser enrichment startups, Isotek, Eckert, Phoenix, Novatom, Howe Industries, Nucleon Energy, Hanwha/DSME, Star-type Chinese private developers, Kärnfull-like Nordic startups beyond those listed, Last Energy-like Poland/UK project vehicles.
3. Lifetime funding is sparse by design; sum of rounds per company needs a second pass with primary press releases/SEC filings (X-energy, Oklo, NuScale, NANO, Kairos, Aalo, Valar, Antares, Blue Energy have round data in `funding_basis` but no total).
4. Companies House, Wikidata, LEI unfilled; SIREN only for Naarea and Blue Capsule.
5. No evidence pages archived with the archive tool; re-run for the funding_source_url pages used.
