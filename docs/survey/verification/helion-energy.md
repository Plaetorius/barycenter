# Verification: helion-energy

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (13 events, 28 participant rows, 2 agreements). `ledger check` OK.

## P2 compliance
All helionenergy.com evidence is a Wayback copy with `original_url` set. No snapshot from the origin is cited.

## Issues found and fixes (3)
1. ARPA-E ALPHA `announced_on` 2014-08-24 was the ALPHA programme release date (the programme node has the same value). I archived the USAspending award detail (snapshot f20bc6c3…) and changed the date to `date_signed` 2015-09-29.
2. ALPHA's USAspending "amount" evidence quoted only the award ID and recipient. Replaced it with `"total_obligation":3971263.0`, added `obligated_usd`, and relabelled the old quote as `recipient`.
3. The `announced_on` quote for the Series G final close said "on Tuesday" with no date. Replaced it with the GeekWire byline date (Sep 15, 2026) and kept the old quote as `extension_amount`.

## Checked, no change
- Seed: Form D $1.5M plus TechCrunch 2014. Mithril is the lead per the CEO quote.
- 2015 Form D: equity is confirmed (`isEquityType` true in the XML).
- Series D $40M: Moskovitz lead, $1.25B valuation, closed 2020-09-22.
- Series E $500M: Altman lead. His $375M is reported via GeekWire citing CNBC. The $1.7B milestone money is not counted.
- Series F $425M: valuation $5.425B is the company figure. TechCrunch's $5.245B looks like a typo.
- Series G: the release was edited in place. The final $500M supersedes the initial $465M, so publish counts it once.
- Nucor investment (no amount), cumulative statements, Microsoft PPA.

## Doubts I could not resolve
- Series D still rests on the Helion release (Wayback) alone. GeekWire 2020 URLs returned 404 and the web search budget is used up. It is consistent with GeekWire 2021 ("$72M venture") and the $77.8M cumulative figure.
- Series A–C (about $26M) have no evidence.
- The Nucor agreement is typed `offtake` / `definitive` based on its "agreement to develop" wording. `partnership` may fit better.
