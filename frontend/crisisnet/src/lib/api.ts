import type { Incident, Resource, AgentStatus, HistoricalEvent, CommMessage } from "@/lib/types";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "/api";
const API_BASE = BACKEND_BASE;
const ANON_TOKEN_KEY = "crisisnet_anon_token";
const ANON_TOKEN_EXP_KEY = "crisisnet_anon_token_exp";

function getCachedAnonToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(ANON_TOKEN_KEY);
  const exp = window.localStorage.getItem(ANON_TOKEN_EXP_KEY);
  if (!token || !exp) return null;
  const expMs = Number(exp);
  if (Number.isNaN(expMs) || Date.now() >= expMs) return null;
  return token;
}

async function getAnonToken(): Promise<string> {
  const cached = getCachedAnonToken();
  if (cached) return cached;
  const res = await fetch(`${BACKEND_BASE}/auth/anon`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to authenticate");
  const data = await res.json();
  const token = data.access_token as string | undefined;
  const expiresIn = Number(data.expires_in ?? 0);
  if (!token) throw new Error("Missing access token");
  if (typeof window !== "undefined") {
    const expMs = Date.now() + Math.max(expiresIn - 60, 60) * 1000;
    window.localStorage.setItem(ANON_TOKEN_KEY, token);
    window.localStorage.setItem(ANON_TOKEN_EXP_KEY, String(expMs));
  }
  return token;
}

// ─── INCIDENTS ────────────────────────────────────────────────
function severityToPriority(s: string): "P1" | "P2" | "P3" {
  if (s === "Extreme" || s === "Severe") return "P1";
  if (s === "Moderate") return "P2";
  return "P3";
}

export async function getIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/scout`);
  const data = await res.json();
  const alerts = data.alerts ?? [];
  return alerts.map((a: any) => ({
    ...a,
    description: a.headline,
    priority: severityToPriority(a.severity),
    timestamp: a.effective_at?.slice(11, 16) ?? "",
    lat: a.lat ?? undefined,
    lng: a.lng ?? undefined,
    isNew: false,
  }));
}

// ─── RESOURCES ────────────────────────────────────────────────
export async function getResources(): Promise<Resource[]> {
  const res = await fetch(`${API_BASE}/resourceMatcher`);
  return res.json();
}

// ─── AGENT STATUS ─────────────────────────────────────────────
export async function getAgentStatus(): Promise<AgentStatus[]> {
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
  const res = await fetch(`${API_BASE}/incidents/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  return res.json();
}

// ─── HISTORICAL (SNOWFLAKE) ───────────────────────────────────
export async function getHistorical(): Promise<HistoricalEvent[]> {
  const res = await fetch(`${API_BASE}/snowflake/historical`);
  return res.json();
}

// ─── COMMS ────────────────────────────────────────────────────
export async function getComms(): Promise<CommMessage[]> {
  const res = await fetch(`${API_BASE}/comms`);
  return res.json();
}

// ─── ACTIVITY STREAM ──────────────────────────────────────────
export async function getActivityStream(): Promise<{ messages: string[]; latest: string }> {
  const res = await fetch(`${API_BASE}/activity-stream`);
  return res.json();
}

// ─── AI SUMMARIZER ────────────────────────────────────────────
export async function summarize(query: string, zip_code: string = "33602"): Promise<{ answer: string; alert_count: number; shelter_count: number }> {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, zip_code }),
  });
  return res.json();
}

// ─── SUBSCRIBE (email opt-in) ─────────────────────────────────
export async function subscribe(payload: {
  email: string;
  severity: string;
  zip_code: string;
}): Promise<{ data: unknown }> {
  const token = await getAnonToken();
  const res = await fetch(`${BACKEND_BASE}/user-stuff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: payload.email,
      opt_in: true,
      severity: payload.severity,
      zip_code: payload.zip_code,
    }),
  });
  if (!res.ok) {
    throw new Error("Subscription failed");
  }
  return res.json();
}
