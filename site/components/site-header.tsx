import Link from "next/link";

import { LABS_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

import { SearchButton } from "./search-command";

/** Barycenter mark: two bodies orbiting a shared centre of mass (larger body sits closer to the centre). */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="13" ry="5.5" fill="none" stroke="currentColor" strokeOpacity="0.35" transform="rotate(-24 16 16)" />
      <circle cx="12.4" cy="17.6" r="4" style={{ fill: "var(--fission)" }} />
      <circle cx="22.6" cy="11.4" r="2.2" style={{ fill: "var(--fusion)" }} />
      <circle cx="15.2" cy="15.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur">
      <Link href="/" className="flex min-w-0 items-center gap-2.5">
        <Mark />
        <span className="font-serif text-xl leading-none tracking-tight">{SITE_NAME}</span>
        <span className="hidden truncate text-sm text-muted-foreground md:inline">{SITE_TAGLINE}</span>
      </Link>
      <nav aria-label="Main" className="flex shrink-0 items-center gap-1 text-sm">
        <Link href="/overview" className="hidden rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-muted hover:text-foreground sm:block">Overview</Link>
        <Link href="/methodology" className="hidden rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-muted hover:text-foreground sm:block">Methodology</Link>
        <Link href="/data" className="hidden rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-muted hover:text-foreground sm:block">Data</Link>
        {/* Another zone: a plain <a> (multi-zones navigate with a full page load). */}
        <a href={LABS_URL} className="hidden rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-muted hover:text-foreground md:block">Mertia Labs</a>
        <SearchButton />
      </nav>
    </header>
  );
}
