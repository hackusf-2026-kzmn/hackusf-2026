"use client";

import { useState, useEffect } from "react";
import { mockAgentStatus } from "@/mock/mockAgentStatus";

interface AgentState {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  actions: string[];
  currentAction: string;
  actionIndex: number;
  flash: boolean;
}

export function AgentPanel() {
  const [agents, setAgents] = useState<AgentState[]>(
    mockAgentStatus.map((a) => ({
      ...a,
      currentAction: a.actions[0],
      actionIndex: 0,
      flash: false,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((a, i) => {
          if (i !== idx) return { ...a, flash: false };
          const next = (a.actionIndex + 1) % a.actions.length;
          return {
            ...a,
            actionIndex: next,
            currentAction: a.actions[next],
            flash: true,
          };
        });
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
      <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#16a34a]" />
        Agent Activity
      </div>

      {agents.map((a) => (
        <div
          key={a.id}
          className={`bg-white border p-3 mb-1.5 transition-all duration-250 relative ${
            a.flash
              ? "border-[#16a34a] shadow-[0_0_10px_rgba(22,163,74,0.1)]"
              : "border-[#d4dbc8] hover:bg-[#edf1e8] hover:border-[#b8c4aa]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span>{a.icon}</span> {a.shortName}
            </div>
            <span className="font-mono text-[9px] px-2 py-0.5 tracking-wider text-[#16a34a] bg-[rgba(22,163,74,0.08)] border border-[rgba(22,163,74,0.2)]">
              ● ACTIVE
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#52665e] leading-relaxed min-h-[32px]">
            {a.currentAction}
          </div>
          <div className="font-mono text-[9px] text-[#6b7869] mt-1">just now</div>
        </div>
      ))}
    </div>
  );
}
