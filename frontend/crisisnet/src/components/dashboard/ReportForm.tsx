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

export function ReportForm({ onSubmit, submitting }: ReportFormProps) {
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("27.9506");
  const [lng, setLng] = useState("-82.4572");
  const [reporter, setReporter] = useState("");

  const handleSubmit = () => {
    if (!desc.trim()) return;
    onSubmit({
      description: desc,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      reporter: reporter || undefined,
    });
    setDesc("");
    setReporter("");
  };

  return (
    <div className="bg-[#1a1a1a] p-4">
      <div className="font-mono text-[10px] text-[#555] tracking-[1.5px] uppercase mb-3.5 flex items-center gap-2">
        <span className="w-1 h-1 bg-[#c8ff00]" />
        Submit Distress Report
      </div>

      <div className="mb-2">
        <label className="block font-mono text-[10px] text-[#555] tracking-wider mb-1">
          Description *
        </label>
        <textarea
          className="w-full bg-[#0b0b0b] border border-[#262626] px-2.5 py-2 text-white font-body text-xs outline-none focus:border-[#c8ff00] transition-colors resize-vertical min-h-[50px]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the emergency..."
          rows={2}
        />
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
