import Link from "next/link";

import { approachLabel } from "@/lib/labels";
import { countryName, instrumentLabel, money, shortDate, titleCase, usd } from "@/lib/format";
import type { AgreementJson, Entity, EventJson, Totals } from "@/lib/types";

import { Logo } from "@/components/logo";
import { Cite } from "./evidence-drawer";

const BARS = [
  { key: "equity", label: "Equity", cls: "bg-[var(--inst-equity)]" },
  { key: "public", label: "Public grants", cls: "bg-[var(--inst-public)]" },
  { key: "debt", label: "Debt", cls: "bg-[var(--inst-debt)]" },
] as const;

function TotalsBar({ t }: { t: Totals }) {
  if (!t.total) return <p className="text-sm text-muted-foreground">No disclosed amounts.</p>;
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`Equity ${usd(t.equity)}, public ${usd(t.public)}, debt ${usd(t.debt)}`}>
        {BARS.map((b) => t[b.key] > 0 && <div key={b.key} className={b.cls} style={{ width: `${(t[b.key] / t.total) * 100}%` }} />)}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {BARS.map((b) => t[b.key] > 0 && (
          <li key={b.key} className="flex items-center gap-1.5"><span className={`size-2 rounded-sm ${b.cls}`} aria-hidden="true" />{b.label} <span className="tabular text-foreground">{usd(t[b.key])}</span></li>
        ))}
      </ul>
    </div>
  );
}

