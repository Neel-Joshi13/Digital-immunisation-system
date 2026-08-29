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