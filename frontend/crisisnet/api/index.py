import sys
from pathlib import Path

# Navigate up from frontend/crisisnet/api/ to the repo root so `backend.main` resolves
_repo_root = str(Path(__file__).resolve().parent.parent.parent.parent)
sys.path.insert(0, _repo_root)

from backend.main import app  # noqa: E402, F401
