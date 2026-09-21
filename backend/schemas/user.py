from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "PATIENT"

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not any(
            not char.isalnum()
            for char in value
        ):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return value


class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not any(
            not char.isalnum()
            for char in value
        ):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return value


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        if not any(char.isupper() for char in value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not any(
            not char.isalnum()
            for char in value
        ):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return value


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)