from fastapi import FastAPI
import requests
import pgeocode
import pandas as pd

app = FastAPI()

USF_ZIP_CODE="33071"
 
@app.get("/scout")
async def scout(zip_code: str = USF_ZIP_CODE) -> dict:
    nomi = pgeocode.Nominatim('us')
    nomi_result = nomi.query_postal_code(zip_code)

    state_code = str(nomi_result.state_code)
    county_name = str(nomi_result.county_name)  # fix: no int() conversion
    latitude = str(nomi_result.latitude)
    longitude = str(nomi_result.longitude)

    county_short = county_name.replace(" County", "").strip()

    headers = {"User-Agent": "CrisisNet (contact: ni717713@ucf.edu)"}
    alerts_resp = requests.get(
        f"https://api.weather.gov/alerts/active?area={state_code}",
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
<<<<<<< HEAD
        "zip_code": zip_code,
        "alerts": matching  # fix: return filtered list
    }
=======
        "state": state,
        "alerts": alerts,
        "forecast": {
            "office": forecast_office,
            "url": forecast_url,
        },
    }


@app.get("/resourceMatcher")
async def resourceMatcher() -> dict:
    
>>>>>>> 1552211f2e30fafc957b71eb74ed50a7fbdeea5f
