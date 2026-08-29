from datetime import time

from database.models.healthcare_centre import HealthcareCentre


centre = HealthcareCentre(
    name="Test Healthcare Centre",
    address="Test Address",
    phone="0000000000",
    email="test@example.com",
    opening_time=time(9, 0),
    closing_time=time(17, 0),
)

print("Healthcare centre model loaded successfully!")
print("Table name:", HealthcareCentre.__tablename__)
print("Centre name:", centre.name)
print("Opening time:", centre.opening_time)