"use client";

import { useState } from "react";
import type { Resource } from "@/lib/types";

interface ResourcePanelProps {
  resources: Resource[];
}

export function ResourcePanel({ resources }: ResourcePanelProps) {
  const deployed = resources.filter((r) => r.status === "deployed");
  const available = resources.filter((r) => r.status === "available");
  const [deployedOpen, setDeployedOpen] = useState(true);
  const [availableOpen, setAvailableOpen] = useState(true);

  return (
    <div className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      {/* Deployed sub-section */}
      <button
        onClick={() => setDeployedOpen((v) => !v)}
        className="w-full flex items-center gap-1 font-mono text-[9px] text-[#6b7869] tracking-wider mb-1.5 pb-1 border-b border-[#d4dbc8] hover:text-[#16a34a] transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
          <path
            d={deployedOpen ? "M1 3L4 6L7 3" : "M3 1L6 4L3 7"}
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        DEPLOYED ({deployed.length})
      </button>
      {deployedOpen && deployed.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-2 px-2 py-1.5 bg-white border border-[#d4dbc8] mb-1 text-[11px] hover:bg-[#edf1e8] transition-colors"
        >
          <span>{r.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-[11px]">{r.name}</div>
            <div className="font-mono text-[9px] text-[#6b7869]">{r.type}</div>
          </div>
          <span className="font-mono text-[9px] text-[#16a34a]">
            → {r.assignedTo}
          </span>
        </div>
      ))}

      {/* Available sub-section */}
      <button
        onClick={() => setAvailableOpen((v) => !v)}
        className="w-full flex items-center gap-1 font-mono text-[9px] text-[#6b7869] tracking-wider mt-2.5 mb-1.5 pb-1 border-b border-[#d4dbc8] hover:text-[#16a34a] transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
          <path
            d={availableOpen ? "M1 3L4 6L7 3" : "M3 1L6 4L3 7"}
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        AVAILABLE ({available.length})
      </button>
      {availableOpen && available.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-2 px-2 py-1.5 bg-white border border-[#d4dbc8] mb-1 text-[11px] hover:bg-[#edf1e8] transition-colors"
        >
          <span>{r.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-[11px]">{r.name}</div>
            <div className="font-mono text-[9px] text-[#6b7869]">{r.type}</div>
          </div>
          <span className="font-mono text-[9px] text-[#16a34a]">STANDBY</span>
        </div>
      ))}
    </div>
  );
}
