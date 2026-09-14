import { useEffect, useState } from "react";

import {
  getVaccinationSchedules,
  getVaccines,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

import "../styles/patient-vaccination-schedule.css";

function PatientVaccinationSchedule() {
  const { language } = useLanguage();

  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const text = {
    en: {
      title: "Vaccination Schedule",
      subtitle:
        "View recommended vaccination doses and scheduling information.",
      recommendedSchedule: "Recommended Schedule",
      timing:
        "Vaccination timing and dose recommendations",
      recommendedDoses:
        "Recommended vaccination doses and intervals",
      vaccine: "Vaccine",
      dose: "Dose",
      recommendedAge: "Recommended Age",
      minimumInterval: "Minimum Interval",
      notes: "Notes",
      days: "days",
      notSpecified: "Not specified",
      noNotes: "No additional notes",
      noSchedule: "No vaccination schedule available",
      noScheduleDescription:
        "No vaccination schedule information is currently available at this time.",
      loading: "Loading vaccination schedule...",
      important: "Important",
      notice:
        "Vaccination schedules can depend on age, health conditions and individual circumstances. Please confirm your vaccination schedule with an authorised healthcare professional.",
      vaccineFallback: "Vaccine",
    },

    hi: {
      title: "टीकाकरण अनुसूची",
      subtitle:
        "अनुशंसित टीकाकरण खुराक और समय-सारणी की जानकारी देखें।",
      recommendedSchedule: "अनुशंसित अनुसूची",
      timing:
        "टीकाकरण का समय और खुराक की सिफारिशें",
      recommendedDoses:
        "अनुशंसित टीकाकरण खुराक और अंतराल",
      vaccine: "टीका",
      dose: "खुराक",
      recommendedAge: "अनुशंसित आयु",
      minimumInterval: "न्यूनतम अंतराल",
      notes: "टिप्पणियाँ",
      days: "दिन",
      notSpecified: "निर्दिष्ट नहीं",
      noNotes: "कोई अतिरिक्त टिप्पणी नहीं",
      noSchedule: "कोई टीकाकरण अनुसूची उपलब्ध नहीं",
      noScheduleDescription:
        "इस समय टीकाकरण अनुसूची की कोई जानकारी उपलब्ध नहीं है।",
      loading: "टीकाकरण अनुसूची लोड हो रही है...",
      important: "महत्वपूर्ण",
      notice:
        "टीकाकरण अनुसूची उम्र, स्वास्थ्य स्थिति और व्यक्तिगत परिस्थितियों पर निर्भर कर सकती है। कृपया अधिकृत स्वास्थ्यकर्मी से अपनी टीकाकरण अनुसूची की पुष्टि करें।",
      vaccineFallback: "टीका",
    },
  };

  const currentText = text[language];

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [scheduleData, vaccineData] = await Promise.all([
        getVaccinationSchedules(),
        getVaccines(),
      ]);

      setSchedules(scheduleData);
      setVaccines(vaccineData);
    } catch (error) {
      setError(
        error.message ||
          "Unable to load vaccination schedule."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getVaccineName(vaccineId) {
    const vaccine = vaccines.find(
      (item) => item.id === vaccineId
    );

    return vaccine
      ? vaccine.name
      : `${currentText.vaccineFallback} #${vaccineId}`;
  }

  return (
    <div className="patient-vaccination-schedule">

      <div className="patient-vaccination-schedule-header">

        <div className="patient-vaccination-schedule-header-icon">
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

        <div>
          <h1>{currentText.title}</h1>

          <p>
            {currentText.subtitle}
          </p>
        </div>

      </div>

      {error && (
        <div className="patient-vaccination-schedule-error">

          <div className="patient-vaccination-schedule-error-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <span>{error}</span>

        </div>
      )}

      {loading ? (
        <div className="patient-vaccination-schedule-loading">

          <span className="patient-vaccination-schedule-spinner"></span>

          <span>
            {currentText.loading}
          </span>

        </div>
      ) : schedules.length === 0 ? (

        <section className="patient-vaccination-schedule-card">

          <div className="patient-vaccination-schedule-card-header">

            <div className="patient-vaccination-schedule-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <div className="patient-vaccination-schedule-card-title">

              <h2>
                {currentText.recommendedSchedule}
              </h2>

              <p>
                {currentText.timing}
              </p>

            </div>

          </div>

          <div className="patient-vaccination-schedule-empty">

            <div className="patient-vaccination-schedule-empty-icon">
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

                <path d="M9 15h6" />
              </svg>
            </div>

            <h3>
              {currentText.noSchedule}
            </h3>

            <p>
              {currentText.noScheduleDescription}
            </p>

          </div>

        </section>

      ) : (

        <section className="patient-vaccination-schedule-card">

          <div className="patient-vaccination-schedule-card-header">

            <div className="patient-vaccination-schedule-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <div className="patient-vaccination-schedule-card-title">

              <h2>
                {currentText.recommendedSchedule}
              </h2>

              <p>
                {currentText.recommendedDoses}
              </p>

            </div>

          </div>

          <div className="patient-vaccination-schedule-table-wrapper">

            <table className="patient-vaccination-schedule-table">

              <thead>
                <tr>
                  <th>{currentText.vaccine}</th>
                  <th>{currentText.dose}</th>
                  <th>{currentText.recommendedAge}</th>
                  <th>{currentText.minimumInterval}</th>
                  <th>{currentText.notes}</th>
                </tr>
              </thead>

              <tbody>

                {schedules.map((schedule) => (
                  <tr key={schedule.id}>

                    <td>
                      <div className="patient-vaccination-schedule-vaccine">

                        <span className="patient-vaccination-schedule-vaccine-icon">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
                        </span>

                        <span>
                          {getVaccineName(
                            schedule.vaccine_id
                          )}
                        </span>

                      </div>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-dose">
                        {currentText.dose}{" "}
                        {schedule.dose_number}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-value">
                        {schedule.recommended_age ||
                          currentText.notSpecified}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-value">
                        {schedule.minimum_interval_days !== null &&
                        schedule.minimum_interval_days !== undefined
                          ? `${schedule.minimum_interval_days} ${currentText.days}`
                          : currentText.notSpecified}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-notes">
                        {schedule.notes ||
                          currentText.noNotes}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>
      )}

      <section className="patient-vaccination-schedule-notice">

        <div className="patient-vaccination-schedule-notice-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />

            <path d="M12 10v6" />

            <path d="M12 7h.01" />
          </svg>

        </div>

        <div className="patient-vaccination-schedule-notice-content">

          <strong>
            {currentText.important}
          </strong>

          <span>
            {currentText.notice}
          </span>

        </div>

      </section>

    </div>
  );
}

export default PatientVaccinationSchedule;