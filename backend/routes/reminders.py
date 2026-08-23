"""
GovConnect Reminders API Routes
Manages statutory deadlines, action alerts, and notifications for citizens.
"""

from typing import Any, Dict, List, Optional
import uuid
from fastapi import APIRouter, HTTPException, status
from database import db
from services.reminders import check_and_generate_proactive_reminders
from schemas import ReminderCreate, ReminderResponse, ApiResponse

router = APIRouter(prefix="/api/reminders", tags=["Reminders & Deadlines"])


@router.get("/{user_id}", response_model=ApiResponse)
def get_user_reminders(user_id: str) -> ApiResponse:
    """
    Get all active reminders for a citizen. Automatically triggers proactive deadline checks.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found."
        )

    reminders = check_and_generate_proactive_reminders(user_id)
    active_reminders = [r for r in reminders if not r.get("is_sent", False)]

    return ApiResponse(
        status="success",
        data={
            "reminders": reminders,
            "active_count": len(active_reminders),
            "total_count": len(reminders)
        }
    )


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(reminder_input: ReminderCreate) -> ApiResponse:
    """
    Manually create a new deadline reminder or notice for a citizen.
    """
    user = db.get_user_by_id(reminder_input.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{reminder_input.user_id}' not found."
        )

    rem_id = reminder_input.reminder_id or f"rem-{uuid.uuid4().hex[:8]}"
    rem_data = reminder_input.model_dump()
    rem_data["reminder_id"] = rem_id
    rem_data["is_sent"] = False

    saved_reminder = db.create_reminder(rem_data)

    return ApiResponse(
        status="success",
        message="Reminder created successfully.",
        data=saved_reminder
    )


@router.put("/{reminder_id}/dismiss", response_model=ApiResponse)
def dismiss_reminder(reminder_id: str) -> ApiResponse:
    """
    Mark a reminder as acknowledged / dismissed.
    """
    updated = db.dismiss_reminder(reminder_id)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reminder with ID '{reminder_id}' not found."
        )

    return ApiResponse(
        status="success",
        message="Reminder dismissed successfully.",
        data=updated
    )
