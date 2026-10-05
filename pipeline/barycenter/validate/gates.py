"""Quality gates: the release build fails when any gate returns errors."""
from __future__ import annotations

from dataclasses import dataclass, field

from barycenter.models import (
    Agreement, Claim, Fact, FundingEvent, Organization, Participation, Snapshot,
)


@dataclass(frozen=True)
class Dataset:
    organizations: tuple[Organization, ...] = ()
    events: tuple[FundingEvent, ...] = ()
    participations: tuple[Participation, ...] = ()
    agreements: tuple[Agreement, ...] = ()
    snapshots: tuple[Snapshot, ...] = ()
    claims: tuple[Claim, ...] = ()
    facts: tuple[Fact, ...] = ()
    quote_texts: dict[str, str] = field(default_factory=dict)  # snapshot_id -> normalised text


@dataclass(frozen=True)
class Finding:
    gate: str
    message: str
    severity: str = "error"  # error | warn


from barycenter.textify import norm as _norm  # same normalisation as the ledger checker (quotes, nbsp, case)


def gate_integrity(d: Dataset) -> list[Finding]:
    out: list[Finding] = []
    org_ids = [o.id for o in d.organizations]
    for dup in {i for i in org_ids if org_ids.count(i) > 1}:
        out.append(Finding("integrity", f"duplicate organization id {dup}"))
    ids, ev_ids = set(org_ids), {e.id for e in d.events}
    for e in d.events:
        if e.company_id not in ids:
            out.append(Finding("integrity", f"event {e.id}: unknown company {e.company_id}"))
    for p in d.participations:
        if p.event_id not in ev_ids:
            out.append(Finding("integrity", f"participation: orphan event {p.event_id}"))
        if p.org_id not in ids:
            out.append(Finding("integrity", f"participation {p.event_id}: unknown org {p.org_id}"))
    for a in d.agreements:
        for oid in (a.company_id, a.counterparty_id):
            if oid not in ids:
                out.append(Finding("integrity", f"agreement {a.id}: unknown org {oid}"))
    return out


def gate_money(d: Dataset) -> list[Finding]:
    out: list[Finding] = []
    by_event: dict[str, float] = {}
    for p in d.participations:
        if p.amount and p.amount.usd:
            by_event[p.event_id] = by_event.get(p.event_id, 0.0) + p.amount.usd
    for e in d.events:
        if e.amount and e.amount.usd is None:
            out.append(Finding("money", f"event {e.id}: amount has no USD conversion"))
        total = by_event.get(e.id)
        if total and e.amount and e.amount.usd and total > e.amount.usd * 1.001:
            out.append(Finding("money", f"event {e.id}: participations ({total:,.0f}) exceed round ({e.amount.usd:,.0f})"))
    return out


def gate_disclosure(d: Dataset) -> list[Finding]:
    """No participation amount without a source-stated (disclosed or reported) claim; no estimates shown as facts."""
    out: list[Finding] = []
    disclosed_subjects = {c.subject for c in d.claims if c.confidence != "estimated" and c.status == "accepted"}
    for p in d.participations:
        if p.amount and f"{p.event_id}:{p.org_id}" not in disclosed_subjects:
            out.append(Finding("disclosure", f"participation {p.event_id}:{p.org_id} has an amount without a disclosed claim"))
    claims = {c.id: c for c in d.claims}
    for f in d.facts:
        c = claims.get(f.chosen_claim_id)
        if c and c.confidence == "estimated":
            out.append(Finding("disclosure", f"fact {f.subject}/{f.predicate} is based on an estimated claim"))
    return out


def gate_evidence(d: Dataset) -> list[Finding]:
    out: list[Finding] = []
    claims = {c.id: c for c in d.claims}
    snaps = {s.id for s in d.snapshots}
    for f in d.facts:
        c = claims.get(f.chosen_claim_id)
        if c is None:
            out.append(Finding("evidence", f"fact {f.subject}/{f.predicate}: chosen claim missing"))
        elif c.status != "accepted":
            out.append(Finding("evidence", f"fact {f.subject}/{f.predicate}: chosen claim not accepted"))
    for c in d.claims:
        if c.snapshot_id not in snaps:
            out.append(Finding("evidence", f"claim {c.id}: snapshot {c.snapshot_id[:12]} missing"))
    return out


def gate_quotes(d: Dataset) -> list[Finding]:
    out: list[Finding] = []
    for c in d.claims:
        if not c.quote:
            continue
        text = d.quote_texts.get(c.snapshot_id)
        if text is None or _norm(c.quote) not in _norm(text):
            out.append(Finding("quote", f"claim {c.id}: quote not found in snapshot {c.snapshot_id[:12]}"))
    return out


def gate_double_count(d: Dataset) -> list[Finding]:
    """Warn when counted events of one company in one round_group have near-equal amounts (likely the same money twice)."""
    out: list[Finding] = []
    superseded = {e.supersedes for e in d.events if e.supersedes}
    groups: dict[tuple[str, str], list[FundingEvent]] = {}
    for e in d.events:
        if e.round_group and e.amount_kind == "new_money" and e.amount and e.amount.usd and e.id not in superseded:
            groups.setdefault((e.company_id, e.round_group), []).append(e)
    for (company, grp), evs in groups.items():
        usd = sorted(e.amount.usd for e in evs if e.amount and e.amount.usd)
        if len(usd) > 1 and any(b <= a * 1.15 for a, b in zip(usd, usd[1:])):
            amounts = ", ".join(f"{e.id}={e.amount.amount:,.0f}{e.amount.currency}" for e in evs if e.amount)
            out.append(Finding("double_count", f"{company}/{grp}: near-equal counted events in one round group ({amounts}); confirm tranches, else mark amount_kind=duplicate", "warn"))
    return out


ALL_GATES = (gate_double_count, gate_integrity, gate_money, gate_disclosure, gate_evidence, gate_quotes)


def run_gates(d: Dataset) -> list[Finding]:
    return [f for g in ALL_GATES for f in g(d)]
