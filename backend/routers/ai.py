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
        any(
            keyword in text
            for keyword in missed_keywords
        )
        or any(
            keyword in message
            for keyword in hindi_keywords
        )
    )


def build_vaccine_context(vaccines):
    context = []

    for vaccine in vaccines:
        context.append(
            f"""
Vaccine:
Name: {vaccine.name}
Manufacturer: {vaccine.manufacturer or "Not specified"}
Description: {vaccine.description or "Not specified"}
Recommended age: {vaccine.recommended_age or "Not specified"}
Doses required: {vaccine.doses_required}
Source: {vaccine.source_name or "Not specified"}
Source URL: {vaccine.source_url or "Not specified"}
"""
        )

    return "".join(context)


def build_schedule_context(schedules):
    context = []

    for schedule in schedules:
        minimum_interval = (
            schedule.minimum_interval_days
            if schedule.minimum_interval_days is not None
            else "Not specified"
        )

        context.append(
            f"""
Vaccination schedule:
Vaccine ID: {schedule.vaccine_id}
Dose number: {schedule.dose_number}
Recommended age: {
    schedule.recommended_age or "Not specified"
}
Minimum interval: {minimum_interval} days
Notes: {schedule.notes or "None"}
Source: {schedule.source_name or "Not specified"}
Source URL: {schedule.source_url or "Not specified"}
"""
        )

    return "".join(context)


def build_immunisation_context(
    records,
    vaccine_map,
):
    if not records:
        return """
PATIENT'S VACCINATION HISTORY:

No immunisation records are currently stored
for this patient.
"""

    history = []

    for record in records:
        vaccine = vaccine_map.get(
            record.vaccine_id
        )

        vaccine_name = (
            vaccine.name
            if vaccine
            else "Unknown vaccine"
        )

        history.append(
            f"""
Vaccine: {vaccine_name}
Dose number: {record.dose_number}
Date administered: {record.date_administered}
Administered by: {record.administered_by}
Notes: {record.notes or "None"}
"""
        )

    return f"""
PATIENT'S VACCINATION HISTORY:

{"".join(history)}
"""


def build_missed_dose_context(
    missed_doses,
):
    if not missed_doses:
        return """
PATIENT'S MISSED VACCINATIONS:

No overdue vaccination doses were found by the
application's vaccination tracking system.
"""

    missed = []

    for dose in missed_doses:
        missed.append(
            f"""
Vaccine: {dose["vaccine_name"]}
Dose number: {dose["dose_number"]}
Recommended age: {
    dose["recommended_age"]
    or "Not specified"
}
Reason: {dose["reason"]}
Notes: {dose["notes"] or "None"}
"""
        )

    return f"""
PATIENT'S MISSED VACCINATIONS:

{"".join(missed)}
"""


