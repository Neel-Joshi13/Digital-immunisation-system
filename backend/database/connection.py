from sqlalchemy import create_engine
from sqlalchemy.orm import Session


DATABASE_URL = (
    "mssql+pyodbc://NAANU\\SQLEXPRESS/DigitalImmunisation"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)

engine = create_engine(
    DATABASE_URL,
    echo=True
)


def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()