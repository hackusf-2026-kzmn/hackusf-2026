"use client";

import { mockHistorical } from "@/mock/mockHistorical";

export function HistoricalChart() {
  const data = mockHistorical.slice(0, 6); // Show top 6
  const maxInc = Math.max(...data.map((h) => h.incidents));

  return (
    <div className="bg-[#1a1a1a] p-4">
      <div className="font-mono text-[10px] text-[#555] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#06b6d4]" />
        Historical Analytics
        <span className="ml-auto text-[9px] text-[#ff9f1a] font-mono">
          SNOWFLAKE
        </span>
      </div>

      {data.map((h) => (
        <div key={h.name} className="mb-1.5">
          <div className="flex justify-between font-mono text-[9px] text-[#555] mb-0.5">
            <span>
              {h.name} ({h.year})
            </span>
            <span>
              {h.incidents} / {h.resources}
            </span>
          </div>
          <div className="h-3.5 bg-[rgba(38,38,38,0.5)] overflow-hidden flex gap-px">
            <div
              className="h-full bg-gradient-to-r from-[#c8ff00] to-[#a0cc00]"
              style={{ width: `${(h.incidents / maxInc) * 65}%` }}
            />
            <div
              className="h-full bg-[#06b6d4]"
              style={{ width: `${(h.resources / maxInc) * 65}%` }}
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-2 font-mono text-[9px] text-[#555]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-[#c8ff00]" />
          Incidents
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-[#06b6d4]" />
          Resources
        </span>
      </div>
    </div>
  );
}
