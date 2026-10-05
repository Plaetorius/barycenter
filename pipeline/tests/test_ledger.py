import json

import pytest
import yaml

from barycenter import ledger, textify

SHA = "b" * 64
HTML = "<html><body><p>Acme raised <b>$100 million</b> in Series A led by Vee Capital.</p><script>x=1</script></body></html>"


@pytest.fixture()
def raw(tmp_path, monkeypatch):
    d = tmp_path / "raw" / SHA[:2]
    d.mkdir(parents=True)
    (d / f"{SHA}.html").write_text(HTML)
    (tmp_path / "raw" / "manifest.jsonl").write_text(json.dumps({"id": SHA, "url": "https://x.test"}) + "\n")
    for mod in (textify, ledger.__dict__.get("textify", textify)):
        monkeypatch.setattr(mod, "RAW", tmp_path / "raw")
    import barycenter.archive as a
    monkeypatch.setattr(a, "RAW", tmp_path / "raw")
    return tmp_path


def write(tmp, quote):
    doc = {
        "company": "acme", "name": "Acme", "sector": "fusion",
        "events": [{
            "id": "acme-2026-series-a", "instrument": "equity", "announced_on": "2026-01-02",
            "amount": {"amount": 100000000, "currency": "USD"},
            "evidence": [
                {"field": "amount", "snapshot": SHA, "quote": quote},
                {"field": "announced_on", "snapshot": SHA, "quote": quote},
            ],
            "participants": [{"investor": "Vee Capital", "investor_slug": "vee-capital", "role": "lead",
                              "evidence": [{"field": "participant", "snapshot": SHA, "quote": "Series A led by Vee Capital"}]}],
        }],
    }
    f = tmp / "acme.yaml"
    f.write_text(yaml.safe_dump(doc))
    return f


def test_valid_quote_passes(raw):
    assert ledger.check_file(write(raw, "Acme raised $100 million in Series A")) == []


def test_invented_quote_fails(raw):
    errs = ledger.check_file(write(raw, "Acme raised $500 million in Series A"))
    assert any("NOT FOUND" in e for e in errs)


def test_script_text_is_not_matchable(raw):
    errs = ledger.check_file(write(raw, "x=1 Acme raised"))
    assert any("NOT FOUND" in e for e in errs)


def test_amount_requires_evidence_item():
    with pytest.raises(Exception):
        ledger.LEvent.model_validate({
            "id": "e", "instrument": "equity", "announced_on": "2026-01-01",
            "amount": {"amount": 1, "currency": "USD"},
            "evidence": [{"field": "announced_on", "snapshot": SHA, "quote": "some quote here"}],
        })
