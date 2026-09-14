# Digital Immunisation System

A full-stack digital immunisation management system developed to simplify vaccination management for patients, administrators, and healthcare workers.

The system provides patient profile management, vaccine information, vaccination schedules, appointment booking, immunisation records, vaccination history, missed-dose tracking, notifications, vaccination certificates, certificate verification, and a locally hosted AI Vaccine Assistant powered by Ollama.

---

# Features

## 👤 Patient Management

Patients can:

- View and manage their personal profile
- View vaccination history
- Track completed vaccination doses
- View vaccination schedules
- View potentially missed vaccination doses
- View notifications
- Mark notifications as read
- Book vaccination appointments
- View appointments
- Download vaccination certificates
- Verify vaccination certificates
- Use the AI Vaccine Assistant

---

## 💉 Vaccine Management

Administrators can manage vaccine information including:

- Vaccine names
- Manufacturers
- Vaccine descriptions
- Required doses
- Recommended age information
- Vaccine information sources

Vaccines can be associated with vaccination schedules and immunisation records.

---

## 📅 Vaccination Schedules

The system supports vaccination schedule management.

Schedules can include:

- Dose numbers
- Recommended ages
- Minimum intervals between doses
- Notes
- Source names
- Source URLs
- Associated vaccines

Patients can view their vaccination schedule through the patient portal.

---

## 🏥 Healthcare Centres

Administrators can manage healthcare centres.

Healthcare centre information includes:

- Centre name
- Address
- Contact information

Patients can select healthcare centres when booking appointments.

---

## 📆 Appointment Management

Patients can:

- Book vaccination appointments
- Select healthcare centres
- Select appointment dates and times
- Provide appointment reasons
- View their appointments

Appointment statuses are displayed based on the appointment information and date/time.

---

## 📋 Immunisation Records

The system stores immunisation records for patients.

Records can include:

- Patient
- Vaccine
- Dose number
- Administration date
- Administrator or healthcare worker responsible for administration

Immunisation records are used to build vaccination history and support missed-dose tracking.

---

## ⚠️ Missed-Dose Tracking

The system provides missed-dose tracking based on vaccination schedules and existing immunisation records.

The system can identify potentially missed doses by comparing:

- Patient date of birth
- Recommended vaccination ages
- Previous administered doses
- Minimum intervals between doses
- Current date

Administrators can view missed-dose alerts and send notifications to patients.

---

## 🔔 Patient Notifications

The system provides notifications for patients.

Administrators can:

- Select a patient
- Create a notification
- Provide a notification title
- Provide a message
- Specify the notification type

Patients can:

- View their notifications
- See unread notifications
- Mark notifications as read

Missed-dose notifications are supported through the notification system.

---

## 📄 Vaccination Certificates

The system supports digital vaccination certificates.

Patients can:

- Generate vaccination certificates
- Download certificates in PDF format
- View vaccination information included in the certificate
- Use certificate verification

Certificates contain vaccination-related information and a verification mechanism.

---

## 🔎 Certificate Verification

Vaccination certificates can be verified using a verification URL.

The system provides a public verification endpoint:

```text
/verify/:token
```

The backend verifies the certificate token and validates the associated vaccination information.

---

## 🤖 AI Vaccine Assistant

The system includes a locally hosted AI-powered Vaccine Assistant using **Ollama**.

The configured AI model is:

```text
qwen2.5:3b
```

Ollama allows the AI model to run locally instead of relying on a cloud-based AI service.

The assistant can provide informational responses to general vaccine-related questions and can use relevant vaccination information from the system.

Example questions:

- What is the BCG vaccine?
- Why is vaccination important?
- What vaccines are recommended for children?
- What is the purpose of a booster dose?
- What should I know about vaccine schedules?
- Do I have any missed vaccination doses?

The assistant supports:

- English
- Hindi
- Vaccine-related informational questions
- Missed-dose questions using the patient's vaccination data

The AI assistant is accessed through the patient portal.

> **Note:** The AI assistant is intended for informational and educational purposes and does not replace professional medical advice.

---

## 🌐 Patient Language Support

The patient portal supports:

- English
- Hindi

The language is selected globally from the patient layout rather than separately on each page.

The selected language is stored locally so the patient interface can remain in the selected language.

The AI Vaccine Assistant also uses the selected patient language when generating responses.

---

## 🔐 Authentication and Role-Based Access

The system uses JWT-based authentication and role-based authorization.

Supported roles:

```text
PATIENT
ADMIN
HEALTHCARE_WORKER
```

Different roles have access to different parts of the application.

Protected backend endpoints verify the authenticated user's role before allowing access.

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
  └── Administrators / Healthcare Workers

Vaccines
  │
  └── Vaccination Schedules

Healthcare Centres
```

Foreign-key relationships are used to maintain data integrity between users, patients, vaccines, appointments, immunisation records, vaccination schedules, healthcare centres, and notifications.

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
```

FastAPI provides interactive API documentation.

When the backend is running, open:

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

Pull the configured model:

```bash
ollama pull qwen2.5:3b
```

Verify the model:

```bash
ollama list
```

## 3. Start Ollama

Ollama normally runs as a local service.

The default Ollama server address is:

```text
http://localhost:11434
```

## 4. Run the Application

Start the FastAPI backend:

```bash
uvicorn main:app --reload
```

Start the React frontend from the `frontend` directory:

```bash
npm run dev
```

The Vaccine Assistant can then communicate with the locally running Ollama model through the backend.

---

# Backend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Neel-Joshi13/Digital-immunisation-system.git
```

Navigate into the project:

```bash
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

Activate the environment:

```bash
.venv\Scriptsctivate
```

## 4. Install Python Dependencies

Install the required Python packages according to the project's dependency configuration.

If a `requirements.txt` file is provided, install the dependencies with:

```bash
pip install -r requirements.txt
```

## 5. Configure the Database

Configure the SQL Server connection using environment variables or the local database configuration.

Each developer should configure their own SQL Server instance.

Do not commit machine-specific database connection strings or credentials to GitHub.

## 6. Initialise the Database

From the `backend` directory, initialise the database:

```bash
python -m database.init_db
```

This creates the required database tables and performs the required database initialisation.

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
- API keys
- AI configuration
- Other private credentials

Use environment variables for sensitive configuration.

Example:

```env
DATABASE_URL=your_sql_server_connection_string
SECRET_KEY=your_secret_key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
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

The application includes several security mechanisms:

- JWT authentication
- Password hashing
- Role-based access control
- Protected API endpoints
- Active/inactive user validation
- Database foreign-key constraints
- Environment-based configuration
- Authenticated access to patient-specific resources

> **Important:** Never commit passwords, API keys, JWT secrets, database credentials, private keys, or other sensitive information to the repository.

---

# User Roles

## Patient

Patients can:

- View their profile
- View vaccination history
- View vaccination schedules
- Book appointments
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
- Vaccines
- Vaccination schedules
- Healthcare centres
- Immunisation records
- Missed-dose alerts
- Patient notifications
- Other administrative data

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
- Online appointment cancellation and rescheduling
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
- PDF certificate generation
- Certificate verification
- Local AI integration using Ollama
- Multilingual patient interface
- Automated testing

The goal is to provide a centralized digital platform for managing vaccination and immunisation-related information for patients and healthcare administrators.
