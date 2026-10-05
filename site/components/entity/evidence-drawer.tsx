"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fullDate } from "@/lib/format";
import { asset } from "@/lib/site";
import type { EvidenceItem, EvidenceMap } from "@/lib/types";

const cache = new Map<string, Promise<EvidenceMap>>();

/** Evidence files are lazy: one small JSON per company, fetched the first time any citation is opened. */
export function loadEvidence(companyId: string): Promise<EvidenceMap> {
  let p = cache.get(companyId);
  if (!p) {
    p = fetch(asset(`/data/evidence/${companyId}.json`)).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    cache.set(companyId, p);
  }
  return p;
}

function host(u: string | null): string {
  try {
    return u ? new URL(u).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

function Item({ it }: { it: EvidenceItem }) {
  const shown = it.original_url ?? it.url;
  return (
    <li className="space-y-1.5 border-t pt-3 first:border-t-0 first:pt-0">
      {/^"[\w ]+":/.test(it.quote)
        ? <blockquote className="break-all border-l-2 border-ink-3 pl-3 font-medium text-xs leading-snug" aria-label="Record fragment from the source data">{it.quote}</blockquote>
        : <blockquote className="border-l-2 border-ink-3 pl-3 text-[0.95rem] leading-snug">“{it.quote}”</blockquote>}
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="rounded bg-muted px-1.5 py-0.5 font-medium uppercase tracking-wide">{it.basis}</span>
        <span className={it.review === "verified" ? "rounded bg-[var(--inst-public)]/20 px-1.5 py-0.5 font-medium uppercase tracking-wide" : "rounded bg-fusion/25 px-1.5 py-0.5 font-medium uppercase tracking-wide"}>{it.review === "verified" ? "verified" : "unverified"}</span>
        {shown && (
          <a href={it.original_url ?? it.url ?? "#"} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 underline underline-offset-2">
            {host(shown)} <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        )}
        {it.original_url && it.url && (
          <a href={it.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">archived copy</a>
        )}
        <span>fetched {fullDate(it.fetched_at)}</span>
      </p>
      <p className="break-all font-medium text-[10px] text-ink-3">sha256 {it.snapshot}</p>
    </li>
  );
}

/** A small badge that opens the quotes behind one fact. `keys` are evidence-map keys such as "evt-1#amount". */
export function Cite({ companyId, keys, label = "Sources" }: { companyId: string; keys: string[]; label?: string }) {
  const [items, setItems] = useState<EvidenceItem[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || items) return;
    loadEvidence(companyId).then((m) => setItems(keys.flatMap((k) => m[k] ?? [])));
  }, [open, items, companyId, keys]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:border-foreground hover:text-foreground" aria-label={`${label}: show evidence`}>
          <ShieldCheck className="size-3" aria-hidden="true" /> {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" collisionPadding={12} className="w-[min(92vw,30rem)] space-y-3 bg-card shadow-xl ring-1 ring-border">
        <p className="eyebrow">Evidence</p>
        {items === null ? <p className="text-sm text-muted-foreground">Loading…</p> :
          items.length === 0 ? <p className="text-sm text-muted-foreground">No evidence record found for this fact.</p> :
          <ul className="space-y-3">{items.map((it) => <Item key={it.claim} it={it} />)}</ul>}
      </PopoverContent>
    </Popover>
  );
}
