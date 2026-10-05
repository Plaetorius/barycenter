from datetime import date

from barycenter.models import FundingEvent, Money
from barycenter.publish import _counted, _totals


def ev(i, usd, kind="new_money", instrument="equity", supersedes=None, undisclosed=False):
    return FundingEvent(
        id=i, company_id="acme", instrument=instrument, announced_on=date(2026, 1, 1), amount_kind=kind, supersedes=supersedes,
        amount=None if undisclosed else Money(amount=usd, currency="USD", usd=usd),
    )


def test_only_new_money_is_counted():
    events = [ev("a", 100), ev("b", 500, kind="cumulative"), ev("c", 900, kind="ceiling"), ev("d", 100, kind="duplicate", supersedes="a")]
    assert [e.id for e in _counted(events)] == ["a"]
    assert _totals(events)["total"] == 100


def test_edited_release_counts_only_the_replacement():
    events = [ev("old", 465), ev("new", 500, supersedes="old")]
    assert [e.id for e in _counted(events)] == ["new"]


def test_duplicate_does_not_hide_the_original():
    events = [ev("release", 100), ev("form-d", 100, kind="duplicate", supersedes="release")]
    assert [e.id for e in _counted(events)] == ["release"]


def test_instrument_groups_split_totals():
    t = _totals([ev("e", 100), ev("g", 10, instrument="grant"), ev("l", 5, instrument="debt")])
    assert (t["equity"], t["public"], t["debt"], t["total"]) == (100, 10, 5, 115)


def test_undisclosed_amounts_are_counted_separately_not_as_zero():
    t = _totals([ev("e", 100), ev("u", 0, undisclosed=True)])
    assert t["total"] == 100 and t["undisclosed"] == 1


def test_ceilings_are_reported_beside_the_total_not_inside_it():
    t = _totals([ev("raised", 100), ev("atm", 900, kind="ceiling")])
    assert t["total"] == 100 and t["ceiling"] == 900
