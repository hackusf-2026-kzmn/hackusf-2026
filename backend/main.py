from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import requests
import pgeocode
import json
import math
import time
from collections import deque
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
import os
import hmac
import hashlib
import asyncio
from supabase import create_client, Client

load_dotenv(Path(__file__).parent / ".env")
CENSUS_API_KEY = os.getenv("CENSUS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
DEFAULT_TRANSLATION_MODEL = "gemini-2.5-flash-lite"
USF_ZIP_CODE = "33602"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
MAILGUN_SIGNING_KEY = os.getenv("MAILGUN_SIGNING_KEY")
MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")
MAILGUN_FROM = os.getenv("MAILGUN_FROM")
ALERTS_POLL_SECONDS = int(os.getenv("ALERTS_POLL_SECONDS", "0") or "0")

app = FastAPI()
_alerts_task: asyncio.Task | None = None

# ── Activity stream ring buffer ──────────────────────────────
_activity_log: deque = deque(maxlen=30)

def _log_activity(agent: str, message: str) -> None:
    _activity_log.appendleft({
        "agent": agent,
        "message": f"{agent} → {message}",
        "ts": datetime.now(timezone.utc).isoformat(),
    })

# ── Agent status tracking ────────────────────────────────────
_agent_last: dict = {
    "scout":      {"ts": None, "action": "idle"},
    "triage":     {"ts": None, "action": "idle"},
    "resource":   {"ts": None, "action": "idle"},
    "comms":      {"ts": None, "action": "idle"},
    "coordinator":{"ts": None, "action": "idle"},
}

def _touch_agent(agent_id: str, action: str) -> None:
    _agent_last[agent_id] = {"ts": time.time(), "action": action}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_KEY not set")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_service_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_SERVICE_KEY not set")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def _get_bearer_token(authorization: str | None) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization: Bearer <token>")
    return authorization.split(" ", 1)[1].strip()

