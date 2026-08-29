# Digital Immunisation System

A full-stack digital immunisation management system developed to simplify vaccination management for patients, administrators, and healthcare workers.

The system provides patient management, vaccine information, vaccination schedules, appointment booking, immunisation history, missed-dose tracking, vaccination certificates, and a locally hosted AI Vaccine Assistant powered by Ollama.

---

## Features

### 👤 Patient Management

* Patient registration and profile management
* View personal information
* View vaccination history
* Track completed vaccination doses
* View potentially missed vaccination doses
* Download vaccination certificates

### 💉 Vaccine Management

* Add and manage vaccines
* Store vaccine names and manufacturers
* Store vaccine descriptions
* Define required doses
* Store recommended age information
* Store vaccine information sources

### 📅 Vaccination Schedules

* Create vaccination schedules
* Define dose numbers
* Set recommended ages
* Set minimum intervals between doses
* Add notes and source references
* Associate schedules with specific vaccines

### 🏥 Healthcare Centres

* Add and manage healthcare centres
* Store centre names, addresses, and contact information
* Allow patients to select healthcare centres when booking appointments

### 📆 Appointment Management

* Book vaccination appointments
* Select healthcare centres
* Select appointment dates and times
* Provide appointment reasons
* View personal appointments

### 📋 Immunisation Records

* Record administered vaccines
* Track vaccine dose numbers
* Store administration dates
* Associate vaccination records with patients and vaccines
* Record the administrator or healthcare worker responsible for administration

### ⚠️ Missed Dose Tracking

* Identify potentially missed vaccination doses
* Compare patient vaccination history with vaccination schedules
* Display missed-dose information to patients

### 📄 Vaccination Certificates

* Generate vaccination certificates
* Generate certificates in PDF format
* Download vaccination certificates from the patient portal

### 🤖 AI Vaccine Assistant

The system includes an AI-powered Vaccine Assistant using **Ollama**.

Ollama allows the AI model to run locally instead of relying on a cloud-based AI service.

The assistant can answer general vaccine-related questions and provide informational responses through the application.

Example questions:

* What is the BCG vaccine?
* Why is vaccination important?
* What vaccines are recommended for children?
* What is the purpose of a booster dose?
* What should I know about vaccine schedules?

> **Note:** The AI assistant is intended for informational and educational purposes and does not replace professional medical advice.

### 🔐 Authentication and Role-Based Access

The system uses JWT-based authentication and role-based authorization.

Supported roles:

* `PATIENT`
* `ADMIN`
* `HEALTHCARE_WORKER`

Different roles have access to different parts of the application.

---

# Technology Stack

## Frontend

* React
* JavaScript
* Vite
* HTML
* CSS
* Fetch API
* Local Storage

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn
* python-jose
* Passlib
* bcrypt

## Database

* Microsoft SQL Server
* SQLAlchemy ORM
* SQL Server Management Studio (SSMS)

## AI

* Ollama
* Locally hosted AI model

## Other

* JWT Authentication
* REST API
* PDF generation
* Pytest

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
                │              │
                │              └────────────┬────────────┘
                │                           │
                │                     SQLAlchemy ORM
                │                           │
                │                    SQL Server Database
                │
                └────────── AI Vaccine Assistant
                                │
                              Ollama
                                │
                         Local AI Model
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
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
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

The major entities include:

```text
Users
  │
  └── Patients
        │
        ├── Appointments
        │
        └── Immunisation Records
                    │
                    └── Vaccines
                          │
                          └── Vaccination Schedules

Healthcare Centres
```

Foreign-key relationships are used to maintain data integrity between patients, vaccines, appointments, immunisation records, and vaccination schedules.

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

The AI Vaccine Assistant uses **Ollama** to run an AI model locally.

## 1. Install Ollama

Download Ollama from:

https://ollama.com/

Verify the installation:

```bash
ollama --version
```

## 2. Download an AI Model

Pull the model configured for the application.

For example:

```bash
ollama pull llama3.2
```

The model name should match the model configured in the backend.

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
.venv\Scripts\activate
```

## 4. Install Python Dependencies

Install the required Python packages according to the project's dependency configuration.

## 5. Configure the Database

Configure the SQL Server connection using environment variables or your local configuration.

**Do not use or commit a machine-specific connection string such as:**

```text
mssql+pyodbc://@NAANU\SQLEXPRESS/
```

Each developer should configure their own SQL Server instance.

## 6. Start the Backend

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

* Database credentials
* SQL Server connection information
* JWT secret keys
* API keys
* AI configuration
* Other private credentials

Use environment variables for sensitive configuration.

Example:

```env
DATABASE_URL=your_sql_server_connection_string
SECRET_KEY=your_secret_key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=your_model_name
```

Do not commit the actual `.env` file.

A `.env.example` file can be used to document required configuration without exposing secrets.

---

# Testing

The backend contains tests covering different parts of the application, including:

* Database connections
* Database sessions
* CRUD operations
* User/model functionality
* Patient model
* Vaccine model
* Immunisation model
* Appointment model
* Healthcare centre model

Run the tests with:

```bash
pytest
```

---

# Security

The application includes several security mechanisms:

* JWT authentication
* Password hashing
* Role-based access control
* Protected API endpoints
* Active/inactive user validation
* Database foreign-key constraints
* Environment-based configuration

> **Important:** Never commit passwords, API keys, JWT secrets, database credentials, private keys, or other sensitive information to the repository.

---

# User Roles

## Patient

Patients can:

* View their profile
* View vaccination history
* Book appointments
* View appointments
* View potentially missed doses
* Download vaccination certificates
* Use the AI Vaccine Assistant

## Admin

Administrators can manage:

* Users
* Vaccines
* Vaccination schedules
* Healthcare centres
* Immunisation records
* Other administrative data

## Healthcare Worker

Healthcare workers can perform healthcare-related operations such as recording immunisation information.

---

# AI Assistant Disclaimer

The AI Vaccine Assistant is provided for educational and informational purposes.

AI-generated responses should not be considered a diagnosis, prescription, or substitute for advice from a qualified healthcare professional.

Users should consult an appropriate healthcare professional for personal medical decisions.

---

# Future Improvements

Potential future enhancements include:

* SMS/email appointment reminders
* Online appointment cancellation and rescheduling
* Advanced administrator dashboards
* Vaccine inventory management
* QR-code-based vaccination certificates
* Multi-language support
* Enhanced AI assistance
* Cloud deployment
* Mobile application support

---

# Purpose

The Digital Immunisation System was developed as a **final-year project** to demonstrate the design and development of a full-stack healthcare application.

The project combines:

* Frontend development
* REST API development
* Database management
* Authentication
* Role-based authorization
* Healthcare data management
* PDF generation
* Local AI integration using Ollama
* Automated testing

The goal is to provide a centralized digital platform for managing vaccination and immunisation-related information.
