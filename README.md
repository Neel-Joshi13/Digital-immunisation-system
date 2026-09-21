# Digital Immunisation System

A full-stack digital immunisation management system developed to simplify vaccination management for patients, administrators, and healthcare workers.

The system provides patient profile management, vaccine information, vaccination schedules, appointment booking, appointment cancellation and rescheduling, immunisation records, vaccination history, missed-dose tracking, notifications, vaccination certificates, certificate verification, password management, audit logging, login history, and a locally hosted AI Vaccine Assistant powered by Ollama.

---

## Features

### Patient Management

Patients can:
- View and manage their personal profile
- Edit their personal profile information
- Change their password
- Request a password reset
- Reset their password using a secure reset link
- View vaccination history
- Track completed vaccination doses
- View vaccination schedules
- View potentially missed vaccination doses
- View notifications
- Mark notifications as read
- Book vaccination appointments
- View appointments
- Cancel scheduled appointments
- Reschedule scheduled appointments
- Download vaccination certificates
- Verify vaccination certificates
- Use the AI Vaccine Assistant
- Switch between English and Hindi

### User Management

Administrators can:
- View registered users
- Create patient accounts
- Delete patient accounts
- Manage user information

Patient deletion also removes associated patient-related records where required by the implemented database relationships.

Administrative user actions are recorded in the audit log.

### Vaccine Management

Administrators can manage vaccine information including:
- Vaccine names
- Manufacturers
- Vaccine descriptions
- Required doses
- Recommended age information
- Vaccine information sources

Vaccines can be associated with vaccination schedules and immunisation records.

### Vaccination Schedules

The system supports vaccination schedule management, including:
- Dose numbers
- Recommended ages
- Minimum intervals between doses
- Notes
- Source names
- Source URLs
- Associated vaccines

Patients can view their vaccination schedules through the patient portal.

### Healthcare Centres

Administrators can manage healthcare centres, including:
- Centre name
- Address
- Contact information

Patients can select healthcare centres when booking appointments.

### Appointment Management

Patients can:
- Book vaccination appointments
- Select healthcare centres
- Select appointment dates and times
- Provide appointment reasons
- View their appointments
- Cancel scheduled appointments
- Reschedule scheduled appointments

The system validates appointment information and prevents invalid appointment selections according to the implemented appointment rules.

### Immunisation Records

The system stores immunisation records for patients. Records can include:
- Patient
- Vaccine
- Dose number
- Administration date
- Administrator or healthcare worker responsible for administration

Immunisation records are used to build vaccination history and support missed-dose tracking.

### Missed-Dose Tracking

The system provides missed-dose tracking based on vaccination schedules and existing immunisation records.

The system can identify potentially missed doses by comparing:
- Patient date of birth
- Recommended vaccination ages
- Previous administered doses
- Minimum intervals between doses
- Current date

Administrators can view missed-dose alerts and send notifications to patients.

### Patient Notifications

Administrators can select a patient, create a notification, provide a title and message, and specify the notification type.

Patients can:
- View their notifications
- See unread notifications
- Mark notifications as read

Missed-dose notifications are supported through the notification system.

### Vaccination Certificates

Patients can:
- Generate vaccination certificates
- Download certificates in PDF format
- View vaccination information included in the certificate
- Use certificate verification

Certificates contain vaccination-related information and a verification mechanism.

### Certificate Verification

Vaccination certificates can be verified using a verification URL.

The system provides a public verification endpoint:

```text
/verify/:token
```

The backend verifies the certificate token and validates the associated vaccination information. Certificates also use QR-based verification.

### Password Management

The system provides:
- Password strength validation
- Change password
- Forgot password
- Password reset
- Password confirmation
- Validation against reusing the current password

Password reset links are generated through the backend and sent using the configured email service. Password reset tokens expire after the configured period.

Passwords are stored as hashes and are never stored as plain text.

### Audit Logging

The system includes an administrative audit logging system accessible only to administrators.

The audit log currently records administrative actions such as:
- Creating user accounts
- Deleting patient accounts

Audit records include:
- Audit log ID
- User ID
- Action
- Target type
- Target ID
- Action details
- Date and time

Administrators can view audit records through the **Audit Logs** section of the administration interface.

Audit timestamps are displayed in Indian Standard Time (IST) in the administrative interface.

### Account Security and Login History

The system provides an administrator-only login history feature.

Administrators can view:
- Successful login attempts
- Failed login attempts
- User email
- User ID
- IP address
- Browser/user-agent information
- Date and time

