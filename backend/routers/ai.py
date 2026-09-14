from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from database.models.user import User
from database.models.vaccination_schedule import VaccinationSchedule
from database.models.vaccine import Vaccine
from services.ai import generate_ai_response
from services.auth import require_role
from services.missed_dose import get_patient_missed_doses


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)


def is_missed_dose_question(message: str) -> bool:
    text = message.lower().strip()

    missed_keywords = [
        "missed vaccination",
        "missed vaccinations",
        "missed vaccine",
        "missed vaccines",
        "missed dose",
        "missed doses",
        "overdue vaccination",
        "overdue vaccinations",
        "overdue vaccine",
        "overdue vaccines",
        "have i missed",
        "did i miss",
        "any missed",
        "vaccination missed",
    ]

    hindi_keywords = [
        "टीका छूटा",
        "टीके छूटे",
        "टीकाकरण छूटा",
        "टीकाकरण छूटे",
        "खुराक छूटी",
        "खुराक छूटे",
        "टीकाकरण की खुराक छूटी",
        "कोई टीका छूटा",
        "कोई खुराक छूटी",
    ]

    return (
        any(keyword in text for keyword in missed_keywords)
        or any(keyword in message for keyword in hindi_keywords)
    )


@router.post("/assistant")
def ask_ai_assistant(
    message: str,
    language: str = "en",
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("PATIENT")
    ),
):
    if language not in ["en", "hi"]:
        language = "en"

    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if is_missed_dose_question(message):
        if patient is None:
            if language == "hi":
                return {
                    "message": message,
                    "response": (
                        "आपकी रोगी प्रोफ़ाइल नहीं मिली। "
                        "कृपया अपने स्वास्थ्य सेवा केंद्र से संपर्क करें।"
                    ),
                    "language": language,
                }

            return {
                "message": message,
                "response": (
                    "Your patient profile could not be found. "
                    "Please contact your healthcare centre."
                ),
                "language": language,
            }

        missed_doses = get_patient_missed_doses(
            db=db,
            patient=patient,
        )

        if not missed_doses:
            if language == "hi":
                response = (
                    "आपके रिकॉर्ड के अनुसार वर्तमान में "
                    "कोई भी टीकाकरण की खुराक बकाया या ओवरड्यू नहीं है।"
                )
            else:
                response = (
                    "According to your records, the application "
                    "currently shows no overdue vaccination doses."
                )

            return {
                "message": message,
                "response": response,
                "language": language,
            }

        if language == "hi":
            response_lines = [
                "हाँ, आपके रिकॉर्ड के अनुसार निम्नलिखित "
                "टीकाकरण की खुराक ओवरड्यू है:",
                "",
            ]

            for dose in missed_doses:
                response_lines.append(
                    f"• टीका: {dose['vaccine_name']}"
                )

                response_lines.append(
                    f"  खुराक संख्या: {dose['dose_number']}"
                )

                response_lines.append(
                    f"  निर्धारित तिथि: {dose['due_date']}"
                )

                response_lines.append(
                    f"  कितने दिन ओवरड्यू: "
                    f"{dose['days_overdue']} दिन"
                )

                response_lines.append("")

            response_lines.append(
                "कृपया आगे की जानकारी और टीकाकरण की व्यवस्था "
                "के लिए अपने स्वास्थ्य सेवा केंद्र या योग्य "
                "स्वास्थ्य पेशेवर से संपर्क करें।"
            )

            response = "\n".join(response_lines)

        else:
            response_lines = [
                "Yes. According to your records, "
                "the following vaccination doses are overdue:",
                "",
            ]

            for dose in missed_doses:
                response_lines.append(
                    f"• Vaccine: {dose['vaccine_name']}"
                )

                response_lines.append(
                    f"  Dose number: {dose['dose_number']}"
                )

                response_lines.append(
                    f"  Due date: {dose['due_date']}"
                )

                response_lines.append(
                    f"  Days overdue: "
                    f"{dose['days_overdue']} days"
                )

                response_lines.append("")

            response_lines.append(
                "Please contact your healthcare centre or "
                "a qualified healthcare professional to "
                "arrange the appropriate vaccination."
            )

            response = "\n".join(response_lines)

        return {
            "message": message,
            "response": response,
            "language": language,
        }

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

    missed_dose_context = ""

    if patient is not None:
        missed_doses = get_patient_missed_doses(
            db=db,
            patient=patient,
        )

        if missed_doses:
            missed_dose_lines = []

            for dose in missed_doses:
                missed_dose_lines.append(
                    f"""
Vaccine: {dose["vaccine_name"]}
Dose number: {dose["dose_number"]}
Due date: {dose["due_date"]}
Days overdue: {dose["days_overdue"]}
Recommended age: {
    dose["recommended_age"]
    or "Not specified"
}
Reason: {dose["reason"]}
Notes: {dose["notes"] or "None"}
"""
                )

            missed_dose_context = f"""
PATIENT'S ACTUAL MISSED VACCINATIONS:

The following doses have been calculated by the
application's vaccination tracking system as overdue:

{"".join(missed_dose_lines)}
"""

        else:
            missed_dose_context = """
PATIENT'S ACTUAL MISSED VACCINATIONS:

No overdue vaccination doses were found by the
application's vaccination tracking system.
"""

    if language == "hi":
        language_instruction = """
LANGUAGE REQUIREMENT:

The patient has selected Hindi.

Respond ONLY in Hindi.

Use natural, simple Hindi that is easy for a patient
to understand.

Answer the exact question asked by the patient.

Official vaccine names such as BCG, OPV,
Pentavalent, etc. may remain in English.
"""

    else:
        language_instruction = """
LANGUAGE REQUIREMENT:

The patient has selected English.

Respond in simple, clear English.

Answer the exact question asked by the patient.
"""

    context = f"""
You are the Digital Immunisation Vaccine Assistant.

This application is intended for users in INDIA.

You are assisting the currently logged-in patient.

Answer questions about vaccines, immunisation,
vaccination schedules, doses, upcoming doses,
and general vaccine information.

{language_instruction}

IMPORTANT RULES:

1. Give India-specific information whenever possible.

2. Prefer information provided in the application database.

3. Do not invent vaccine schedules or dose intervals.

4. If the database does not contain enough information,
clearly say that the information is unavailable.

5. Recommend verification with an authorised healthcare
professional or official Indian health source when needed.

6. Do not diagnose diseases.

7. Do not replace advice from a doctor or healthcare worker.

8. Explain information in simple language.

9. If the user describes an emergency or serious reaction,
advise them to seek immediate medical attention.

10. Never claim that the AI response is a medical diagnosis.

{missed_dose_context}

AVAILABLE VACCINE INFORMATION:
{"".join(vaccine_context)}

AVAILABLE VACCINATION SCHEDULE INFORMATION:
{"".join(schedule_context)}
"""

    response = generate_ai_response(
        message=message,
        context=context,
        language=language,
    )

    return {
        "message": message,
        "response": response,
        "language": language,
    }