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


@router.get("/{immunisation_id}/pdf")
def download_my_certificate(
    immunisation_id: int,
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

    immunisation = db.scalar(
        select(ImmunisationRecord)
        .options(
            joinedload(
                ImmunisationRecord.vaccine
            )
        )
        .where(
            ImmunisationRecord.id == immunisation_id,
            ImmunisationRecord.patient_id == patient.id,
        )
    )

    if immunisation is None:
        raise HTTPException(
            status_code=404,
            detail="Vaccination record not found.",
        )

    token = create_certificate_token(
        patient.id,
        immunisation.id,
    )

    certificate_info = {
        "certificate_type": (
            "Official Vaccination Certificate"
        ),
        "issuing_authority": (
            "Digital Immunisation Healthcare System"
        ),
        "healthcare_service": (
            "Immunisation & Vaccination Services"
        ),
    }

    pdf = generate_certificate_pdf(
        patient=patient,
        immunisation=immunisation,
        certificate_token=token,
        certificate_info=certificate_info,
    )

    filename = (
        "digital-immunisation-"
        "healthcare-vaccination-certificate-"
        f"{immunisation.id}.pdf"
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

    statement = (
        select(ImmunisationRecord)
        .options(
            joinedload(
                ImmunisationRecord.vaccine
            )
        )
        .where(
            ImmunisationRecord.patient_id
            == patient_id
        )
        .order_by(
            ImmunisationRecord.id
        )
    )

    immunisations = db.scalars(
        statement
    ).all()

    matching_record = None

    for record in immunisations:
        if verify_certificate_token(
            patient_id,
            record.id,
            token,
        ):
            matching_record = record
            break

    if matching_record is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid certificate.",
        )

    return {
        "valid": True,
        "message": (
            "Vaccination certificate is valid."
        ),
        "certificate": {
            "type": (
                "Official Vaccination Certificate"
            ),
            "issuing_authority": (
                "Digital Immunisation Healthcare System"
            ),
            "healthcare_service": (
                "Immunisation & Vaccination Services"
            ),
        },
        "patient": {
            "name": (
                f"{patient.first_name} "
                f"{patient.last_name}"
            ),
            "date_of_birth": str(
                patient.date_of_birth
            ),
        },
        "vaccination": {
            "id": matching_record.id,
            "vaccine": (
                matching_record.vaccine.name
            ),
            "dose_number": (
                matching_record.dose_number
            ),
            "date_administered": str(
                matching_record.date_administered
            ),
            "administered_by": (
                matching_record.administered_by
            ),
        },
    }