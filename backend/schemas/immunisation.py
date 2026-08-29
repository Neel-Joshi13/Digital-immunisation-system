from datetime import date

from pydantic import BaseModel, ConfigDict


class ImmunisationCreate(BaseModel):
    patient_id: int
    vaccine_id: int
    dose_number: int
    date_administered: date
    notes: str | None = None


class ImmunisationResponse(BaseModel):
    id: int
    patient_id: int
    vaccine_id: int
    dose_number: int
    date_administered: date
    administered_by: str
    notes: str | None

    model_config = ConfigDict(from_attributes=True)


class PatientImmunisationResponse(BaseModel):
    id: int
    patient_id: int
    vaccine_id: int
    vaccine_name: str
    dose_number: int
    date_administered: date
    administered_by: str
    notes: str | None

    model_config = ConfigDict(from_attributes=True)