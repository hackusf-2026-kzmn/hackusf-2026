"use client";

import { useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
  MapRoute,
} from "@/components/ui/map";
import type { Incident, Resource } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/types";
import { EmailOptInButton } from "@/components/dashboard/EmailOptIn";

interface LiveMapProps {
  incidents: Incident[];
  resources: Resource[];
  onToggleFullscreen?: () => void;
  onToggleSidebars?: () => void;
  isFullscreen?: boolean;
  sidebarsOpen?: boolean;
}

/**
 * Production map using MapLibre + Carto dark basemap.
 * Drop-in replacement for the SVG MapView.
 *
 * Usage in dashboard/page.tsx:
 *   import { LiveMap } from "@/components/dashboard/LiveMap";
 *   <LiveMap incidents={incidents} resources={mockResources} />
 */
const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;

export function LiveMap({ incidents, resources, onToggleFullscreen, onToggleSidebars, isFullscreen, sidebarsOpen }: LiveMapProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );

  // Build route lines from shelters to nearest incidents (visual connection)
  const routeCoordinates: { id: string; coords: [number, number][] }[] = [];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 pt-3 flex-shrink-0">
        <div className="font-mono text-[10px] text-[#6b7869] tracking-[1.5px] uppercase mb-3 flex items-center gap-2">
          <span className="w-1 h-1 bg-[#16a34a]" />
          Operations Map — Tampa Bay AO
          <span className="flex-1" />
          <EmailOptInButton />
          {onToggleSidebars && (
            <button
              onClick={onToggleSidebars}
              title={sidebarsOpen ? "Hide sidebars" : "Show sidebars"}
              className="w-6 h-6 flex items-center justify-center border border-[#d4dbc8] bg-white hover:bg-[#eef1ea] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                {sidebarsOpen ? (
                  <>
                    <rect x="1" y="2" width="4" height="10" rx="0.5" stroke="#6b7869" strokeWidth="1.2" />
                    <rect x="9" y="2" width="4" height="10" rx="0.5" stroke="#6b7869" strokeWidth="1.2" />
                    <path d="M6 5L7 7L6 9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5L7 7L8 9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ) : (
                  <>
                    <rect x="1" y="2" width="4" height="10" rx="0.5" stroke="#6b7869" strokeWidth="1.2" strokeDasharray="2 1.5" />
                    <rect x="9" y="2" width="4" height="10" rx="0.5" stroke="#6b7869" strokeWidth="1.2" strokeDasharray="2 1.5" />
                    <path d="M6 5L5 7L6 9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5L9 7L8 9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </svg>
            </button>
          )}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit full map" : "Full size map"}
              className="w-6 h-6 flex items-center justify-center border border-[#d4dbc8] bg-white hover:bg-[#eef1ea] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isFullscreen ? (
                  <>
                    <polyline points="5,1 5,5 1,5" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="9,13 9,9 13,9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="13,5 9,5 9,1" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="1,9 5,9 5,13" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </>
                ) : (
                  <>
                    <polyline points="1,5 1,1 5,1" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="13,9 13,13 9,13" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="9,1 13,1 13,5" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <polyline points="5,13 1,13 1,9" stroke="#6b7869" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="mx-4 mb-2 border border-[#d4dbc8] overflow-hidden flex-1" style={{ minHeight: 200 }}>
        <Map
          center={[-82.46, 27.94]}
          zoom={11.5}
          styles={MAP_STYLES}
        >
          <MapControls position="bottom-right" showZoom />

          {/* Route lines */}
          {routeCoordinates.map((route) => (
            <MapRoute
              key={route.id}
              coordinates={route.coords}
              color="#16a34a"
              width={2}
              opacity={0.4}
              dashArray={[4, 3]}
            />
          ))}

          {/* Shelter markers */}
          {resources.filter((r) => r.lat != null && r.lng != null).map((r, i) => (
              <MapMarker
                key={`shelter-${i}`}
                longitude={Number(r.lng)}
                latitude={Number(r.lat)}
              >
                <MarkerContent className="flex items-center justify-center">
                  <div className="w-4 h-4 border border-[#16a34a]/50 bg-[#16a34a]/10 flex items-center justify-center text-[8px]">
                    🏠
                  </div>
                </MarkerContent>
              </MapMarker>
          ))}

          {/* Incident markers */}
          {incidents.filter((inc): inc is Incident & { lat: number; lng: number } => inc.lat != null && inc.lng != null && isFinite(inc.lat) && isFinite(inc.lng)).map((inc) => {
            const cfg = PRIORITY_CONFIG[inc.priority];
            const size =
              inc.priority === "P1"
                ? "w-4 h-4"
                : inc.priority === "P2"
                ? "w-3 h-3"
                : "w-2.5 h-2.5";

            return (
              <MapMarker
                key={inc.id}
                longitude={inc.lng}
                latitude={inc.lat}
                onClick={() =>
                  setSelectedIncident((prev) =>
                    prev?.id === inc.id ? null : inc
                  )
                }
              >
                <MarkerContent>
                  <div className="relative">
                    <div
                      className={`${size} border-2`}
                      style={{
                        borderColor: cfg.color,
                        backgroundColor: cfg.bg,
                      }}
                    />
                    {inc.priority === "P1" && (
                      <div
                        className="absolute inset-0 animate-ping"
                        style={{
                          borderColor: cfg.color,
                          border: `1px solid ${cfg.color}`,
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold whitespace-nowrap" style={{ color: cfg.color }}>
                      {inc.event}
                    </div>
                  </div>
                </MarkerContent>

                {selectedIncident?.id === inc.id && (
                  <MarkerPopup closeButton>
                    <div className="min-w-[200px]">
                      <div className="font-mono text-[10px] text-[#6b7869]">
                        {inc.event}
                      </div>
                      <div className="font-semibold text-xs mt-1">
                        {inc.description}
                      </div>
                      <div className="text-[#6b7869] text-[10px] mt-1">
                        📍 {inc.location}
                      </div>
                      <span
                        className="font-mono text-[9px] font-medium px-2 py-0.5 tracking-wider inline-block mt-1.5"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {inc.priority} | {cfg.label}
                      </span>
                    </div>
                  </MarkerPopup>
                )}
              </MapMarker>
            );
          })}
        </Map>
      </div>
    </div>
  );
}
