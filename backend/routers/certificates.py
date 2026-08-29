from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from database.connection import get_db
from database.models.immunisation import ImmunisationRecord
from database.models.patient import Patient
from services.auth import get_current_user
from services.certificate import (
    create_certificate_token,
    generate_certificate_pdf,
    verify_certificate_token,
)


router = APIRouter(
    prefix="/api/certificates",
    tags=["Certificates"],
)


@router.get("/me/pdf")
def download_my_certificate(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    patient = db.scalar(
        select(Patient).where(
            Patient.user_id == current_user.id
        )
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found.",
        )

    statement = (
        select(ImmunisationRecord)
        .options(
            joinedload(
                ImmunisationRecord.vaccine
            )
        )
        .where(
            ImmunisationRecord.patient_id
            == patient.id
        )
        .order_by(
            ImmunisationRecord.date_administered
        )
    )

    immunisations = db.scalars(
        statement
    ).unique().all()

    if not immunisations:
        raise HTTPException(
            status_code=404,
            detail="No vaccination records found.",
        )

    token = create_certificate_token(
        patient.id,
        [record.id for record in immunisations],
    )

    pdf = generate_certificate_pdf(
        patient=patient,
        immunisations=immunisations,
        certificate_token=token,
    )

    filename = (
        f"vaccination-certificate-"
        f"{patient.id}.pdf"
    )

    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )


@router.get("/verify/{token}")
def verify_certificate(
    token: str,
    db: Session = Depends(get_db),
):

    parts = token.split("-", 1)

    if len(parts) != 2:
        raise HTTPException(
            status_code=400,
            detail="Invalid certificate.",
        )

    try:
        patient_id = int(parts[0])
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid certificate.",
        )

    patient = db.get(
        Patient,
        patient_id,
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found.",
        )

    statement = select(
        ImmunisationRecord
    ).where(
        ImmunisationRecord.patient_id
        == patient_id
    )

    immunisations = db.scalars(
        statement
    ).all()

    valid = verify_certificate_token(
        patient_id,
        [record.id for record in immunisations],
        token,
    )

    if not valid:
        raise HTTPException(
            status_code=404,
            detail="Invalid or outdated certificate.",
        )

    return {
        "valid": True,
        "message": "Vaccination certificate is valid.",
        "patient": {
            "name": (
                f"{patient.first_name} "
                f"{patient.last_name}"
            ),
            "date_of_birth": str(
                patient.date_of_birth
            ),
        },
        "vaccination_count": len(
            immunisations
        ),
    }