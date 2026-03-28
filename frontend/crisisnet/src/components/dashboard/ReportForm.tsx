"use client";

import { useState } from "react";

interface ReportFormProps {
  onSubmit: (report: {
    description: string;
    lat: number;
    lng: number;
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
      reporter: reporter || undefined,
    });
    setDesc("");
    setZip("");
    setReporter("");
  };

  return (
    <div className="bg-[#1a1a1a] p-4">
      <div className="font-mono text-[10px] text-[#555] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#c8ff00]" />
        Check Your Area
      </div>

      <div className="mb-2">
        <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
          Zip Code *
        </label>
        <input
          className={`w-full bg-[#0b0b0b] border px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors ${
            zipError ? "border-[#ff3b3b]" : "border-[#262626]"
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

      <div className="mb-2">
        <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
          Describe the situation *
        </label>
        <textarea
          className="w-full bg-[#0b0b0b] border border-[#262626] px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors resize-vertical min-h-[50px]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Flooding on main street, roads impassable..."
          rows={2}
        />
      </div>

      <div className="mb-2">
        <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
          Your name (optional)
        </label>
        <input
          className="w-full bg-[#0b0b0b] border border-[#262626] px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors"
          value={reporter}
          onChange={(e) => setReporter(e.target.value)}
          placeholder="Anonymous"
        />
      </div>

      <button
        className="w-full py-2.5 bg-[#c8ff00] text-[#0b0b0b] font-mono text-[11px] font-medium tracking-wider uppercase border-none cursor-pointer mt-2 hover:shadow-[0_0_16px_rgba(200,255,0,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={submitting || !desc.trim() || zip.length !== 5}
      >
        {submitting ? "⏳ Triage Agent processing..." : "📡 Submit to Pipeline"}
      </button>
    </div>
  );
}
      </div>

      <div className="flex gap-1.5 mb-2">
        <div className="flex-1">
          <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
            Lat
          </label>
          <input
            className="w-full bg-[#0b0b0b] border border-[#262626] px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
            Lng
          </label>
          <input
            className="w-full bg-[#0b0b0b] border border-[#262626] px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full py-2.5 bg-[#c8ff00] text-[#0b0b0b] font-mono text-[11px] font-medium tracking-wider uppercase border-none cursor-pointer mt-2 hover:shadow-[0_0_16px_rgba(200,255,0,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={submitting || !desc.trim()}
      >
        {submitting ? "⏳ Processing..." : "📡 Submit Report"}
      </button>
    </div>
  );
}
