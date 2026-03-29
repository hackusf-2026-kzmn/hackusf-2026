import { mockIncidents } from "@/mock/mockIncidents";
import { mockResources } from "@/mock/mockResources";
import { mockAgentStatus } from "@/mock/mockAgentStatus";
import { mockHistorical } from "@/mock/mockHistorical";
import { mockComms } from "@/mock/mockComms";
import type { Incident, Resource, AgentStatus, HistoricalEvent, CommMessage } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "false";
const API_BASE = "http://localhost:8080/api";

// ─── INCIDENTS ────────────────────────────────────────────────
export async function getIncidents(): Promise<Incident[]> {
  if (USE_MOCK) return mockIncidents;
  const res = await fetch(`${API_BASE}/scout`);
  return res.json();
}

// ─── RESOURCES ────────────────────────────────────────────────
export async function getResources(): Promise<Resource[]> {
  if (USE_MOCK) return mockResources;
  const res = await fetch(`${API_BASE}/resourceMatcher`);
  return res.json();
}

// ─── AGENT STATUS ─────────────────────────────────────────────
export async function getAgentStatus(): Promise<AgentStatus[]> {
  if (USE_MOCK) return mockAgentStatus;
  const res = await fetch(`${API_BASE}/agent-status`);
  return res.json();
}

// ─── REPORT SUBMISSION ────────────────────────────────────────
export async function submitReport(report: {
  description: string;
  lat: number;
  lng: number;
  reporter?: string;
}): Promise<{ incident_id: string; priority: string }> {
  if (USE_MOCK) {
    // Simulate triage delay
    await new Promise((r) => setTimeout(r, 2500));
    return { incident_id: `INC-${Date.now()}`, priority: "P2" };
  }
  const res = await fetch(`${API_BASE}/incidents/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  return res.json();
}

// ─── HISTORICAL (SNOWFLAKE) ───────────────────────────────────
export async function getHistorical(): Promise<HistoricalEvent[]> {
  if (USE_MOCK) return mockHistorical;
  const res = await fetch(`${API_BASE}/snowflake/historical`);
  return res.json();
}

// ─── COMMS ────────────────────────────────────────────────────
export async function getComms(): Promise<CommMessage[]> {
  if (USE_MOCK) return mockComms;
  const res = await fetch(`${API_BASE}/comms`);
  return res.json();
}

// ─── SUBSCRIBE (email opt-in) ─────────────────────────────────
export async function subscribe(payload: {
  email: string;
  severity: string;
  zip_code?: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch(`http://localhost:8000/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}