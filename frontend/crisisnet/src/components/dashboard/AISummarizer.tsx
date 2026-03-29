"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { summarize } from "@/lib/api";

const COOLDOWN_MS = 10_000; // 10-second cooldown between requests

interface SummaryEntry {
  question: string;
  answer: string;
}

export function AISummarizer() {
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining
  const scrollRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new entry
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, loading]);

  const startCooldown = useCallback(() => {
    setCooldown(Math.ceil(COOLDOWN_MS / 1000));
  }, []);

  const handleSummarize = async () => {
    if (loading || cooldown > 0) return;
    setLoading(true);
    try {
      const data = await summarize("Summarize all current events and alerts in the Tampa area");
      setEntries([{ question: "Summarize Events", answer: data.answer }]);
    } catch {
      setEntries([{ question: "Summarize Events", answer: "Unable to reach backend — try again later." }]);
    } finally {
      setLoading(false);
      startCooldown();
    }
  };

  const handleAsk = async () => {
    if (!input.trim() || loading || cooldown > 0) return;
    const q = input.trim();
    setInput("");
    setLoading(true);
    try {
      const data = await summarize(q);
      setEntries((prev) => [...prev, { question: q, answer: data.answer }]);
    } catch {
      setEntries((prev) => [...prev, { question: q, answer: "Failed to get response from backend." }]);
    } finally {
      setLoading(false);
      startCooldown();
    }
  };

  const busy = loading || cooldown > 0;

  return (
    <div className="px-4 py-2 pb-6 flex flex-col h-full">
      {entries.length === 0 && !loading ? (
        /* ── Initial state: big SUMMARIZE button ── */
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="font-mono text-[10px] text-[#6b7869] text-center leading-relaxed max-w-[220px]">
            Generate an AI-powered summary of all active alerts and nearby resources.
          </p>
          <button
            className="px-5 py-2.5 bg-[#16a34a] text-white font-mono text-[10px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40"
            onClick={handleSummarize}
            disabled={busy}
          >
            SUMMARIZE EVENTS
          </button>
        </div>
      ) : (
        /* ── Conversation view ── */
        <>
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

          {!loading && cooldown > 0 && (
            <div className="font-mono text-[10px] text-[#6b7869] px-1 py-1">
              Rate limit — ready in {cooldown}s
            </div>
          )}

          <div className="flex gap-1.5">
            <input
              className="flex-1 bg-[#f5f7f3] border border-[#d4dbc8] px-2.5 py-2 text-[#111d0f] font-mono text-[10px] outline-none focus:border-[#16a34a] transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask a follow-up question..."
              disabled={busy}
            />
            <button
              className="px-3 py-2 bg-[#16a34a] text-white font-mono text-[10px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40"
              onClick={handleAsk}
              disabled={busy || !input.trim()}
            >
              ASK
            </button>
          </div>
        </>
      )}
    </div>
  );
}
