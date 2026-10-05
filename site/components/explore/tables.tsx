"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { approachLabel } from "@/lib/labels";
import { countryName, shortDate, titleCase, usd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompanyRow, InvestorRow } from "@/lib/types";

/** Columns marked `narrow: false` disappear below the sm breakpoint so the amount stays visible on phones. */
function hide(meta: unknown): string {
  return (meta as { narrow?: boolean } | undefined)?.narrow === false ? "hidden sm:table-cell" : "";
}

function Sector({ s }: { s: string }) {
  return <span className="inline-flex items-center gap-1.5 capitalize"><span className="sector-dot" data-sector={s} aria-hidden="true" />{s}</span>;
}

export const companyColumns: ColumnDef<CompanyRow>[] = [
  { accessorKey: "name", header: "Company", cell: (c) => <span className="inline-flex items-center gap-2.5 font-medium"><Logo name={c.row.original.name} logo={c.row.original.logo} sector={c.row.original.sector} size={24} />{c.getValue<string>()}</span> },
  { accessorKey: "sector", header: "Sector", meta: { narrow: false }, cell: (c) => <Sector s={c.getValue<string>()} /> },
  { accessorKey: "approach", header: "Approach", meta: { narrow: false }, cell: (c) => <span className="text-ink-2">{approachLabel(c.getValue<string | null>())}</span> },
  { accessorKey: "country", header: "HQ", meta: { narrow: false }, cell: (c) => <span className="text-ink-2">{countryName(c.getValue<string | null>())}</span> },
  { id: "total", header: "Disclosed", accessorFn: (r) => r.totals.total, cell: (c) => <span className="numeral text-lg">{usd(c.getValue<number>(), { approx: c.row.original.totals.approx })}</span>, meta: { align: "right" } },
  { accessorKey: "investors", header: "Investors", meta: { align: "right", narrow: false }, cell: (c) => <span className="tabular">{c.getValue<number>() || "–"}</span> },
  { accessorKey: "last_event_on", header: "Last event", meta: { narrow: false }, cell: (c) => <span className="tabular text-ink-2">{shortDate(c.getValue<string | null>())}</span> },
];

export const investorColumns: ColumnDef<InvestorRow>[] = [
  { accessorKey: "name", header: "Name", cell: (c) => <span className="font-medium">{c.getValue<string>()}</span> },
  { accessorKey: "type", header: "Type", meta: { narrow: false }, cell: (c) => <span className="text-ink-2">{titleCase(c.getValue<string>())}</span> },
  { accessorKey: "country", header: "HQ", cell: (c) => <span className="text-ink-2">{countryName(c.getValue<string | null>())}</span> },
  { accessorKey: "companies", header: "Companies", meta: { align: "right" }, cell: (c) => <span className="numeral text-lg">{c.getValue<number>()}</span> },
  { accessorKey: "events", header: "Deals", meta: { align: "right", narrow: false }, cell: (c) => <span className="tabular">{c.getValue<number>()}</span> },
  { id: "sectors", header: "Sectors", meta: { narrow: false }, accessorFn: (r) => r.sectors.join(" "), cell: (c) => <span className="flex gap-2">{c.row.original.sectors.map((s) => <Sector key={s} s={s} />)}</span> },
  { accessorKey: "last_event_on", header: "Last deal", meta: { narrow: false }, cell: (c) => <span className="tabular text-ink-2">{shortDate(c.getValue<string | null>())}</span> },
];

interface Props<T extends { id: string }> {
  rows: T[];
  columns: ColumnDef<T>[];
  onOpen: (id: string) => void;
  activeId: string | null;
  initialSort: SortingState;
}

export function DataTable<T extends { id: string }>({ rows, columns, onOpen, activeId, initialSort }: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const table = useReactTable({ data: rows, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map((h) => {
                const dir = h.column.getIsSorted();
                const right = (h.column.columnDef.meta as { align?: string } | undefined)?.align === "right";
                return (
                  <th key={h.id} scope="col" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"} className={cn("eyebrow whitespace-nowrap px-3 py-2 text-left font-normal", right && "text-right", hide(h.column.columnDef.meta))}>
                    <button type="button" onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-foreground">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {dir === "asc" ? <ArrowUp className="size-3" aria-hidden="true" /> : dir === "desc" ? <ArrowDown className="size-3" aria-hidden="true" /> : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className={cn("row-hover cursor-pointer border-b", activeId === r.original.id && "bg-muted")} onClick={() => onOpen(r.original.id)}
              tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(r.original.id))}>
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className={cn("px-3 py-2.5", (c.column.columnDef.meta as { align?: string } | undefined)?.align === "right" && "text-right", hide(c.column.columnDef.meta))}>
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nothing matches these filters.</p>}
    </div>
  );
}
