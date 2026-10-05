/** Shapes of the release JSON written by pipeline/barycenter/publish.py. Keep in sync with models.py. */
export type Sector = "fusion" | "fission";
export type SectorFilter = Sector | "all";
export type Lens = "companies" | "investors" | "funders";

export interface Totals {
  equity: number;
  public: number;
  debt: number;
  total: number;
  obligated: number;
  disbursed: number;
  ceiling: number;
  approx: boolean;
  undisclosed: number;
}

export interface CompanyRow {
  id: string;
  name: string;
  sector: Sector;
  approach: string | null;
  fuel: string | null;
  role: string;
  status: string;
  country: string | null;
  city: string | null;
  website: string | null;
  logo: string | null;
  totals: Totals;
  events: number;
  investors: number;
  first_event_on: string | null;
  last_event_on: string | null;
}

export interface InvestorRow {
  id: string;
  name: string;
  type: string;
  country: string | null;
  website: string | null;
  companies: number;
  events: number;
  disclosed_usd: number;
  sectors: Sector[];
  approaches: string[];
  first_event_on: string | null;
  last_event_on: string | null;
}

export interface Edge {
  investor: string;
  company: string;
  events: number;
  instruments: string[];
  years: number[];
  disclosed_usd: number;
  lead: boolean;
  sector: Sector;
}

export interface Money {
  amount: number;
  currency: string;
  qualifier: "exact" | "approx" | "over" | "up_to" | "range";
  usd: number | null;
  fx_date: string | null;
}

export interface Participant {
  org_id: string;
  name: string;
  role: string;
  amount: Money | null;
}

export interface EventJson {
  id: string;
  company_id: string;
  company?: string;
  instrument: string;
  round_label: string | null;
  announced_on: string;
  closed_on: string | null;
  amount: Money | null;
  amount_kind: string;
  supersedes: string | null;
  obligated_usd: number | null;
  disbursed_usd: number | null;
  use_of_proceeds: string | null;
  participants: Participant[];
}

export interface AgreementJson {
  id: string;
  type: string;
  binding: string;
  announced_on: string;
  counterparty: string;
  capacity_mw: number | null;
}

export interface OrgJson {
  id: string;
  name: string;
  kind: string;
  country: string | null;
  hq_city: string | null;
  website: string | null;
  logo?: string | null;
}

export type Entity =
  | { kind: "company"; org: OrgJson; company: { sector: Sector; approach: string | null; fuel: string | null; value_chain_role: string; status: string; founded: number | null }; totals: Totals; notes: string | null; events: EventJson[]; agreements: AgreementJson[] }
  | { kind: "investor" | "public_funder"; org: OrgJson; summary: InvestorRow; portfolio: EventJson[] };

export interface EvidenceItem {
  claim: string;
  snapshot: string;
  url: string | null;
  original_url: string | null;
  fetched_at: string | null;
  quote: string;
  basis: "disclosed" | "reported";
  method: string;
  review: "pending" | "verified" | "rejected";
}
export type EvidenceMap = Record<string, EvidenceItem[]>;

export interface Coverage {
  release: string;
  draft: boolean;
  generated_at: string;
  disclaimer: string;
  counts: Record<string, number>;
  equity_usd_by_sector: Record<string, number>;
  benchmarks: { id: string; label: string; usd: number; scope: string; url: string; ours_usd: number; ratio: number }[];
  skipped_ledgers: string[];
  findings: { gate: string; severity: string; message: string }[];
}

export interface SourceRow { id: string; url: string; original_url: string | null; host: string; fetched_at: string; source_id: string; cited_by: number }

export interface Overview {
  by_year: ({ year: number } & Record<string, number>)[];
  by_approach: { sector: Sector; approach: string; usd: number; companies: number }[];
  top_rounds: { id: string; company_id: string; company: string; sector: Sector; instrument: string; round_label: string | null; announced_on: string; usd: number }[];
}
