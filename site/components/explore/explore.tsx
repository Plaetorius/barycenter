"use client";

import dynamic from "next/dynamic";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usd } from "@/lib/format";
import { asset } from "@/lib/site";
import type { CompanyRow, Edge, Entity, InvestorRow, Lens, SectorFilter } from "@/lib/types";

import { EntityView } from "../entity/entity-view";

import { companyColumns, DataTable, investorColumns } from "./tables";

const WorldMap = dynamic(() => import("./world-map").then((m) => m.WorldMap), { ssr: false, loading: () => <Skeleton /> });
const Network = dynamic(() => import("./network").then((m) => m.Network), { ssr: false, loading: () => <Skeleton /> });
const Skeleton = () => <div className="h-[50vh] animate-pulse bg-muted/50" aria-busy="true" />;

const LENSES = ["companies", "investors", "funders"] as const;
const SECTORS = ["all", "fusion", "fission"] as const;
const VIEWS = ["table", "map", "network"] as const;

interface Props { companies: CompanyRow[]; investors: InvestorRow[]; funders: InvestorRow[]; edges: Edge[] }

export function Explore({ companies, investors, funders, edges }: Props) {
  const [lens, setLens] = useQueryState("lens", parseAsStringLiteral(LENSES).withDefault("companies"));
  const [sector, setSector] = useQueryState("sector", parseAsStringLiteral(SECTORS).withDefault("all"));
  const [view, setView] = useQueryState("view", parseAsStringLiteral(VIEWS).withDefault("table"));
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [openId, setOpenId] = useQueryState("open", parseAsString);
  const [entity, setEntity] = useState<Entity | null>(null);

  const match = (s: string) => !q || s.toLowerCase().includes(q.toLowerCase());
  const secOk = (s: SectorFilter | string) => sector === "all" || s === sector;
  const cRows = useMemo(() => companies.filter((c) => secOk(c.sector) && match(c.name)), [companies, sector, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const iRows = useMemo(() => investors.filter((i) => (sector === "all" || i.sectors.includes(sector as "fusion")) && match(i.name)), [investors, sector, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const fRows = useMemo(() => funders.filter((i) => (sector === "all" || i.sectors.includes(sector as "fusion")) && match(i.name)), [funders, sector, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const kindOf = (id: string) => (companies.some((c) => c.id === id) ? "company" : funders.some((f) => f.id === id) ? "funder" : "investor");
  const open = async (id: string) => {
    setOpenId(id);
    setEntity(null);
    const r = await fetch(asset(`/data/entities/${id}.json`));
    if (r.ok) setEntity(await r.json());
  };
  const close = () => { setOpenId(null); setEntity(null); };

  const sum = cRows.reduce((s, c) => s + c.totals.total, 0);
  const split = ["equity", "public", "debt"].map((k) => [k, cRows.reduce((s, c) => s + c.totals[k as "equity"], 0)] as const);
  const lensCount = lens === "companies" ? cRows.length : lens === "investors" ? iRows.length : fRows.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <section className="paper-grain -mx-4 mb-6 border-b px-4 pb-6">
        <p className="eyebrow">Who funds nuclear energy</p>
        <h1 className="mt-1 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          <span className="numeral">{usd(sum)}</span> disclosed across {cRows.length} companies
        </h1>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm tabular text-ink-2">
          {[["equity", "Equity and listings", "var(--inst-equity)"], ["public", "Public grants", "var(--inst-public)"], ["debt", "Debt", "var(--inst-debt)"]].map(([k, label, color]) => (
            <span key={k} className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: color }} aria-hidden="true" />{label} <strong className="font-medium text-foreground">{usd(split.find(([x]) => x === k)?.[1] ?? 0)}</strong></span>
          ))}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
          Every fusion and fission company with evidenced funding, the investors and governments behind it, how much and when.
          Disclosed amounts only; every figure opens its source.
        </p>
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ToggleGroup type="single" value={lens} onValueChange={(v) => v && setLens(v as Lens)} variant="outline" aria-label="Lens">
          <ToggleGroupItem value="companies">Companies</ToggleGroupItem>
          <ToggleGroupItem value="investors">Investors</ToggleGroupItem>
          <ToggleGroupItem value="funders">Funders</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={sector} onValueChange={(v) => v && setSector(v as SectorFilter)} variant="outline" aria-label="Sector">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="fusion"><span className="sector-dot mr-1.5" data-sector="fusion" aria-hidden="true" />Fusion</ToggleGroupItem>
          <ToggleGroupItem value="fission"><span className="sector-dot mr-1.5" data-sector="fission" aria-hidden="true" />Fission</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as (typeof VIEWS)[number])} variant="outline" aria-label="View">
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
          <ToggleGroupItem value="map">Map</ToggleGroupItem>
          <ToggleGroupItem value="network">Network</ToggleGroupItem>
        </ToggleGroup>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="sr-only">Filter by name</span>
          <input value={q} onChange={(e) => setQ(e.target.value || null)} placeholder="Filter by name…" className="h-8 w-44 rounded-md border bg-card px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
      </div>
      <p className="mb-2 text-xs text-muted-foreground" aria-live="polite">{lensCount} {lens}</p>

      <div className="overflow-hidden rounded-lg border bg-card">
        {view === "table" && lens === "companies" && <DataTable rows={cRows} columns={companyColumns} onOpen={open} activeId={openId} initialSort={[{ id: "total", desc: true }]} />}
        {view === "table" && lens === "investors" && <DataTable rows={iRows} columns={investorColumns} onOpen={open} activeId={openId} initialSort={[{ id: "companies", desc: true }]} />}
        {view === "table" && lens === "funders" && <DataTable rows={fRows} columns={investorColumns} onOpen={open} activeId={openId} initialSort={[{ id: "companies", desc: true }]} />}
        {view === "map" && <WorldMap rows={cRows} onOpen={open} />}
        {view === "network" && <Network companies={cRows} investors={[...iRows, ...fRows]} edges={edges} onOpen={(id) => open(id)} />}
      </div>

      <Sheet open={!!openId} onOpenChange={(o) => !o && close()}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetTitle className="sr-only">Details</SheetTitle>
          <SheetDescription className="sr-only">Funding details with sources</SheetDescription>
          <div className="px-5 pb-8 pt-10">
            {entity ? (
              <>
                <EntityView entity={entity} compact />
                <a className="mt-6 inline-block text-sm underline underline-offset-2" href={asset(`/${kindOf(openId ?? "")}/${openId}`)}>Open full page</a>
              </>
            ) : <Skeleton />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
