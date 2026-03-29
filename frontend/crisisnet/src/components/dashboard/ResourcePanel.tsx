"use client";

import { useState } from "react";
import type { Resource } from "@/lib/types";

interface ResourcePanelProps {
  resources: Resource[];
}

export function ResourcePanel({ resources }: ResourcePanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1 font-mono text-[9px] text-[#6b7869] tracking-wider mb-1.5 pb-1 border-b border-[#d4dbc8] hover:text-[#16a34a] transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
          <path
            d={open ? "M1 3L4 6L7 3" : "M3 1L6 4L3 7"}
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        NEARBY SHELTERS ({resources.length})
      </button>
      {open && resources.map((r, i) => (
        <div
          key={`${r.name}-${i}`}
          className="flex items-start gap-2 px-2 py-1.5 bg-white border border-[#d4dbc8] mb-1 text-[11px] hover:bg-[#edf1e8] transition-colors"
        >
          <span>🏠</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[11px] truncate">{r.name}</div>
            <div className="font-mono text-[9px] text-[#6b7869] truncate">{r.address || `${r.lat}, ${r.lng}`}</div>
          </div>
          <span className="font-mono text-[9px] text-[#16a34a] whitespace-nowrap">
            {Number(r.distance_km).toFixed(1)} km
          </span>
        </div>
      ))}
      {resources.length === 0 && (
        <div className="text-center text-[10px] text-[#6b7869] py-4 font-mono">
          Loading shelters…
        </div>
      )}
    </div>
  );
}
