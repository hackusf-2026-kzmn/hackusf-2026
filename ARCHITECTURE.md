# Agent System Overview (Backend)

This document explains the current agent wiring, how state flows, and what to do
about the population density constraint.

## What Exists Right Now

- **Scout** calls a backend endpoint and writes `disaster_events` into state.
- **Triage** reads `state['disaster_events'][0]`, then calls tools to compute a
  **local impact score** and **urgency label**.
- **ResourceGatherer** drafts example resources for the event.
- **Comms** uses the state to draft a public alert.

The orchestration is:

```
Scout -> Parallel(Triage + Resource) -> Comms
```

`root_agent` is set to `coordinator`, so ADK Web runs that pipeline.

## Why Population Density Is an Issue

Population density is hard to compute reliably without either:

- a precomputed dataset keyed by ZIP or geohash, or
- a census/geospatial pipeline that converts boundaries + population to density.

That can be overkill for an MVP. It also introduces data latency and accuracy
concerns that might not be worth it early on.

## Recommended Adjustment (MVP-Friendly)

Replace population density with a simpler proxy signal:

1. **Population by ZIP** (not density)
2. **NWS severity/urgency/certainty** as the primary impact anchor
3. **Resource gap** (shelter/aid availability per ZIP) as a local modifier

This keeps the pipeline deterministic without requiring a full geospatial layer.

## Suggested Triage Output (No Confidence)

Use:

```
{
  "local_impact_score": 0-100,
  "urgency": "LOW" | "MED" | "HIGH",
  "rationale": "short explanation"
}
```

## How State Flows

- **Scout** writes `disaster_events`
- **Triage** reads `disaster_events` and writes `severity_scores`
- **ResourceGatherer** writes `matched_resources`
- **Comms** reads `disaster_events` + `severity_scores` and writes `drafted_alerts`

## Next Easy Moves

- Swap `get_population_density` to `get_population_by_zip`
- Stub `get_population_by_zip` to return a fixed value or a small lookup table
- Keep the scoring formula simple until the data layer is ready

