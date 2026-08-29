from pydantic import BaseModel, ConfigDict


class VaccineCreate(BaseModel):
    name: str
    manufacturer: str
    description: str
    recommended_age: str
    doses_required: int
    source_name: str | None = None
    source_url: str | None = None


class VaccineResponse(BaseModel):
    id: int
    name: str
    manufacturer: str
    description: str
    recommended_age: str
    doses_required: int
    is_active: bool
    source_name: str | None = None
    source_url: str | None = None

    model_config = ConfigDict(from_attributes=True)