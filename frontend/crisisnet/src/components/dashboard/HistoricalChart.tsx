"use client";

import { useEffect, useState } from "react";
import { getHistorical } from "@/lib/api";
import type { HistoricalEvent } from "@/lib/types";

export function HistoricalChart() {
  const [data, setData] = useState<HistoricalEvent[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const next = await getHistorical();
        if (!active) return;
        setData(next.slice(0, 6));
      } catch (err) {
        console.error("Historical load failed:", err);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  const maxInc = Math.max(...data.map((h) => h.incidents));

  return (
    <div className="bg-white p-4">
      <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#06b6d4]" />
        Historical Analytics
        <span className="ml-auto text-[9px] text-[#6b7869] font-mono">
          HISTORICAL
        </span>
      </div>

      {data.map((h) => (
        <div key={h.name} className="mb-1.5">
          <div className="flex justify-between font-mono text-[9px] text-[#6b7869] mb-0.5">
            <span>
              {h.name} ({h.year})
            </span>
            <span>
              {h.incidents} / {h.resources}
            </span>
          </div>
          <div className="h-3.5 bg-[#e8ece4] overflow-hidden flex gap-px">
            <div
              className="h-full bg-gradient-to-r from-[#16a34a] to-[#15803d]"
              style={{ width: `${(h.incidents / maxInc) * 65}%` }}
            />
            <div
              className="h-full bg-[#06b6d4]"
              style={{ width: `${(h.resources / maxInc) * 65}%` }}
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-2 font-mono text-[9px] text-[#6b7869]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-[#16a34a]" />
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
