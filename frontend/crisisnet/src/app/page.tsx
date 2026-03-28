"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { WorldMap } from "@/components/ui/world-map";
import { mockAgentStatus } from "@/mock/mockAgentStatus";

// CrisisNet global response network connections
const CRISIS_CONNECTIONS = [
  {
    start: { lat: 27.95, lng: -82.46, label: "Tampa" },
    end: { lat: 25.76, lng: -80.19, label: "Miami" },
  },
  {
    start: { lat: 27.95, lng: -82.46, label: "Tampa" },
    end: { lat: 38.9, lng: -77.04, label: "D.C." },
  },
  {
    start: { lat: 38.9, lng: -77.04, label: "D.C." },
    end: { lat: 51.51, lng: -0.13, label: "London" },
  },
  {
    start: { lat: 51.51, lng: -0.13, label: "London" },
    end: { lat: 28.61, lng: 77.21, label: "New Delhi" },
  },
  {
    start: { lat: 28.61, lng: 77.21, label: "New Delhi" },
    end: { lat: 35.68, lng: 139.69, label: "Tokyo" },
  },
  {
    start: { lat: 27.95, lng: -82.46, label: "Tampa" },
    end: { lat: -22.91, lng: -43.17, label: "Rio" },
  },
  {
    start: { lat: 51.51, lng: -0.13, label: "London" },
    end: { lat: -1.29, lng: 36.82, label: "Nairobi" },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pt-14">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col justify-center px-[60px] py-20 overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* HUD corners */}
        <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[#c8ff00] opacity-30" />
        <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[#c8ff00] opacity-30" />
        <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#c8ff00] opacity-30" />
        <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#c8ff00] opacity-30" />

        <div className="relative z-10">
          <div className="font-mono text-[11px] text-[#c8ff00] tracking-[3px] uppercase mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-[#c8ff00]" />
            Multi-Agent Disaster Response · Google ADK
          </div>

          <h1 className="font-display font-extrabold text-[clamp(48px,8vw,110px)] leading-[0.92] tracking-[-3px] uppercase max-w-[900px] mb-8">
            Detect Risk.
            <br />
            Match{" "}
            <em className="font-serif italic font-normal text-[#c8ff00]">
              Support.
            </em>
            <br />
            Alert Fast.
          </h1>

          <p className="text-base text-[#888] max-w-[560px] leading-relaxed font-light mb-12">
            CrisisNet is an agentic system built to assist the people who prevent
            harm during environmental disasters — continuously scanning for
            anomalous weather, scoring severity, matching affected populations to
            local and federal support programs, and publishing it all through a
            public dashboard and API.
          </p>

          <div className="flex gap-3 items-center">
            <Link
              href="/dashboard"
              className="font-mono text-xs bg-[#c8ff00] text-[#0b0b0b] px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:shadow-[0_0_30px_rgba(200,255,0,0.3)] hover:-translate-y-px transition-all"
            >
              Launch Dashboard
            </Link>
            <Link
              href="/about"
              className="font-mono text-xs text-white px-8 py-3.5 border border-[#262626] tracking-[1.5px] uppercase hover:border-white transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Meta corner */}
        <div className="absolute bottom-10 right-[60px] font-mono text-[10px] text-[#555] text-right leading-[1.8] tracking-wider">
          HACKUSF 2026
          <br />
          TAMPA, FL
          <br />
          BUILD WITH AI
          <br />
          <span className="text-[#c8ff00]">V1.0.0</span>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="grid grid-cols-4 border-t border-b border-[#262626]">
        {[
          { num: "001", value: "5", accent: " Agents", label: "Full Pipeline Automation" },
          { num: "002", value: "ZIP", accent: ".", label: "Single Input to Dashboard" },
          { num: "003", value: "24", accent: "/7", label: "Continuous Weather Monitoring" },
          { num: "004", value: "API", accent: ".", label: "Gov't Alert System Ready" },
        ].map((s, i) => (
          <div
            key={s.num}
            className={`relative px-10 py-10 ${i < 3 ? "border-r border-[#262626]" : ""}`}
          >
            <span className="absolute top-3 right-4 font-mono text-[9px] text-[#555] tracking-wider">
              {s.num}
            </span>
            <div className="font-display text-5xl font-extrabold tracking-[-2px] leading-none">
              {s.value}
              <span className="text-[#c8ff00]">{s.accent}</span>
            </div>
            <div className="font-mono text-[11px] text-[#555] mt-2 tracking-wider uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ WORLD MAP ═══ */}
      <section className="px-[60px] py-20">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#262626]">
          <div>
            <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-2">
              002 ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              Disaster Monitoring Network
            </div>
          </div>
          <div className="font-mono text-[11px] text-[#555] text-right leading-[1.8] tracking-wider">
            NWS + FEMA + LOCAL NEWS
            <br />
            POWERED BY GOOGLE ADK + GEMINI
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-4 left-5 z-10 font-mono text-[9px] text-[#555] tracking-[2px]">
            CRISISNET ACTIVE MONITORING ZONES
          </div>
          <div className="absolute top-4 right-5 z-10 font-mono text-[9px] text-[#c8ff00] tracking-[2px] flex items-center gap-1.5">
            <span className="animate-blink">●</span> LIVE
          </div>
          <WorldMap
            dots={CRISIS_CONNECTIONS}
            lineColor="#c8ff00"
            animationDuration={2.5}
          />
        </div>
      </section>

      {/* ═══ AGENTS GRID ═══ */}
      <section className="px-[60px] py-20 border-t border-[#262626]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#262626]">
          <div>
            <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-2">
              003 ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              The Agent Network
            </div>
          </div>
          <div className="font-mono text-[11px] text-[#555] text-right leading-[1.8] tracking-wider">
            5 SPECIALIZED AGENTS
            <br />
            COORDINATING VIA A2A
          </div>
        </div>

        <div className="grid grid-cols-5 gap-px bg-[#262626] border border-[#262626]">
          {mockAgentStatus.map((a, i) => (
            <div
              key={a.id}
              className="bg-[#0b0b0b] p-7 min-h-[240px] flex flex-col group hover:bg-[#141414] transition-colors"
            >
              <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-4 group-hover:text-[#c8ff00] transition-colors">
                0{i + 1} / 05
              </div>
              <div className="text-2xl mb-3">{a.icon}</div>
              <div className="font-display text-[15px] font-bold uppercase tracking-tight mb-2.5">
                {a.name}
              </div>
              <div className="text-xs text-[#888] leading-relaxed flex-1">
                {a.description}
              </div>
              <div className="mt-4 font-mono text-[10px] text-[#c8ff00] tracking-wider flex items-center gap-1.5">
                <span className="animate-blink">●</span> ONLINE
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TECH STRIP ═══ */}
      <div className="flex items-center border-t border-b border-[#262626]">
        {[
          ["Framework", "Next.js + TypeScript"],
          ["AI", "Google ADK + Gemini"],
          ["Protocol", "A2A (Agent-to-Agent)"],
          ["Data", "Snowflake"],
          ["Map", "Leaflet.js"],
        ].map(([label, value], i, arr) => (
          <div
            key={label}
            className={`flex-1 px-8 py-5 font-mono text-xs text-[#555] tracking-wider text-center ${
              i < arr.length - 1 ? "border-r border-[#262626]" : ""
            }`}
          >
            <strong className="block text-white font-medium mb-1">
              {value}
            </strong>
            {label}
          </div>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section className="relative px-[60px] py-[120px] text-center">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-4">
            004 ————
          </div>
          <h2 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5">
            See It Live.
          </h2>
          <p className="text-base text-[#888] max-w-[480px] mx-auto mb-10 leading-relaxed font-light">
            Watch five AI agents coordinate a disaster response in real time.
            Tampa Bay. Hurricane aftermath. 90 seconds.
          </p>
          <Link
            href="/dashboard"
            className="inline-block font-mono text-xs bg-[#c8ff00] text-[#0b0b0b] px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:shadow-[0_0_30px_rgba(200,255,0,0.3)] hover:-translate-y-px transition-all"
          >
            Open the Dashboard →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
