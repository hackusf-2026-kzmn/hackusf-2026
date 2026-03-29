"use client";

import { useState } from "react";

interface ReportFormProps {
  onSubmit: (report: {
    description: string;
    lat: number;
    lng: number;
    zip: string;
    reporter?: string;
  }) => void;
  submitting: boolean;
}

// Rough centroid lookup for FL zip codes used in the demo
const ZIP_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  "33602": { lat: 27.9506, lng: -82.4572, label: "Tampa, FL" },
  "33604": { lat: 28.0012, lng: -82.4631, label: "Tampa (Seminole Heights), FL" },
  "33607": { lat: 27.9755, lng: -82.5332, label: "Tampa Airport area, FL" },
  "33510": { lat: 27.9381, lng: -82.2859, label: "Brandon, FL" },
  "33755": { lat: 27.8765, lng: -82.7815, label: "Clearwater, FL" },
  "33801": { lat: 27.9904, lng: -81.683,  label: "Lakeland, FL" },
  "33614": { lat: 27.9867, lng: -82.5101, label: "Tampa (Town N Country), FL" },
};

export function ReportForm({ onSubmit, submitting }: ReportFormProps) {
  const [zip, setZip] = useState("");
  const [desc, setDesc] = useState("");
  const [reporter, setReporter] = useState("");
  const [zipError, setZipError] = useState("");

  const handleSubmit = () => {
    if (!zip.trim() || zip.length !== 5) {
      setZipError("Enter a valid 5-digit zip code");
      return;
    }
    setZipError("");
    if (!desc.trim()) return;

    const coords = ZIP_COORDS[zip] ?? { lat: 27.9506, lng: -82.4572 };
    onSubmit({
      description: desc,
      lat: coords.lat,
      lng: coords.lng,
      zip,
      reporter: reporter || undefined,
    });
    setDesc("");
    setZip("");
    setReporter("");
  };

  return (
    <div className="p-3 pb-4 h-full flex flex-col">
      <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-2 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#16a34a]" />
        Check Your Area
      </div>

      <div className="mb-1.5">
        <label className="block font-mono text-[10px] text-[#6b7869] tracking-wider mb-0.5">
          Zip Code *
        </label>
        <input
          className={`w-full bg-white border px-2.5 py-1.5 text-[#111d0f] font-body text-xs outline-none focus:border-[#16a34a] transition-colors ${
            zipError ? "border-[#ff3b3b]" : "border-[#d4dbc8]"
          }`}
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
            setZipError("");
          }}
          placeholder="e.g. 33602"
          maxLength={5}
        />
        {zipError && (
          <span className="font-mono text-[9px] text-[#ff3b3b] mt-0.5 block">{zipError}</span>
        )}
      </div>

      <div className="mb-1.5 flex-1 flex flex-col">
        <label className="block font-mono text-[10px] text-[#6b7869] tracking-wider mb-0.5">
          Describe the situation *
        </label>
        <textarea
          className="w-full flex-1 bg-white border border-[#d4dbc8] px-2.5 py-1.5 text-[#111d0f] font-body text-xs outline-none focus:border-[#16a34a] transition-colors resize-none min-h-[36px]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Flooding on main street, roads impassable..."
          rows={2}
        />
      </div>

      <div className="mb-1.5">
        <label className="block font-mono text-[10px] text-[#6b7869] tracking-wider mb-0.5">
          Your name (optional)
        </label>
        <input
          className="w-full bg-white border border-[#d4dbc8] px-2.5 py-1.5 text-[#111d0f] font-body text-xs outline-none focus:border-[#16a34a] transition-colors"
          value={reporter}
          onChange={(e) => setReporter(e.target.value)}
          placeholder="Anonymous"
        />
      </div>

      <button
        className="w-full py-2 mb-4 bg-[#16a34a] text-white font-mono text-[11px] font-medium tracking-wider uppercase border-none cursor-pointer hover:shadow-[0_0_16px_rgba(22,163,74,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        onClick={handleSubmit}
        disabled={submitting || !desc.trim() || zip.length !== 5}
      >
        {submitting ? "⏳ Triage Agent processing..." : "📡 Submit to Pipeline"}
      </button>
    </div>
  );
}
