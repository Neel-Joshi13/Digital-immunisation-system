from sqlalchemy import inspect, text

from database.base import Base
from database.connection import engine
from database.models.appointment import Appointment
from database.models.healthcare_centre import HealthcareCentre
from database.models.immunisation import ImmunisationRecord
from database.models.notification import Notification
from database.models.patient import Patient
from database.models.user import User
from database.models.vaccination_schedule import VaccinationSchedule
from database.models.vaccine import Vaccine


def create_tables():
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)

    vaccine_columns = {
        column["name"]
        for column in inspector.get_columns("vaccines")
    }

    with engine.begin() as connection:
        if "source_name" not in vaccine_columns:
            connection.execute(
                text(
                    """
                    ALTER TABLE vaccines
                    ADD source_name NVARCHAR(255) NULL
                    """
                )
            )

        if "source_url" not in vaccine_columns:
            connection.execute(
                text(
                    """
                    ALTER TABLE vaccines
                    ADD source_url NVARCHAR(500) NULL
                    """
                )
            )

    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()