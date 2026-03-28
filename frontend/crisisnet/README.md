# CrisisNet — Multi-Agent Disaster Response Dashboard

> HackUSF 2026 · Google ADK Sponsor Challenge · "Build with AI"

Five specialized AI agents coordinate in real-time to triage incidents, allocate resources, and route responders — orchestrated through Google ADK's Agent-to-Agent protocol.

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server (mock data enabled by default)
npm run dev

# Open http://localhost:3000
```

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, stats, world map, agent grid, tech strip |
| `/about` | About page — problem/solution, process flow, tech stack, team |
| `/dashboard` | Live ops dashboard — agents, map, incidents, resources, form |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, ThemeProvider, Nav)
│   ├── globals.css         # Tailwind + design tokens
│   ├── page.tsx            # Landing page
│   ├── about/page.tsx      # About page
│   └── dashboard/page.tsx  # Dashboard page
├── components/
│   ├── ui/
│   │   ├── button.tsx      # shadcn Button
│   │   └── card.tsx        # shadcn Card
│   ├── dashboard/
│   │   ├── AgentPanel.tsx  # Agent activity with rotating actions
│   │   ├── IncidentFeed.tsx # Live incident list
│   │   ├── ResourcePanel.tsx # Deployed/available resources
│   │   ├── MapView.tsx     # SVG ops map with pins
│   │   ├── ReportForm.tsx  # Distress report submission
│   │   ├── HistoricalChart.tsx # Snowflake analytics
│   │   ├── SitBanner.tsx   # Situation awareness bar
│   │   └── Toasts.tsx      # Toast notifications
│   ├── Nav.tsx             # Navigation bar
│   └── Footer.tsx          # Footer
├── lib/
│   ├── api.ts              # Data layer (mock ↔ real toggle)
│   ├── types.ts            # TypeScript definitions
│   └── utils.ts            # cn() helper
└── mock/
    ├── mockIncidents.ts    # 6 Tampa-area incidents
    ├── mockResources.ts    # 7 resources (4 deployed, 3 available)
    ├── mockAgentStatus.ts  # 5 agents with action strings
    ├── mockHistorical.ts   # 10 past hurricane events
    └── mockComms.ts        # 3 pre-drafted alerts
```

## Mock → Real API Switch

All data flows through `src/lib/api.ts`. To switch to real backend:

1. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`
2. Ensure backend is running at `http://localhost:8000/api`
3. Endpoints: `GET /incidents`, `GET /resources`, `GET /agent-status`, `POST /incidents/report`, `GET /snowflake/historical`

## Design System

- **Fonts:** Syne (display), Space Grotesk (body), DM Mono (technical), Instrument Serif (accents)
- **Accent:** `#c8ff00` (acid lime)
- **Severity:** P1 `#ff3b3b`, P2 `#ff9f1a`, P3 `#ffd43b`
- **Aesthetic:** Brutalist-tactical, no border-radius, grid-line visual language

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (landing animations)
- Leaflet.js / MapLibre (production map — SVG fallback included)
- Recharts (production charts)

## Demo Day Flow (90 seconds)

1. Dashboard loads → Tampa map with 6 active pins, all agents "active"
2. Agent feed scrolling with live-looking actions
3. Submit a new distress report via the form
4. Toast: "Triage Agent processing..." → new P2 card appears
5. Resource panel shows rescue team assigned
6. Point to Snowflake chart for historical data
7. Point to agent feed: "Five agents, A2A protocol, Google ADK"
