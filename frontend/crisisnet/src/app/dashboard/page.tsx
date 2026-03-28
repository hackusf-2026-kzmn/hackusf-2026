"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { mockIncidents } from "@/mock/mockIncidents";
import { mockResources } from "@/mock/mockResources";
import type { Incident } from "@/lib/types";

import { SitBanner } from "@/components/dashboard/SitBanner";
import { AgentPanel } from "@/components/dashboard/AgentPanel";
import { MapView } from "@/components/dashboard/MapView";
// To use the real MapLibre map instead of SVG, swap the import:
// import { LiveMap } from "@/components/dashboard/LiveMap";
// Then replace <MapView ... /> with <LiveMap ... /> below
import { IncidentFeed } from "@/components/dashboard/IncidentFeed";
import { ResourcePanel } from "@/components/dashboard/ResourcePanel";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { HistoricalChart } from "@/components/dashboard/HistoricalChart";
import { ToastContainer, type Toast } from "@/components/dashboard/Toasts";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const toastIdRef = useRef(0);

  // Simulate a new incident appearing after 18s
  useEffect(() => {
    const t = setTimeout(() => {
      setIncidents((prev) => [
        {
          id: "INC-007",
          description:
            "Gas leak detected near Ybor City — 2 block evacuation radius",
          location: "Ybor City",
          lat: 27.9612,
          lng: -82.4375,
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
      addToast("Triage Agent processing...", "processing");

      setTimeout(() => {
        addToast("Classified as P2 — HIGH", "success");
        setIncidents((prev) => [
          {
            id: `INC-${String(prev.length + 1).padStart(3, "0")}`,
            description: report.description,
            location: `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`,
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

  return (
    <div className="min-h-screen pt-14 bg-[#0b0b0b]">
      <ToastContainer toasts={toasts} />
      <SitBanner />

      {/* Main 3-column grid */}
      <div
        className="grid min-h-[calc(100vh-100px)] gap-px bg-[#262626]"
        style={{ gridTemplateColumns: "280px 1fr 300px" }}
      >
        {/* LEFT: Agent Panel */}
        <div className="bg-[#0b0b0b]">
          <AgentPanel />
        </div>

        {/* CENTER: Map + Bottom panels */}
        <div className="bg-[#0b0b0b] flex flex-col">
          <MapView incidents={incidents} resources={mockResources} />

          {/* Bottom: Form + Chart */}
          <div className="grid grid-cols-2 gap-px bg-[#262626] mx-4 mb-4 mt-2">
            <ReportForm onSubmit={handleReport} submitting={submitting} />
            <HistoricalChart />
          </div>
        </div>

        {/* RIGHT: Incidents + Resources */}
        <div className="bg-[#0b0b0b] flex flex-col max-h-[calc(100vh-100px)] overflow-y-auto">
          <IncidentFeed incidents={incidents} />
          <ResourcePanel resources={mockResources} />
        </div>
      </div>
    </div>
  );
}
