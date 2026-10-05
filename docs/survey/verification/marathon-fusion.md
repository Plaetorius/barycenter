# Verification: marathon-fusion

Verifier: verifier-agent (claude-opus-5-5), 2026-10-05. Status: **verified**. 1 correction.

## Issues found and fixes
1. **Form D vs seed**: the Form D SAFEs ($5,049,793; first sale 2022-12-14; filed 2024-02-05) are the same seed money announced as the $5.9M seed on 2024-07-18. The Form D row is now `amount_kind: duplicate` with `supersedes: marathon-seed-2024`.

## Checked, no change
- Seed $5.9M: leads 1517 Fund and Anglo American, participants Übermorgen, Shared Future Fund and Malcolm Handley, all verbatim in the PR Newswire release.
- The $6.9M total is a cumulative row and is not counted.

## Residual doubts
- Arithmetic gap: $5.9M + $450K CREATE = $6.35M, not $6.9M. About $0.55M is unexplained.
- The CREATE amount and the INFUSE award rest on paywalled FusionXInvest headlines.
