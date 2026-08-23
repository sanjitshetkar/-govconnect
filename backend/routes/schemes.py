"""
GovConnect Schemes API Routes
Provides government scheme discovery, scheme details, and eligibility criteria lookup.
"""

from typing import Any, Dict, List, Optional
import uuid
from fastapi import APIRouter, HTTPException, Query, status
from database import db
from schemas import SchemeCreate, SchemeResponse, ApiResponse

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])


@router.get("", response_model=ApiResponse)
def list_schemes(
    category: Optional[str] = Query(None, description="Filter by category (e.g. 'Startup & MSME Grant')"),
    state: Optional[str] = Query(None, description="Filter by state coverage (e.g. 'Maharashtra' or 'All India')"),
    search: Optional[str] = Query(None, description="Search keyword in name or description")
) -> ApiResponse:
    """
    List all active government schemes with optional filtering.
    """
    schemes = db.get_schemes(active_only=True)

    if category:
        schemes = [s for s in schemes if category.lower() in (s.get("category") or "").lower()]

    if state:
        schemes = [
            s for s in schemes
            if (s.get("state") or "All India").lower() == "all india" or state.lower() in (s.get("state") or "").lower()
        ]

    if search:
        kw = search.lower()
        schemes = [
            s for s in schemes
            if kw in (s.get("name") or "").lower()
            or kw in (s.get("description") or "").lower()
            or kw in (s.get("ministry") or "").lower()
        ]

    return ApiResponse(
        status="success",
        data={"schemes": schemes, "count": len(schemes)}
    )


@router.get("/{scheme_id}", response_model=ApiResponse)
def get_scheme_detail(scheme_id: str) -> ApiResponse:
    """
    Get detailed information for a specific government scheme along with its eligibility criteria.
    """
    scheme = db.get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID '{scheme_id}' not found."
        )
    return ApiResponse(
        status="success",
        data=scheme
    )


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_scheme(scheme_input: SchemeCreate) -> ApiResponse:
    """
    Register a new government scheme into GovConnect.
    """
    scheme_id = scheme_input.scheme_id or f"scheme-{uuid.uuid4().hex[:8]}"
    scheme_data = scheme_input.model_dump(exclude={"eligibility"})
    scheme_data["scheme_id"] = scheme_id

    eligibility_data = None
    if scheme_input.eligibility:
        eligibility_data = scheme_input.eligibility.model_dump()
        eligibility_data["eligibility_id"] = eligibility_data.get("eligibility_id") or f"elig-{uuid.uuid4().hex[:8]}"
        eligibility_data["scheme_id"] = scheme_id

    created_scheme = db.create_scheme(scheme_data, eligibility_data)

    return ApiResponse(
        status="success",
        message="Government scheme created successfully.",
        data=created_scheme
    )
