from sqlalchemy import select

from database.connection import engine
from database.models.vaccine import Vaccine
from sqlalchemy.orm import Session


def run_crud_test():
    # CREATE
    with Session(engine) as session:
        vaccine = Vaccine(
            name="CRUD Test Vaccine",
            description="Temporary test vaccine",
            recommended_age="Test",
            total_doses=2,
            dose_interval_days=28,
        )

        session.add(vaccine)
        session.commit()
        session.refresh(vaccine)

        vaccine_id = vaccine.id

        print("CREATE successful!")
        print("Created vaccine ID:", vaccine_id)

    # READ
    with Session(engine) as session:
        statement = select(Vaccine).where(Vaccine.id == vaccine_id)
        vaccine = session.scalar(statement)

        print("READ successful!")
        print("Vaccine name:", vaccine.name)

    # UPDATE
    with Session(engine) as session:
        statement = select(Vaccine).where(Vaccine.id == vaccine_id)
        vaccine = session.scalar(statement)

        vaccine.description = "Updated test description"

        session.commit()

        print("UPDATE successful!")
        print("Updated description:", vaccine.description)

    # DELETE
    with Session(engine) as session:
        statement = select(Vaccine).where(Vaccine.id == vaccine_id)
        vaccine = session.scalar(statement)

        session.delete(vaccine)
        session.commit()

        print("DELETE successful!")

    # VERIFY DELETE
    with Session(engine) as session:
        statement = select(Vaccine).where(Vaccine.id == vaccine_id)
        vaccine = session.scalar(statement)

        if vaccine is None:
            print("DELETE verification successful!")
        else:
            print("DELETE verification failed!")


if __name__ == "__main__":
    run_crud_test()