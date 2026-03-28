"use client";

export function SitBanner() {
  return (
    <div className="relative bg-[#edf1e8] border-b border-[#d4dbc8] px-10 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-wider">
      {/* Animated top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b3b] to-transparent animate-scanline" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#16a34a] to-transparent animate-scanline [animation-delay:1.5s]" />

      <div className="flex items-center gap-4">
        <span className="bg-[rgba(255,59,59,0.1)] text-[#ff3b3b] px-2.5 py-0.5 font-medium text-[10px] border border-[rgba(255,59,59,0.25)] tracking-wider">
          ⚠ SEVERITY: 8.4 / 10
        </span>
        <span className="text-[#111d0f]">EVT-001 — Category 3 Hurricane Approaching</span>
        <span className="text-[#6b7869]">·</span>
        <span className="text-[#52665e]">Tampa Bay, FL · zip 33602</span>
        <span className="text-[#6b7869]">·</span>
        <span className="text-[#52665e]">42,000 RESIDENTS IN IMPACT ZONE</span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#16a34a]">
        <span className="animate-blink">●</span>
        5 AGENTS ONLINE
      </div>
    </div>
  );
}
