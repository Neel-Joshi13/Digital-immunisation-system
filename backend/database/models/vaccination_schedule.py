from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
)

from database.base import Base


class VaccinationSchedule(Base):
    __tablename__ = "vaccination_schedules"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    vaccine_id = Column(
        Integer,
        ForeignKey("vaccines.id"),
        nullable=False,
    )

    dose_number = Column(
        Integer,
        nullable=False,
    )

    recommended_age = Column(
        String,
        nullable=True,
    )

    minimum_interval_days = Column(
        Integer,
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    source_name = Column(
        String,
        nullable=True,
    )

    source_url = Column(
        String,
        nullable=True,
    )