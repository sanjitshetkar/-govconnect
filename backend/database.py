"""
GovConnect Backend Database Module
Handles Supabase PostgreSQL client connection and queries with local fallback for development.
"""

import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime, date
from dotenv import load_dotenv

# Ensure backend directory is in python search path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Search for .env in current directory or parent directory
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "").strip()

# Supabase Client Import (dynamically imported to support all IDE analyzers & environments)
import importlib
try:
    _supabase_mod = importlib.import_module("supabase")
    create_client = getattr(_supabase_mod, "create_client", None)
    Client = getattr(_supabase_mod, "Client", Any)
except Exception:
    create_client = None
    Client = Any

# Check if Supabase credentials are valid (not default placeholders)
IS_LIVE_SUPABASE = bool(
    create_client is not None
    and SUPABASE_URL
    and SUPABASE_SECRET_KEY
    and "YOUR_PROJECT_ID" not in SUPABASE_URL
    and "your-project-id" not in SUPABASE_URL
    and "YOUR_SECRET_KEY" not in SUPABASE_SECRET_KEY
    and "your-supabase" not in SUPABASE_SECRET_KEY
)

supabase_client: Optional[Client] = None

if IS_LIVE_SUPABASE and create_client is not None:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
        print(f"[GovConnect DB] Successfully connected to live Supabase at: {SUPABASE_URL}")
    except Exception as e:
        print(f"[GovConnect DB] Warning: Failed to connect to Supabase ({e}). Initializing in-memory fallback store.")
        IS_LIVE_SUPABASE = False
else:
    print("[GovConnect DB] Notice: Running in Local Dev Mode (In-Memory Repository). To connect live Supabase, set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.")


# ==============================================================================
# IN-MEMORY REPOSITORY (Populated with GovConnect Seed Data for Instant Local Testing)
# ==============================================================================

