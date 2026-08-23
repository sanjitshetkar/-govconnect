"""
GovConnect Pydantic Schemas
Strict snake_case API data contracts for FastAPI request validation and response serialization.
"""

from typing import Any, Dict, List, Optional
from datetime import date, datetime
from pydantic import BaseModel, Field


# ==============================================================================
# BASE RESPONSE WRAPPER
# ==============================================================================

class ApiResponse(BaseModel):
    status: str = "success"
    message: Optional[str] = None
    data: Optional[Any] = None


# ==============================================================================
# USER SCHEMAS
# ==============================================================================

class UserCreate(BaseModel):
    user_id: Optional[str] = None
    full_name: str
    hindi_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = "All"
    phone: str
    email: str
    aadhaar_masked: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = None
    pincode: Optional[str] = None
    annual_income: Optional[float] = 0.0
    occupation: Optional[str] = None
    assurance_level: Optional[str] = "MeriPehchaan (Level 3 - Aadhaar e-KYC)"


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    hindi_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    aadhaar_masked: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    assurance_level: Optional[str] = None


class UserResponse(BaseModel):
    user_id: str
    full_name: str
    hindi_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: str
    email: str
    aadhaar_masked: Optional[str] = None
    pan_number: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    annual_income: Optional[float] = 0.0
    occupation: Optional[str] = None
    assurance_level: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ==============================================================================
# SCHEME & ELIGIBILITY SCHEMAS
# ==============================================================================

class SchemeEligibilityCreate(BaseModel):
    eligibility_id: Optional[str] = None
    min_age: Optional[int] = 0
    max_age: Optional[int] = 120
    max_income: Optional[float] = None
    occupation: Optional[str] = "All"
    gender: Optional[str] = "All"
    category: Optional[str] = "All"
    requires_residence: Optional[str] = "All India"
    required_documents: Optional[List[str]] = []
    eligibility_description: Optional[str] = None


class SchemeCreate(BaseModel):
    scheme_id: Optional[str] = None
    scheme_code: Optional[str] = None
    name: str
    name_hindi: Optional[str] = None
    description: str
    category: str
    ministry: str
    department: str
    state: Optional[str] = "All India"
    funding_amount: Optional[str] = None
    processing_time: Optional[str] = "15 Working Days"
    application_url: Optional[str] = None
    deadline: Optional[str] = None
    is_active: Optional[bool] = True
    eligibility: Optional[SchemeEligibilityCreate] = None


class SchemeResponse(BaseModel):
    scheme_id: str
    scheme_code: Optional[str] = None
    name: str
    name_hindi: Optional[str] = None
    description: str
    category: str
    ministry: str
    department: str
    state: Optional[str] = "All India"
    funding_amount: Optional[str] = None
    processing_time: Optional[str] = None
    application_url: Optional[str] = None
    deadline: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None
    eligibility: Optional[Dict[str, Any]] = None


# ==============================================================================
# APPLICATION SCHEMAS
# ==============================================================================

class ApplicationCreate(BaseModel):
    application_id: Optional[str] = None
    application_number: Optional[str] = None
    user_id: str
    scheme_id: str
    status: Optional[str] = "draft"
    progress_percentage: Optional[int] = 20
    notes: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = {}
    attached_doc_ids: Optional[List[str]] = []


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    progress_percentage: Optional[int] = None
    notes: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    attached_doc_ids: Optional[List[str]] = None
    submitted_at: Optional[str] = None


class ApplicationResponse(BaseModel):
    application_id: str
    application_number: str
    user_id: str
    scheme_id: str
    status: str
    progress_percentage: int
    notes: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = {}
    attached_doc_ids: Optional[List[str]] = []
    submitted_at: Optional[str] = None
    updated_at: Optional[str] = None
    created_at: Optional[str] = None


# ==============================================================================
# DOCUMENT & VERIFICATION SCHEMAS (Sangharsh / Document AI)
# ==============================================================================

class DocumentCreate(BaseModel):
    document_id: Optional[str] = None
    user_id: str
    document_type: str
    original_name: str
    file_url: str
    file_size_bytes: Optional[int] = 0
    file_type: Optional[str] = "application/pdf"
    sha256_hash: Optional[str] = None
    is_encrypted: Optional[bool] = True
    verification_status: Optional[str] = "pending"


class DocumentVerificationCreate(BaseModel):
    verification_id: Optional[str] = None
    document_id: str
    matched: bool
    confidence_score: Optional[float] = 95.0
    extracted_fields: Dict[str, Any]
    flags: Optional[List[str]] = []
    security_summary: Optional[str] = None


class DocumentResponse(BaseModel):
    document_id: str
    user_id: str
    document_type: str
    original_name: str
    file_url: str
    file_size_bytes: Optional[int] = 0
    file_type: Optional[str] = None
    sha256_hash: Optional[str] = None
    is_encrypted: Optional[bool] = True
    verification_status: str
    uploaded_at: Optional[str] = None
    verification: Optional[Dict[str, Any]] = None


# ==============================================================================
# RECOMMENDATION & REMINDER SCHEMAS
# ==============================================================================

class SchemeRecommendation(BaseModel):
    scheme_id: str
    scheme_name: str
    scheme_code: Optional[str] = None
    category: str
    funding_amount: Optional[str] = None
    deadline: Optional[str] = None
    is_eligible: bool
    match_score: int
    matched_criteria: List[str]
    missing_requirements: List[str]
    description: str


class ReminderCreate(BaseModel):
    reminder_id: Optional[str] = None
    user_id: str
    application_id: Optional[str] = None
    reminder_type: str = "deadline"
    reminder_date: str
    message: str


class ReminderResponse(BaseModel):
    reminder_id: str
    user_id: str
    application_id: Optional[str] = None
    reminder_type: str
    reminder_date: str
    message: str
    is_sent: bool
    created_at: Optional[str] = None
