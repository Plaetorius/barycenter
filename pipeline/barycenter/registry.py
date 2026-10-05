"""Load the census CSVs (universe, investors, public funders) into lookup tables."""
from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path

SURVEY = Path(__file__).resolve().parents[2] / "docs" / "survey"


@dataclass(frozen=True)
class Entry:
    slug: str
    name: str
    country: str | None
    city: str | None
    website: str | None
    extra: dict[str, str]


def _country(v: str | None) -> str | None:
    v = (v or "").strip().upper()
    return v if re.fullmatch(r"[A-Z]{2}", v) else None


def _read(path: Path, country_col: str) -> dict[str, Entry]:
    out: dict[str, Entry] = {}
    if not path.exists():
        return out
    with path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            slug = (row.get("slug") or "").strip()
            if not slug:
                continue
            out[slug] = Entry(
                slug=slug, name=row.get("name", slug).strip(), country=_country(row.get(country_col)),
                city=(row.get("hq_city") or "").strip() or None,
                website=(row.get("website") or "").strip() or None, extra=row,
            )
    return out


def load_companies() -> dict[str, Entry]:
    return {**_read(SURVEY / "universe-fission.csv", "hq_country"), **_read(SURVEY / "universe-fusion.csv", "hq_country")}


def load_investors() -> dict[str, Entry]:
    return _read(SURVEY / "investors.csv", "hq_country")


def load_funders() -> dict[str, Entry]:
    return _read(SURVEY / "public-funders.csv", "country")
