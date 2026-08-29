from pydantic import BaseModel, ConfigDict


class HealthcareCentreCreate(BaseModel):
    name: str
    address: str
    phone: str
    email: str


class HealthcareCentreResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    email: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)