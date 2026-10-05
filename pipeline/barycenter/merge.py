"""Merge a later-pass additions file into the verified ledger without overwriting anything.

    .venv/bin/python -m barycenter.merge ledger-additions/<slug>.yaml [...]

Rules: never edit or drop existing items; new events/agreements/participants are appended as review=pending (excluded from
non-draft releases until an independent verifier flips them); likely duplicates of existing events are NOT merged but written
to ledger-additions/_conflicts/<slug>.yaml for the verifier. A company with no ledger yet becomes a new ledger (all pending).
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

import yaml

from barycenter.ledger import Ledger, check_file

ROOT = Path(__file__).resolve().parent.parent
LEDGER = ROOT / "ledger"
CONFLICTS = ROOT / "ledger-additions" / "_conflicts"
EQUITY = {"equity", "follow_on", "ipo", "spac"}
PUBLIC = {"grant", "cost_share", "voucher"}


def _group(instr: str) -> str:
    return "equity" if instr in EQUITY else "public" if instr in PUBLIC else "debt"


def _usd(ev: dict) -> float | None:
    a = ev.get("amount")
    return float(a["amount"]) if a else None


def _day(v) -> date:
    return v if isinstance(v, date) else date.fromisoformat(str(v))


def likely_duplicate(new: dict, old: dict) -> bool:
    if _group(new["instrument"]) != _group(old["instrument"]):
        return False
    if abs((_day(new["announced_on"]) - _day(old["announced_on"])).days) > 60:
        return False
    a, b = _usd(new), _usd(old)
    if a and b and new["amount"]["currency"] == old["amount"]["currency"]:
        return abs(a - b) <= 0.10 * max(a, b)
    la, lb = (new.get("round_label") or "").strip().lower(), (old.get("round_label") or "").strip().lower()
    return bool(la and la == lb)


def _dup_agreement(new: dict, old: dict) -> bool:
    return (new["counterparty_slug"] == old["counterparty_slug"] and new["type"] == old["type"]
            and abs((_day(new["announced_on"]) - _day(old["announced_on"])).days) <= 45)


def merge_file(path: Path, pass_name: str = "pass2") -> dict:
    errs = check_file(path)
    if errs:
        return {"file": path.name, "error": errs[:5]}
    add = yaml.safe_load(path.read_text())
    Ledger.model_validate(add)
    target = LEDGER / f"{add['company']}.yaml"
    report = {"file": path.name, "company": add["company"], "added_events": 0, "added_agreements": 0, "added_participants": 0,
              "skipped_same_id": [], "conflicts": []}
    if not target.exists():
        for e in add.get("events", []):
            e.update(review="pending", source_pass=pass_name)
            for p in e.get("participants", []):
                p["review"] = "pending"
        for a in add.get("agreements", []):
            a.update(review="pending", source_pass=pass_name)
        add["verification"] = {"status": "pending"}
        report["added_events"], report["added_agreements"] = len(add.get("events", [])), len(add.get("agreements", []))
        target.write_text(yaml.safe_dump(add, sort_keys=False, allow_unicode=True, width=120))
        return report
    cur = yaml.safe_load(target.read_text())
    by_id = {e["id"]: e for e in cur.get("events", [])}
    conflicts = {"company": add["company"], "name": add["name"], "sector": add["sector"], "events": [], "agreements": []}
    for e in add.get("events", []):
        if e["id"] in by_id:
            have = {p["investor_slug"] for p in by_id[e["id"]].get("participants", [])}
            for p in e.get("participants", []):
                if p["investor_slug"] not in have:
                    by_id[e["id"]].setdefault("participants", []).append({**p, "review": "pending"})
                    report["added_participants"] += 1
            report["skipped_same_id"].append(e["id"])
            continue
        dup = next((o for o in cur.get("events", []) if likely_duplicate(e, o)), None)
        if dup:
            conflicts["events"].append(e)
            report["conflicts"].append(f"{e['id']} ~ {dup['id']}")
            continue
        e.update(review="pending", source_pass=pass_name)
        for p in e.get("participants", []):
            p["review"] = "pending"
        cur.setdefault("events", []).append(e)
        report["added_events"] += 1
    for a in add.get("agreements", []):
        old = next((o for o in cur.get("agreements", []) if o["id"] == a["id"] or _dup_agreement(a, o)), None)
        if old:
            conflicts["agreements"].append(a)
            report["conflicts"].append(f"{a['id']} ~ {old['id']}")
            continue
        a.update(review="pending", source_pass=pass_name)
        cur.setdefault("agreements", []).append(a)
        report["added_agreements"] += 1
    if add.get("notes"):
        cur["notes"] = f"{cur.get('notes') or ''}\n[{pass_name}] {add['notes']}".strip()
    target.write_text(yaml.safe_dump(cur, sort_keys=False, allow_unicode=True, width=120))
    if conflicts["events"] or conflicts["agreements"]:
        CONFLICTS.mkdir(parents=True, exist_ok=True)
        (CONFLICTS / f"{add['company']}.yaml").write_text(yaml.safe_dump(conflicts, sort_keys=False, allow_unicode=True, width=120))
    return report


def main(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 2
    bad = 0
    for f in argv:
        r = merge_file(Path(f))
        print(r)
        bad += "error" in r
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
