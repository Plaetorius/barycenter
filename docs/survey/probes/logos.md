# Probe: logos (R2-prose, 2026-10-05)

Source id: `logos`. Homepages and logo files archived with `source_id` `logos` (logos are bytes: each sample is content-addressed under `pipeline/raw/`).

## Per-company extraction results (own site)

Extractor: Scrapling `Selector` over the archived homepage: `link[rel*=icon]`, `meta[property="og:image"]`, `img` in header/nav/home-link or with "logo" in class/alt/src, inline `svg` in header.

| Company | apple-touch-icon (sha, size) | Header logo | og:image | Commons (license) | Best source |
|---|---|---|---|---|---|
| CFS | `favicon.png` served as both icon and apple-touch (00bee1290a2e, **2496x2496**, 166 KB) | 3 inline SVGs in header, ambiguous (9438ec67fe, 7e270c83e4, 14257b768c) | none | none | inline SVG (needs per-site selector) or the oversized icon, downscaled |
| Helion | webclip (25c2aa3bb8a7, 256x256 despite "32x32" in name) | none found as `<img>` | hero JPG (not a logo) | `Helion Energy logo 2021.svg`, **Public domain** (69f0aa874470) | Commons SVG |
| TAE | 180x180 (9028b7f68222) | `TAE-logo.svg` (c37868313a61, 2.8 KB) | featured photo | none | header SVG |
| Zap | 180x180 (cbac64bc3350) | none found | generic share image | none | apple-touch |
| Pacific Fusion | 180x180 (63f0765fba55); also `favicon.svg` | 8 inline SVGs; first is 2.3 KB (4470a57f27), likely the logo | fallback share image | none | `favicon.svg` or inline SVG |
| Proxima | 180x180 (56e0eddb987d); 512 icon also declared | none as `<img>` | none | none | apple-touch / 512 icon |
| Tokamak | declares an SVG symbol as apple-touch (26292ac1ee6d) | `tokamak_logo.svg` (4a660d9fdf1f, 17 KB), `_white.svg` variant | none | none | header SVG (+ symbol SVG for square) |
| Kairos | 256x256 (d8faa2b77987) | inline SVG 12.8 KB (719ab1c700) | share JPG | none | inline SVG or apple-touch |
| TerraPower | **none declared** | 3 inline SVGs of 137 bytes (icons, not logo) | `terrapower-share.jpg` (not a logo) | `TerraPower Logo.png`, **Public domain** (c1e9c0150785, 529x188) | Commons PNG |
| X-energy | WebP symbol (058fceb8b1d5, 496px) | `logo-light.svg` (6cf2ede700b0), `logo-dark.svg` | `logo_xe100.svg` over **http://** (a product logo, not the company) | none | header SVG (choose by background) |
| Oklo | 180x180 (57d1759feae6) | `/oklo-logo.svg` (b4c4481d716f, 15 KB) | photo | `Oklo Inc logo.png`, **CC BY 4.0** (03b82304299b, 500x169, attribution required) | header SVG (own), Commons only if attribution accepted |
| Radiant | 180x180 (1a06cc3f3db9) | `radiant-logo-black.png` (6cadcfff06be, 289x60), white variant | photo | none (Wikidata item is a stub) | header PNG |

Takeaways:
- `apple-touch-icon` exists for 11 of 12 (not TerraPower). It is usually a square symbol at 180-256 px, but sizes lie (Helion "32x32" is 256 px; CFS's is 2496 px). It is a symbol, not a wordmark: fine for a square avatar, which is what the plan wants ("square WebP").
- `og:image` is a **share card or hero photo** in nearly every case; never use it as a logo.
- Header logo extraction is not generic: 5 sites expose an `<img>` logo, 4 only inline SVG, 3 neither. A per-company selector (or URL) lives in `universe.yaml` once chosen by a human, then is re-checked by hash.
- Favicon/SVG is reliable for square (Tokamak, Pacific Fusion, X-energy).
- Wikimedia Commons has files for only 3 of 12 (Helion PD, TerraPower PD, Oklo CC BY 4.0). Licence comes from the Commons API (`extmetadata`), which robots.txt blocks for our UA (same documented-API exception as Wikidata; fetched with `--no-robots`, response 429d64f16909). "Public domain" on a corporate logo means the Commons uploader judged it below the threshold of originality; trademark rights remain.
- Cloudflare-protected Radiant served logos fine through httpx.

## Third-party logo APIs (ToS, retrieved 2026-10-05)
- **Brandfetch** (https://brandfetch.com/terms, b22065f51290; https://brandfetch.com/developers, 7532c431d3bf): content is delivered by hotlink by default; caching is allowed only by specific written agreement; users are "strictly prohibited from scraping data at scale". Developer FAQ: Logo API free up to 1,000,000 requests per month without attribution; Brand API free tier 100 requests. Display via hotlink is allowed; storing copies in our evidence archive is not covered by the self-serve terms.
- **logo.dev** (https://docs.logo.dev/attribution, 70f58eac1fd3; https://logo.dev/pricing, e22affc1976b): free Community plan, 500K CDN requests/month, commercial projects must show a link back ("Logos provided by Logo.dev"); paid plans from $33/month drop the attribution; pricing FAQ says "You can cache API results and host the returned assets yourself". `https://logo.dev/terms` returned 404 (not read).
- Both resolve by domain, so they would work for all 12, but they violate the plan's evidence rule (a logo is a snapshot with URL, hash, date) unless we cache, which only logo.dev's paid plan states clearly.

## Recommended fallback chain
1. Human-chosen header logo from the company's own site (SVG preferred), pinned in `universe.yaml` by URL and re-fetched by hash; store the snapshot (source: the company's own page).
2. Wikimedia Commons file when licence is Public domain or CC BY (record licence and attribution; Oklo needs credit).
3. `apple-touch-icon` (>= 180 px) for a square symbol; or `favicon.svg`.
4. Monogram generated from the entity name (no external dependency).
5. Optional last resort: logo.dev/Brandfetch only for display by hotlink, never stored, and only if their terms and attribution are accepted. Not needed for the 12 probed.
Never use `og:image`. Normalise to square WebP (as per plan) with padding rather than cropping wordmarks. Record a takedown path (logos are trademarks; use is nominative identification).
