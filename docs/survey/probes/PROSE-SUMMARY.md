# PROSE-SUMMARY: prose, press and reference-data side (R2-prose, 2026-10-05)

Probes: `newsrooms.md`, `prwires.md`, `trade-press.md`, `wikidata.md`, `gleif.md`, `logos.md`, `fx.md`. Source cards in `docs/sources/`. All samples are in `pipeline/raw/` (see `raw/manifest.jsonl`).

## The 12 companies

| Company | Newsroom URL | Feed | Rendering | robots verdict | ToS verdict | Fetch mode |
|---|---|---|---|---|---|---|
| Commonwealth Fusion Systems | https://cfs.energy/news-and-media | none (sitemap 79 URLs) | static | allow (AI bots named and blocked) | forbids crawl/scrape | manual |
| Helion | https://www.helionenergy.com/news/ | none (`/feed` disallowed; sitemap 110) | static | allow, `/feed` and `/category/` disallowed | "systematic retrieval prohibited" | manual |
| TAE Technologies | https://tae.com/news/ | https://tae.com/feed/ (10 items) | static | allow, Crawl-delay 10 | forbids robots/spiders/page-scrape | manual |
| Zap Energy | https://www.zapenergy.com/updates | none (sitemap 162) | static | allow | none found | auto (sitemap) |
| Pacific Fusion | https://www.pacificfusion.com/resources/topic/news-releases/ | none (sitemap 39) | static | allow | none found | auto, but no funding release on site |
| Proxima Fusion | https://www.proximafusion.com/news | none (sitemap 99) | static | allow | none found | auto (sitemap) |
| Tokamak Energy | https://www.tokamakenergy.com/category/press-release/ | https://www.tokamakenergy.com/feed/ (10, full text) | static | allow, Crawl-delay 2 | none found | auto (RSS + sitemap) |
| Kairos Power | https://kairospower.com/updates | none (sitemap 105) | static | allow | none found | auto (no round releases exist) |
| TerraPower | https://www.terrapower.com/news/ | none; sitemap lacks news | static (SSR) | allow | no automation clause | auto (listing crawl) |
| X-energy | https://x-energy.com/news | https://x-energy.com/news/feed/ (12, full text) | static | allow, Crawl-delay 10 | forbids bots/scripts | manual; public, use SEC |
| Oklo | https://www.oklo.com/newsroom | none (sitemap 153) | static (SSR) | allow, AI bots allowed | broad no-copy/no-bots | manual (ambiguous); public, use SEC |
| Radiant | https://radiantnuclear.com/news | none (sitemap 145) | static, Cloudflare in front | allow | forbids scraping | manual (challenge page to Scrapling/curl) |

## Key facts
- All 12 newsrooms and sample releases are static or SSR HTML. No JS rendering (`DynamicFetcher`) needed.
- Sitemaps exist for 12 of 12 (TerraPower omits news posts; Pacific Fusion lists only 15). Real RSS only for TAE, Tokamak, X-energy, and only the latest 10-12 items.
- robots.txt is permissive everywhere; **ToS is the binding constraint**: CFS, Helion, TAE, X-energy and Radiant forbid automated access (Oklo's terms are ambiguous and restrictive). Only Zap, Pacific Fusion, Proxima, Tokamak, Kairos, TerraPower had no prohibition found (several have no ToS page at all). That is 6 of 12 fetchable automatically. Because the plan says ToS-forbidden means `access: manual`, over half the newsroom sources are manual-upload; the discovery channels (wires, trade-press RSS, SEC) stay automated.
- Scrapling `Fetcher` works for 9 of 12 with defaults turned off (`impersonate=None`, `stealthy_headers=False`, own UA). Failures: TAE (curl_cffi TLS chain error), Tokamak apex (intermittent connection refused), Radiant (Cloudflare 403). The venv needed `scrapling[fetchers]` extras and `markdownify` installed.
- Funding releases state amount and date nearly always; lead about half the time; round label often missing (Proxima, Radiant, Tokamak, TerraPower). Edited-in-place pages (Helion Series G, $465M then $500M) and tranche language require snapshot versioning and an `amount_kind` field.
- Reference IDs: Wikidata has 9 of 12 (misses Proxima, X-energy; Radiant stub); ROR 7 of 12; GLEIF parent LEI 3 of 12 (CFS, Proxima, Oklo). Project-owned slugs remain the backbone.
- Logos: apple-touch-icon exists for 11 of 12; header logo needs per-company config; og:image is never a logo; Commons has 3 (2 public domain, 1 CC BY 4.0). Logo APIs restrict caching.
- FX/CPI: Frankfurter (no key, since 1999) and FRED CPI CSV (no key; JSON API needs a free key) both work.

## Recommended fetch strategy
1. **Discover** with automated, permitted channels: GlobeNewswire keyword RSS (`nuclear`, `fusion energy`, `SMR`, ...), PR Newswire `news-releases-list.rss` with client-side filter, trade-press RSS (TechCrunch Climate, WNN with full text, FIA, Latitude, ANS, NucNet), and the three company feeds (TAE, Tokamak, X-energy). Business Wire is unreachable (403) so it is manual.
2. **Corroborate and extract from the primary source**: for the six no-prohibition companies, fetch sitemap (or TerraPower listing page) diff weekly and the release page, honouring Crawl-delay. For the six restricted ones, use the manual-upload fetcher on the specific release (it archives and hashes it), and prefer SEC filings (Form D, 8-K, S-1 exhibits) for X-energy and Oklo.
3. **Extraction**: `page.markdown()` on the snapshot with quote guard and number guard (plan section 5.2), plus the schema additions listed in `newsrooms.md` section 4 (`amount_kind`, `valuation`, participant `role`, `participant_listing`, `supersedes`).
4. **Reference data**: seed entities from Wikidata by website domain; attach ROR/LEI/OpenCorporates ids only as links; Frankfurter + FRED snapshots at ingestion; logos via the chain in `logos.md`.
5. **Config**: wrap Fetcher so impersonation and stealth headers can never be enabled; add per-host Crawl-delay; retry with `www.` host fallback; detect empty 200 bodies (Zap stub); store `Last-Modified` and content hash to catch silent edits.

## Decisions needed from the owner
- ToS-restricted newsrooms (CFS, Helion, TAE, X-energy, Radiant, Oklo): accept manual-only, or seek permission, or rely on SEC/wires? A legal call; this report only records the clauses.
- Per-host robots exception for documented APIs (Wikidata SPARQL, Wikimedia Commons API), whose robots.txt disallows them for generic agents.
- GlobeNewswire terms are JS-rendered and were not read; PR Newswire terms bar scraping except the offered RSS.

## Caveats
- Single-day snapshot (2026-10-05); newsroom layouts change.
- Extraction results are hand-labelled on a sample of six releases plus extras; not a measured accuracy.
- Business Wire ToS, OpenCorporates licence terms, GLEIF and ROR rate limits were not verified from fetched pages; statements are marked as unverified in the probe files.
