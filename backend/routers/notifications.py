from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.notification import Notification
from database.models.patient import Patient
from database.models.user import User
from schemas.notification import NotificationCreate, NotificationResponse
from services.auth import get_current_user, require_role


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)


def format_notification(notification):
    created_at = notification.created_at + timedelta(
        hours=5,
        minutes=30,
    )

    return {
        "id": notification.id,
        "patient_id": notification.patient_id,
        "admin_id": notification.admin_id,
        "title": notification.title,
        "message": notification.message,
        "notification_type": notification.notification_type,
        "is_read": notification.is_read,
        "created_at": created_at.strftime(
            "%d/%m/%Y, %I:%M:%S %p"
        ),
    }


@router.post(
    "",
    response_model=NotificationResponse,
    dependencies=[Depends(require_role("ADMIN"))],
)
def create_notification(
    notification_data: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(Patient.id == notification_data.patient_id)
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found.",
        )

    notification = Notification(
        patient_id=notification_data.patient_id,
        admin_id=current_user.id,
        title=notification_data.title,
        message=notification_data.message,
        notification_type=notification_data.notification_type,
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return format_notification(notification)


@router.get(
    "/me",
    response_model=list[NotificationResponse],
    dependencies=[Depends(require_role("PATIENT"))],
)
def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(Patient.user_id == current_user.id)
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found.",
        )

    notifications = db.scalars(
        select(Notification)
        .where(Notification.patient_id == patient.id)
        .order_by(Notification.created_at.desc())
    ).all()

    return [
        format_notification(notification)
        for notification in notifications
    ]


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    dependencies=[Depends(require_role("PATIENT"))],
)
def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.scalar(
        select(Patient).where(Patient.user_id == current_user.id)
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found.",
        )

    notification = db.scalar(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.patient_id == patient.id,
        )
    )

    if notification is None:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return format_notification(notification)