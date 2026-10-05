# Second pass: instructions for additions agents

The first pass produced verified ledgers in `pipeline/ledger/`. Your job is to ADD what is missing, never to rewrite what
is there. Read first: `docs/LEDGER.md` (schema and evidence rules), `docs/survey/BRIEF.md`, `docs/survey/REPORT.md`
(policies), `docs/VERIFY.md` (what a verifier will check on your work).

## Do not refetch, do not duplicate
- The archive tool now **reuses** any URL already in `pipeline/raw/manifest.jsonl` (it returns `"cached": true`); use it freely.
  Before searching for a source, check whether it is already archived: `grep -i "<domain or keyword>" pipeline/raw/manifest.jsonl | cut -c1-200`.
- Read each company's existing ledger (`pipeline/ledger/<slug>.yaml`: events, participants, agreements, `notes`,
  `verification.note`) and its verification report (`docs/survey/verification/<slug>.md`). The notes list known gaps:
  start there. Only add facts that are NOT already recorded (same money seen in another source is a duplicate, not an addition).
- Leads you may use (reference only, always re-evidence from a primary source): `docs/survey/investor-edges.csv`,
  `docs/survey/investors.csv`, `docs/survey/universe-*.csv`, `docs/survey/public-programs.csv`.

## What to add
Missing rounds (seed, pre-seed, early Series, extensions), missing participants of existing rounds, grants/loans/awards,
public-market financings, agreements (offtake, PPA, fuel supply, site, government contract). Same rules as `docs/LEDGER.md`:
every fact has a snapshot hash and a verbatim quote; amounts only as the source states; investor amounts only if the source
states that investor's own amount; `amount_kind` (`new_money | cumulative | ceiling | duplicate | valuation_only`).
Search budget is limited (about 200 WebSearch calls per session): prefer fetching known primary URLs (SEC EDGAR
`data.sec.gov` submissions and filing documents, company newsroom pages, government award pages, investor announcements)
and following links from pages you already hold; use WebSearch only to find a missing primary source.
Wayback (`https://web.archive.org/web/2/<url>`) was unreachable from some hosts earlier: try once, and if refused rely on independent sources.

## Output (one file per company, additions only)
`pipeline/ledger-additions/<slug>.yaml` with the normal ledger schema (`company, name, sector, notes, events, agreements`).
Contain ONLY new events/agreements. To add participants to an existing event, repeat that event's `id` with just the new
participants (its other fields are ignored on merge). Event ids must be unique slugs (prefix with the company slug).
`notes`: what you searched, what you could not find, any conflict between sources.
Validate: `cd /Users/tomgernez/Documents/lab/financing-map/pipeline && .venv/bin/python -m barycenter.ledger check ledger-additions/<slug>.yaml`
(must print OK). Then merge: `.venv/bin/python -m barycenter.merge ledger-additions/<slug>.yaml` and read its report: items it flags as
likely duplicates are NOT merged (they go to `ledger-additions/_conflicts/<slug>.yaml`); do not force them in. Merged items are marked
`review: pending` and stay out of the public release until an independent verifier signs them.
Do not touch any file under `ledger/` directly and do not edit another agent's files.

## NEW companies (no ledger yet)
Write the full ledger as `pipeline/ledger-additions/<slug>.yaml` (same schema; `slug` from `docs/survey/universe-*.csv`), then merge: it becomes a
new pending ledger. A company with no evidenced funding event is not published: say so in `notes` and write no file for it.

## Final message (<= 12 lines)
Per company: events / participants / agreements added, duplicates the merger rejected, what remains missing.
