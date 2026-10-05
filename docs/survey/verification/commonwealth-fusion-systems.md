# Verification: commonwealth-fusion-systems

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified** (25 events, 55 participant rows, 4 agreements). `ledger check` OK.

## P2 compliance
All cfs.energy evidence in the ledger is a Wayback copy with `original_url` set (B2, $1B raise, Plynth, Hyundai), corroborated by TechCrunch, Latitude Media, Richmond BizSense. Earlier probe/recon runs (source_id `newsrooms`, `investor-recon`, `logos`) fetched cfs.energy directly. Those snapshots are in the manifest but the ledger does not cite them. Someone should look at this against P2.

## Issues found and fixes (6)
1. **Series A double count.** The $115M Series A (Form D D/A: $114,999,971, 24 investors) was marked `cumulative`, so only Eni's $50M was counted. Changed it to `new_money`. Its `closed_on` 2019-07-01 was the D/A signature date, not a closing, so I removed it.
2. Eni $50M (2018-03-09) is a part of that $115M (the 2018 Form D shows $64.6M from 5 investors). Set `amount_kind: duplicate` with `supersedes: cfs-2019-06-series-a-115m`. Kept Eni's own $50M amount on its participant row.
3. The 2020 Form D round ($80.6M of $100M) was labelled "Series A extension" and put in group series-a. No source supports that, so I relabelled it as an unlabelled 2020 Form D offering and removed the group.
4. The $1B raise (2026-07-30) was in round_group series-b. The release calls it "additional equity financing", so I removed the group.
5. ARPA-E BETHE amount: $2.39M is the ARPA-E listing figure. USAspending DEAR0001259 shows $1,288,316.58 obligated and $1.20M outlaid on a closed project. Changed the amount to the obligation and kept $2.39M as `selection_amount` evidence.
6. BETHE `announced_on` 2019-11-07 was the BETHE programme release date (the programme node carries the same date). Changed it to USAspending `date_signed` 2020-09-28.

## Checked, no change
- B2 $863M (release via Wayback + TechCrunch + Latitude): all 28 participants appear in the release. TechCrunch confirms there was no lead.
- $1B raise and the $4B cumulative figure. Hyundai is named in its own release as joining the $1B raise.
- Series B $1.816B Form D figure.
- MA Business Builds $2.5M (press, `reported`).
- Milestone award has no amount, which is correct.
- INFUSE voucher listings.
- 4 agreements.

## Doubts I could not resolve
- Series B 2021 participants and lead: every press snapshot was 403/404.
- 2020 round: label unknown. Press reported $84M (bizjournals 403).
- The $115M Series A was probably first announced in mid-2018 (Boston Globe, quoted on the MIT News page, undated). The ledger uses the Axios date, 2019-06-28.
- DESC0021623 (DOE SC, $1.54M) has the same project title as BETHE. It may be FES co-funding of the same project. Both are separate federal obligations, so they are not double counted at the obligation level.
- The INFUSE 2022A UCSD listing is dated "June 15, 2023", which is probably a site typo for 2022. I kept the published date.
- The Plynth stake may be part of the $1B raise. It has no amount, so there is no counting effect.
