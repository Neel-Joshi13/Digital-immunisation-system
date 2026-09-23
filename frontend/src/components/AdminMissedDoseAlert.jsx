import { useEffect, useState } from "react";
import {
  getAllMissedDoses,
  createNotification,
  getAllAppointments,
  sendMissedVaccinationEmail,
  sendUpcomingVaccinationEmail,
} from "../services/api";

function AdminMissedDoseAlert() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setLoading(true);
      setError("");

      const [missedDoseData, appointmentData] =
        await Promise.all([
          getAllMissedDoses(),
          getAllAppointments(),
        ]);

      const now = new Date();

      const upcomingAppointments = appointmentData.filter(
        (appointment) => {
          if (appointment.status !== "SCHEDULED") {
            return false;
          }

          const appointmentDateTime = new Date(
            `${appointment.appointment_date}T${appointment.appointment_time}`
          );

          return appointmentDateTime > now;
        }
      );

      setPatients(missedDoseData);
      setAppointments(upcomingAppointments);
    } catch (err) {
      setError(
        err.message || "Failed to load vaccination alerts."
      );
    } finally {
      setLoading(false);
    }
  }

  function openMessageForm(patient) {
    setSelectedPatient(patient);

    const firstMissedDose = patient.missed_doses?.[0];

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
        err.message || "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  async function handleSendMissedEmail(patient) {
    try {
      setSendingEmail(
        `missed-${patient.patient_id}`
      );
      setError("");
      setSuccess("");

      await sendMissedVaccinationEmail(
        patient.patient_id
      );

      setSuccess(
        `Missed vaccination email sent to ${patient.first_name} ${patient.last_name}.`
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to send missed vaccination email."
      );
    } finally {
      setSendingEmail(null);
    }
  }

  async function handleSendUpcomingEmail(
    appointment
  ) {
    try {
      setSendingEmail(
        `upcoming-${appointment.id}`
      );
      setError("");
      setSuccess("");

      await sendUpcomingVaccinationEmail(
        appointment.id
      );

      setSuccess(
        `Upcoming vaccination email sent to ${appointment.patient_name}.`
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to send upcoming vaccination email."
      );
    } finally {
      setSendingEmail(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-missed-dose-alert">
        <p>Loading vaccination alerts...</p>
      </div>
    );
  }

  return (
    <div className="admin-missed-dose-alert">
      <div className="admin-missed-dose-header">
        <div>
          <h2>Vaccination Alerts</h2>

          <p>
            View missed vaccinations and upcoming
            vaccination appointments.
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

      <section>
        <div className="admin-missed-dose-header">
          <div>
            <h2>Missed Vaccinations</h2>

            <p>
              Patients with overdue vaccination
              doses.
            </p>
          </div>

          <span className="missed-dose-alert-badge">
            {patients.length}
          </span>
        </div>

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
                <div className="admin-missed-dose-info">
                  <div className="admin-missed-dose-patient">
                    <strong>
                      {patient.first_name}{" "}
                      {patient.last_name}
                    </strong>

                    <p className="admin-patient-id">
                      Patient ID:{" "}
                      {patient.patient_id}
                    </p>

                    <p className="admin-email">
                      Email:{" "}
                      {patient.email ||
                        "Email not available"}
                    </p>
                  </div>

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
                            Dose{" "}
                            {dose.dose_number}
                          </span>

                          <span>
                            {dose.reason}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="admin-missed-dose-actions">
                  <button
                    type="button"
                    className="admin-message-button"
                    onClick={() =>
                      openMessageForm(patient)
                    }
                  >
                    Send Message
                  </button>

                  <button
                    type="button"
                    className="admin-email-button"
                    onClick={() =>
                      handleSendMissedEmail(
                        patient
                      )
                    }
                    disabled={
                      sendingEmail ===
                      `missed-${patient.patient_id}`
                    }
                  >
                    {sendingEmail ===
                    `missed-${patient.patient_id}`
                      ? "Sending..."
                      : "Send Email"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-vaccination-section">
        <div className="admin-missed-dose-header">
          <div>
            <h2>Upcoming Vaccinations</h2>

            <p>
              Patients with upcoming scheduled
              vaccination appointments.
            </p>
          </div>

          <span className="missed-dose-alert-badge">
            {appointments.length}
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="admin-missed-dose-empty">
            <span>✓</span>

            <p>
              No upcoming vaccination
              appointments.
            </p>
          </div>
        ) : (
          <div className="admin-missed-dose-list">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="admin-missed-dose-item"
              >
                <div className="admin-missed-dose-info">
                  <div className="admin-missed-dose-patient">
                    <strong>
                      {appointment.patient_name}
                    </strong>

                    <p className="admin-patient-id">
                      Patient ID:{" "}
                      {appointment.patient_id}
                    </p>
                  </div>

                  <div className="missed-dose-details">
                    <div className="missed-dose-detail">
                      <strong>
                        {appointment.vaccine_name ||
                          "Vaccination"}
                      </strong>

                      <span>
                        Date:{" "}
                        {appointment.appointment_date}
                      </span>

                      <span>
                        Time:{" "}
                        {appointment.appointment_time}
                      </span>

                      <span>
                        Centre:{" "}
                        {appointment.centre_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-upcoming-actions">
                  <button
                    type="button"
                    className="admin-email-button"
                    onClick={() =>
                      handleSendUpcomingEmail(
                        appointment
                      )
                    }
                    disabled={
                      sendingEmail ===
                      `upcoming-${appointment.id}`
                    }
                  >
                    {sendingEmail ===
                    `upcoming-${appointment.id}`
                      ? "Sending..."
                      : "Send Email"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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