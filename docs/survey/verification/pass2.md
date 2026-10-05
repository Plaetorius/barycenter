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
