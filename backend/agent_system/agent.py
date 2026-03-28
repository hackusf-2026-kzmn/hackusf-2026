from google.adk.agents import ParallelAgent, LlmAgent, SequentialAgent, LoopAgent
from google.adk.runners import InMemoryRunner
from google.genai import types
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from google.adk.tools.function_tool import FunctionTool
import requests, os

FASTAPI_SERVER_URL = "http://127.0.0.1:8000/"
SCOUT_URL = os.path.join(FASTAPI_SERVER_URL, "scout")
TAMPA_ZIP_CODE = "33712"

def fetch_disaster_signals(zip: str=TAMPA_ZIP_CODE) -> list[dict]:
    # call NWS, return structured data
    disaster_signals_api_request = requests.get(url=SCOUT_URL, params={"zip":zip}).json()
    return disaster_signals_api_request

# Step 1: Scout runs first (sequential, must complete before anything else)
scout_agent = LlmAgent(
    name="Scout",
    output_key="disaster_events",
    instruction=(
        "Scan the user message for disaster signals. "
        "Return a short JSON-like summary with fields: "
        "event_type, location_hint, source_notes, confidence."
    ),
)

# Step 2: Triage and Resource-finding can run in parallel once scout finishes
triage_agent = LlmAgent(
    name="Triage",
    output_key="severity_scores",
    instruction=(
        "Use state['disaster_events'] to compute a severity score 0-100. "
        "Return JSON-like output with fields: severity_score, impact_summary, confidence."
    ),
)
resource_agent = LlmAgent(
    name="ResourceMatcher",
    output_key="matched_resources",
    instruction=(
        "Use state['disaster_events'] to draft 3 example resources "
        "(shelter, supplies, hotline). Return JSON-like list with name, type, contact."
    ),
)

parallel_analysis = ParallelAgent(
    name="AnalysisPhase",
    sub_agents=[triage_agent, resource_agent]
)

# Step 3: Comms drafts alerts only after both triage + resource are done
comms_agent = LlmAgent(
    name="Comms",
    output_key="drafted_alerts",
    instruction=(
        "Use state['disaster_events'] and state['severity_scores'] to draft a "
        "public alert message. If severity_score < 70, say monitoring only."
    ),
)

# Coordinator is just a SequentialAgent — no LLM needed
coordinator = SequentialAgent(
    name="DisasterResponseCoordinator",
    sub_agents=[scout_agent, parallel_analysis, comms_agent]
)

# Expose a root agent for ADK Web/CLI loaders.
root_agent = coordinator