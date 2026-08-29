from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.healthcare_centre import HealthcareCentre
from schemas.healthcare_centre import (
    HealthcareCentreCreate,
    HealthcareCentreResponse,
)
from services.auth import require_role


router = APIRouter(
    prefix="/api/healthcare-centres",
    tags=["Healthcare Centres"],
)


@router.post(
    "",
    response_model=HealthcareCentreResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_healthcare_centre(
    centre_data: HealthcareCentreCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("ADMIN")),
):
    existing_centre = db.scalar(
        select(HealthcareCentre).where(
            HealthcareCentre.name == centre_data.name
        )
    )

    if existing_centre:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A healthcare centre with this name already exists.",
        )

    centre = HealthcareCentre(
        name=centre_data.name,
        address=centre_data.address,
        phone=centre_data.phone,
        email=centre_data.email,
    )

    db.add(centre)
    db.commit()
    db.refresh(centre)

    return centre


@router.get(
    "",
    response_model=list[HealthcareCentreResponse],
)
def get_healthcare_centres(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN","PATIENT")
    ),
):
    statement = select(HealthcareCentre).where(
        HealthcareCentre.is_active == True
    )

    centres = db.scalars(statement).all()

    return centres