from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
import requests
import pgeocode
import pandas as pd
import asyncio
import json
import math
from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

USF_ZIP_CODE="33071"

def get_nomi_info(zip_code: str) -> dict:
    nomi = pgeocode.Nominatim('us')
    nomi_result = nomi.query_postal_code(zip_code)

    nomi_info = {
        "state_code": str(nomi_result.state_code),
        "county_name": str(nomi_result.county_name),
        "coords": (str(nomi_result.latitude), str(nomi_result.longitude))
    }

    return nomi_info

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

def haversine(lat1, lon1, lat2, lon2):
        r = 6371.0  # km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        return 2 * r * math.asin(math.sqrt(a))

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

class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"


def translate_text(text: str, target_lang: str = "en") -> dict:
    if not target_lang or target_lang.lower() == "en":
        return {
            "translated_text": text,
            "source_lang": "en",
            "target_lang": "en",
            "error": None,
        }

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "translated_text": text,
            "source_lang": "en",
            "target_lang": target_lang,
            "error": "missing_api_key",
        }

    try:
        client = genai.Client(api_key=api_key)
        prompt = (
            f"You are a translation engine. Translate the text into {target_lang}. "
            "Return only the translated text with no extra commentary.\n\n"
            f"Text: {text}"
        )
        from google.genai import types
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-001")
        resp = client.models.generate_content(
            model=model_name,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part(
                            text=(
                                f"Translate the following text to {target_lang}. "
                                "Return only the translated text:\n\n"
                                f"{text}"
                            )
                        )
                    ],
                )
            ],
        )
        translated = (resp.text or "").strip()
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


@app.post("/translate")
async def translate_endpoint(payload: TranslateRequest) -> dict:
    return translate_text(payload.text, payload.target_lang)


@app.get("/comms")
async def comms(text: str, target_lang: str = "en") -> dict:
    translated = translate_text(text, target_lang)
    return translated
