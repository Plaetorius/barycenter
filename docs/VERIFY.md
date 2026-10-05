# Verification instructions (independent pass over a ledger)

You are a skeptical verifier, not the author. Another agent wrote `pipeline/ledger/<slug>.yaml`. The machine already
confirmed every quote exists in its snapshot; **you check that the quote supports the claimed fact and that the
claimed fact is right**. Read `docs/LEDGER.md` for the schema and rules, and `docs/survey/REPORT.md` for policies.

Run for each ledger:

    cd /Users/tomgernez/Documents/lab/financing-map/pipeline
    .venv/bin/python -m barycenter.ledger context ledger/<slug>.yaml      # every fact beside its source text

## Checks, in order
1. **Amount**: does the quote state this amount, currency and qualifier (`over`, `up_to`, `approx`)? Units (million vs
   billion), currency symbol (C$ vs US$, € vs £), and whether it is the round or the company's cumulative total.
2. **Date**: `announced_on` is the announcement date of that source (not the closing date, not the date quoted
   inside the release unless that is the round date). Wayback copies: use the release's own date.
3. **Instrument and kind**: equity vs grant vs loan vs IPO/ATM; `amount_kind: cumulative` for "raised to date";
   milestone-tranched or "up to" money is `up_to`, not exact.
4. **Participants**: each named investor is really named in that quote as taking part in THIS round; `lead` only if the
   source says lead. A participant `amount` appears only if the quote states that investor's own amount.
5. **Double counting**: events in the same company that describe the same money (press release vs Form D; DOE
   announcement vs USAspending vs a later restatement; extension already included in a headline total). Mark the weaker one
   `amount_kind: duplicate` with `supersedes: <id of the event it duplicates>`. Real tranches (B then B2) stay separate.
6. **Ceilings vs money received**: ATM programmes, shelf registrations, undrawn credit facilities and "up to" DOE awards that have
   not been paid are programme maximums. Mark them `amount_kind: ceiling` (kept visible, never counted) unless the filing states
   the amount actually sold or drawn; record that actual amount as its own `new_money` event with its own evidence.
   Awards to a different legal recipient than the company (e.g. a project LLC) must say so in `notes` and are not company funding unless
   the company is the recipient or the source names it as beneficiary.
7. **Evidence quality**: a primary source (company, regulator, government) beats press. If an amount rests on press only,
   `basis` must be `reported`. If the quote does not prove the field it is attached to, fix the field or add a better quote
   (archive the page with the archive tool), or remove the claim.
8. **Identity**: the right legal entity (watch legal-name traps in `notes`), the right company (not a namesake).

## What you may change
Edit the YAML to fix any error you find: amounts, dates, kinds, roles, field labels, missing evidence items, duplicates.
Remove participants or events you cannot support. Do not add new events (completeness is not your job; list gaps in
`verification.note`). After edits re-run `ledger check` until it prints OK.

## Sign-off
Set at the top level of the YAML:

    verification:
      status: verified          # or rejected if the ledger is unreliable overall
      by: "verifier-agent (<your model>), <YYYY-MM-DD>"
      on: <YYYY-MM-DD>
      note: "what you changed (counts) and what you could not confirm"

Write a short report to `docs/survey/verification/<slug>.md`: issues found, fixes made, residual doubts. Final message
(<= 12 lines): ledgers verified, number of corrections per ledger, any rejected ledger and why.
