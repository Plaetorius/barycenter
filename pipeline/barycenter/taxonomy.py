"""Canonical technology taxonomy. Census strings are free text; the site filters and colours by these keys."""
from __future__ import annotations

FUSION_RULES: tuple[tuple[tuple[str, ...], str], ...] = (
    (("spherical",), "spherical-tokamak"),
    (("tokamak",), "tokamak"),
    (("stellarator",), "stellarator"),
    (("frc", "field-reversed", "colliding oscillating", "spheromak"), "frc"),
    (("mirror",), "mirror"),
    (("dipole",), "levitated-dipole"),
    (("sheared", "zpinch", "z-pinch", "pulsed-power", "pulsed power", "dense-plasma"), "pulsed-power"),
    (("magnetized", "magneto-inertial", "whispering"), "magnetized-target"),
    (("laser-icf", "icf", "laser-driven", "inertial", "projectile", "heavy-ion"), "inertial-other"),
    (("electrostatic", "polywell", "iec", "orbitron"), "electrostatic"),
    (("hts",), "hts-magnets"),
    (("tritium", "fuel-cycle", "fuel cycle", "isotope separation"), "fuel-cycle"),
    (("gyrotron", "neutral beam", "enabling", "software", "rf plasma"), "enabling-systems"),
)
# laser ICF must win over the generic "inertial" bucket
FUSION_RULES = ((("laser-icf",), "laser-icf"),) + FUSION_RULES

FISSION_MAP = {
    "lwr smr": "lwr-smr", "large lwr": "large-lwr", "msr": "msr", "htgr": "htgr", "sfr": "sfr", "lfr": "lfr", "fhr": "fhr",
    "phwr": "phwr", "microreactor": "microreactor", "heat pipe": "microreactor", "naval/space": "naval-space",
}


def fusion_approach(raw: str) -> tuple[str | None, tuple[str, ...]]:
    text = (raw or "").lower().replace("other:", "")
    if not text or text in {"unspecified", "n/a"}:
        return None, ()
    for needles, key in FUSION_RULES:
        if any(n in text for n in needles):
            return key, ()
    return "other", ()


def fission_approach(raw: str) -> tuple[str | None, tuple[str, ...]]:
    keys = [FISSION_MAP.get(t.strip().lower(), "other") for t in (raw or "").split("|") if t.strip().lower() not in {"", "n/a"}]
    if not keys:
        return None, ()
    ordered = list(dict.fromkeys(keys))
    return ordered[0], tuple(ordered[1:])


def canonical(sector: str, raw: str) -> tuple[str | None, tuple[str, ...]]:
    return fusion_approach(raw) if sector == "fusion" else fission_approach(raw)
