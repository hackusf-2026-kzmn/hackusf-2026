from google.adk.agents import ParallelAgent, LlmAgent, SequentialAgent, LoopAgent
from google.adk.runners import InMemoryRunner
from google.genai import types
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from google.adk.tools.function_tool import FunctionTool
import os
import requests

FASTAPI_SERVER_URL = os.getenv("FASTAPI_SERVER_URL", "http://127.0.0.1:8080/")
SCOUT_URL = os.path.join(FASTAPI_SERVER_URL, "scout")
POP_SIZE_URL = os.path.join(FASTAPI_SERVER_URL, "population_size")
RESOURCE_MATCH_URL = os.path.join(FASTAPI_SERVER_URL, "resourceMatcher")
TRANSLATE_TEXT_URL = os.path.join(FASTAPI_SERVER_URL, "translate")
ALERTS_SEND_URL = os.path.join(FASTAPI_SERVER_URL, "alerts/send")
TAMPA_ZIP_CODE = "33620"

def scout_tool(zip: str = TAMPA_ZIP_CODE) -> list[dict]:
    """Call the backend scout endpoint to find events in a given zip code (NWS/FEMA aggregator)."""
    return requests.get(url=SCOUT_URL, params={"zip_code": zip}, timeout=3).json()


def get_population_size(zip: str = TAMPA_ZIP_CODE) -> dict:
    """Fetch population density for a ZIP code."""
    return requests.get(url=POP_SIZE_URL, params={"zip_code": zip}, timeout=3).json()


def resourcematcher(zip: str) -> dict:
    """Fetch local support resources based off of the zip code."""
    return requests.get(url=RESOURCE_MATCH_URL, params={"zip_code": zip}, timeout=3).json()

def translate_text(text: str, target_lang: str="es") -> dict: #spanish default
    """Take an input string of text and return translations"""
    return requests.get(url=TRANSLATE_TEXT_URL, params={"text":text,"target_lang":target_lang}).json()

def dispatch_alerts(dry_run: bool = False) -> dict:
    """Dispatch email alerts to all opted-in subscribers via the Hillsborough EOC pipeline."""
    return requests.post(url=ALERTS_SEND_URL, json={"dry_run": dry_run}, timeout=30).json()


scout_fn = FunctionTool(scout_tool)
pop_density_fn = FunctionTool(get_population_size)
resource_matcher_fn = FunctionTool(resourcematcher)
translater_fn = FunctionTool(translate_text)
dispatch_fn = FunctionTool(dispatch_alerts)

scout_agent = LlmAgent(
    name="Scout",
    output_key="disaster_events",
    instruction=(
        "Call scout_fn for a given zip code (if applicable) and return the list of National Weather Service alerts."
        "If multiple alerts exist, include the highest-severity one first."
    ),
    tools=[scout_fn],
)

'''triage_agent = LlmAgent(
    name="Triage",
    output_key="severity_scores",
    instruction=(
        "Read state['disaster_events'][0] for the primary event. "
        "Use event['severity'] plus get_population_size(zip) and "
        "get_resource_gap(zip) to compute a local_impact_score (0-100) and "
        "an urgency label (LOW/MED/HIGH). Return JSON-like output with "
        "fields: local_impact_score, urgency, rationale."
    ),
    tools=[pop_density_fn, resource_gap_fn],
)'''

triage_agent = LlmAgent(
    name="Triage",
    output_key="severity_scores",
    instruction=(
        "Read state['disaster_events'][0] for the primary event. "
        "Use event['severity'] plus get_population_size(zip) to compute a "
        "local_impact_score (0-100) and an urgency label (LOW/MED/HIGH). "
        "Return JSON-like output with fields: local_impact_score, urgency, rationale."
    ),
    tools=[pop_density_fn],
)

resource_agent = LlmAgent(
    name="ResourceGatherer",
    output_key="matched_resources",
    instruction=(
        "Based on state['disaster_events'][0], call recourse_matcher_fn."
    ),
    tools=[resource_matcher_fn]
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
        "Draft a public alert based off of state['disaster_events'][0], "
        "state['severity_scores'], and state['matched_resources']. "
        "Produce the alert in English, Spanish (ES), and Haitian Creole (HT) "
        "using the translate tool."
    ),
    tools=[translater_fn]
)

# Step 4: Dispatch sends the drafted alerts to subscribers via the Hillsborough EOC pipeline
dispatch_agent = LlmAgent(
    name="Dispatch",
    output_key="dispatch_result",
    instruction=(
        "Send the drafted alerts from state['drafted_alerts'] to all opted-in "
        "subscribers by calling the dispatch_alerts tool. "
        "Report back how many were sent and any failures."
    ),
    tools=[dispatch_fn]
)

# Coordinator is just a SequentialAgent — no LLM needed
coordinator = LlmAgent(
    name="DisasterResponseCoordinator",
    instruction=("You are an assistant that helps find and coordinate disaster relief. "
    "First, you scout any events in a given area (left as default if not specified). "
    "Then, you do parallel_analysis to triage severity and find resources for the user. "
    "Next, a comms_agent drafts multilingual communications (EN, ES, HT). "
    "Finally, the dispatch_agent sends alerts out to subscribers via the Hillsborough EOC pipeline. "
    "Only communicate with agents unless it is clear you're talking with a human."),
    sub_agents=[scout_agent, parallel_analysis, comms_agent, dispatch_agent]
)

# Expose a root agent for ADK Web/CLI loaders.
root_agent = coordinator