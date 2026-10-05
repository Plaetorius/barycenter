# Barycenter

Who funds nuclear energy: every fusion and fission company with evidenced funding, the investors and governments behind
it, how much and when. A free Mertia Labs tool, served at `labs.mertia.xyz/barycenter`.
Disclosed amounts only, a citation on every figure, **not exhaustive** (see the methodology page).

```
pipeline/   Python (uv). ledger/ (evidenced facts, YAML) -> verified release JSON/CSV in site/public/data
site/       FROZEN COPY of the web app. The live app is ~/mertia/labs/apps/barycenter (labs monorepo). Delete this folder
            once the Vercel project is connected to the labs repo (docs/DEPLOYMENT.md)
docs/       PLAN.md (product), BUILD-PLAN.md (pipeline), LEDGER.md + VERIFY.md (how facts are added and checked),
            survey/ (reconnaissance: sources, census, verification reports)
```

## How a fact gets on the site
1. **Fetch** a source with `python -m barycenter.archive <url>`: bytes are stored by SHA-256, robots.txt is enforced, one
   line is appended to `pipeline/raw/manifest.jsonl`.
2. **Ledger**: a company file in `pipeline/ledger/` records each event, participant and agreement with the snapshot hash
   and a verbatim quote. `python -m barycenter.ledger check` machine-verifies every quote against the stored page.
3. **Verify**: an independent pass (`docs/VERIFY.md`) re-reads each claim next to its source and signs the ledger off.
4. **Publish**: `python -m barycenter.publish` builds only verified ledgers, runs the quality gates (it fails on bad data)
   and writes the release. `--include-unverified` builds a DRAFT.

## Commands
```bash
cd pipeline && uv venv && uv pip install -e . pytest      # first time
.venv/bin/python -m pytest                                 # tests
.venv/bin/python -m barycenter.ledger check ledger/*.yaml
.venv/bin/python -m barycenter.publish                     # verified release -> ~/mertia/labs/apps/barycenter/public/data (BARYCENTER_APP_DIR)
.venv/bin/python -m barycenter.resolve report              # candidate duplicate investors
cd ~/mertia/labs && pnpm install && pnpm dev:barycenter     # http://localhost:3000/barycenter
pnpm --filter @mertia/barycenter test && pnpm build
```

## Conduct
Official APIs and bulk data first; robots.txt obeyed; no Crunchbase/PitchBook/Dealroom data; no paywall or anti-bot evasion;
publishers that forbid automated access are cited through their Wayback copy. See `docs/survey/REPORT.md` (policies P1 to P5).
Data: CC BY 4.0 for the compilation (government data keeps its own terms). Code: MIT.
