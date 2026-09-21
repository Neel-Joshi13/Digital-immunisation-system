import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.login_history import LoginHistory
from database.models.password_reset import PasswordResetToken
from database.models.user import User
from schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from services.email import send_password_reset_email
from services.security import (
    create_access_token,
    hash_password,
    verify_password,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str


def create_login_history(
    db: Session,
    user_id: int | None,
    email: str,
    event_type: str,
    request: Request,
):
    login_history = LoginHistory(
        user_id=user_id,
        email=email,
        event_type=event_type,
        ip_address=(
            request.client.host
            if request.client
            else None
        ),
        user_agent=request.headers.get("user-agent"),
    )

    db.add(login_history)
    db.commit()


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == login_data.email)
    )

    if not user:
        create_login_history(
            db=db,
            user_id=None,
            email=login_data.email,
            event_type="LOGIN_FAILED",
            request=request,
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):
        create_login_history(
            db=db,
            user_id=user.id,
            email=user.email,
            event_type="LOGIN_FAILED",
            request=request,
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        create_login_history(
            db=db,
            user_id=user.id,
            email=user.email,
            event_type="LOGIN_FAILED",
            request=request,
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    create_login_history(
        db=db,
        user_id=user.id,
        email=user.email,
        event_type="LOGIN_SUCCESS",
        request=request,
    )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == request.email)
    )

    if user:
        db.execute(
            delete(PasswordResetToken).where(
                PasswordResetToken.user_id == user.id
            )
        )

        token = secrets.token_urlsafe(32)

        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow()
            + timedelta(minutes=15),
        )

        db.add(reset_token)
        db.commit()

        reset_link = (
            "http://127.0.0.1:5173/login"
            f"?reset_token={token}"
        )

        send_password_reset_email(
            recipient_email=user.email,
            reset_link=reset_link,
        )

    return {
        "message": "If the email exists, a password reset link has been sent.",
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    reset_token = db.scalar(
        select(PasswordResetToken).where(
            PasswordResetToken.token == request.token
        )
    )

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if reset_token.expires_at < datetime.utcnow():
        db.delete(reset_token)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirmation password do not match.",
        )

    user = db.scalar(
        select(User).where(User.id == reset_token.user_id)
    )

    if not user:
        db.delete(reset_token)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    if verify_password(
        request.new_password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password.",
        )

    user.password_hash = hash_password(
        request.new_password
    )

    db.delete(reset_token)
    db.commit()

    return {
        "message": "Password reset successfully."
    }