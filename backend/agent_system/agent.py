from google.adk.agents import ParallelAgent, LlmAgent, SequentialAgent, LoopAgent
from google.adk.runners import InMemoryRunner
from google.genai import types
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from google.adk.tools.function_tool import FunctionTool
import os
import requests

FASTAPI_SERVER_URL = "http://127.0.0.1:8000/"
SCOUT_URL = os.path.join(FASTAPI_SERVER_URL, "scout")
POP_DENSITY_URL = os.path.join(FASTAPI_SERVER_URL, "population_density")
RESOURCE_GAP_URL = os.path.join(FASTAPI_SERVER_URL, "resource_gap")
TAMPA_ZIP_CODE = "33620"

def scout_tool(zip: str = TAMPA_ZIP_CODE) -> list[dict]:
    """Call the backend scout endpoint (NWS/FEMA aggregator)."""
    return requests.get(url=SCOUT_URL, params={"zip_code": zip}, timeout=3).json()


def get_population_density(zip: str) -> dict:
    """Fetch population density for a ZIP code."""
    return requests.get(url=POP_DENSITY_URL, params={"zip_code": zip}, timeout=3).json()


def get_resource_gap(zip: str) -> dict:
    """Fetch a simple resource gap signal for a ZIP code."""
    return requests.get(url=RESOURCE_GAP_URL, params={"zip_code": zip}, timeout=3).json()


scout_fn = FunctionTool.from_function(scout_tool)
pop_density_fn = FunctionTool.from_function(get_population_density)
resource_gap_fn = FunctionTool.from_function(get_resource_gap)

# Step 1: Scout runs first (sequential, must complete before anything else)
scout_agent = LlmAgent(
    name="Scout",
    output_key="disaster_events",
    instruction=(
        "Call scout_tool for a given zip code and return the events list. "
        "If multiple events exist, include the highest-severity one first."
    ),
    tools=[scout_fn],
)

triage_agent = LlmAgent(
    name="Triage",
    output_key="severity_scores",
    instruction=(
        "Read state['disaster_events'][0] for the primary event. "
        "Use event['severity'] plus get_population_density(zip) and "
        "get_resource_gap(zip) to compute a local_impact_score (0-100) and "
        "an urgency label (LOW/MED/HIGH). Return JSON-like output with "
        "fields: local_impact_score, urgency, rationale."
    ),
    tools=[pop_density_fn, resource_gap_fn],
)
resource_agent = LlmAgent(
    name="ResourceGatherer",
    output_key="matched_resources",
    instruction=(
        "Based on state['disaster_events'][0], draft 3 example resources "
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
