import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND_APP = ROOT / "backend"
if str(BACKEND_APP) not in sys.path:
    sys.path.insert(0, str(BACKEND_APP))