Failed login attempts are recorded even when the supplied email does not belong to an existing user.

> **Note:** Logout tracking is not currently recorded by the backend because the current JWT logout process removes the token on the frontend.

### AI Vaccine Assistant

The system includes a locally hosted AI-powered Vaccine Assistant using **Ollama**.

Configured model:

```text
qwen2.5:3b
```

The assistant can provide informational responses to general vaccine-related questions and can use relevant vaccination information from the system.

Example questions:
- What is the BCG vaccine?
- Why is vaccination important?
- What vaccines are recommended for children?
- What is the purpose of a booster dose?
- What should I know about vaccine schedules?
- Do I have any missed vaccination doses?
- What should I do if I missed my second vaccine dose?

The assistant supports English and Hindi, vaccine-related informational questions, and missed-dose questions using the patient's vaccination data.

> **Note:** The AI assistant is intended for informational and educational purposes and does not replace professional medical advice.

### Patient Language Support

The patient portal supports:
- English
- Hindi

The language is selected globally from the patient layout and stored locally. The AI Vaccine Assistant also uses the selected patient language.

---

## Authentication and Role-Based Access

The system uses JWT-based authentication and role-based authorization.

Supported roles:

```text
PATIENT
ADMIN
```

Protected backend endpoints verify the authenticated user's role and active status before allowing access.

---

# Technology Stack

## Frontend

- React
- JavaScript
- Vite
- HTML
- CSS
- React Router
- Fetch API
- Local Storage

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- python-jose
- Passlib
- bcrypt

## Database

- Microsoft SQL Server
- SQLAlchemy ORM
- SQL Server Management Studio (SSMS)

## AI

- Ollama
- `qwen2.5:3b`
- Locally hosted AI model

## Other

- JWT Authentication
- REST API
- Password hashing
- Password reset email
- PDF generation
- QR-based certificate verification
- Pytest

---

# System Architecture

```text
                    DIGITAL IMMUNISATION SYSTEM
                              │
                ┌─────────────┴─────────────┐
                │                           │
          React Frontend              FastAPI Backend
                │                           │
                │              ┌────────────┼────────────┐
                │              │            │            │
                │        Authentication   Services     Routers
                │              │            │            │
                │              └────────────┴────────────┘
                │                           │
                │                     SQLAlchemy ORM
                │                           │
                │                    SQL Server Database
                │
                └────────── AI Vaccine Assistant
                                │
                              Ollama
                                │
                         qwen2.5:3b Model
```

---

# Project Structure

```text
Digital-Immunisation/
│
├── backend/
│   ├── database/
│   │   ├── models/
│   │   ├── test/
│   │   ├── base.py
│   │   ├── connection.py
│   │   └── init_db.py
│   │
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── static/
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# Database

The application uses **Microsoft SQL Server** as its relational database.

The main entities include:

```text
Users
  │
  ├── Patients
  │      │
  │      ├── Appointments
  │      │
  │      ├── Immunisation Records
  │      │
  │      └── Notifications
  │
  ├── Audit Logs
  │
  └── Login History

Vaccines
  │
  └── Vaccination Schedules

Healthcare Centres

Password Reset Tokens
```

Foreign-key relationships are used to maintain data integrity between users, patients, vaccines, appointments, immunisation records, vaccination schedules, healthcare centres, notifications, audit logs, login history, and password reset records.

---

# Authentication

The application uses JWT access tokens for authentication.

After successful login, the frontend receives an access token and uses it when communicating with protected backend endpoints.

```http
Authorization: Bearer <access_token>
```

The backend:
1. Decodes the JWT.
2. Identifies the current user.
3. Checks whether the account is active.
4. Verifies the user's role.
5. Allows or denies access to protected resources.

Passwords are stored using password hashing rather than plain text.

Login activity is recorded in the login history system.

---

# API Endpoints

The FastAPI backend provides REST API endpoints for the major application modules.

```text
/api/auth
/api/users
/api/patients
/api/appointments
/api/healthcare-centres
/api/vaccines
/api/immunisations
/api/vaccination-schedules
/api/notifications
/api/ai
/api/certificates
/api/audit-logs
/api/login-history
```

FastAPI provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

---

# Ollama AI Setup

The AI Vaccine Assistant uses **Ollama** to run the AI model locally.

The application is currently configured to use:

```text
qwen2.5:3b
```

## 1. Install Ollama

Download Ollama from:

https://ollama.com/

Verify the installation:

```bash
ollama --version
```

## 2. Download the AI Model

```bash
ollama pull qwen2.5:3b
```

Verify the model:

```bash
ollama list
```

## 3. Start Ollama

The default Ollama server address is:

```text
http://localhost:11434
```

## 4. Run the Application

Start the FastAPI backend from the `backend` directory:

```bash
uvicorn main:app --reload
```

Start the React frontend from the `frontend` directory:

```bash
npm run dev
```

---

# Backend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Neel-Joshi13/Digital-immunisation-system.git
cd Digital-immunisation-system
```

