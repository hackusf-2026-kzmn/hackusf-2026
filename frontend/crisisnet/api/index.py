from fastapi import FastAPI, Request
from .main import app as backend_app

app = FastAPI()

# Mount at both paths so it works regardless of how Vercel passes the path
app.mount("/api", backend_app)
app.mount("/", backend_app)

@app.get("/api/debug")
@app.get("/debug")
async def debug(request: Request):
    return {"path": request.url.path, "method": request.method}
