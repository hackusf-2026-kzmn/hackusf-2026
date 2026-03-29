"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ParticlesBg } from "@/components/ui/particles-bg";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card-effect";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { Search, Activity, Link2, Radio, Cpu } from "lucide-react";

const TECH_STACK = [
  ["Frontend", "Next.js + TypeScript"],
  ["Styling", "Tailwind CSS"],
  ["AI Orchestration", "Google ADK + Gemini"],
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Score & Triage",
    desc: "Triage Agent scores severity using storm category, population density (Census), and NOAA historical damage data.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Match Support",
    desc: "Resource Agent identifies and matches FEMA, state, and non-profit assistance programs to affected zip codes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Alert & Coordinate",
    desc: "Comms Agent sends multilingual alerts via Mailgun. Coordinator orchestrates the full pipeline via Google ADK ParallelAgent.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.636 18.364a9 9 0 0 1 0-12.728" />
        <path d="M8.464 15.536a5 5 0 0 1 0-7.072" />
        <circle cx="12" cy="12" r="1" />
        <path d="M15.536 8.464a5 5 0 0 1 0 7.072" />
        <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
      </svg>
    ),
  },
];

const METRICS = [
  { num: "001", value: "~94", accent: "s", label: "Full Pipeline Cycle" },
  { num: "002", value: "5", accent: " Agents", label: "Specialized AI Workers" },
  { num: "003", value: "6", accent: "+", label: "Government Data Sources" },
];

const AGENT_TIMELINE = [
  {
    id: 1,
    title: "Scout",
    date: "Stage 1",
    content:
      "Monitors NWS, FEMA, and local news/social feeds for anomalous weather and active disaster events in real-time.",
    category: "Detection",
    icon: Search,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Triage",
    date: "Stage 2",
    content:
      "Scores severity using storm category, population density (Census), and NOAA historical damage data.",
    category: "Analysis",
    icon: Activity,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Resource",
    date: "Stage 3",
    content:
      "Identifies and matches FEMA, state, and non-profit assistance programs to affected zip codes.",
    category: "Matching",
    icon: Link2,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Comms",
    date: "Stage 4",
    content:
      "Sends multilingual alerts via Mailgun to affected communities with actionable guidance.",
    category: "Alerts",
    icon: Radio,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 5,
    title: "Coordinator",
    date: "Orchestrator",
    content:
      "Orchestrates the full agent pipeline via Google ADK ParallelAgent, managing sequencing and fallbacks.",
    category: "Orchestration",
    icon: Cpu,
    relatedIds: [1, 2, 3, 4],
    status: "pending" as const,
    energy: 60,
  },
];