def _get_user_from_token(supabase: Client, token: str):
    user_resp = supabase.auth.get_user(token)
    user = getattr(user_resp, "user", None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

def _verify_mailgun_signature(timestamp: str, token: str, signature: str) -> bool:
    if not MAILGUN_SIGNING_KEY:
        raise HTTPException(status_code=500, detail="MAILGUN_SIGNING_KEY not set")
    if not timestamp or not token or not signature:
        return False
    message = f"{timestamp}{token}".encode("utf-8")
    digest = hmac.new(MAILGUN_SIGNING_KEY.encode("utf-8"), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)

def get_nomi_info(zip_code: str) -> dict:
    nomi = pgeocode.Nominatim('us')
    nomi_result = nomi.query_postal_code(zip_code)

    nomi_info = {
        "state_code": str(nomi_result.state_code),
        "county_name": str(nomi_result.county_name),
        "fips_code": str(int(nomi_result.county_code)),
        "coords": (str(nomi_result.latitude), str(nomi_result.longitude))
    }

    return nomi_info

def haversine(lat1, lon1, lat2, lon2):
        r = 6371.0  # km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        return 2 * r * math.asin(math.sqrt(a))

@app.get("/scout")
async def scout(zip_code: str = USF_ZIP_CODE) -> dict:
    nomi = get_nomi_info(zip_code)

    # Tampa + neighbouring counties
    TAMPA_COUNTIES = ["Hillsborough", "Pinellas", "Pasco", "Polk", "Manatee", "Hernando"]
    county_short = nomi["county_name"].replace(" County", "").strip()
    watch_counties = TAMPA_COUNTIES if county_short in TAMPA_COUNTIES else [county_short]

    headers = {"User-Agent": "CrisisNet (contact: ni717713@ucf.edu)"}

    # 1) Active alerts
    alerts_resp = requests.get(
        f"https://api.weather.gov/alerts/active?area={nomi['state_code']}",
        headers=headers,
        timeout=10,
    )
    alerts_json = alerts_resp.json() if alerts_resp.ok else {}

    # 2) Recent (past 7 days) alerts — gives demo data even when nothing is active
    from datetime import timedelta
    start_iso = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
    recent_resp = requests.get(
        f"https://api.weather.gov/alerts?area={nomi['state_code']}&start={start_iso}",
        headers=headers,
        timeout=10,
    )
    recent_json = recent_resp.json() if recent_resp.ok else {}

    # Merge, de-duplicate by alert id
    seen_ids: set = set()
    all_features: list = []
    for feature in alerts_json.get("features", []) + recent_json.get("features", []):
        aid = feature.get("properties", {}).get("id") or id(feature)
        if aid not in seen_ids:
            seen_ids.add(aid)
            all_features.append(feature)

    matching = []
    for feature in all_features:
        props = feature.get("properties", {})
        area = props.get("areaDesc", "")
        area_lower = area.lower()
        if any(c.lower() in area_lower for c in watch_counties):
            matching.append({
                "id": props.get("id"),
                "event": props.get("event"),
                "severity": props.get("severity"),
                "urgency": props.get("urgency"),
                "certainty": props.get("certainty"),
                "headline": props.get("headline"),
                "location": area,
                "alert_sent": props.get("sent"),
                "effective_at": props.get("effective"),
                "expires": props.get("expires"),
                "source": "NWS",
            })

    _log_activity("Scout", f"ingested {len(matching)} NWS alerts for zip {zip_code}")
    _touch_agent("scout", f"ingested {len(matching)} alerts for {zip_code}")

    return {
        "zip_code": zip_code,
        "alerts": matching,
    }

# ── AGENT STATUS ─────────────────────────────────────────────
_AGENT_META = [
    {"id": "scout",       "name": "Scout Agent",       "shortName": "SCOUT",    "icon": "scout",       "description": "Monitors NWS, FEMA & local feeds for active events"},
    {"id": "triage",      "name": "Triage Agent",      "shortName": "TRIAGE",   "icon": "triage",      "description": "Scores severity via population density & alert data"},
    {"id": "resource",    "name": "Resource Agent",    "shortName": "RESOURCE",  "icon": "resource",   "description": "Matches shelters and aid programs to affected areas"},
    {"id": "comms",       "name": "Comms Agent",       "shortName": "COMMS",    "icon": "comms",       "description": "Drafts multilingual alerts & dispatches emails via Mailgun"},
    {"id": "coordinator", "name": "Coordinator Agent", "shortName": "COORD",    "icon": "coordinator", "description": "Orchestrates all agents via Google ADK ParallelAgent"},
]

@app.get("/agent-status")
async def get_agent_status():
    result = []
    for meta in _AGENT_META:
        state = _agent_last.get(meta["id"], {})
        recent = [e["message"] for e in _activity_log if e["agent"].lower() == meta["id"]]
        result.append({
            **meta,
            "active": True,
            "last_action": state.get("action", "idle"),
            "actions": recent[:6] or [state.get("action", "idle")],
        })
    return result

# ── HISTORICAL DATA (static) ────────────────────────────────
HISTORICAL_DATA = [
    {"name": "Hurricane Milton",   "year": 2024, "incidents": 512, "resources": 156},
    {"name": "Hurricane Irma",     "year": 2017, "incidents": 487, "resources": 134},
    {"name": "Hurricane Ian",      "year": 2022, "incidents": 342, "resources": 89},
    {"name": "Hurricane Helene",   "year": 2024, "incidents": 278, "resources": 91},
    {"name": "TS Debby",           "year": 2024, "incidents": 201, "resources": 67},
    {"name": "TS Eta",             "year": 2020, "incidents": 156, "resources": 45},
    {"name": "Hurricane Hermine",  "year": 2016, "incidents": 98,  "resources": 32},
    {"name": "TS Fay",             "year": 2020, "incidents": 67,  "resources": 21},
    {"name": "Hurricane Michael",  "year": 2018, "incidents": 389, "resources": 112},
    {"name": "TS Alberto",         "year": 2018, "incidents": 45,  "resources": 15},
]

@app.get("/snowflake/historical")
async def get_historical_data():
    return HISTORICAL_DATA

# ── POPULATION SIZE (Census API) ─────────────────────────────
@app.get("/population_size")
async def get_population_size(zip_code: str = USF_ZIP_CODE):
    if not CENSUS_API_KEY:
        raise HTTPException(status_code=500, detail="CENSUS_API_KEY not set")
    url = (
        f"https://api.census.gov/data/2020/dec/pl"
        f"?get=P1_001N&for=zip%20code%20tabulation%20area:{zip_code}"
        f"&key={CENSUS_API_KEY}"
    )
    resp = requests.get(url, timeout=10)
    if not resp.ok:
        return {"zip_code": zip_code, "population": None, "error": f"Census API {resp.status_code}"}
    data = resp.json()
    pop = int(data[1][0]) if len(data) > 1 else None
    _log_activity("Triage", f"Census lookup for zip {zip_code} — pop {pop}")
    _touch_agent("triage", f"Census lookup {zip_code} — pop {pop}")
    return {"zip_code": zip_code, "population": pop, "source": "Census 2020"}

@app.get("/resourceMatcher")
async def get_closest_shelters(zip_code: str = USF_ZIP_CODE, num_of_shelter: int = 5) -> list:

    lat_i, lng_i = get_nomi_info(zip_code)["coords"]
    data_path = Path(__file__).parent / "shelters_geocoded.json"
    shelters = json.loads(data_path.read_text(encoding="utf-8"))

    candidates = []
    for s in shelters:
        s_lat = s.get("lat")
        s_lng = s.get("lng")
        if s_lat is None or s_lng is None:
            continue
        dist_km = haversine(float(lat_i), float(lng_i), s_lat, s_lng)
        candidates.append({**s, "distance_km": dist_km})

    candidates.sort(key=lambda x: x["distance_km"])
    result = candidates[:num_of_shelter]
    _log_activity("Resource", f"matched {len(result)} shelters near zip {zip_code}")
    _touch_agent("resource", f"matched {len(result)} shelters near {zip_code}")
    return result

def _normalize_model_name(model_name: str | None) -> str:
    candidate = (model_name or "").strip()
    # Defensive fallback: API keys are sometimes accidentally pasted into GEMINI_MODEL.
    if not candidate or candidate.startswith("AIza"):
        candidate = DEFAULT_TRANSLATION_MODEL
    if not candidate.startswith("models/"):
        candidate = f"models/{candidate}"
    return candidate

@lru_cache(maxsize=1)
def _get_genai_client() -> genai.Client:
    if not GEMINI_API_KEY:
        raise ValueError("missing_api_key")
    return genai.Client(api_key=GEMINI_API_KEY)

def _translation_prompt(text: str, target_lang: str) -> str:
    return (
        f"Translate the following text to {target_lang}. "
        "Return only the translated text with no extra commentary.\n\n"
        f"{text}"
    )

@app.get("/translate")
@app.get("/translate_text")
async def translate_text(text: str, target_lang: str = "en") -> dict:
    target_lang = (target_lang or "en").strip().lower()
    if target_lang == "en":
        return {
            "translated_text": text,
            "source_lang": "en",
            "target_lang": "en",
            "error": None,
        }

    api_key = GEMINI_API_KEY
    if not api_key:
        return {
            "translated_text": text,
            "source_lang": "en",
            "target_lang": target_lang,
            "error": "missing_api_key",
        }

    try:
        model_name = _normalize_model_name(os.getenv("GEMINI_MODEL"))
        client = _get_genai_client()
        response = await client.aio.models.generate_content(
            model=model_name,
            contents=_translation_prompt(text=text, target_lang=target_lang),
        )
        translated = (response.text or "").strip()
        if not translated:
            translated = text
        _log_activity("Comms", f"translated alert to {target_lang}")
        _touch_agent("comms", f"translated to {target_lang}")
        return {
            "translated_text": translated,
            "source_lang": "en",
            "target_lang": target_lang,
            "error": None,
        }
    except Exception as exc:
        return {
            "translated_text": text,
            "source_lang": "en",
            "target_lang": target_lang,
            "error": f"exception_{type(exc).__name__}: {exc}",
        }


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"

class UserStuffRequest(BaseModel):
    email: str
    opt_in: bool = True
    severity: str | None = None
    zip_code: str | None = None

class AlertSendRequest(BaseModel):
    dry_run: bool = False
    mock_severity: str | None = None  # e.g. "Moderate"
    mock_event: str | None = None
    mock_headline: str | None = None

class EmailRequest(BaseModel):
    email: str
    name: str

class SummarizeRequest(BaseModel):
    query: str
    zip_code: str = USF_ZIP_CODE

class ReportRequest(BaseModel):
    description: str
    lat: float
    lng: float
    reporter: str | None = None
    zip_code: str | None = None


@app.post("/translate")
async def translate_endpoint(payload: TranslateRequest) -> dict:
    return translate_text(payload.text, payload.target_lang)


def send_mailgun_email(to_email: str, subject: str, text: str) -> dict:
    if not MAILGUN_API_KEY:
        return {"ok": False, "error": "MAILGUN_API_KEY not set"}
    if not MAILGUN_DOMAIN:
        return {"ok": False, "error": "MAILGUN_DOMAIN not set"}
    if not MAILGUN_FROM:
        return {"ok": False, "error": "MAILGUN_FROM not set"}

    resp = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": MAILGUN_FROM,
            "to": to_email,
            "subject": subject,
            "text": text,
        },
    )
    return {"ok": resp.ok, "status_code": resp.status_code, "text": resp.text}

