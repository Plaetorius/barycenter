import type { Metadata } from "next";
import { Link } from "@/components/link";

import { getCompanies, getOverview } from "@/lib/data";
import { approachLabel } from "@/lib/labels";
import { instrumentLabel, shortDate, titleCase, usd } from "@/lib/format";

export const metadata: Metadata = { title: "Overview", description: "Capital by year, sector and instrument; the largest rounds." };

const SERIES = [
  { key: "fusion:equity", label: "Fusion equity", color: "var(--fusion)", opacity: 1 },
  { key: "fusion:public", label: "Fusion public", color: "var(--fusion)", opacity: 0.55 },
  { key: "fusion:debt", label: "Fusion debt", color: "var(--fusion)", opacity: 0.3 },
  { key: "fission:equity", label: "Fission equity", color: "var(--fission)", opacity: 1 },
  { key: "fission:public", label: "Fission public", color: "var(--fission)", opacity: 0.55 },
  { key: "fission:debt", label: "Fission debt", color: "var(--fission)", opacity: 0.3 },
] as const;

export default function Page() {
  const o = getOverview();
  const companies = getCompanies();
  const totals = o.by_year.map((y) => SERIES.reduce((s, k) => s + ((y[k.key] as number) ?? 0), 0));
  const max = Math.max(1, ...totals);
  const sector = (s: string) => companies.filter((c) => c.sector === s).reduce((a, c) => a + c.totals.total, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <p className="eyebrow">Overview</p>
      <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">Where the capital went</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-2">Disclosed amounts only, by announcement year, converted to USD at the announcement-date rate. Agreements are never counted. See the methodology for what is missing.</p>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div><dt className="eyebrow">Fusion</dt><dd className="numeral text-5xl" style={{ color: "var(--fusion)" }}>{usd(sector("fusion"))}</dd></div>
        <div><dt className="eyebrow">Fission</dt><dd className="numeral text-5xl" style={{ color: "var(--fission)" }}>{usd(sector("fission"))}</dd></div>
        <div><dt className="eyebrow">Companies</dt><dd className="numeral text-5xl">{companies.length}</dd></div>
      </dl>

      <section aria-labelledby="by-year" className="mt-12">
        <h2 id="by-year" className="font-semibold text-2xl">By year</h2>
        <figure className="mt-4">
          <svg viewBox={`0 0 ${Math.max(o.by_year.length, 1) * 64 + 40} 260`} className="h-auto w-full" role="img" aria-label="Stacked bars of disclosed capital by year">
            {o.by_year.map((y, i) => {
              let acc = 0;
              return (
                <g key={y.year} transform={`translate(${i * 64 + 30},0)`}>
                  {SERIES.map((k) => {
                    const v = (y[k.key] as number) ?? 0;
                    const h = (v / max) * 200;
                    acc += h;
                    return v > 0 ? <rect key={k.key} x={0} y={220 - acc} width={44} height={h} fill={k.color} fillOpacity={k.opacity}><title>{`${y.year} ${k.label}: ${usd(v)}`}</title></rect> : null;
                  })}
                  <text x={22} y={238} textAnchor="middle" className="fill-[var(--ink-2)] font-medium text-[10px]">{y.year}</text>
                  <text x={22} y={214 - acc} textAnchor="middle" className="fill-[var(--foreground)] font-medium text-[10px]">{usd(totals[i])}</text>
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {SERIES.map((k) => <span key={k.key} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: k.color, opacity: k.opacity }} aria-hidden="true" />{k.label}</span>)}
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="approach" className="mt-12">
        <h2 id="approach" className="font-semibold text-2xl">By approach</h2>
        <ul className="mt-3 divide-y border-y">
          {o.by_approach.map((r) => (
            <li key={`${r.sector}-${r.approach}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 py-2 text-sm">
              <div>
                <span className="inline-flex items-center gap-2"><span className="sector-dot" data-sector={r.sector} aria-hidden="true" />{approachLabel(r.approach)}</span>
                <span className="ml-2 text-xs text-muted-foreground">{r.companies} {r.companies === 1 ? "company" : "companies"}</span>
                <div className="mt-1 h-1.5 rounded-full" style={{ width: `${Math.max(2, (r.usd / (o.by_approach[0]?.usd || 1)) * 100)}%`, background: r.sector === "fusion" ? "var(--fusion)" : "var(--fission)" }} />
              </div>
              <span className="numeral text-xl">{usd(r.usd)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="top" className="mt-12">
        <h2 id="top" className="font-semibold text-2xl">Largest rounds</h2>
        <ol className="mt-3 divide-y border-y">
          {o.top_rounds.map((r, i) => (
            <li key={r.id} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 py-2.5 text-sm">
              <span className="eyebrow">{i + 1}</span>
              <span><Link className="font-medium underline-offset-2 hover:underline" href={`/company/${r.company_id}`}>{r.company}</Link> <span className="text-muted-foreground">{[instrumentLabel(r.instrument), r.round_label, shortDate(r.announced_on)].filter(Boolean).join(" · ")}</span></span>
              <span className="numeral text-xl">{usd(r.usd)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
