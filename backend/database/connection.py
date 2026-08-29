from sqlalchemy import create_engine


DATABASE_URL = (
    "DATABASE_URL"
    "Database Name"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)

engine = create_engine(
    DATABASE_URL,
    echo=True
)

from sqlalchemy.orm import Session


def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()
