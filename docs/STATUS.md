# Barycenter status (2026-10-05)

**Live at https://labs.mertia.xyz/barycenter** (Vercel project `barycenter-labs`; see `docs/DEPLOYMENT.md`). Release v2026.10.05, built from verified ledgers only.

| | |
|---|---|
| Companies published | 91 (of 259 census candidates; rule D1: only companies with at least one evidenced funding event) |
| Investors / public funders | 387 / 55 |
| Funding events / agreements | 522 / 194 |
| Evidence claims / archived source documents | 2,812 / 624 |
| Events with undisclosed amount | 70. Investor participations that state their own amount: 27 of 795 |
| Fusion equity vs references | $9.4B vs The Fusion Report $11.5B (81%) and FIA $14.2B (66%) |
| Tests | pipeline 29, site 4; axe WCAG 2 AA clean in light and dark; mobile checked at 320 px |

## How trustworthy is it
Every ledger was written by one agent (Sonnet) and independently re-checked by a second (Opus) reading each claim next
to its source text. The verifiers made more than 200 corrections, which is why the pass exists. Typical catches: at-the-market programme
ceilings counted as money raised (NuScale $3.35B), the same award counted three times (Kairos), SPAC trust money counted twice
(Oklo), joint-venture money attributed to the wrong company (Kyoto Fusioneering), investors taken from "thanks to our investors"
lists (Aalo, Radiant). Reports: `docs/survey/verification/`. Residual doubts are in each ledger's `notes` and
`verification.note`, and shown on the company page under "Reviewer notes".

## Known gaps (published as limitations on the methodology page)
- Early rounds are missing for many companies: every agent hit its 200-search limit. The ledgers are a first pass, not the end state.
- Profile fields (HQ, founding year, approach, logo) are census-derived and not individually evidenced; 31 of 91 companies have no logo (monogram shown).
- 7 published companies have no website and 1 has no HQ country (nothing sourceable was found).
- CFS and TAE logos, and several others, fall back to monograms (terms of service forbid fetching from their sites).
- Asia is thin. Companies House (UK share issues) is not used: needs a free API key.
- Investor roll-up (fund vehicle to firm) is recorded in `seeds/aliases.yaml` but not yet shown on the site.
- Eight source families probed in recon are not in v1: UKRI, Companies House, BODACC (use the DILA bulk flux), TED, NRC, SBIR bulk, France 2030, Förderkatalog.

## Decisions taken without you (all reversible)
- Pacific Fusion's more than $900M milestone-tranched commitment is shown as a **maximum, not counted**; it shows beside each company's total as "Not counted: up to …". If you prefer tranched VC commitments to count, flip `amount_kind` back to `new_money` in `ledger/pacific-fusion.yaml`.
- Scope exclusions (`seeds/scope.yaml`): BWX Technologies, American Centrifuge Operating (Centrus subsidiary), Atomic Alchemy (Oklo subsidiary), Niowave (accelerator hardware).
- Wikimedia API calls skip robots.txt via the logged `--api-policy` flag (documented programmatic APIs only). No other data from a robots-disallowed path is used.
- Several probe fetches of ToS-forbidden origins (CFS, X-energy, Radiant) exist in the local raw store from reconnaissance. None is cited, none is published.

## Needs you
1. Back up the repo (no GitHub remote yet) and `pipeline/raw/` (see `docs/DEPLOYMENT.md`).
2. Raise the web-search cap and run the second pass to completion: `docs/WHEN-SEARCH-QUOTA-RETURNS.md`.
3. Decide whether to get a free Companies House API key for UK share-issue evidence.

## Next
1. Second research pass with fresh search budget: early rounds, missing investors, the unsourced profiles, 168 census candidates without a ledger.
2. Postgres + daily fetch + admin review page (decided: no daily fetch before the database).
3. RSS feed of approved new events, then a weekly digest.
4. Investor firm-level roll-up and a "who can help me" view (shared investors, warm-intro paths).
5. Accretion (manufacturer directory) reusing the organisation registry.
