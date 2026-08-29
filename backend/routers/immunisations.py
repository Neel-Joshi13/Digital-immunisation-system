from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from database.models.vaccine import Vaccine
from schemas.immunisation import (
    ImmunisationCreate,
    ImmunisationResponse,
    PatientImmunisationResponse,
)
from services.auth import get_current_user, require_role


router = APIRouter(
    prefix="/api/immunisations",
    tags=["Immunisations"],
)


@router.post(
    "",
    response_model=ImmunisationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_immunisation(
    immunisation_data: ImmunisationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "HEALTHCARE_WORKER")
    ),
):
    patient = db.get(
        Patient,
        immunisation_data.patient_id,
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found.",
        )

    vaccine = db.get(
        Vaccine,
        immunisation_data.vaccine_id,
    )

    if vaccine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccine not found.",
        )

    immunisation = ImmunisationRecord(
        patient_id=immunisation_data.patient_id,
        vaccine_id=immunisation_data.vaccine_id,
        dose_number=immunisation_data.dose_number,
        date_administered=immunisation_data.date_administered,
        administered_by=str(current_user.id),
        notes=immunisation_data.notes,
    )

    db.add(immunisation)
    db.commit()
    db.refresh(immunisation)

    return immunisation


@router.get(
    "",
    response_model=list[ImmunisationResponse],
)
def get_immunisations(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "HEALTHCARE_WORKER")
    ),
):
    statement = select(ImmunisationRecord)

    immunisations = db.scalars(statement).all()

    return immunisations


@router.get(
    "/patients/me",
    response_model=list[PatientImmunisationResponse],
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
        PatientImmunisationResponse(
            id=record.id,
            patient_id=record.patient_id,
            vaccine_id=record.vaccine_id,
            vaccine_name=record.vaccine.name,
            dose_number=record.dose_number,
            date_administered=record.date_administered,
            administered_by=record.administered_by,
            notes=record.notes,
        )
        for record in immunisations
    ]