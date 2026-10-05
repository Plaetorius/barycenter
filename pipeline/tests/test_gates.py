from datetime import date, datetime, timezone

import pytest
from pydantic import ValidationError

from barycenter.models import Claim, Fact, FundingEvent, Money, Organization, Participation, Snapshot
from barycenter.validate.gates import Dataset, run_gates

SHA = "a" * 64
NOW = datetime(2026, 10, 5, tzinfo=timezone.utc)


def org(i, kind="company"):
    return Organization(id=i, kind=kind, name=i.title())


def snap():
    return Snapshot(id=SHA, url="https://x.test/a", fetched_at=NOW, fetcher="httpx", source_id="t")


def claim(**kw):
    base = dict(id="c1", subject="evt-1", predicate="raised_amount", value=100.0, snapshot_id=SHA,
                locator="/amount", method="parser:t@1", confidence="disclosed", status="accepted")
    return Claim(**{**base, **kw})


def test_clean_dataset_has_no_findings():
    d = Dataset(
        organizations=(org("acme"), org("vc-one", "investor")),
        events=(FundingEvent(id="evt-1", company_id="acme", instrument="equity", announced_on=date(2026, 1, 1),
                             amount=Money(amount=100, currency="USD", usd=100)),),
        participations=(Participation(event_id="evt-1", org_id="vc-one"),),
        snapshots=(snap(),), claims=(claim(),),
        facts=(Fact(subject="evt-1", predicate="raised_amount", value=100.0, chosen_claim_id="c1", rule="r"),),
    )
    assert run_gates(d) == []


def test_orphan_participation_is_an_error():
    d = Dataset(organizations=(org("vc-one", "investor"),),
                participations=(Participation(event_id="nope", org_id="vc-one"),))
    assert any(f.gate == "integrity" for f in run_gates(d))


def test_participations_cannot_exceed_round():
    d = Dataset(
        organizations=(org("acme"), org("a", "investor")),
        events=(FundingEvent(id="e", company_id="acme", instrument="equity", announced_on=date(2026, 1, 1),
                             amount=Money(amount=10, currency="USD", usd=10)),),
        participations=(Participation(event_id="e", org_id="a", amount=Money(amount=20, currency="USD", usd=20)),),
        claims=(claim(subject="e:a"),), snapshots=(snap(),),
    )
    assert any(f.gate == "money" for f in run_gates(d))


def test_participation_amount_needs_disclosed_claim():
    d = Dataset(
        organizations=(org("acme"), org("a", "investor")),
        events=(FundingEvent(id="e", company_id="acme", instrument="equity", announced_on=date(2026, 1, 1)),),
        participations=(Participation(event_id="e", org_id="a", amount=Money(amount=5, currency="USD", usd=5)),),
    )
    assert any(f.gate == "disclosure" for f in run_gates(d))


def test_missing_quote_in_snapshot_text_fails():
    d = Dataset(snapshots=(snap(),), claims=(claim(quote="raised $100 million"),), quote_texts={SHA: "nothing here"})
    assert any(f.gate == "quote" for f in run_gates(d))


def test_quote_match_ignores_whitespace_and_case():
    d = Dataset(snapshots=(snap(),), claims=(claim(quote="Raised $100  million"),),
                quote_texts={SHA: "we raised\n$100 million today"})
    assert [f for f in run_gates(d) if f.gate == "quote"] == []


def test_fact_on_unaccepted_claim_fails():
    d = Dataset(snapshots=(snap(),), claims=(claim(status="pending"),),
                facts=(Fact(subject="evt-1", predicate="raised_amount", value=1.0, chosen_claim_id="c1", rule="r"),))
    assert any(f.gate == "evidence" for f in run_gates(d))


def test_llm_claim_requires_quote():
    with pytest.raises(ValidationError):
        claim(method="llm:sonnet|prompt:abc")


def test_round_may_close_before_it_is_announced():
    FundingEvent(id="e", company_id="a", instrument="equity", announced_on=date(2026, 2, 1), closed_on=date(2026, 1, 20))
