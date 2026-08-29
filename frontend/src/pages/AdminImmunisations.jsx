import { useEffect, useState } from "react";

import {
  getImmunisations,
  createImmunisation,
  getVaccines,
} from "../services/api";

import AdminNav from "../components/AdminNav";

function AdminImmunisations() {
  const [immunisations, setImmunisations] =
    useState([]);

  const [vaccines, setVaccines] =
    useState([]);

  const [patientId, setPatientId] =
    useState("");

  const [vaccineId, setVaccineId] =
    useState("");

  const [doseNumber, setDoseNumber] =
    useState("");

  const [dateAdministered, setDateAdministered] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  async function loadImmunisations() {

    try {

      setError("");

      const data =
        await getImmunisations();

      setImmunisations(data);

    } catch (error) {

      setError(error.message);

    }

  }


  async function loadVaccines() {

    try {

      setError("");

      const data =
        await getVaccines();

      setVaccines(data);

    } catch (error) {

      setError(error.message);

    }

  }


  useEffect(() => {

    loadImmunisations();

    loadVaccines();

  }, []);


  async function handleSubmit(event) {

    event.preventDefault();

    setMessage("");

    setError("");


    try {

      await createImmunisation(
        patientId,
        vaccineId,
        doseNumber,
        dateAdministered,
        notes
      );


      setMessage(
        "Immunisation record created successfully."
      );


      setPatientId("");

      setVaccineId("");

      setDoseNumber("");

      setDateAdministered("");

      setNotes("");


      await loadImmunisations();

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
            Immunisation Records
          </h1>

          <p>
            Manage patient immunisation records
            and vaccination history.
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
            Existing Records
          </h2>


          {immunisations.length === 0 ? (

            <p>
              No immunisation records found.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Patient ID</th>

                  <th>Vaccine ID</th>

                  <th>Dose</th>

                  <th>Date</th>

                  <th>Administered By</th>

                  <th>Notes</th>

                </tr>

              </thead>


              <tbody>

                {immunisations.map(
                  (record) => (

                    <tr key={record.id}>

                      <td>
                        {record.id}
                      </td>

                      <td>
                        {record.patient_id}
                      </td>

                      <td>
                        {record.vaccine_id}
                      </td>

                      <td>
                        {record.dose_number}
                      </td>

                      <td>
                        {record.date_administered}
                      </td>

                      <td>
                        {record.administered_by}
                      </td>

                      <td>
                        {record.notes || "N/A"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </section>


        <hr />


        <section className="admin-section">

          <h2>
            Create Immunisation Record
          </h2>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            {/* Patient ID */}

            <div className="admin-form-group">

              <label htmlFor="patient-id">
                Patient ID
              </label>

              <input
                id="patient-id"
                type="number"
                min="1"
                value={patientId}
                onChange={(event) =>
                  setPatientId(
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* Vaccine */}

            <div className="admin-form-group">

              <label htmlFor="vaccine">
                Vaccine
              </label>

              <select
                id="vaccine"
                value={vaccineId}
                onChange={(event) =>
                  setVaccineId(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Select a vaccine
                </option>


                {vaccines.map(
                  (vaccine) => (

                    <option
                      key={vaccine.id}
                      value={vaccine.id}
                    >
                      {vaccine.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Dose Number */}

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
                  setDoseNumber(
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* Date */}

            <div className="admin-form-group">

              <label htmlFor="date-administered">
                Date Administered
              </label>

              <input
                id="date-administered"
                type="date"
                value={dateAdministered}
                onChange={(event) =>
                  setDateAdministered(
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* Notes */}

            <div className="admin-form-group">

              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Optional notes"
              />

            </div>


            <button type="submit">
              Create Immunisation
            </button>

          </form>

        </section>

      </main>

    </div>

  );
}

export default AdminImmunisations;