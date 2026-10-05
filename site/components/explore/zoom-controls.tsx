"use client";

import { Maximize2, Minus, Plus } from "lucide-react";

interface Props { onIn: () => void; onOut: () => void; onReset: () => void }

/** Keyboard-reachable zoom buttons shared by the map and network views (wheel, drag and pinch also work). */
export function ZoomControls({ onIn, onOut, onReset }: Props) {
  const btn = "flex size-8 items-center justify-center bg-card text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <div role="group" aria-label="Zoom" className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border shadow-sm [&>button+button]:border-t">
      <button type="button" className={btn} onClick={onIn} aria-label="Zoom in"><Plus className="size-4" aria-hidden="true" /></button>
      <button type="button" className={btn} onClick={onOut} aria-label="Zoom out"><Minus className="size-4" aria-hidden="true" /></button>
      <button type="button" className={btn} onClick={onReset} aria-label="Reset view"><Maximize2 className="size-3.5" aria-hidden="true" /></button>
    </div>
  );
}
