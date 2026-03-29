"use client";

import { useState, useEffect, useRef } from "react";

interface SummaryEntry {
  question: string;
  answer: string;
}

const MOCK_ANSWERS: Record<string, string> = {
  shelter:
    "12 Red Cross shelters are active in Hillsborough County. Hillsborough HS is at 120% capacity; overflow is being routed to Middleton HS (42% capacity). Transport assistance available via 211.",
  evacuation:
    "Zone A evacuation advisory is in effect for all residents south of Gandy Blvd. Courtney Campbell Causeway is the recommended alternate east-west route. Gandy Blvd is closed due to storm surge debris.",
  resource:
    "4 resource programs are currently deployed: FEMA Individual Assistance, Red Cross Emergency Shelter, Florida Disaster Fund, and Feeding Tampa Bay. 3 additional programs (HUD vouchers, SBA loans, Hillsborough CARES) are on standby.",
  summarize:
    "Category 3 hurricane approaching Tampa Bay — projected landfall 18-24 hrs. Storm surge 8-12 ft expected along Pinellas coastline. Flash flood watch active for Hillsborough River watershed. 42,000 residents in primary impact zone. 5 agents actively monitoring across 6 events.\n\n• EVT-001 (P1): Cat 3 hurricane — severity 8.4/10\n• EVT-002 (P1): Storm surge, Pinellas — 8-12 ft\n• EVT-003 (P2): Flash flooding, Hillsborough River\n• EVT-004 (P3): Power grid instability — 12,000 homes\n• EVT-005 (P2): Road closures — Gandy Blvd corridor\n• EVT-006 (P3): Shelter overflow — Hillsborough HS\n\nAll 5 agents online. Pipeline cycle: ~94s. Last resource match: FEMA + Red Cross for zip 33602.",
  default:
    "Based on current agent data: 6 active events are being tracked, with EVT-001 (Cat 3 hurricane) as the highest priority at severity 8.4/10. All 5 agents are online and processing. The pipeline is cycling every ~94 seconds.",
};

function matchAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("summarize") || lower.includes("summary") || lower.includes("overview"))
    return MOCK_ANSWERS.summarize;
  if (lower.includes("shelter") || lower.includes("capacity"))
    return MOCK_ANSWERS.shelter;
  if (lower.includes("evacuat") || lower.includes("route") || lower.includes("road"))
    return MOCK_ANSWERS.evacuation;
  if (lower.includes("resource") || lower.includes("fema") || lower.includes("program"))
    return MOCK_ANSWERS.resource;
  return MOCK_ANSWERS.default;
}

export function AISummarizer() {
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-run "Summarize Events" on mount
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    setLoading(true);
    const t = setTimeout(() => {
      setEntries([{ question: "Summarize Events", answer: MOCK_ANSWERS.summarize }]);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [initialized]);

  // Scroll to bottom on new entry
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, loading]);

  const handleAsk = () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setEntries((prev) => [...prev, { question: q, answer: matchAnswer(q) }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="px-4 py-2 flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto fade-scroll-y space-y-2 mb-2">
        {entries.map((e, i) => (
          <div key={i} className="space-y-1">
            <div className="font-mono text-[10px] text-[#16a34a] font-medium">
              Q: {e.question}
            </div>
            <div className="bg-white border border-[#d4dbc8] p-2 text-[10px] text-[#52665e] leading-relaxed font-mono whitespace-pre-line">
              {e.answer}
            </div>
          </div>
        ))}
        {loading && (
          <div className="font-mono text-[10px] text-[#6b7869] animate-pulse flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 bg-[#16a34a] animate-ping" />
            Summarizing agent data...
          </div>
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          className="flex-1 bg-[#f5f7f3] border border-[#d4dbc8] px-2.5 py-2 text-[#111d0f] font-mono text-[10px] outline-none focus:border-[#16a34a] transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder={entries.length > 0 ? "Ask a follow-up question..." : "Summarizing events..."}
          disabled={loading}
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
