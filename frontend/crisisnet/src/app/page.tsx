"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/ui/features-section";
import { GridHero } from "@/components/ui/grid-hero-animated";
import { AnimatedTextCycle } from "@/components/ui/animated-text-cycle";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card-effect";
import { mockAgentStatus } from "@/mock/mockAgentStatus";
import { CobeGlobe } from "@/components/ui/cobe-globe";

const agentIcons: Record<string, React.ReactNode> = {
  scout: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
    </svg>
  ),
  triage: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  resource: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  comms: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.636 18.364a9 9 0 0 1 0-12.728" />
      <path d="M8.464 15.536a5 5 0 0 1 0-7.072" />
      <circle cx="12" cy="12" r="1" />
      <path d="M15.536 8.464a5 5 0 0 1 0 7.072" />
      <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
    </svg>
  ),
  coordinator: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <line x1="9.5" y1="10" x2="5.5" y2="7.5" />
      <line x1="14.5" y1="10" x2="18.5" y2="7.5" />
      <line x1="9.5" y1="14" x2="5.5" y2="16.5" />
      <line x1="14.5" y1="14" x2="18.5" y2="16.5" />
    </svg>
  ),
};



export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const rippleCenterRef = useRef<{ x: number; y: number } | null>(null);
  const ctaRippleCenterRef = useRef<{ x: number; y: number } | null>(null);

  const handleButtonHover = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const sectionRect = heroRef.current.getBoundingClientRect();
    const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    rippleCenterRef.current = {
      x: btnRect.left + btnRect.width / 2 - sectionRect.left,
      y: btnRect.top + btnRect.height / 2 - sectionRect.top,
    };
  }, []);

  const handleButtonLeave = useCallback(() => {
    rippleCenterRef.current = null;
  }, []);

  const handleCtaButtonHover = useCallback((e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const sectionRect = ctaRef.current.getBoundingClientRect();
    const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ctaRippleCenterRef.current = {
      x: btnRect.left + btnRect.width / 2 - sectionRect.left,
      y: btnRect.top + btnRect.height / 2 - sectionRect.top,
    };
  }, []);

  const handleCtaButtonLeave = useCallback(() => {
    ctaRippleCenterRef.current = null;
  }, []);

  return (
    <div className="min-h-screen pt-[70px]">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center px-[60px] py-20 overflow-hidden">
        {/* Animated grid bg */}
        <GridHero
          gridColor="#7a9470"
          particleColor="#16a34a"
          gridOpacity={0.22}
          containerRef={heroRef}
          rippleCenterRef={rippleCenterRef}
          scrollDirection="tr"
          particles={false}
        />
        {/* HUD corners */}
        <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[#16a34a] opacity-30" />
        <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[#16a34a] opacity-30" />
        <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#16a34a] opacity-30" />
        <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#16a34a] opacity-30" />

        <div className="relative z-10 flex items-center">
          <div className="flex-1 min-w-0 max-w-[55%]" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3, 0 0 80px #f5f7f3' }}>
          <div className="font-mono text-[15px] text-[#16a34a] tracking-[3px] uppercase mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-[#16a34a]" />
            Multi-Agent Disaster Response · Google ADK
          </div>

          <h1 className="font-display font-extrabold text-[clamp(48px,8vw,110px)] leading-[0.92] tracking-[-3px] uppercase max-w-[900px] mb-8">
            <span className="whitespace-nowrap">Crisis-Net</span>
            <br />
            <em className="font-serif italic font-normal text-[#16a34a]">
              <AnimatedTextCycle
                words={["Real-Time Response.", "Tampa, Florida."]}
                interval={3000}
                className="font-serif italic font-normal text-[#16a34a]"
              />
            </em>
          </h1>

          <div className="font-mono text-[15px] text-[#16a34a] tracking-[3px] uppercase leading-[2.2] mb-12">
            Agentic Weather Monitoring &amp; Severity Scoring
            <br />
            Automated Resource Matching for Affected Communities
            <br />
            Real-Time Alerts via Public Dashboard &amp; API
          </div>

          <div className="flex gap-3 items-center" style={{ textShadow: 'none' }}>
            <Link
              href="/dashboard"
              className="font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              Launch Dashboard
            </Link>
            <Link
              href="/about"
              className="font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              Learn More
            </Link>
          </div>
          </div>
        </div>

        {/* Globe — anchored to section bottom-right, clipped by overflow-hidden */}
        <div className="absolute right-[-350px] bottom-[-400px] w-[1400px] h-[1400px] z-[5] pointer-events-auto">
          <CobeGlobe speed={0.002} />
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="grid grid-cols-4 border-t border-b border-[#d4dbc8]">
        {[
          { num: "001", value: "5", accent: " Agents", label: "Full Pipeline Automation" },
          { num: "002", value: "ZIP", accent: ".", label: "Single Input to Dashboard" },
          { num: "003", value: "24", accent: "/7", label: "Continuous Weather Monitoring" },
          { num: "004", value: "API", accent: ".", label: "Gov't Alert System Ready" },
        ].map((s, i) => (
          <div
            key={s.num}
            className={`relative px-10 py-10 ${i < 3 ? "border-r border-[#d4dbc8]" : ""}`}
          >
            <span className="absolute top-3 right-4 font-mono text-[13px] text-[#6b7869] tracking-wider">
              {s.num}
            </span>
            <div className="font-display text-5xl font-extrabold tracking-[-2px] leading-none">
              {s.value}
              <span className="text-[#16a34a]">{s.accent}</span>
            </div>
            <div className="font-mono text-[15px] text-[#6b7869] mt-2 tracking-wider uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 md:py-32">
        <div className="px-[60px] mb-12">
          <div className="flex justify-between items-end pb-5 border-b border-[#d4dbc8]">
            <div>
              <div className="font-mono text-[14px] text-[#6b7869] tracking-[2px] mb-2">
                002 ————
              </div>
              <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
                Platform Capabilities
              </div>
            </div>
            <div className="font-mono text-[15px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
              NWS + FEMA + LOCAL NEWS
              <br />
              POWERED BY GOOGLE ADK + GEMINI
            </div>
          </div>
        </div>
        <Features />
      </section>

      {/* ═══ AGENTS GRID ═══ */}
      <section className="px-[60px] py-20 border-t border-[#d4dbc8]">
        <div className="flex justify-between items-end mb-12 pb-5 border-b border-[#d4dbc8]">
          <div>
            <div className="font-mono text-[14px] text-[#6b7869] tracking-[2px] mb-2">
              003 ————
            </div>
            <div className="font-display text-4xl font-bold tracking-[-1px] uppercase">
              The Agent Pipeline
            </div>
          </div>
          <div className="font-mono text-[15px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
            5 SPECIALIZED AGENTS
            <br />
            ORCHESTRATED VIA GOOGLE ADK
          </div>
        </div>

        <div className="grid grid-cols-5 border border-[#d4dbc8] divide-x divide-[#d4dbc8]">
          {mockAgentStatus.map((a, i) => (
            <CardContainer
              key={a.id}
              containerClassName="p-0"
              className="w-full h-full"
            >
              <CardBody className="bg-white p-7 h-[340px] flex flex-col group hover:bg-[#edf1e8] transition-colors w-full">
                <CardItem
                  translateZ={30}
                  className="font-mono text-[14px] text-[#6b7869] tracking-[2px] mb-4 group-hover:text-[#16a34a] transition-colors"
                >
                  0{i + 1} / 05
                </CardItem>
                <CardItem translateZ={50} className="mb-3">
                  {agentIcons[a.icon] ?? a.icon}
                </CardItem>
                <CardItem
                  translateZ={40}
                  className="font-display text-[18px] font-bold uppercase tracking-tight mb-2.5"
                >
                  {a.name}
                </CardItem>
                <CardItem
                  translateZ={20}
                  className="text-[15px] text-[#52665e] leading-relaxed flex-1"
                >
                  {a.description}
                </CardItem>
                <CardItem
                  translateZ={35}
                  className="mt-4 font-mono text-[14px] text-[#16a34a] tracking-wider flex items-center gap-1.5"
                >
                  <span className="animate-blink">●</span> ONLINE
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* ═══ TECH STRIP ═══ */}
      <div className="flex items-center border-t border-b border-[#d4dbc8]">
        {[
          ["Framework", "Next.js + TypeScript"],
          ["AI", "Google ADK + Gemini"],
          ["Data APIs", "NWS · FEMA · Census · NOAA"],
          ["Storage", "SQLite"],
          ["Alerts", "Mailgun"],
        ].map(([label, value], i, arr) => (
          <div
            key={label}
            className={`relative flex-1 px-8 py-5 font-mono text-[13px] text-[#6b7869] tracking-wider text-center ${
              i < arr.length - 1 ? "border-r border-[#d4dbc8]" : ""
            }`}
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

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} className="relative px-[60px] py-[120px] text-center">
        <GridHero
          gridColor="#7a9470"
          particleColor="#16a34a"
          gridOpacity={0.22}
          containerRef={ctaRef}
          rippleCenterRef={ctaRippleCenterRef}
          scrollDirection="bl"
        />
        <div className="relative z-10" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3, 0 0 80px #f5f7f3' }}>

          <h2 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5">
            Try It Live.
          </h2>
          <Link
            href="/dashboard"
            className="inline-block font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
            style={{ textShadow: 'none' }}
            onMouseEnter={handleCtaButtonHover}
            onMouseLeave={handleCtaButtonLeave}
          >
            Open the Dashboard →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
