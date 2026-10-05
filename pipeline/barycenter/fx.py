"""FX conversion at the announcement date via Frankfurter (ECB reference rates). Each rate is an archived snapshot."""
from __future__ import annotations

import json
from datetime import date, timedelta
from functools import lru_cache

from barycenter import archive
from barycenter.textify import snapshot_path

API = "https://api.frankfurter.dev/v1/{day}?base={cur}&symbols=USD"
MAX_LOOKBACK_DAYS = 7


class FxError(RuntimeError):
    pass


@lru_cache(maxsize=None)
def usd_rate(currency: str, day: date) -> tuple[float, date, str]:
    """Returns (rate, rate_date, snapshot_sha). Walks back over weekends/holidays the API doesn't cover."""
    if currency == "USD":
        return 1.0, day, ""
    for back in range(MAX_LOOKBACK_DAYS):
        d = day - timedelta(days=back)
        rec = archive.fetch(API.format(day=d.isoformat(), cur=currency), source="fx-frankfurter")
        if rec.get("http_status") != 200:
            continue
        path = snapshot_path(rec["id"])
        data = json.loads(path.read_text())  # type: ignore[union-attr]
        rate = data.get("rates", {}).get("USD")
        if rate:
            return float(rate), date.fromisoformat(data["date"]), rec["id"]
    raise FxError(f"no USD rate for {currency} near {day}")
