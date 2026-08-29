from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from database.connection import get_db
from database.models.appointment import Appointment
from database.models.patient import Patient
from database.models.healthcare_centre import HealthcareCentre
from schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentResponse,
)
from services.auth import get_current_user, require_role


router = APIRouter(
    prefix="/api/appointments",
    tags=["Appointments"],
)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    centre = db.get(
        HealthcareCentre,
        appointment_data.centre_id,
    )

    if centre is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Healthcare centre not found.",
        )

    if not centre.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Healthcare centre is not active.",
        )

    if appointment_data.appointment_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date cannot be in the past.",
        )

    existing_appointment = db.scalar(
        select(Appointment).where(
            Appointment.centre_id == appointment_data.centre_id,
            Appointment.appointment_date
            == appointment_data.appointment_date,
            Appointment.appointment_time
            == appointment_data.appointment_time,
            Appointment.status == "SCHEDULED",
        )
    )

    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot is already booked.",
        )

    appointment = Appointment(
        patient_id=patient.id,
        centre_id=appointment_data.centre_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        status="SCHEDULED",
        reason=appointment_data.reason,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


@router.get(
    "/me",
    response_model=list[AppointmentResponse],
)
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user=Depends(
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    statement = (
        select(Appointment)
        .options(
            joinedload(Appointment.healthcare_centre)
        )
        .where(
            Appointment.patient_id == patient.id
        )
    )

    appointments = db.scalars(statement).all()

    return [
        {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "centre_id": appointment.centre_id,
            "centre_name": appointment.healthcare_centre.name,
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status,
            "reason": appointment.reason,
        }
        for appointment in appointments
    ]


@router.get(
    "",
    response_model=list[AppointmentResponse],
)
def get_appointments(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "PATIENT")
    ),
):
    statement = (
        select(Appointment)
        .options(
            joinedload(Appointment.healthcare_centre)
        )
    )

    appointments = db.scalars(statement).all()

    return [
        {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "centre_id": appointment.centre_id,
            "centre_name": appointment.healthcare_centre.name,
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status,
            "reason": appointment.reason,
        }
        for appointment in appointments
    ]


@router.patch(
    "/{appointment_id}/status",
    response_model=AppointmentResponse,
)
def update_appointment_status(
    appointment_id: int,
    status_data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "HEALTHCARE_WORKER")
    ),
):
    appointment = db.scalar(
        select(Appointment)
        .options(
            joinedload(Appointment.healthcare_centre)
        )
        .where(
            Appointment.id == appointment_id
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    allowed_statuses = {
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
    }

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment status.",
        )

    appointment.status = status_data.status

    db.commit()
    db.refresh(appointment)

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "centre_id": appointment.centre_id,
        "centre_name": appointment.healthcare_centre.name,
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "reason": appointment.reason,
    }