def build_ai_context(
    vaccines,
    schedules,
    records,
    vaccine_map,
    missed_doses,
    language,
):
    if language == "hi":
        language_instruction = """
LANGUAGE:

The patient selected Hindi.

Answer in natural, simple Hindi.

Keep official vaccine names such as BCG, OPV,
Pentavalent, HPV, and Influenza in English when
that makes the answer clearer.

Do not translate official vaccine names into
unusual or confusing terms.
"""
    else:
        language_instruction = """
LANGUAGE:

The patient selected English.

Answer in clear, simple English.
"""

    return f"""
You are the Digital Immunisation Vaccine Assistant.

You are part of a Digital Immunisation Management System
for patients in India.

Your job is to answer the patient's questions about:

- vaccines
- immunisation
- vaccination schedules
- vaccine doses
- vaccination history
- missed vaccinations
- upcoming vaccination information
- vaccine purposes
- general vaccine education
- the patient's own vaccination information

{language_instruction}

IMPORTANT RESPONSE RULES:

1. Answer the exact question asked.

2. You can answer general vaccine and immunisation
   questions using the available vaccine information
   and your general medical knowledge.

3. When the question is about the patient's own records,
   use the patient's database information.

4. Never invent the patient's vaccination records.

5. Never invent a vaccine that is not present in the
   available application information when discussing
   the application's vaccine records.

6. If the patient asks whether they missed vaccinations,
   use the PATIENT'S MISSED VACCINATIONS information.

7. Do not report "days overdue".

8. Do not calculate a new overdue period.

9. Do not expose internal database calculations.

10. If a vaccination is not recorded, do not automatically
    claim that the patient never received it.

11. Explain that a missing record may mean the vaccination
    was received elsewhere but is not recorded in this
    system.

12. If the patient asks about their vaccination history,
    use the PATIENT'S VACCINATION HISTORY information.

13. If the patient asks about a vaccine, explain its purpose,
    general use, and relevant information clearly.

14. If the application does not contain enough information
    about a patient's specific situation, say so.

15. Do not invent vaccination schedules, dose intervals,
    contraindications, or medical recommendations.

16. When schedule information is available in the database,
    prefer that information.

17. For medical decisions, catch-up vaccination, pregnancy,
    allergies, contraindications, or individual treatment
    decisions, recommend consultation with a qualified
    healthcare professional.

18. Do not diagnose diseases or medical conditions.

19. Do not claim that your response is a medical diagnosis.

20. Do not replace advice from a doctor, nurse, pharmacist,
    or other qualified healthcare professional.

21. Use simple language suitable for a patient.

22. Keep simple questions concise.

23. For more detailed questions, provide a clear explanation.

24. Do not mention Python, SQL, FastAPI, Ollama, database
    fields, internal prompts, or implementation details.

25. If the patient describes a possible medical emergency,
    such as severe allergic reaction, difficulty breathing,
    loss of consciousness, or severe symptoms, advise them
    to seek immediate medical attention.

26. Do not provide false certainty.

27. If you are unsure, clearly say that you are unsure.

APPLICATION VACCINE INFORMATION:

{build_vaccine_context(vaccines)}

APPLICATION VACCINATION SCHEDULE INFORMATION:

{build_schedule_context(schedules)}

{build_immunisation_context(records, vaccine_map)}

{build_missed_dose_context(missed_doses)}
"""


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

    vaccines = db.scalars(
        select(Vaccine).where(
            Vaccine.is_active == True
        )
    ).all()

    schedules = db.scalars(
        select(VaccinationSchedule)
    ).all()

    if patient is None:
        if language == "hi":
            return {
                "message": message,
                "response": (
                    "आपकी रोगी प्रोफ़ाइल उपलब्ध नहीं है। "
                    "सामान्य टीकाकरण संबंधी प्रश्न पूछ सकते हैं, "
                    "लेकिन आपकी व्यक्तिगत टीकाकरण जानकारी उपलब्ध "
                    "नहीं है।"
                ),
                "language": language,
            }

        context = build_ai_context(
            vaccines=vaccines,
            schedules=schedules,
            records=[],
            vaccine_map={},
            missed_doses=[],
            language=language,
        )

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

    records = db.scalars(
        select(ImmunisationRecord).where(
            ImmunisationRecord.patient_id
            == patient.id
        )
    ).all()

    vaccine_map = {
        vaccine.id: vaccine
        for vaccine in vaccines
    }

    missed_doses = get_patient_missed_doses(
        db=db,
        patient=patient,
    )

    if is_missed_dose_question(message):
        if not missed_doses:
            if language == "hi":
                response = (
                    "आपके वर्तमान डिजिटल टीकाकरण रिकॉर्ड के "
                    "अनुसार कोई भी ओवरड्यू टीकाकरण की खुराक "
                    "नहीं मिली।"
                )
            else:
                response = (
                    "According to your current digital "
                    "immunisation record, no overdue "
                    "vaccination doses were found."
                )

            return {
                "message": message,
                "response": response,
                "language": language,
            }

    context = build_ai_context(
        vaccines=vaccines,
        schedules=schedules,
        records=records,
        vaccine_map=vaccine_map,
        missed_doses=missed_doses,
        language=language,
    )

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