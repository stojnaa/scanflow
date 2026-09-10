import os
from pathlib import Path

from dotenv import load_dotenv


BACKEND_ENV = Path(__file__).resolve().parents[1] / "backend" / ".env"
load_dotenv(BACKEND_ENV)

BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.environ["DB_PASSWORD"],
    "database": os.getenv("DB_NAME", "scanflow"),
}