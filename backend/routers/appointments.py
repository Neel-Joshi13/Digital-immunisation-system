from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from database.connection import get_db
from database.models.appointment import Appointment
from database.models.healthcare_centre import HealthcareCentre
from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from database.models.vaccine import Vaccine
from schemas.appointment import (
    AppointmentCreate,
    AppointmentReschedule,
    AppointmentResponse,
    AppointmentStatusUpdate,
)
from services.auth import require_role


router = APIRouter(
    prefix="/api/appointments",
    tags=["Appointments"],
)


def update_missed_status(appointment):
    if appointment.status != "SCHEDULED":
        return

    appointment_datetime = datetime.combine(
        appointment.appointment_date,
        appointment.appointment_time,
    )

    if appointment_datetime < datetime.now():
        appointment.status = "MISSED"


def appointment_response(appointment):
    update_missed_status(appointment)

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "patient_name": (
            f"{appointment.patient.first_name} "
            f"{appointment.patient.last_name}".strip()
            if appointment.patient
            else None
        ),
        "centre_id": appointment.centre_id,
        "centre_name": appointment.healthcare_centre.name,
        "vaccine_id": appointment.vaccine_id,
        "vaccine_name": (
            appointment.vaccine.name
            if appointment.vaccine
            else None
        ),
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "reason": appointment.reason,
        "status_reason": appointment.status_reason,
    }


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

    vaccine = db.get(
        Vaccine,
        appointment_data.vaccine_id,
    )

    if vaccine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaccine not found.",
        )

    appointment_datetime = datetime.combine(
        appointment_data.appointment_date,
        appointment_data.appointment_time,
    )

    if appointment_datetime <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date and time must be in the future.",
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
        vaccine_id=appointment_data.vaccine_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        status="SCHEDULED",
        reason=appointment_data.reason,
        status_reason=None,
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    appointment = db.scalar(
        select(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
        )
        .where(Appointment.id == appointment.id)
    )

    return appointment_response(appointment)


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
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
        )
        .where(
            Appointment.patient_id == patient.id
        )
    )

    appointments = db.scalars(statement).all()

    changed = False

    for appointment in appointments:
        previous_status = appointment.status
        update_missed_status(appointment)

        if appointment.status != previous_status:
            changed = True

    if changed:
        db.commit()

    return [
        appointment_response(appointment)
        for appointment in appointments
    ]


@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentResponse,
)
def cancel_my_appointment(
    appointment_id: int,
    appointment_data: AppointmentStatusUpdate,
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

    appointment = db.scalar(
        select(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
        )
        .where(
            Appointment.id == appointment_id,
            Appointment.patient_id == patient.id,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    update_missed_status(appointment)

    if appointment.status != "SCHEDULED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only scheduled appointments can be cancelled.",
        )

    if not appointment_data.status_reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancellation reason is required.",
        )

    appointment.status = "CANCELLED"
    appointment.status_reason = appointment_data.status_reason

    db.commit()
    db.refresh(appointment)

    return appointment_response(appointment)


@router.patch(
    "/{appointment_id}/reschedule",
    response_model=AppointmentResponse,
)
def reschedule_my_appointment(
    appointment_id: int,
    appointment_data: AppointmentReschedule,
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

    appointment = db.scalar(
        select(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
        )
        .where(
            Appointment.id == appointment_id,
            Appointment.patient_id == patient.id,
        )
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    update_missed_status(appointment)

    if appointment.status != "SCHEDULED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only scheduled appointments can be rescheduled.",
        )

    appointment_datetime = datetime.combine(
        appointment_data.appointment_date,
        appointment_data.appointment_time,
    )

    if appointment_datetime <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date and time must be in the future.",
        )

    existing_appointment = db.scalar(
        select(Appointment).where(
            Appointment.id != appointment.id,
            Appointment.centre_id == appointment.centre_id,
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

    appointment.appointment_date = (
        appointment_data.appointment_date
    )

    appointment.appointment_time = (
        appointment_data.appointment_time
    )

    appointment.status_reason = appointment_data.reason

    db.commit()
    db.refresh(appointment)

    return appointment_response(appointment)


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
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
        )
    )

    appointments = db.scalars(statement).all()

    changed = False

    for appointment in appointments:
        previous_status = appointment.status
        update_missed_status(appointment)

        if appointment.status != previous_status:
            changed = True

    if changed:
        db.commit()

    return [
        appointment_response(appointment)
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
            joinedload(Appointment.patient),
            joinedload(Appointment.healthcare_centre),
            joinedload(Appointment.vaccine),
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

    update_missed_status(appointment)

    allowed_statuses = {
        "SCHEDULED",
        "VACCINATION_DONE",
        "CANCELLED",
        "MISSED",
    }

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment status.",
        )

    if (
        status_data.status == "MISSED"
        and appointment.status != "MISSED"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missed status is automatically determined by the appointment time.",
        )

    if status_data.status == "VACCINATION_DONE":
        if appointment.status != "SCHEDULED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only scheduled appointments can be marked as vaccination done.",
            )

        existing_immunisation = db.scalar(
            select(ImmunisationRecord).where(
                ImmunisationRecord.patient_id
                == appointment.patient_id,
                ImmunisationRecord.vaccine_id
                == appointment.vaccine_id,
                ImmunisationRecord.date_administered
                == appointment.appointment_date,
            )
        )

        if existing_immunisation is None:
            previous_records = db.scalars(
                select(ImmunisationRecord).where(
                    ImmunisationRecord.patient_id
                    == appointment.patient_id,
                    ImmunisationRecord.vaccine_id
                    == appointment.vaccine_id,
                )
            ).all()

            dose_number = len(previous_records) + 1

            immunisation = ImmunisationRecord(
                patient_id=appointment.patient_id,
                vaccine_id=appointment.vaccine_id,
                dose_number=dose_number,
                date_administered=appointment.appointment_date,
                administered_by=appointment.healthcare_centre.name,
                notes=appointment.reason,
            )

            db.add(immunisation)

    if status_data.status == "CANCELLED":
        if not status_data.status_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cancellation reason is required.",
            )

    appointment.status = status_data.status

    if status_data.status_reason:
        appointment.status_reason = status_data.status_reason

    db.commit()
    db.refresh(appointment)

    return appointment_response(appointment)