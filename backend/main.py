"""
GovConnect FastAPI Backend Main Application
Central API entry point for GovConnect government-services assistant.
"""

from datetime import datetime
import os
import sys
from pathlib import Path
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory is in sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from database import IS_LIVE_SUPABASE, SUPABASE_URL
from routes.users import router as users_router
from routes.schemes import router as schemes_router
from routes.applications import router as applications_router
from routes.documents import router as documents_router
from routes.recommendations import router as recommendations_router
from routes.reminders import router as reminders_router

app = FastAPI(
    title="GovConnect API",
    description="Central API backend for GovConnect: Citizen Profiles, Schemes, Applications, Document AI, Recommendations, and Reminders.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for React frontend (Vite / localhost) and external microservices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Route Handlers
app.include_router(users_router)
app.include_router(schemes_router)
app.include_router(applications_router)
app.include_router(documents_router)
app.include_router(recommendations_router)
app.include_router(reminders_router)


@app.get("/")
def root_health_check() -> dict:
    """
    Root health check endpoint confirming GovConnect backend is operational.
    """
    return {
        "status": "success",
        "message": "GovConnect backend is running"
    }


@app.get("/api/health")
def api_detailed_health() -> dict:
    """
    Detailed health check including database connection status and server timestamp.
    """
    return {
        "status": "success",
        "service": "GovConnect Backend API",
        "version": "1.0.0",
        "database": {
            "is_live_supabase": IS_LIVE_SUPABASE,
            "supabase_url": SUPABASE_URL if IS_LIVE_SUPABASE else "Using local in-memory fallback",
        },
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"[GovConnect API] Starting server on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
