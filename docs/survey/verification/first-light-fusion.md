# Verification: first-light-fusion (2026-10-05, claude-opus-5-5)

## Issue found
The EPSRC Prosperity Partnership event (GBP 6M, company release 2023-05-22) was recorded as company grant money.

The UKRI Gateway to Research record for EP/X025373/1 (snapshot 77fe6e85bf99, archived in this pass) shows the same partnership:
- fund "valuePounds": 6141929
- "leadResearchOrganisation": IMPERIAL COLLEGE LONDON, with Oxford and York
- First Light Fusion as the industry partner that match-funds the programme

The grant is paid to the universities. Under D5 (university money is never in company totals) and the different-recipient rule, it is not company funding.

## Fix
1. Removed `first-light-fusion-epsrc-prosperity-2023`. The reason and the GtR snapshot are recorded in the notes.

## Checked
- December 2020: USD 25M, led by OSI, with IP Group and Hostplus (company release).
- April 2026 first close: GBP 25M, led by East X Ventures / Starmaker One, with UKAEA, IP Group and Hostplus. `closed_on` 2026-04-17 is backed by the Companies House SH01.
- 2011 seed: IP Group and Parkwalk. The 2011-07-01 date is a placeholder for July 2011.
- UKAEA contracts and the BEIS grant carry no amounts.

## Residual doubts
- The 2021-22 Series B (about USD 45M, Tencent-led per press) has no archived primary source.
- The final size of the 2026 round is not announced.
- The UKAEA Fusion Industry Programme awards are procurement contracts recorded as `grant` without amounts.
