import sys
from pathlib import Path

# Make the repo root importable so `backend.main` resolves
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.main import app  # noqa: E402, F401 — Vercel detects this ASGI app
