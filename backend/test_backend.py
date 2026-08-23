"""
GovConnect Backend Comprehensive Test Suite
Tests all REST endpoints, data validations, recommendation calculation, and document verification workflows.
"""

import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from main import app

client = TestClient(app)


# 1. Health Checks
def test_root_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["message"] == "GovConnect backend is running"


def test_api_detailed_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "database" in data
    assert "timestamp" in data


# 2. Users API
def test_list_users():
    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["users"]) >= 3


def test_get_user_profile():
    response = client.get("/api/users/usr-digilocker-8849")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["full_name"] == "Shivang Khorjuvekar"
    assert data["data"]["email"] == "khorjuvekarshivang@gmail.com"


def test_create_and_update_user():
    new_user = {
        "user_id": "usr-test-101",
        "full_name": "Test User Kumar",
        "phone": "+91 99999 88888",
        "email": "test.user.kumar@govconnect.in",
        "state": "Goa",
        "annual_income": 850000.0,
        "occupation": "Software Engineer"
    }
    create_resp = client.post("/api/users", json=new_user)
    assert create_resp.status_code == 201
    assert create_resp.json()["status"] == "success"

    # Update user
    update_resp = client.put("/api/users/usr-test-101", json={"occupation": "Senior Architect"})
    assert update_resp.status_code == 200
    assert update_resp.json()["data"]["occupation"] == "Senior Architect"


# 3. Schemes API
def test_list_and_filter_schemes():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["schemes"]) >= 4

    # Filter by category
    filtered = client.get("/api/schemes?category=Startup")
    assert filtered.status_code == 200
    schemes = filtered.json()["data"]["schemes"]
    assert any("SISFS" in s["name"] or "Startup" in s["name"] for s in schemes)


def test_get_scheme_detail():
    response = client.get("/api/schemes/scheme-sisfs-01")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["name"] == "Startup India Seed Fund Scheme (SISFS)"
    assert data["data"]["eligibility"] is not None


# 4. Applications API
def test_user_applications_and_create():
    response = client.get("/api/applications/usr-digilocker-8849")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["applications"]) >= 1

    # Create new application
    new_app = {
        "user_id": "usr-digilocker-8849",
        "scheme_id": "scheme-udyam-04",
        "status": "draft",
        "progress_percentage": 30,
        "notes": "Starting MSME registration form"
    }
    create_resp = client.post("/api/applications", json=new_app)
    assert create_resp.status_code == 201
    created_app = create_resp.json()["data"]
    app_id = created_app["application_id"]

    # Update application
    update_resp = client.put(f"/api/applications/{app_id}", json={
        "status": "ready_to_submit",
        "progress_percentage": 90
    })
    assert update_resp.status_code == 200
    assert update_resp.json()["data"]["status"] == "ready_to_submit"


# 5. Documents & Document AI Verification API
def test_documents_and_verification():
    response = client.get("/api/documents/usr-digilocker-8849")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["documents"]) >= 3

    # Upload document metadata
    new_doc = {
        "user_id": "usr-digilocker-8849",
        "document_type": "Udyam Registration Certificate",
        "original_name": "Udyam_MH_2026.pdf",
        "file_url": "https://storage.supabase.co/govconnect-vault/usr-8849/udyam.pdf",
        "file_size_bytes": 1024000
    }
    upload_resp = client.post("/api/documents", json=new_doc)
    assert upload_resp.status_code == 201
    doc_id = upload_resp.json()["data"]["document_id"]

    # Submit Document AI verification
    verif_payload = {
        "document_id": doc_id,
        "matched": True,
        "confidence_score": 98.5,
        "extracted_fields": {
            "fullName": "Shivang Khorjuvekar",
            "idNumber": "UDYAM-MH-26-0048921"
        },
        "flags": [],
        "security_summary": "MSME database match verified."
    }
    verif_resp = client.post(f"/api/documents/{doc_id}/verify", json=verif_payload)
    assert verif_resp.status_code == 200
    assert verif_resp.json()["data"]["updated_status"] == "verified"


# 6. Recommendation Engine API
def test_user_recommendations():
    response = client.get("/api/recommendations/usr-digilocker-8849")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    recs = data["data"]["recommendations"]
    assert len(recs) >= 3
    # First recommendation should have high match score
    assert recs[0]["match_score"] >= 70
    assert "matched_criteria" in recs[0]


# 7. Reminders API
def test_reminders_lifecycle():
    response = client.get("/api/reminders/usr-digilocker-8849")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["reminders"]) >= 1

    # Create new reminder
    new_rem = {
        "user_id": "usr-digilocker-8849",
        "reminder_type": "notice",
        "reminder_date": "2026-12-01",
        "message": "Submit quarterly progress audit report."
    }
    rem_resp = client.post("/api/reminders", json=new_rem)
    assert rem_resp.status_code == 201
    rem_id = rem_resp.json()["data"]["reminder_id"]

    # Dismiss reminder
    dismiss_resp = client.put(f"/api/reminders/{rem_id}/dismiss")
    assert dismiss_resp.status_code == 200
    assert dismiss_resp.json()["data"]["is_sent"] is True
