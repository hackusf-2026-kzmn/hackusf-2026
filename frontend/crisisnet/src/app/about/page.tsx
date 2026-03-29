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
import { useLanguage } from "@/context/LanguageContext";

const STEP_ICONS = [
  <svg key="scout" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>,
  <svg key="triage" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
  <svg key="resource" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>,
  <svg key="comms" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.636 18.364a9 9 0 0 1 0-12.728" />
    <path d="M8.464 15.536a5 5 0 0 1 0-7.072" />
    <circle cx="12" cy="12" r="1" />
    <path d="M15.536 8.464a5 5 0 0 1 0 7.072" />
    <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
  </svg>,
];

const TIMELINE_BASE = [
  { id: 1, icon: Search, relatedIds: [2], status: "completed" as const, energy: 100 },
  { id: 2, icon: Activity, relatedIds: [1, 3], status: "completed" as const, energy: 90 },
  { id: 3, icon: Link2, relatedIds: [2, 4], status: "in-progress" as const, energy: 70 },
  { id: 4, icon: Radio, relatedIds: [3, 5], status: "pending" as const, energy: 40 },
  { id: 5, icon: Cpu, relatedIds: [1, 2, 3, 4], status: "pending" as const, energy: 60 },
];

const METRICS_BASE = [
  { num: "001", value: "~94", accent: "s" },
  { num: "002", value: "5", accent: " Agents" },
  { num: "003", value: "6", accent: "+" },
];