@app.post("/auth/anon")
def auth_anon() -> dict:
    supabase = get_supabase_client()
    resp = supabase.auth.sign_in_anonymously()
    session = getattr(resp, "session", None)
    user = getattr(resp, "user", None)
    if not session or not user:
        raise HTTPException(status_code=500, detail="Anonymous sign-in failed")
    return {
        "user_id": user.id,
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "expires_in": session.expires_in,
        "token_type": session.token_type,
    }

@app.get("/user-stuff")
def user_stuff_get(authorization: str | None = Header(default=None)) -> dict:
    supabase = get_supabase_client()
    token = _get_bearer_token(authorization)
    user = _get_user_from_token(supabase, token)
    supabase.postgrest.auth(token)
    resp = supabase.table("user_stuff").select("*").eq("user_id", user.id).execute()
    return {"data": resp.data}

@app.post("/user-stuff")
def user_stuff_upsert(payload: UserStuffRequest, authorization: str | None = Header(default=None)) -> dict:
    supabase = get_supabase_client()
    token = _get_bearer_token(authorization)
    user = _get_user_from_token(supabase, token)
    supabase.postgrest.auth(token)
    existing = supabase.table("user_stuff").select("*").eq("user_id", user.id).execute()
    existing_row = existing.data[0] if existing.data else None
    data = {
        "user_id": user.id,
        "email": payload.email,
        "opt_in": payload.opt_in,
        "severity": payload.severity,
        "zip_code": payload.zip_code,
    }
    resp = supabase.table("user_stuff").upsert(data).execute()
    if payload.opt_in and not (existing_row and existing_row.get("opt_in")):
        send_mailgun_email(
            to_email=payload.email,
            subject="You're opted in to alerts",
            text="Thanks for opting in! You'll receive alerts based on your preferences.",
        )
    return {"data": resp.data}

