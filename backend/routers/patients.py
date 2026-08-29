from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.patient import Patient
from database.models.immunisation import ImmunisationRecord
from database.models.user import User
from schemas.patient import PatientCreate, PatientResponse
from schemas.missed_dose import MissedDoseResponse
from services.auth import get_current_user, require_role
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