# Probe: trade press (R2-prose, 2026-10-05)

Source id: `trade-press`. Archived under `pipeline/raw/` (source_id `trade-press`).

| Outlet | Feed (sha) | Items / span at test | Full text in feed | robots | ToS / reuse | Use |
|---|---|---|---|---|---|---|
| World Nuclear News | https://www.world-nuclear-news.org/rss (d7f191732534) | 45 items, 2026-09-22..10-05 | **Yes**: custom `wnn:fullText` element | `/robots.txt` returns an HTML 404 page (9679be8b6bae), so no rules | No terms page found on homepage; `/terms-and-conditions` and `/About-WNN` 404. Treat as all rights reserved; use headline + link + short quote | Discovery and corroboration; broad nuclear coverage including SMR deals |
| NucNet | https://www.nucnet.org/feed (6761c350a60e) | 15 items, 2026-04-21..09-21 (sparse) | summary only | allow all, disallow /admin /api (726888be05a1) | Feed `<copyright>`: "This material can be freely used on publicly-accessible electronic information systems provided NucNet is quoted as the source". Account terms (56dd98a86993) mention suspending "automated access" for subscribers | Corroboration; explicit reuse licence in the feed |
| ANS Newswire (Nuclear Newswire) | https://www.ans.org/news/feed/ (a76a8fa5f1ac), advertised via `<link rel=alternate>` on /news/ | 50 items, newest 2026-10-05 | summary | permissive (389e33b9f8a9) | https://www.ans.org/about/policies/use/ (ea16d3e07c49): content reserved; noncommercial personal use, no commercial redistribution | Corroboration only; headline + link |
| Neutron Bytes | https://neutronbytes.com/feed/ (75acd817b697) | 10 items, 2026-09-11..10-03 | summary | disallows ClaudeBot, anthropic-ai, GPTBot, CCBot etc. (fbdba1a4bc95); `*` only wp-admin | No ToS located | Commentary and policy; weak for deals |
| FIA news | https://www.fusionindustryassociation.org/feed/ (5c215263ba90) | 10 items, 2026-09-09..10-05 | **Yes** (`content:encoded`) | Disallow empty (5f5d9884dd3e) | No ToS located. FIA is also a reference source (R tier): do not cite as fact source | Policy and member news; coverage cross-check |
| TechCrunch | https://techcrunch.com/category/climate/feed/ (2dda58785a30), https://techcrunch.com/tag/nuclear/feed/ (5a10cb188931) | 20 and 11 items. **Nuclear tag feed is stale in places** (spans 2008..2026 in the 11 items) | summary | disallows AI bots, `/search/` (5fbefc8fdb1d) | https://techcrunch.com/rss-terms-of-use/ (adcc737a8dc0): feed content may be displayed "with attribution to TechCrunch" and with a link to the full article; no ads, no modification | Best discovery for venture rounds; headline + link only |
| Axios Pro (Climate Deals) | none; `https://www.axios.com/pro/climate-deals` returned 200 landing page (12dab6f884a1) | n/a | n/a | disallow `/api/`, `/core/*`, various AI bots (9dbf5ea2259b) | Paywalled subscription product | Do not use, not even for discovery |
| Latitude Media | https://www.latitudemedia.com/feed (a530925b60c7) | 10 items, 2026-09-29..10-02 | **Yes** (`content:encoded`) | disallows `/?s=`, pagination, utm params (1d6605ecaad6) | Terms (7a94563f8161) bar "web scraping, framing... or deep link"; feed use not addressed | Discovery for energy-tech finance; headline + link |
| Canary Media | https://www.canarymedia.com/rss.rss (c102c50c9369) | 100 items, 2026-08-18..10-05 | summary | `Disallow /cpresources/` only (3f11394cf294) | No ToS located (nonprofit; CC licensing not verified) | Discovery (general clean-energy; filter for nuclear) |

## Notes
- Discovery value ranking for this project: TechCrunch (venture rounds), WNN (full text, deals), Latitude (financing), FIA (fusion members), ANS (fission news), then NucNet/Neutron Bytes/Canary.
- All are tier C: they provide a pointer and a corroborating reported amount, never the sole source for an amount if a company release or filing exists.
- Feeds hold at most 10-100 items. A poller must run at least daily (WNN produces ~3 stories/day, TechCrunch Climate 20 items per ~2 weeks).
- To filter nuclear: WNN/NucNet/ANS/Neutron Bytes are nuclear-only; apply a keyword classifier (nuclear, fusion, fission, reactor, SMR, tokamak, stellarator, uranium, HALEU) to TechCrunch Climate, Latitude, Canary.
- Reuse: only NucNet (explicit) and TechCrunch (explicit, attribution + link) state a feed licence. For all others store title, URL, date and a short quote.