def _severity_rank(sev: str) -> int:
    sev = (sev or "").strip().lower()
    order = {
        "extreme": 4,
        "severe": 3,
        "moderate": 2,
        "minor": 1,
        "unknown": 0,
    }
    return order.get(sev, 0)

def _passes_severity(alert_sev: str, pref: str | None) -> bool:
    pref = (pref or "").strip().lower()
    if pref == "severe+":
        return _severity_rank(alert_sev) >= _severity_rank("severe")
    if pref == "moderate+":
        return _severity_rank(alert_sev) >= _severity_rank("moderate")
    if pref == "minor+":
        return _severity_rank(alert_sev) >= _severity_rank("minor")
    if pref == "extreme":
        return _severity_rank(alert_sev) >= _severity_rank("extreme")
    return True

def _alert_key(alert: dict) -> str:
    if alert.get("id"):
        return str(alert["id"])
    parts = [
        str(alert.get("event") or ""),
        str(alert.get("headline") or ""),
        str(alert.get("effective") or ""),
        str(alert.get("sent") or ""),
    ]
    return "|".join(parts)

async def _alerts_loop() -> None:
    while True:
        try:
            await send_alerts()
        except Exception:
            # Avoid crashing the loop; consider logging in production.
            pass
        await asyncio.sleep(max(ALERTS_POLL_SECONDS, 60))

