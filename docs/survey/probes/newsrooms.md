# Probe: company newsrooms (R2-prose, 2026-10-05)

Source id: `newsrooms`. Samples archived under `pipeline/raw/` with `source_id` `newsrooms` (sha256 prefixes below; full hashes in `pipeline/raw/manifest.jsonl`).
Probe method: `barycenter.archive` (httpx, BarycenterBot UA, robots obeyed) for evidence; Scrapling `Fetcher` (no impersonation, no stealth headers, our UA) for the fetch test.

## 1. The 12 companies

| Company | Newsroom URL | Feed | Sitemap (URLs) | Rendering | robots.txt (sha) | ToS vs automation | Verdict |
|---|---|---|---|---|---|---|---|
| Commonwealth Fusion Systems | https://cfs.energy/news-and-media | none | https://cfs.energy/sitemap.xml (79; 49 news) | static (Prismic), 58 anchors | `*` Allow all; blocks GPTBot, ClaudeBot, anthropic-ai, Claude-Web, CCBot, Google-Extended (829d99646fe0) | https://cfs.energy/terms-of-use/ (2b1bea8daa75) forbids "crawls, scrapes, or spiders" | **manual** (ToS) |
| Helion | https://www.helionenergy.com/news/ (items under `/newsroom/`) | none usable (`/feed` is Disallowed) | https://www.helionenergy.com/sitemap.xml (110; 57 newsroom, 36 blog) | static (Webflow), 99 anchors | Disallow `/feed`, `/category/`, `/wp-json/` etc. (ec782ce3cfda) | https://www.helionenergy.com/legal/terms-of-use (527dbd95faf7): "systematic retrieval of data from the Website is also prohibited" | **manual** (ToS) |
| TAE Technologies | https://tae.com/news/ | https://tae.com/feed/ (WordPress, 10 items, no full text, 2026-08-06..09-30) | https://tae.com/sitemap_index.xml (812) | static (WordPress), 105 anchors | `Crawl-delay: 10`, only wp-admin disallowed (c8f25654546c) | https://tae.com/terms-of-service/ (f39e2039cf3a) forbids "page-scrape", "robot", "spider" | **manual** (ToS) |
| Zap Energy | https://www.zapenergy.com/updates | none | https://www.zapenergy.com/sitemap.xml (162; 104 updates) | static (Craft CMS), 73 anchors | Disallow `/cpresources/` only (855e11bd0ba6) | no ToS page found (only privacy policy, dd753cb67830) | **auto OK** (robots), low risk |
| Pacific Fusion | https://www.pacificfusion.com/resources (tab `/resources/topic/news-releases/`) | none | https://www.pacificfusion.com/sitemap.xml (39; only 15 resources) | static, 44 KB | `User-agent: *` + sitemap only (75dbea1851c5) | no ToS page found (`/terms`, `/privacy` 404) | **auto OK**, but no funding release found on site |
| Proxima Fusion | https://www.proximafusion.com/news (items under `/press-news/`) | none | https://www.proximafusion.com/sitemap.xml (99; 38 press-news) | static (Webflow) | sitemap line only (a0a72ba50555) | only imprint + cookie policy (ef9f3095c085, 683e29e77c85); no ToS | **auto OK** |
| Tokamak Energy | https://www.tokamakenergy.com/news/ (404 on that path; posts at `/YYYY/MM/DD/slug/`, category `/category/press-release/`) | https://www.tokamakenergy.com/feed/ (WordPress, 10 items, **full text** `content:encoded`, 2026-04-02..10-05) | https://www.tokamakenergy.com/sitemap_index.xml (139; date-path URLs) | static (WordPress) | `Crawl-delay: 2`; Disallow `/archive/`, `/brand/` (f544eca7c209) | no ToS page found | **auto OK** (honour Crawl-delay 2) |
| Kairos Power | https://kairospower.com/updates (items `/updates/<slug>`) | none | https://www.kairospower.com/sitemap.xml (105; 86 updates) | static (Webflow), 69 anchors | permissive (7e44f254f982) | `/terms-conditions` 404; none found | **auto OK**; no round releases exist (see below) |
| TerraPower | https://www.terrapower.com/news/ (items at **root** slugs, e.g. `/terrapower-announces-650-million-fundraise`) | none | https://www.terrapower.com/sitemap.xml (47) **does not list news posts** | static (Nuxt SSR), 158 anchors | `Disallow:` empty (bc382122846a) | https://www.terrapower.com/terms (ecd7876f67c9) has no automation clause | **auto OK**; discovery needs listing-page crawl |
| X-energy | https://x-energy.com/news (IR at https://investors.x-energy.com/) | https://x-energy.com/news/feed/ (WordPress, 12 items, full text, 2026-06-02..09-25) | https://x-energy.com/sitemap_index.xml (214; 145 news) | static (WordPress) | `Crawl-delay: 10` (36c1a38c5147) | https://x-energy.com/terms-conditions/ (8ea3206a702a): "not access the Services through automated or non-human means, whether through a bot, script or otherwise" | **manual** (ToS); public since 2026-04-24 so SEC is the record |
| Oklo | https://www.oklo.com/newsroom (IR at https://investor.oklo.com) | none | https://www.oklo.com/sitemap.xml (153; 120 newsroom) | static SSR (Next.js + Sanity), 112 anchors | Allow all; Disallow `/studio`, `/api`; lists AI bots explicitly as allowed (2299def6510e) | https://www.oklo.com/legal (ea5eb633dde6): bars copying "any information contained on... the Website" and automation software (bots); read as restrictive | **manual** (ToS ambiguous); public (NYSE: OKLO) so SEC is the record |
| Radiant | https://radiantnuclear.com/news | none | https://radiantnuclear.com/sitemap.xml (145; 41 news) | static (Next.js + Sanity) but behind Cloudflare | `Allow: /` (2ec3e83471fb) | https://radiantnuclear.com/terms-of-use (6ac1ae5d9e7c): no "scraping" except search engines as per robots.txt | **manual** (ToS + Cloudflare challenge) |

