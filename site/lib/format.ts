const CURRENCY: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "C$", JPY: "¥", CNY: "CN¥", KRW: "₩", AUD: "A$", CHF: "CHF " };

/** 863_000_000 -> "$863M", 2_923_000_000 -> "$2.92B". Zero or null -> an en dash (never "$0"). */
export function usd(n: number | null | undefined, opts: { approx?: boolean } = {}): string {
  if (!n) return "–";
  const abs = Math.abs(n);
  const body =
    abs >= 1e9 ? `${(n / 1e9).toFixed(abs >= 1e10 ? 1 : 2).replace(/\.?0+$/, "")}B` :
    abs >= 1e6 ? `${(n / 1e6).toFixed(abs >= 1e8 ? 0 : 1).replace(/\.0$/, "")}M` :
    abs >= 1e3 ? `${Math.round(n / 1e3)}K` : `${Math.round(n)}`;
  return `${opts.approx ? "~" : ""}$${body}`;
}

export function money(m: { amount: number; currency: string; qualifier: string } | null): string {
  if (!m) return "Undisclosed";
  const sym = CURRENCY[m.currency] ?? `${m.currency} `;
  const body = usd(m.amount).replace("$", sym);
  const q = { exact: "", approx: "~", over: "> ", up_to: "up to ", range: "" }[m.qualifier] ?? "";
  return `${q}${body}`;
}

export function shortDate(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function fullDate(iso: string | null): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

const INSTRUMENT_LABEL: Record<string, string> = {
  equity: "Equity", grant: "Grant", cost_share: "Cost-share", voucher: "Voucher", debt: "Debt", ipo: "IPO", spac: "SPAC", follow_on: "Follow-on", other: "Other",
};
export const instrumentLabel = (i: string) => INSTRUMENT_LABEL[i] ?? i;

export function titleCase(s: string): string {
  return s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function countryName(code: string | null): string {
  if (!code) return "–";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
