from pydantic import BaseModel, ConfigDict


class VaccinationScheduleCreate(BaseModel):
    vaccine_id: int
    dose_number: int
    recommended_age: str | None = None
    minimum_interval_days: int | None = None
    notes: str | None = None
    source_name: str | None = None
    source_url: str | None = None


class VaccinationScheduleResponse(BaseModel):
    id: int
    vaccine_id: int
    dose_number: int
    recommended_age: str | None
    minimum_interval_days: int | None
    notes: str | None
    source_name: str | None
    source_url: str | None

    model_config = ConfigDict(from_attributes=True)