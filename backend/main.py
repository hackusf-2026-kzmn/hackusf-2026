from fastapi import FastAPI
import requests
import pgeocode
import pandas as pd
import asyncio
import json
import math
from pathlib import Path

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
        f"https://api.weather.gov/alerts/active?area={nomi["state_code"]}",
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

@app.get("/resourceMatcher")
async def get_closest_shelters(zip_code: str = USF_ZIP_CODE, num_of_shelter: int = 5) -> list:
    """
    Returns the k closest shelters from shelters_geocoded.json.
    Skips shelters with null lat/lng.
    """

    lat_i, lng_i = get_nomi_info(zip_code)["coords"]
    data_path = Path(__file__).parent / "shelters_geocoded.json"
    shelters = json.loads(data_path.read_text(encoding="utf-8"))

    def haversine(lat1, lon1, lat2, lon2):
        r = 6371.0  # km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        return 2 * r * math.asin(math.sqrt(a))

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

asyncio.run(get_closest_shelters())