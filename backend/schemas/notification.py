from datetime import datetime

from pydantic import BaseModel


class NotificationCreate(BaseModel):
    patient_id: int
    title: str
    message: str
    notification_type: str = "MISSED_DOSE"


class NotificationResponse(BaseModel):
    id: int
    patient_id: int
    admin_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True