# Shared brief for reconnaissance agents (read fully)

Project: **Barycenter**, a public, auditable map of who funds nuclear energy (fusion + fission): companies, investors
(VCs, corporates, family offices, angels only if publicly announced, sovereign funds) and public funders (governments,
agencies, programs). Read `/Users/tomgernez/Documents/lab/financing-map/PLAN.md` and `docs/BUILD-PLAN.md` first (sections 2, 3, 11).
Today is 2026-10-05. Your job is RECONNAISSANCE: find out what data actually exists and how good it is. Do not build the product.

## Rules
- Write ONLY inside `/Users/tomgernez/Documents/lab/financing-map/docs/survey/` (and raw samples via the archive tool). Do not edit other files.
- **Evidence:** every non-trivial claim in your outputs needs a URL. For sample data you rely on, archive it:
  `cd /Users/tomgernez/Documents/lab/financing-map/pipeline && .venv/bin/python -m barycenter.archive "<url>" --source <source_id>`
  (stores bytes by sha256 in pipeline/raw/, appends to raw/manifest.jsonl, obeys robots.txt, 1 req/s/host, identifies as BarycenterBot).
  Cite the sha256 (or the first 12 chars) next to figures taken from an archived page. WebSearch/WebFetch are fine for discovery.
- **Legal/polite:** official APIs and bulk files first. No Crunchbase/PitchBook/Dealroom/CB Insights data (not as a source, not scraped).
  No paywall or login bypass, no anti-bot evasion, no proxies. If a source blocks automated access or ToS forbids it, record
  that and mark `access: manual`. Reference-only sites (Fusion Energy Base, FIA report, The Fusion Report, IAEA ARIS, NEA) may be read
  for coverage cross-checks but are never cited as the source of a fact.
- **Disclosed only:** never guess amounts. Write `undisclosed` or leave blank. Mark each number `disclosed` (company/filing/gov record),
  `reported` (press), or `estimated`.
- Be skeptical: the date is in the future relative to some training data; verify with sources rather than memory.
- Output files must be complete, concrete, and terse. CSVs: UTF-8, header row, one entity per row. Reports: Markdown with tables.
- Finish with a final message of at most 15 lines: files written, 3 key findings, 3 problems/surprises, anything blocking.
