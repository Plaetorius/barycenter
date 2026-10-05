import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCoverage } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} · ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description:
    "Who funds nuclear energy: every fusion and fission company that has raised money, who invested, how much and when. " +
    "Public sources only, a citation on every figure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const cov = getCoverage();
  return (
    <html lang="en" className={`${sans.variable} font-sans antialiased`}>
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <NuqsAdapter>
          <TooltipProvider delayDuration={300}>
            <SiteHeader />
            <main id="main" className="flex flex-1 flex-col">{children}</main>
            <SiteFooter release={cov?.release} draft={cov?.draft} />
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
