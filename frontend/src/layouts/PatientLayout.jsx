import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/patient.css";

function PatientLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  function openVaccineAssistant() {
    navigate("/patient/vaccine-assistant");
  }

  return (
    <div className="patient-layout">
      <header className="topbar">
        <div className="patient-brand">
          <div className="patient-brand-mark">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M24 42S9 30.9 9 18.4C9 10.8 14.1 6 20.1 6c3.4 0 6.1 1.7 7.9 4.4C29.8 7.7 32.5 6 35.9 6 41.9 6 47 10.8 47 18.4 47 30.9 32 42 24 42Z"
                fill="currentColor"
                transform="translate(-4 0)"
              />

              <path
                d="M24 13V29"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M16 21H32"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="patient-brand-text">
            <div className="patient-brand-name">
              Digital Immunisation
            </div>

            <div className="patient-brand-subtitle">
              Digital healthcare management
            </div>
          </div>
        </div>

        <nav className="patient-nav">
          <NavLink
            to="/patient"
            end
            className={({ isActive }) =>
              isActive
                ? "patient-nav-link active"
                : "patient-nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/patient/profile"
            className={({ isActive }) =>
              isActive
                ? "patient-nav-link active"
                : "patient-nav-link"
            }
          >
            My Profile
          </NavLink>

          <NavLink
            to="/patient/vaccinations"
            className={({ isActive }) =>
              isActive
                ? "patient-nav-link active"
                : "patient-nav-link"
            }
          >
            Vaccination History
          </NavLink>

          <NavLink
            to="/patient/appointments"
            className={({ isActive }) =>
              isActive
                ? "patient-nav-link active"
                : "patient-nav-link"
            }
          >
            Appointments
          </NavLink>

          <NavLink
            to="/patient/vaccination-schedule"
            className={({ isActive }) =>
              isActive
                ? "patient-nav-link active"
                : "patient-nav-link"
            }
          >
            Vaccination Schedule
          </NavLink>
        </nav>

        <button
          className="patient-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <button
        type="button"
        className="floating-ai-button"
        onClick={openVaccineAssistant}
        aria-label="Open AI Vaccine Assistant"
        title="AI Vaccine Assistant"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 11.5C20 15.64 16.42 19 12 19C10.72 19 9.52 18.72 8.47 18.23L4 20L5.3 16.08C4.48 14.82 4 13.34 4 11.75C4 7.47 7.58 4 12 4C16.42 4 20 7.36 20 11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          <path
            d="M8 11.5H8.01"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <path
            d="M12 11.5H12.01"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <path
            d="M16 11.5H16.01"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default PatientLayout;
