from datetime import date

from barycenter.merge import likely_duplicate, _dup_agreement


def ev(instr="equity", day="2026-01-10", amt=100.0, cur="USD", label=None):
    return {"instrument": instr, "announced_on": day, "amount": {"amount": amt, "currency": cur} if amt else None, "round_label": label}


def test_near_equal_same_window_is_a_duplicate():
    assert likely_duplicate(ev(amt=100), ev(day="2026-02-01", amt=105))


def test_different_amount_is_a_new_event():
    assert not likely_duplicate(ev(amt=100), ev(day="2026-01-20", amt=300))


def test_far_apart_dates_are_not_duplicates():
    assert not likely_duplicate(ev(amt=100), ev(day="2027-01-10", amt=100))


def test_same_label_without_amounts_is_a_duplicate():
    assert likely_duplicate(ev(amt=None, label="Series A"), ev(day="2026-01-12", amt=None, label="series a"))


def test_grant_and_equity_never_collide():
    assert not likely_duplicate(ev("grant", amt=100), ev("equity", amt=100))


def test_agreement_duplicate_needs_same_party_type_and_window():
    a = {"counterparty_slug": "tva", "type": "ppa", "announced_on": date(2026, 1, 1)}
    assert _dup_agreement(a, {**a, "announced_on": date(2026, 1, 20)})
    assert not _dup_agreement(a, {**a, "type": "offtake"})
