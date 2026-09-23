from datetime import date, time

from sqlalchemy import Date, ForeignKey, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
    )

    centre_id: Mapped[int] = mapped_column(
        ForeignKey("healthcare_centres.id"),
        nullable=False,
    )

    vaccine_id: Mapped[int] = mapped_column(
        ForeignKey("vaccines.id"),
        nullable=False,
    )

    appointment_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    appointment_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="SCHEDULED",
    )

    reason: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    status_reason: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    patient = relationship("Patient")
    healthcare_centre = relationship("HealthcareCentre")
    vaccine = relationship("Vaccine")