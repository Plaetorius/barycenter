import type { Metadata } from "next";

import { getCoverage, getSources } from "@/lib/data";
import { fullDate } from "@/lib/format";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Data", description: "Download the Barycenter dataset and browse every source document it cites." };

const FILES = [
  { path: "/data/exports/events.csv", label: "events.csv", note: "one row per funding event" },
  { path: "/data/exports/participations.csv", label: "participations.csv", note: "who took part in each event, disclosed amounts only" },
  { path: "/data/exports/evidence.csv", label: "evidence.csv", note: "every fact with its source URL, hash and quote" },
  { path: "/data/exports/README.txt", label: "README.txt", note: "licence and disclaimer" },
  { path: "/data/checksums.sha256", label: "checksums.sha256", note: "SHA-256 of every file in this release" },
];

export default function Page() {
  const cov = getCoverage();
  const sources = getSources().sort((a, b) => b.cited_by - a.cited_by);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="eyebrow">Data</p>
      <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">Download and verify</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-2">{cov ? `Release ${cov.release}${cov.draft ? " (draft)" : ""}, generated ${fullDate(cov.generated_at)}. ` : ""}Compilation licensed CC BY 4.0: credit Barycenter (Mertia Labs) and the cited sources. Government data keeps its own public-domain terms. Not exhaustive; see the methodology.</p>
      <ul className="mt-6 divide-y border-y">
        {FILES.map((f) => (
          <li key={f.path} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 text-sm">
            <a className="font-medium underline underline-offset-2" href={asset(f.path)} download>{f.label}</a>
            <span className="text-muted-foreground">{f.note}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 font-semibold text-2xl">Source documents <span className="text-sm font-sans text-muted-foreground">{sources.length}</span></h2>
      <p className="mt-1 text-sm text-ink-2">Every document cited, with the time we fetched it and its SHA-256 hash. Where the publisher forbids automated access, the Wayback copy is listed.</p>
      <ul className="mt-3 divide-y border-y text-sm">
        {sources.map((s) => (
          <li key={s.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 py-2">
            <a className="min-w-0 truncate underline underline-offset-2" href={s.original_url ?? s.url} target="_blank" rel="noreferrer noopener">{s.host}</a>
            <span className="eyebrow">{fullDate(s.fetched_at)} · {s.cited_by}×</span>
            <span className="col-span-2 break-all font-medium text-[10px] text-ink-3">{s.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
