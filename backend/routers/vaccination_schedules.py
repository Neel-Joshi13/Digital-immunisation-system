from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.vaccination_schedule import VaccinationSchedule
from database.models.vaccine import Vaccine
from schemas.vaccination_schedule import (
    VaccinationScheduleCreate,
    VaccinationScheduleResponse,
)
from services.auth import require_role


router = APIRouter(
    prefix="/api/vaccination-schedules",
    tags=["Vaccination Schedules"],
)


@router.get(
    "",
    response_model=list[VaccinationScheduleResponse],
)
def get_vaccination_schedules(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "PATIENT")
    ),
):
    statement = select(VaccinationSchedule)

    schedules = db.scalars(statement).all()

    return schedules


@router.post(
    "",
    response_model=VaccinationScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vaccination_schedule(
    schedule_data: VaccinationScheduleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("ADMIN")),
):
    vaccine = db.scalar(
        select(Vaccine).where(
            Vaccine.id == schedule_data.vaccine_id
        )
    )

    if vaccine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccine not found.",
        )

    existing_schedule = db.scalar(
        select(VaccinationSchedule).where(
            VaccinationSchedule.vaccine_id
            == schedule_data.vaccine_id,
            VaccinationSchedule.dose_number
            == schedule_data.dose_number,
        )
    )

    if existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A schedule for this vaccine and dose already exists.",
        )

    schedule = VaccinationSchedule(
        vaccine_id=schedule_data.vaccine_id,
        dose_number=schedule_data.dose_number,
        recommended_age=schedule_data.recommended_age,
        minimum_interval_days=schedule_data.minimum_interval_days,
        notes=schedule_data.notes,
        source_name=schedule_data.source_name,
        source_url=schedule_data.source_url,
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return schedule