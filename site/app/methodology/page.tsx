import type { Metadata } from "next";

import { getCoverage } from "@/lib/data";
import { usd } from "@/lib/format";

export const metadata: Metadata = { title: "Methodology", description: "How Barycenter's data is collected, verified and what it does not cover." };

const H2 = "mt-10 font-serif text-2xl";

export default function Page() {
  const cov = getCoverage();
  return (
    <div className="prose-barycenter mx-auto w-full max-w-3xl px-4 py-10 text-[0.95rem] leading-relaxed [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5">
      <p className="eyebrow">Methodology</p>
      <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">How the data is built, and what it is not</h1>

      <h2 className={H2}>Coverage and limitations</h2>
      <p><strong>Barycenter is a best-effort compilation of public information, not an exhaustive record.</strong> Private rounds that were never announced or filed are missing. Many announced rounds do not state each investor&apos;s share, so most investor amounts read “undisclosed”. Totals count disclosed amounts only and are therefore lower bounds. Asia, and small seed rounds outside the US, are thinner than the US and Europe.</p>
      {cov && (
        <>
          <p>This release ({cov.release}{cov.draft ? ", draft" : ""}, generated {cov.generated_at.slice(0, 10)}) contains {cov.counts.companies} companies, {cov.counts.investors + cov.counts.funders} investors and funders, {cov.counts.events} funding events and {cov.counts.agreements} agreements, backed by {cov.counts.snapshots} archived source documents. {cov.counts.events_undisclosed_amount} events have an undisclosed amount. {cov.counts.participations_with_amount} of {cov.counts.participations} investor participations state the investor&apos;s own amount.</p>
          <h3 className="mt-6 font-medium">Reference comparison</h3>
          <p>Reference totals are used only as a sanity check, never as a source of any figure.</p>
          <ul>
            {cov.benchmarks.map((b) => (
              <li key={b.id}><a className="underline underline-offset-2" href={b.url}>{b.label}</a>: {usd(b.usd)}. Barycenter fusion equity in this release: {usd(b.ours_usd)} ({Math.round(b.ratio * 100)}% of the reference).</li>
            ))}
          </ul>
          <p>The company census behind this release lists {cov.counts.census_candidates} candidates. Only companies with at least one evidenced funding event are published; the rest are tracked but shown as a count, not as empty cards.</p>
          {cov.skipped_ledgers.length > 0 && (
            <>
              <h3 className="mt-6 font-medium">Reviewed and left out</h3>
              <ul>{cov.skipped_ledgers.map((s) => <li key={s}>{s.replace(/\.yaml:/, ":").replace(/_/g, " ")}</li>)}</ul>
            </>
          )}
        </>
      )}

      <p><strong>Company profile fields</strong> (headquarters, founding year, technology approach, logo) come from a census compiled from public lists and company websites. Unlike funding facts they are not individually quoted; logos are shown to identify companies and removed on request.</p>

      <h2 className={H2}>Evidence chain</h2>
      <p>Every figure traces through three layers. A <strong>snapshot</strong> is the exact page or API response we fetched, stored by its SHA-256 hash with the time we fetched it. A <strong>claim</strong> is one thing a source says, with a verbatim quote that is machine-checked against the snapshot text. A <strong>fact</strong> is what this site shows, chosen from claims by written rules. Press releases are quoted briefly, never republished; where the publisher forbids automated access we cite the Wayback Machine copy.</p>

      <h2 className={H2}>What counts as funding</h2>
      <ul>
        <li><strong>Equity</strong> (rounds, extensions, IPOs, registered offerings), <strong>public money</strong> (grants, cost-share, vouchers) and <strong>debt</strong> are shown separately.</li>
        <li><strong>Agreements</strong> (offtake, power purchase, fuel supply, early government contracts) are signals and are never added to any total.</li>
        <li>Statements like “has raised $X to date” are stored but not counted as rounds.</li>
        <li>Government awards show committed, obligated and paid-out amounts where the source separates them. National-lab and university money is context only, never in a company&apos;s total.</li>
        <li>Foreign currencies keep their original amount and are converted to USD at the European Central Bank rate on the announcement date; the rate is an archived snapshot too.</li>
      </ul>

      <h2 className={H2}>Disclosed only</h2>
      <p>We never estimate an investor&apos;s share of a round and never split a round evenly. If a source does not state an amount, the amount is shown as undisclosed.</p>

      <h2 className={H2}>Sources and conduct</h2>
      <p>Official APIs and bulk data come first (SEC EDGAR, USAspending.gov, Canada Grants and Contributions, ARPA-E, EU CORDIS, Wikidata, ECB rates), then company and investor announcements, then trade press for corroboration. We obey robots.txt, identify ourselves, throttle requests, and do not use paywalled or licensed databases such as Crunchbase or PitchBook. Angel investors appear only when publicly named by the company or themselves.</p>

      <h2 className={H2}>Corrections</h2>
      <p>Found an error, or want an entry changed or removed? Use “Report an error” in the footer. Corrections and removals are logged and listed in the release changelog.</p>
    </div>
  );
}
