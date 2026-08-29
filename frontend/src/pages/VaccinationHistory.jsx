import { useEffect, useState } from "react";
import {
  getMyImmunisations,
  downloadMyCertificate,
} from "../services/api";
import "../styles/vaccination-history.css";

function VaccinationHistory() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getMyImmunisations();

        setRecords(data);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadHistory();
  }, []);

  async function handleDownloadCertificate() {
    try {
      await downloadMyCertificate();
    } catch (error) {
      alert(error.message);
    }
  }

  if (message) {
    return (
      <div className="vaccination-history">

        <div className="vaccination-history-error">
          {message}
        </div>

      </div>
    );
  }

  return (
    <div className="vaccination-history">

      <div className="vaccination-history-header">

        <h1>
          Vaccination History
        </h1>

        <p>
          View your vaccination records and immunisation history.
        </p>

      </div>

      <div className="vaccination-history-card">

        <div className="vaccination-history-card-header">

          <div className="vaccination-history-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>

          </div>

          <div className="vaccination-history-card-title">

            <h2>
              Immunisation Records
            </h2>

            <p>
              Your completed vaccination doses
            </p>

          </div>

        </div>

        {records.length === 0 ? (

          <div className="vaccination-history-empty">

            <div className="vaccination-history-empty-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

            </div>

            <h3>
              No vaccination records
            </h3>

            <p>
              No vaccination records have been found for your account.
            </p>

          </div>

        ) : (

          <div>

            <div className="vaccination-history-table-wrapper">

              <table className="vaccination-history-table">

                <thead>

                  <tr>

                    <th>
                      Vaccine
                    </th>

                    <th>
                      Dose
                    </th>

                    <th>
                      Date Administered
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {records.map((record) => (

                    <tr key={record.id}>

                      <td>

                        <div className="vaccination-history-vaccine">

                          <span className="vaccination-history-vaccine-icon">

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            >
                              <path d="M12 5v14" />
                              <path d="M5 12h14" />
                            </svg>

                          </span>

                          <span>
                            {record.vaccine_name || "N/A"}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span className="vaccination-history-dose">

                          Dose {record.dose_number}

                        </span>

                      </td>

                      <td>
                        {record.date_administered}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="vaccination-history-certificate">

              <button
                type="button"
                onClick={handleDownloadCertificate}
                className="download-certificate-button"
              >
                Download Vaccination Certificate
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default VaccinationHistory;