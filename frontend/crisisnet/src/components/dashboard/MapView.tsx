"use client";

import { useState, useCallback } from "react";
import type { Incident, Resource } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";

interface MapViewProps {
  incidents: Incident[];
  resources: Resource[];
}

const BOUNDS = {
  minLat: 27.85,
  maxLat: 28.01,
  minLng: -82.56,
  maxLng: -82.4,
};
const W = 700;
const H = 380;

function project(lat: number, lng: number) {
  return {
    x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W,
    y: H - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H,
  };
}

export function MapView({ incidents, resources }: MapViewProps) {
  const [tooltip, setTooltip] = useState<Incident | null>(null);

  const deployed = resources.filter((r) => r.status === "deployed");

  const handlePinClick = useCallback(
    (inc: Incident) => {
      setTooltip((prev) => (prev?.id === inc.id ? null : inc));
    },
    []
  );

  return (
    <div>
      <div className="px-4 pt-3">
        <div className="font-mono text-[10px] text-[#555] tracking-[1.5px] uppercase mb-3 flex items-center gap-2">
          <span className="w-1 h-1 bg-[#c8ff00]" />
          Operations Map — Tampa Bay AO
        </div>
      </div>

      <div className="relative mx-4 bg-[#0e0e0e] border border-[#262626] overflow-hidden"
        style={{ minHeight: 360 }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <line
                x1={0} y1={(H / 10) * i} x2={W} y2={(H / 10) * i}
                stroke="#262626" strokeWidth="0.5" opacity="0.3"
              />
              <line
                x1={(W / 10) * i} y1={0} x2={(W / 10) * i} y2={H}
                stroke="#262626" strokeWidth="0.5" opacity="0.3"
              />
            </g>
          ))}

          {/* Water body */}
          <path
            d={`M ${W * 0.3} ${H * 0.6} Q ${W * 0.35} ${H * 0.3}, ${W * 0.5} ${H * 0.25} Q ${W * 0.6} ${H * 0.35}, ${W * 0.55} ${H * 0.55} Q ${W * 0.45} ${H * 0.7}, ${W * 0.3} ${H * 0.6} Z`}
            fill="rgba(200,255,0,0.02)"
            stroke="rgba(200,255,0,0.08)"
            strokeWidth="1"
          />
          <text
            x={W * 0.4} y={H * 0.45}
            fontFamily="monospace" fontSize="10"
            fill="rgba(200,255,0,0.12)"
          >
            Tampa Bay
          </text>

          {/* Resource → Incident lines */}
          {deployed.map((r) => {
            const inc = incidents.find((i) => i.id === r.assignedTo);
            if (!inc) return null;
            const rp = project(inc.lat + 0.003, inc.lng - 0.005);
            const ip = project(inc.lat, inc.lng);
            return (
              <g key={r.id}>
                <line
                  x1={rp.x} y1={rp.y} x2={ip.x} y2={ip.y}
                  stroke="rgba(200,255,0,0.15)" strokeWidth="1"
                  strokeDasharray="3 2"
                />
                <circle
                  cx={rp.x} cy={rp.y} r="4"
                  fill="rgba(200,255,0,0.1)" stroke="#c8ff00"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Incident pins */}
          {incidents.map((inc) => {
            const p = project(inc.lat, inc.lng);
            const cfg = PRIORITY_CONFIG[inc.priority];
            const r = inc.priority === "P1" ? 8 : inc.priority === "P2" ? 6 : 4;
            return (
              <g
                key={inc.id}
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={() => handlePinClick(inc)}
              >
                {inc.priority === "P1" && (
                  <circle
                    cx={p.x} cy={p.y} r={r}
                    fill="none" stroke={cfg.color} strokeWidth="1" opacity="0.3"
                  >
                    <animate attributeName="r" from={r} to={r + 10} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={p.x} cy={p.y} r={r}
                  fill={cfg.bg} stroke={cfg.color} strokeWidth="2"
                />
                <text
                  x={p.x} y={p.y - r - 4}
                  textAnchor="middle" fontFamily="monospace"
                  fontSize="8" fill={cfg.color} fontWeight="600"
                >
                  {inc.id.replace("INC-", "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div className="absolute left-4 bottom-4 bg-[#1a1a1a] border border-[#3a3a3a] p-3 max-w-[260px] text-xs shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="font-mono text-[10px] text-[#555]">
              {tooltip.id}
            </div>
            <div className="font-semibold mt-1">{tooltip.description}</div>
            <div className="text-[#555] text-[10px] mt-1">
              📍 {tooltip.location}
            </div>
            <span
              className="font-mono text-[9px] font-medium px-2 py-0.5 tracking-wider inline-block mt-1.5"
              style={{
                background: PRIORITY_CONFIG[tooltip.priority].bg,
                color: PRIORITY_CONFIG[tooltip.priority].color,
              }}
            >
              {tooltip.priority} · {PRIORITY_CONFIG[tooltip.priority].label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
