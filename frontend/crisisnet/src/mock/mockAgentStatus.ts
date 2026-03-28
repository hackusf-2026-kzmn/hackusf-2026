import type { AgentStatus } from "@/lib/types";

export const mockAgentStatus: AgentStatus[] = [
  {
    id: "scout",
    name: "Scout Agent",
    shortName: "SCOUT",
    icon: "🔭",
    active: true,
    last_action: "NWS: Anomalous pressure drop — Gulf of Mexico",
    description:
      "Continuously monitors NWS API, FEMA feeds, and local news/social media for anomalous weather patterns that may indicate hurricanes, earthquakes, or floods.",
    actions: [
      "NWS: Anomalous pressure drop — Gulf of Mexico",
      "Scraping Tampa Bay Times — active flood coverage flagged",
      "FEMA API: Cross-referencing active disaster declarations",
      "Tropical depression identified in Caribbean — monitoring",
      "Storm surge risk elevated for Pinellas County",
      "Scanning social feeds for flood reports — Hillsborough",
    ],
  },
  {
    id: "triage",
    name: "Triage Agent",
    shortName: "TRIAGE",
    icon: "⚡",
    active: true,
    last_action: "Scored EVT-001: 8.4/10 — Cat 3, high-density zone",
    description:
      "Scores severity and affected population using a rules-based weighted formula: storm category, population density (Census API), and historical damage data (NOAA). The foundation of an ML model.",
    actions: [
      "Scored EVT-001: 8.4/10 — Cat 3, high-density zone",
      "Querying Census API for Hillsborough population density",
      "NOAA historical damage cross-reference complete",
      "Escalated EVT-002 score: storm surge + coastal proximity",
      "Estimated 42,000 affected residents in EVT-001 zone",
      "Severity model updated with latest pressure readings",
    ],
  },
  {
    id: "resource",
    name: "Resource Agent",
    shortName: "RESOURCE",
    icon: "🤝",
    active: true,
    last_action: "Matched 3 FEMA programs to zip 33602 residents",
    description:
      "Finds and matches local non-profit and government assistance programs to affected individuals based on location, need type, and program eligibility.",
    actions: [
      "Matched 3 FEMA programs to zip 33602 residents",
      "Red Cross shelter capacity verified — 12 sites available",
      "Identified 6 food assistance programs for Hillsborough Co.",
      "Matching displaced families to HUD emergency housing",
      "Querying local non-profit database for zip 33614",
      "Florida Disaster Fund disbursement criteria reviewed",
    ],
  },
  {
    id: "comms",
    name: "Comms Agent",
    shortName: "COMMS",
    icon: "📡",
    active: true,
    last_action: "Alert sent via Mailgun — EN/ES for zip 33602",
    description:
      "Drafts and sends public alerts via Mailgun, generates multilingual communications, and exposes an API endpoint for integration with local government emergency alert systems.",
    actions: [
      "Alert sent via Mailgun — EN/ES for zip 33602",
      "Translation complete: Haitian Creole advisory dispatched",
      "Generating API payload for Hillsborough County EOC",
      "Evacuation notice drafted — Zone A coastal residents",
      "Resource digest sent to 3,200 enrolled subscribers",
      "Coordination message relayed to Red Cross Tampa chapter",
    ],
  },
  {
    id: "coordinator",
    name: "Coordinator Agent",
    shortName: "COORD",
    icon: "🌐",
    active: true,
    last_action: "ParallelAgent: Scout + Triage running concurrently",
    description:
      "Orchestrates all agents using Google ADK's ParallelAgent feature, managing task sequencing, data handoffs, and pipeline coordination across the full response workflow.",
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
