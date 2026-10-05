# Ledger instructions (for agents building `pipeline/ledger/<company-slug>.yaml`)

You are building the **evidenced funding ledger** for assigned companies. Every fact needs a snapshot hash and a verbatim
quote that a script will check. Read first: `docs/survey/BRIEF.md` (rules), `docs/survey/REPORT.md` (policies P1-P5),
`pipeline/barycenter/ledger.py` (the schema), and the probe notes relevant to your companies in `docs/survey/probes/`.

## Output
One YAML file per company: `pipeline/ledger/<slug>.yaml`. Slug = the `slug` column in `docs/survey/universe-fusion.csv` or
`universe-fission.csv` (add the company to your file's `notes` if it is not in the census). Fields: see `ledger.py`
(`Ledger`, `LEvent`, `Participant`, `LAgreement`, `Evidence`). Validate before finishing:

    cd /Users/tomgernez/Documents/lab/financing-map/pipeline && .venv/bin/python -m barycenter.ledger check ledger/<slug>.yaml

It must print `OK`. A failing quote means the text is not in the snapshot: fix the quote or fetch the right page, never
paraphrase to make it pass.

## What to record
- **Every funding event you can evidence**: equity rounds (incl. seed, extensions, tranches), grants / cost-share /
  vouchers (DOE, ARPA-E, SBIR, EU, UKRI, Canada...), loans / debt (DOE LPO, EIB, venture debt), IPO / SPAC / registered
  offerings / ATM programs (public cos: one event per programme, not per share sale).
- **Per event:** instrument, round label, announced_on (and closed_on if stated), amount + currency + qualifier
  (`exact | approx | over | up_to | range`), `amount_kind` (`new_money`; use `cumulative` for "has raised $X to date"
  statements, which must NOT be counted as a round), valuation only if stated, use of proceeds if stated.
- **Participants:** every investor/funder named as taking part, with role (`lead|participant|grantor|lender`). Give
  `amount` ONLY when the source states that investor's own amount ("disclosed only"). `investor_slug`: reuse the slug in
  `docs/survey/investors.csv` or `public-funders.csv` when the entity exists, otherwise propose a lowercase-hyphen slug.
  Roll fund vehicles up in `investor` text exactly as written; entity resolution happens later.
- **Agreements** (offtake, PPA, fuel supply, site, gov_contract, partnership) with binding level (loi|mou|definitive),
  capacity MW and value if stated. Never count them as funding.
- **Undisclosed amounts:** omit `amount`. Do not estimate. Do not split a round evenly.
- Note conflicts between sources and edits to releases in `notes` (and use `supersedes` when a release was edited in
  place). Put anything a reviewer should double check in `notes`.

## Evidence rules
1. Fetch each source page with the archive tool (obeys robots.txt, stores bytes + hash):
   `cd /Users/tomgernez/Documents/lab/financing-map/pipeline && .venv/bin/python -m barycenter.archive "<url>" --source ledger-<slug>`
   Use the printed `id` (sha256) as `snapshot`. If it prints `blocked by robots.txt`, you may not use that URL.
2. **ToS-forbidden origins (policy P2): do NOT fetch these origins programmatically:** commonwealthfusion.com,
   helionenergy.com, tae.com, x-energy.com, radiantnuclear.com, oklo.com. Instead fetch the Wayback copy
   (`https://web.archive.org/web/2/<original url>`, set `original_url` on the evidence) and corroborate every
   amount with a second independent source (SEC filing, investor release, trade press). If Wayback has no copy, use the
   independent source alone and say so in `notes`.
3. `quote`: 8-400 chars, **verbatim** from the page text (HTML tags stripped, whitespace and curly quotes normalised).
   Quote the shortest passage that proves the field. One evidence item per field (`amount`, `announced_on`,
   `round_label`, each participant). An item may repeat the same snapshot.
4. `basis`: `disclosed` = company release, regulator filing or government record; `reported` = press/third party.
5. Structured sources (USAspending, SEC EDGAR JSON, ARPA-E JSON, Canada G&C JSON): archive the exact API URL; the quote
   is the exact JSON fragment (e.g. `"total_obligation": 921700000`) as it appears in the raw body. Existing probe
   snapshots in `pipeline/raw/manifest.jsonl` (see `docs/survey/probes/`) may be reused by their sha.
6. Prefer primary sources (company release, SEC filing, government record). Trade press only to corroborate or when no
   primary exists. No Crunchbase / PitchBook / Dealroom, no paywalls, no logins, no anti-bot evasion.
7. Do not stop at the first search results: for each company look for every round since founding, including seed and
   grants. If you cannot find something, say so in `notes` rather than guessing.
8. WebSearch has a per-session budget (about 200 calls). Prefer fetching known primary URLs (newsroom, SEC EDGAR
   `data.sec.gov` submissions, USAspending, program pages) over broad searching.

## Final message (<= 15 lines)
Files written, number of events/participants/agreements per company, anything blocked, anything you are unsure about.