Newsroom feed summary: only 3 of 12 have a real RSS feed (TAE, Tokamak, X-energy), each with just the latest 10-12 items. Feeds are useful for polling, never for history. History comes from sitemaps (9 of 12) or listing pages (TerraPower).

## 2. Scrapling Fetcher test

Environment fixes needed first (venv was incomplete): `scrapling[fetchers]` extras (`curl_cffi`, `playwright`, `patchright`) and `markdownify` were not installed; I ran `uv pip install "scrapling[fetchers]" markdownify` into `pipeline/.venv`. Add these to the lockfile (pyproject lists `scrapling[fetchers]` but the install had no `curl_cffi`).

Fetcher defaults to `impersonate="chrome"` (TLS fingerprint spoofing) and `stealthy_headers=True`. These conflict with the no-fingerprint-spoofing policy, so every call used `Fetcher.get(url, impersonate=None, stealthy_headers=False, headers={"User-Agent": BarycenterBot})`. The fetch layer must wrap Fetcher so these defaults cannot be forgotten.

| Result | Companies |
|---|---|
| Works (200, full HTML, css selectors, `markdown()`) | CFS, Helion, Zap, Pacific Fusion, Proxima, Kairos, TerraPower, X-energy, Oklo |
| Fails: `curl: (60) SSL certificate ... unable to get local issuer certificate` | TAE (`tae.com` serves an incomplete chain; system curl and httpx succeed, curl_cffi's CA bundle does not do AIA fetching) |
| Fails: `curl: (7) Failed to connect` on apex `tokamakenergy.com` (3 attempts); `www.` host worked, and apex later worked from httpx | Tokamak (intermittent; fetch layer needs retry and host fallback) |
| Fails: HTTP 403, "Just a moment..." (Cloudflare challenge) | Radiant via Fetcher and curl; the httpx-based archive tool got 200 on `/news/series-d-announcement` on the same day. Not stable, do not rely on it; policy says no bypass |

Other Scrapling findings:
- `Response.markdown(css_selector=None, main_content_only=False)` works and strips scripts, styles and hidden/prompt-injection content. `main_content_only=True` only selects `<body>`, so navigation and footer remain. Use `css_selector="main, article"` per site, or strip to the first `<h1>`. On a stored snapshot you can call `Response.markdown(Selector(html))`.
- `Selector.get_all_text()` and `css()` are fine. HTML lxml lowercases attribute names (`viewbox`).
- No JS rendering was needed for any of the 12 listing pages or sample releases. `DynamicFetcher` is not required for this universe today.

## 3. Do releases carry the target fields?

Pages archived (releases we hand-extracted are marked X, see section 4):

| Company | Release (archived) | sha256 prefix | Amount | Date | Lead | Participants |
|---|---|---|---|---|---|---|
| CFS | Series B2 $863M, 2025-08-28 (X) | 89fd706a940d | yes | yes (dateline) | **no lead named** | yes, long list by new/existing |
| CFS | "$1 billion additional equity", 2026-07-30 | adc760abe6e8 | yes, no round label | yes | no | **none named**, categories only |
| Helion | Series G $465M, 2026-06-04 (X) | ddd8577fccfb | yes (page later edited to $500M) | yes | Thrive Capital | yes |
| Helion | Series F $425M, 2025-01-28 | 7bcb6ea7de68 | headline | JSON-LD | not read | not read |
| TAE | $250M, July 2022 | 34795481fc16 | yes | month only on page; JSON-LD 2022-07-19 | no | Google, Chevron, Sumitomo Corp of Americas "and others" |
| TAE | $150M, 2025-06-02 | 7dfcf3687bc4 | "more than $150 million" | yes | no | Chevron Technology Ventures, Google, NEA "among other" |
| Zap | Series D $130M, 2024-10 (via `/updates/2024/10/zap-energy-attracts-130m-...`) | d7076296ba82 | yes | URL + `<time>` 2024-10-09 | Soros Fund Management | yes, new and current |
| Zap | `/updates/2024/10/zap-energy-confirms-130m-round-...` | e3b0c44298fc (empty body, HTTP 200, 0 bytes) | n/a | n/a | n/a | n/a (S3 redirect stub) |
| Pacific Fusion | `/resources` listing | 76ecf4941be1 | no funding release found in news-releases tab | | | |
| Proxima | EUR 411M, 2026-07-07 (X) | b1ff584f345d | yes, plus company USD conversion | yes | XTX Ventures, East X Ventures | yes |
| Proxima | EUR 130M Series A | 7f75ff59f977 | headline | | | |
| Tokamak | $125M, 2024-11-20 (X) | 60b2c10ac3bd | yes | byline + JSON-LD | co-led East X Ventures, Lingotto Investment Management | yes, new only by name |
| Kairos | Samsung C&T "agree to pursue strategic investment", 2026-09-21 | 2c8f52b501c3 | **none** | page "Sep 21 2026", JSON-LD 2026-10-01 | n/a | Samsung C&T |
| TerraPower | $650M, 2025-06-18 (X) | 471317cf6a2a | yes | yes | none | NVentures, Bill Gates, HD Hyundai |
| TerraPower | KHNP joins investor base, 2026-01-20 | 1a1d152bef1b | **undisclosed** | yes | n/a | KHNP; SK named as existing |
| X-energy | Series C-1 "approximately $500 million", 2024-10-16 (X) | 99ae3885af90 | approx | yes | "anchored by Amazon" | yes |
| X-energy | IPO pricing, 2026-04-23 | 9ed88311461b | not stated; 44,254,659 sh x $23 | yes | underwriters | n/a |
| Oklo | SPAC merger with AltC, 2023-07-11 | 42c025c4d300 | "up to $500 million of gross capital" | `07.11.23` | n/a | Sam Altman |
| Radiant | "more than $300 million", 2025-12-17 (X) | 072c5b0f991a | lower bound | yes | Draper Associates, Boost VC | only via investor quotes |

Reliability of structure (of the rows above): a date is present in every release; an amount is present in all except Kairos (no amount) and KHNP (undisclosed); a lead is explicit in about half (CFS, TAE, TerraPower, KHNP and the 2026 CFS release name none); participants are named in most but not in the CFS 2026 release. Hand counts, small sample. Companies that are now public (X-energy, Oklo) are better served by SEC filings than by their newsroom for amounts.

Funding data not on the company site at all: Pacific Fusion (no funding release found in 15 resource URLs), Kairos (no round announcements; financing historically via partners and DOE), Helion historical rounds are mixed with third-party mirrors (the newsroom hosts copies of Reuters/TechCrunch/The Information headlines, e.g. `/newsroom/helion-raises-425-mln-softbanks-venture-arm-5-4-bln-valuation`).

## 4. LLM-extraction feasibility: six releases hand-extracted

Markdown via Scrapling `Response.markdown(Selector(html))` on the stored snapshot; quotes are verbatim from that markdown. Currency/number parse is trivial; the hard parts are semantic.

### E1. CFS, Series B2 (89fd706a940d)
- company: Commonwealth Fusion Systems. round label: "Series B2". amount: 863,000,000 USD (`reported`/`disclosed`: company release). date: 2025-08-28.
- quote (amount+round): "announced that it raised $863 million in a Series B2 fundraising round"
- lead: none stated. Participants new: Brevan Howard Macro Venture Fund; Counterpoint Global (Morgan Stanley); Stanley Druckenmiller; FFA Private Bank (Dubai); Galaxy Interactive; Gigascale Capital; HOF Capital; Neva SGR (Intesa Sanpaolo); NVentures (NVIDIA); Planet First Partners; Woori Venture Partners US; a 12-company Japanese consortium led by Mitsui & Co. and Mitsubishi Corp. (DBJ, Fujikura, JERA, Mitsui Fudosan, MOL, NTT, SMBC, SMTB, Kansai Electric). Existing: Breakthrough Energy Ventures, Emerson Collective, Eni, Future Ventures, Gates Frontier, Google, Hostplus, Khosla, Lowercarbon, Safar Partners, Eric Schmidt, Starlight Ventures, Tiger Global, "a large state pension fund" (unnamed).
- quote (participants): "New investors in CFS include (in alphabetical order): Brevan Howard Macro Venture Fund; Counterpoint Global (Morgan Stanley);"
- use of proceeds: "CFS will use the funds to complete SPARC, its fusion demonstration machine, and progress on development work on its first ARC power plant in Virginia."
- Pitfalls: "and others" (list not exhaustive); "a large state pension fund" is an anonymous participant; cumulative statements ("close to $3 billion", "$1.8 billion Series B round in 2021") sit next to the round amount; the list mixes consortium members with their leaders; investor roles ("new" vs "existing") must be kept as participation attributes.
- Related, same newsroom: 2026-07-30 release (adc760abe6e8) "raised $1 billion of additional equity financing", total "$4 billion"; **no round label, no investor names**; the model must output `lead: null`, `participants: []`.

### E2. Helion, Series G (ddd8577fccfb)
- round: Series G. amount: 465,000,000 USD; date 2026-06-04; lead: Thrive Capital. post-money valuation $15.5B (valuation, not amount).
- quote: "announced a $465 million Series G investment round" and "The raise was led by Thrive Capital, with participation from additional new investors, including Alta Park Capital, Anti Fund, BoxGroup, Lux Capital, Peak XV Partners, and Ford Motor Company Executive Chairman Bill Ford"
- existing: Capricorn Technology Impact Funds, Lightspeed, Mithril Capital, Dustin Moskovitz through Good Ventures Foundation, SoftBank Vision Fund 2, "a university endowment fund" (unnamed).
- use: "to accelerate commercial deployment of fusion, scale manufacturing capacity, and expand the company's ability to deliver clean electricity to customers".
- Pitfalls: **the page was edited in place**: a banner now says "UPDATE: Helion closed its oversubscribed Series G at $500M in September 2026, up from an initial close of $465M". The same URL now yields two amounts, and the dateline (June 4) predates the update. Snapshots must be content-hashed with fetch date; the extractor must model initial close vs final close (tranche) or one event with a revised amount. Also "valuation of $15.5 billion" and "total invested to date $1.5 billion" are distractors.

### E3. Proxima Fusion, EUR 411M (b1ff584f345d)
- round label: **absent in the text** (PDF file name is "EN Series A2 PR.pdf", so the label is only in an attachment URL). amount: 411,000,000 EUR (company supplies "$468 million" conversion; do not store as the amount). date: 2026-07-07. valuation EUR 2.4B.
- quote: "announced a €411 million ($468 million) financing round, bringing the company's valuation to €2.4 billion ($2.7 billion)"
- lead: "The round was led by XTX Ventures and East X Ventures, with RWE and Google as strategic investors". joined: KfW Capital, SPRIND, Burda Principal Investments; returning: Plural, UVC Partners, Balderton, Cherry Ventures, DST Global Partners, Brevan Howard Macro Venture, Lightspeed, DTCF, redalpine, Leitmotif, Elaia, CDP Venture Capital, Bayern Kapital, EIC Fund.
- use: "completion of the Stellarator Model Coil, expansion of high-temperature superconducting (HTS) cable and magnet production, and continued development of the engineering and manufacturing systems".
- Pitfalls: dual currency; "secured more than €650 million ($740 million), including €95 million in public grants" (cumulative and grants mixed with equity); public bodies (KfW Capital, SPRIND, Bayern Kapital, EIC Fund) invest equity but must be typed as investors/public funders correctly; date format DD.MM.YYYY in listings (`07.07.2026`, `11.06.2025` is 11 June). Earlier release "Extends Series A to EUR 200M" is a tranche extension of an existing round (EUR 130M in 2025 plus extension).

### E4. Tokamak Energy, $125M (60b2c10ac3bd)
- round label: none. amount 125,000,000 USD; date 2024-11-20 (byline, JSON-LD).
- quote: "Tokamak Energy has raised $125 million" and "The round was co-led by East X Ventures and Lingotto Investment Management with participation from new investors including Furukawa Electric Company, British Patient Capital, global maritime company BW Group and U.S.-based Sabanci Climate Ventures."
- leads: two (co-led). existing shareholders unnamed.
- use: TE Magnetics growth, fusion pilot plant design, ST40 experiments.
- Pitfalls: "$335m total raised, comprising $275m from private investors and $60m funded from the UK and U.S. governments" mixes public money into the cumulative; "co-led" needs multi-lead support; `including` signals a partial list.

### E5. TerraPower, $650M (471317cf6a2a)
- round label none; amount 650,000,000 USD; date 2025-06-18; lead none.
- quote: "announced today the close of a $650 million fundraise. This fundraise was comprised of both new investors, including NVentures, the venture capital arm of NVIDIA, and current investors, including TerraPower-founder Bill Gates and HD Hyundai"
- UBS exclusive placement agent (not an investor). "Further terms of the fundraise" are withheld (text cut at this point in the page).
- Pitfalls: "including" means partial; an advisor (UBS) appears next to investors; other TerraPower pages say "$750 Million Secured in Fundraise" (`/fundraise`) and "$830 Million Secured in 2022", which are cumulative-by-year or tranche totals; KHNP's 2026-01-20 release (1a1d152bef1b) names an investor with **no amount** (`undisclosed`). The slug-style URLs live at the site root, not under /news.

### E6. Radiant, "more than $300 million" (072c5b0f991a)
- round label: **not in text** (URL slug `series-d-announcement`; text says "new round" and "six months since closing its Series C"). amount: lower bound 300,000,000 USD ("more than"). date: 2025-12-17.
- quote: "has raised more than $300 million in a new round of funding" and "This new round, led by Draper Associates and Boost VC, also includes additional financial commitments from current investors"
- participants beyond the leads appear **only as attributions to quotes**: Washington Harbour Partners, Friends & Family Capital, Andreessen Horowitz, Align Ventures. The release never states "participants include ...". Treat as `inferred_from_quote`, requiring review.
- use: "will support the scaling of commercialization efforts" and the R-50 factory in Oak Ridge.

### Extras that exercised other pitfalls
- X-energy Series C-1 (99ae3885af90): "approximately $500 million", "anchored by Amazon" (anchor is not lead), Ken Griffin invests personally (Citadel founder), "affiliates of Ares Management Corporation". URL has a duplicate with `-2` suffix.
- X-energy IPO (9ed88311461b): amount not stated, only 44,254,659 shares at $23 (about $1.02B, **derived**, mark `estimated`/computed), plus a 30-day option for 6,638,198 more shares.
- Oklo SPAC (42c025c4d300): "up to $500 million of gross capital" is a ceiling dependent on redemptions; `pre-money equity value of $850 million` is a valuation; date `07.11.23` is ambiguous (US reading 11 July 2023 confirmed by JSON-LD 2023-07-11).
- TAE 2022 (34795481fc16): visible date "July 2022" only; "$250 million ... totaling $1.2 billion to date"; "and others". TAE 2025 (7dfcf3687bc4): "more than $150 million" plus "has the option to raise additional capital as part of this funding round" (tranche optionality).
- Zap Series D (d7076296ba82): the first-party page is a repost; the sibling URL returned an empty 200 body (e3b0c44298fc), so empty-body detection is needed.

### Date traps seen in structured metadata
- X-energy JSON-LD `datePublished` 2026-04-24T00:28Z vs displayed 2026-04-23 (UTC vs ET).
- Kairos JSON-LD 2026-10-01 vs displayed "Sep 21 2026".
- CFS has no JSON-LD or `<time>` at all; the date is only the dateline text. Proxima likewise.

### Verdict
A schema-constrained LLM with quote guard is feasible for amount, date, currency, leads and participant lists in most of the releases sampled. Expect review for: tranches/updates (Helion, TAE), missing round labels (Proxima, Radiant, Tokamak, TerraPower), anonymous or implied participants (CFS pension fund, Radiant quotes), and cumulative vs round amounts (CFS, Proxima, Tokamak, TerraPower). Required schema features: `amount_kind` (exact | approximate | lower_bound | upper_bound | derived), `valuation` separate from `amount`, `role` per participant (lead, co_lead, anchor, new, existing, strategic, placement_agent), `participant_listing` (exhaustive | partial), and `supersedes` for edited pages.

## 5. Recommended fetch rules from this probe
- Honour `Crawl-delay` (TAE 10, X-energy 10, Tokamak 2). Keep default 1 req/s elsewhere.
- Sources whose ToS forbids automated access (CFS, Helion, TAE, X-energy, Radiant; Oklo ambiguous) become `access: manual`. Facts about funding (amount, date, investors) are not copyrightable, but storing page snapshots is copying; the owner should decide. Practical alternative: discover through the allowed channels (SEC 8-K/Form D, wires, trade-press RSS, investor releases) and archive the company page only through the manual-upload fetcher.
- CFS robots disallows ClaudeBot/anthropic-ai/Claude-Web. Our UA is BarycenterBot, so technically allowed, but LLM extraction on such pages is something to disclose in the methodology.
