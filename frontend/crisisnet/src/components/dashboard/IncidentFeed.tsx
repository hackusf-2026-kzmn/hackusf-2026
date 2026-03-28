"use client";

import type { Incident } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";

interface IncidentFeedProps {
  incidents: Incident[];
}

export function IncidentFeed({ incidents }: IncidentFeedProps) {
  const sorted = [...incidents].sort((a, b) => {
    const o: Record<string, number> = { P1: 0, P2: 1, P3: 2 };
    return (o[a.priority] ?? 3) - (o[b.priority] ?? 3);
  });

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#16a34a]" />
        Incident Feed
        <span className="ml-auto font-mono text-[9px] text-[#6b7869]">
          {sorted.length} active
        </span>
      </div>

      {sorted.map((inc) => {
        const cfg = PRIORITY_CONFIG[inc.priority];
        return (
          <div
            key={inc.id}
            className={`bg-white border p-2.5 mb-1.5 transition-all cursor-default ${
              inc.isNew
                ? "border-[#16a34a] shadow-[0_0_10px_rgba(22,163,74,0.1)] animate-slide-in"
                : "border-[#d4dbc8] hover:bg-[#edf1e8] hover:border-[#b8c4aa]"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#6b7869]">
                {inc.id}
              </span>
              <span
                className="font-mono text-[9px] font-medium px-2 py-0.5 tracking-wider"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {inc.priority} · {cfg.label}
              </span>
            </div>
            <div className="text-[11px] leading-snug mb-1.5">
              {inc.description}
            </div>
            <div className="flex gap-2.5 font-mono text-[9px] text-[#6b7869]">
              <span>📍 {inc.location}</span>
              <span>{inc.timestamp}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
