"use client";

import { useState, useEffect } from "react";

const PROCESSING_MESSAGES = [
  "Scout → ingesting NWS pressure data…",
  "Triage → scoring EVT-001 severity model…",
  "Resource → matching FEMA programs to zip 33602…",
  "Comms → drafting multilingual alert (EN/ES/HT)…",
  "Coord → pipeline sync complete — 94s cycle",
  "Scout → scanning NOAA buoy telemetry…",
  "Triage → escalating EVT-002 coastal surge risk…",
  "Resource → verifying Red Cross shelter capacity…",
  "Comms → dispatching Zone A evacuation notice…",
  "Coord → re-queuing Scout for next monitor window…",
  "Scout → social feed scan — Hillsborough flooding reports…",
  "Triage → Census API cross-ref for population density…",
  "Resource → Florida Disaster Fund activation confirmed…",
  "Processing input → new report received, routing to Triage…",
];

export function SitBanner() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#edf1e8] border-b border-[#d4dbc8] font-mono text-[11px] tracking-wider flex-shrink-0">
      {/* Animated top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b3b] to-transparent animate-scanline" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#16a34a] to-transparent animate-scanline [animation-delay:1.5s]" />

      <div className="px-10 py-2 flex items-center gap-4">
        <span className="bg-[rgba(255,59,59,0.1)] text-[#ff3b3b] px-2.5 py-0.5 font-medium text-[10px] border border-[rgba(255,59,59,0.25)] tracking-wider flex-shrink-0">
          ⚠ SEVERITY: 8.4 / 10
        </span>
        <span className="text-[#111d0f] flex-shrink-0">EVT-001 — Category 3 Hurricane Approaching</span>
        <span className="text-[#6b7869]">·</span>
        <span className="text-[#52665e] flex-shrink-0">Tampa Bay, FL · zip 33602</span>
        <span className="text-[#6b7869]">·</span>
        <span className="text-[#6b7869] tracking-wider uppercase flex-shrink-0 flex items-center gap-1.5 text-[10px]">
          <span className="inline-block w-1 h-1 bg-[#16a34a] animate-pulse" />
          PROCESSING
        </span>
        <div className="flex-1 overflow-hidden h-[14px] relative text-[10px]">
          <span
            className={`absolute font-mono text-[#52665e] whitespace-nowrap transition-all duration-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            {PROCESSING_MESSAGES[msgIndex]}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#16a34a] flex-shrink-0">
          <span className="animate-blink">●</span>
          5 AGENTS ONLINE
        </div>
      </div>
    </div>
  );
}
