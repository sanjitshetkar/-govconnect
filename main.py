#!/usr/bin/env python3
"""
==============================================================================
GovConnect — Unified Full-Stack Application Launcher
Run: python main.py
==============================================================================
This script orchestrates and boots both:
  1. Frontend & AI Express Server (Port 3000) -> http://localhost:3000
  2. FastAPI Backend & Supabase REST API (Port 8000) -> http://localhost:8000
==============================================================================
"""

import os
import sys
import time
import signal
import subprocess
import webbrowser
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def print_banner():
    print("=" * 70)
    print("🏛️   GovConnect — Personal Government-Service Navigator")
    print("=" * 70)
    print("🚀 Starting Unified Application Server...")
    print(f"📁 Project Root: {ROOT_DIR}")
    print("=" * 70)


def check_prerequisites():
    """Verify Node.js and dependencies exist."""
    try:
        subprocess.run(["node", "-v"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except Exception:
        print("❌ Error: Node.js is not installed or not found in PATH.")
        sys.exit(1)

    if not (ROOT_DIR / "node_modules").exists():
        print("📦 Installing Node.js frontend dependencies (npm install)...")
        subprocess.run("npm install", shell=True, cwd=ROOT_DIR, check=True)


def run():
    print_banner()
    check_prerequisites()

    processes = []

    try:
        # 1. Launch Node.js / Express & Vite Dev Server (Port 3000)
        print("\n⚡ [1/2] Launching Frontend & AI Gateway on http://localhost:3000 ...")
        cmd_frontend = "npm run dev"
        p_frontend = subprocess.Popen(
            cmd_frontend,
            shell=True,
            cwd=str(ROOT_DIR),
            stdout=sys.stdout,
            stderr=sys.stderr,
        )
        processes.append(p_frontend)

        # 2. Launch FastAPI Backend Server (Port 8000) if backend exists
        if (BACKEND_DIR / "main.py").exists():
            print("⚡ [2/2] Launching FastAPI Backend on http://localhost:8000 ...")
            cmd_backend = [
                sys.executable,
                "-m",
                "uvicorn",
                "backend.main:app",
                "--host",
                "0.0.0.0",
                "--port",
                "8000",
                "--reload",
            ]
            p_backend = subprocess.Popen(
                cmd_backend,
                cwd=str(ROOT_DIR),
                stdout=sys.stdout,
                stderr=sys.stderr,
            )
            processes.append(p_backend)

        time.sleep(2)
        print("\n" + "=" * 70)
        print("✅ ALL SERVERS RUNNING SUCCESSFULLY!")
        print("🌐 GovConnect Web App:  http://localhost:3000")
        print("📚 FastAPI Swagger Docs: http://localhost:8000/docs")
        print("💡 Press Ctrl + C in this terminal to stop all servers.")
        print("=" * 70 + "\n")

        # Keep parent script running and monitor child processes
        while True:
            time.sleep(1)
            for p in processes:
                if p.poll() is not None:
                    break

    except KeyboardInterrupt:
        print("\n🛑 Stopping all GovConnect servers gracefully...")
    finally:
        for p in processes:
            try:
                if sys.platform == "win32":
                    subprocess.call(["taskkill", "/F", "/T", "/PID", str(p.pid)])
                else:
                    p.terminate()
            except Exception:
                pass
        print("👋 All servers stopped. Have a great day!")


if __name__ == "__main__":
    run()