import hashlib
import hmac
import io
import os
import uuid

import qrcode

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)


CERTIFICATE_SECRET = os.getenv(
    "CERTIFICATE_SECRET",
    "digital-immunisation-development-secret",
)

VERIFY_BASE_URL = os.getenv(
    "VERIFY_BASE_URL",
    "http://10.80.224.214:5173",
)


def create_certificate_token(
    patient_id: int,
    immunisation_ids: list[int],
) -> str:

    records = ",".join(
        str(record_id)
        for record_id in sorted(immunisation_ids)
    )

    payload = f"{patient_id}:{records}"

    signature = hmac.new(
        CERTIFICATE_SECRET.encode(),
        payload.encode(),
        hashlib.sha256,
    ).hexdigest()[:24]

    return f"{patient_id}-{signature}"


def verify_certificate_token(
    patient_id: int,
    immunisation_ids: list[int],
    token: str,
) -> bool:

    expected = create_certificate_token(
        patient_id,
        immunisation_ids,
    )

    return hmac.compare_digest(
        expected,
        token,
    )


def generate_certificate_pdf(
    patient,
    immunisations,
    certificate_token: str,
) -> bytes:

    buffer = io.BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CertificateTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        leading=28,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "CertificateSubtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        leading=14,
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=13,
        leading=18,
        spaceBefore=10,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "NormalCertificate",
        parent=styles["Normal"],
        fontSize=10,
        leading=15,
    )

    story = []

    story.append(
        Paragraph(
            "DIGITAL IMMUNISATION",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "Official Vaccination Certificate",
            subtitle_style,
        )
    )

    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Patient Information",
            heading_style,
        )
    )

    patient_data = [
        ["Name", f"{patient.first_name} {patient.last_name}"],
        ["Date of Birth", str(patient.date_of_birth)],
        ["Gender", patient.gender],
        ["Phone", patient.phone],
    ]

    patient_table = Table(
        patient_data,
        colWidths=[45 * mm, 120 * mm],
    )

    patient_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.HexColor("#eef4ff"),
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (1, 0),
                    (1, -1),
                    "Helvetica",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#d5dce8"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(patient_table)

    story.append(Spacer(1, 15))

    story.append(
        Paragraph(
            "Vaccination Records",
            heading_style,
        )
    )

    vaccination_data = [
        [
            "Vaccine",
            "Dose",
            "Date Administered",
            "Administered By",
        ]
    ]

    for record in immunisations:

        vaccination_data.append(
            [
                record.vaccine.name,
                str(record.dose_number),
                str(record.date_administered),
                str(record.administered_by),
            ]
        )

    vaccination_table = Table(
        vaccination_data,
        colWidths=[
            55 * mm,
            20 * mm,
            45 * mm,
            45 * mm,
        ],
        repeatRows=1,
    )

    vaccination_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2563eb"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, -1),
                    "Helvetica",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8.5,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#d5dce8"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(vaccination_table)

    story.append(Spacer(1, 18))

    verification_url = (
        f"{VERIFY_BASE_URL}/verify/"
        f"{certificate_token}"
    )

    qr = qrcode.make(verification_url)

    qr_buffer = io.BytesIO()

    qr.save(
        qr_buffer,
        format="PNG",
    )

    qr_buffer.seek(0)

    qr_image = Image(
        qr_buffer,
        width=35 * mm,
        height=35 * mm,
    )

    qr_text = Paragraph(
        "Scan this QR code to verify this vaccination certificate.",
        normal_style,
    )

    verification_table = Table(
        [
            [
                qr_image,
                qr_text,
            ]
        ],
        colWidths=[
            45 * mm,
            115 * mm,
        ],
    )

    verification_table.setStyle(
        TableStyle(
            [
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#d5dce8"),
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(verification_table)

    story.append(Spacer(1, 12))

    certificate_id = str(uuid.uuid4())

    story.append(
        Paragraph(
            f"Certificate Reference: {certificate_id}",
            normal_style,
        )
    )

    story.append(
        Paragraph(
            "This certificate is generated from the "
            "vaccination records stored in the "
            "Digital Immunisation system.",
            normal_style,
        )
    )

    document.build(story)

    buffer.seek(0)

    return buffer.getvalue()