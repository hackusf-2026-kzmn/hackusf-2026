"use client";

import { useState } from "react";
import { subscribe } from "@/lib/api";

const SEVERITY_OPTIONS = [
  { value: "P1", label: "P1 — Critical", color: "#ff3b3b", desc: "Hurricanes, tornadoes, major flooding" },
  { value: "P2", label: "P2 — High", color: "#ff9f1a", desc: "Tropical storms, severe weather watches" },
  { value: "P3", label: "P3 — Moderate", color: "#ffd43b", desc: "Wind advisories, minor flooding" },
];

export function EmailOptInButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Subscribe to alerts"
        className={`w-6 h-6 flex items-center justify-center border border-[#d4dbc8] bg-white hover:bg-[#eef1ea] transition-colors ${className ?? ""}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="3" width="12" height="9" rx="1" stroke="#6b7869" strokeWidth="1.2" />
          <path d="M1 4L7 8.5L13 4" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && <EmailOptInModal onClose={() => setOpen(false)} />}
    </>
  );
}

function EmailOptInModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(["P1", "P2", "P3"]));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const toggleSeverity = (val: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!email.trim() || selected.size === 0) return;
    setStatus("submitting");
    try {
      const severity = Array.from(selected).sort().join(",");
      await subscribe({ email: email.trim(), severity, zip_code: zip.trim() || undefined });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#f5f7f3] border border-[#d4dbc8] shadow-2xl w-[380px] max-w-[90vw] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#d4dbc8] bg-[#edf1e8]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#16a34a]" />
            <span className="text-[11px] text-[#111d0f] tracking-[1.5px] uppercase font-medium">
              Alert Notifications
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7869] hover:text-[#111d0f] transition-colors p-0.5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="px-5 py-8 text-center">
            <div className="w-10 h-10 mx-auto mb-3 border-2 border-[#16a34a] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9L7.5 12.5L14 5.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[12px] text-[#111d0f] tracking-wider uppercase mb-1">Subscribed</div>
            <div className="text-[10px] text-[#6b7869]">You&apos;ll receive alerts at {email}</div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-1.5 text-[10px] tracking-widest uppercase border border-[#d4dbc8] hover:border-[#16a34a] hover:text-[#16a34a] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            <p className="text-[10px] text-[#52665e] leading-relaxed">
              Get real-time crisis alerts delivered to your inbox. Choose which severity levels matter to you.
            </p>

            {/* Email input */}
            <div>
              <label className="block text-[9px] text-[#6b7869] tracking-[1.5px] uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-[11px] bg-white border border-[#d4dbc8] outline-none focus:border-[#16a34a] transition-colors placeholder:text-[#b8c4aa]"
              />
            </div>

            {/* Zip code (optional) */}
            <div>
              <label className="block text-[9px] text-[#6b7869] tracking-[1.5px] uppercase mb-1">
                Zip Code <span className="normal-case tracking-normal text-[#b8c4aa]">(optional)</span>
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="33602"
                className="w-full px-3 py-2 text-[11px] bg-white border border-[#d4dbc8] outline-none focus:border-[#16a34a] transition-colors placeholder:text-[#b8c4aa]"
              />
            </div>

            {/* Severity checkboxes */}
            <div>
              <label className="block text-[9px] text-[#6b7869] tracking-[1.5px] uppercase mb-2">
                Severity Levels
              </label>
              <div className="space-y-1.5">
                {SEVERITY_OPTIONS.map((opt) => {
                  const active = selected.has(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleSeverity(opt.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 border transition-all text-left ${
                        active
                          ? "border-[#16a34a] bg-[#16a34a]/5"
                          : "border-[#d4dbc8] bg-white hover:border-[#b8c4aa]"
                      }`}
                    >
                      {/* custom checkbox */}
                      <span
                        className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                          active ? "border-[#16a34a] bg-[#16a34a]" : "border-[#b8c4aa]"
                        }`}
                      >
                        {active && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span
                        className="w-1.5 h-1.5 flex-shrink-0"
                        style={{ background: opt.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-[#111d0f] tracking-wider">{opt.label}</div>
                        <div className="text-[9px] text-[#6b7869]">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || selected.size === 0 || status === "submitting"}
              className={`w-full py-2.5 text-[10px] tracking-[2px] uppercase font-medium transition-all ${
                !email.trim() || selected.size === 0
                  ? "bg-[#d4dbc8] text-[#6b7869] cursor-not-allowed"
                  : status === "submitting"
                  ? "bg-[#16a34a]/70 text-white cursor-wait"
                  : "bg-[#16a34a] text-white hover:shadow-[0_0_20px_rgba(22,163,74,0.3)]"
              }`}
            >
              {status === "submitting" ? "Subscribing…" : status === "error" ? "Retry" : "Subscribe to Alerts"}
            </button>

            {status === "error" && (
              <p className="text-[9px] text-[#ff3b3b] text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
