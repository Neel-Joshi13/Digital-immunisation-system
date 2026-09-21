from datetime import timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.audit_log import AuditLog
from database.models.user import User
from services.auth import require_role


router = APIRouter(
    prefix="/api/audit-logs",
    tags=["Audit Logs"],
)


@router.get("")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    statement = (
        select(AuditLog)
        .order_by(
            AuditLog.created_at.desc()
        )
    )

    audit_logs = db.scalars(statement).all()

    return [
        {
            "id": audit_log.id,
            "user_id": audit_log.user_id,
            "action": audit_log.action,
            "target_type": audit_log.target_type,
            "target_id": audit_log.target_id,
            "details": audit_log.details,
            "created_at": audit_log.created_at + timedelta(hours=5, minutes=30),
        }
        for audit_log in audit_logs
    ]