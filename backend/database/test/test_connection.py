from sqlalchemy import text

from connection import engine


try:
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT DB_NAME()")
        )

        database_name = result.scalar()

        print("Database connection successful!")
        print("Connected database:", database_name)

except Exception as error:
    print("Database connection failed.")
    print(error)