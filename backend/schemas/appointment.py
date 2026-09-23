from datetime import date, time

from pydantic import BaseModel, ConfigDict


class AppointmentCreate(BaseModel):
    centre_id: int
    vaccine_id: int
    appointment_date: date
    appointment_time: time
    reason: str


class AppointmentStatusUpdate(BaseModel):
    status: str
    status_reason: str | None = None


class AppointmentReschedule(BaseModel):
    appointment_date: date
    appointment_time: time
    reason: str


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: str | None
    centre_id: int
    centre_name: str
    vaccine_id: int | None
    vaccine_name: str | None
    appointment_date: date
    appointment_time: time
    status: str
    reason: str
    status_reason: str | None

    model_config = ConfigDict(from_attributes=True)