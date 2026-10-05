"""Entity resolution: alias table + near-duplicate report for investor / funder / counterparty slugs.

    .venv/bin/python -m barycenter.resolve report      # candidate duplicate pairs, never merged automatically
Merges are decisions: they live in seeds/aliases.yaml (reviewed, committed) and are applied by the build.
"""
from __future__ import annotations

import re
import sys
from functools import lru_cache
from pathlib import Path

import yaml
from rapidfuzz import fuzz

ALIASES = Path(__file__).resolve().parent.parent / "seeds" / "aliases.yaml"
NOISE = re.compile(r"\b(inc|ltd|llc|lp|l\.p|gmbh|sas|sa|plc|co|corp|corporation|company|group|holdings|fund|funds|partners|capital|ventures|venture|management|investments?|the)\b")


def normalise(name: str) -> str:
    s = re.sub(r"[^a-z0-9 ]+", " ", name.lower())
    return " ".join(NOISE.sub(" ", s).split())


@lru_cache(maxsize=1)
def alias_map() -> dict[str, str]:
    """alt-slug -> canonical slug."""
    if not ALIASES.exists():
        return {}
    raw = yaml.safe_load(ALIASES.read_text()) or {}
    out: dict[str, str] = {}
    for canonical, spec in (raw.get("merge") or {}).items():
        for alt in spec:
            out[alt] = canonical
    return out


def parents() -> dict[str, str]:
    raw = yaml.safe_load(ALIASES.read_text()) if ALIASES.exists() else {}
    return (raw or {}).get("parents") or {}


def resolve_slug(slug: str) -> str:
    return alias_map().get(slug, slug)


def candidate_pairs(names: dict[str, str], threshold: int = 86) -> list[tuple[str, str, int]]:
    """names: slug -> display name. Returns slug pairs whose normalised names look alike."""
    items = [(s, normalise(n)) for s, n in names.items()]
    out = []
    for i, (a, na) in enumerate(items):
        for b, nb in items[i + 1:]:
            if not na or not nb:
                continue
            score = 100 if na == nb else fuzz.ratio(na, nb)
            if score >= threshold:
                out.append((a, b, int(score)))
    return sorted(out, key=lambda t: -t[2])


def main(argv: list[str]) -> int:
    if not argv or argv[0] != "report":
        print(__doc__)
        return 2
    from barycenter.build import build
    b = build(include_unverified=True)
    names = {o.id: o.name for o in b.dataset.organizations if o.kind != "company"}
    for a, c, score in candidate_pairs(names):
        print(f"{score:3d}  {a} ({names[a]})  <->  {c} ({names[c]})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
