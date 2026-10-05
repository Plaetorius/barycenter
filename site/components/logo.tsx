import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Company logo from public/logos (sourced, see seeds/profiles-*.yaml), else a monogram tinted by sector. */
export function Logo({ name, logo, sector, size = 28, className }: { name: string; logo?: string | null; sector?: string; size?: number; className?: string }) {
  const initials = name.replace(/\b(inc|ltd|llc|corp|corporation|gmbh|sas|plc|the)\b\.?/gi, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny pre-sized static WebP; next/image adds nothing here
      <img src={asset(`/${logo}`)} alt="" width={size} height={size} loading="lazy" decoding="async" className={cn("shrink-0 rounded-md bg-white object-contain ring-1 ring-border", className)} style={{ width: size, height: size }} />
    );
  }
  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-semibold text-foreground", className)}
      style={{ width: size, height: size, background: `color-mix(in oklab, ${sector === "fusion" ? "var(--fusion)" : sector === "fission" ? "var(--fission)" : "var(--ink-3)"} 28%, var(--background))`, boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${sector === "fusion" ? "var(--fusion)" : "var(--fission)"} 55%, transparent)` }}>
      {initials}
    </span>
  );
}
