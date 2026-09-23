from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.appointment import Appointment
from database.models.healthcare_centre import HealthcareCentre
from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from database.models.user import User
from database.models.vaccine import Vaccine
from schemas.missed_dose import MissedDoseResponse
from schemas.patient import (
    PatientCreate,
    PatientProfileCreate,
    PatientProfileUpdate,
    PatientResponse,
)
from services.auth import get_current_user, require_role
from services.email import (
    send_missed_vaccination_email,
    send_upcoming_vaccination_email,
)
from services.missed_dose import get_patient_missed_doses


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"],
)


@router.post(
    "",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "HEALTHCARE_WORKER")
    ),
):
    existing_patient = db.scalar(
        select(Patient).where(
            Patient.user_id == patient_data.user_id
        )
    )

    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A patient record already exists for this user.",
        )

    patient = Patient(
        user_id=patient_data.user_id,
        first_name=patient_data.first_name,
        last_name=patient_data.last_name,
        date_of_birth=patient_data.date_of_birth,
        gender=patient_data.gender,
        phone=patient_data.phone,
        address=patient_data.address,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.post(
    "/me",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_profile(
    profile_data: PatientProfileCreate,
    current_user: User = Depends(
        require_role("PATIENT")
    ),
    db: Session = Depends(get_db),
):
    existing_patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A patient profile already exists for this account.",
        )

    patient = Patient(
        user_id=current_user.id,
        first_name=profile_data.first_name,
        last_name=profile_data.last_name,
        date_of_birth=profile_data.date_of_birth,
        gender=profile_data.gender,
        phone=profile_data.phone,
        address=profile_data.address,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


@router.get(
    "/me",
    response_model=PatientResponse,
)
def get_my_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    return patient


@router.patch(
    "/me",
    response_model=PatientResponse,
)
def update_my_profile(
    profile_data: PatientProfileUpdate,
    current_user: User = Depends(
        require_role("PATIENT")
    ),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    update_data = profile_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return patient


@router.get(
    "/me/immunisations",
)
def get_my_immunisations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    statement = (
        select(ImmunisationRecord)
        .where(
            ImmunisationRecord.patient_id == patient.id
        )
        .order_by(
            ImmunisationRecord.date_administered.desc()
        )
    )

    immunisations = db.scalars(statement).all()

    return [
        {
            "id": record.id,
            "patient_id": record.patient_id,
            "vaccine_id": record.vaccine_id,
            "vaccine_name": record.vaccine.name,
            "dose_number": record.dose_number,
            "date_administered": record.date_administered,
            "administered_by": record.administered_by,
            "notes": record.notes,
        }
        for record in immunisations
    ]


@router.get(
    "/me/missed-doses",
    response_model=list[MissedDoseResponse],
)
def get_my_missed_doses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("PATIENT")
    ),
):
    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found.",
        )

    return get_patient_missed_doses(
        db=db,
        patient=patient,
    )


@router.get(
    "/missed-doses",
)
def get_all_missed_doses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    patients = db.scalars(
        select(Patient).order_by(
            Patient.last_name,
            Patient.first_name,
        )
    ).all()

    alerts = []

    for patient in patients:
        missed_doses = get_patient_missed_doses(
            db=db,
            patient=patient,
        )

        if not missed_doses:
            continue

        user = db.get(
            User,
            patient.user_id,
        )

        alerts.append(
            {
                "patient_id": patient.id,
                "user_id": patient.user_id,
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "phone": patient.phone,
                "email": (
                    user.email
                    if user
                    else None
                ),
                "missed_doses": missed_doses,
            }
        )

    return alerts


@router.post(
    "/missed-doses/{patient_id}/email",
)
def send_missed_dose_email(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    patient = db.get(
        Patient,
        patient_id,
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found.",
        )

    user = db.get(
        User,
        patient.user_id,
    )

    if user is None or not user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient email address not found.",
        )

    missed_doses = get_patient_missed_doses(
        db=db,
        patient=patient,
    )

    if not missed_doses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No missed vaccination doses found for this patient.",
        )

    patient_name = (
        f"{patient.first_name} {patient.last_name}".strip()
    )

    send_missed_vaccination_email(
        recipient_email=user.email,
        patient_name=patient_name,
        missed_doses=missed_doses,
    )

    return {
        "message": "Missed vaccination email sent successfully."
    }


@router.post(
    "/upcoming-appointments/{appointment_id}/email",
)
def send_upcoming_vaccination_email_endpoint(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    appointment = db.scalar(
        select(Appointment).where(
            Appointment.id == appointment_id
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if appointment.status != "SCHEDULED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only scheduled appointments can receive an upcoming vaccination reminder.",
        )

    appointment_datetime = datetime.combine(
        appointment.appointment_date,
        appointment.appointment_time,
    )

    if appointment_datetime <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This vaccination appointment is not upcoming.",
        )

    patient = db.get(
        Patient,
        appointment.patient_id,
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found.",
        )

    user = db.get(
        User,
        patient.user_id,
    )

    if user is None or not user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient email address not found.",
        )

    vaccine = db.get(
        Vaccine,
        appointment.vaccine_id,
    )

    if vaccine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccine not found.",
        )

    centre = db.get(
        HealthcareCentre,
        appointment.centre_id,
    )

    if centre is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Healthcare centre not found.",
        )

    patient_name = (
        f"{patient.first_name} {patient.last_name}".strip()
    )

    send_upcoming_vaccination_email(
        recipient_email=user.email,
        patient_name=patient_name,
        vaccine_name=vaccine.name,
        appointment_date=appointment.appointment_date.strftime(
            "%d %B %Y"
        ),
        appointment_time=appointment.appointment_time.strftime(
            "%I:%M %p"
        ),
        centre_name=centre.name,
    )

    return {
        "message": "Upcoming vaccination email sent successfully."
    }