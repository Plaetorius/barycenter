import pytest

from barycenter.taxonomy import canonical


@pytest.mark.parametrize("sector,raw,key", [
    ("fusion", "laser-ICF", "laser-icf"),
    ("fusion", "spherical-tokamak", "spherical-tokamak"),
    ("fusion", "other:projectile-driven inertial fusion; amplifier tech", "inertial-other"),
    ("fusion", "sheared-flow-zpinch", "pulsed-power"),
    ("fusion", "HTS-tape", "hts-magnets"),
    ("fusion", "other:unspecified", None),
    ("fusion", "other:muon-catalyzed", "other"),
    ("fission", "LWR SMR", "lwr-smr"),
    ("fission", "n/a", None),
])
def test_primary_key(sector, raw, key):
    assert canonical(sector, raw)[0] == key


def test_multi_technology_keeps_secondary_tags():
    assert canonical("fission", "Large LWR|LWR SMR|microreactor|heat pipe") == ("large-lwr", ("lwr-smr", "microreactor"))
