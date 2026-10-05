"""Canonical schema for Barycenter. Single source of truth: the site types are generated from these models.

Layers: Snapshot (what we fetched) -> Claim (what a source says) -> Fact (what we publish) -> entities.
"""
from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

Sector = Literal["fusion", "fission"]
Confidence = Literal["disclosed", "reported", "estimated"]
ClaimStatus = Literal["pending", "accepted", "rejected", "superseded"]
OrgKind = Literal["company", "investor", "public_funder", "person", "counterparty"]
Instrument = Literal["equity", "grant", "cost_share", "voucher", "debt", "ipo", "spac", "follow_on", "other"]
ParticipationRole = Literal["lead", "participant", "grantor", "lender"]
AgreementType = Literal["offtake", "ppa", "fuel_supply", "site", "gov_contract", "partnership"]
Binding = Literal["loi", "mou", "definitive"]
AmountQualifier = Literal["exact", "approx", "over", "up_to", "range"]
AmountKind = Literal["new_money", "cumulative", "valuation_only", "duplicate", "ceiling"]  # ceiling: programme maximum (ATM, shelf, facility limit), not money received  # duplicate: same money as another event (e.g. Form D vs release); evidence only, never counted

SLUG = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Money(Frozen):
    amount: float = Field(gt=0)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    qualifier: AmountQualifier = "exact"
    amount_max: float | None = None  # for ranges
    usd: float | None = Field(default=None, gt=0)
    fx_date: date | None = None
    fx_snapshot_id: str | None = None


class Snapshot(Frozen):
    id: str = Field(pattern=r"^[0-9a-f]{64}$")  # sha256 of body
    url: str
    final_url: str | None = None
    fetched_at: datetime
    http_status: int | None = None
    content_type: str | None = None
    bytes: int | None = None
    fetcher: str
    robots_ok: bool | None = None
    source_id: str
    wayback_url: str | None = None
    text_sha256: str | None = None


class Claim(Frozen):
    id: str  # ULID
    subject: str  # entity or event id
    predicate: str
    value: str | float | dict | list
    snapshot_id: str
    locator: str  # JSON pointer | xpath | char offsets | page+bbox
    quote: str | None = Field(default=None, max_length=400)
    method: str  # parser:<name>@<ver> | llm:<model>|prompt:<sha> | manual:<reviewer>
    confidence: Confidence
    status: ClaimStatus = "pending"
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
    review_note: str | None = None

    @model_validator(mode="after")
    def prose_needs_quote(self) -> "Claim":
        if self.method.startswith("llm:") and not self.quote:
            raise ValueError("LLM-extracted claims require a verbatim quote")
        return self


class Fact(Frozen):
    subject: str
    predicate: str
    value: str | float | dict | list
    chosen_claim_id: str
    supporting_claim_ids: tuple[str, ...] = ()
    conflicting_claim_ids: tuple[str, ...] = ()
    rule: str


class ExternalIds(Frozen):
    cik: str | None = None
    lei: str | None = None
    uei: str | None = None
    pic: str | None = None
    siren: str | None = None
    companies_house: str | None = None
    wikidata: str | None = None
    ror: str | None = None


class Organization(Frozen):
    id: str = Field(pattern=SLUG)
    kind: OrgKind
    name: str
    aliases: tuple[str, ...] = ()
    legal_names: tuple[str, ...] = ()  # registry spellings (e.g. USAspending "US SFR OWNER LLC")
    country: str | None = Field(default=None, pattern=r"^[A-Z]{2}$")
    hq_city: str | None = None
    lat: float | None = Field(default=None, ge=-90, le=90)
    lon: float | None = Field(default=None, ge=-180, le=180)
    website: str | None = None
    logo: str | None = None  # path under site/public/logos/ (sourced in seeds/profiles.yaml)
    parent_id: str | None = None
    external_ids: ExternalIds = ExternalIds()


class Company(Frozen):
    org_id: str
    sector: Sector
    approach: str | None = None  # canonical key from taxonomy.py (fusion approach OR fission reactor type)
    approach_tags: tuple[str, ...] = ()  # secondary canonical keys for multi-technology companies
    fuel: str | None = None
    value_chain_role: str
    stage: str | None = None
    licensing_status: str | None = None
    founded: int | None = Field(default=None, ge=1900, le=2100)
    status: Literal["active", "acquired", "public", "defunct"] = "active"


class Investor(Frozen):
    org_id: str
    type: Literal[
        "vc", "cvc", "corporate", "family_office", "sovereign_fund", "angel",
        "accelerator", "bank", "dfi", "pension", "government", "asset_manager", "unknown",
    ]


class PublicFunder(Frozen):
    org_id: str
    level: Literal["national", "supranational", "regional", "state"]


class Program(Frozen):
    id: str = Field(pattern=SLUG)
    funder_id: str
    name: str
    instrument: Instrument
    url: str | None = None


class FundingEvent(Frozen):
    id: str = Field(pattern=SLUG)
    company_id: str
    instrument: Instrument
    round_label: str | None = None
    round_group: str | None = None
    announced_on: date
    closed_on: date | None = None
    amount: Money | None = None  # None = undisclosed
    amount_kind: AmountKind = "new_money"
    supersedes: str | None = None  # event id replaced by an in-place edit of a release
    committed_usd: float | None = None
    obligated_usd: float | None = None
    disbursed_usd: float | None = None
    valuation_post_usd: float | None = None
    use_of_proceeds: str | None = None
    program_id: str | None = None
    unannounced: bool = False  # created from a Form D with no announcement


class Participation(Frozen):
    event_id: str
    org_id: str
    role: ParticipationRole = "participant"
    amount: Money | None = None  # only when disclosed


class Agreement(Frozen):
    id: str = Field(pattern=SLUG)
    company_id: str
    counterparty_id: str
    type: AgreementType
    binding: Binding
    announced_on: date
    capacity_mw: float | None = Field(default=None, gt=0)
    value: Money | None = None
    term_years: float | None = Field(default=None, gt=0)
