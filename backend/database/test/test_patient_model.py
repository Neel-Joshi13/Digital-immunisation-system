from datetime import date

from database.models.user import User
from database.models.patient import Patient


patient = Patient(
    user_id=1,
    first_name="Test",
    last_name="Patient",
    date_of_birth=date(2000, 1, 1),
    gender="Male",
    phone="0000000000",
    address="Test Address",
)

print("Patient model loaded successfully!")
print("Table name:", Patient.__tablename__)
print("Patient name:", patient.first_name, patient.last_name)
print("User ID:", patient.user_id)