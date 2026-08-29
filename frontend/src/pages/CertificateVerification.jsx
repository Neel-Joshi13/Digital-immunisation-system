import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/certificate-verification.css";

const API_BASE_URL = "http://10.80.224.214:8000";

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
            <span>Vaccination Records</span>
            <strong>
              {certificate.vaccination_count}
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