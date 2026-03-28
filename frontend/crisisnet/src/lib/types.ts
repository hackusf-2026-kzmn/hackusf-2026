export type Priority = "P1" | "P2" | "P3";

export type IncidentStatus = "active" | "in_progress" | "monitoring" | "resolved";

export interface Incident {
  id: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  priority: Priority;
  status: IncidentStatus;
  timestamp: string;
  isNew?: boolean;
}

export type ResourceType = "rescue" | "medical" | "supply" | "recon";
export type ResourceStatus = "deployed" | "available" | "en_route";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  assignedTo: string | null;
  icon: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  active: boolean;
  last_action: string;
  actions: string[];
  description: string;
}

export interface HistoricalEvent {
  name: string;
  year: number;
  incidents: number;
  resources: number;
}

export interface CommMessage {
  type: string;
  body: string;
  time: string;
  priority: "high" | "medium" | "low";
}

export const PRIORITY_CONFIG: Record<
  Priority,
  { color: string; bg: string; label: string }
> = {
  P1: { color: "#ff3b3b", bg: "rgba(255,59,59,0.12)", label: "CRITICAL" },
  P2: { color: "#ff9f1a", bg: "rgba(255,159,26,0.12)", label: "HIGH" },
  P3: { color: "#ffd43b", bg: "rgba(255,212,59,0.12)", label: "MODERATE" },
};
