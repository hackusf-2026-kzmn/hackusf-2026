"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { mockIncidents } from "@/mock/mockIncidents";
import { mockResources } from "@/mock/mockResources";
import type { Incident } from "@/lib/types";

import { SitBanner } from "@/components/dashboard/SitBanner";
import { AgentPanel } from "@/components/dashboard/AgentPanel";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { IncidentFeed } from "@/components/dashboard/IncidentFeed";
import { ResourcePanel } from "@/components/dashboard/ResourcePanel";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { AgentConversations } from "@/components/dashboard/AgentConversations";
import { AISummarizer } from "@/components/dashboard/AISummarizer";
import { ToastContainer, type Toast } from "@/components/dashboard/Toasts";

/* ── Constants ──────────────────────────────────────────────── */
const LEFT_MIN = 220;
const LEFT_MAX = 420;
const LEFT_DEFAULT = 280;
const RIGHT_MIN = 240;
const RIGHT_MAX = 420;
const RIGHT_DEFAULT = 300;
const MAP_MIN_FRAC = 0.25;
const MAP_MAX_FRAC = 0.92;
const MAP_DEFAULT_FRAC = 0.45;

/* ── Reusable section header with collapse chevron + drag line */
function SectionHeader({
  label,
  count,
  dotColor,
  collapsed,
  onToggle,
  dragHandle,
}: {
  label: string;
  count?: number | string;
  dotColor: string;
  collapsed: boolean;
  onToggle: () => void;
  dragHandle?: boolean; // show double-line drag affordance
}) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 select-none font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase border-b border-[#d4dbc8] bg-[#edf1e8] flex-shrink-0 ${
        dragHandle ? "cursor-row-resize" : ""
      }`}
    >
      <span className="w-1 h-1 flex-shrink-0" style={{ background: dotColor }} />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-[9px] text-[#6b7869]">{count}</span>
      )}
      <button
        onClick={onToggle}
        className="p-0.5 hover:text-[#16a34a] transition-colors"
        title={collapsed ? `Expand ${label}` : `Collapse ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          {collapsed ? (
            /* double down chevron */
            <>
              <path d="M2 1L5 4L8 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 5L5 8L8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            /* double up chevron */
            <>
              <path d="M2 4L5 1L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 8L5 5L8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </svg>
      </button>
      {/* double-line drag affordance */}
      {dragHandle && (
        <div className="flex flex-col gap-[2px] ml-1">
          <span className="block w-5 h-[1px] bg-[#b8c4aa]" />
          <span className="block w-5 h-[1px] bg-[#b8c4aa]" />
        </div>
      )}
    </div>
  );
}

