from datetime import date

from pydantic import BaseModel


class MissedDoseResponse(BaseModel):
    vaccine_id: int
    vaccine_name: str
    dose_number: int
    recommended_age: str | None
    due_date: date | None
    days_overdue: int | None
    reason: str
    notes: str | None
    source_name: str | None
    source_url: str | None