class InMemoryStore:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {
            "usr-digilocker-8849": {
                "user_id": "usr-digilocker-8849",
                "full_name": "Shivang Khorjuvekar",
                "hindi_name": "शिवांग खोर्जुवेकर",
                "date_of_birth": "1995-11-20",
                "gender": "Male",
                "phone": "+91 98201 55492",
                "email": "khorjuvekarshivang@gmail.com",
                "aadhaar_masked": "XXXX-XXXX-8421",
                "pan_number": "ABCDE1234F",
                "address": "Flat 402, Shiv Shristi Enclave, Baner Road",
                "state": "Maharashtra",
                "district": "Pune",
                "pincode": "411045",
                "annual_income": 1450000.0,
                "occupation": "Founder & CTO (Apex Cybernetics)",
                "assurance_level": "MeriPehchaan (Level 3 - Aadhaar e-KYC)",
                "created_at": "2026-08-12T10:00:00Z",
                "updated_at": "2026-08-18T10:00:00Z",
            },
            "usr-digilocker-9921": {
                "user_id": "usr-digilocker-9921",
                "full_name": "Dr. Ananya Sharma",
                "hindi_name": "डॉ. अनन्या शर्मा",
                "date_of_birth": "1992-04-14",
                "gender": "Female",
                "phone": "+91 98110 44219",
                "email": "ananya.sharma.dst@gov.res.in",
                "aadhaar_masked": "XXXX-XXXX-3190",
                "pan_number": "ANASP4821M",
                "address": "C-4/18, Hauz Khas Enclave",
                "state": "Delhi (NCT)",
                "district": "New Delhi",
                "pincode": "110016",
                "annual_income": 1200000.0,
                "occupation": "Postdoctoral Research Scientist (DST Fellow)",
                "assurance_level": "MeriPehchaan (Level 3 - Aadhaar e-KYC)",
                "created_at": "2026-08-14T10:00:00Z",
                "updated_at": "2026-08-18T10:00:00Z",
            },
            "usr-digilocker-7740": {
                "user_id": "usr-digilocker-7740",
                "full_name": "Ramesh Patel",
                "hindi_name": "रमेश पटेल",
                "date_of_birth": "1984-08-05",
                "gender": "Male",
                "phone": "+91 94260 11893",
                "email": "ramesh.patel.msme@gmail.com",
                "aadhaar_masked": "XXXX-XXXX-9902",
                "pan_number": "RPATL7732K",
                "address": "Plot 48, GIDC Industrial Estate, Vatva",
                "state": "Gujarat",
                "district": "Ahmedabad",
                "pincode": "382445",
                "annual_income": 1850000.0,
                "occupation": "Managing Director (Patel Precision Works)",
                "assurance_level": "MeriPehchaan (Level 3 - Aadhaar e-KYC)",
                "created_at": "2026-08-15T10:00:00Z",
                "updated_at": "2026-08-18T10:00:00Z",
            },
        }

        self.schemes: Dict[str, Dict[str, Any]] = {
            "scheme-sisfs-01": {
                "scheme_id": "scheme-sisfs-01",
                "scheme_code": "DPIIT/SISFS/2026/G-424",
                "name": "Startup India Seed Fund Scheme (SISFS)",
                "name_hindi": "स्टार्टअप इंडिया सीड फंड योजना (SISFS)",
                "description": "Financial assistance to early-stage startups for proof of concept, prototype development, product trials, market entry, and commercialization under DPIIT.",
                "category": "Startup & MSME Grant",
                "ministry": "Ministry of Commerce and Industry",
                "department": "Department for Promotion of Industry and Internal Trade (DPIIT)",
                "state": "All India",
                "funding_amount": "₹25,00,000 INR (Grant & Convertible Debenture)",
                "processing_time": "21 Working Days",
                "application_url": "https://www.startupindia.gov.in/content/sih/en/seed-fund-scheme.html",
                "deadline": "2026-11-15",
                "is_active": True,
                "created_at": "2026-08-01T00:00:00Z",
            },
            "scheme-inspire-02": {
                "scheme_id": "scheme-inspire-02",
                "scheme_code": "DST/INSPIRE/2026/F-101",
                "name": "DST INSPIRE Senior Research Faculty Fellowship",
                "name_hindi": "डीएसटी इंस्पायर सीनियर रिसर्च फैकल्टी फैलोशिप",
                "description": "Prestigious research fellowship providing independent faculty positions and research grant support for postdoctoral scientists to conduct frontier research in Indian labs.",
                "category": "Academic & Research Fellowship",
                "ministry": "Ministry of Science and Technology",
                "department": "Department of Science & Technology (DST)",
                "state": "All India",
                "funding_amount": "₹35,00,000 Research Grant + ₹1,25,000/mo Fellowship",
                "processing_time": "45 Working Days",
                "application_url": "https://online-inspire.gov.in/",
                "deadline": "2026-11-30",
                "is_active": True,
                "created_at": "2026-08-01T00:00:00Z",
            },
            "scheme-pmegp-03": {
                "scheme_id": "scheme-pmegp-03",
                "scheme_code": "MSME/PMEGP/2026/S-88",
                "name": "Prime Minister Employment Generation Programme (PMEGP)",
                "name_hindi": "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
                "description": "Credit-linked subsidy programme to generate self-employment opportunities through establishment of micro-enterprises in non-farm sectors with up to 35% government subsidy.",
                "category": "Employment & Skill Development",
                "ministry": "Ministry of Micro, Small & Medium Enterprises",
                "department": "Khadi and Village Industries Commission (KVIC)",
                "state": "All India",
                "funding_amount": "₹50,00,000 Project Capital (35% Margin Subsidy)",
                "processing_time": "15 Working Days",
                "application_url": "https://www.kviconline.gov.in/pmegpeportal/",
                "deadline": "2026-12-31",
                "is_active": True,
                "created_at": "2026-08-01T00:00:00Z",
            },
            "scheme-udyam-04": {
                "scheme_id": "scheme-udyam-04",
                "scheme_code": "MSME/UDYAM/2026/REG-99",
                "name": "MSME Udyam Enterprise Certification & Priority Lending",
                "name_hindi": "एमएसएमई उद्यम पंजीकरण प्रमाणपत्र एवं प्राथमिकता ऋण",
                "description": "Statutory permanent identity number and electronic registration certificate for micro, small, and medium enterprises with priority sector bank lending eligibility.",
                "category": "Trade & Industrial License",
                "ministry": "Ministry of Micro, Small & Medium Enterprises",
                "department": "Udyam Registration Portal Directorate",
                "state": "All India",
                "funding_amount": "Statutory Zero Fee (Free National Registration)",
                "processing_time": "Instant (1-2 Days)",
                "application_url": "https://udyamregistration.gov.in/",
                "deadline": "2026-12-31",
                "is_active": True,
                "created_at": "2026-08-01T00:00:00Z",
            },
        }

        self.scheme_eligibility: Dict[str, Dict[str, Any]] = {
            "elig-sisfs-01": {
                "eligibility_id": "elig-sisfs-01",
                "scheme_id": "scheme-sisfs-01",
                "min_age": 18,
                "max_age": 65,
                "max_income": 5000000.0,
                "occupation": "Founder / Entrepreneur",
                "gender": "All",
                "category": "Startup & MSME",
                "requires_residence": "All India",
                "required_documents": ["Aadhaar Card (UIDAI)", "Income Tax PAN Card", "ITR-V / Balance Sheet", "DPIIT Certificate of Recognition"],
                "eligibility_description": "Must be a DPIIT recognized startup with proof of concept/prototype. Incorporated within last 2 years.",
            },
            "elig-inspire-02": {
                "eligibility_id": "elig-inspire-02",
                "scheme_id": "scheme-inspire-02",
                "min_age": 22,
                "max_age": 32,
                "max_income": None,
                "occupation": "Researcher / Scientist",
                "gender": "All",
                "category": "Academic & Research",
                "requires_residence": "All India",
                "required_documents": ["Aadhaar Card (UIDAI)", "Doctorate Degree Transcript", "Institutional Endorsement Letter"],
                "eligibility_description": "Must hold Ph.D. in Science/Engineering/Medicine. Age under 32 years with at least 2 peer-reviewed publications.",
            },
            "elig-pmegp-03": {
                "eligibility_id": "elig-pmegp-03",
                "scheme_id": "scheme-pmegp-03",
                "min_age": 18,
                "max_age": 70,
                "max_income": 2500000.0,
                "occupation": "Self-Employed / Artisan / Entrepreneur",
                "gender": "All",
                "category": "All",
                "requires_residence": "All India",
                "required_documents": ["Aadhaar Card (UIDAI)", "PAN Card", "EDP Training Certificate", "Detailed Project Report (DPR)"],
                "eligibility_description": "Any individual above 18 years. At least 8th standard pass for manufacturing units above ₹10 lakhs project cost.",
            },
            "elig-udyam-04": {
                "eligibility_id": "elig-udyam-04",
                "scheme_id": "scheme-udyam-04",
                "min_age": 18,
                "max_age": 99,
                "max_income": None,
                "occupation": "Business Owner / Enterprise",
                "gender": "All",
                "category": "All",
                "requires_residence": "All India",
                "required_documents": ["Aadhaar Card", "PAN Card", "GSTIN Certificate"],
                "eligibility_description": "Any operational or emerging enterprise classified under Micro, Small, or Medium criteria.",
            },
        }

        self.applications: Dict[str, Dict[str, Any]] = {
            "app-sisfs-2026-001": {
                "application_id": "app-sisfs-2026-001",
                "application_number": "GOV-2026-SISFS-884901",
                "user_id": "usr-digilocker-8849",
                "scheme_id": "scheme-sisfs-01",
                "status": "ready_to_submit",
                "progress_percentage": 85,
                "notes": "All statutory identity and income documents verified via DigiLocker e-KYC.",
                "form_data": {
                    "applicantName": "Shivang Khorjuvekar",
                    "annualGrossIncome": "₹14,50,000",
                    "requestedGrantOrSubsidy": "₹25,00,000 INR",
                    "employerOrBusiness": "Apex Cybernetics India Pvt. Ltd.",
                },
                "attached_doc_ids": ["doc-aadhaar-01", "doc-pan-02", "doc-itr-03"],
                "submitted_at": None,
                "updated_at": "2026-08-18T10:00:00Z",
                "created_at": "2026-08-12T10:00:00Z",
            }
        }

        self.documents: Dict[str, Dict[str, Any]] = {
            "doc-aadhaar-01": {
                "document_id": "doc-aadhaar-01",
                "user_id": "usr-digilocker-8849",
                "document_type": "Aadhaar Card (UIDAI Verified)",
                "original_name": "Aadhaar_Card_UIDAI_Verified.pdf",
                "file_url": "https://storage.supabase.co/govconnect-vault/usr-8849/aadhaar_verified.pdf",
                "file_size_bytes": 1458900,
                "file_type": "application/pdf",
                "sha256_hash": "9f83c14298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "is_encrypted": True,
                "verification_status": "verified",
                "uploaded_at": "2026-08-12T10:14:00Z",
            },
            "doc-pan-02": {
                "document_id": "doc-pan-02",
                "user_id": "usr-digilocker-8849",
                "document_type": "Permanent Account Number (PAN)",
                "original_name": "Income_Tax_PAN_Card_NSDL.pdf",
                "file_url": "https://storage.supabase.co/govconnect-vault/usr-8849/pan_nsdl_verified.pdf",
                "file_size_bytes": 984500,
                "file_type": "application/pdf",
                "sha256_hash": "4a6b2c89f412e6501a3b8c7e9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
                "is_encrypted": True,
                "verification_status": "verified",
                "uploaded_at": "2026-08-12T10:16:00Z",
            },
            "doc-itr-03": {
                "document_id": "doc-itr-03",
                "user_id": "usr-digilocker-8849",
                "document_type": "Income Tax Return (ITR-V)",
                "original_name": "ITR_V_Acknowledgement_AY2025-26.pdf",
                "file_url": "https://storage.supabase.co/govconnect-vault/usr-8849/itr_v_ay2025_26.pdf",
                "file_size_bytes": 2150000,
                "file_type": "application/pdf",
                "sha256_hash": "7b3e1c94d82f5a01e3b6c8f9a0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8",
                "is_encrypted": True,
                "verification_status": "verified",
                "uploaded_at": "2026-08-12T10:18:00Z",
            },
        }

        self.document_verifications: Dict[str, Dict[str, Any]] = {
            "verif-aadhaar-01": {
                "verification_id": "verif-aadhaar-01",
                "document_id": "doc-aadhaar-01",
                "matched": True,
                "confidence_score": 99.8,
                "extracted_fields": {
                    "fullName": "Shivang Khorjuvekar",
                    "dob": "1995-11-20",
                    "idNumber": "XXXX-XXXX-8421",
                    "address": "Flat 402, Shiv Shristi Enclave, Baner Road, Pune, Maharashtra 411045",
                },
                "flags": [],
                "security_summary": "UIDAI PKI signature validated. Level 3 e-KYC authenticated.",
                "verified_at": "2026-08-12T10:15:00Z",
            },
            "verif-pan-02": {
                "verification_id": "verif-pan-02",
                "document_id": "doc-pan-02",
                "matched": True,
                "confidence_score": 99.6,
                "extracted_fields": {
                    "fullName": "Shivang Khorjuvekar",
                    "dob": "1995-11-20",
                    "idNumber": "ABCDE1234F",
                    "incomeAmount": "₹14,50,000 / annum",
                },
                "flags": [],
                "security_summary": "NSDL/CBDT direct tax master record match.",
                "verified_at": "2026-08-12T10:17:00Z",
            },
        }

        self.reminders: Dict[str, Dict[str, Any]] = {
            "rem-01": {
                "reminder_id": "rem-01",
                "user_id": "usr-digilocker-8849",
                "application_id": "app-sisfs-2026-001",
                "reminder_type": "deadline",
                "reminder_date": "2026-11-15",
                "message": "DPIIT Startup India Seed Fund application deadline is November 15, 2026. Submit before 11:59 PM IST.",
                "is_sent": False,
                "created_at": "2026-08-18T10:00:00Z",
            },
            "rem-02": {
                "reminder_id": "rem-02",
                "user_id": "usr-digilocker-8849",
                "application_id": None,
                "reminder_type": "notice",
                "reminder_date": "2026-11-30",
                "message": "DST INSPIRE Fellowship winter cycle closes November 30. Check updated guidelines.",
                "is_sent": False,
                "created_at": "2026-08-18T10:00:00Z",
            },
        }


