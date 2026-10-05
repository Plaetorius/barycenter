"""Content-addressed archive for every fetched document.

CLI:  .venv/bin/python -m barycenter.archive <url> [--source SOURCE_ID] [--header 'K: V'] [--api-policy REASON]
Prints a JSON line with the snapshot record. Bytes land in raw/<sha[:2]>/<sha>.<ext>; one manifest line per fetch
is appended to raw/manifest.jsonl (committed copy: raw-manifest.jsonl is synced by `make manifest`).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import httpx
from protego import Protego

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "raw"
MANIFEST = RAW / "manifest.jsonl"
USER_AGENT = "BarycenterBot/0.1 (+https://labs.mertia.xyz/barycenter; tom.gernez@gmail.com)"
MIN_INTERVAL_S = 1.0
_last_hit: dict[str, float] = {}
_robots: dict[str, Protego | None] = {}


def _robots_ok(url: str) -> bool:
    """robots.txt check with wildcard support (Protego). Unreachable or 4xx robots.txt means allowed."""
    p = urlparse(url)
    base = f"{p.scheme}://{p.netloc}"
    if base not in _robots:
        try:
            r = httpx.get(base + "/robots.txt", headers={"User-Agent": USER_AGENT}, timeout=15, follow_redirects=True)
            _robots[base] = None if r.status_code >= 400 else Protego.parse(r.text)
        except httpx.HTTPError:
            _robots[base] = None
    rp = _robots[base]
    return True if rp is None else rp.can_fetch(url, USER_AGENT)


def _ext(content_type: str, url: str) -> str:
    ct = content_type.split(";")[0].strip()
    if ct == "application/json" or ct.endswith("+json"):
        return "json"
    return (mimetypes.guess_extension(ct) or Path(urlparse(url).path).suffix or ".bin").lstrip(".")


def fetch(url: str, source: str = "adhoc", headers: dict[str, str] | None = None, api_policy: str | None = None) -> dict:
    """api_policy: reason to skip robots.txt for a documented programmatic API whose own usage policy we follow
    (e.g. Wikidata SPARQL with a descriptive User-Agent). Logged in the manifest. Never used for HTML crawling."""
    host = urlparse(url).netloc
    wait = MIN_INTERVAL_S - (time.monotonic() - _last_hit.get(host, 0))
    if wait > 0:
        time.sleep(wait)
    robots_ok = None if api_policy else _robots_ok(url)
    rec = {
        "url": url, "source_id": source, "fetched_at": datetime.now(timezone.utc).isoformat(),
        "fetcher": "httpx", "robots_ok": robots_ok, "api_policy": api_policy,
    }
    if robots_ok is False:
        rec.update(http_status=None, error="blocked by robots.txt", id=None)
        _append(rec)
        return rec
    h = {"User-Agent": USER_AGENT, "Accept": "*/*", **(headers or {})}
    r = httpx.get(url, headers=h, timeout=60, follow_redirects=True)
    _last_hit[host] = time.monotonic()
    body = r.content
    sha = hashlib.sha256(body).hexdigest()
    ext = _ext(r.headers.get("content-type", ""), str(r.url))
    path = RAW / sha[:2] / f"{sha}.{ext}"
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_bytes(body)
    rec.update(
        id=sha, final_url=str(r.url), http_status=r.status_code, content_type=r.headers.get("content-type"),
        bytes=len(body), path=str(path.relative_to(ROOT)),
    )
    _append(rec)
    return rec


def _append(rec: dict) -> None:
    RAW.mkdir(exist_ok=True)
    with MANIFEST.open("a") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--source", default="adhoc")
    ap.add_argument("--header", action="append", default=[])
    ap.add_argument("--api-policy", default=None, help="reason robots.txt is skipped (documented API only)")
    a = ap.parse_args()
    hdrs = dict(x.split(": ", 1) for x in a.header)
    print(json.dumps(fetch(a.url, a.source, hdrs, a.api_policy), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