## 2. Navigate to the Backend

```bash
cd backend
```

## 3. Create a Python Virtual Environment

```bash
python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\activate
```

## 4. Install Python Dependencies

If a `requirements.txt` file is provided:

```bash
pip install -r requirements.txt
```

## 5. Configure the Database

Configure the SQL Server connection using environment variables or the local database configuration.

Each developer should configure their own SQL Server instance.

Do not commit machine-specific database connection strings or credentials to GitHub.

## 6. Initialise the Database

From the `backend` directory:

```bash
python -m database.init_db
```

## 7. Start the Backend

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# Environment Configuration

Sensitive configuration values should **never** be committed to GitHub.

These may include:

- Database credentials
- SQL Server connection information
- JWT secret keys
- Email credentials
- API keys
- AI configuration
- Other private credentials

Example:

```env
DATABASE_URL=your_sql_server_connection_string
SECRET_KEY=your_secret_key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_app_password
```

Do not commit the actual `.env` file.

A `.env.example` file can be used to document required configuration without exposing secrets.

---

# Testing

The backend contains tests covering different parts of the application, including:

- Database connections
- Database sessions
- CRUD operations
- User/model functionality
- Patient model
- Vaccine model
- Immunisation model
- Appointment model
- Healthcare centre model

Run the tests from the backend directory with:

```bash
pytest
```

---

# Security

The application includes:

- JWT authentication
- Password hashing
- Password strength validation
- Role-based access control
- Protected API endpoints
- Active/inactive user validation
- Login history
- Audit logging
- Database foreign-key constraints
- Environment-based configuration
- Authenticated access to patient-specific resources
- Password reset token expiration

> **Important:** Never commit passwords, API keys, JWT secrets, database credentials, private keys, email credentials, or other sensitive information to the repository.

---

# User Roles

## Patient

Patients can:
- View their profile
- Edit their profile
- Change their password
- Reset their password
- View vaccination history
- View vaccination schedules
- Book appointments
- Cancel appointments
- Reschedule appointments
- View appointments
- View potentially missed doses
- Receive notifications
- Mark notifications as read
- Download vaccination certificates
- Verify vaccination certificates
- Use the AI Vaccine Assistant
- Switch between English and Hindi

## Admin

Administrators can manage:
- Users
- Patient accounts
- Vaccines
- Vaccination schedules
- Healthcare centres
- Immunisation records
- Missed-dose alerts
- Patient notifications
- Audit logs
- Login history
- Other administrative data

Administrators can also review authentication activity such as successful and failed login attempts.

## Healthcare Worker

Healthcare workers can perform healthcare-related operations such as recording immunisation information according to their authorised access.

---

# AI Assistant Disclaimer

The AI Vaccine Assistant is provided for educational and informational purposes.

AI-generated responses should not be considered a diagnosis, prescription, or substitute for advice from a qualified healthcare professional.

Users should consult an appropriate healthcare professional for personal medical decisions.

---

# Future Improvements

Potential future enhancements include:

- SMS and email appointment reminders
- Complete backend logout tracking
- Advanced administrator dashboards
- Vaccine inventory management
- Additional language support
- Enhanced AI assistance
- Cloud deployment
- Mobile application support
- Additional healthcare system integrations

---

# Purpose

The Digital Immunisation System was developed as a **final-year project** to demonstrate the design and development of a full-stack healthcare application.

The project combines:

- Frontend development
- REST API development
- Database management
- Authentication
- Role-based authorization
- Healthcare data management
- Vaccination scheduling
- Appointment management
- Missed-dose tracking
- Patient notifications
- Password management
- Audit logging
- Login security monitoring
- PDF certificate generation
- Certificate verification
- Local AI integration using Ollama
- Multilingual patient interface
- Automated testing

The goal is to provide a centralized digital platform for managing vaccination and immunisation-related information for patients and healthcare administrators.
