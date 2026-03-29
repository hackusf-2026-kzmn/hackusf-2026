"use client";

import { useState, useEffect, useRef } from "react";
import { mockAgentStatus } from "@/mock/mockAgentStatus";

interface ConvoMessage {
  from: string;
  to: string;
  body: string;
  time: string;
}

interface ConvoThread {
  id: number;
  summary: string;
  participants: string[];
  time: string;
  messages: ConvoMessage[];
}

const AGENT_COLORS: Record<string, string> = {
  SCOUT: "#16a34a",
  TRIAGE: "#ff9f1a",
  RESOURCE: "#06b6d4",
  COMMS: "#a855f7",
  COORD: "#ff3b3b",
  ALL: "#6b7869",
};

const SEED_THREADS: ConvoThread[] = [
  {
    id: 1,
    summary: "Hurricane EVT-001 initial detection & severity scoring",
    participants: ["SCOUT", "TRIAGE", "COORD"],
    time: "06:12",
    messages: [
      { from: "SCOUT", to: "TRIAGE", body: "NWS pressure drop detected — Gulf sector. Passing raw telemetry for scoring.", time: "06:12" },
      { from: "TRIAGE", to: "SCOUT", body: "Received. Running severity model against Cat 3 parameters + population density overlay.", time: "06:13" },
      { from: "TRIAGE", to: "COORD", body: "EVT-001 scored 8.4/10. Cat 3 + high-density zone (42k residents). Recommending P1 classification.", time: "06:15" },
      { from: "COORD", to: "TRIAGE", body: "Confirmed P1. Initiating full pipeline — all agents notified. Scout: maintain continuous monitoring.", time: "06:16" },
    ],
  },
  {
    id: 2,
    summary: "Resource matching & shelter deployment for zip 33602",
    participants: ["RESOURCE", "COMMS", "COORD"],
    time: "06:18",
    messages: [
      { from: "RESOURCE", to: "COMMS", body: "3 FEMA programs matched for 33602. Red Cross shelter capacity confirmed at 12 sites.", time: "06:18" },
      { from: "COMMS", to: "RESOURCE", body: "Copy. Drafting multilingual alert (EN/ES/HT) for Zone A with shelter locations.", time: "06:19" },
      { from: "COMMS", to: "COORD", body: "Alert drafted — awaiting dispatch authorization. Includes evacuation routes + shelter addresses.", time: "06:20" },
      { from: "COORD", to: "COMMS", body: "Authorized. Dispatch immediately. Priority: mobile-first SMS + emergency broadcast integration.", time: "06:21" },
      { from: "COORD", to: "ALL", body: "Pipeline cycle complete — 94s. All agents synced. Re-queuing Scout for next monitoring window.", time: "06:22" },
    ],
  },
  {
    id: 3,
    summary: "Storm surge escalation — Pinellas coastline P1 critical",
    participants: ["SCOUT", "TRIAGE", "COORD"],
    time: "07:01",
    messages: [
      { from: "SCOUT", to: "TRIAGE", body: "Storm surge anomaly flagged — Pinellas coastline. 8-12 ft above normal projected.", time: "07:01" },
      { from: "TRIAGE", to: "COORD", body: "EVT-002 escalated. Coastal proximity + surge height = P1 CRITICAL. Immediate action required.", time: "07:04" },
      { from: "COORD", to: "ALL", body: "EVT-002 now P1. Resource + Comms: initiate coastal evacuation support package.", time: "07:05" },
    ],
  },
  {
    id: 4,
    summary: "Disaster fund activation & food assistance deployment",
    participants: ["RESOURCE", "COMMS"],
    time: "08:35",
    messages: [
      { from: "RESOURCE", to: "COMMS", body: "Florida Disaster Fund activated for EVT-002. Feeding Tampa Bay deployed to EVT-003 zone.", time: "08:35" },
      { from: "COMMS", to: "RESOURCE", body: "Acknowledged. Adding resource links to active alerts. Updating 211 hotline script.", time: "08:37" },
    ],
  },
];

