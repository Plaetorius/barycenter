# When the web-search quota is back

**Why this file exists.** Claude Code sessions cap WebSearch calls (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, 200 here). The
cap is shared by the main session and all its agents, and it ran out during the first pass. Everything built so far rests on
what could be found by fetching known URLs (SEC EDGAR, USAspending, company newsrooms, pages linked from pages we already
held). Finding *unknown* sources (an early seed round, a lead investor's announcement, a trade-press report) needs search.
So the data is verified but incomplete, and the second pass was cut short. This is the runbook to finish it.

## 1. Get the quota back
Start a new Claude Code session with a higher cap, from the repo:
```bash
cd /Users/tomgernez/Documents/lab/financing-map
CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION=1500 claude
```
(Budget roughly 15 to 25 searches per company; 1,500 covers the work below. Agents in the same session share the count.)
Also useful: `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` is 20 by default; keep 8 or fewer running at once.
Then say: "Follow docs/WHEN-SEARCH-QUOTA-RETURNS.md".

## 2. State of the data when this was written (2026-10-05)
- Published release: 91 companies, built from **verified** ledgers only (`pipeline/ledger/*.yaml`). Re-check with
  `cd pipeline && .venv/bin/python -m barycenter.publish` (prints counts and every skipped ledger).
- **Pending items** already merged into ledgers but not yet independently verified (they are excluded from the public release
  until verified): deep-isolation (3 events), nuscale-power (3), xcimer-energy (2), x-energy (2 events, 3 agreements,
  12 participants), shine-technologies (1 event, 2 participants), radiant-nuclear (1, a `duplicate` marker), terrapower (1 event,
  1 participant), oklo (1 agreement), elementl-power (2 agreements), copenhagen-atomics (2 agreements), antares-nuclear
  (5 agreements), deep-fission (2 agreements). List them any time with the snippet in section 5.
- Duplicate candidates the merger refused to add: `pipeline/ledger-additions/_conflicts/` (radiant-nuclear: the $2.2B Army headline).
- Second-pass agents that were **stopped for lack of search** (nothing to merge from them): gap-fill for the 45 fusion
  companies (three batches) and the "likeliest new companies" agent. Their targets are below.

## 3. What to run (in this order, at most 8 agents at a time)
All agents follow `docs/PASS2.md` (additions only, no refetch, merge via `python -m barycenter.merge`). Use Sonnet for gathering.

1. **Fusion gap-fill, 3 agents.** Prompt each: "Read docs/PASS2.md and follow it exactly. Task: GAP-FILL existing ledgers. Your
   companies: <list>. Prioritise ...".
   - Batch A: advanced-conductor-technologies astral-systems avalanche-energy blue-laser-fusion canyon-magnet-energy
     commonwealth-fusion-systems ctfusion ex-fusion exofusion first-light-fusion focused-energy fuse-energy-technologies
     gauss-fusion general-fusion hb11-energy. Priorities: CFS Series A/B investors and 2018-2021 rounds; General Fusion Series A-C;
     First Light; Focused Energy.
   - Batch B: helical-fusion helicity-space helion-energy hexium high-temperature-superconductors-inc hyperjet-fusion
     inertia-enterprises jupiter-volta kyoto-fusioneering magneto-inertial-fusion-technologies marathon-fusion marvel-fusion metox
     molten-salt-solutions novatron-fusion-group. Priorities: Helion Series A-C; Kyoto Fusioneering pre-2024; Marvel seed/A/2021;
     Helical earlier rounds and the MEXT SBIR (Business Wire blocks us: use another source).
   - Batch C: openstar-technologies pacific-fusion princeton-fusion-systems proxima-fusion realta-fusion renaissance-fusion
     startorus-fusion stellarex tae-technologies thea-energy tibbar-plasma-technologies tokamak-energy type-one-energy
     xcimer-energy zap-energy. Priorities: TAE pre-2018 rounds; Tokamak 2019-2022; Zap seed and A-C; Xcimer 2022 seed; Type One
     company-side evidence (currently press only).
2. **Fission gap-fill that found little without search** (rerun just these): oklo (Series A/B and pre-SPAC investors, the Meta
   prepayment, Equinix and Switch terms, Liberty/Vertiv/newcleo/Blykalla agreements), radiant-nuclear (Series B/C/D investors from a
   primary source, seed, DOE HALEU/NRIC amounts), nuscale-power (realised ATM sales under the Aug 2026 programme, pre-SPAC rounds),
   newcleo (Sept 2024 EUR 135M round, France 2030 award, July 2026 raise), one-nuclear-energy (pre-SPAC funding), nucube-energy
   (reported ~$13M private funding), natura-resources (priced round, Texas programme), nuclearn (investors), aalo-atomics (a primary
   release for anything after Series B; "$300M+" is cumulative and unexplained by about $167M), kairos-power (private investors).
3. **New companies, 1 or 2 agents.** From `docs/survey/universe-*.csv`, ranked by funding hint: zeno-power, the-nuclear-company,
   hexana, alva-energy, apollo-atomics, bluecore-energy, nusano, clean-core-thorium-energy, applied-atomics, everstar (fission);
   acceleron-fusion, genf-systems, maritime-fusion, cortex-fusion-systems, terra-fusion-energy, lpp-fusion (fusion). Then the rest
   of the 168 census candidates without a ledger if funding hints exist. Skip fermi-america (financing is data-centre, not nuclear).
   Write full ledgers to `pipeline/ledger-additions/<slug>.yaml`, merge; a company with no evidenced funding event gets no file.
4. **Unsourced profiles and logos.** 7 published companies have no website, 31 have no logo (monogram fallback), and several
   profile facts are census-derived. One agent can source websites and HQ from company sites or registries and add logos
   (`pipeline/seeds/profiles-*.yaml`, logos to `site/public/logos/`). Respect the ToS-forbidden origins in `docs/survey/REPORT.md` (P2).
   Already provided by the owner: CFS, X-energy and Radiant logos.
5. **Source families skipped in v1** (`docs/survey/REPORT.md`, section 2): UKRI, Companies House (needs a free API key from
   developer.company-information.service.gov.uk), BODACC via the DILA bulk flux (not the robots-disallowed API), TED, NRC pages,
   SBIR bulk CSV, France 2030 laureates, Germany's Foerderkatalog (returns 403, manual).

## 4. Keep it clean (the rules that worked)
- **Never refetch:** `python -m barycenter.archive <url>` now reuses any URL already in `pipeline/raw/manifest.jsonl`
  (`"cached": true`). Use `--refresh` only on purpose.
- **Never overwrite:** agents write only `pipeline/ledger-additions/<slug>.yaml`; `python -m barycenter.merge` appends as
  `review: pending` and refuses likely duplicates (same company, within 60 days, amount within 10% or same round label).
- **Verify before it ships:** after each batch, verify only the pending items, with Opus, in few large batches (the first-pass
  verifiers caught 200+ errors, so this step is not optional):
  `.venv/bin/python -m barycenter.ledger context-pending ledger/<slug>.yaml` shows each pending fact beside its source text.
  Follow `docs/VERIFY.md`; on sign-off set the item's `review: verified` (events, agreements and participants each carry it).
  Pending items stay out of the public release until then.
- **Rebuild and check:** `cd pipeline && .venv/bin/python -m pytest -q && .venv/bin/python -m barycenter.publish`, then
  `cd ../site && pnpm build`. The build fails on bad data; read every `[warn]` it prints.
- **Scope calls** go in `pipeline/seeds/scope.yaml`; **entity merges** (same investor under two slugs) in `pipeline/seeds/aliases.yaml`;
  run `python -m barycenter.resolve report` after each batch to find new duplicate investors.
- Update `docs/STATUS.md` counts and the methodology page updates itself from `coverage.json`.

## 5. Handy commands
```bash
cd /Users/tomgernez/Documents/lab/financing-map/pipeline
# items waiting for verification
python3 - <<'PY'
import glob, yaml
for f in sorted(glob.glob('ledger/*.yaml')):
    d = yaml.safe_load(open(f))
    pe = sum(e.get('review') == 'pending' for e in d.get('events', []))
    pa = sum(a.get('review') == 'pending' for a in d.get('agreements', []))
    pp = sum(p.get('review') == 'pending' for e in d.get('events', []) for p in e.get('participants', []))
    if pe or pa or pp: print(f, pe, 'events', pa, 'agreements', pp, 'participants')
PY
.venv/bin/python -m barycenter.ledger check ledger/*.yaml        # every quote still found in its snapshot
.venv/bin/python -m barycenter.publish --include-unverified      # DRAFT build including pending items (never ship this)
```
