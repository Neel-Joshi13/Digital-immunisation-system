from database.models.vaccine import Vaccine


vaccine = Vaccine(
    name="Test Vaccine",
    description="Test vaccine description",
    recommended_age="Child",
    total_doses=2,
    dose_interval_days=28,
)

print("Vaccine model loaded successfully!")
print("Table name:", Vaccine.__tablename__)
print("Vaccine name:", vaccine.name)
print("Total doses:", vaccine.total_doses)