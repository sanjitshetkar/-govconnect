"""
GovConnect Scheme Recommendations API Routes
Integrates with the Recommendation Engine to return tailored schemes and eligibility evaluations for citizens.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status
from database import db
from services.recommendation import get_recommendations_for_user
from schemas import ApiResponse

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations & Eligibility"])


@router.get("/{user_id}", response_model=ApiResponse)
def get_user_recommendations(user_id: str) -> ApiResponse:
    """
    Compute real-time government scheme recommendations tailored to the citizen's profile.
    Used by Shivang's frontend dashboard and Sanjit's Conversational AI chatbot.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )

    recommendations = get_recommendations_for_user(user_id)
    eligible_count = sum(1 for r in recommendations if r["is_eligible"])

    return ApiResponse(
        status="success",
        data={
            "user_id": user_id,
            "total_schemes_evaluated": len(recommendations),
            "eligible_count": eligible_count,
            "recommendations": recommendations,
        }
    )