/* ── Vertical-split sidebar container ─────────────────────── */
function VSplit({
  topNode,
  bottomNode,
  topHeader,
  bottomHeader,
  topCollapsed,
  bottomCollapsed,
}: {
  topNode: ReactNode;
  bottomNode: ReactNode;
  topHeader: ReactNode;
  bottomHeader: ReactNode;
  topCollapsed: boolean;
  bottomCollapsed: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitFraction, setSplitFraction] = useState(0.55);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const frac = (e.clientY - rect.top) / rect.height;
      setSplitFraction(Math.min(0.85, Math.max(0.15, frac)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const onDividerDown = () => {
    if (topCollapsed || bottomCollapsed) return; // no drag when a section is collapsed
    dragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  // Determine sizing: collapsed sections become header-only (auto height),
  // the open section takes remaining space via flex-1.
  const bothOpen = !topCollapsed && !bottomCollapsed;

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-hidden">
      {/* Top section */}
      <div
        className={`flex flex-col overflow-hidden ${topCollapsed ? "flex-none" : ""}`}
        style={
          topCollapsed
            ? undefined                             /* auto-height = just the header */
            : bothOpen
            ? { height: `${splitFraction * 100}%` } /* draggable split */
            : { flex: 1, minHeight: 0 }             /* sole open section */
        }
      >
        {topHeader}
        {!topCollapsed && <div className="flex-1 overflow-hidden min-h-0">{topNode}</div>}
      </div>

      {/* Drag divider — the bottom header IS the drag handle */}
      <div onPointerDown={onDividerDown}>{bottomHeader}</div>

      {/* Bottom section */}
      <div
        className={`flex flex-col overflow-hidden ${bottomCollapsed ? "flex-none" : ""}`}
        style={
          bottomCollapsed
            ? undefined
            : { flex: 1, minHeight: 0 }
        }
      >
        {!bottomCollapsed && <div className="flex-1 overflow-hidden min-h-0">{bottomNode}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const toastIdRef = useRef(0);

  /* Sidebar width state */
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  /* Section collapse state */
  const [incidentCollapsed, setIncidentCollapsed] = useState(false);
  const [resourceCollapsed, setResourceCollapsed] = useState(false);
  const [convoCollapsed, setConvoCollapsed] = useState(false);
  const [summarizerCollapsed, setSummarizerCollapsed] = useState(false);

  /* Map vertical split */
  const [mapFrac, setMapFrac] = useState(MAP_DEFAULT_FRAC);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const prevSidebars = useRef<{ left: boolean; right: boolean; frac: number } | null>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const mapDragging = useRef(false);

  /* Horizontal drag refs */
  const hDrag = useRef<"left" | "right" | null>(null);
  const hStartX = useRef(0);
  const hStartW = useRef(0);

  const onHPointerDown = useCallback(
    (side: "left" | "right", e: React.PointerEvent) => {
      hDrag.current = side;
      hStartX.current = e.clientX;
      hStartW.current = side === "left" ? leftWidth : rightWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [leftWidth, rightWidth]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      /* Horizontal sidebar drag */
      if (hDrag.current) {
        const dx = e.clientX - hStartX.current;
        if (hDrag.current === "left") {
          setLeftWidth(Math.min(LEFT_MAX, Math.max(LEFT_MIN, hStartW.current + dx)));
        } else {
          setRightWidth(Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, hStartW.current - dx)));
        }
      }
      /* Vertical map drag */
      if (mapDragging.current && centerRef.current) {
        const rect = centerRef.current.getBoundingClientRect();
        const frac = (e.clientY - rect.top) / rect.height;
        setMapFrac(Math.min(MAP_MAX_FRAC, Math.max(MAP_MIN_FRAC, frac)));
      }
    };
    const onUp = () => {
      hDrag.current = null;
      mapDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  /* Simulated new event */
  useEffect(() => {
    const t = setTimeout(() => {
      setIncidents((prev) => [
        {
          id: "EVT-007",
          description:
            "Waterspout developing offshore — NWS warning issued for Hillsborough Bay",
          location: "Hillsborough Bay, FL — zip 33606",
          lat: 27.9012,
          lng: -82.4675,
          priority: "P2",
          status: "active",
          timestamp: "10:18",
          isNew: true,
        },
        ...prev,
      ]);
    }, 18000);
    return () => clearTimeout(t);
  }, []);

  /* Map control toggles */
  const toggleMapFullscreen = useCallback(() => {
    setMapFullscreen((prev) => {
      if (!prev) {
        prevSidebars.current = { left: leftOpen, right: rightOpen, frac: mapFrac };
        setLeftOpen(false);
        setRightOpen(false);
        setMapFrac(MAP_MAX_FRAC);
      } else if (prevSidebars.current) {
        setLeftOpen(prevSidebars.current.left);
        setRightOpen(prevSidebars.current.right);
        setMapFrac(prevSidebars.current.frac);
        prevSidebars.current = null;
      }
      return !prev;
    });
  }, [leftOpen, rightOpen, mapFrac]);

  const toggleSidebars = useCallback(() => {
    const bothOpen = leftOpen && rightOpen;
    setLeftOpen(!bothOpen);
    setRightOpen(!bothOpen);
    if (mapFullscreen) setMapFullscreen(false);
  }, [leftOpen, rightOpen, mapFullscreen]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "processing") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        4000
      );
    },
    []
  );

  const handleReport = useCallback(
    (report: {
      description: string;
      lat: number;
      lng: number;
      reporter?: string;
    }) => {
      setSubmitting(true);
      addToast("Scout → Triage Agent processing...", "processing");

      setTimeout(() => {
        addToast("Severity scored: P2 — HIGH · Programs matched", "success");
        setIncidents((prev) => [
          {
            id: `EVT-${String(prev.length + 1).padStart(3, "0")}`,
            description: report.description,
            location: `zip ${report.reporter ?? "unknown"} · ${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`,
            lat: report.lat,
            lng: report.lng,
            priority: "P2",
            status: "active",
            timestamp: "now",
            isNew: true,
          },
          ...prev,
        ]);
        setSubmitting(false);
      }, 3000);
    },
    [addToast]
  );

  const lw = leftOpen ? leftWidth : 0;
  const rw = rightOpen ? rightWidth : 0;

  return (
    <>
      {/* Portrait-mode blocker — dashboard only */}
      <div className="portrait-blocker">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#16a34a]">
            <rect x="8" y="14" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M22 24L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 28L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 24L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 24L8 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44 20L44 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 24L40 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44 24L40 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="font-mono text-[13px] text-[#111d0f] tracking-wider uppercase">Rotate your device</div>
          <div className="font-mono text-[11px] text-[#6b7869] leading-relaxed">
            Crisis-Net dashboard requires landscape orientation for optimal situational awareness.
          </div>
        </div>
      </div>
    <div
      className="flex flex-col overflow-hidden bg-[#f5f7f3]"
      style={{ zoom: 1.25, width: "calc(100vw / 1.25)", height: "calc(100vh / 1.25)" }}
    >
      {/* Fixed nav takes 70px */}
      <div className="h-[70px] flex-shrink-0" />
      <ToastContainer toasts={toasts} />
      <SitBanner />

      {/* Main 3-column layout — fills remaining viewport */}
      <div className="flex flex-1 min-h-0 bg-[#d4dbc8]">
        {/* ── LEFT SIDEBAR ──────────────────────────────── */}
        <div
          className="bg-[#f5f7f3] flex flex-col overflow-hidden transition-[width] duration-200 ease-out"
          style={{ width: lw, minWidth: leftOpen ? LEFT_MIN : 0 }}
        >
          {leftOpen && (
            <VSplit
              topCollapsed={incidentCollapsed}
              bottomCollapsed={resourceCollapsed}
              topHeader={
                <SectionHeader
                  label="Incident Feed"
                  count={`${incidents.length} active`}
                  dotColor="#16a34a"
                  collapsed={incidentCollapsed}
                  onToggle={() => setIncidentCollapsed((v) => !v)}
                />
              }
              topNode={
                !incidentCollapsed ? (
                  <IncidentFeed incidents={incidents} />
                ) : null
              }
              bottomHeader={
                <SectionHeader
                  label="Resources"
                  dotColor="#16a34a"
                  collapsed={resourceCollapsed}
                  onToggle={() => setResourceCollapsed((v) => !v)}
                  dragHandle
                />
              }
              bottomNode={
                !resourceCollapsed ? (
                  <ResourcePanel resources={mockResources} />
                ) : null
              }
            />
          )}
        </div>

        {/* Left drag handle + lip */}
        <div className="relative flex-shrink-0" style={{ width: 6 }}>
          {leftOpen && (
            <div
              className="absolute inset-0 cursor-col-resize z-10 hover:bg-[#16a34a]/20 active:bg-[#16a34a]/30 transition-colors"
              onPointerDown={(e) => onHPointerDown("left", e)}
            />
          )}
          <button
            onClick={() => setLeftOpen((v) => !v)}
            className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 bg-white border border-[#d4dbc8] flex items-center justify-center text-[#6b7869] hover:text-[#16a34a] hover:border-[#16a34a] transition-colors shadow-sm"
            style={{ left: -3 }}
            title={leftOpen ? "Collapse left sidebar" : "Expand left sidebar"}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path
                d={leftOpen ? "M6 1L1 6L6 11" : "M2 1L7 6L2 11"}
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* ── CENTER ────────────────────────────────────── */}
        <div ref={centerRef} className="bg-[#f5f7f3] flex flex-col flex-1 min-w-0 min-h-0">
          {/* Map — adjustable height */}
          <div className="min-h-0" style={{ height: `${mapFrac * 100}%` }}>
            <LiveMap
              incidents={incidents}
              resources={mockResources}
              onToggleFullscreen={toggleMapFullscreen}
              onToggleSidebars={toggleSidebars}
              isFullscreen={mapFullscreen}
              sidebarsOpen={leftOpen && rightOpen}
            />
          </div>

          {/* Horizontal drag divider between map and bottom panels */}
          <div
            className="flex-shrink-0 h-[5px] bg-[#d4dbc8] cursor-row-resize hover:bg-[#16a34a]/20 active:bg-[#16a34a]/30 transition-colors relative group"
            onPointerDown={() => {
              mapDragging.current = true;
              document.body.style.cursor = "row-resize";
              document.body.style.userSelect = "none";
            }}
          >
            {/* visual grip lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-[2px]">
              <span className="block w-8 h-[1px] bg-[#b8c4aa] group-hover:bg-[#16a34a]/50" />
              <span className="block w-8 h-[1px] bg-[#b8c4aa] group-hover:bg-[#16a34a]/50" />
            </div>
          </div>

          {/* Bottom row — fills remaining space */}
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-px bg-[#d4dbc8]">
            <div className="bg-[#f5f7f3] overflow-hidden">
              <ReportForm onSubmit={handleReport} submitting={submitting} />
            </div>
            <div className="bg-[#f5f7f3] overflow-y-auto">
              <AgentPanel />
            </div>
          </div>
        </div>

        {/* Right drag handle + lip */}
        <div className="relative flex-shrink-0" style={{ width: 6 }}>
          {rightOpen && (
            <div
              className="absolute inset-0 cursor-col-resize z-10 hover:bg-[#16a34a]/20 active:bg-[#16a34a]/30 transition-colors"
              onPointerDown={(e) => onHPointerDown("right", e)}
            />
          )}
          <button
            onClick={() => setRightOpen((v) => !v)}
            className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 bg-white border border-[#d4dbc8] flex items-center justify-center text-[#6b7869] hover:text-[#16a34a] hover:border-[#16a34a] transition-colors shadow-sm"
            style={{ right: -3 }}
            title={rightOpen ? "Collapse right sidebar" : "Expand right sidebar"}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path
                d={rightOpen ? "M2 1L7 6L2 11" : "M6 1L1 6L6 11"}
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────── */}
        <div
          className="bg-[#f5f7f3] flex flex-col overflow-hidden transition-[width] duration-200 ease-out"
          style={{ width: rw, minWidth: rightOpen ? RIGHT_MIN : 0 }}
        >
          {rightOpen && (
            <VSplit
              topCollapsed={convoCollapsed}
              bottomCollapsed={summarizerCollapsed}
              topHeader={
                <SectionHeader
                  label="Agent Conversations"
                  dotColor="#a855f7"
                  collapsed={convoCollapsed}
                  onToggle={() => setConvoCollapsed((v) => !v)}
                />
              }
              topNode={
                !convoCollapsed ? <AgentConversations /> : null
              }
              bottomHeader={
                <SectionHeader
                  label="AI Summarizer"
                  dotColor="#06b6d4"
                  collapsed={summarizerCollapsed}
                  onToggle={() => setSummarizerCollapsed((v) => !v)}
                  dragHandle
                />
              }
              bottomNode={
                !summarizerCollapsed ? <AISummarizer /> : null
              }
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
}
