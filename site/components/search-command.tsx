"use client";

import { Search } from "lucide-react";
import MiniSearch from "minisearch";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { asset } from "@/lib/site";

interface Doc { id: string; kind: "company" | "investor" | "funder"; name: string; aliases: string[]; sector: string | null }

const KIND_LABEL = { company: "Companies", investor: "Investors", funder: "Public funders" } as const;

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<MiniSearch<Doc> | null>(null);
  const loading = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || index || loading.current) return;
    loading.current = true;
    fetch(asset("/data/search.json"))
      .then((r) => (r.ok ? r.json() : []))
      .then((docs: Doc[]) => {
        const ms = new MiniSearch<Doc>({ fields: ["name", "aliases"], storeFields: ["name", "kind", "sector"], searchOptions: { prefix: true, fuzzy: 0.2, boost: { name: 2 } } });
        ms.addAll(docs.map((d) => ({ ...d, aliases: d.aliases.join(" ") as unknown as string[] })));
        setIndex(ms);
      })
      .catch(() => (loading.current = false));
  }, [open, index]);

  const results = index && query.trim() ? index.search(query).slice(0, 24) : [];
  const grouped = (["company", "investor", "funder"] as const).map((k) => ({ k, items: results.filter((r) => r.kind === k) }));

  const go = useCallback((kind: string, id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/${kind}/${id}`);
  }, [router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-1 flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
        aria-label="Search companies, investors and funders"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border px-1 font-medium text-[10px] sm:inline">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Find a company, investor or public funder">
        <CommandInput value={query} onValueChange={setQuery} placeholder="Company, investor or funder…" />
        <CommandList>
          {query.trim() && <CommandEmpty>{index ? "No match." : "Loading…"}</CommandEmpty>}
          {grouped.filter((g) => g.items.length).map((g) => (
            <CommandGroup key={g.k} heading={KIND_LABEL[g.k]}>
              {g.items.map((r) => (
                <CommandItem key={r.id} value={`${r.id} ${r.name}`} onSelect={() => go(r.kind, r.id)}>
                  {r.sector && <span className="sector-dot" data-sector={r.sector} aria-hidden="true" />}
                  {r.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
