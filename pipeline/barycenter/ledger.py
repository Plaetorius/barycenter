"""Evidence ledger: hand/agent-curated YAML, one file per company, every fact with a snapshot hash and a quote.

    .venv/bin/python -m barycenter.ledger check ledger/<company>.yaml [...]
    .venv/bin/python -m barycenter.ledger context ledger/<company>.yaml     # facts next to their source text
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field, ValidationError, model_validator

from barycenter.models import (
    AgreementType, AmountKind, Binding, Instrument, Money, ParticipationRole, SLUG,
)
from barycenter.textify import manifest_by_sha, norm, snapshot_text

Basis = Literal["disclosed", "reported"]


class LStrict(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class Evidence(LStrict):
    field: str  # which fact this supports: amount | announced_on | round_label | participant | agreement ...
    snapshot: str = Field(pattern=r"^[0-9a-f]{64}$")  # sha256 from pipeline/raw/manifest.jsonl
    quote: str = Field(min_length=8, max_length=400)  # verbatim from the snapshot text
    original_url: str | None = None  # when the snapshot is a Wayback copy
    basis: Basis = "reported"


class Participant(LStrict):
    investor: str  # name as written in the source
    investor_slug: str = Field(pattern=SLUG)
    role: ParticipationRole = "participant"
    amount: Money | None = None  # ONLY when the source states this investor's own amount
    evidence: list[Evidence] = Field(min_length=1)


class LEvent(LStrict):
    id: str = Field(pattern=SLUG)
    instrument: Instrument
    round_label: str | None = None
    round_group: str | None = None
    announced_on: date
    closed_on: date | None = None
    amount: Money | None = None  # omit when undisclosed
    amount_kind: AmountKind = "new_money"
    supersedes: str | None = None
    committed_usd: float | None = None
    obligated_usd: float | None = None
    disbursed_usd: float | None = None
    valuation_post_usd: float | None = None
    use_of_proceeds: str | None = None
    program: str | None = None
    evidence: list[Evidence] = Field(min_length=1)
    participants: list[Participant] = []

    @model_validator(mode="after")
    def amount_needs_evidence(self) -> "LEvent":
        if self.amount_kind == "duplicate" and not self.supersedes:
            raise ValueError(f"{self.id}: amount_kind=duplicate requires supersedes=<id of the event it duplicates>")
        if self.amount and not any(e.field == "amount" for e in self.evidence):
            raise ValueError(f"{self.id}: amount without an evidence item with field=amount")
        if not any(e.field == "announced_on" for e in self.evidence):
            raise ValueError(f"{self.id}: missing evidence item with field=announced_on")
        return self


class LAgreement(LStrict):
    id: str = Field(pattern=SLUG)
    counterparty: str
    counterparty_slug: str = Field(pattern=SLUG)
    type: AgreementType
    binding: Binding
    announced_on: date
    capacity_mw: float | None = None
    value: Money | None = None
    term_years: float | None = None
    summary: str
    evidence: list[Evidence] = Field(min_length=1)


class Verification(LStrict):
    status: Literal["pending", "verified", "rejected"] = "pending"
    by: str | None = None  # independent verifier (agent run or human)
    on: date | None = None
    note: str | None = None


class Ledger(LStrict):
    company: str = Field(pattern=SLUG)  # slug, as in docs/survey/universe-*.csv
    name: str
    sector: Literal["fusion", "fission"]
    notes: str | None = None  # gaps, conflicts, things a reviewer should know
    verification: Verification = Verification()
    events: list[LEvent] = []
    agreements: list[LAgreement] = []


def _evidence_items(led: Ledger):
    for e in led.events:
        yield from ((f"event {e.id}", ev) for ev in e.evidence)
        for p in e.participants:
            yield from ((f"event {e.id} / {p.investor}", ev) for ev in p.evidence)
    for a in led.agreements:
        yield from ((f"agreement {a.id}", ev) for ev in a.evidence)


def check_file(path: Path) -> list[str]:
    errors: list[str] = []
    try:
        led = Ledger.model_validate(yaml.safe_load(path.read_text()))
    except (ValidationError, yaml.YAMLError) as exc:
        return [f"schema: {exc}"]
    manifest = manifest_by_sha()
    ids = [e.id for e in led.events]
    errors += [f"duplicate event id {i}" for i in {i for i in ids if ids.count(i) > 1}]
    cache: dict[str, str | None] = {}
    for where, ev in _evidence_items(led):
        if ev.snapshot not in manifest:
            errors.append(f"{where}: snapshot {ev.snapshot[:12]} not in raw/manifest.jsonl")
            continue
        if ev.snapshot not in cache:
            cache[ev.snapshot] = snapshot_text(ev.snapshot)
        text = cache[ev.snapshot]
        if text is None:
            errors.append(f"{where}: cannot read text of snapshot {ev.snapshot[:12]}")
        elif norm(ev.quote) not in norm(text):
            errors.append(f"{where}: quote NOT FOUND in snapshot {ev.snapshot[:12]}: {ev.quote[:70]!r}")
    for e in led.events:
        for p in e.participants:
            if p.amount and not any("$" in x.quote or "€" in x.quote or "£" in x.quote or any(c.isdigit() for c in x.quote) for x in p.evidence):
                errors.append(f"event {e.id} / {p.investor}: amount given but quote has no number")
    return errors


def context(path: Path, width: int = 220) -> str:
    """Print every claimed fact next to the surrounding source text, for the independent verification pass."""
    led = Ledger.model_validate(yaml.safe_load(path.read_text()))
    lines = [f"# {led.name} ({led.company}, {led.sector})", f"notes: {led.notes}", ""]
    for e in led.events:
        amt = f"{e.amount.amount:,.0f} {e.amount.currency} [{e.amount.qualifier}]" if e.amount else "undisclosed"
        lines.append(f"## EVENT {e.id}: {e.instrument} {e.round_label or ''} announced {e.announced_on} amount {amt} kind={e.amount_kind} group={e.round_group}")
        blocks = [("event", ev) for ev in e.evidence] + [(f"participant {p.investor} [{p.role}]" + (f" amount={p.amount.amount:,.0f} {p.amount.currency}" if p.amount else ""), ev) for p in e.participants for ev in p.evidence]
        for label, ev in blocks:
            lines.append(f"- [{label}] field={ev.field} snapshot={ev.snapshot[:12]} basis={ev.basis}\n  quote: {ev.quote}")
            text = snapshot_text(ev.snapshot) or ""
            i = norm(text).find(norm(ev.quote))
            if i >= 0:
                nt = norm(text)
                lines.append(f"  context: ...{nt[max(0, i - width): i + len(norm(ev.quote)) + width]}...")
        lines.append("")
    for a in led.agreements:
        lines.append(f"## AGREEMENT {a.id}: {a.type} {a.binding} with {a.counterparty} on {a.announced_on}: {a.summary}")
        for ev in a.evidence:
            nt = norm(snapshot_text(ev.snapshot) or "")
            i = nt.find(norm(ev.quote))
            lines.append(f"- field={ev.field} quote: {ev.quote}\n  context: ...{nt[max(0, i - width): i + len(norm(ev.quote)) + width] if i >= 0 else 'NOT FOUND'}...")
        lines.append("")
    return "\n".join(lines)


def main(argv: list[str]) -> int:
    if len(argv) >= 2 and argv[0] == "context":
        for f in argv[1:]:
            print(context(Path(f)))
        return 0
    if len(argv) < 2 or argv[0] != "check":
        print(__doc__)
        return 2
    bad = 0
    for f in argv[1:]:
        errs = check_file(Path(f))
        print(("OK   " if not errs else "FAIL ") + f)
        for e in errs:
            print("   -", e)
        bad += bool(errs)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
