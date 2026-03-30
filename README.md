# Crisis-Net: Multi-Agent Disaster Response Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Google ADK](https://img.shields.io/badge/Google_ADK-Agent_Framework-4285F4?logo=google&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?logo=googlegemini&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%2B_DB-3FCF8E?logo=supabase&logoColor=white)
![Mailgun](https://img.shields.io/badge/Mailgun-Email_Alerts-F06B66?logo=mailgun&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

> Five specialized AI agents coordinate in real-time to scout threats, triage severity, match resources, and dispatch multilingual alerts — all triggered by a single ZIP code.

Built for [HackUSF 2026](https://hackusf.com/), focused on Tampa-area<br />
Developed by [Knight Hacks](https://club.knighthacks.org/) & [Hack@UCF](https://hackucf.org/) Members<br />
Uploaded onto [Devpost](https://devpost.com/software/crisis-net), live at [Crisis-Net.tech](https://crisis-net.tech)<br /><br />
🏆 [HackUSF 2026](https://hackusf-2026.devpost.com/) Winner for Best Use of `.tech` Domain

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 18, TypeScript, Tailwind CSS 3 |
| **Backend** | Python · FastAPI · Uvicorn |
| **Agent Orchestration** | Google ADK (Agent Development Kit) — `SequentialAgent`, `ParallelAgent`, `LlmAgent` |
| **LLM** | Google Gemini (gemini-2.5-flash-lite default) via `google-genai` |
| **Database / Auth** | Supabase (Postgres + anonymous auth + Row Level Security) |
| **Email** | Mailgun (alerts, opt-in confirmations, webhook-based unsubscribe) |
| **Maps** | Leaflet + React-Leaflet, MapLibre GL |
| **Charts** | Recharts |
| **UI Primitives** | Radix UI, Lucide icons, Framer Motion, cobe (3-D globe) |
| **Deployment** | Vercel (frontend — Next.js framework preset) |

## External APIs & Data Sources

- **National Weather Service (NWS)** — active & recent alerts by state
- **US Census Bureau** — 2020 population by ZIP code
- **pgeocode / Nominatim** — ZIP → lat/lng + county FIPS geocoding
- **Shelter dataset** — pre-geocoded JSON of emergency shelters (`shelters_geocoded.json`)

---

## Architecture

```
┌─────────── Frontend (Next.js on Vercel) ────────────┐
│  Landing  ·  Dashboard  ·  About                    │
│  /api/* → rewrites to backend                       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              Backend  (FastAPI)                     │
│                                                     │
│  /scout          – NWS alert ingestion & filtering  │
│  /population_size – Census population lookup        │
│  /resourceMatcher – Nearest-shelter matching        │
│  /translate       – Gemini-powered translation      │
│  /agent-status    – Live agent state                │
│  /activity-stream – Ring-buffer event log           │
│  /summarize       – AI Q&A over alerts + shelters   │
│  /incidents/report – User reports + AI triage       │
│  /alerts/send     – Mailgun alert dispatch loop     │
│  /comms           – On-demand alert send            │
│  /auth/anon       – Supabase anonymous auth         │
│  /user-stuff      – Preference CRUD (email/opt-in)  │
│  /mailgun/webhook – Bounce/unsub handler            │
│  /snowflake/historical – Static hurricane history   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│         Agent System  (Google ADK)                   │
│                                                      │
│  Coordinator (root SequentialAgent / LlmAgent)       │
│   ├─ Scout Agent → calls /scout                      │
│   ├─ AnalysisPhase (ParallelAgent)                   │
│   │    └─ Resource Agent → calls /resourceMatcher    │
│   └─ Comms Agent → calls /translate                  │
└──────────────────────────────────────────────────────┘
```

### Agent Descriptions

| Agent | Role |
|-------|------|
| **Scout** | Monitors NWS, FEMA & local feeds; returns active and recent alerts filtered to the target county or Tampa Bay metro area. |
| **Triage** | Scores severity using storm category, Census population density, and NOAA historical damage data (P1 / P2 / P3). |
| **Resource** | Matches shelters and aid programs to affected ZIP codes using haversine distance against the geocoded shelter database. |
| **Comms** | Drafts and dispatches multilingual alerts via Mailgun; translates using Gemini. |
| **Coordinator** | Orchestrates the full pipeline — runs Scout, then parallel analysis, then Comms — via Google ADK's agent primitives. |

---

## Project Structure

```
├── backend/
│   ├── main.py                   # FastAPI application (all endpoints)
│   ├── shelters_geocoded.json    # Pre-geocoded shelter data
│   ├── requirements.txt
│   └── agent_system/
│       └── agent.py              # Google ADK agent definitions
├── frontend/crisisnet/
│   ├── next.config.js            # API rewrite to backend
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── page.tsx          # Landing page (globe, agent cards)
│   │   │   ├── dashboard/        # Live ops dashboard
│   │   │   └── about/            # How-it-works + timeline
│   │   ├── components/
│   │   │   ├── dashboard/        # Map, feeds, agent panel, reports
│   │   │   └── ui/               # Reusable animated UI primitives
│   │   ├── context/              # React context (language toggle)
│   │   └── lib/
│   │       ├── api.ts            # Backend fetch wrappers
│   │       ├── agents.ts         # Static agent metadata
│   │       └── types.ts          # Shared TypeScript interfaces
├── vercel.json                   # Vercel deployment config
└── requirements.txt              # Root Python dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Python** ≥ 3.11

### Environment Variables

Create `backend/.env`:

```env
GEMINI_API_KEY=...
CENSUS_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_KEY=...
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...
MAILGUN_FROM=...
MAILGUN_SIGNING_KEY=...
# Optional
GEMINI_MODEL=gemini-2.5-flash-lite
ALLOWED_ORIGINS=http://localhost:3000
ALERTS_POLL_SECONDS=0
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### Frontend

```bash
cd frontend/crisisnet
npm install
npm run dev          # http://localhost:3000
```

Next.js rewrites `/api/*` to the backend at `http://127.0.0.1:8080` by default (configurable via `BACKEND_URL`).

### Agent System (standalone ADK runner)

```bash
cd backend/agent_system
# Requires FASTAPI_SERVER_URL pointing at the running backend
python -c "from agent import root_agent; print(root_agent)"
```

---

## Deployment

The frontend deploys to **Vercel** using its built-in Next.js framework detection (`vercel.json` sets `"framework": "nextjs"`). The backend can be deployed to any Python ASGI host (e.g., Railway, Render, Cloud Run) exposing port 8080. Set the `BACKEND_URL` env var in Vercel to point to the live backend.

---

## Apache 2.0 License

See [LICENSE](LICENSE).