"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/ui/features-section";
import { GridHero } from "@/components/ui/grid-hero-animated";
import { AnimatedTextCycle } from "@/components/ui/animated-text-cycle";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card-effect";
import { AGENT_DEFINITIONS } from "@/lib/agents";
import { useLanguage } from "@/context/LanguageContext";

// Lazy-load globe — skip entirely on mobile
const CobeGlobe = dynamic(
  () => import("@/components/ui/cobe-globe").then((m) => ({ default: m.CobeGlobe })),
  { ssr: false }
);

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

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

const translations = {
  en: {
    tagline: "Multi-Agent Disaster Response · Google ADK",
    cycleWords: ["Real-Time Response.", "Tampa, Florida."],
    sub1: "Agentic Weather Monitoring & Severity Scoring",
    sub2: "Automated Resource Matching for Affected Communities",
    sub3: "Real-Time Alerts via Public Dashboard & API",
    launchDashboard: "Launch Dashboard",
    learnMore: "Learn More",
    stats: [
      { num: "001", value: "5", accent: " Agents", label: "Full Pipeline Automation" },
      { num: "002", value: "ZIP", accent: ".", label: "Single Input to Dashboard" },
      { num: "003", value: "24", accent: "/7", label: "Continuous Weather Monitoring" },
      { num: "004", value: "API", accent: ".", label: "Gov't Alert System Ready" },
    ],
    sectionNum: "002 ————",
    platformCapabilities: "Platform Capabilities",
    nwsFema: "NWS + FEMA + LOCAL NEWS",
    poweredBy: "POWERED BY GOOGLE ADK + GEMINI",
    agentPipeline: "The Agent Pipeline",
    agentCount: "5 SPECIALIZED AGENTS",
    orchestrated: "ORCHESTRATED VIA GOOGLE ADK",
    techStrip: [
      ["Framework", "Next.js + TypeScript"],
      ["AI", "Google ADK + Gemini"],
      ["Data APIs", "NWS · FEMA · Census · NOAA"],
      ["Storage", "SQLite"],
      ["Alerts", "Mailgun"],
    ],
    online: "ONLINE",
    tryItLive: "Try It Live.",
    openDashboard: "Open the Dashboard →",
    agents: [
      { name: "Scout Agent", description: "Monitors NWS, FEMA, and local news feeds for anomalous weather patterns indicating hurricanes, earthquakes, or floods." },
      { name: "Triage Agent", description: "Scores severity via storm category, population density, and historical damage data. Foundation of an ML model." },
      { name: "Resource Agent", description: "Matches local non-profit and government programs to affected individuals by location and eligibility." },
      { name: "Comms Agent", description: "Drafts multilingual alerts via Mailgun and exposes an API for local government emergency systems." },
      { name: "Coordinator Agent", description: "Orchestrates all agents via Google ADK's ParallelAgent, managing sequencing and data handoffs." },
    ],
  },
  es: {
    tagline: "Respuesta Multi-Agente ante Desastres · Google ADK",
    cycleWords: ["Respuesta en Tiempo Real.", "Tampa, Florida."],
    sub1: "Monitoreo Climático Agéntico y Puntuación de Severidad",
    sub2: "Emparejamiento Automático de Recursos para Comunidades Afectadas",
    sub3: "Alertas en Tiempo Real vía Panel Público y API",
    launchDashboard: "Abrir Panel",
    learnMore: "Más Información",
    stats: [
      { num: "001", value: "5", accent: " Agentes", label: "Automatización Completa" },
      { num: "002", value: "ZIP", accent: ".", label: "Entrada Única al Panel" },
      { num: "003", value: "24", accent: "/7", label: "Monitoreo Meteorológico Continuo" },
      { num: "004", value: "API", accent: ".", label: "Sistema de Alertas Listo" },
    ],
    sectionNum: "002 ————",
    platformCapabilities: "Capacidades de la Plataforma",
    nwsFema: "NWS + FEMA + NOTICIAS LOCALES",
    poweredBy: "IMPULSADO POR GOOGLE ADK + GEMINI",
    agentPipeline: "El Pipeline de Agentes",
    agentCount: "5 AGENTES ESPECIALIZADOS",
    orchestrated: "ORQUESTADO VÍA GOOGLE ADK",
    techStrip: [
      ["Marco", "Next.js + TypeScript"],
      ["IA", "Google ADK + Gemini"],
      ["APIs de Datos", "NWS · FEMA · Census · NOAA"],
      ["Almacenamiento", "SQLite"],
      ["Alertas", "Mailgun"],
    ],
    online: "EN LÍNEA",
    tryItLive: "Pruébalo en Vivo.",
    openDashboard: "Abrir el Panel →",
    agents: [
      { name: "Agente Scout", description: "Monitorea NWS, FEMA y noticias locales en busca de patrones climáticos anómalos que indiquen huracanes, terremotos o inundaciones." },
      { name: "Agente Triage", description: "Puntúa la severidad según la categoría de tormenta, densidad poblacional y datos históricos de daños. Base de un modelo de ML." },
      { name: "Agente Resource", description: "Asocia programas de organizaciones sin fines de lucro y del gobierno a los individuos afectados según su ubicación y elegibilidad." },
      { name: "Agente Comms", description: "Redacta alertas multilingüe vía Mailgun y expone una API para sistemas de emergencia del gobierno local." },
      { name: "Agente Coordinator", description: "Orquesta todos los agentes vía ParallelAgent de Google ADK, gestionando la secuenciación y transferencia de datos." },
    ],
  },
};

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const rippleCenterRef = useRef<{ x: number; y: number } | null>(null);
  const ctaRippleCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const t = translations[language];

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
      <section ref={heroRef} className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center px-6 md:px-[60px] py-12 md:py-20 overflow-hidden">
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
          <div className="flex-1 min-w-0 md:max-w-[55%]" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3, 0 0 80px #f5f7f3' }}>
          <div className="font-mono text-[11px] md:text-[15px] text-[#16a34a] tracking-[3px] uppercase mb-4 md:mb-6 flex items-center gap-3">
            <span className="w-6 md:w-10 h-px bg-[#16a34a]" />
            {t.tagline}
          </div>

          <h1 className="font-display font-extrabold text-[clamp(36px,10vw,110px)] leading-[0.92] tracking-[-2px] md:tracking-[-3px] uppercase max-w-[900px] mb-6 md:mb-8">
            <span className="whitespace-nowrap">Crisis-Net</span>
            <br />
            <em className="font-serif italic font-normal text-[#16a34a]">
              <AnimatedTextCycle
                words={t.cycleWords}
                interval={3000}
                className="font-serif italic font-normal text-[#16a34a]"
              />
            </em>
          </h1>

          <div className="font-mono text-[11px] md:text-[15px] text-[#16a34a] tracking-[2px] md:tracking-[3px] uppercase leading-[2] md:leading-[2.2] mb-8 md:mb-12">
            {t.sub1}
            <br />
            {t.sub2}
            <br />
            {t.sub3}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center" style={{ textShadow: 'none' }}>
            <Link
              href="/dashboard"
              className="font-mono text-xs bg-[#16a34a] text-white px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              {t.launchDashboard}
            </Link>
            <Link
              href="/about"
              className="hidden md:inline-block font-mono text-xs bg-[#16a34a] text-white px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              {t.learnMore}
            </Link>
          </div>
          </div>
        </div>

        {/* Globe — hidden on mobile, lazy-loaded */}
        {!isMobile && (
          <div className="absolute right-[-350px] bottom-[-400px] w-[1400px] h-[1400px] z-[5] pointer-events-auto">
            <CobeGlobe speed={0.002} />
          </div>
        )}
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#d4dbc8]">
        {t.stats.map((s, i) => (
          <div
            key={s.num}
            className={`relative px-6 md:px-10 py-6 md:py-10 border-b md:border-b-0 border-[#d4dbc8] ${
              i % 2 === 0 ? "border-r border-[#d4dbc8]" : ""
            } ${i < 2 ? "md:border-r" : ""} ${i === 3 ? "md:border-r-0" : ""}`}
          >
            <span className="absolute top-3 right-4 font-mono text-[11px] md:text-[13px] text-[#6b7869] tracking-wider">
              {s.num}
            </span>
            <div className="font-display text-3xl md:text-5xl font-extrabold tracking-[-2px] leading-none">
              {s.value}
              <span className="text-[#16a34a]">{s.accent}</span>
            </div>
            <div className="font-mono text-[11px] md:text-[15px] text-[#6b7869] mt-2 tracking-wider uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ FEATURES ═══ */}
      <section className="hidden md:block py-16 md:py-32">
        <div className="px-6 md:px-[60px] mb-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end pb-5 border-b border-[#d4dbc8] gap-4">
            <div>
              <div className="font-mono text-[14px] text-[#6b7869] tracking-[2px] mb-2">
                {t.sectionNum}
              </div>
              <div className="font-display text-2xl md:text-4xl font-bold tracking-[-1px] uppercase">
                {t.platformCapabilities}
              </div>
            </div>
            <div className="font-mono text-[12px] md:text-[15px] text-[#6b7869] md:text-right leading-[1.8] tracking-wider">
              {t.nwsFema}
              <br />
              {t.poweredBy}
            </div>
          </div>
        </div>
        <Features lang={language} />
      </section>

      {/* ═══ MARQUEE STRIP ═══ */}
      <div className="overflow-hidden border-t border-b border-[#d4dbc8] py-5">
        <div className="flex animate-marquee-right" style={{ width: "max-content" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`a-${i}`} className="font-display font-extrabold uppercase text-[clamp(22px,2.5vw,36px)] tracking-[-1px] text-[#d4dbc8] whitespace-nowrap px-10">
              CRISIS-NET
            </span>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`b-${i}`} className="font-display font-extrabold uppercase text-[clamp(22px,2.5vw,36px)] tracking-[-1px] text-[#d4dbc8] whitespace-nowrap px-10" aria-hidden>
              CRISIS-NET
            </span>
          ))}
        </div>
      </div>

      {/* ═══ AGENTS GRID ═══ */}
      <section className="px-6 md:px-[60px] py-12 md:py-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-12 pb-5 border-b border-[#d4dbc8] gap-4">
          <div>
            <div className="font-mono text-[14px] text-[#6b7869] tracking-[2px] mb-2">
              003 ————
            </div>
            <div className="font-display text-2xl md:text-4xl font-bold tracking-[-1px] uppercase">
              {t.agentPipeline}
            </div>
          </div>
          <div className="font-mono text-[12px] md:text-[15px] text-[#6b7869] md:text-right leading-[1.8] tracking-wider">
            {t.agentCount}
            <br />
            {t.orchestrated}
          </div>
        </div>

        {/* Desktop: 5-col 3D card grid */}
        {!isMobile ? (
          <div className="grid grid-cols-5 border border-[#d4dbc8] divide-x divide-[#d4dbc8]">
            {AGENT_DEFINITIONS.map((a, i) => (
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
                    {t.agents[i].name}
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    className="text-[15px] text-[#52665e] leading-relaxed flex-1"
                  >
                    {t.agents[i].description}
                  </CardItem>
                  <CardItem
                    translateZ={35}
                    className="mt-4 font-mono text-[14px] text-[#16a34a] tracking-wider flex items-center gap-1.5"
                  >
                    <span className="animate-blink">●</span> {t.online}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        ) : (
          /* Mobile: simple stacked cards, no 3D hover */
          <div className="grid grid-cols-1 gap-0 border border-[#d4dbc8]">
            {AGENT_DEFINITIONS.map((a, i) => (
              <div
                key={a.id}
                className={`bg-white p-5 flex items-start gap-4 ${
                  i < AGENT_DEFINITIONS.length - 1 ? "border-b border-[#d4dbc8]" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {agentIcons[a.icon] ?? a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-[#6b7869] tracking-[2px]">
                      0{i + 1} / 05
                    </span>
                    <span className="font-mono text-[11px] text-[#16a34a] tracking-wider flex items-center gap-1.5">
                      <span className="animate-blink">●</span> {t.online}
                    </span>
                  </div>
                  <div className="font-display text-[16px] font-bold uppercase tracking-tight mb-1.5">
                    {t.agents[i].name}
                  </div>
                  <div className="text-[13px] text-[#52665e] leading-relaxed">
                    {t.agents[i].description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ TECH STRIP ═══ */}
      <div className="flex flex-wrap md:flex-nowrap items-center border-t border-b border-[#d4dbc8]">
        {t.techStrip.map(([label, value], i, arr) => (
          <div
            key={label}
            className={`relative flex-1 min-w-[50%] md:min-w-0 px-5 md:px-8 py-4 md:py-5 font-mono text-[11px] md:text-[13px] text-[#6b7869] tracking-wider text-center md:hover:bg-white md:hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-200 border-b md:border-b-0 ${
              i < arr.length - 1 ? "md:border-r border-[#d4dbc8]" : ""
            } ${i % 2 === 0 && i < arr.length - 1 ? "border-r border-[#d4dbc8] md:border-r" : ""}`}
          >
            <span className="hidden md:block absolute -left-px -top-px size-2 border-l-2 border-t-2 border-[#16a34a]" />
            <span className="hidden md:block absolute -right-px -top-px size-2 border-r-2 border-t-2 border-[#16a34a]" />
            <span className="hidden md:block absolute -left-px -bottom-px size-2 border-l-2 border-b-2 border-[#16a34a]" />
            <span className="hidden md:block absolute -right-px -bottom-px size-2 border-r-2 border-b-2 border-[#16a34a]" />
            <strong className="block text-[#111d0f] font-medium mb-1">
              {value}
            </strong>
            {label}
          </div>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} className="relative px-6 md:px-[60px] py-16 md:py-[120px] text-center">
        <GridHero
          gridColor="#7a9470"
          particleColor="#16a34a"
          gridOpacity={0.22}
          containerRef={ctaRef}
          rippleCenterRef={ctaRippleCenterRef}
          scrollDirection="bl"
        />
        <div className="relative z-10" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3, 0 0 80px #f5f7f3' }}>

          <h2 className="font-display text-[clamp(28px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5">
            {t.tryItLive}
          </h2>
          <Link
            href="/dashboard"
            className="inline-block font-mono text-xs bg-[#16a34a] text-white px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
            style={{ textShadow: 'none' }}
            onMouseEnter={handleCtaButtonHover}
            onMouseLeave={handleCtaButtonLeave}
          >
            {t.openDashboard}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
