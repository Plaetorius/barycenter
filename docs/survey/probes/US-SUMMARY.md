# US sources: summary (R2-US, probed 2026-10-05)

Raw evidence: `pipeline/raw/` (manifest sources: edgar, usaspending, doe-programs, arpa-e, sbir, nrc, us-states). Cards: `docs/sources/{edgar,usaspending,doe-programs,arpa-e,sbir,nrc,us-states}.yaml`. Per-source detail in the sibling files.

## Coverage matrix (company x source)
Legend: number/amount = found with value; `-` = probed, nothing found; `~` = indirect.

| Company | EDGAR | USAspending | DOE pages | ARPA-E | SBIR | NRC | States |
|---|---|---|---|---|---|---|---|
| Commonwealth Fusion Systems | 4 Form D 2018-2021; $1.816B sold 2021-12 (72 inv.); none since | 2 awards, $2.83M obligated | Milestone awardee (amount n/d) | BETHE $2.39M | - | - (fusion) | - |
| Helion Energy | 2 D (2014, 2015: $1.5M, $10.6M); SPV D 2026-09 $4.55M | 1 award $3.97M (ARPA-E ALPHA, 2015) | - | ALPHA $3.97M | - | - | - |
| Zap Energy | 5 D 2019-2024 (latest $130.0M, 2024-07) | 2 awards $7.77M | Milestone awardee (n/d) | OPEN2018 $6.77M, BETHE $1.0M | - | - | - |
| TAE Technologies | no D; ~ via TMTG 8-K: $200M note + up to $100M, merger 2025-12, S-4 2026-09 | - | - | - | - | - | - |
| TerraPower | no D | $1.70B ARDP under "US SFR OWNER LLC" + $2.96M other | ARDP $80M initial; GAIN voucher | ONWARDS $8.55M (cancelled) | - | Natrium dockets 99902100/87; Kemmerer application | - |
| X-energy | IPO 424B4 2026-04-27 (44.25M sh x $23 ~ $1.02B); 7 SPV D; reactor-co D $1.9M | ARDP $921.7M (outlaid $581.4M, cost share $1.23B) + ~$54M older | ARDP $80M initial | GEMINA $5.83M | - | XE-100 / XENITH pre-app | - |
| Kairos Power | no D | $0.5M DOE (2020); ARDP absent | ARDP risk reduction $629M ($303M DOE) | - | - | docket 99902069, Hermes/Hermes 2 | - |
| Oklo | 5 offerings/ATMs 2025-2026 ($383M net 2025-06; $1.0B ATM sold by 2026-09; new $1.0B ATM; $3.5B shelf) | 3 awards $2.7M | Reactor Pilot (no money) | ONWARDS $4.0M | - | Aurora pre-app, docket 99902095 | - |
| Radiant Industries | 5 D 2022-2025 (latest $268.8M of $350M, 2025-12) | 3 awards $2.64M (incl. USAF) | Reactor Pilot (no money) | - | 4 SBIR/STTR $2.64M | Kaleidos (list; page 403) | - |
| Aalo Atomics | 16 SPV D (none by issuer); amounts $0.1M-$9M each | - | Reactor Pilot (no money) | - | - | docket 99902128 | - |

## Ranked usefulness for "who funds nuclear"
1. **SEC EDGAR** (tier A): the only structured source of private round sizes and dates for US companies (Radiant, Zap, CFS to 2021) and the only primary source for public raises (Oklo ATMs, X-energy IPO, TAE-TMTG). Also a free ticker/CIK universe (about 20 listed nuclear/fusion names). Gaps: no D for TerraPower, Kairos, TAE; late CFS/Helion rounds absent; SPV double-count; no investor names (relatedPersons ignored).
2. **USAspending** (A): authoritative for DOE money with obligated/outlayed/cost share (X-energy $921.7M, US SFR Owner $1.70B). Gaps: Milestone fusion awards, Kairos ARDP absent; alias problem.
3. **DOE programme pages** (B): fills USAspending's holes (Kairos $303M, Milestone membership, ARDP initial), and non-cash support (HALEU, GAIN, Pilot). Hardest to parse; no IDs.
4. **ARPA-E** (A/B): clean, structured, 1,721 projects, early-stage non-dilutive grants for CFS/Helion/Zap/TerraPower/Oklo/X-energy. Undocumented endpoint. Small amounts, historical.
5. **NRC** (A): licensing-stage facet only; stable dockets; Akamai 403s.
6. **SBIR** (A): only Radiant among sampled firms; value is in the supplier layer (1,127 DOE nuclear/fusion-titled awards, 408 firms). Bulk CSV works, API down.
7. **US states** (B): nothing quantified yet.

## Effort estimate (adapter + tests + fixtures)
| Source | Effort | Notes |
|---|---|---|
| EDGAR (Form D + submissions + 424B/8-K) | 5 days | 2-3 for Form D/submissions, 2 for filing text extraction; SPV classification rules |
| USAspending | 3 days | POST archiving, alias/UEI table, detail + transactions |
| DOE programmes | 3-4 days | extraction + review queue; weekly sitemap diff |
| ARPA-E | 1 day | JSON:API paging |
| SBIR | 1 day | bulk CSV, drop PII columns |
| NRC | 2 days (+2 for ADAMS if key needed) | manual fallback for 403s |
| States | 1 day | low yield, defer |
Total about 16-18 engineer days for full US coverage; first value (EDGAR + USAspending + ARPA-E) in about 9 days.

## Cross-source join keys
Company: UEI (USAspending, SBIR) <-> CIK (EDGAR) <-> docket (NRC); ARPA-E has only names. Award: FAIN = SBIR `Contract` = ARPA-E-via-name+amount. ARPA-E "award" is a selection amount that differs from obligation.

## Problems and surprises
- Archive tool: robots parser mis-handles SEC robots (blank line ends group, so SEC's `Disallow: /cgi-bin` was ignored; `Disallow: /search?` over-blocks `/search-filings/...`). One disallowed `/cgi-bin/browse-edgar` request was made (`d228dc52a250`); nothing more. GET-only tool: POST APIs (USAspending) need support. Suggest `protego` for robots and a `--data` flag.
- WebSearch quota ran out (200/200) mid-run: DOE page discovery used the sitemap; Texas/Virginia/HALEU round 1 not verified.
- Public universe larger than assumed: X-Energy (XE) IPO'd 2026-04; General Fusion (GFUZ), Terrestrial (IMSR), newcleo, Hadron, Deep Fission, Eagle Nuclear, Terra Innovatum, Standard Nuclear, Fermi, NANO Nuclear are all on EDGAR; TAE is being absorbed by Trump Media (merger agreement 2025-12-18, S-4 filed 2026-09-30).
- Form D reality: CFS and Helion 2025 rounds have no Form D; Aalo's 16 filings are all syndicates.
- Nothing here yields investor identities except SPV names (Gaingels, GV, Ares, Decisive Point, HII) and filing-level 13G holders; investor layer must come from company releases.
