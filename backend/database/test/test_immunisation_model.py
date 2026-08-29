from datetime import date

from database.models.user import User
from database.models.patient import Patient
from database.models.vaccine import Vaccine
from backend.database.models.immunisation import ImmunisationRecord


record = ImmunisationRecord(
    patient_id=1,
    vaccine_id=1,
    dose_number=1,
    administered_date=date.today(),
    administered_by="Test Healthcare Worker",
    notes="Test immunisation record",
)

print("Immunisation record model loaded successfully!")
print("Table name:", ImmunisationRecord.__tablename__)
print("Patient ID:", record.patient_id)
print("Vaccine ID:", record.vaccine_id)
print("Dose number:", record.dose_number)