# Global memory store instance
memory_store = InMemoryStore()


# ==============================================================================
# UNIFIED DATABASE ACCESS LAYER (Supabase with seamless fallback)
# ==============================================================================

class DatabaseLayer:
    """Provides high-level database operations executing on Supabase or in-memory fallback."""

    @property
    def is_live(self) -> bool:
        return IS_LIVE_SUPABASE and supabase_client is not None

    # ------------------ USERS ------------------
    def get_users(self) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("users").select("*").execute()
                return res.data if res.data else list(memory_store.users.values())
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_users warning: {e}. Using local store.")
                return list(memory_store.users.values())
        return list(memory_store.users.values())

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("users").select("*").eq("user_id", user_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_user_by_id warning: {e}. Falling back to local store.")
                return memory_store.users.get(user_id)
        return memory_store.users.get(user_id)

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        user_data["updated_at"] = user_data["created_at"]
        if self.is_live:
            try:
                res = supabase_client.table("users").insert(user_data).execute()
                return res.data[0] if res.data else user_data
            except Exception as e:
                print(f"[GovConnect DB] Supabase create_user warning: {e}. Storing in memory store.")
        memory_store.users[user_data["user_id"]] = user_data
        return user_data

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        updates["updated_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("users").update(updates).eq("user_id", user_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase update_user warning: {e}.")
        if user_id in memory_store.users:
            memory_store.users[user_id].update(updates)
            return memory_store.users[user_id]
        return None

    # ------------------ SCHEMES ------------------
    def get_schemes(self, active_only: bool = True) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                query = supabase_client.table("schemes").select("*")
                if active_only:
                    query = query.eq("is_active", True)
                res = query.execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_schemes warning: {e}. Using local store.")
        schemes = list(memory_store.schemes.values())
        if active_only:
            schemes = [s for s in schemes if s.get("is_active", True)]
        return schemes

    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("schemes").select("*").eq("scheme_id", scheme_id).execute()
                if res.data:
                    scheme = res.data[0]
                    try:
                        elig = supabase_client.table("scheme_eligibility").select("*").eq("scheme_id", scheme_id).execute()
                        scheme["eligibility"] = elig.data[0] if elig.data else None
                    except Exception:
                        pass
                    return scheme
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_scheme_by_id warning: {e}.")
        scheme = memory_store.schemes.get(scheme_id)
        if scheme:
            scheme_copy = dict(scheme)
            scheme_copy["eligibility"] = next(
                (e for e in memory_store.scheme_eligibility.values() if e.get("scheme_id") == scheme_id),
                None
            )
            return scheme_copy
        return None

    def create_scheme(self, scheme_data: Dict[str, Any], eligibility_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        scheme_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("schemes").insert(scheme_data).execute()
                created_scheme = res.data[0] if res.data else scheme_data
                if eligibility_data:
                    eligibility_data["scheme_id"] = scheme_data["scheme_id"]
                    supabase_client.table("scheme_eligibility").insert(eligibility_data).execute()
                    created_scheme["eligibility"] = eligibility_data
                return created_scheme
            except Exception as e:
                print(f"[GovConnect DB] Supabase create_scheme warning: {e}.")
        memory_store.schemes[scheme_data["scheme_id"]] = scheme_data
        if eligibility_data:
            eligibility_data["scheme_id"] = scheme_data["scheme_id"]
            memory_store.scheme_eligibility[eligibility_data["eligibility_id"]] = eligibility_data
            scheme_data["eligibility"] = eligibility_data
        return scheme_data

    def get_all_eligibility_rules(self) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("scheme_eligibility").select("*").execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_all_eligibility_rules warning: {e}.")
        return list(memory_store.scheme_eligibility.values())

    # ------------------ APPLICATIONS ------------------
    def get_applications_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("applications").select("*").eq("user_id", user_id).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_applications_by_user warning: {e}.")
        return [app for app in memory_store.applications.values() if app.get("user_id") == user_id]

    def get_application_by_id(self, application_id: str) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("applications").select("*").eq("application_id", application_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_application_by_id warning: {e}.")
        return memory_store.applications.get(application_id)

    def create_application(self, app_data: Dict[str, Any]) -> Dict[str, Any]:
        app_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        app_data["updated_at"] = app_data["created_at"]
        if self.is_live:
            try:
                res = supabase_client.table("applications").insert(app_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase create_application warning: {e}.")
        memory_store.applications[app_data["application_id"]] = app_data
        return app_data

    def update_application(self, application_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        updates["updated_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("applications").update(updates).eq("application_id", application_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase update_application warning: {e}.")
        if application_id in memory_store.applications:
            memory_store.applications[application_id].update(updates)
            return memory_store.applications[application_id]
        return None

    # ------------------ DOCUMENTS & VERIFICATIONS ------------------
    def get_documents_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("documents").select("*, document_verifications(*)").eq("user_id", user_id).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_documents_by_user warning: {e}.")
        user_docs = [d for d in memory_store.documents.values() if d.get("user_id") == user_id]
        enriched = []
        for d in user_docs:
            d_copy = dict(d)
            verif = next((v for v in memory_store.document_verifications.values() if v.get("document_id") == d["document_id"]), None)
            d_copy["verification"] = verif
            enriched.append(d_copy)
        return enriched

    def get_document_by_id(self, document_id: str) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("documents").select("*, document_verifications(*)").eq("document_id", document_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_document_by_id warning: {e}.")
        doc = memory_store.documents.get(document_id)
        if doc:
            d_copy = dict(doc)
            d_copy["verification"] = next((v for v in memory_store.document_verifications.values() if v.get("document_id") == document_id), None)
            return d_copy
        return None

    def create_document(self, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        doc_data["uploaded_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("documents").insert(doc_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase create_document warning: {e}.")
        memory_store.documents[doc_data["document_id"]] = doc_data
        return doc_data

    def update_document(self, document_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("documents").update(updates).eq("document_id", document_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase update_document warning: {e}.")
        if document_id in memory_store.documents:
            memory_store.documents[document_id].update(updates)
            return memory_store.documents[document_id]
        return None

    def save_verification_result(self, verif_data: Dict[str, Any]) -> Dict[str, Any]:
        verif_data["verified_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("document_verifications").insert(verif_data).execute()
                new_status = "verified" if verif_data.get("matched", False) else "mismatch"
                supabase_client.table("documents").update({"verification_status": new_status}).eq("document_id", verif_data["document_id"]).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase save_verification_result warning: {e}.")
        
        memory_store.document_verifications[verif_data["verification_id"]] = verif_data
        doc_id = verif_data["document_id"]
        if doc_id in memory_store.documents:
            memory_store.documents[doc_id]["verification_status"] = "verified" if verif_data.get("matched", False) else "mismatch"
        return verif_data

    # ------------------ REMINDERS ------------------
    def get_reminders_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("reminders").select("*").eq("user_id", user_id).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[GovConnect DB] Supabase get_reminders_by_user warning: {e}.")
        return [r for r in memory_store.reminders.values() if r.get("user_id") == user_id]

    def create_reminder(self, reminder_data: Dict[str, Any]) -> Dict[str, Any]:
        reminder_data["created_at"] = datetime.utcnow().isoformat() + "Z"
        if self.is_live:
            try:
                res = supabase_client.table("reminders").insert(reminder_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase create_reminder warning: {e}.")
        memory_store.reminders[reminder_data["reminder_id"]] = reminder_data
        return reminder_data

    def dismiss_reminder(self, reminder_id: str) -> Optional[Dict[str, Any]]:
        if self.is_live:
            try:
                res = supabase_client.table("reminders").update({"is_sent": True}).eq("reminder_id", reminder_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[GovConnect DB] Supabase dismiss_reminder warning: {e}.")
        if reminder_id in memory_store.reminders:
            memory_store.reminders[reminder_id]["is_sent"] = True
            return memory_store.reminders[reminder_id]
        return None


# Global DB layer instance
db = DatabaseLayer()
