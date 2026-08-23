"""
GovConnect Applications API Routes
Manages statutory applications lifecycle: drafting, document attachment, autofill data, submission, and status updates.
"""

from typing import Any, Dict, List, Optional
from datetime import datetime
import uuid
from fastapi import APIRouter, HTTPException, status
from database import db
from schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApiResponse

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_application(app_input: ApplicationCreate) -> ApiResponse:
    """
    Create a new application for a user applying to a government scheme.
    """
    user = db.get_user_by_id(app_input.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{app_input.user_id}' does not exist."
        )

    scheme = db.get_scheme_by_id(app_input.scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID '{app_input.scheme_id}' does not exist."
        )

    application_id = app_input.application_id or f"app-{uuid.uuid4().hex[:8]}"
    app_num = app_input.application_number or f"GOV-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"

    app_data = app_input.model_dump()
    app_data["application_id"] = application_id
    app_data["application_number"] = app_num

    created_app = db.create_application(app_data)

    return ApiResponse(
        status="success",
        message="Application created successfully.",
        data=created_app
    )


@router.get("/{user_id}", response_model=ApiResponse)
def get_user_applications(user_id: str) -> ApiResponse:
    """
    Get all active and past applications for a citizen.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )

    applications = db.get_applications_by_user(user_id)
    schemes = {s["scheme_id"]: s for s in db.get_schemes(active_only=False)}

    # Enrich applications with scheme name and category
    enriched_apps = []
    for a in applications:
        a_copy = dict(a)
        scheme_info = schemes.get(a.get("scheme_id"))
        if scheme_info:
            a_copy["scheme_name"] = scheme_info.get("name")
            a_copy["scheme_code"] = scheme_info.get("scheme_code")
            a_copy["category"] = scheme_info.get("category")
            a_copy["deadline"] = scheme_info.get("deadline")
        enriched_apps.append(a_copy)

    return ApiResponse(
        status="success",
        data={"applications": enriched_apps, "count": len(enriched_apps)}
    )


@router.get("/detail/{application_id}", response_model=ApiResponse)
def get_application_detail(application_id: str) -> ApiResponse:
    """
    Get detailed records for a single application.
    """
    app = db.get_application_by_id(application_id)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{application_id}' not found."
        )

    scheme = db.get_scheme_by_id(app.get("scheme_id"))
    app_copy = dict(app)
    if scheme:
        app_copy["scheme"] = scheme

    return ApiResponse(
        status="success",
        data=app_copy
    )


@router.put("/{application_id}", response_model=ApiResponse)
def update_application(application_id: str, updates: ApplicationUpdate) -> ApiResponse:
    """
    Update application status, progress percentage, notes, form data, or attached documents.
    """
    existing_app = db.get_application_by_id(application_id)
    if not existing_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{application_id}' not found."
        )

    update_dict = {k: v for k, v in updates.model_dump().items() if v is not None}

    # If status is updated to submitted, set submitted_at timestamp
    if update_dict.get("status") == "submitted" and not update_dict.get("submitted_at"):
        update_dict["submitted_at"] = datetime.utcnow().isoformat() + "Z"

    updated_app = db.update_application(application_id, update_dict)

    return ApiResponse(
        status="success",
        message="Application updated successfully.",
        data=updated_app
    )
