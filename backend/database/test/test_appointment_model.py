from datetime import date, time

from database.models.user import User
from database.models.patient import Patient
from database.models.vaccine import Vaccine
from database.models.healthcare_centre import HealthcareCentre
from database.models.appointment import Appointment


appointment = Appointment(
    patient_id=1,
    healthcare_centre_id=1,
    vaccine_id=1,
    appointment_date=date.today(),
    appointment_time=time(10, 30),
    status="SCHEDULED",
    notes="Test appointment",
)

print("Appointment model loaded successfully!")
print("Table name:", Appointment.__tablename__)
print("Patient ID:", appointment.patient_id)
print("Healthcare Centre ID:", appointment.healthcare_centre_id)
print("Vaccine ID:", appointment.vaccine_id)
print("Status:", appointment.status)