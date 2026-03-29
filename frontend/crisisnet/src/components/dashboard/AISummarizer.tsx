"use client";

import { useState, useEffect, useRef } from "react";
import { summarize } from "@/lib/api";

interface SummaryEntry {
  question: string;
  answer: string;
}

export function AISummarizer() {
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async () => {
    setInitialized(true);
    setLoading(true);
    setCooldown(true);
    try {
      const data = await summarize("Summarize all current events and alerts in the Tampa area");
      setEntries([{ question: "Summarize Events", answer: data.answer }]);
    } catch {
      setEntries([{ question: "Summarize Events", answer: "Unable to reach backend — try again later." }]);
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 5000);
    }
  };

  // Scroll to bottom on new entry
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, loading]);

  const handleAsk = async () => {
    if (!input.trim() || loading || cooldown) return;
    const q = input.trim();
    setInput("");
    setLoading(true);
    setCooldown(true);
    try {
      const data = await summarize(q);
      setEntries((prev) => [...prev, { question: q, answer: data.answer }]);
    } catch {
      setEntries((prev) => [...prev, { question: q, answer: "Failed to get response from backend." }]);
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 5000);
    }
  };

  return (
    <div className="px-4 py-2 pb-4 flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto fade-scroll-y space-y-2 mb-2 min-h-0">
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
      </div>

      {loading && (
        <div className="font-mono text-[10px] text-[#6b7869] animate-pulse flex items-center gap-1.5 px-1 py-1">
          <span className="inline-block w-1 h-1 bg-[#16a34a] animate-ping" />
          Summarizing agent data...
        </div>
      )}

      {!initialized ? (
        <button
          className="w-full py-2 mb-4 bg-[#16a34a] text-white font-mono text-[10px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40"
          onClick={handleSummarize}
          disabled={loading}
        >
          📡 Summarize Events
        </button>
      ) : (
        <div className="flex gap-1.5 mb-4">
          <input
            className="flex-1 bg-[#f5f7f3] border border-[#d4dbc8] px-2.5 py-2 text-[#111d0f] font-mono text-[10px] outline-none focus:border-[#16a34a] transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask a follow-up question..."
            disabled={loading}
          />
          <button
            className="px-3 py-2 bg-[#16a34a] text-white font-mono text-[10px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40"
            onClick={handleAsk}
            disabled={loading || cooldown || !input.trim()}
          >
            ASK
          </button>
        </div>
      )}
    </div>
  );
}
