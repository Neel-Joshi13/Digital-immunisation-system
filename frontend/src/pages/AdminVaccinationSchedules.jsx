import { useEffect, useState } from "react";

import {
  getVaccinationSchedules,
  createVaccinationSchedule,
  getVaccines,
} from "../services/api";

import AdminNav from "../components/AdminNav";

function AdminVaccinationSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [vaccineId, setVaccineId] = useState("");
  const [doseNumber, setDoseNumber] = useState("");
  const [recommendedAge, setRecommendedAge] = useState("");
  const [minimumIntervalDays, setMinimumIntervalDays] =
    useState("");
  const [notes, setNotes] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setError("");

      const [scheduleData, vaccineData] =
        await Promise.all([
          getVaccinationSchedules(),
          getVaccines(),
        ]);

      setSchedules(scheduleData);
      setVaccines(vaccineData);
    } catch (error) {
      setError(error.message);
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

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await createVaccinationSchedule(
        vaccineId,
        doseNumber,
        recommendedAge,
        minimumIntervalDays,
        notes,
        sourceName,
        sourceUrl
      );

      setMessage(
        "Vaccination schedule created successfully."
      );

      setVaccineId("");
      setDoseNumber("");
      setRecommendedAge("");
      setMinimumIntervalDays("");
      setNotes("");
      setSourceName("");
      setSourceUrl("");

      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-layout">

      <AdminNav />

      <main className="admin-content">

        <div className="admin-header">

          <h1>
            Vaccination Schedule
          </h1>

          <p>
            Manage vaccination dose schedules,
            recommended ages and official sources.
          </p>

        </div>


        {message && (
          <p className="success-message">
            {message}
          </p>
        )}


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <section className="admin-section">

          <h2>
            Vaccination Schedules
          </h2>


          {schedules.length === 0 ? (

            <p>
              No vaccination schedules found.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Vaccine
                  </th>

                  <th>
                    Dose
                  </th>

                  <th>
                    Recommended Age
                  </th>

                  <th>
                    Minimum Interval
                  </th>

                  <th>
                    Notes
                  </th>

                  <th>
                    Source
                  </th>

                </tr>

              </thead>


              <tbody>

                {schedules.map((schedule) => (

                  <tr key={schedule.id}>

                    <td>
                      {getVaccineName(
                        schedule.vaccine_id
                      )}
                    </td>

                    <td>
                      {schedule.dose_number}
                    </td>

                    <td>
                      {schedule.recommended_age ||
                        "—"}
                    </td>

                    <td>
                      {schedule.minimum_interval_days
                        ? `${schedule.minimum_interval_days} days`
                        : "—"}
                    </td>

                    <td>
                      {schedule.notes || "—"}
                    </td>

                    <td>

                      {schedule.source_url ? (

                        <a
                          href={schedule.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {schedule.source_name ||
                            "View Source"}
                        </a>

                      ) : (

                        schedule.source_name ||
                        "—"

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </section>


        <hr />


        <section className="admin-section">

          <h2>
            Create Vaccination Schedule
          </h2>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">

              <label htmlFor="schedule-vaccine">
                Vaccine
              </label>

              <select
                id="schedule-vaccine"
                value={vaccineId}
                onChange={(event) =>
                  setVaccineId(event.target.value)
                }
                required
              >

                <option value="">
                  Select vaccine
                </option>

                {vaccines.map((vaccine) => (

                  <option
                    key={vaccine.id}
                    value={vaccine.id}
                  >
                    {vaccine.name}
                  </option>

                ))}

              </select>

            </div>


            <div className="admin-form-group">

              <label htmlFor="dose-number">
                Dose Number
              </label>

              <input
                id="dose-number"
                type="number"
                min="1"
                value={doseNumber}
                onChange={(event) =>
                  setDoseNumber(event.target.value)
                }
                required
              />

            </div>


            <div className="admin-form-group">

              <label htmlFor="schedule-age">
                Recommended Age
              </label>

              <input
                id="schedule-age"
                type="text"
                value={recommendedAge}
                onChange={(event) =>
                  setRecommendedAge(
                    event.target.value
                  )
                }
                placeholder="e.g. Birth, 6 weeks, 10 weeks"
              />

            </div>


            <div className="admin-form-group">

              <label htmlFor="minimum-interval">
                Minimum Interval (Days)
              </label>

              <input
                id="minimum-interval"
                type="number"
                min="0"
                value={minimumIntervalDays}
                onChange={(event) =>
                  setMinimumIntervalDays(
                    event.target.value
                  )
                }
                placeholder="e.g. 28"
              />

            </div>


            <div className="admin-form-group">

              <label htmlFor="schedule-notes">
                Notes
              </label>

              <textarea
                id="schedule-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Additional vaccination guidance"
              />

            </div>


            <div className="admin-form-group">

              <label htmlFor="source-name">
                Source Name
              </label>

              <input
                id="source-name"
                type="text"
                value={sourceName}
                onChange={(event) =>
                  setSourceName(event.target.value)
                }
                placeholder="e.g. Ministry of Health and Family Welfare"
              />

            </div>


            <div className="admin-form-group">

              <label htmlFor="source-url">
                Source URL
              </label>

              <input
                id="source-url"
                type="url"
                value={sourceUrl}
                onChange={(event) =>
                  setSourceUrl(event.target.value)
                }
                placeholder="https://..."
              />

            </div>


            <button type="submit">
              Create Schedule
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}

export default AdminVaccinationSchedules;