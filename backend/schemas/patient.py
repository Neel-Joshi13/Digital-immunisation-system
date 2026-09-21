from datetime import date

from pydantic import BaseModel, ConfigDict


class PatientCreate(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    phone: str
    address: str


class PatientProfileCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    phone: str
    address: str


class PatientProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    phone: str | None = None
    address: str | None = None


class PatientResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    phone: str
    address: str

    model_config = ConfigDict(from_attributes=True)