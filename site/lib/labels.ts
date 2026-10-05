/** Display labels for canonical taxonomy keys (pipeline/barycenter/taxonomy.py). */
const LABELS: Record<string, string> = {
  tokamak: "Tokamak", "spherical-tokamak": "Spherical tokamak", stellarator: "Stellarator", frc: "FRC", mirror: "Mirror",
  "levitated-dipole": "Levitated dipole", "pulsed-power": "Pulsed power / Z-pinch", "magnetized-target": "Magnetized target",
  "laser-icf": "Laser ICF", "inertial-other": "Other inertial", electrostatic: "Electrostatic", "hts-magnets": "HTS magnets",
  "fuel-cycle": "Fuel cycle", "enabling-systems": "Enabling systems", other: "Other", unspecified: "Unspecified",
  "lwr-smr": "LWR SMR", "large-lwr": "Large LWR", msr: "Molten salt", htgr: "HTGR", sfr: "Sodium fast", lfr: "Lead fast", fhr: "Fluoride-salt high-temp",
  phwr: "PHWR", microreactor: "Microreactor", "naval-space": "Naval / space",
};

export const approachLabel = (k: string | null | undefined): string => (k ? (LABELS[k] ?? k.replace(/[-_]/g, " ")) : "–");
