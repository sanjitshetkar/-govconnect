"""
GovConnect Reminders & Deadline Tracking Service
Monitors scheme deadlines, application status, and document requirements to generate proactive alerts.
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date, timedelta
import uuid
from database import db


def check_and_generate_proactive_reminders(user_id: str) -> List[Dict[str, Any]]:
    """
    Scans user applications and scheme deadlines. Automatically generates reminder records if not already present.
    """
    applications = db.get_applications_by_user(user_id)
    schemes = {s["scheme_id"]: s for s in db.get_schemes(active_only=False)}
    existing_reminders = db.get_reminders_by_user(user_id)
    existing_messages = {r.get("message") for r in existing_reminders}

    new_reminders = []
    today = date.today()

    for app in applications:
        app_id = app.get("application_id")
        scheme_id = app.get("scheme_id")
        scheme = schemes.get(scheme_id)
        status = app.get("status", "draft")

        # 1. Scheme deadline check for in-progress or draft applications
        if scheme and scheme.get("deadline") and status in ["draft", "documents_pending", "ready_to_submit"]:
            try:
                deadline_date = datetime.strptime(scheme["deadline"], "%Y-%m-%d").date()
                days_left = (deadline_date - today).days

                if 0 <= days_left <= 60:
                    msg = f"Upcoming Deadline: '{scheme.get('name')}' closes on {scheme.get('deadline')} ({days_left} days remaining)."
                    if msg not in existing_messages:
                        rem_data = {
                            "reminder_id": f"rem-{uuid.uuid4().hex[:8]}",
                            "user_id": user_id,
                            "application_id": app_id,
                            "reminder_type": "deadline",
                            "reminder_date": scheme.get("deadline"),
                            "message": msg,
                            "is_sent": False,
                        }
                        saved = db.create_reminder(rem_data)
                        new_reminders.append(saved)
                        existing_messages.add(msg)
            except Exception:
                pass

        # 2. Document pending reminder
        if status == "documents_pending":
            msg = f"Action Required: Application #{app.get('application_number')} has pending supporting documents."
            if msg not in existing_messages:
                rem_data = {
                    "reminder_id": f"rem-{uuid.uuid4().hex[:8]}",
                    "user_id": user_id,
                    "application_id": app_id,
                    "reminder_type": "action_required",
                    "reminder_date": today.isoformat(),
                    "message": msg,
                    "is_sent": False,
                }
                saved = db.create_reminder(rem_data)
                new_reminders.append(saved)
                existing_messages.add(msg)

    # Return all current reminders for the user
    return db.get_reminders_by_user(user_id)
