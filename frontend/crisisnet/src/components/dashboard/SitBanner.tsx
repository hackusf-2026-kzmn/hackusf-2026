"use client";

export function SitBanner() {
  return (
    <div className="relative bg-[#141414] border-b border-[#262626] px-10 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-wider">
      {/* Animated top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b3b] to-transparent animate-scanline" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8ff00] to-transparent animate-scanline [animation-delay:1.5s]" />

      <div className="flex items-center gap-4">
        <span className="bg-[rgba(255,59,59,0.12)] text-[#ff3b3b] px-2.5 py-0.5 font-medium text-[10px] border border-[rgba(255,59,59,0.25)] tracking-wider">
          ⚠ SEVERITY: 8.4 / 10
        </span>
        <span className="text-white">EVT-001 — Category 3 Hurricane Approaching</span>
        <span className="text-[#555]">·</span>
        <span className="text-[#888]">Tampa Bay, FL · zip 33602</span>
        <span className="text-[#555]">·</span>
        <span className="text-[#888]">42,000 RESIDENTS IN IMPACT ZONE</span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#c8ff00]">
        <span className="animate-blink">●</span>
        5 AGENTS ONLINE
      </div>
    </div>
  );
}
