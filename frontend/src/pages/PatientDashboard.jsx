import { useEffect, useState } from "react";
import { getMyProfile } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/patient-profile.css";

function PatientDashboard() {
  const { language } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  const text = {
    en: {
      title: "My Profile",
      subtitle: "View your information.",
      patientInformation: "Patient information",
      fullName: "Full Name",
      dateOfBirth: "Date of Birth",
      phoneNumber: "Phone Number",
      notProvided: "Not provided",
      security:
        "Your personal information is securely stored in your Digital Immunisation record.",
      loading: "Loading profile...",
    },
    hi: {
      title: "मेरी प्रोफ़ाइल",
      subtitle: "अपनी जानकारी देखें।",
      patientInformation: "मरीज की जानकारी",
      fullName: "पूरा नाम",
      dateOfBirth: "जन्म तिथि",
      phoneNumber: "फ़ोन नंबर",
      notProvided: "उपलब्ध नहीं",
      security:
        "आपकी व्यक्तिगत जानकारी आपके डिजिटल टीकाकरण रिकॉर्ड में सुरक्षित रूप से संग्रहीत है।",
      loading: "प्रोफ़ाइल लोड हो रही है...",
    },
  };

  const currentText = text[language];

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
          {currentText.loading}
        </div>
      </div>
    );
  }

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  return (
    <div className="patient-profile">
      <div className="patient-profile-header">
        <h1>{currentText.title}</h1>

        <p>{currentText.subtitle}</p>
      </div>

      <div className="patient-profile-card">
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
            <b>{currentText.patientInformation}</b>
          </div>
        </div>

        <div className="patient-profile-details">
          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              {currentText.fullName}
            </span>

            <span className="patient-profile-field-value">
              {fullName || currentText.notProvided}
            </span>
          </div>

          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              {currentText.dateOfBirth}
            </span>

            <span className="patient-profile-field-value">
              {profile.date_of_birth || currentText.notProvided}
            </span>
          </div>

          <div className="patient-profile-field">
            <span className="patient-profile-field-label">
              {currentText.phoneNumber}
            </span>

            <span className="patient-profile-field-value">
              {profile.phone || currentText.notProvided}
            </span>
          </div>
        </div>

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

          <div>{currentText.security}</div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;