const translations = {
  en: {
    hero: {
      title: "What we're about.",
      sub1: "AI-powered disaster response.",
      sub2: "Built for Tampa.",
      cta: "Open Dashboard →",
    },
    metricsLabels: ["Full Pipeline Cycle", "Specialized AI Workers", "Government Data Sources"],
    problem: {
      tag: "The Problem",
      title: "Disasters Outpace Human Coordination",
      body: "During large-scale disasters, emergency coordinators and support workers manually process hundreds of reports. Triage decisions are delayed. Victims don't know what programs exist for them. Communication between agencies breaks down. People wait hours for help that exists but isn't reaching them.",
    },
    solution: {
      tag: "Our Solution",
      title: "Five Agents, One Pipeline, Zero Delay",
      body: "Crisis-Net is an agentic companion to the people who prevent harm. Five specialized agents — Scout, Triage, Resource, Comms, and Coordinator — work in a pipeline orchestrated via Google ADK's ParallelAgent. A Scout finds threats, Triage scores impact, Resource matches programs to zip codes, and Comms publishes multilingual alerts. All triggered by a zip code input.",
    },
    howItWorks: {
      title: "How It Works",
      agents: "5 SPECIALIZED AGENTS",
      orchestration: "GOOGLE ADK ORCHESTRATION",
    },
    steps: [
      { title: "Scout & Detect", desc: "Scout Agent monitors NWS, FEMA, and local news/social feeds for anomalous weather and active disaster events." },
      { title: "Score & Triage", desc: "Triage Agent scores severity using storm category, population density (Census), and NOAA historical damage data." },
      { title: "Match Support", desc: "Resource Agent identifies and matches FEMA, state, and non-profit assistance programs to affected zip codes." },
      { title: "Alert & Coordinate", desc: "Comms Agent sends multilingual alerts via Mailgun. Coordinator orchestrates the full pipeline via Google ADK ParallelAgent." },
    ],
    timeline: [
      { title: "Scout", date: "Stage 1", content: "Monitors NWS, FEMA, and local news/social feeds for anomalous weather and active disaster events in real-time.", category: "Detection" },
      { title: "Triage", date: "Stage 2", content: "Scores severity using storm category, population density (Census), and NOAA historical damage data.", category: "Analysis" },
      { title: "Resource", date: "Stage 3", content: "Identifies and matches FEMA, state, and non-profit assistance programs to affected zip codes.", category: "Matching" },
      { title: "Comms", date: "Stage 4", content: "Sends multilingual alerts via Mailgun to affected communities with actionable guidance.", category: "Alerts" },
      { title: "Coordinator", date: "Orchestrator", content: "Orchestrates the full agent pipeline via Google ADK ParallelAgent, managing sequencing and fallbacks.", category: "Orchestration" },
    ],
    techStack: [
      ["Frontend", "Next.js + TypeScript"],
      ["Styling", "Tailwind CSS"],
      ["AI Orchestration", "Google ADK + Gemini"],
      ["Weather Data", "NWS + NOAA + FEMA APIs"],
      ["Population Data", "US Census API"],
      ["Alerts", "Mailgun"],
      ["Storage", "SQLite"],
    ],
    team: {
      title: "The Team",
      hackathon: "HACKUSF 2026 · TAMPA, FL",
      missionTag: "Mission",
      missionText: "When disaster strikes, the most vulnerable communities are the last to receive help. Crisis-Net exists to close that gap — ensuring that every affected person is seen, scored for urgency, and connected to the right resources within minutes, not hours. We believe no one should have to navigate a crisis alone.",
      philosophyTag: "Philosophy",
      philosophyText: "Crisis-Net isn't designed to replace emergency workers, it's built to amplify them. Every agent in the pipeline exists to handle a task that currently costs minutes of human attention during moments when seconds matter. The system is transparent, auditable, and always human-in-the-loop.",
      footer: 'HACKUSF 2026 · TAMPA, FL · "BUILD WITH AI"',
    },
    cta: {
      title: "Ready to See It?",
      button: "Open Dashboard →",
    },
  },
  es: {
    hero: {
      title: "Nuestra Misión.",
      sub1: "Respuesta ante desastres impulsada por IA.",
      sub2: "Construida para Tampa.",
      cta: "Abrir Panel →",
    },
    metricsLabels: ["Ciclo Completo de Pipeline", "Agentes IA Especializados", "Fuentes de Datos Gubernamentales"],
    problem: {
      tag: "El Problema",
      title: "Los Desastres Superan la Coordinación Humana",
      body: "Durante desastres a gran escala, los coordinadores de emergencias procesan manualmente cientos de informes. Las decisiones de clasificación se retrasan. Las víctimas no saben qué programas existen para ellas. La comunicación entre agencias se interrumpe. Las personas esperan horas para recibir ayuda que existe pero no les llega.",
    },
    solution: {
      tag: "Nuestra Solución",
      title: "Cinco Agentes, Un Pipeline, Cero Demora",
      body: "Crisis-Net es un compañero agéntico para quienes previenen daños. Cinco agentes especializados — Scout, Triage, Resource, Comms y Coordinator — trabajan en un pipeline orquestado vía ParallelAgent de Google ADK. Scout detecta amenazas, Triage puntúa el impacto, Resource asigna programas a códigos postales, y Comms publica alertas multilingüe. Todo activado con un código postal.",
    },
    howItWorks: {
      title: "Cómo Funciona",
      agents: "5 AGENTES ESPECIALIZADOS",
      orchestration: "ORQUESTACIÓN GOOGLE ADK",
    },
    steps: [
      { title: "Rastrear y Detectar", desc: "El Agente Scout monitorea NWS, FEMA y noticias locales en busca de fenómenos climáticos anómalos y desastres activos." },
      { title: "Puntuar y Clasificar", desc: "El Agente Triage puntúa la severidad usando la categoría de tormenta, densidad poblacional (Census) y datos históricos de daños de NOAA." },
      { title: "Emparejar Recursos", desc: "El Agente Resource identifica y asigna programas de FEMA, estatales y sin fines de lucro a los códigos postales afectados." },
      { title: "Alertar y Coordinar", desc: "El Agente Comms envía alertas multilingüe vía Mailgun. El Coordinator orquesta el pipeline completo vía ParallelAgent de Google ADK." },
    ],
    timeline: [
      { title: "Scout", date: "Etapa 1", content: "Monitorea NWS, FEMA y noticias locales en tiempo real para detectar fenómenos climáticos anómalos y desastres activos.", category: "Detección" },
      { title: "Triage", date: "Etapa 2", content: "Puntúa la severidad usando la categoría de tormenta, densidad poblacional (Census) y datos históricos de daños de NOAA.", category: "Análisis" },
      { title: "Resource", date: "Etapa 3", content: "Identifica y asigna programas de FEMA, estatales y sin fines de lucro a los códigos postales afectados.", category: "Emparejamiento" },
      { title: "Comms", date: "Etapa 4", content: "Envía alertas multilingüe vía Mailgun a comunidades afectadas con orientación práctica.", category: "Alertas" },
      { title: "Coordinator", date: "Orquestador", content: "Orquesta el pipeline completo de agentes vía ParallelAgent de Google ADK, gestionando secuencias y contingencias.", category: "Orquestación" },
    ],
    techStack: [
      ["Frontend", "Next.js + TypeScript"],
      ["Estilos", "Tailwind CSS"],
      ["Orquestación IA", "Google ADK + Gemini"],
      ["Datos Climáticos", "NWS + NOAA + FEMA APIs"],
      ["Datos de Población", "US Census API"],
      ["Alertas", "Mailgun"],
      ["Almacenamiento", "SQLite"],
    ],
    team: {
      title: "El Equipo",
      hackathon: "HACKUSF 2026 · TAMPA, FL",
      missionTag: "Misión",
      missionText: "Cuando ocurre un desastre, las comunidades más vulnerables son las últimas en recibir ayuda. Crisis-Net existe para cerrar esa brecha — asegurando que cada persona afectada sea identificada, evaluada por urgencia y conectada con los recursos correctos en minutos, no en horas. Creemos que nadie debería enfrentar una crisis solo.",
      philosophyTag: "Filosofía",
      philosophyText: "Crisis-Net no está diseñado para reemplazar a los trabajadores de emergencias, sino para amplificarlos. Cada agente en el pipeline existe para manejar una tarea que actualmente consume minutos de atención humana en momentos donde los segundos importan. El sistema es transparente, auditable y siempre con supervisión humana.",
      footer: 'HACKUSF 2026 · TAMPA, FL · "CONSTRUIR CON IA"',
    },
    cta: {
      title: "¿Listo para Verlo?",
      button: "Abrir Panel →",
    },
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const agentTimeline = TIMELINE_BASE.map((base, i) => ({
    ...base,
    ...t.timeline[i],
  }));

  const metrics = METRICS_BASE.map((base, i) => ({
    ...base,
    label: t.metricsLabels[i],
  }));

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
            {t.hero.title}
          </h1>

          <div className="font-mono text-[16px] text-[#6b7869] tracking-[2px] uppercase leading-[2]" style={{ textShadow: '0 0px 5px rgb(255, 255, 255)' }}>
            {t.hero.sub1}
            <br />
            {t.hero.sub2}
          </div>

          <Link
            href="/dashboard"
            className="inline-block mt-10 font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto"
            style={{ textShadow: 'none' }}
          >
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* ═══ METRICS BAR ═══ */}
      <div className="grid grid-cols-3 border-b border-[#d4dbc8]">
        {metrics.map((s, i) => (
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
            {t.problem.tag}
          </div>
          <div className="font-display text-lg font-bold uppercase tracking-tight mb-4 text-[#111d0f]">
            {t.problem.title}
          </div>
          <div className="text-[18px] text-[#52665e] leading-[1.8]">
            {t.problem.body}
          </div>
        </div>
        <div className="relative p-[60px] group hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.9)] transition-all duration-200">
          <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-[#16a34a]" />
          <span className="absolute -left-px -bottom-px block size-2 border-l-2 border-b-2 border-[#16a34a]" />
          <span className="absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 border-[#16a34a]" />
          <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[#16a34a]" />
            {t.solution.tag}
          </div>
          <div className="font-display text-lg font-bold uppercase tracking-tight mb-4 text-[#111d0f]">
            {t.solution.title}
          </div>
          <div className="text-[18px] text-[#52665e] leading-[1.8]">
            {t.solution.body}
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
              {t.howItWorks.title}
            </div>
          </div>
          <div className="font-mono text-[16px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
            {t.howItWorks.agents}
            <br />
            {t.howItWorks.orchestration}
          </div>
        </div>

        <div className="flex">
          {/* Left: 2×2 cards */}
          <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-px bg-[#d4dbc8] border border-[#d4dbc8]">
            {t.steps.map((s, i) => (
              <CardContainer
                key={i}
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
                    {STEP_ICONS[i]}
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
            <RadialOrbitalTimeline timelineData={agentTimeline} />
          </div>
        </div>
      </section>

      {/* ═══ TECH STRIP (infinite scroll) ═══ */}
      <div className="overflow-hidden border-b border-[#d4dbc8]">
        <div className="flex w-max animate-marquee">
          {[...t.techStack, ...t.techStack, ...t.techStack, ...t.techStack].map(([label, value], i) => (
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
              {t.team.title}
            </div>
          </div>
          <div className="font-mono text-[15px] text-[#6b7869] text-right leading-[1.8] tracking-wider">
            UNIVERSITY OF SOUTH FLORIDA
            <br />
            {t.team.hackathon}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#d4dbc8]">
          <div className="bg-white p-10">
            <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#16a34a]" />
              {t.team.missionTag}
            </div>
            <div className="text-[18px] text-[#52665e] leading-[1.8]">
              {t.team.missionText}
            </div>
          </div>
          <div className="bg-white p-10">
            <div className="font-mono text-[15px] text-[#16a34a] tracking-[2px] uppercase mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-[#16a34a]" />
              {t.team.philosophyTag}
            </div>
            <div className="text-[18px] text-[#52665e] leading-[1.8]">
              {t.team.philosophyText}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="font-mono text-[15px] text-[#6b7869] tracking-[2px]">
            {t.team.footer}
          </span>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative px-[60px] py-[120px] text-center overflow-hidden">
        <ParticlesBg />
        <div className="relative z-10 pointer-events-none" style={{ textShadow: '0 0 10px #f5f7f3, 0 0 20px #f5f7f3, 0 0 40px #f5f7f3, 0 0 60px #f5f7f3' }}>
          <h2 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5">
            {t.cta.title}
          </h2>
          <Link
            href="/dashboard"
            className="inline-block font-mono text-xs bg-[#16a34a] text-white px-8 py-3.5 font-medium tracking-[1.5px] uppercase hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto"
            style={{ textShadow: 'none' }}
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
