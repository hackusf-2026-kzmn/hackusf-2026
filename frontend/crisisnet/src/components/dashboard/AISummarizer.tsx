"use client";

import { useState } from "react";

interface SummaryEntry {
  question: string;
  answer: string;
}

const INITIAL_SUMMARY: SummaryEntry[] = [
  {
    question: "Current threat summary",
    answer:
      "Category 3 hurricane approaching Tampa Bay with projected landfall in 18-24 hours. Storm surge of 8-12 ft expected along Pinellas County coastline. Flash flood watch active for Hillsborough River watershed. 42,000 residents in primary impact zone. 5 agents actively monitoring across 6 events.",
  },
];

export function AISummarizer() {
  const [entries, setEntries] = useState<SummaryEntry[]>(INITIAL_SUMMARY);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const MOCK_ANSWERS: Record<string, string> = {
    shelter:
      "12 Red Cross shelters are active in Hillsborough County. Hillsborough HS is at 120% capacity; overflow is being routed to Middleton HS (42% capacity). Transport assistance available via 211.",
    evacuation:
      "Zone A evacuation advisory is in effect for all residents south of Gandy Blvd. Courtney Campbell Causeway is the recommended alternate east-west route. Gandy Blvd is closed due to storm surge debris.",
    resource:
      "4 resource programs are currently deployed: FEMA Individual Assistance, Red Cross Emergency Shelter, Florida Disaster Fund, and Feeding Tampa Bay. 3 additional programs (HUD vouchers, SBA loans, Hillsborough CARES) are on standby.",
    default:
      "Based on current agent data: 6 active events are being tracked, with EVT-001 (Cat 3 hurricane) as the highest priority at severity 8.4/10. All 5 agents are online and processing. The pipeline is cycling every ~94 seconds.",
  };

  const handleAsk = () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let answer = MOCK_ANSWERS.default;
      if (lower.includes("shelter") || lower.includes("capacity"))
        answer = MOCK_ANSWERS.shelter;
      else if (lower.includes("evacuat") || lower.includes("route") || lower.includes("road"))
        answer = MOCK_ANSWERS.evacuation;
      else if (lower.includes("resource") || lower.includes("fema") || lower.includes("program"))
        answer = MOCK_ANSWERS.resource;

      setEntries((prev) => [...prev, { question: q, answer }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="px-4 py-2 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto fade-scroll-y space-y-2 mb-2">
        {entries.map((e, i) => (
          <div key={i} className="space-y-1">
            <div className="font-mono text-[10px] text-[#16a34a] font-medium">
              Q: {e.question}
            </div>
            <div className="bg-white border border-[#d4dbc8] p-2 text-[10px] text-[#52665e] leading-relaxed font-mono">
              {e.answer}
            </div>
          </div>
        ))}
        {loading && (
          <div className="font-mono text-[10px] text-[#6b7869] animate-pulse">
            ⚡ Summarizing agent data...
          </div>
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          className="flex-1 bg-[#f5f7f3] border border-[#d4dbc8] px-2.5 py-2 text-[#111d0f] font-mono text-[10px] outline-none focus:border-[#16a34a] transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask about the situation..."
        />
        <button
          className="px-3 py-2 bg-[#16a34a] text-white font-mono text-[10px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40"
          onClick={handleAsk}
          disabled={loading || !input.trim()}
        >
          ASK
        </button>
      </div>
    </div>
  );
}
