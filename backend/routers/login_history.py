from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.login_history import LoginHistory
from database.models.user import User
from services.auth import require_role
from datetime import timedelta


router = APIRouter(
    prefix="/api/login-history",
    tags=["Login History"],
)


@router.get("")
def get_login_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    statement = (
        select(LoginHistory)
        .order_by(
            LoginHistory.created_at.desc()
        )
    )

    login_history = db.scalars(statement).all()

    return [
        {
            "id": record.id,
            "user_id": record.user_id,
            "email": record.email,
            "event_type": record.event_type,
            "ip_address": record.ip_address,
            "user_agent": record.user_agent,
            "created_at": record.created_at + timedelta(hours=5, minutes=30),
        }
        for record in login_history
    ]