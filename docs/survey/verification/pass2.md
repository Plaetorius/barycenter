# Verification: second-pass additions

Verifier: claude-opus-5-5, 2026-10-05. Scope: only items carrying `review: pending` (events, participants, agreements) in 18 ledgers.
I checked each one against its snapshot text with `ledger context-pending`. Every pending item is now `review: verified` (`source_pass` kept).
None were deleted. `ledger check` prints OK for all 18 files. Each ledger's `verification.note` has a new `[pass2 verify ...]` line.

| Ledger | Items verified | Corrections |
|---|---|---|
| antares-nuclear | 5 agreements | 0 |
| arc-clean-technology | 2 agreements | 1 |
| copenhagen-atomics | 2 agreements | 0 |
| deep-fission | 2 agreements | 0 |
| deep-isolation | 3 events | 1 |
| elementl-power | 2 agreements | 1 |
| nuscale-power | 3 events | 0 |
| oklo | 1 agreement | 1 (evidence added) |
| radiant-nuclear | 1 event | 0 |
| shine-technologies | 1 event + 2 participants | 0 |
| steady-energy | 1 event + 5 agreements | 3 |
| stellaria | 3 agreements | 1 |
| terrapower | 1 event + 1 participant | 1 |
| terrestrial-energy | 1 event | 0 |
| thorizon | 1 agreement | 0 |
| valar-atomics | 6 participants | 6 quotes extended, 1 rename |
| x-energy | 2 events + 10 participants + 3 agreements | 2 |
| xcimer-energy | 2 events | 0 |

## Targeted checks
1. **x-energy, C-2 notes vs Series C.** The Series C total of $235M breaks down as $80M of new cash, plus the C-1 notes ($37.4M converted on 2023-12-05 and $20.0M on 2024-03-29), plus the C-2 notes ($98.0M converted on 2024-10-11). That gives 235.4, which matches the stated total. The ledger counts only the $80M cash for the Series C and never counts the $235M. The C-1 notes have no event. The C-2 notes are therefore separate cash, $113.0M received as debt in 2022-23, and are recorded as `new_money`, not `duplicate`. Nothing is counted twice.
2. **terrestrial-energy.** The $50M PIPE is `duplicate` with `supersedes: terrestrial-2025-spac-hcm-ii`. The SPAC total ("in excess of $292M") already includes it. Confirmed.
3. **terrapower.** The ARDP "authorizes up to $2 billion" is `ceiling` with qualifier `up_to`, so it is never counted. Confirmed.
4. **radiant-nuclear.** The Series D upsize to $350M (Axios, reported) is `duplicate` with `supersedes: radiant-series-d-2025`. Confirmed.
5. **valar-atomics.** The six new Series A participants were quoted only from the sentence "...participated along with other notable funds and angels", which does not name the round. Their quotes now include the preceding sentence: "has closed a $130 million Series A funding round, led by Snowpoint Ventures ... participated".
6. **Agreements, binding level and values.** Each binding level was checked against the source wording. Corrections are listed below. Selections (ANPI, Launch Pad) stay `loi`, following the convention used across the ledgers. Values appear only where the source states them (the Dow JDA states "up to $50 million in engineering work").

## Fixes
- **arc:** the summary of the IC Nuclear term sheet claimed "non-binding", which the source does not say. That wording is removed and the binding level stays `mou`.
- **deep-isolation:** the GENESIS grants go to LBNL and USC; Deep Isolation is only the industrial partner. The program text now says so. The event has no amount, so nothing is counted.
- **elementl:** the AMP site changes from `mou` to `definitive`. The source says "has agreed to purchase" the site.
- **oklo:** added `announced_on` evidence for the Centrus LOI (the 10-Q is signed 2026-08-07).
- **steady-energy:** the company newsroom shows repost dates. The Kärnfull release dated 2024-06-18 appears there as 2024-08-28, and it already mentions LOIs with Helen and Kuopio.
  - Helen LOI: date changed from 2024-08-22 to 2024-06-18 (the latest date the evidence allows), and type changed from offtake to partnership.
  - Kuopion Energia: binding changed from `mou` to `definitive` (the source says "signed a one-year pre-planning agreement"), type changed from offtake to partnership, and the date is flagged as unreliable.
  - KDHC: binding changed from `mou` to `definitive` (the source says "signs first international deal", "agreement on cooperation").
- **stellaria:** the Unitel MoU date changes from 2026-07-16 to 2026-07-20. The 16th is the signing date; the 20th is the release date. Evidence added.
- **terrapower:** the terrapower.com quotes change from basis `reported` to `disclosed`, because the source is the company's own page.
- **valar:** the quotes are extended as described in check 5. "Alumni Ventures" is renamed "Alumni (Alumni Ventures)" to keep the source's wording.
- **x-energy:**
  - Ares is changed from lead to participant on the Series C completion, because the release does not say Ares led.
  - The C-2 round label now says the date is a placeholder and lists the conversions.