const NEW_THREAD_TEMPLATES: { summary: string; participants: string[]; messages: Omit<ConvoMessage, "time">[] }[] = [
  {
    summary: "Power grid instability assessment — 12k homes affected",
    participants: ["SCOUT", "TRIAGE", "RESOURCE"],
    messages: [
      { from: "SCOUT", to: "TRIAGE", body: "TECO reporting transformer failures across 3 substations. 12,000 homes without power." },
      { from: "TRIAGE", to: "RESOURCE", body: "EVT-004 scored moderate — no life-safety risk yet but elderly population vulnerable. Requesting welfare checks." },
      { from: "RESOURCE", to: "TRIAGE", body: "Coordinating with Hillsborough County Emergency Services for door-to-door wellness checks in senior communities." },
    ],
  },
  {
    summary: "Shelter overflow routing — Hillsborough HS at capacity",
    participants: ["RESOURCE", "COMMS", "COORD"],
    messages: [
      { from: "RESOURCE", to: "COMMS", body: "Hillsborough HS shelter at 120% capacity. Overflow routing to Middleton HS (42% capacity)." },
      { from: "COMMS", to: "COORD", body: "Updated shelter alerts dispatched. Transport assistance info added for mobility-limited residents." },
      { from: "COORD", to: "ALL", body: "Shelter capacity dashboard updated. Next overflow threshold trigger set for Middleton at 80%." },
    ],
  },
];

export function AgentConversations() {
  const [threads, setThreads] = useState<ConvoThread[]>(SEED_THREADS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(SEED_THREADS.length + 1);

  // Add new conversation threads periodically
  useEffect(() => {
    let templateIdx = 0;
    const interval = setInterval(() => {
      if (templateIdx >= NEW_THREAD_TEMPLATES.length) {
        clearInterval(interval);
        return;
      }
      const template = NEW_THREAD_TEMPLATES[templateIdx];
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const id = nextId.current++;
      setThreads((prev) => [
        ...prev,
        {
          id,
          summary: template.summary,
          participants: template.participants,
          time,
          messages: template.messages.map((m) => ({ ...m, time })),
        },
      ]);
      templateIdx++;
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      <div className="space-y-1.5">
        {threads.map((thread) => {
          const isOpen = expandedId === thread.id;
          return (
            <div
              key={thread.id}
              className="bg-white border border-[#d4dbc8] transition-colors hover:border-[#16a34a]/40"
            >
              {/* Summary row — clickable */}
              <button
                className="w-full text-left p-2 flex items-start gap-2"
                onClick={() => setExpandedId(isOpen ? null : thread.id)}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  className={`mt-0.5 flex-shrink-0 text-[#6b7869] transition-transform duration-150 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                >
                  <path d="M2 1L6 4L2 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-[#111d0f] leading-snug">
                    {thread.summary}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {thread.participants.map((p) => (
                      <span
                        key={p}
                        className="font-mono text-[8px] font-bold px-1 py-0.5 tracking-wider"
                        style={{
                          color: AGENT_COLORS[p] ?? "#6b7869",
                          background: `${AGENT_COLORS[p] ?? "#6b7869"}15`,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                    <span className="ml-auto font-mono text-[9px] text-[#6b7869]">{thread.time}</span>
                  </div>
                </div>
              </button>

              {/* Expanded full conversation */}
              {isOpen && (
                <div className="border-t border-[#d4dbc8] bg-[#f5f7f3] px-3 py-2 space-y-1.5">
                  {thread.messages.map((m, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span
                        className="font-mono text-[8px] font-bold px-1 py-0.5 tracking-wider flex-shrink-0 mt-0.5"
                        style={{
                          color: AGENT_COLORS[m.from] ?? "#6b7869",
                          background: `${AGENT_COLORS[m.from] ?? "#6b7869"}15`,
                        }}
                      >
                        {m.from}
                      </span>
                      <span className="text-[8px] text-[#6b7869] mt-0.5 flex-shrink-0">→</span>
                      <span
                        className="font-mono text-[8px] font-bold px-1 py-0.5 tracking-wider flex-shrink-0 mt-0.5"
                        style={{
                          color: AGENT_COLORS[m.to] ?? "#6b7869",
                          background: `${AGENT_COLORS[m.to] ?? "#6b7869"}15`,
                        }}
                      >
                        {m.to}
                      </span>
                      <span className="font-mono text-[10px] text-[#52665e] leading-relaxed">
                        {m.body}
                      </span>
                      <span className="ml-auto font-mono text-[8px] text-[#6b7869] flex-shrink-0">{m.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
