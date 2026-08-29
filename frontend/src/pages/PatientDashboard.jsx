import { useEffect, useState } from "react";
import { getMyProfile } from "../services/api";
import "../styles/patient-profile.css";

function PatientDashboard() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadProfile();
  }, []);

  if (message) {
    return (
      <div className="patient-profile">
        <div className="patient-profile-error">
          {message}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="patient-profile">
        <div className="patient-profile-loading">
          <span className="patient-profile-spinner"></span>
          Loading profile...
        </div>
      </div>
    );
  }

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  return (
    <div className="patient-profile">

      {/* Page Header */}
      <div className="patient-profile-header">
        <h1>My Profile</h1>

        <p>
          View your information.
        </p>
      </div>


      {/* Profile Card */}
      <div className="patient-profile-card">

        {/* Card Header */}
        <div className="patient-profile-card-header">

          <div className="patient-profile-avatar">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 4V20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M4 12H20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="patient-profile-card-title">
              <b>Patient information</b>
          </div>

        </div>


        {/* Profile Details */}
        <div className="patient-profile-details">

          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              Full Name
            </span>

            <span className="patient-profile-field-value">
              {fullName || "Not provided"}
            </span>
          </div>


          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              Date of Birth
            </span>

            <span className="patient-profile-field-value">
              {profile.date_of_birth || "Not provided"}
            </span>
          </div>


          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              Phone Number
            </span>

            <span className="patient-profile-field-value">
              {profile.phone || "Not provided"}
            </span>
          </div>

        </div>


        {/* Security Information */}
        <div className="patient-profile-security">

          <div className="patient-profile-security-icon">
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
                y="11"
                width="18"
                height="10"
                rx="2"
              />

              <path d="M7 11V7a5 5 0 0 1 10 0v4" />

              <circle
                cx="12"
                cy="16"
                r="1"
              />
            </svg>
          </div>

          <div>
            Your personal information is securely stored
            in your Digital Immunisation record.
          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;