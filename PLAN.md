# Disaster Relief Agent Backend Plan

## Summary
- Create a repo-root `PLAN.md` that documents backend agent orchestration, data ingestion, scoring, storage, and FastAPI endpoints.
- UI/dashboard exists but is explicitly out of scope for this backend plan.

## Key Changes
1. **`PLAN.md` Content**
   - **Goals & MVP Scope**
     - Backend agents: Scout → Triage + Resource (parallel) → Comms (gated by severity).
     - FastAPI API only; UI/dashboard excluded from scope.
   - **Agent Roles & Orchestration (Google ADK)**
     - `Scout` (LlmAgent): pulls/summarizes NWS + FEMA alerts, plus NOAA event metadata.
     - `Triage` (LlmAgent): computes severity score using rules-based formula.
     - `ResourceMatcher` (LlmAgent): maps event/location to shelters/resources (FEMA + local).
     - `Comms` (LlmAgent): drafts alert → translate → send SMS via Twilio; also posts to dummy EAS endpoint.
     - `SequentialAgent`: Scout → Parallel(Triage+Resource) → Comms (only if severity >= 70).
   - **Scoring Model (Rules-Based)**
     - Score scale: `0–100`; trigger `>= 70` (configurable).
     - Inputs: storm category/scale (NWS), population density (Census), historical damage (NOAA), FEMA impact level (if present).
     - Output includes: `severity_score`, `impact_summary`, `confidence`.
   - **Data Sources**
     - NWS API, FEMA API, NOAA historical damage datasets, Census population density.
     - Local news scraping deferred (not MVP).
   - **Storage (SQLite, High-Level Tables)**
     - `events`: id, source, event_type, location, raw_payload, detected_at.
     - `scores`: event_id, severity_score, factors, computed_at.
     - `resources`: id, org_type, service_type, location, contact, last_verified.
     - `matches`: event_id, resource_id, match_reason, created_at.
     - `alerts`: event_id, channel, language, content, sent_at, status.
     - `runs`: run_id, agent, status, started_at, finished_at, error.
   - **FastAPI Endpoints**
     - `GET /events?zip=`: list recent events by zip.
     - `GET /events/{id}`: event detail + severity.
     - `GET /resources?zip=&event_id=`: resources matched for event/location.
     - `POST /alerts/preview`: generate draft alert for a given event + language.
     - `POST /alerts/send`: translate then send SMS (per language).
     - `POST /eas/mock`: dummy endpoint for EAS handoff (logs payload).
   - **Config/Constants**
     - Severity threshold default `70`.
     - Poll interval default `60s` for Scout.
     - Provider keys: Twilio, Google Translate, APIs.

## Test Plan
- Unit tests for scoring formula and threshold gating.
- Integration test: Scout → Triage/Resource → Comms flow triggers only at severity >= 70.
- API tests for endpoints returning expected shapes and filtering by zip/event_id.
- Translation → SMS pipeline sends a message per language when enabled.

## Assumptions
- Backend plan only; dashboard/UI explicitly out of scope.
- Twilio for SMS, Google Cloud Translate for translation.
- NWS + FEMA + NOAA + Census are MVP data sources.
- Severity scale 0–100, trigger >= 70.
- FastAPI REST endpoints (not GraphQL).
- Translation precedes SMS; one message per language.