@app.on_event("startup")
async def _start_alerts_loop() -> None:
    global _alerts_task
    if ALERTS_POLL_SECONDS > 0:
        _alerts_task = asyncio.create_task(_alerts_loop())

@app.on_event("shutdown")
async def _stop_alerts_loop() -> None:
    global _alerts_task
    if _alerts_task:
        _alerts_task.cancel()
        _alerts_task = None

@app.post("/alerts/send")
async def send_alerts(payload: AlertSendRequest = AlertSendRequest()) -> dict:
    supabase = get_supabase_service_client()
    users_resp = supabase.table("user_stuff").select("*").eq("opt_in", True).execute()
    users = users_resp.data or []

    sent = []
    skipped = []

    for row in users:
        email = row.get("email")
        zip_code = row.get("zip_code")
        severity_pref = row.get("severity")

        if not email or not zip_code:
            skipped.append({"user_id": row.get("user_id"), "reason": "missing email or zip_code"})
            continue

        if payload.mock_severity:
            alerts = [{
                "event": payload.mock_event or "Test Alert",
                "severity": payload.mock_severity,
                "headline": payload.mock_headline or "This is a test alert for your area",
                "area": zip_code,
                "source": "MOCK",
            }]
        else:
            scout_resp = await scout(zip_code=zip_code)
            alerts = scout_resp.get("alerts", [])
        filtered = [a for a in alerts if _passes_severity(a.get("severity", ""), severity_pref)]

        if not filtered:
            skipped.append({"user_id": row.get("user_id"), "reason": "no matching alerts"})
            continue

        existing_keys = row.get("last_alert_ids") or []
        if isinstance(existing_keys, str):
            existing_keys = [existing_keys]

        new_alerts = []
        new_keys = []
        for alert in filtered:
            key = _alert_key(alert)
            if key and key not in existing_keys:
                new_alerts.append(alert)
                new_keys.append(key)

        if not new_alerts:
            skipped.append({"user_id": row.get("user_id"), "reason": "no new alerts"})
            continue

        lines = []
        for a in new_alerts:
            lines.append(f"{a.get('event')} ({a.get('severity')}) - {a.get('headline')}")
        body = "Active alerts for your area:\n\n" + "\n".join(lines)

        if payload.dry_run:
            sent.append({"email": email, "count": len(new_alerts), "dry_run": True})
            continue

        email_resp = send_mailgun_email(
            to_email=email,
            subject="Active alerts in your area",
            text=body,
        )
        updated_keys = (existing_keys + new_keys)[-200:]
        supabase.table("user_stuff").update({"last_alert_ids": updated_keys}).eq("user_id", row.get("user_id")).execute()
        sent.append({"email": email, "count": len(filtered), "email_ok": email_resp.get("ok")})

    _log_activity("Comms", f"dispatched alerts to {len(sent)} subscribers")
    _touch_agent("comms", f"dispatched to {len(sent)} subscribers")
    return {"sent": sent, "skipped": skipped}

@app.post("/mailgun/webhook")
async def mailgun_webhook(request: Request) -> dict:
    form = await request.form()
    timestamp = form.get("timestamp")
    token = form.get("token")
    signature = form.get("signature")
    if not _verify_mailgun_signature(str(timestamp or ""), str(token or ""), str(signature or "")):
        raise HTTPException(status_code=401, detail="Invalid Mailgun signature")

    event = str(form.get("event") or "").lower()
    recipient = form.get("recipient") or form.get("email")
    if not recipient:
        raise HTTPException(status_code=400, detail="Missing recipient")

    supabase = get_supabase_service_client()

    if event in {"unsubscribed", "complained", "bounced"}:
        resp = supabase.table("user_stuff").update({"opt_in": False}).eq("email", recipient).execute()
        return {"ok": True, "event": event, "updated": resp.data}

    return {"ok": True, "event": event}

