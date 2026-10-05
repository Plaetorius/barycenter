"use client";

import { geoNaturalEarth1, geoPath } from "d3-geo";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

import { usd } from "@/lib/format";
import type { CompanyRow } from "@/lib/types";

import centroids from "@/lib/country-centroids.json";

import { ZoomControls } from "./zoom-controls";

function wedge(r: number, from: number, to: number): string {
  const a = (t: number) => [r * Math.sin(t * 2 * Math.PI), -r * Math.cos(t * 2 * Math.PI)];
  const [x0, y0] = a(from), [x1, y1] = a(to);
  return `M0,0 L${x0},${y0} A${r},${r} 0 ${to - from > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`;
}

const W = 960;
const H = 500;

/** HQ-only world map: one dot per country-city cluster would need geocoding, so v1 plots by country centroid. */
export function WorldMap({ rows, onOpen }: { rows: CompanyRow[]; onOpen: (id: string) => void }) {
  const [land, setLand] = useState<string | null>(null);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projection = useMemo(() => geoNaturalEarth1().fitSize([W, H], { type: "Sphere" }), []);

  useEffect(() => {
    let live = true;
    import("world-atlas/countries-110m.json").then((m) => {
      const topo = m.default as unknown as Topology;
      const countries = feature(topo, topo.objects.countries as GeometryCollection);
      if (live) setLand(geoPath(projection)(countries) ?? null);
    });
    return () => { live = false; };
  }, [projection]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const behaviour = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 14])
      .translateExtent([[0, 0], [W, H]])
      .on("zoom", (e) => setT(e.transform));
    zoomRef.current = behaviour;
    select(el).call(behaviour);
    return () => { select(el).on(".zoom", null); };
  }, []);

  const by = (k: number) => svgRef.current && zoomRef.current && select(svgRef.current).transition().duration(220).call(zoomRef.current.scaleBy, k);
  const reset = () => svgRef.current && zoomRef.current && select(svgRef.current).transition().duration(260).call(zoomRef.current.transform, zoomIdentity);

  const byCountry = useMemo(() => {
    const m = new Map<string, CompanyRow[]>();
    for (const r of rows) if (r.country) m.set(r.country, [...(m.get(r.country) ?? []), r]);
    return m;
  }, [rows]);

  const max = Math.max(1, ...[...byCountry.values()].map((v) => v.reduce((s, r) => s + r.totals.total, 0)));

  return (
    <figure className="relative p-2">
      <ZoomControls onIn={() => by(1.8)} onOut={() => by(1 / 1.8)} onReset={reset} />
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full cursor-grab touch-none active:cursor-grabbing" role="group" aria-label="Map of company headquarters. Scroll or pinch to zoom, drag to move.">
       <g transform={t.toString()}>
        <path d={geoPath(projection)({ type: "Sphere" }) ?? ""} fill="none" stroke="var(--map-line)" vectorEffect="non-scaling-stroke" />
        {land && <path d={land} fill="var(--map-land)" stroke="var(--map-line)" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />}
        {[...byCountry.entries()].map(([cc, list]) => {
          const c = (centroids as unknown as Record<string, [number, number]>)[cc];
          const p = c && projection([c[1], c[0]]);
          if (!p) return null;
          const total = list.reduce((s, r) => s + r.totals.total, 0);
          const r = (5 + 22 * Math.sqrt(total / max)) / Math.sqrt(t.k);  // dots stay a readable size while zooming
          const frac = list.filter((x) => x.sector === "fusion").length / list.length;
          return (
            <g key={cc} transform={`translate(${p[0]},${p[1]})`} className="cursor-pointer" tabIndex={0} role="button"
              aria-label={`${cc}: ${list.length} companies, ${usd(total)} disclosed`}
              onClick={() => onOpen(list.sort((a, b) => b.totals.total - a.totals.total)[0].id)}>
              <title>{`${cc}: ${list.length} companies · ${usd(total)}\n${list.map((x) => x.name).join(", ")}`}</title>
              {frac >= 1 || frac <= 0
                ? <circle r={r} style={{ fill: frac >= 1 ? "var(--fusion)" : "var(--fission)" }} stroke="var(--background)" strokeWidth={1.5} />
                : <>
                    <path d={wedge(r, 0, frac)} style={{ fill: "var(--fusion)" }} stroke="var(--background)" strokeWidth={1.5} />
                    <path d={wedge(r, frac, 1)} style={{ fill: "var(--fission)" }} stroke="var(--background)" strokeWidth={1.5} />
                  </>}
              <text textAnchor="middle" dy="0.35em" style={{ fontSize: 10 / Math.sqrt(t.k) }} className="pointer-events-none fill-[var(--background)] font-semibold">{list.length}</text>
            </g>
          );
        })}
       </g>
      </svg>
      <figcaption className="px-2 pb-2 text-xs text-muted-foreground">Dot area is disclosed funding, the number is companies headquartered there, the pie splits amber fusion and teal fission by company count. Positions are country-level in this release.</figcaption>
    </figure>
  );
}
