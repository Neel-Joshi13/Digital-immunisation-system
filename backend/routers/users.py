from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.user import User
from schemas.user import UserCreate, UserResponse
from services.security import hash_password
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
    db.commit()
    db.refresh(user)

    return user


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


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
