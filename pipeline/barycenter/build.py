"""Assemble ledgers into a validated Dataset.

    .venv/bin/python -m barycenter.publish [--include-unverified] [--out ../site/public/data]
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import yaml

from barycenter import fx, registry, resolve, taxonomy
from barycenter.ledger import Evidence, Ledger, check_file
from barycenter.models import (
    Agreement, Claim, Company, Fact, FundingEvent, Investor, Money, Organization, Participation,
    PublicFunder, Snapshot,
)
from barycenter.textify import manifest_by_sha, snapshot_text
from barycenter.validate.gates import Dataset

LEDGER_DIR = Path(__file__).resolve().parent.parent / "ledger"
SEEDS = Path(__file__).resolve().parent.parent / "seeds"


def _seed(name: str, key: str) -> dict:
    """Merge `key` mappings from every seeds file matching `name` (profiles*.yaml allows parallel authors)."""
    out: dict = {}
    for f in sorted(SEEDS.glob(name.replace(".yaml", "*.yaml"))):
        out.update((yaml.safe_load(f.read_text()) or {}).get(key) or {})
    return out
METHOD = "ledger@1"


@dataclass(frozen=True)
class Built:
    dataset: Dataset
    companies: dict[str, Company]
    investors: dict[str, Investor]
    funders: dict[str, PublicFunder]
    ledgers: tuple[Ledger, ...]
    skipped: tuple[str, ...]
    evidence_index: dict[str, list[dict]] = field(default_factory=dict)  # "subject#field" -> evidence dicts


def _usd(m: Money | None, day) -> Money | None:
    if m is None:
        return None
    rate, rdate, sha = fx.usd_rate(m.currency, day)
    return Money(
        amount=m.amount, currency=m.currency, qualifier=m.qualifier, amount_max=m.amount_max,
        usd=round(m.amount * rate, 2), fx_date=rdate, fx_snapshot_id=sha or None,
    )


def load_ledgers(include_unverified: bool) -> tuple[list[Ledger], list[str]]:
    ledgers, skipped = [], []
    excluded = _seed("scope.yaml", "exclude")
    for path in sorted(LEDGER_DIR.glob("*.yaml")):
        if path.name.startswith("_"):
            continue
        if path.stem in excluded:
            skipped.append(f"{path.name}: excluded from scope ({excluded[path.stem]})")
            continue
        errors = check_file(path)
        if errors:
            skipped.append(f"{path.name}: {len(errors)} evidence errors (first: {errors[0][:120]})")
            continue
        led = Ledger.model_validate(yaml.safe_load(path.read_text()))
        if not led.events:
            skipped.append(f"{path.name}: no evidenced funding event (decision D1: not published)")
            continue
        if led.verification.status != "verified" and not include_unverified:
            skipped.append(f"{path.name}: not verified (status={led.verification.status})")
            continue
        ledgers.append(led)
    return ledgers, skipped


def _org(slug: str, name: str, kind: str, entry: registry.Entry | None) -> Organization:
    return Organization(
        id=slug, kind=kind, name=entry.name if entry else name,  # type: ignore[arg-type]
        country=entry.country if entry else None, hq_city=entry.city if entry else None,
        website=entry.website if entry else None,
    )


def _claim(n: int, subject: str, ev: Evidence, value, status: str) -> Claim:
    return Claim(
        id=f"c{n:06d}", subject=subject, predicate=ev.field, value=value, snapshot_id=ev.snapshot, locator="text",
        quote=ev.quote, method=METHOD, confidence=ev.basis, status=status,  # type: ignore[arg-type]
        reviewed_by=None,
    )


def build(include_unverified: bool = False) -> Built:
    ledgers, skipped = load_ledgers(include_unverified)
    comp_reg, inv_reg, fun_reg = registry.load_companies(), registry.load_investors(), registry.load_funders()
    manifest = manifest_by_sha()
    profiles = _seed("profiles.yaml", "profiles")

    orgs: dict[str, Organization] = {}
    companies: dict[str, Company] = {}
    investors: dict[str, Investor] = {}
    funders: dict[str, PublicFunder] = {}
    events: list[FundingEvent] = []
    parts: list[Participation] = []
    agreements: list[Agreement] = []
    claims: list[Claim] = []
    facts: list[Fact] = []
    evidence_index: dict[str, list[dict]] = {}
    used_snaps: set[str] = set()
    n = 0

    def add_evidence(subject: str, evs: list[Evidence], values: dict[str, object], status: str, review: str) -> None:
        nonlocal n
        by_field: dict[str, list[str]] = {}
        for ev in evs:
            n += 1
            used_snaps.add(ev.snapshot)
            claims.append(_claim(n, subject, ev, values.get(ev.field, ev.quote), status))
            by_field.setdefault(ev.field, []).append(claims[-1].id)
            snap = manifest.get(ev.snapshot, {})
            evidence_index.setdefault(f"{subject}#{ev.field}", []).append({
                "claim": claims[-1].id, "snapshot": ev.snapshot, "url": snap.get("url"), "original_url": ev.original_url,
                "fetched_at": snap.get("fetched_at"), "quote": ev.quote, "basis": ev.basis, "method": METHOD, "review": review,
            })
        for fld, ids in by_field.items():
            facts.append(Fact(subject=subject, predicate=fld, value=str(values.get(fld, "")), chosen_claim_id=ids[0],
                              supporting_claim_ids=tuple(ids[1:]), rule="first-evidence"))

    def party(slug: str, name: str, role: str) -> None:
        if slug in orgs:
            return
        if slug in fun_reg or role in {"grantor"}:
            orgs[slug] = _org(slug, name, "public_funder", fun_reg.get(slug))
            funders[slug] = PublicFunder(org_id=slug, level="national")
        else:
            orgs[slug] = _org(slug, name, "investor", inv_reg.get(slug))
            raw_type = (inv_reg[slug].extra.get("type") if slug in inv_reg else "") or "unknown"
            valid = Investor.model_fields["type"].annotation.__args__  # type: ignore[union-attr]
            investors[slug] = Investor(org_id=slug, type=raw_type if raw_type in valid else "unknown")  # type: ignore[arg-type]

    for led in ledgers:
        # Draft builds (--include-unverified) accept claims so the site can be developed; every evidence item still carries its
        # review state and the whole release is flagged DRAFT.
        status = "accepted"
        review = led.verification.status
        entry = comp_reg.get(led.company)
        prof = profiles.get(led.company, {})
        orgs[led.company] = _org(led.company, led.name, "company", entry).model_copy(update={
            k: v for k, v in {"country": prof.get("country"), "hq_city": prof.get("hq_city"), "website": prof.get("website"), "logo": prof.get("logo")}.items() if v
        })
        approach, tags = taxonomy.canonical(led.sector, (entry.extra.get("approach") or entry.extra.get("reactor_type") or "") if entry else "")
        approach = prof.get("approach") or approach
        companies[led.company] = Company(
            org_id=led.company, sector=led.sector, approach=approach, approach_tags=tags,
            fuel=(entry.extra.get("fuel") if entry and entry.extra.get("fuel") not in {None, "", "n/a", "unknown"} else None),
            value_chain_role=prof.get("role") or (entry.extra.get("role") if entry else None) or "developer",
            founded=prof.get("founded") or (int(entry.extra["founded"]) if entry and (entry.extra.get("founded") or "").isdigit() else None),
            status=(entry.extra.get("status") if entry and entry.extra.get("status") in {"active", "acquired", "public", "defunct"} else "active"),  # type: ignore[arg-type]
        )
        for e in led.events:
            amount = _usd(e.amount, e.announced_on)
            events.append(FundingEvent(
                id=e.id, company_id=led.company, instrument=e.instrument, round_label=e.round_label,
                round_group=e.round_group, announced_on=e.announced_on, closed_on=e.closed_on, amount=amount,
                amount_kind=e.amount_kind, supersedes=e.supersedes, committed_usd=e.committed_usd,
                obligated_usd=e.obligated_usd, disbursed_usd=e.disbursed_usd, valuation_post_usd=e.valuation_post_usd,
                use_of_proceeds=e.use_of_proceeds, program_id=e.program,
            ))
            add_evidence(e.id, e.evidence, {"amount": e.amount.amount if e.amount else "", "announced_on": e.announced_on.isoformat(),
                                            "round_label": e.round_label or ""}, status, review)
            for p in e.participants:
                slug = resolve.resolve_slug(p.investor_slug)
                party(slug, p.investor, p.role)
                parts.append(Participation(event_id=e.id, org_id=slug, role=p.role, amount=_usd(p.amount, e.announced_on)))
                add_evidence(f"{e.id}:{slug}", p.evidence, {"participant": p.investor}, status, review)
        for a in led.agreements:
            cslug = resolve.resolve_slug(a.counterparty_slug)
            if cslug not in orgs:
                orgs[cslug] = _org(cslug, a.counterparty, "counterparty", comp_reg.get(cslug))
            agreements.append(Agreement(
                id=a.id, company_id=led.company, counterparty_id=cslug, type=a.type, binding=a.binding,
                announced_on=a.announced_on, capacity_mw=a.capacity_mw, value=_usd(a.value, a.announced_on), term_years=a.term_years,
            ))
            add_evidence(a.id, a.evidence, {"agreement": a.summary}, status, review)

    snapshots = tuple(
        Snapshot(
            id=sha, url=manifest[sha]["url"], final_url=manifest[sha].get("final_url"),
            fetched_at=datetime.fromisoformat(manifest[sha]["fetched_at"]), http_status=manifest[sha].get("http_status"),
            content_type=manifest[sha].get("content_type"), bytes=manifest[sha].get("bytes"),
            fetcher=manifest[sha].get("fetcher", "httpx"), robots_ok=manifest[sha].get("robots_ok"),
            source_id=manifest[sha].get("source_id", "adhoc"),
        )
        for sha in sorted(used_snaps) if sha in manifest
    )
    quote_texts = {sha: t for sha in used_snaps if (t := snapshot_text(sha)) is not None}
    ds = Dataset(
        organizations=tuple(orgs.values()), events=tuple(events), participations=tuple(parts), agreements=tuple(agreements),
        snapshots=snapshots, claims=tuple(claims), facts=tuple(facts), quote_texts=quote_texts,
    )
    return Built(ds, companies, investors, funders, tuple(ledgers), tuple(skipped), evidence_index)


__all__ = ["build", "Built", "LEDGER_DIR", "timezone"]
