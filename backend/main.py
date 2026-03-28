from fastapi import FastAPI
import requests

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
 
@app.get("/scout")
async def scout(state="FL", latitude=27.9506, longitude=-82.4572) -> dict:
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
