from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.user import User
from database.models.vaccine import Vaccine
from database.models.vaccination_schedule import VaccinationSchedule
from services.auth import require_role
from services.ai import generate_ai_response


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)


@router.post("/assistant")
def ask_ai_assistant(
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("PATIENT")
    ),
):
    vaccines = db.scalars(
        select(Vaccine).where(
            Vaccine.is_active == True
        )
    ).all()

    schedules = db.scalars(
        select(VaccinationSchedule)
    ).all()

    vaccine_context = []

    for vaccine in vaccines:
        vaccine_context.append(
            f"""
Vaccine:
Name: {vaccine.name}
Manufacturer: {vaccine.manufacturer}
Description: {vaccine.description}
Recommended age: {vaccine.recommended_age}
Doses required: {vaccine.doses_required}
Source: {vaccine.source_name or "Not specified"}
Source URL: {vaccine.source_url or "Not specified"}
"""
        )

    schedule_context = []

    for schedule in schedules:
        schedule_context.append(
            f"""
Vaccination schedule:
Vaccine ID: {schedule.vaccine_id}
Dose number: {schedule.dose_number}
Recommended age: {schedule.recommended_age or "Not specified"}
Minimum interval: {
    schedule.minimum_interval_days
    if schedule.minimum_interval_days is not None
    else "Not specified"
} days
Notes: {schedule.notes or "None"}
Source: {schedule.source_name or "Not specified"}
Source URL: {schedule.source_url or "Not specified"}
"""
        )

    context = f"""
You are the Digital Immunisation Vaccine Assistant.

This application is intended for users in INDIA.

Answer questions about vaccines, immunisation,
vaccination schedules, doses, missed doses,
upcoming doses and general vaccine information.

IMPORTANT RULES:

1. Give India-specific information whenever possible.
2. Prefer the vaccination information provided in the
   application database.
3. Do not invent vaccine schedules or dose intervals.
4. If the database does not contain enough information,
   clearly say that the user should verify the information
   with an authorised healthcare professional or official
   Indian health source.
5. Do not diagnose diseases.
6. Do not replace advice from a doctor or healthcare worker.
7. Explain information in simple language.
8. If the user asks about an emergency or serious reaction,
   advise them to seek immediate medical attention.
9. Never claim that the AI response is a medical diagnosis.

AVAILABLE VACCINE INFORMATION:
{"".join(vaccine_context)}

AVAILABLE VACCINATION SCHEDULE INFORMATION:
{"".join(schedule_context)}
"""

    response = generate_ai_response(
        message=message,
        context=context,
    )

    return {
        "message": message,
        "response": response,
    }