## Residual doubts
- **steady-energy seed:** the EUR2M seed is dated 2024-08-22 using the same repost-dated newsroom. The true date is probably earlier. The web search budget was exhausted, so I could not check it.
- **x-energy, Series C completion:** Ares and Ghaffarian's $80M rests on one source, a Wayback copy of the company release. Wikipedia confirms only the $235M total.
- **x-energy, Series C participants:** OPG, Curtiss-Wright, DL E&C and Doosan are "previous investors in the Series C" and may have come in through the note conversions.
- **x-energy, placeholder dates:** the C-2 notes date (2022-12-01) and the Dow and OPG agreement dates are placeholders.
- **valar:** the six Series A names come from LA Times Studios (sponsored content based on company releases, basis reported). "Alumni", "DTX" and "Triplepoint" are not resolved to specific entities.
- **shine:** the $70M round rests on trade press only (WisBusiness). The company release was not retrieved.
- **xcimer:** the Form D amounts are sold-to-date figures from tag-stripped XML. Field order was checked by arithmetic.
- **Counterparty slugs:** Centrus appears as `centrus-energy` in antares-nuclear and as `centrus` in oklo. This needs resolving at the entity-resolution step.

## Batch: kairos-power, last-energy, holtec-international, lightbridge, jimmy-energy, flibe-energy, moltex-energy (2026-10-05)
Verifier: verifier-agent (Claude Opus 5.5). Every `review: pending` item (events, participants, agreements) is now `verified`, with `source_pass` kept. Nothing was deleted. `ledger check` prints OK for all seven ledgers.

| ledger | items verified (incl. participants) | fixes |
|---|---|---|
| holtec-international | 15 | 5 |
| kairos-power | 11 | 1 |
| lightbridge | 9 | 0 |
| last-energy | 7 | 2 |
| jimmy-energy | 13 | 2 |
| flibe-energy | 1 | 0 |
| moltex-energy | 3 | 0 |

### Targeted checks
1. **Holtec related-party loans.** Harbor (founder-controlled) and Mariner (common ownership) are related-party lenders, and the instrument is debt.
   - Facility limits are `ceiling`: Harbor $250M, later cut to $175M availability; Mariner $150M.
   - Drawn amounts are `new_money`: Harbor $175M and Mariner $60M.
   - The Harbor $175M is the balance outstanding as of July 2026, not the sum of all draws. The draws were $100M (2025), $125M (Jan 2026) and $50M (Jul 2026), with $125M outstanding at 2026-06-30, so repayments occurred. The label now says this.
   - DOE Tier 1 $400M stays a `ceiling` ("expected", subject to a funding agreement). I added a quote for the conditions.
   - Michigan $300M: the S-1/A states "cash received in 2024". The recipient is the subsidiary Holtec Palisades, treated as group funding, the same as the DOE loan. No other Michigan event exists, so nothing is counted twice. Receipt and recipient quotes were added.
   - For the Harbor drawn, Mariner, Michigan and Tier 1 events and the three agreements, the only date available is the S-1/A filing date (2026-09-08). This is noted in the labels.
2. **Lightbridge.** ATM net proceeds for 2018-2023 are `new_money` from the 10-Ks. No year overlaps the existing 2024, 2025 or 2026 events. The programmes remain ceilings.
3. **Kairos.** The NM LEDA, JTIP and Albuquerque LEDA incentives are "pending approval", so they stay ceilings. The JTIP grantor is renamed to the programme the quote names.
4. **Last Energy.**
   - The $3M 2020 round rests on VentureBeat (basis `reported`). The "Seed" label was dropped because the source does not name the round.
   - The Wikipedia/PitchBook $20M Series A is not recorded.
   - The RATEN pilot's binding level changes from mou to loi.
5. **Jimmy.**
   - EUR 15M is kept, from the company's round release. The company's Nov 2023 release says EUR 17M; that conflict is noted.
   - The EUR 2.2M date conflict is noted in its label.
   - France 2030 phase 1 EUR 32M is stated as awarded to Jimmy ("l'Etat injecte 32 millions d'euros dans Jimmy"; creusot-infos says "obtenu en phase 1"), so it stays `new_money`. The instrument (grant or advance) is still unstated.
   - Toyo Tanso graphite changes from fuel_supply to partnership.
6. **Moltex.** The C$50.5M announcement is a `duplicate` with `supersedes: moltex-2020-canada-sif` (it also covers moltex-2021-acoa-regi-1).

### Residual doubts
- **Holtec:** the true dates of the Mariner loan and the Michigan grant are not stated.
- **Jimmy:** the instrument behind the France 2030 funding is not stated.
- **Last Energy:** the $3M round is evidenced by press only.
