import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/certificate-verification.css";

const API_BASE_URL = "";

function CertificateVerification() {
  const { token } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyCertificate() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/certificates/verify/${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Certificate could not be verified."
          );
        }

        setCertificate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    verifyCertificate();
  }, [token]);

  if (loading) {
    return (
      <div className="certificate-verification-page">
        <div className="certificate-verification-card">
          <h1>Verifying Certificate</h1>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-verification-page">
        <div className="certificate-verification-card invalid">
          <div className="certificate-status-icon">✕</div>

          <h1>Certificate Invalid</h1>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-verification-page">
      <div className="certificate-verification-card">
        <div className="certificate-status-icon valid">
          ✓
        </div>

        <h1>Certificate Verified</h1>

        <p className="certificate-status-message">
          This vaccination certificate is valid.
        </p>

        <div className="certificate-details">
          <div className="certificate-detail">
            <span>Patient</span>
            <strong>
              {certificate.patient.name}
            </strong>
          </div>

          <div className="certificate-detail">
            <span>Date of Birth</span>
            <strong>
              {certificate.patient.date_of_birth}
            </strong>
          </div>

          <div className="certificate-detail">
            <span>Vaccine</span>
            <strong>
              {certificate.vaccination.vaccine}
            </strong>
          </div>

          <div className="certificate-detail">
            <span>Dose Number</span>
            <strong>
              {certificate.vaccination.dose_number}
            </strong>
          </div>

          <div className="certificate-detail">
            <span>Date Administered</span>
            <strong>
              {certificate.vaccination.date_administered}
            </strong>
          </div>

          <div className="certificate-detail">
            <span>Administered By</span>
            <strong>
              {certificate.vaccination.administered_by}
            </strong>
          </div>
        </div>

        <div className="certificate-footer">
          Digital Immunisation
        </div>
      </div>
    </div>
  );
}

export default CertificateVerification;