import type { AgentStatus } from "@/lib/types";

/** Static agent metadata used by the landing page. */
export const AGENT_DEFINITIONS: AgentStatus[] = [
  {
    id: "scout",
    name: "Scout Agent",
    shortName: "SCOUT",
    icon: "scout",
    active: true,
    last_action: "NWS: Tropical storm warning — Gulf of Mexico",
    description:
      "Monitors NWS weather alerts across Florida for severe weather, hurricanes, tropical storms, and flood warnings in real time.",
    actions: [
      "NWS: Tropical storm warning — Gulf of Mexico",
      "NWS: Flood watch issued for Hillsborough County",
      "Ingested 12 active NWS alerts for Tampa Bay area",
      "Tropical depression identified in Caribbean — monitoring",
      "Storm surge risk elevated for Pinellas County",
      "NWS: Severe thunderstorm warning — Pasco County",
    ],
  },
  {
    id: "triage",
    name: "Triage Agent",
    shortName: "TRIAGE",
    icon: "triage",
    active: true,
    last_action: "Gemini AI scored EVT-001: P1 — high-density zone",
    description:
      "Scores severity via Gemini AI using alert category, population density from Census data, and regional threat context.",
    actions: [
      "Gemini AI scored EVT-001: P1 — high-density zone",
      "Census API: Hillsborough population density retrieved",
      "Alert severity cross-referenced with population data",
      "Escalated EVT-002: storm surge + coastal proximity",
      "Estimated 42,000 affected residents in EVT-001 zone",
      "Priority assignment complete — 3 P1, 5 P2, 4 P3",
    ],
  },
  {
    id: "resource",
    name: "Resource Agent",
    shortName: "RESOURCE",
    icon: "resource",
    active: true,
    last_action: "Matched 5 shelters near zip 33602",
    description:
      "Matches nearby emergency shelters and assistance resources to affected areas by proximity and capacity.",
    actions: [
      "Matched 5 shelters near zip 33602",
      "Nearest shelter: 2.3km — Hillsborough Community College",
      "Shelter capacity verified — 12 sites in Tampa Bay area",
      "Matched 4 shelters near zip 33614",
      "Distance calculations complete for Pinellas County",
      "Updated shelter availability for Pasco County",
    ],
  },
  {
    id: "comms",
    name: "Comms Agent",
    shortName: "COMMS",
    icon: "comms",
    active: true,
    last_action: "Email alert sent via Mailgun — EN/ES for zip 33602",
    description:
      "Drafts and delivers multilingual email alerts via Mailgun to opted-in community members.",
    actions: [
      "Email alert sent via Mailgun — EN/ES for zip 33602",
      "Translation complete: Spanish advisory dispatched",
      "Evacuation notice drafted — Zone A coastal residents",
      "Alert digest sent to opted-in subscribers",
      "Mailgun delivery confirmed — 98% open rate",
      "Follow-up email queued with shelter locations",
    ],
  },
  {
    id: "coordinator",
    name: "Coordinator Agent",
    shortName: "COORD",
    icon: "coordinator",
    active: true,
    last_action: "ParallelAgent: Scout + Triage running concurrently",
    description:
      "Orchestrates all agents via Google ADK's ParallelAgent, managing sequencing and data handoffs.",
    actions: [
      "ParallelAgent: Scout + Triage running concurrently",
      "Dispatching Resource Agent with EVT-001 triage output",
      "Comms Agent queued — awaiting Resource match completion",
      "Pipeline cycle complete — 94s total execution time",
      "Re-queuing Scout Agent for next monitoring cycle",
      "All agents synchronized — 5 active, 0 errors",
    ],
  },
];
