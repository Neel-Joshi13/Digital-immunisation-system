import { useEffect, useState } from "react";
import {
  getAllMissedDoses,
  createNotification,
} from "../services/api";

function AdminMissedDoseAlert() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadMissedDoses();
  }, []);

  async function loadMissedDoses() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllMissedDoses();

      setPatients(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load missed-dose alerts."
      );
    } finally {
      setLoading(false);
    }
  }

  function openMessageForm(patient) {
    setSelectedPatient(patient);

    const firstMissedDose =
      patient.missed_doses?.[0];

    if (firstMissedDose) {
      setMessage(
        `You have missed ${firstMissedDose.vaccine_name} dose ${firstMissedDose.dose_number}. Please contact your healthcare centre to arrange your vaccination.`
      );
    } else {
      setMessage(
        "You have a missed vaccination dose. Please contact your healthcare centre to arrange your vaccination."
      );
    }

    setSuccess("");
    setError("");
  }

  function closeMessageForm() {
    setSelectedPatient(null);
    setMessage("");
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    if (!selectedPatient || !message.trim()) {
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      await createNotification({
        patient_id: selectedPatient.patient_id,
        title: "Missed Vaccination Dose",
        message: message.trim(),
        notification_type: "MISSED_DOSE",
      });

      setSuccess("Message sent successfully.");

      setTimeout(() => {
        closeMessageForm();
      }, 1000);
    } catch (err) {
      setError(
        err.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-missed-dose-alert">
        <p>Loading missed-dose alerts...</p>
      </div>
    );
  }

  return (
    <div className="admin-missed-dose-alert">
      <div className="admin-missed-dose-header">
        <div>
          <h2>Missed Dose Alerts</h2>
          <p>
            Patients with overdue vaccination doses.
          </p>
        </div>

        <span className="missed-dose-alert-badge">
          {patients.length}
        </span>
      </div>

      {error && (
        <div className="notification-error">
          {error}
        </div>
      )}

      {success && (
        <div className="notification-success">
          {success}
        </div>
      )}

      {patients.length === 0 ? (
        <div className="admin-missed-dose-empty">
          <span>✓</span>
          <p>No missed-dose alerts.</p>
        </div>
      ) : (
        <div className="admin-missed-dose-list">
          {patients.map((patient) => (
            <div
              key={patient.patient_id}
              className="admin-missed-dose-item"
            >
              <div>
                <strong>
                  {patient.first_name}{" "}
                  {patient.last_name}
                </strong>

                <p>
                  Patient ID: {patient.patient_id}
                </p>

                <div className="missed-dose-details">
                  {patient.missed_doses.map(
                    (dose, index) => (
                      <div
                        key={`${dose.vaccine_id}-${dose.dose_number}-${index}`}
                        className="missed-dose-detail"
                      >
                        <strong>
                          {dose.vaccine_name}
                        </strong>

                        <span>
                          Dose {dose.dose_number}
                        </span>

                        <span>
                          {dose.days_overdue} days overdue
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                className="admin-message-button"
                onClick={() =>
                  openMessageForm(patient)
                }
              >
                Send Message
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <div className="notification-modal-header">
              <div>
                <h2>Send Message</h2>

                <p>
                  Send a notification to{" "}
                  <strong>
                    {selectedPatient.first_name}{" "}
                    {selectedPatient.last_name}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="notification-modal-close"
                onClick={closeMessageForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSendMessage}>
              <label htmlFor="notification-message">
                Message
              </label>

              <textarea
                id="notification-message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                rows="6"
                placeholder="Enter message for the patient..."
                required
              />

              <div className="notification-modal-actions">
                <button
                  type="button"
                  className="notification-cancel-button"
                  onClick={closeMessageForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="notification-send-button"
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMissedDoseAlert;