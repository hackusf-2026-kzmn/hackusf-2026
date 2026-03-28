import type { AgentStatus } from "@/lib/types";

export const mockAgentStatus: AgentStatus[] = [
  {
    id: "triage",
    name: "Triage Agent",
    shortName: "TRIAGE",
    icon: "⚡",
    active: true,
    last_action: "Classified INC-001 as P1 — flooding, 4 trapped",
    description:
      "Parses distress reports and classifies incidents by P1–P3 severity using NLP and geospatial context.",
    actions: [
      "Classified INC-001 as P1 — flooding, 4 trapped",
      "Reviewing incoming report from Hillsborough County",
      "Escalated INC-003 severity from P2 → P1",
      "Awaiting geolocation confirmation on new report",
      "Cross-referencing flood zone data for INC-004",
      "Processing distress signal from South Tampa",
    ],
  },
  {
    id: "resource",
    name: "Resource Allocation",
    shortName: "RESOURCE",
    icon: "📦",
    active: true,
    last_action: "Assigned Rescue Team Alpha to INC-001",
    description:
      "Matches supplies, personnel, and equipment to active incidents based on proximity, capability, and urgency.",
    actions: [
      "Assigned Rescue Team Alpha to INC-001",
      "Checking supply levels at staging area C",
      "Rerouting Medical Unit 3 to Tampa General",
      "Queuing Supply Truck T-12 for shelter resupply",
      "Evaluating resource gap for P1 incidents",
    ],
  },
  {
    id: "routing",
    name: "Routing & Logistics",
    shortName: "ROUTING",
    icon: "🗺️",
    active: true,
    last_action: "Calculating optimal route to Bayshore Blvd",
    description:
      "Plans optimal responder routes accounting for road closures, flood zones, and real-time traffic conditions.",
    actions: [
      "Calculating optimal route to Bayshore Blvd",
      "Gandy Blvd blocked — rerouting via Courtney Campbell",
      "Updated ETA for Rescue Team Bravo: 8 min",
      "Flood zone bypass route generated for INC-004",
      "Monitoring traffic conditions on I-275",
    ],
  },
  {
    id: "comms",
    name: "Communications",
    shortName: "COMMS",
    icon: "📡",
    active: true,
    last_action: "Drafted evacuation alert for Zone A residents",
    description:
      "Auto-drafts evacuation alerts, road closure notices, and shelter updates for civilians and responders.",
    actions: [
      "Drafted evacuation alert for Zone A residents",
      "Sent shelter capacity update to county EOC",
      "Broadcasting road closure on Gandy Blvd",
      "Notifying hospitals of incoming trauma cases",
      "Relaying weather update to all field teams",
    ],
  },
  {
    id: "situational",
    name: "Situation Awareness",
    shortName: "SITAWARE",
    icon: "🌐",
    active: true,
    last_action: "Ingesting NWS feed — surge warning extended",
    description:
      "Aggregates live weather feeds, satellite imagery, social media signals, and 311 call volume into a unified picture.",
    actions: [
      "Ingesting NWS feed — surge warning extended",
      "Satellite imagery updated for Tampa Bay area",
      "Aggregating 311 call volume — spike in Zone B",
      "Weather model refresh: wind shifting NNE at 45mph",
      "Social media scan: 12 new reports in Ybor City",
    ],
  },
];
