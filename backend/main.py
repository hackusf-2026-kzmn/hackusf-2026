from fastapi import FastAPI
import requests
import pgeocode
import pandas as pd
import asyncio

app = FastAPI()

USF_ZIP_CODE="33620"
 
@app.get("/scout")
async def scout(zip_code: str=USF_ZIP_CODE) -> dict:
    nomi = pgeocode.Nominatim('us')
    nomi_result = nomi.query_postal_code(zip_code)
    state = nomi_result.state_code
    print(state)
    latitude = str(nomi_result.latitude)
    longitude = str(nomi_result.longitude)
    headers = {"User-Agent": "CrisisNet (contact: ni717713@ucf.edu)"}
    alerts_resp = requests.get(
        f"https://api.weather.gov/alerts/active?area={state}",
        headers=headers,
        timeout=10,
    )
    points_resp = requests.get(
        f"https://api.weather.gov/points/{latitude},{longitude}",
        headers=headers,
        timeout=10,
    )

    alerts_json = alerts_resp.json() if alerts_resp.ok else {}
    points_json = points_resp.json() if points_resp.ok else {}

    alerts = []
    for feature in alerts_json.get("features", []):
        props = feature.get("properties", {})
        alerts.append(
            {
                "id": props.get("id"),
                "event": props.get("event"),
                "severity": props.get("severity"),
                "urgency": props.get("urgency"),
                "certainty": props.get("certainty"),
                "headline": props.get("headline"),
                "area": props.get("areaDesc"),
                "sent": props.get("sent"),
                "effective": props.get("effective"),
                "expires": props.get("expires"),
                "source": "NWS",
                "url": props.get("web") or props.get("@id"),
            }
        )

    forecast_url = points_json.get("properties", {}).get("forecast")
    forecast_office = points_json.get("properties", {}).get("cwa")

    return {
        "state": state,
        "alerts": alerts,
        "forecast": {
            "office": forecast_office,
            "url": forecast_url,
        },
    }


asyncio.run(scout())