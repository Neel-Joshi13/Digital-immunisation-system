import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/patient-dashboard.css";

function PatientHome() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: "Patient Dashboard",
      welcome:
        "Welcome to your Digital Immunisation dashboard.",

      profile: "My Profile",
      profileDescription:
        "View and manage your personal information.",
      openProfile: "Open Profile",

      history: "Vaccination History",
      historyDescription:
        "View your vaccination records and immunisation history.",
      viewHistory: "View History",

      schedule: "Vaccination Schedule",
      scheduleDescription:
        "View recommended vaccines, doses and track your vaccination progress.",
      viewSchedule: "View Schedule",

      appointments: "Appointments",
      appointmentsDescription:
        "Book and view your upcoming vaccination appointments.",
      viewAppointments: "View Appointments",

      digitalRecord: "Digital Record",
      digitalRecordValue:
        "Your records are securely stored",

      vaccinations: "Vaccinations",
      vaccinationsValue:
        "Keep track of your immunisations",

      appointmentsInfo: "Appointments",
      appointmentsValue:
        "Manage your vaccination visits",

      contact:
        "Contact Us for any queries : neeljoshi.aws@gmail.com",
    },

    hi: {
      title: "मरीज का डैशबोर्ड",
      welcome:
        "अपने डिजिटल टीकाकरण डैशबोर्ड में आपका स्वागत है।",

      profile: "मेरी प्रोफ़ाइल",
      profileDescription:
        "अपनी व्यक्तिगत जानकारी देखें और प्रबंधित करें।",
      openProfile: "प्रोफ़ाइल खोलें",

      history: "टीकाकरण इतिहास",
      historyDescription:
        "अपने टीकाकरण रिकॉर्ड और टीकाकरण इतिहास देखें।",
      viewHistory: "इतिहास देखें",

      schedule: "टीकाकरण अनुसूची",
      scheduleDescription:
        "अनुशंसित टीके और खुराक देखें और अपने टीकाकरण की प्रगति पर नज़र रखें।",
      viewSchedule: "अनुसूची देखें",

      appointments: "अपॉइंटमेंट",
      appointmentsDescription:
        "अपने आगामी टीकाकरण अपॉइंटमेंट बुक करें और देखें।",
      viewAppointments: "अपॉइंटमेंट देखें",

      digitalRecord: "डिजिटल रिकॉर्ड",
      digitalRecordValue:
        "आपके रिकॉर्ड सुरक्षित रूप से संग्रहीत हैं",

      vaccinations: "टीकाकरण",
      vaccinationsValue:
        "अपने टीकाकरण का रिकॉर्ड रखें",

      appointmentsInfo: "अपॉइंटमेंट",
      appointmentsValue:
        "अपने टीकाकरण संबंधी मुलाकातों का प्रबंधन करें",

      contact:
        "किसी भी जानकारी के लिए हमसे संपर्क करें : neeljoshi.aws@gmail.com",
    },
  };

  const currentText = text[language];

  return (
    <div className="patient-dashboard">

      <div className="patient-dashboard-header">
        <h1>{currentText.title}</h1>

        <p>
          {currentText.welcome}
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

          <h2>{currentText.profile}</h2>

          <p>
            {currentText.profileDescription}
          </p>

          <div className="patient-dashboard-card-link">
            {currentText.openProfile}
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

          <h2>{currentText.history}</h2>

          <p>
            {currentText.historyDescription}
          </p>

          <div className="patient-dashboard-card-link">
            {currentText.viewHistory}
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

          <h2>{currentText.schedule}</h2>

          <p>
            {currentText.scheduleDescription}
          </p>

          <div className="patient-dashboard-card-link">
            {currentText.viewSchedule}
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

          <h2>{currentText.appointments}</h2>

          <p>
            {currentText.appointmentsDescription}
          </p>

          <div className="patient-dashboard-card-link">
            {currentText.viewAppointments}
            <span>→</span>
          </div>
        </Link>

      </div>

      <div className="patient-dashboard-info">

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            {currentText.digitalRecord}
          </span>

          <span className="patient-dashboard-info-card-value">
            {currentText.digitalRecordValue}
          </span>
        </div>

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            {currentText.vaccinations}
          </span>

          <span className="patient-dashboard-info-card-value">
            {currentText.vaccinationsValue}
          </span>
        </div>

        <div className="patient-dashboard-info-card">
          <span className="patient-dashboard-info-card-label">
            {currentText.appointmentsInfo}
          </span>

          <span className="patient-dashboard-info-card-value">
            {currentText.appointmentsValue}
          </span>
        </div>

      </div>

      <div className="patient-dashboard-contact">
        {currentText.contact}
      </div>

    </div>
  );
}

export default PatientHome;