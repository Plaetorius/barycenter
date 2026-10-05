"use client";

import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useEffect, useRef } from "react";

import { ZoomControls } from "./zoom-controls";

import type { CompanyRow, Edge, InvestorRow } from "@/lib/types";

interface Props {
  companies: CompanyRow[];
  investors: InvestorRow[];
  edges: Edge[];
  onOpen: (id: string, kind: "company" | "investor") => void;
}

/** Sigma parses hex/rgb only; the design tokens are oklch, so resolve them to rgb through a 1px canvas. */
function css(name: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return "#888";
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
}

/** Bipartite investor-company graph. Sigma is loaded only when this view opens (bundle budget). */
export function Network({ companies, investors, edges, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<import("sigma").default | null>(null);

  useEffect(() => {
    let sigma: import("sigma").default | null = null;
    let cancelled = false;
    (async () => {
      const { default: Sigma } = await import("sigma");
      if (cancelled || !ref.current) return;
      const g = new Graph({ type: "undirected" });
      const cIds = new Set(companies.map((c) => c.id));
      const linked = new Set(edges.flatMap((e) => [e.investor, e.company]));
      const fusion = css("--fusion"), fission = css("--fission"), ink = css("--ink-3"), line = css("--border");
      for (const c of companies) if (linked.has(c.id)) g.addNode(c.id, { label: c.name, size: 4 + Math.sqrt(c.totals.total / 1e7), color: c.sector === "fusion" ? fusion : fission, kind: "company", x: Math.random(), y: Math.random() });
      for (const i of investors) if (linked.has(i.id)) g.addNode(i.id, { label: i.name, size: 2.5 + i.companies * 1.2, color: ink, kind: "investor", x: Math.random(), y: Math.random() });
      for (const e of edges) if (g.hasNode(e.investor) && g.hasNode(e.company) && cIds.has(e.company) && !g.hasEdge(e.investor, e.company)) g.addEdge(e.investor, e.company, { size: 0.6 + Math.min(e.events, 4) * 0.4, color: line });
      if (g.order > 1) forceAtlas2.assign(g, { iterations: 220, settings: { ...forceAtlas2.inferSettings(g), gravity: 1.2, scalingRatio: 6, barnesHutOptimize: g.order > 400 } });
      sigma = sigmaRef.current = new Sigma(g, ref.current, { renderEdgeLabels: false, labelDensity: 0.35, labelRenderedSizeThreshold: 11, labelFont: "Geist, system-ui, sans-serif", labelColor: { color: css("--foreground") } });
      sigma.on("clickNode", ({ node }) => onOpen(node, g.getNodeAttribute(node, "kind")));
    })();
    return () => { cancelled = true; sigma?.kill(); sigmaRef.current = null; };
  }, [companies, investors, edges, onOpen]);

  return (
    <div className="relative">
      <ZoomControls onIn={() => sigmaRef.current?.getCamera().animatedZoom({ duration: 220 })} onOut={() => sigmaRef.current?.getCamera().animatedUnzoom({ duration: 220 })} onReset={() => sigmaRef.current?.getCamera().animatedReset({ duration: 260 })} />
      <div ref={ref} className="h-[62vh] min-h-[22rem] w-full" role="img" aria-label="Network of investors and the companies they funded. The table view lists the same relationships." />
      <p className="px-3 pb-3 text-xs text-muted-foreground">Coloured nodes are companies (amber fusion, teal fission), grey nodes are investors and public funders. Lines are publicly announced participations. Scroll or pinch to zoom, drag to move, click a node to open it.</p>
    </div>
  );
}
