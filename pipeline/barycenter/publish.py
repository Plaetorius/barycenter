"""Write a release: JSON shards for the site, CSV exports, coverage report, checksums. Fails when a gate fails."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import shutil
import sys
from collections import defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import yaml

from barycenter import registry
from barycenter.build import Built, build
from barycenter.models import FundingEvent
from barycenter.validate.gates import run_gates

ROOT = Path(__file__).resolve().parents[2]
EQUITY = {"equity", "follow_on", "ipo", "spac"}
PUBLIC = {"grant", "cost_share", "voucher"}
DISCLAIMER = (
    "Compiled from public filings, government data and company announcements. Not exhaustive: undisclosed rounds and "
    "amounts are missing. Not investment, legal or financial advice. Licence: CC BY 4.0, attribute Barycenter "
    "(Mertia Labs) and the cited sources."
)


def _group(instrument: str) -> str:
    return "equity" if instrument in EQUITY else "public" if instrument in PUBLIC else "debt"


def _counted(events: list[FundingEvent]) -> list[FundingEvent]:
    superseded = {e.supersedes for e in events if e.supersedes and e.amount_kind != "duplicate"}
    return [e for e in events if e.amount_kind == "new_money" and e.id not in superseded]


def _totals(events: list[FundingEvent]) -> dict:
    t = {"equity": 0.0, "public": 0.0, "debt": 0.0, "obligated": 0.0, "disbursed": 0.0, "ceiling": 0.0, "approx": False, "undisclosed": 0}
    for e in events:  # commitments, facilities and programme maximums: shown beside the total, never inside it
        if e.amount_kind == "ceiling" and e.amount and e.amount.usd:
            t["ceiling"] += e.amount.usd
    for e in _counted(events):
        if e.amount and e.amount.usd:
            t[_group(e.instrument)] += e.amount.usd
            t["approx"] = t["approx"] or e.amount.qualifier != "exact"
        else:
            t["undisclosed"] += 1
        t["obligated"] += e.obligated_usd or 0
        t["disbursed"] += e.disbursed_usd or 0
    t["total"] = t["equity"] + t["public"] + t["debt"]
    return t


def _dump(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":"), sort_keys=True, default=str))


def _event_json(e: FundingEvent, parts: list, orgs: dict) -> dict:
    d = json.loads(e.model_dump_json())
    d["participants"] = [
        {"org_id": p.org_id, "name": orgs[p.org_id].name, "role": p.role, "amount": json.loads(p.amount.model_dump_json()) if p.amount else None}
        for p in parts
    ]
    return d


def write_release(b: Built, out: Path, release: str, draft: bool, findings: list) -> dict:
    ds = b.dataset
    orgs = {o.id: o for o in ds.organizations}
    ev_by_company: dict[str, list[FundingEvent]] = defaultdict(list)
    for e in ds.events:
        ev_by_company[e.company_id].append(e)
    parts_by_event = defaultdict(list)
    for p in ds.participations:
        parts_by_event[p.event_id].append(p)
    ev_by_id = {e.id: e for e in ds.events}
    notes = {led.company: led.notes for led in b.ledgers}

    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)

    company_rows, edges = [], defaultdict(lambda: {"events": 0, "instruments": set(), "years": set(), "usd": 0.0, "lead": False})
    for cid, comp in b.companies.items():
        o, evs = orgs[cid], sorted(ev_by_company[cid], key=lambda e: e.announced_on)
        investors = {p.org_id for e in evs for p in parts_by_event[e.id]}
        row = {
            "id": cid, "name": o.name, "sector": comp.sector, "approach": comp.approach, "fuel": comp.fuel,
            "role": comp.value_chain_role, "status": comp.status, "logo": o.logo, "country": o.country, "city": o.hq_city, "website": o.website,
            "totals": _totals(evs), "events": len(evs), "investors": len(investors),
            "first_event_on": evs[0].announced_on.isoformat() if evs else None, "last_event_on": evs[-1].announced_on.isoformat() if evs else None,
        }
        company_rows.append(row)
        for e in evs:
            for p in parts_by_event[e.id]:
                k = edges[(p.org_id, cid)]
                k["events"] += 1
                k["instruments"].add(e.instrument)
                k["years"].add(e.announced_on.year)
                k["usd"] += p.amount.usd if p.amount and p.amount.usd else 0
                k["lead"] = k["lead"] or p.role == "lead"
        agreements = [a for a in ds.agreements if a.company_id == cid]
        _dump(out / "entities" / f"{cid}.json", {
            "kind": "company", "org": json.loads(o.model_dump_json()), "company": json.loads(comp.model_dump_json()),
            "totals": row["totals"], "notes": notes.get(cid),
            "events": [_event_json(e, parts_by_event[e.id], orgs) for e in evs],
            "agreements": [{**json.loads(a.model_dump_json()), "counterparty": orgs[a.counterparty_id].name} for a in agreements],
        })
        ev_keys = {e.id for e in evs} | {f"{e.id}:{p.org_id}" for e in evs for p in parts_by_event[e.id]} | {a.id for a in agreements}
        _dump(out / "evidence" / f"{cid}.json", {k: v for k, v in b.evidence_index.items() if k.split("#")[0] in ev_keys})
    _dump(out / "index" / "companies.json", sorted(company_rows, key=lambda r: -r["totals"]["total"]))

    inv_rows, fun_rows = [], []
    for iid, inv in list(b.investors.items()) + list(b.funders.items()):
        is_fund = iid in b.funders
        o = orgs[iid]
        mine = [(e, p) for e in ds.events for p in parts_by_event[e.id] if p.org_id == iid]
        cos = sorted({e.company_id for e, _ in mine})
        row = {
            "id": iid, "name": o.name, "type": getattr(inv, "type", None) or "public_funder", "country": o.country, "website": o.website,
            "companies": len(cos), "events": len(mine),
            "disclosed_usd": sum(p.amount.usd for _, p in mine if p.amount and p.amount.usd),
            "sectors": sorted({b.companies[c].sector for c in cos}), "approaches": sorted({b.companies[c].approach for c in cos if b.companies[c].approach}),
            "first_event_on": min((e.announced_on for e, _ in mine), default=None), "last_event_on": max((e.announced_on for e, _ in mine), default=None),
        }
        (fun_rows if is_fund else inv_rows).append(row)
        _dump(out / "entities" / f"{iid}.json", {
            "kind": "public_funder" if is_fund else "investor", "org": json.loads(o.model_dump_json()), "summary": row,
            "portfolio": [{**_event_json(e, [p], orgs), "company": orgs[e.company_id].name} for e, p in sorted(mine, key=lambda x: x[0].announced_on)],
        })
    _dump(out / "index" / "investors.json", sorted(inv_rows, key=lambda r: (-r["companies"], r["name"])))
    _dump(out / "index" / "funders.json", sorted(fun_rows, key=lambda r: (-r["companies"], r["name"])))
    _dump(out / "graph" / "edges.json", [
        {"investor": i, "company": c, "events": v["events"], "instruments": sorted(v["instruments"]), "years": sorted(v["years"]),
         "disclosed_usd": v["usd"], "lead": v["lead"], "sector": b.companies[c].sector}
        for (i, c), v in sorted(edges.items())
    ])
    _dump(out / "search.json", [
        {"id": o.id, "kind": ("company" if o.id in b.companies else "funder" if o.id in b.funders else "investor"), "name": o.name,
         "aliases": list(o.aliases), "sector": b.companies[o.id].sector if o.id in b.companies else None}
        for o in ds.organizations if o.id in b.companies or o.id in b.investors or o.id in b.funders
    ])

    cited_by: dict[str, int] = defaultdict(int)
    originals: dict[str, str] = {}
    for items in b.evidence_index.values():
        for it in items:
            cited_by[it["snapshot"]] += 1
            if it.get("original_url"):
                originals[it["snapshot"]] = it["original_url"]
    _dump(out / "sources.json", [
        {"id": s.id, "url": s.url, "original_url": originals.get(s.id), "host": urlparse(originals.get(s.id) or s.url).netloc,
         "fetched_at": s.fetched_at, "source_id": s.source_id, "cited_by": cited_by[s.id]}
        for s in ds.snapshots
    ])

    counted = _counted(list(ds.events))
    by_year: dict[int, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    by_approach: dict[tuple[str, str], dict] = {}
    for e in counted:
        if not (e.amount and e.amount.usd):
            continue
        comp = b.companies[e.company_id]
        by_year[e.announced_on.year][f"{comp.sector}:{_group(e.instrument)}"] += e.amount.usd
        k = (comp.sector, (comp.approach or "unspecified").replace("other:", ""))
        row = by_approach.setdefault(k, {"sector": k[0], "approach": k[1], "usd": 0.0, "companies": set()})
        row["usd"] += e.amount.usd
        row["companies"].add(e.company_id)
    top = sorted((e for e in counted if e.amount and e.amount.usd), key=lambda e: -e.amount.usd)[:25]  # type: ignore[union-attr]
    _dump(out / "overview.json", {
        "by_year": [{"year": y, **v} for y, v in sorted(by_year.items())],
        "by_approach": sorted(({**r, "companies": len(r["companies"])} for r in by_approach.values()), key=lambda r: -r["usd"]),
        "top_rounds": [{"id": e.id, "company_id": e.company_id, "company": orgs[e.company_id].name, "sector": b.companies[e.company_id].sector,
                        "instrument": e.instrument, "round_label": e.round_label, "announced_on": e.announced_on, "usd": e.amount.usd} for e in top],  # type: ignore[union-attr]
    })
    by_sector = defaultdict(float)
    for e in counted:
        if e.amount and e.amount.usd and e.instrument in EQUITY:
            by_sector[b.companies[e.company_id].sector] += e.amount.usd
    bench = yaml.safe_load((ROOT / "pipeline" / "seeds" / "benchmarks.yaml").read_text())["benchmarks"]
    cov = {
        "release": release, "draft": draft, "generated_at": datetime.now(timezone.utc).isoformat(), "disclaimer": DISCLAIMER,
        "counts": {
            "census_candidates": len(registry.load_companies()), "companies": len(b.companies), "investors": len(b.investors), "funders": len(b.funders), "events": len(ds.events),
            "participations": len(ds.participations), "agreements": len(ds.agreements), "claims": len(ds.claims), "snapshots": len(ds.snapshots),
            "events_undisclosed_amount": sum(1 for e in ds.events if not e.amount),
            "participations_with_amount": sum(1 for p in ds.participations if p.amount),
        },
        "equity_usd_by_sector": dict(by_sector),
        "benchmarks": [{**x, "ours_usd": by_sector.get(x["scope"], 0.0), "ratio": by_sector.get(x["scope"], 0.0) / x["usd"]} for x in bench],
        "skipped_ledgers": list(b.skipped),
        "findings": [{"gate": f.gate, "severity": f.severity, "message": f.message} for f in findings],
    }
    _dump(out / "coverage.json", cov)

    exp = out / "exports"
    exp.mkdir()
    with (exp / "events.csv").open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["event_id", "company", "instrument", "round_label", "announced_on", "amount", "currency", "amount_usd", "qualifier", "amount_kind", "obligated_usd", "disbursed_usd"])
        for e in ds.events:
            a = e.amount
            w.writerow([e.id, e.company_id, e.instrument, e.round_label or "", e.announced_on, a.amount if a else "", a.currency if a else "", a.usd if a else "", a.qualifier if a else "", e.amount_kind, e.obligated_usd or "", e.disbursed_usd or ""])
    with (exp / "participations.csv").open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["event_id", "company", "org_id", "org_name", "role", "amount_usd_disclosed"])
        for p in ds.participations:
            w.writerow([p.event_id, ev_by_id[p.event_id].company_id, p.org_id, orgs[p.org_id].name, p.role, p.amount.usd if p.amount and p.amount.usd else ""])
    with (exp / "evidence.csv").open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["subject", "field", "snapshot_sha256", "url", "original_url", "fetched_at", "basis", "quote"])
        for k, items in sorted(b.evidence_index.items()):
            s, fld = k.split("#")
            for it in items:
                w.writerow([s, fld, it["snapshot"], it["url"], it.get("original_url") or "", it["fetched_at"], it["basis"], it["quote"]])
    (exp / "README.txt").write_text(f"Barycenter release {release}\n\n{DISCLAIMER}\n")

    sums = {str(p.relative_to(out)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob("*")) if p.is_file()}
    _dump(out / "release.json", {"release": release, "draft": draft, "generated_at": cov["generated_at"], "files": len(sums)})
    (out / "checksums.sha256").write_text("".join(f"{h}  {p}\n" for p, h in sums.items()))
    return cov


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--include-unverified", action="store_true", help="dev build; the release is marked DRAFT")
    ap.add_argument("--out", default=str(ROOT / "site" / "public" / "data"))
    a = ap.parse_args()
    b = build(a.include_unverified)
    findings = run_gates(b.dataset)
    errors = [f for f in findings if f.severity == "error"]
    for f in findings:
        print(f"[{f.severity}] {f.gate}: {f.message}")
    for s in b.skipped:
        print(f"[skip] {s}")
    if errors:
        print(f"{len(errors)} gate errors: release not written", file=sys.stderr)
        return 1
    release = "v" + date.today().strftime("%Y.%m.%d")
    cov = write_release(b, Path(a.out), release, a.include_unverified, findings)
    print(json.dumps(cov["counts"], indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
