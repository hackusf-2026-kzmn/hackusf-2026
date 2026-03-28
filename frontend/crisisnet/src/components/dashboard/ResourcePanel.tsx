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
      <div className="font-mono text-[10px] text-[#555] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#c8ff00]" />
        Resources
      </div>

      <div className="font-mono text-[9px] text-[#555] tracking-wider mb-1.5 pb-1 border-b border-[#262626]">
        DEPLOYED ({deployed.length})
      </div>
      {deployed.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-2 px-2 py-1.5 bg-[#1a1a1a] border border-[#262626] mb-1 text-[11px] hover:bg-[#141414] transition-colors"
        >
          <span>{r.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-[11px]">{r.name}</div>
            <div className="font-mono text-[9px] text-[#555]">{r.type}</div>
          </div>
          <span className="font-mono text-[9px] text-[#c8ff00]">
            → {r.assignedTo}
          </span>
        </div>
      ))}

      <div className="font-mono text-[9px] text-[#555] tracking-wider mt-2.5 mb-1.5 pb-1 border-b border-[#262626]">
        AVAILABLE ({available.length})
      </div>
      {available.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-2 px-2 py-1.5 bg-[#1a1a1a] border border-[#262626] mb-1 text-[11px] hover:bg-[#141414] transition-colors"
        >
          <span>{r.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-[11px]">{r.name}</div>
            <div className="font-mono text-[9px] text-[#555]">{r.type}</div>
          </div>
          <span className="font-mono text-[9px] text-[#c8ff00]">STANDBY</span>
        </div>
      ))}
    </div>
  );
}
