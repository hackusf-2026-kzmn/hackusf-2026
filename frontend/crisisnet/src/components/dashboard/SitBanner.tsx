"use client";

import { useState, useEffect } from "react";
import { getIncidents } from "@/lib/api";
import { getActivityStream } from "@/lib/api";

export function SitBanner() {
  const [alertCount, setAlertCount] = useState(0);
  const [topEvent, setTopEvent] = useState("");
  const [topSeverity, setTopSeverity] = useState("");
  const [liveMsg, setLiveMsg] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const incidents = await getIncidents();
        if (!active) return;
        setAlertCount(incidents.length);
        if (incidents.length > 0) {
          const top = incidents[0];
          setTopEvent(top.event || top.description || "Active Alert");
          setTopSeverity(top.severity || "Unknown");
        }
      } catch { /* keep defaults */ }
    };
    load();
    const i = setInterval(load, 30000);
    return () => { active = false; clearInterval(i); };
  }, []);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const data = await getActivityStream();
        if (!active) return;
        if (data.latest) {
          setVisible(false);
          setTimeout(() => { setLiveMsg(data.latest); setVisible(true); }, 300);
        }
      } catch { /* keep current */ }
    };
    poll();
    const i = setInterval(poll, 5000);
    return () => { active = false; clearInterval(i); };
  }, []);

  return (
    <div className="relative bg-[#edf1e8] border-b border-[#d4dbc8] font-mono text-[11px] tracking-wider flex-shrink-0">
      {/* Animated top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b3b] to-transparent animate-scanline" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#16a34a] to-transparent animate-scanline [animation-delay:1.5s]" />

      <div className="px-10 py-2 flex items-center gap-4 overflow-hidden">
        <span className="bg-[rgba(255,59,59,0.1)] text-[#ff3b3b] px-2.5 py-0.5 font-medium text-[10px] border border-[rgba(255,59,59,0.25)] tracking-wider flex-shrink-0">
          ⚠ {alertCount} ALERT{alertCount !== 1 ? "S" : ""} · {topSeverity.toUpperCase()}
        </span>
        <span className="text-[#111d0f] truncate min-w-0">{topEvent || "Monitoring…"}</span>
        <span className="text-[#6b7869] flex-shrink-0">·</span>
        <span className="text-[#52665e] flex-shrink-0">Tampa Bay, FL · zip 33602</span>
        <span className="text-[#6b7869] flex-shrink-0">·</span>
        <span className="text-[#6b7869] tracking-wider uppercase flex-shrink-0 flex items-center gap-1.5 text-[10px]">
          <span className="inline-block w-1 h-1 bg-[#16a34a] animate-pulse" />
          PROCESSING
        </span>
        <div className="flex-1 overflow-hidden h-[14px] relative text-[10px] min-w-0">
          <span
            className={`absolute font-mono text-[#52665e] whitespace-nowrap transition-all duration-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            {liveMsg || "Agents initializing…"}
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
