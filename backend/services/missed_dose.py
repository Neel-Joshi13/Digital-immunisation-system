from datetime import date, timedelta
import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from database.models.vaccination_schedule import VaccinationSchedule
from database.models.vaccine import Vaccine


def calculate_age_in_days(
    date_of_birth: date,
    on_date: date,
) -> int:
    return (on_date - date_of_birth).days


def parse_recommended_age(age_text: str | None):
    if not age_text:
        return None

    text = age_text.lower().strip()

    if "birth" in text:
        return 0

    range_match = re.search(
        r"(\d+)\s*[-–]\s*(\d+)\s*months?",
        text,
    )

    if range_match:
        months = int(range_match.group(1))
        return months * 30

    week_match = re.search(
        r"(\d+)\s*weeks?",
        text,
    )

    if week_match:
        weeks = int(week_match.group(1))
        return weeks * 7

    month_match = re.search(
        r"(\d+)\s*months?",
        text,
    )

    if month_match:
        months = int(month_match.group(1))
        return months * 30

    year_match = re.search(
        r"(\d+)\s*years?",
        text,
    )

    if year_match:
        years = int(year_match.group(1))
        return years * 365

    return None


def get_missed_dose_reason(
    schedule: VaccinationSchedule,
    due_date: date | None,
    today: date,
) -> str | None:
    if due_date is None:
        return None

    if today <= due_date:
        return None

    if schedule.dose_number == 1:
        if schedule.recommended_age:
            return (
                "This dose was recommended at "
                f"{schedule.recommended_age} and is not "
                "recorded in the patient's immunisation history."
            )

        return (
            "This dose is due and is not recorded in "
            "the patient's immunisation history."
        )

    return (
        "The recommended interval after the previous dose "
        "has passed, and this dose is not recorded in the "
        "patient's immunisation history."
    )


def get_patient_missed_doses(
    db: Session,
    patient: Patient,
):
    today = date.today()

    vaccines = db.scalars(
        select(Vaccine).where(
            Vaccine.is_active == True
        )
    ).all()

    schedules = db.scalars(
        select(VaccinationSchedule)
        .order_by(
            VaccinationSchedule.vaccine_id,
            VaccinationSchedule.dose_number,
        )
    ).all()

    records = db.scalars(
        select(ImmunisationRecord).where(
            ImmunisationRecord.patient_id == patient.id
        )
    ).all()

    completed = {
        (
            record.vaccine_id,
            record.dose_number,
        )
        for record in records
    }

    vaccine_map = {
        vaccine.id: vaccine
        for vaccine in vaccines
    }

    results = []

    for schedule in schedules:
        vaccine = vaccine_map.get(
            schedule.vaccine_id
        )

        if vaccine is None:
            continue

        key = (
            schedule.vaccine_id,
            schedule.dose_number,
        )

        if key in completed:
            continue

        due_date = None

        if schedule.dose_number == 1:
            recommended_age_days = parse_recommended_age(
                schedule.recommended_age
            )

            if recommended_age_days is not None:
                due_date = (
                    patient.date_of_birth
                    + timedelta(
                        days=recommended_age_days
                    )
                )

        else:
            previous_record = next(
                (
                    record
                    for record in records
                    if record.vaccine_id
                    == schedule.vaccine_id
                    and record.dose_number
                    == schedule.dose_number - 1
                ),
                None,
            )

            if (
                previous_record
                and schedule.minimum_interval_days
                is not None
            ):
                due_date = (
                    previous_record.date_administered
                    + timedelta(
                        days=schedule.minimum_interval_days
                    )
                )

        reason = get_missed_dose_reason(
            schedule,
            due_date,
            today,
        )

        if reason is None:
            continue

        results.append(
            {
                "vaccine_id": vaccine.id,
                "vaccine_name": vaccine.name,
                "dose_number": schedule.dose_number,
                "recommended_age": (
                    schedule.recommended_age
                ),
                "due_date": (
                    str(due_date)
                    if due_date
                    else None
                ),
                "reason": reason,
                "notes": schedule.notes,
                "source_name": schedule.source_name,
                "source_url": schedule.source_url,
            }
        )

    return results