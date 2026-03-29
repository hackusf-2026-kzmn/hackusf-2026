"use client";

import { useState, useEffect, useRef } from "react";
import { getActivityStream } from "@/lib/api";

const AGENT_COLORS: Record<string, string> = {
  Scout: "#16a34a",
  Triage: "#ff9f1a",
  Resource: "#06b6d4",
  Comms: "#a855f7",
  Coordinator: "#ff3b3b",
};

function agentColor(msg: string): string {
  for (const [agent, color] of Object.entries(AGENT_COLORS)) {
    if (msg.startsWith(agent)) return color;
  }
  return "#6b7869";
}

function agentName(msg: string): string {
  for (const agent of Object.keys(AGENT_COLORS)) {
    if (msg.startsWith(agent)) return agent.toUpperCase();
  }
  return "SYSTEM";
}

export function AgentConversations() {
  const [messages, setMessages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const data = await getActivityStream();
        if (active) setMessages(data.messages ?? []);
      } catch {
        // backend not reachable — keep current state
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [messages]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto fade-scroll-y px-4 py-2">
      {messages.length === 0 && (
        <div className="text-center text-[10px] text-[#6b7869] py-4 font-mono">
          No agent activity yet. Interact with the dashboard to generate activity.
        </div>
      )}
      <div className="space-y-1.5">
        {messages.map((msg, i) => {
          const name = agentName(msg);
          const color = agentColor(msg);
          return (
            <div
              key={i}
              className="bg-white border border-[#d4dbc8] p-2 transition-colors hover:border-[#16a34a]/40"
            >
              <div className="flex items-start gap-2">
                <span
                  className="font-mono text-[8px] font-bold px-1 py-0.5 tracking-wider flex-shrink-0"
                  style={{ color, background: `${color}15` }}
                >
                  {name}
                </span>
                <span className="font-mono text-[10px] text-[#52665e] leading-relaxed">
                  {msg}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
