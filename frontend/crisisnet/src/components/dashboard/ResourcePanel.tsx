"use client";

import type { Resource } from "@/lib/types";

interface ResourcePanelProps {
  resources: Resource[];
}

export function ResourcePanel({ resources }: ResourcePanelProps) {
  const deployed = resources.filter((r) => r.status === "deployed");
  const available = resources.filter((r) => r.status === "available");

  return (
    <div className="p-4">
      <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#16a34a]" />
        Resources
      </div>

      <div className="font-mono text-[9px] text-[#6b7869] tracking-wider mb-1.5 pb-1 border-b border-[#d4dbc8]">
        DEPLOYED ({deployed.length})
      </div>
      {deployed.map((r) => (
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

      <div className="font-mono text-[9px] text-[#6b7869] tracking-wider mt-2.5 mb-1.5 pb-1 border-b border-[#d4dbc8]">
        AVAILABLE ({available.length})
      </div>
      {available.map((r) => (
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
