import { useEffect, useState } from "react";

import {
  getVaccinationSchedules,
  getVaccines,
} from "../services/api";

import "../styles/patient-vaccination-schedule.css";

function PatientVaccinationSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(error.message || "Unable to load vaccination schedule.");
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
      : `Vaccine #${vaccineId}`;
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
          <h1>Vaccination Schedule</h1>

          <p>
            View recommended vaccination doses and
            scheduling information.
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
            Loading vaccination schedule...
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

              <h2>Recommended Schedule</h2>

              <p>
                Vaccination timing and dose recommendations
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
              No vaccination schedule available
            </h3>

            <p>
              No vaccination schedule information is
              currently available at this time.
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

              <h2>Recommended Schedule</h2>

              <p>
                Recommended vaccination doses and intervals
              </p>

            </div>

          </div>

          <div className="patient-vaccination-schedule-table-wrapper">

            <table className="patient-vaccination-schedule-table">

              <thead>
                <tr>
                  <th>Vaccine</th>
                  <th>Dose</th>
                  <th>Recommended Age</th>
                  <th>Minimum Interval</th>
                  <th>Notes</th>
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
                        Dose {schedule.dose_number}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-value">
                        {schedule.recommended_age ||
                          "Not specified"}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-value">
                        {schedule.minimum_interval_days !== null &&
                        schedule.minimum_interval_days !== undefined
                          ? `${schedule.minimum_interval_days} days`
                          : "Not specified"}
                      </span>
                    </td>

                    <td>
                      <span className="patient-vaccination-schedule-notes">
                        {schedule.notes ||
                          "No additional notes"}
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

          <strong>Important</strong>

          <span>
            Vaccination schedules can depend on age,
            health conditions and individual circumstances.
            Please confirm your vaccination schedule with
            an authorised healthcare professional.
          </span>

        </div>

      </section>

    </div>
  );
}

export default PatientVaccinationSchedule;