from database.models.user import User


user = User(
    email="test@example.com",
    password_hash="test-hash",
)

print("User model loaded successfully!")
print("Table name:", User.__tablename__)
print("User email:", user.email)
print("User role:", user.role)