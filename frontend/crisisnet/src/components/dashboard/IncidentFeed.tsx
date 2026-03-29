"use client";

import { useState } from "react";
import type { Incident } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";

interface IncidentFeedProps {
  incidents: Incident[];
}

export function IncidentFeed({ incidents }: IncidentFeedProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const sorted = [...incidents].sort((a, b) => {
    const o: Record<string, number> = { P1: 0, P2: 1, P3: 2 };
    return (o[a.priority] ?? 3) - (o[b.priority] ?? 3);
  });

  return (
    <div className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      {sorted.map((inc) => {
        const cfg = PRIORITY_CONFIG[inc.priority] ?? { color: "#888", bg: "rgba(136,136,136,0.12)", label: "UNKNOWN" };
        const isCollapsed = collapsed.has(inc.id);
        return (
          <div
            key={inc.id}
            onClick={() => toggle(inc.id)}
            className={`bg-white border p-2.5 mb-1.5 transition-all cursor-pointer select-none ${
              inc.isNew
                ? "border-[#16a34a] shadow-[0_0_10px_rgba(22,163,74,0.1)] animate-slide-in"
                : "border-[#d4dbc8] hover:bg-[#edf1e8] hover:border-[#b8c4aa]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#6b7869]">
                {inc.id}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[9px] font-medium px-2 py-0.5 tracking-wider"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {inc.priority} | {cfg.label}
                </span>
                <svg
                  width="8" height="8" viewBox="0 0 8 8" fill="none"
                  className={`text-[#6b7869] transition-transform ${isCollapsed ? "" : "rotate-180"}`}
                >
                  <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {!isCollapsed && (
              <>
                <div className="text-[11px] leading-snug mt-1.5 mb-1.5">
                  {inc.description}
                </div>
                <div className="flex gap-2.5 font-mono text-[9px] text-[#6b7869]">
                  <span>📍 {inc.location}</span>
                  <span>{inc.timestamp}</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
