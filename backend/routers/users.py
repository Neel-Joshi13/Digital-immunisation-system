from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.appointment import Appointment
from database.models.immunisation import ImmunisationRecord
from database.models.notification import Notification
from database.models.patient import Patient
from database.models.password_reset import PasswordResetToken
from database.models.user import User
from schemas.user import ChangePassword, UserCreate, UserResponse
from services.audit import create_audit_log
from services.security import hash_password, verify_password
from services.auth import get_current_user, require_role


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


@router.get("", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    statement = select(User)

    users = db.scalars(statement).all()

    return users


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    existing_user = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(user)
    db.flush()

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="CREATE_USER",
        target_type="USER",
        target_id=user.id,
        details=f"Created user account: {user.email} with role: {user.role}",
    )

    db.commit()
    db.refresh(user)

    return user


@router.delete(
    "/{user_id}",
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    user = db.scalar(
        select(User).where(User.id == user_id)
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if user.role != "PATIENT":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only patient accounts can be deleted.",
        )

    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == user.id
        )
    )

    if patient is not None:
        db.execute(
            delete(Notification).where(
                Notification.patient_id == patient.id
            )
        )

        db.execute(
            delete(Appointment).where(
                Appointment.patient_id == patient.id
            )
        )

        db.execute(
            delete(ImmunisationRecord).where(
                ImmunisationRecord.patient_id == patient.id
            )
        )

        db.delete(patient)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="DELETE_PATIENT",
        target_type="PATIENT",
        target_id=patient.id if patient else None,
        details=f"Deleted patient account: {user.email}",
    )

    db.execute(
        delete(PasswordResetToken).where(
            PasswordResetToken.user_id == user.id
        )
    )

    db.delete(user)
    db.commit()

    return {
        "message": "Patient account deleted successfully."
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/me/password",
)
def change_my_password(
    password_data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(
        password_data.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    if (
        password_data.new_password
        != password_data.confirm_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirmation password do not match.",
        )

    if verify_password(
        password_data.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password.",
        )

    current_user.password_hash = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully."
    }


@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    return {
        "message": "Admin access successful.",
        "user_id": current_user.id,
        "role": current_user.role,
    }