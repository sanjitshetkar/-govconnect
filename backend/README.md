# GovConnect — FastAPI Backend & Supabase PostgreSQL Service

Central REST API server for the **GovConnect** government-services assistant platform.

---

## 🏛️ Architecture Overview

```
                      React (Shivang)
                            │
                            ▼
               FastAPI Backend (Sumedha / Sampada)
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
      Supabase PostgreSQL  AI Chatbot  Document AI
        (7 Core Tables)     (Sanjit)   (Sangharsh)
```

### Confirmed Database Platform: **Supabase PostgreSQL**
All data is stored in a hosted Supabase PostgreSQL instance across **7 core tables**:
1. `users` — Citizen profiles (demographics, income, domicile, assurance level)
2. `schemes` — Official government schemes & funding details
3. `scheme_eligibility` — Rules engine for eligibility criteria (age, income, occupation, residence)
4. `applications` — Multi-stage application lifecycle tracking (`draft`, `ready_to_submit`, `submitted`, `approved`)
5. `documents` — Metadata and Supabase Storage file URLs for citizen certificates
6. `document_verifications` — OCR / Document AI extraction results and mismatch audit logs
7. `reminders` — Proactive statutory deadline and expiry alerts

---

## 🚀 Quick Start Guide

### 1. Environment Setup

From the project root:

```powershell
# Activate the virtual environment
.\.venv\Scripts\activate

# Install all backend requirements
pip install -r backend/requirements.txt
```

### 2. Configure Supabase (.env)

Create a `.env` file inside `backend/` or in the project root:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-or-service-role-key
PORT=8000
HOST=0.0.0.0
```

> **Note:** If `.env` is omitted or contains placeholder values, the backend automatically runs in **Local Dev Mode** with pre-seeded in-memory data, enabling instant testing without internet or Supabase credentials.

### 3. Run Database Schema in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the entire contents of [`backend/schema.sql`](file:///d:/ibmproject/-govconnect/backend/schema.sql).
4. Click **Run**. This creates all 7 tables, indexes, constraints, and initial government scheme seed records.

### 4. Start the FastAPI Server

```powershell
cd backend
python main.py
# or
uvicorn main:app --reload --port 8000
```

Server will be running at:
- **Base URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

---

## 🧪 Automated Testing

Run the full pytest suite:

```powershell
pytest backend/test_backend.py -v
```

---

## 📡 API Reference & Team Integration

All JSON responses strictly follow the team contract: `snake_case` keys and `{"status": "success", ...}` wrappers.

### 1. Health Checks
* `GET /` — `{"status": "success", "message": "GovConnect backend is running"}`
* `GET /api/health` — Returns DB connection state & timestamp

---

### 2. Users API (`/api/users`)
* `GET /api/users` — List all registered users
* `GET /api/users/{user_id}` — Get profile for specific citizen (e.g. `usr-digilocker-8849`)
* `POST /api/users` — Create new citizen profile
* `PUT /api/users/{user_id}` — Update citizen profile fields (income, state, address, etc.)

---

### 3. Schemes API (`/api/schemes`)
* `GET /api/schemes` — Discover active schemes (supports query parameters: `?category=...&state=...&search=...`)
* `GET /api/schemes/{scheme_id}` — Get scheme details and eligibility rules
* `POST /api/schemes` — Register a new government scheme

---

### 4. Applications API (`/api/applications`)
* `GET /api/applications/{user_id}` — Get all applications for a citizen
* `GET /api/applications/detail/{application_id}` — Get specific application details with form data
* `POST /api/applications` — Create/draft application
* `PUT /api/applications/{application_id}` — Update status (`draft`, `ready_to_submit`, `submitted`, `in_review`, `approved`), progress %, form data, and notes

---

### 5. Document AI Integration (`/api/documents`) — *For Sangharsh*
* `GET /api/documents/{user_id}` — List uploaded certificates for citizen with verification flags
* `GET /api/documents/detail/{document_id}` — View document details
* `POST /api/documents` — Register newly uploaded document metadata
* `POST /api/documents/{document_id}/verify` — **Document AI OCR Webhook**:
  ```json
  {
    "document_id": "doc-aadhaar-01",
    "matched": true,
    "confidence_score": 99.8,
    "extracted_fields": {
      "fullName": "Shivang Khorjuvekar",
      "dob": "1995-11-20",
      "idNumber": "XXXX-XXXX-8421"
    },
    "flags": [],
    "security_summary": "UIDAI PKI validated."
  }
  ```

---

### 6. Conversational AI & Recommendations (`/api/recommendations`) — *For Sanjit & Shivang*
* `GET /api/recommendations/{user_id}` — Returns ranked schemes matched against citizen profile:
  ```json
  {
    "status": "success",
    "data": {
      "user_id": "usr-digilocker-8849",
      "eligible_count": 2,
      "recommendations": [
        {
          "scheme_id": "scheme-sisfs-01",
          "scheme_name": "Startup India Seed Fund Scheme (SISFS)",
          "is_eligible": true,
          "match_score": 100,
          "matched_criteria": [
            "Age 30 falls within required bracket (18-65 yrs)",
            "Annual income complies with ceiling",
            "Executive/Founder profile matches enterprise grant criteria"
          ],
          "missing_requirements": []
        }
      ]
    }
  }
  ```

---

### 7. Reminders & Deadlines (`/api/reminders`)
* `GET /api/reminders/{user_id}` — List active deadline and document alerts
* `POST /api/reminders` — Create custom deadline reminder
* `PUT /api/reminders/{reminder_id}/dismiss` — Mark reminder as sent/read

---

## 🔒 Security Best Practices
- The Supabase Secret Key must **never** be committed to Git or exposed in React.
- Always keep `.env` in `.gitignore`.
