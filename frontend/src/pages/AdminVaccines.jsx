import { useEffect, useState } from "react";

import {
  getVaccines,
  createVaccine,
} from "../services/api";

import AdminNav from "../components/AdminNav";

function AdminVaccines() {
  const [vaccines, setVaccines] = useState([]);

  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [recommendedAge, setRecommendedAge] =
    useState("");
  const [dosesRequired, setDosesRequired] =
    useState("");

  const [sourceName, setSourceName] =
    useState("");

  const [sourceUrl, setSourceUrl] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadVaccines() {
    try {
      setError("");

      const data = await getVaccines();

      setVaccines(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadVaccines();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await createVaccine(
        name,
        manufacturer,
        description,
        recommendedAge,
        dosesRequired,
        sourceName,
        sourceUrl
      );

      setMessage(
        "Vaccine created successfully."
      );

      setName("");
      setManufacturer("");
      setDescription("");
      setRecommendedAge("");
      setDosesRequired("");
      setSourceName("");
      setSourceUrl("");

      await loadVaccines();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-layout">

      <AdminNav />

      <main className="admin-content">

        <div className="admin-header">
          <h1>Vaccine Management</h1>

          <p>
            Manage available vaccines and their
            vaccination requirements.
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

          <h2>Vaccines</h2>


          {vaccines.length === 0 ? (

            <p>No vaccines found.</p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>Name</th>

                  <th>Manufacturer</th>

                  <th>Description</th>

                  <th>Recommended Age</th>

                  <th>Doses Required</th>

                  <th>Active</th>

                  <th>Source</th>

                  <th>Source URL</th>

                </tr>

              </thead>


              <tbody>

                {vaccines.map((vaccine) => (

                  <tr key={vaccine.id}>

                    <td>
                      {vaccine.name}
                    </td>

                    <td>
                      {vaccine.manufacturer}
                    </td>

                    <td>
                      {vaccine.description}
                    </td>

                    <td>
                      {vaccine.recommended_age}
                    </td>

                    <td>
                      {vaccine.doses_required}
                    </td>

                    <td>
                      {vaccine.is_active
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      {vaccine.source_name || "N/A"}
                    </td>

                    <td>
                      {vaccine.source_url ? (
                        <a
                          href={vaccine.source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Official Source
                        </a>
                      ) : (
                        "N/A"
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

          <h2>Create Vaccine</h2>


          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}

            <div className="admin-form-group">

              <label htmlFor="vaccine-name">
                Name
              </label>

              <input
                id="vaccine-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>


            {/* Manufacturer */}

            <div className="admin-form-group">

              <label htmlFor="vaccine-manufacturer">
                Manufacturer
              </label>

              <input
                id="vaccine-manufacturer"
                type="text"
                value={manufacturer}
                onChange={(event) =>
                  setManufacturer(
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* Description */}

            <div className="admin-form-group">

              <label htmlFor="vaccine-description">
                Description
              </label>

              <textarea
                id="vaccine-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Enter vaccine description"
                required
              />

            </div>


            {/* Recommended Age */}

            <div className="admin-form-group">

              <label htmlFor="recommended-age">
                Recommended Age
              </label>

              <input
                id="recommended-age"
                type="text"
                value={recommendedAge}
                onChange={(event) =>
                  setRecommendedAge(
                    event.target.value
                  )
                }
                placeholder="e.g. 6 months"
                required
              />

            </div>


            {/* Doses Required */}

            <div className="admin-form-group">

              <label htmlFor="doses-required">
                Doses Required
              </label>

              <input
                id="doses-required"
                type="number"
                min="1"
                value={dosesRequired}
                onChange={(event) =>
                  setDosesRequired(
                    event.target.value
                  )
                }
                required
              />

            </div>


            {/* Official Source */}

            <div className="admin-form-group">

              <label htmlFor="source-name">
                Official Source
              </label>

              <input
                id="source-name"
                type="text"
                value={sourceName}
                onChange={(event) =>
                  setSourceName(
                    event.target.value
                  )
                }
                placeholder="e.g. Ministry of Health and Family Welfare"
              />

            </div>


            {/* Official Source URL */}

            <div className="admin-form-group">

              <label htmlFor="source-url">
                Official Source URL
              </label>

              <input
                id="source-url"
                type="url"
                value={sourceUrl}
                onChange={(event) =>
                  setSourceUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
              />

            </div>


            <button type="submit">
              Create Vaccine
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}

export default AdminVaccines;
