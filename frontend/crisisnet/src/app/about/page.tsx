"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";

const TECH_STACK = [
  ["Frontend", "Next.js + TypeScript"],
  ["Styling", "Tailwind CSS"],
  ["AI Orchestration", "Google ADK + Gemini"],
  ["Agents", "Scout · Triage · Resource · Comms · Coord"],
  ["Weather Data", "NWS + NOAA + FEMA APIs"],
  ["Population Data", "US Census API"],
  ["Alerts", "Mailgun"],
  ["Storage", "SQLite"],
];

const STEPS = [
  {
    num: "01",
    title: "Scout & Detect",
    desc: "Scout Agent monitors NWS, FEMA, and local news/social feeds for anomalous weather and active disaster events.",
  },
  {
    num: "02",
    title: "Score & Triage",
    desc: "Triage Agent scores severity using storm category, population density (Census), and NOAA historical damage data.",
  },
  {
    num: "03",
    title: "Match Support",
    desc: "Resource Agent identifies and matches FEMA, state, and non-profit assistance programs to affected zip codes.",
  },
  {
    num: "04",
    title: "Alert & Coordinate",
    desc: "Comms Agent sends multilingual alerts via Mailgun. Coordinator orchestrates the full pipeline via Google ADK ParallelAgent.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14">
      {/* Hero */}
      <section className="px-[60px] pt-[100px] pb-[60px] border-b border-[#d4dbc8]">
        <div className="font-mono text-[10px] text-[#6b7869] tracking-[2px] mb-4">
          ABOUT ————
        </div>
        <h1 className="font-display text-[clamp(36px,5vw,72px)] font-extrabold uppercase tracking-[-2px] max-w-[800px] mb-6 leading-[0.95]">
          Built for Tampa.
          <br />
          Built for{" "}
          <span className="text-[#16a34a]">Crisis.</span>
        </h1>
        <p className="text-base text-[#52665e] max-w-[600px] leading-[1.8] font-light">
          CrisisNet is a multi-agent AI system built to assist the people who prevent
          harm during environmental disasters. It continuously scans for anomalous weather,
          scores severity, matches affected populations to local and federal support programs,
          and publishes everything through a public dashboard and API — all from a zip code.
        </p>
      </section>

      {/* Problem / Solution */}
      <div className="grid grid-cols-2 border-b border-[#d4dbc8]">
        <div className="p-[60px] border-r border-[#d4dbc8]">
          <div className="font-mono text-[10px] text-[#16a34a] tracking-[2px] uppercase mb-5">
            The Problem
          </div>
          <div className="text-sm text-[#52665e] leading-[1.8]">
            During large-scale disasters, emergency coordinators and support
            workers manually process hundreds of reports. Triage decisions are
            delayed. Victims don&apos;t know what programs exist for them. Communication
            between agencies breaks down. People wait hours for help that
            exists but isn&apos;t reaching them.
          </div>
        </div>
        <div className="p-[60px]">
          <div className="font-mono text-[10px] text-[#16a34a] tracking-[2px] uppercase mb-5">
            Our Solution
          </div>
          <div className="text-sm text-[#52665e] leading-[1.8]">
            CrisisNet is an agentic companion to the people who prevent harm.
            Five specialized agents — Scout, Triage, Resource, Comms, and
            Coordinator — work in a pipeline orchestrated via Google ADK&apos;s
            ParallelAgent. A Scout finds threats, Triage scores impact, Resource
            matches programs to zip codes, and Comms publishes multilingual
            alerts. All triggered by a zip code input.
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="px-[60px] pt-[60px]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#d4dbc8]">
          <div>
            <div className="font-mono text-[10px] text-[#6b7869] tracking-[2px] mb-2">
              PROCESS ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              How It Works
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-px bg-[#d4dbc8] border border-[#d4dbc8] mx-0">
        {STEPS.map((s, i) => (
          <div key={s.num} className="relative bg-white p-8">
            <div className="font-display text-[40px] font-extrabold text-[#e0e5d8] mb-3">
              {s.num}
            </div>
            <div className="font-display text-sm font-bold uppercase mb-2 text-[#111d0f]">
              {s.title}
            </div>
            <div className="text-xs text-[#6b7869] leading-relaxed">
              {s.desc}
            </div>
            {i < 3 && (
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 font-mono text-sm text-[#16a34a] z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tech Stack + Team */}
      <div className="grid grid-cols-2 border-t border-b border-[#d4dbc8]">
        <div className="p-[60px] border-r border-[#d4dbc8]">
          <div className="font-mono text-[10px] text-[#16a34a] tracking-[2px] uppercase mb-5">
            Tech Stack
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TECH_STACK.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[9px] text-[#6b7869] tracking-wider mb-0.5">
                  {k.toUpperCase()}
                </div>
                <div className="text-[13px]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-[60px]">
          <div className="font-mono text-[10px] text-[#16a34a] tracking-[2px] uppercase mb-5">
            The Team
          </div>
          <div className="text-sm text-[#52665e] leading-[1.8]">
            Built in 24 hours at HackUSF 2026 by a team of four students from
            the University of South Florida, Tampa. Targeting the Google ADK
            sponsor challenge with a focus on measurable social impact.
            <br />
            <br />
            <span className="font-mono text-[11px] text-[#6b7869] tracking-wider">
              HACKUSF 2026 · TAMPA, FL · &quot;BUILD WITH AI&quot;
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="px-[60px] py-20 text-center">
        <h2 className="font-display text-[40px] font-extrabold uppercase tracking-[-2px] mb-5">
          Ready to See It?
        </h2>
          <p className="text-base text-[#52665e] max-w-[480px] mx-auto mb-10 leading-relaxed font-light">
          Experience five AI agents responding to a simulated hurricane in
          Tampa Bay.
        </p>
        <Link
          href="/dashboard"
          className="inline-block font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:-translate-y-px transition-all"
        >
          Open Dashboard →
        </Link>
      </section>

      <Footer />
    </div>
  );
}
