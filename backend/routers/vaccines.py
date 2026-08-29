from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.vaccine import Vaccine
from schemas.vaccine import VaccineCreate, VaccineResponse
from services.auth import require_role


router = APIRouter(
    prefix="/api/vaccines",
    tags=["Vaccines"],
)


@router.post(
    "",
    response_model=VaccineResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vaccine(
    vaccine_data: VaccineCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("ADMIN")),
):
    existing_vaccine = db.scalar(
        select(Vaccine).where(
            Vaccine.name == vaccine_data.name
        )
    )

    if existing_vaccine:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vaccine with this name already exists.",
        )

    vaccine = Vaccine(
        name=vaccine_data.name,
        manufacturer=vaccine_data.manufacturer,
        description=vaccine_data.description,
        recommended_age=vaccine_data.recommended_age,
        doses_required=vaccine_data.doses_required,
        source_name=vaccine_data.source_name,
        source_url=vaccine_data.source_url,
    )

    db.add(vaccine)
    db.commit()
    db.refresh(vaccine)

    return vaccine


@router.get(
    "",
    response_model=list[VaccineResponse],
)
def get_vaccines(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("ADMIN", "PATIENT")
    ),
):
    statement = select(Vaccine).where(
        Vaccine.is_active == True
    )

    vaccines = db.scalars(statement).all()

    return vaccines