"use client";

import { useState, useEffect } from "react";
import { mockAgentStatus } from "@/mock/mockAgentStatus";

interface ConvoMessage {
  from: string;
  to: string;
  body: string;
  time: string;
}

const SEED_CONVOS: ConvoMessage[] = [
  { from: "SCOUT", to: "TRIAGE", body: "NWS pressure drop detected — Gulf sector. Passing raw telemetry for scoring.", time: "06:12" },
  { from: "TRIAGE", to: "RESOURCE", body: "EVT-001 scored 8.4/10. Cat 3 + high-density zone. Requesting resource match for zip 33602.", time: "06:15" },
  { from: "RESOURCE", to: "COMMS", body: "3 FEMA programs matched for 33602. Red Cross shelter capacity confirmed. Ready for alert dispatch.", time: "06:18" },
  { from: "COMMS", to: "COORD", body: "Multilingual alert (EN/ES/HT) drafted for Zone A. Awaiting dispatch authorization.", time: "06:20" },
  { from: "COORD", to: "ALL", body: "Pipeline cycle complete — 94s. All agents synced. Re-queuing Scout for next monitoring window.", time: "06:22" },
  { from: "SCOUT", to: "TRIAGE", body: "Storm surge anomaly flagged — Pinellas coastline. 8-12 ft above normal projected.", time: "07:01" },
  { from: "TRIAGE", to: "COORD", body: "EVT-002 escalated. Coastal proximity + surge height = P1 CRITICAL.", time: "07:04" },
  { from: "RESOURCE", to: "COMMS", body: "Florida Disaster Fund activated for EVT-002. Feeding Tampa Bay deployed to EVT-003.", time: "08:35" },
];

const AGENT_COLORS: Record<string, string> = {
  SCOUT: "#16a34a",
  TRIAGE: "#ff9f1a",
  RESOURCE: "#06b6d4",
  COMMS: "#a855f7",
  COORD: "#ff3b3b",
  ALL: "#6b7869",
};

export function AgentConversations() {
  const [messages, setMessages] = useState<ConvoMessage[]>(SEED_CONVOS);

  // Simulate a new inter-agent message every ~12s
  useEffect(() => {
    const agents = mockAgentStatus;
    const phrases = [
      "Updating threat model with latest sensor data.",
      "Cross-referencing Census API for population exposure.",
      "Shelter capacity recalculated — overflow routing updated.",
      "New subscriber batch enrolled — 480 addresses added.",
      "Parallel pipeline initiated for EVT-003 + EVT-005.",
      "Verifying NOAA buoy readings against NWS forecast.",
    ];
    const interval = setInterval(() => {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)];
      const toAgent = agents[Math.floor(Math.random() * agents.length)];
      if (fromAgent.id === toAgent.id) return;
      const now = new Date();
      setMessages((prev) => [
        ...prev.slice(-15),
        {
          from: fromAgent.shortName,
          to: toAgent.shortName,
          body: phrases[Math.floor(Math.random() * phrases.length)],
          time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        },
      ]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      <div className="space-y-1.5">
        {messages.map((m, i) => (
          <div
            key={i}
            className="bg-white border border-[#d4dbc8] p-2 text-[10px] hover:bg-[#edf1e8] transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="font-mono font-bold text-[9px] px-1.5 py-0.5 tracking-wider"
                style={{
                  color: AGENT_COLORS[m.from] ?? "#6b7869",
                  background: `${AGENT_COLORS[m.from] ?? "#6b7869"}15`,
                }}
              >
                {m.from}
              </span>
              <span className="text-[#6b7869]">→</span>
              <span
                className="font-mono font-bold text-[9px] px-1.5 py-0.5 tracking-wider"
                style={{
                  color: AGENT_COLORS[m.to] ?? "#6b7869",
                  background: `${AGENT_COLORS[m.to] ?? "#6b7869"}15`,
                }}
              >
                {m.to}
              </span>
              <span className="ml-auto font-mono text-[9px] text-[#6b7869]">{m.time}</span>
            </div>
            <div className="text-[#52665e] leading-relaxed font-mono">{m.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