function EventRow({ e, companyId, showCompany }: { e: EventJson; companyId: string; showCompany?: boolean }) {
  const isPublic = ["grant", "cost_share", "voucher"].includes(e.instrument);
  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 border-t py-4 first:border-t-0">
      <time className="eyebrow pt-1" dateTime={e.announced_on}>{shortDate(e.announced_on)}</time>
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="numeral text-2xl leading-none">{e.amount ? money(e.amount) : "Undisclosed"}</span>
          {e.amount && e.amount.currency !== "USD" && e.amount.usd && <span className="text-xs text-muted-foreground tabular">≈ {usd(e.amount.usd)} at {e.amount.fx_date}</span>}
          <span className="text-sm text-ink-2">
            {showCompany && e.company ? <Link className="underline underline-offset-2" href={`/company/${e.company_id}`}>{e.company}</Link> : null}
            {showCompany && e.company ? " · " : ""}{[instrumentLabel(e.instrument), e.round_label].filter(Boolean).join(" · ")}
          </span>
          {e.amount_kind !== "new_money" && <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase">{e.amount_kind === "ceiling" ? "Maximum / commitment" : titleCase(e.amount_kind)} · not counted</span>}
          <Cite companyId={companyId} keys={[`${e.id}#amount`, `${e.id}#announced_on`, `${e.id}#round_label`]} />
        </div>
        {isPublic && (e.obligated_usd || e.disbursed_usd) ? (
          <p className="text-xs text-muted-foreground tabular">Obligated {usd(e.obligated_usd)} · Paid out {usd(e.disbursed_usd)}</p>
        ) : null}
        {e.use_of_proceeds && <p className="text-sm text-ink-2">{e.use_of_proceeds}</p>}
        {e.participants.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {e.participants.map((p) => (
              <li key={p.org_id} className="inline-flex items-center gap-1.5 rounded-full border bg-card py-0.5 pl-2.5 pr-1 text-xs">
                <Link href={`/${["grantor"].includes(p.role) ? "funder" : "investor"}/${p.org_id}`} className="hover:underline">{p.name}</Link>
                {p.role === "lead" && <span className="rounded-full bg-foreground px-1.5 text-[10px] text-background">lead</span>}
                {p.amount && <span className="tabular text-muted-foreground">{money(p.amount)}</span>}
                <Cite companyId={companyId} keys={[`${e.id}:${p.org_id}#participant`]} label="" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function Agreements({ rows, companyId }: { rows: AgreementJson[]; companyId: string }) {
  if (!rows.length) return null;
  return (
    <section aria-labelledby="agreements" className="mt-10">
      <h2 id="agreements" className="font-serif text-2xl">Agreements <span className="text-sm font-sans text-muted-foreground">signals, never counted as funding</span></h2>
      <ul className="mt-3 divide-y border-y">
        {rows.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
            <time className="eyebrow w-20" dateTime={a.announced_on}>{shortDate(a.announced_on)}</time>
            <span className="font-medium">{a.counterparty}</span>
            <span className="text-ink-2">{titleCase(a.type)}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase">{a.binding}</span>
            {a.capacity_mw && <span className="tabular text-muted-foreground">{a.capacity_mw} MW</span>}
            <Cite companyId={companyId} keys={[`${a.id}#agreement`]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EntityView({ entity, compact = false }: { entity: Entity; compact?: boolean }) {
  const o = entity.org;
  if (entity.kind === "company") {
    const c = entity.company;
    return (
      <article className={compact ? "space-y-6" : "mx-auto w-full max-w-4xl px-4 py-10"}>
        <header>
          <p className="eyebrow flex items-center gap-2"><span className="sector-dot" data-sector={c.sector} aria-hidden="true" />{c.sector} · {titleCase(c.value_chain_role)}</p>
          <h1 className="mt-2 flex items-center gap-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl"><Logo name={o.name} logo={o.logo} sector={c.sector} size={48} />{o.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {[c.approach && approachLabel(c.approach), c.fuel && c.fuel !== "unknown" ? c.fuel : null, o.hq_city, countryName(o.country) !== "–" ? countryName(o.country) : null, c.founded ? `founded ${c.founded}` : null, c.status !== "active" ? c.status : null].filter(Boolean).join(" · ")}
            {o.website && <> · <a className="underline underline-offset-2" href={o.website.startsWith("http") ? o.website : `https://${o.website}`} target="_blank" rel="noreferrer noopener">website</a></>}
          </p>
        </header>
        <section aria-label="Disclosed funding" className="mt-6">
          <p className="eyebrow">Disclosed funding</p>
          <p className="numeral text-6xl leading-none">{usd(entity.totals.total, { approx: entity.totals.approx })}</p>
          <div className="mt-3 max-w-xl"><TotalsBar t={entity.totals} /></div>
          {entity.totals.ceiling > 0 && <p className="mt-2 text-xs text-muted-foreground">Not counted: up to <span className="tabular text-foreground">{usd(entity.totals.ceiling)}</span> in commitments, credit facilities and programme maximums (milestone-tranched rounds, at-the-market programmes, undrawn loans). Shown in the timeline.</p>}
          {entity.totals.undisclosed > 0 && <p className="mt-2 text-xs text-muted-foreground">{entity.totals.undisclosed} event(s) with an undisclosed amount are not in the total. Actual funding may be higher.</p>}
        </section>
        {entity.notes && <details className="mt-6 rounded-md border border-dashed p-3 text-xs leading-relaxed text-muted-foreground"><summary className="cursor-pointer text-foreground">Reviewer notes: gaps, conflicts and caveats</summary><p className="mt-2">{entity.notes}</p></details>}
        <section aria-labelledby="timeline" className="mt-10">
          <h2 id="timeline" className="font-serif text-2xl">Funding timeline</h2>
          {entity.events.length ? <ul className="mt-2">{[...entity.events].reverse().map((e) => <EventRow key={e.id} e={e} companyId={o.id} />)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No evidenced events yet.</p>}
        </section>
        <Agreements rows={entity.agreements} companyId={o.id} />
      </article>
    );
  }
  const s = entity.summary;
  const companyIds = [...new Set(entity.portfolio.map((e) => e.company_id))];
  return (
    <article className={compact ? "space-y-6" : "mx-auto w-full max-w-4xl px-4 py-10"}>
      <header>
        <p className="eyebrow">{entity.kind === "investor" ? titleCase(s.type) : "Public funder"}{o.country ? ` · ${countryName(o.country)}` : ""}</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{o.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {s.companies} {s.companies === 1 ? "company" : "companies"} · {s.events} publicly announced {s.events === 1 ? "participation" : "participations"}
          {s.sectors.length ? ` · ${s.sectors.join(" + ")}` : ""}
          {o.website && <> · <a className="underline underline-offset-2" href={o.website.startsWith("http") ? o.website : `https://${o.website}`} target="_blank" rel="noreferrer noopener">website</a></>}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Portfolio limited to publicly announced investments. Amounts shown only when the source states them{s.disclosed_usd ? ` (${usd(s.disclosed_usd)} stated across the portfolio)` : ""}.</p>
      </header>
      <section aria-labelledby="portfolio" className="mt-8">
        <h2 id="portfolio" className="font-serif text-2xl">Portfolio</h2>
        <ul className="mt-2">
          {[...entity.portfolio].reverse().map((e) => <EventRow key={`${e.id}`} e={e} companyId={e.company_id} showCompany />)}
        </ul>
      </section>
      {companyIds.length > 0 && <p className="mt-6 text-xs text-muted-foreground">{companyIds.length} companies in this view.</p>}
    </article>
  );
}
