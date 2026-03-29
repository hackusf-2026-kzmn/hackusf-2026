from fastapi import FastAPI, HTTPException, Header, Request
from pydantic import BaseModel
from google import genai
import requests
import pgeocode
import json
import math
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
import os
import hmac
import hashlib
from supabase import create_client, Client

load_dotenv(Path(__file__).parent / ".env")
CENSUS_API_KEY = os.getenv("CENSUS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
DEFAULT_TRANSLATION_MODEL = "gemini-2.5-flash-lite"
USF_ZIP_CODE = "33071"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MAILGUN_SIGNING_KEY = os.getenv("MAILGUN_SIGNING_KEY")
MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")
MAILGUN_FROM = os.getenv("MAILGUN_FROM")

app = FastAPI()

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_KEY not set")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

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

    county_short = nomi["county_name"].replace(" County", "").strip()

    headers = {"User-Agent": "CrisisNet (contact: ni717713@ucf.edu)"}
    alerts_resp = requests.get(
        f"https://api.weather.gov/alerts/active?area={nomi['state_code']}",
        headers=headers,
        timeout=10,
    )

    alerts_json = alerts_resp.json() if alerts_resp.ok else {}

    matching = []
    for feature in alerts_json.get("features", []):
        props = feature.get("properties", {})
        area = props.get("areaDesc", "")
        if county_short.lower() in area.lower():  # fix: filter before appending
            matching.append({
                "id": props.get("id"),
                "event": props.get("event"),
                "severity": props.get("severity"),
                "urgency": props.get("urgency"),
                "certainty": props.get("certainty"),
                "headline": props.get("headline"),
                "area": area,
                "sent": props.get("sent"),
                "effective": props.get("effective"),
                "expires": props.get("expires"),
                "source": "NWS",
                "url": props.get("web") or props.get("@id"),
            })

    return {
        "zip_code": zip_code,
        "alerts": matching,  # fix: return filtered list
    }

@app.get("/population_size")
async def get_population_size(zip_code: str = USF_ZIP_CODE):
    pass

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
    return candidates[:num_of_shelter]

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
    severity: str | None = None  # "Moderate+", "Severe+", "Extreme", "Minor+"
    zip_code: str | None = None

class AlertSendRequest(BaseModel):
    dry_run: bool = False
    mock_severity: str | None = None  # e.g. "Moderate"
    mock_event: str | None = None
    mock_headline: str | None = None

class EmailRequest(BaseModel):
    email: str
    name: str


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

@app.post("/user-stuff/test")
def user_stuff_test(authorization: str | None = Header(default=None)) -> dict:
    supabase = get_supabase_client()
    token = _get_bearer_token(authorization)
    user = _get_user_from_token(supabase, token)

    supabase.postgrest.auth(token)
    payload = {
        "user_id": user.id,
        "email": "test@example.com",
        "opt_in": True,
    }
    insert_resp = supabase.table("user_stuff").insert(payload).execute()
    select_resp = supabase.table("user_stuff").select("*").eq("user_id", user.id).execute()

    return {
        "insert": insert_resp.data,
        "select": select_resp.data,
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
            subject="You’re opted in to alerts",
            text="Thanks for opting in! You’ll receive alerts based on your preferences.",
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

@app.post("/alerts/send")
async def send_alerts(payload: AlertSendRequest = AlertSendRequest()) -> dict:
    supabase = get_supabase_client()
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

    supabase = get_supabase_client()

    if event in {"unsubscribed", "complained", "bounced"}:
        resp = supabase.table("user_stuff").update({"opt_in": False}).eq("email", recipient).execute()
        return {"ok": True, "event": event, "updated": resp.data}

    return {"ok": True, "event": event}

@app.get("/comms")
async def comms() -> dict:
    return await send_alerts()
