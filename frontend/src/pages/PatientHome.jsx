import { Link } from "react-router-dom";
import "../styles/patient-dashboard.css";

function PatientHome() {
  return (
    <div className="patient-dashboard">

      <div className="patient-dashboard-header">
        <h1>Patient Dashboard</h1>

        <p>
          Welcome to your Digital Immunisation dashboard.
        </p>
      </div>

      <div className="patient-dashboard-grid">

        <Link
          to="/patient/profile"
          className="patient-dashboard-card"
        >
          <div className="patient-dashboard-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h2>My Profile</h2>

          <p>
            View and manage your personal information.
          </p>

          <div className="patient-dashboard-card-link">
            Open Profile
            <span>→</span>
          </div>
        </Link>

        <Link
          to="/patient/vaccinations"
          className="patient-dashboard-card"
        >
          <div className="patient-dashboard-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
              />
              <path d="M8 15h3" />
              <path d="M8 18h6" />
            </svg>
          </div>

          <h2>Vaccination History</h2>

          <p>
            View your vaccination records and immunisation history.
          </p>

          <div className="patient-dashboard-card-link">
            View History
            <span>→</span>
          </div>
        </Link>

        <Link
          to="/patient/vaccination-schedule"
          className="patient-dashboard-card"
        >
          <div className="patient-dashboard-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />

              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
              />

              <path d="M8 14h2" />
              <path d="M14 14h2" />
              <path d="M8 18h2" />
              <path d="M14 18h2" />
            </svg>
          </div>

          <h2>Vaccination Schedule</h2>

          <p>
            View recommended vaccines, doses and track your vaccination progress.
          </p>

          <div className="patient-dashboard-card-link">
            View Schedule
            <span>→</span>
          </div>
        </Link>

        <Link
          to="/patient/appointments"
          className="patient-dashboard-card"
        >
          <div className="patient-dashboard-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
              />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
              <path d="M8 14h2" />
              <path d="M14 14h2" />
              <path d="M8 18h2" />
              <path d="M14 18h2" />
            </svg>
          </div>

          <h2>Appointments</h2>

          <p>
            Book and view your upcoming vaccination appointments.
          </p>

          <div className="patient-dashboard-card-link">
            View Appointments
            <span>→</span>
          </div>
        </Link>

      </div>

      <div className="patient-dashboard-info">

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            Digital Record
          </span>

          <span className="patient-dashboard-info-card-value">
            Your records are securely stored
          </span>
        </div>

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            Vaccinations
          </span>

          <span className="patient-dashboard-info-card-value">
            Keep track of your immunisations
          </span>
        </div>

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            Appointments
          </span>

          <span className="patient-dashboard-info-card-value">
            Manage your vaccination visits
          </span>
        </div>

      </div>

      <div className="patient-dashboard-contact">
        Contact Us for any queries : neeljoshi.aws@gmail.com
      </div>

    </div>
  );
}

export default PatientHome;