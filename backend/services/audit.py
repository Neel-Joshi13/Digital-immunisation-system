from sqlalchemy.orm import Session

from database.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    user_id: int | None,
    action: str,
    target_type: str | None = None,
    target_id: int | None = None,
    details: str | None = None,
):
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details,
    )

    db.add(audit_log)

    return audit_log