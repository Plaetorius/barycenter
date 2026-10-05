# Verification: standard-nuclear (2026-10-05, claude-opus-5-5)

## Checked
The 424B4 (c6e1189365d2) confirms these amounts:
- SAFE notes: $33.5M in 2024. One investor's $1.0M was later refunded, and the remaining $32.5M converted into 65M Seed-1 shares at $0.50.
- Series Seed: $10.0M on 2025-02-13.
- Series A: $70.0M on 2025-08-14 (26,948,464 shares at $2.59755).
- Series A-2: $70.0M on 2026-01-23 (14,193,030 shares at $4.932).
- IPO: $150M gross (10,000,000 shares at $15.00), prospectus dated 2026-07-15.

The $140M headline equals the A plus A-2 closings. It correctly stays `cumulative`, so it is not added on top of them.

## Issues and fixes
1. The Series A investors were attached to the A-2 closing, but the source names them for the whole $140M. The company release, fetched through a Wayback copy of Business Wire (49df46cf4975), says: "secured $140M in Series A funding from investors led by Decisive Point with participation from new investors Chevron Technology Ventures, StepStone Group, XTX Ventures, and existing investors Welara, Fundomo, Andreessen Horowitz, Washington Harbour Partners, and Crucible Capital". Participants now sit on the $140M headline event, which shares `round_group: standard-nuclear-series-a` with the two closings, and they carry primary evidence.
2. Five participants were missing and are now added: XTX Ventures, Welara, Fundomo, Washington Harbour Partners and Crucible Capital.
3. The $140M amount gained primary (company) evidence.
4. The IPO gained `closed_on: 2026-07-17` from the 8-K filed 2026-07-21 (d7f1eff7742c), which refers to "the closing of the initial public offering".

## Residual doubts
- Whether the underwriters exercised their option on 1.5M extra shares (no 10-Q archived yet).
- Which investors took part in which Series A closing.
- The $18-21 S-1 price range in the notes comes from a secondary blog and is unverified.
- The SAFE event's date is a 2024 year-end placeholder.