@app.get("/comms")
async def comms() -> dict:
    return await send_alerts()

# ── ACTIVITY STREAM ─────────────────────────────────────────────
@app.get("/activity-stream")
async def activity_stream():
    items = list(_activity_log)
    return {"messages": [i["message"] for i in items], "latest": items[0]["message"] if items else "System idle"}

# ── AI SUMMARIZER ───────────────────────────────────────────────
@app.post("/summarize")
async def summarize(payload: SummarizeRequest) -> dict:
    client = _get_genai_client()
    model_name = _normalize_model_name(os.getenv("GEMINI_MODEL"))

    scout_data = await scout(zip_code=payload.zip_code)
    alerts = scout_data.get("alerts", [])
    shelters = await get_closest_shelters(zip_code=payload.zip_code, num_of_shelter=5)

    alerts_text = json.dumps(alerts[:10], indent=2) if alerts else "No active alerts."
    shelters_text = json.dumps(shelters[:5], indent=2) if shelters else "No shelters found."

    prompt = (
        "You are a crisis response AI assistant for CrisisNet. "
        "Given the live NWS alerts and nearby shelters below, answer the user's question concisely.\n\n"
        f"User question: {payload.query}\n\n"
        f"Active NWS alerts:\n{alerts_text}\n\n"
        f"Nearest shelters:\n{shelters_text}\n\n"
        "Provide a clear, actionable answer. If referencing specific alerts or shelters, cite them."
    )

    try:
        response = await client.aio.models.generate_content(model=model_name, contents=prompt)
        answer = (response.text or "").strip() or "Unable to generate summary."
    except Exception as exc:
        answer = f"Summarizer error: {type(exc).__name__}"

    _log_activity("Coordinator", f"summarized {len(alerts)} alerts for zip {payload.zip_code}")
    _touch_agent("coordinator", f"summarized query for {payload.zip_code}")
    return {"answer": answer, "alert_count": len(alerts), "shelter_count": len(shelters)}

# ── INCIDENT REPORT + TRIAGE ───────────────────────────────────
@app.post("/incidents/report")
async def report_incident(payload: ReportRequest) -> dict:
    incident_id = f"INC-{int(time.time())}"
    zip_code = payload.zip_code or USF_ZIP_CODE

    scout_data = await scout(zip_code=zip_code)
    alerts = scout_data.get("alerts", [])

    client = _get_genai_client()
    model_name = _normalize_model_name(os.getenv("GEMINI_MODEL"))

    triage_prompt = (
        "You are a disaster triage AI. Assign a priority to this incident report.\n"
        "P1 = Critical (imminent danger to life), P2 = High (significant threat), P3 = Moderate (advisory level).\n\n"
        f"Report: {payload.description}\n"
        f"Location: {payload.lat}, {payload.lng}\n"
        f"Current NWS alerts in area: {json.dumps(alerts[:5])}\n\n"
        "Respond with ONLY the priority code: P1, P2, or P3"
    )

    try:
        response = await client.aio.models.generate_content(model=model_name, contents=triage_prompt)
        raw = (response.text or "").strip().upper()
        priority = raw if raw in ("P1", "P2", "P3") else "P2"
    except Exception:
        priority = "P2"

    _log_activity("Triage", f"scored {incident_id} → {priority}")
    _touch_agent("triage", f"scored {incident_id} → {priority}")
    _log_activity("Coordinator", f"new report {incident_id} triaged and dispatched")
    _touch_agent("coordinator", f"dispatched {incident_id}")

    return {
        "incident_id": incident_id,
        "priority": priority,
        "description": payload.description,
        "lat": payload.lat,
        "lng": payload.lng,
    }