export default function AboutPage() {

  return (
    <div className="min-h-screen pt-[70px]">
      {/* ═══ HERO ═══ */}
      <section className="relative px-[60px] pt-[100px] pb-[60px] overflow-hidden border-b border-[#d4dbc8]">
        <ParticlesBg />
        {/* HUD corners */}
        <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[#16a34a] opacity-30" />
        <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[#16a34a] opacity-30" />
        <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#16a34a] opacity-30" />
        <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#16a34a] opacity-30" />

        <div className="relative z-10 text-center pointer-events-none" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3' }}>
          <h1 className="font-display font-extrabold text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-2px] uppercase mb-6">
            What we&apos;re about.
          </h1>

          <div className="font-mono text-[16px] text-[#6b7869] tracking-[2px] uppercase leading-[2]" style={{ textShadow: '0 0px 5px rgb(255, 255, 255)' }}>
            AI-powered disaster response.
            <br />
            Built for Tampa.
          </div>

          <Link
            href="/dashboard"
            className="inline-block mt-10 font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto"
            style={{ textShadow: 'none' }}
          >
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* ═══ METRICS BAR ═══ */}
      <div className="grid grid-cols-3 border-b border-[#d4dbc8]">
        {METRICS.map((s, i) => (
          <div
            key={s.num}
            className={`relative px-10 py-10 ${i < 2 ? "border-r border-[#d4dbc8]" : ""}`}
          >
            <span className="absolute top-3 right-4 font-mono text-[13px] text-[#6b7869] tracking-wider">
              {s.num}
            </span>
            <div className="font-display text-5xl font-extrabold tracking-[-2px] leading-none">
              {s.value}
              <span className="text-[#16a34a]">{s.accent}</span>
            </div>
            <div className="font-mono text-[16px] text-[#6b7869] mt-2 tracking-wider uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ PROBLEM / SOLUTION ═══ */}
      <div className="grid grid-cols-2 border-b border-[#d4dbc8]">
        <div className="relative p-[60px] border-r border-[#d4dbc8] group hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.9)] transition-all duration-200">
          <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -left-px -bottom-px block size-2 border-l-2 border-b-2 border-[#16a34a]" />
          <span className="absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 border-[#16a34a]" />
          <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[#16a34a]" />
            The Problem
          </div>
          <div className="font-display text-lg font-bold uppercase tracking-tight mb-4 text-[#111d0f]">
            Disasters Outpace Human Coordination
          </div>
          <div className="text-[18px] text-[#52665e] leading-[1.8]">
            During large-scale disasters, emergency coordinators and support
            workers manually process hundreds of reports. Triage decisions are
            delayed. Victims don&apos;t know what programs exist for them. Communication
            between agencies breaks down. People wait hours for help that
            exists but isn&apos;t reaching them.
          </div>
        </div>
        <div className="relative p-[60px] group hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.9)] transition-all duration-200">
          <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -left-px -bottom-px block size-2 border-l-2 border-b-2 border-[#16a34a]" />
          <span className="absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 border-[#16a34a]" />
          <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[#16a34a]" />
            Our Solution
          </div>
          <div className="font-display text-lg font-bold uppercase tracking-tight mb-4 text-[#111d0f]">
            Five Agents, One Pipeline, Zero Delay
          </div>
          <div className="text-[18px] text-[#52665e] leading-[1.8]">
            Crisis-Net is an agentic companion to the people who prevent harm.
            Five specialized agents — Scout, Triage, Resource, Comms, and
            Coordinator — work in a pipeline orchestrated via Google ADK&apos;s
            ParallelAgent. A Scout finds threats, Triage scores impact, Resource
            matches programs to zip codes, and Comms publishes multilingual
            alerts. All triggered by a zip code input.
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-[60px] py-20 border-b border-[#d4dbc8]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#d4dbc8]">
          <div>
            <div className="font-mono text-[15px] text-[#6b7869] tracking-[2px] mb-2">
              002 ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              How It Works
            </div>
          </div>
          <div className="font-mono text-[16px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
            5 SPECIALIZED AGENTS
            <br />
            GOOGLE ADK ORCHESTRATION
          </div>
        </div>

        <div className="flex">
          {/* Left: 2×2 cards */}
          <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-px bg-[#d4dbc8] border border-[#d4dbc8]">
            {STEPS.map((s, i) => (
              <CardContainer
                key={s.num}
                containerClassName="p-0 h-full"
                className="w-full h-full"
              >
                <CardBody className="bg-white p-8 flex flex-col group hover:bg-[#edf1e8] transition-colors w-full h-full relative">
                  <CardItem
                    translateZ={30}
                    className="font-mono text-[15px] text-[#6b7869] tracking-[2px] mb-4 group-hover:text-[#16a34a] transition-colors"
                  >
                    0{i + 1} / 04
                  </CardItem>
                  <CardItem translateZ={50} className="mb-3">
                    {s.icon}
                  </CardItem>
                  <CardItem
                    translateZ={40}
                    className="font-display text-[18px] font-bold uppercase tracking-tight mb-2.5"
                  >
                    {s.title}
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    className="text-sm text-[#52665e] leading-relaxed flex-1"
                  >
                    {s.desc}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>

          {/* Right: Orbital Timeline */}
          <div className="w-1/2 min-h-[520px] relative border border-[#d4dbc8] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-200">
            <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-[#16a34a] z-10" />
            <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-[#16a34a] z-10" />
            <span className="absolute -left-px -bottom-px block size-2 border-l-2 border-b-2 border-[#16a34a] z-10" />
            <span className="absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 border-[#16a34a] z-10" />
            <RadialOrbitalTimeline timelineData={AGENT_TIMELINE} />
          </div>
        </div>
      </section>

      {/* ═══ TECH STRIP (infinite scroll) ═══ */}
      <div className="overflow-hidden border-b border-[#d4dbc8]">
        <div className="flex w-max animate-marquee">
          {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map(([label, value], i) => (
            <div
              key={`${label}-${i}`}
              className="relative flex-shrink-0 w-[200px] px-6 py-5 font-mono text-[16px] text-[#6b7869] tracking-wider text-center border-r border-[#d4dbc8] hover:bg-white transition-colors"
            >
              <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-[#16a34a]" />
              <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-[#16a34a]" />
              <span className="absolute -left-px -bottom-px block size-2 border-l-2 border-b-2 border-[#16a34a]" />
              <span className="absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 border-[#16a34a]" />
              <strong className="block text-[#111d0f] font-medium mb-1">
                {value}
              </strong>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TEAM ═══ */}
      <section className="px-[60px] py-20 border-b border-[#d4dbc8]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#d4dbc8]">
          <div>
            <div className="font-mono text-[15px] text-[#6b7869] tracking-[2px] mb-2">
              003 ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              The Team
            </div>
          </div>
          <div className="font-mono text-[15px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
            UNIVERSITY OF SOUTH FLORIDA
            <br />
            HACKUSF 2026 · TAMPA, FL
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#d4dbc8]">
          <div className="bg-white p-10">
            <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#16a34a]" />
              Mission
            </div>
            <div className="text-[18px] text-[#52665e] leading-[1.8]">
              When disaster strikes, the most vulnerable communities are the last
              to receive help. Crisis-Net exists to close that gap — ensuring that
              every affected person is seen, scored for urgency, and connected to
              the right resources within minutes, not hours. We believe no one
              should have to navigate a crisis alone.
            </div>
          </div>
          <div className="bg-white p-10">
            <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#16a34a]" />
              Philosophy
            </div>
            <div className="text-[18px] text-[#52665e] leading-[1.8]">
              Crisis-Net isn&apos;t designed to replace emergency workers, it&apos;s built
              to amplify them. Every agent in the pipeline exists to handle a task
              that currently costs minutes of human attention during moments when
              seconds matter. The system is transparent, auditable, and always
              human-in-the-loop.
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="font-mono text-[15px] text-[#6b7869] tracking-[2px]">
            HACKUSF 2026 · TAMPA, FL · &quot;BUILD WITH AI&quot;
          </span>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative px-[60px] py-[120px] text-center overflow-hidden">
        <ParticlesBg />
        <div className="relative z-10 pointer-events-none" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3' }}>
          <h2 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5">
            Ready to See It?
          </h2>
          <Link
            href="/dashboard"
            className="inline-block font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto"
            style={{ textShadow: 'none' }}
          >
            Open Dashboard →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
