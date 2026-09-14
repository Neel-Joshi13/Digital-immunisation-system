import { useEffect, useState } from "react";
import {
  getMyImmunisations,
  downloadMyCertificate,
} from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/vaccination-history.css";

function VaccinationHistory() {
  const { language } = useLanguage();

  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  const text = {
    en: {
      title: "Vaccination History",
      subtitle:
        "View your vaccination records and immunisation history.",
      records: "Immunisation Records",
      completedDoses: "Your completed vaccination doses",
      noRecords: "No vaccination records",
      noRecordsDescription:
        "No vaccination records have been found for your account.",
      vaccine: "Vaccine",
      dose: "Dose",
      dateAdministered: "Date Administered",
      notAvailable: "N/A",
      downloadCertificate:
        "Download Vaccination Certificate",
      certificateError:
        "Failed to download vaccination certificate.",
    },

    hi: {
      title: "टीकाकरण इतिहास",
      subtitle:
        "अपने टीकाकरण रिकॉर्ड और टीकाकरण इतिहास देखें।",
      records: "टीकाकरण रिकॉर्ड",
      completedDoses: "आपकी पूरी की गई टीकाकरण खुराक",
      noRecords: "कोई टीकाकरण रिकॉर्ड नहीं",
      noRecordsDescription:
        "आपके खाते के लिए कोई टीकाकरण रिकॉर्ड नहीं मिला।",
      vaccine: "टीका",
      dose: "खुराक",
      dateAdministered: "टीका लगाए जाने की तारीख",
      notAvailable: "उपलब्ध नहीं",
      downloadCertificate:
        "टीकाकरण प्रमाणपत्र डाउनलोड करें",
      certificateError:
        "टीकाकरण प्रमाणपत्र डाउनलोड करने में समस्या हुई।",
    },
  };

  const currentText = text[language];

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
      alert(
        error.message ||
          currentText.certificateError
      );
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
          {currentText.title}
        </h1>

        <p>
          {currentText.subtitle}
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
              {currentText.records}
            </h2>

            <p>
              {currentText.completedDoses}
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
              {currentText.noRecords}
            </h3>

            <p>
              {currentText.noRecordsDescription}
            </p>

          </div>

        ) : (

          <div>

            <div className="vaccination-history-table-wrapper">

              <table className="vaccination-history-table">

                <thead>

                  <tr>

                    <th>
                      {currentText.vaccine}
                    </th>

                    <th>
                      {currentText.dose}
                    </th>

                    <th>
                      {currentText.dateAdministered}
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
                            {record.vaccine_name ||
                              currentText.notAvailable}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span className="vaccination-history-dose">

                          {currentText.dose}{" "}
                          {record.dose_number}

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
                {currentText.downloadCertificate}
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default VaccinationHistory;