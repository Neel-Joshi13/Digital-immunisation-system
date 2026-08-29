from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base


class ImmunisationRecord(Base):
    __tablename__ = "immunisation_records"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
    )

    vaccine_id: Mapped[int] = mapped_column(
        ForeignKey("vaccines.id"),
        nullable=False,
    )

    dose_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    date_administered: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    administered_by: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    patient = relationship("Patient")
    vaccine = relationship("Vaccine")