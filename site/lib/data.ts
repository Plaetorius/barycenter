import "server-only";

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import type { CompanyRow, Coverage, Edge, Entity, EvidenceMap, InvestorRow, SourceRow } from "./types";

const DIR = path.join(process.cwd(), "public", "data");

function read<T>(rel: string, fallback: T): T {
  const file = path.join(DIR, rel);
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as T) : fallback;
}

export const getCompanies = () => read<CompanyRow[]>("index/companies.json", []);
export const getInvestors = () => read<InvestorRow[]>("index/investors.json", []);
export const getFunders = () => read<InvestorRow[]>("index/funders.json", []);
export const getEdges = () => read<Edge[]>("graph/edges.json", []);
export const getSources = () => read<SourceRow[]>("sources.json", []);
export const getEntity = (id: string) => read<Entity | null>(`entities/${id}.json`, null);
export const getEvidence = (id: string) => read<EvidenceMap>(`evidence/${id}.json`, {});
export const getCoverage = () =>
  read<Coverage | null>("coverage.json", null);

export function getAllEntityIds(): { kind: "company" | "investor" | "funder"; id: string }[] {
  return [
    ...getCompanies().map((c) => ({ kind: "company" as const, id: c.id })),
    ...getInvestors().map((c) => ({ kind: "investor" as const, id: c.id })),
    ...getFunders().map((c) => ({ kind: "funder" as const, id: c.id })),
  ];
}

export const getOverview = () =>
  read<import("./types").Overview>("overview.json", { by_year: [], by_approach: [], top_rounds: [] });
