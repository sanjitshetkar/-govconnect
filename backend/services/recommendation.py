"""
GovConnect Scheme Recommendation Service
Compares citizen user profiles against scheme eligibility rules to determine eligibility and match scores.
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date
from database import db


def _calculate_age(dob_str: Optional[str]) -> Optional[int]:
    """Calculate age in years from ISO date string (YYYY-MM-DD)."""
    if not dob_str:
        return None
    try:
        dob = datetime.strptime(dob_str.strip()[:10], "%Y-%m-%d").date()
        today = date.today()
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    except Exception:
        return None


def get_recommendations_for_user(user_id: str) -> List[Dict[str, Any]]:
    """
    Evaluate all active government schemes against the user's demographic & socioeconomic profile.
    Returns structured recommendations with match scores and criteria breakdowns.
    """
    user = db.get_user_by_id(user_id)
    if not user:
        return []

    schemes = db.get_schemes(active_only=True)
    all_eligibility = db.get_all_eligibility_rules()
    eligibility_map = {e.get("scheme_id"): e for e in all_eligibility}

    user_age = _calculate_age(user.get("date_of_birth"))
    user_income = float(user.get("annual_income") or 0.0)
    user_state = (user.get("state") or "").lower().strip()
    user_occupation = (user.get("occupation") or "").lower().strip()
    user_gender = (user.get("gender") or "All").lower().strip()

    recommendations = []

    for scheme in schemes:
        scheme_id = scheme.get("scheme_id")
        elig = eligibility_map.get(scheme_id)

        matched_criteria = []
        missing_requirements = []
        total_checks = 0
        passed_checks = 0

        if not elig:
            # If no strict rule defined, general eligibility
            matched_criteria.append("Open to all Indian citizens")
            recommendations.append({
                "scheme_id": scheme_id,
                "scheme_name": scheme.get("name"),
                "scheme_code": scheme.get("scheme_code"),
                "category": scheme.get("category"),
                "funding_amount": scheme.get("funding_amount"),
                "deadline": scheme.get("deadline"),
                "is_eligible": True,
                "match_score": 90,
                "matched_criteria": matched_criteria,
                "missing_requirements": missing_requirements,
                "description": scheme.get("description"),
            })
            continue

        # 1. Age check
        min_age = elig.get("min_age", 0)
        max_age = elig.get("max_age", 120)
        total_checks += 1
        if user_age is not None:
            if min_age <= user_age <= max_age:
                passed_checks += 1
                matched_criteria.append(f"Age {user_age} falls within required bracket ({min_age}-{max_age} yrs)")
            else:
                missing_requirements.append(f"Age {user_age} outside required range ({min_age}-{max_age} yrs)")
        else:
            matched_criteria.append(f"Applicable for age range {min_age}-{max_age} yrs")
            passed_checks += 0.8

        # 2. Income check
        max_income = elig.get("max_income")
        if max_income is not None:
            total_checks += 1
            if user_income <= float(max_income):
                passed_checks += 1
                matched_criteria.append(f"Annual income ₹{user_income:,.0f} complies with ceiling of ₹{float(max_income):,.0f}")
            else:
                missing_requirements.append(f"Annual income ₹{user_income:,.0f} exceeds scheme ceiling of ₹{float(max_income):,.0f}")

        # 3. Residence / State check
        req_state = (elig.get("requires_residence") or "All India").lower().strip()
        if req_state not in ["all india", "all", ""]:
            total_checks += 1
            if req_state in user_state or user_state in req_state:
                passed_checks += 1
                matched_criteria.append(f"Domicile state matches requirement ({elig.get('requires_residence')})")
            else:
                missing_requirements.append(f"Scheme restricted to residents of {elig.get('requires_residence')}")
        else:
            matched_criteria.append("Pan-India national coverage (All States & UTs)")

        # 4. Occupation / Category check
        req_occ = (elig.get("occupation") or "All").lower().strip()
        if req_occ not in ["all", ""]:
            total_checks += 1
            occ_keywords = [k.strip() for k in req_occ.replace("/", ",").split(",")]
            if any(k in user_occupation for k in occ_keywords if k):
                passed_checks += 1
                matched_criteria.append(f"Occupation matches targeted demographic ({elig.get('occupation')})")
            else:
                # Soft match if entrepreneur/founder matches business schemes
                if ("startup" in scheme.get("category", "").lower() or "msme" in scheme.get("category", "").lower()) and ("founder" in user_occupation or "cto" in user_occupation or "director" in user_occupation):
                    passed_checks += 1
                    matched_criteria.append("Executive/Founder profile matches enterprise grant criteria")
                else:
                    missing_requirements.append(f"Targeted for: {elig.get('occupation')}")

        # 5. Gender check
        req_gender = (elig.get("gender") or "All").lower().strip()
        if req_gender not in ["all", ""]:
            total_checks += 1
            if req_gender == user_gender:
                passed_checks += 1
                matched_criteria.append(f"Gender eligibility verified ({elig.get('gender')})")
            else:
                missing_requirements.append(f"Scheme targeted for {elig.get('gender')} applicants")

        # Compute match percentage
        match_score = int(round((passed_checks / max(total_checks, 1)) * 100))
        is_eligible = (len(missing_requirements) == 0) and (match_score >= 70)

        recommendations.append({
            "scheme_id": scheme_id,
            "scheme_name": scheme.get("name"),
            "scheme_code": scheme.get("scheme_code"),
            "category": scheme.get("category"),
            "funding_amount": scheme.get("funding_amount"),
            "deadline": scheme.get("deadline"),
            "is_eligible": is_eligible,
            "match_score": min(match_score, 100),
            "matched_criteria": matched_criteria,
            "missing_requirements": missing_requirements,
            "description": scheme.get("description"),
        })

    # Sort: Eligible schemes first, then by match_score descending
    recommendations.sort(key=lambda r: (1 if r["is_eligible"] else 0, r["match_score"]), reverse=True)
    return recommendations
