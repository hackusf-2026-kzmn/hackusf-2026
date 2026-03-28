"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";

const TECH_STACK = [
  ["Frontend", "Next.js + TypeScript"],
  ["Styling", "Tailwind CSS"],
  ["AI Orchestration", "Google ADK"],
  ["LLM", "Gemini"],
  ["Protocol", "A2A"],
  ["Data Warehouse", "Snowflake"],
  ["Maps", "Leaflet.js"],
  ["Charts", "Recharts"],
];

const STEPS = [
  {
    num: "01",
    title: "Report Received",
    desc: "Distress signal ingested via form, API, or social media scan.",
  },
  {
    num: "02",
    title: "Triage & Classify",
    desc: "Triage Agent classifies severity P1–P3 using NLP and geolocation.",
  },
  {
    num: "03",
    title: "Allocate & Route",
    desc: "Resource and Routing agents match responders and calculate optimal paths.",
  },
  {
    num: "04",
    title: "Coordinate & Alert",
    desc: "Comms Agent drafts alerts. Situation Agent maintains the unified picture.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14">
      {/* Hero */}
      <section className="px-[60px] pt-[100px] pb-[60px] border-b border-[#262626]">
        <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-4">
          ABOUT ————
        </div>
        <h1 className="font-display text-[clamp(36px,5vw,72px)] font-extrabold uppercase tracking-[-2px] max-w-[800px] mb-6 leading-[0.95]">
          Built for Tampa.
          <br />
          Built for{" "}
          <span className="text-[#c8ff00]">Crisis.</span>
        </h1>
        <p className="text-base text-[#888] max-w-[600px] leading-[1.8] font-light">
          CrisisNet is a multi-agent AI system that coordinates disaster
          response in real time. Built at HackUSF 2026, it demonstrates how
          autonomous AI agents can work together to save lives when every
          second counts.
        </p>
      </section>

      {/* Problem / Solution */}
      <div className="grid grid-cols-2 border-b border-[#262626]">
        <div className="p-[60px] border-r border-[#262626]">
          <div className="font-mono text-[10px] text-[#c8ff00] tracking-[2px] uppercase mb-5">
            The Problem
          </div>
          <div className="text-sm text-[#888] leading-[1.8]">
            During Hurricane Milton, emergency coordinators in Tampa Bay
            processed over 500 distress reports manually. Triage decisions were
            delayed. Resources were misallocated. Communication between agencies
            broke down. People waited hours for help that was staged just miles
            away.
          </div>
        </div>
        <div className="p-[60px]">
          <div className="font-mono text-[10px] text-[#c8ff00] tracking-[2px] uppercase mb-5">
            Our Solution
          </div>
          <div className="text-sm text-[#888] leading-[1.8]">
            CrisisNet replaces manual coordination with five specialized AI
            agents that communicate via Google ADK&apos;s A2A protocol. Each
            agent handles one critical function — triage, resource allocation,
            routing, communications, and situational awareness — and they talk
            to each other in real time to produce coordinated responses.
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="px-[60px] pt-[60px]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#262626]">
          <div>
            <div className="font-mono text-[10px] text-[#555] tracking-[2px] mb-2">
              PROCESS ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              How It Works
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-px bg-[#262626] border border-[#262626] mx-0">
        {STEPS.map((s, i) => (
          <div key={s.num} className="relative bg-[#0b0b0b] p-8">
            <div className="font-display text-[40px] font-extrabold text-[#262626] mb-3">
              {s.num}
            </div>
            <div className="font-display text-sm font-bold uppercase mb-2">
              {s.title}
            </div>
            <div className="text-xs text-[#555] leading-relaxed">
              {s.desc}
            </div>
            {i < 3 && (
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 font-mono text-sm text-[#c8ff00] z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tech Stack + Team */}
      <div className="grid grid-cols-2 border-t border-b border-[#262626]">
        <div className="p-[60px] border-r border-[#262626]">
          <div className="font-mono text-[10px] text-[#c8ff00] tracking-[2px] uppercase mb-5">
            Tech Stack
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TECH_STACK.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[9px] text-[#555] tracking-wider mb-0.5">
                  {k.toUpperCase()}
                </div>
                <div className="text-[13px]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-[60px]">
          <div className="font-mono text-[10px] text-[#c8ff00] tracking-[2px] uppercase mb-5">
            The Team
          </div>
          <div className="text-sm text-[#888] leading-[1.8]">
            Built in 24 hours at HackUSF 2026 by a team of four students from
            the University of South Florida, Tampa. Targeting the Google ADK
            sponsor challenge with a focus on measurable social impact.
            <br />
            <br />
            <span className="font-mono text-[11px] text-[#555] tracking-wider">
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
        <p className="text-base text-[#888] max-w-[480px] mx-auto mb-10 leading-relaxed font-light">
          Experience five AI agents responding to a simulated hurricane in
          Tampa Bay.
        </p>
        <Link
          href="/dashboard"
          className="inline-block font-mono text-xs bg-[#c8ff00] text-[#0b0b0b] px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:shadow-[0_0_30px_rgba(200,255,0,0.3)] hover:-translate-y-px transition-all"
        >
          Open Dashboard →
        </Link>
      </section>

      <Footer />
    </div>
  );
}
