from datetime import date, time

from pydantic import BaseModel, ConfigDict


class AppointmentCreate(BaseModel):
    centre_id: int
    appointment_date: date
    appointment_time: time
    reason: str


class AppointmentStatusUpdate(BaseModel):
    status: str


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    centre_id: int
    centre_name: str

    appointment_date: date
    appointment_time: time
    status: str
    reason: str

    model_config = ConfigDict(from_attributes=True)