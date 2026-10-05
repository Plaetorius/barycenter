"""Turn an archived snapshot into the plain text that quotes are matched against."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import warnings

from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

from barycenter.archive import RAW, ROOT


def norm(s: str) -> str:
    return " ".join(s.replace(" ", " ").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').split()).casefold()


def snapshot_path(sha: str) -> Path | None:
    hits = list((RAW / sha[:2]).glob(f"{sha}.*"))
    return hits[0] if hits else None


def snapshot_text(sha: str) -> str | None:
    path = snapshot_path(sha)
    if path is None:
        return None
    raw = path.read_bytes()
    ext = path.suffix.lower()
    if ext in {".html", ".htm", ".xml"}:
        soup = BeautifulSoup(raw, "xml" if ext == ".xml" else "lxml")
        for t in soup(["script", "style", "noscript"]):
            t.decompose()
        return soup.get_text(" ")
    if ext == ".pdf":
        try:
            return subprocess.run(["pdftotext", "-layout", str(path), "-"], capture_output=True, text=True, check=True).stdout
        except (OSError, subprocess.CalledProcessError):
            return None
    text = raw.decode("utf-8", errors="replace")
    if ext == ".json":  # quote may be a JSON fragment or its pretty-printed form
        try:
            text += " " + json.dumps(json.loads(text), ensure_ascii=False)
        except ValueError:
            pass
    return text


def manifest_by_sha() -> dict[str, dict]:
    out: dict[str, dict] = {}
    mf = RAW / "manifest.jsonl"
    if mf.exists():
        for line in mf.read_text().splitlines():
            rec = json.loads(line)
            if rec.get("id"):
                out.setdefault(rec["id"], rec)
    return out
