"""
GovConnect Users API Routes
Handles citizen profile registration, retrieval, and profile updates.
"""

from typing import Any, Dict, List, Optional
import uuid
from fastapi import APIRouter, HTTPException, status
from database import db
from schemas import UserCreate, UserUpdate, UserResponse, ApiResponse

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_user_profile(user_input: UserCreate) -> ApiResponse:
    """
    Register a new citizen user profile into GovConnect.
    """
    user_id = user_input.user_id or f"usr-digilocker-{uuid.uuid4().hex[:4]}"
    
    # Check if user with same email exists
    existing_users = db.get_users()
    if any(u.get("email") == user_input.email for u in existing_users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{user_input.email}' already exists."
        )

    user_dict = user_input.model_dump(exclude_unset=False)
    user_dict["user_id"] = user_id
    created_user = db.create_user(user_dict)

    return ApiResponse(
        status="success",
        message="User profile created successfully.",
        data=created_user
    )


@router.get("", response_model=ApiResponse)
def list_users() -> ApiResponse:
    """
    Retrieve all registered citizen user profiles.
    """
    users = db.get_users()
    return ApiResponse(
        status="success",
        data={"users": users, "count": len(users)}
    )


@router.get("/{user_id}", response_model=ApiResponse)
def get_user_profile(user_id: str) -> ApiResponse:
    """
    Retrieve user profile by citizen user_id.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )
    return ApiResponse(
        status="success",
        data=user
    )


@router.put("/{user_id}", response_model=ApiResponse)
def update_user_profile(user_id: str, updates: UserUpdate) -> ApiResponse:
    """
    Update citizen profile fields (income, occupation, address, etc.).
    """
    existing_user = db.get_user_by_id(user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )

    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated_user = db.update_user(user_id, update_data)

    return ApiResponse(
        status="success",
        message="User profile updated successfully.",
        data=updated_user
    )
