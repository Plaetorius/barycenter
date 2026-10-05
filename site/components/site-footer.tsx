import Link from "next/link";

import { CONTACT_EMAIL } from "@/lib/site";

export function SiteFooter({ release, draft }: { release?: string; draft?: boolean }) {
  return (
    <footer className="mt-auto border-t px-4 py-5 text-xs leading-relaxed text-muted-foreground">
      <nav aria-label="Pages" className="mx-auto mb-3 flex max-w-5xl gap-4 text-sm sm:hidden">
        <Link href="/overview" className="underline underline-offset-2">Overview</Link>
        <Link href="/methodology" className="underline underline-offset-2">Methodology</Link>
        <Link href="/data" className="underline underline-offset-2">Data</Link>
      </nav>
      <p className="mx-auto max-w-5xl">
        {draft && <strong className="mr-2 rounded bg-fusion/20 px-1.5 py-0.5 text-foreground">DRAFT DATA</strong>}
        Compiled from public filings, government data and company announcements. <strong className="font-medium text-foreground">Not exhaustive:</strong>{" "}
        undisclosed rounds and amounts are missing, and totals count disclosed amounts only. Not investment, legal or financial advice.
        {release && <> Data release {release}.</>} Sources on every figure.{" "}
        <Link href="/methodology" className="underline underline-offset-2">Methodology</Link> ·{" "}
        <a className="underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}?subject=Barycenter%20correction`}>Report an error</a>
      </p>
    </footer>
  );
}
