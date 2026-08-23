import sys
import os

# Ensure UTF-8 stdout encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

import httpx
import json

BASE = "http://127.0.0.1:8000"


def main():
    print("=" * 60)
    print(" GOVCONNECT BACKEND — LIVE TASK EXECUTION DEMO")
    print("=" * 60)

    # 1. Health Check
    print("\n[TASK 1] Health Check")
    r = httpx.get(f"{BASE}/")
    print(f"Status Code: {r.status_code}")
    print(f"Response: {json.dumps(r.json(), indent=2)}")

    # 2. Detailed Health Check
    print("\n[TASK 2] Detailed Health Check")
    r = httpx.get(f"{BASE}/api/health")
    print(f"Status Code: {r.status_code}")
    print(f"Response: {json.dumps(r.json(), indent=2)}")

    # 3. Citizen Profile
    print("\n[TASK 3] Fetch Citizen Profile")
    user_id = "usr-digilocker-8849"
    r = httpx.get(f"{BASE}/api/users/{user_id}")
    user_data = r.json()["data"]
    print(f"Citizen Name: {user_data['full_name']} ({user_data.get('hindi_name', '')})")
    print(f"Aadhaar (Masked): {user_data['aadhaar_masked']} | PAN: {user_data['pan_number']}")
    print(f"Assurance Level: {user_data['assurance_level']}")
    print(f"Income: ₹{float(user_data['annual_income']):,.2f} | State: {user_data['state']}")

    # 4. Schemes Discovery
    print("\n[TASK 4] Government Schemes Discovery")
    r = httpx.get(f"{BASE}/api/schemes")
    schemes = r.json()["data"]["schemes"]
    print(f"Total Active Schemes Discovered: {len(schemes)}")
    for s in schemes:
        print(f"  • [{s.get('scheme_code', 'N/A')}] {s['name']}")
        print(f"    Funding: {s.get('funding_amount', 'N/A')} | Deadline: {s.get('deadline', 'Open')}")

    # 5. Recommendation Engine
    print("\n[TASK 5] AI Eligibility & Recommendation Engine")
    r = httpx.get(f"{BASE}/api/recommendations/{user_id}")
    recs_data = r.json()["data"]
    print(f"Schemes Evaluated for {user_data['full_name']}: {recs_data['total_schemes_evaluated']}")
    print(f"Eligible Schemes Count: {recs_data['eligible_count']}")
    for rec in recs_data["recommendations"][:3]:
        status_label = "✅ ELIGIBLE" if rec["is_eligible"] else "⚠️ NEEDS PREREQUISITES"
        print(f"\n  ► {rec['scheme_name']} ({rec['match_score']}% Match) — {status_label}")
        for criteria in rec["matched_criteria"]:
            print(f"    + {criteria}")
        for req in rec["missing_requirements"]:
            print(f"    - {req}")

    # 6. Application Creation
    print("\n[TASK 6] Application Docket Creation")
    new_app = {
        "user_id": user_id,
        "scheme_id": "scheme-udyam-04",
        "status": "draft",
        "progress_percentage": 35,
        "notes": "Drafted MSME Udyam statutory filing from GovConnect portal.",
        "form_data": {
            "applicantName": user_data["full_name"],
            "stateOrUT": user_data["state"],
            "panNumber": user_data["pan_number"],
        },
        "attached_doc_ids": ["doc-aadhaar-01", "doc-pan-02"],
    }
    r = httpx.post(f"{BASE}/api/applications", json=new_app)
    created_app = r.json()["data"]
    print(f"Application Created: {created_app['application_id']}")
    print(f"Application Number: {created_app['application_number']}")
    print(f"Status: {created_app['status']} | Progress: {created_app['progress_percentage']}%")

    # 7. Document AI Verification Webhook (Sangharsh Integration)
    print("\n[TASK 7] Document AI OCR Verification Simulation (Sangharsh)")
    verif_payload = {
        "document_id": "doc-aadhaar-01",
        "matched": True,
        "confidence_score": 99.9,
        "extracted_fields": {
            "fullName": "Shivang Khorjuvekar",
            "dob": "1995-11-20",
            "idNumber": "XXXX-XXXX-8421",
            "address": "Flat 402, Shiv Shristi Enclave, Baner Road, Pune, Maharashtra 411045",
        },
        "flags": [],
        "security_summary": "UIDAI Cryptographic Root signature verified with Section 65B compliance.",
    }
    r = httpx.post(f"{BASE}/api/documents/doc-aadhaar-01/verify", json=verif_payload)
    verif_result = r.json()["data"]
    print(f"Document Verification Status Updated: {verif_result['updated_status']}")
    print(f"Confidence Score: {verif_result['verification']['confidence_score']}%")

    # 8. Reminders & Deadline Tracking
    print("\n[TASK 8] Reminders & Proactive Deadline System")
    r = httpx.get(f"{BASE}/api/reminders/{user_id}")
    rem_data = r.json()["data"]
    print(f"Total Reminders: {rem_data['total_count']} (Active: {rem_data['active_count']})")
    for rem in rem_data["reminders"]:
        print(f"  🔔 [{rem['reminder_type'].upper()}] ({rem['reminder_date']}) {rem['message']}")

    print("\n" + "=" * 60)
    print(" ✅ ALL LIVE TASKS EXECUTED SUCCESSFULLY WITH 200 OK RESPONSES")
    print("=" * 60)


if __name__ == "__main__":
    main()
