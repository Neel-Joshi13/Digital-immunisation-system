import { useEffect, useState } from "react";

import AdminNav from "../components/AdminNav";

import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../services/api";

import "../styles/admin.css";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAppointments() {
    try {
      setError("");

      const data = await getAllAppointments();

      setAppointments(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  function getStatusClass(status) {
    const normalizedStatus =
      status?.toLowerCase();

    if (normalizedStatus === "scheduled") {
      return "scheduled";
    }

    if (
      normalizedStatus ===
      "vaccination_done"
    ) {
      return "completed";
    }

    if (normalizedStatus === "cancelled") {
      return "cancelled";
    }

    if (normalizedStatus === "missed") {
      return "missed";
    }

    return "default";
  }

  function getStatusLabel(status) {
    if (status === "VACCINATION_DONE") {
      return "VACCINATION DONE";
    }

    return status;
  }

  async function handleStatusChange(
    appointment,
    status
  ) {
    setMessage("");
    setError("");

    let statusReason = "";

    if (status === "CANCELLED") {
      statusReason = window.prompt(
        "Enter the reason for cancellation:"
      );

      if (
        statusReason === null ||
        !statusReason.trim()
      ) {
        return;
      }
    }

    try {
      await updateAppointmentStatus(
        appointment.id,
        status,
        statusReason
      );

      setMessage(
        `Appointment #${appointment.id} updated successfully.`
      );

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-header">
          <h1>Appointment Management</h1>

          <p>
            View and manage patient vaccination
            appointments.
          </p>
        </div>

        {message && (
          <div className="appointments-success">
            {message}
          </div>
        )}

        {error && (
          <div className="appointments-error">
            {error}
          </div>
        )}

        <section className="admin-section">
          <h2>Patient Appointments</h2>

          {appointments.length === 0 ? (
            <div className="admin-card">
              <p>No appointments found.</p>
            </div>
          ) : (
            <div className="appointments-table-wrapper">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Vaccine</th>
                    <th>Centre</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Status Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(
                    (appointment) => {
                      const status =
                        appointment.status ||
                        "N/A";

                      const statusClass =
                        getStatusClass(status);

                      return (
                        <tr
                          key={appointment.id}
                        >
                          <td>
                            {appointment.id}
                          </td>

                          <td>
                            {appointment.patient_name ||
                              "N/A"}
                          </td>

                          <td>
                            {appointment.vaccine_name ||
                              "N/A"}
                          </td>

                          <td>
                            {appointment.centre_name ||
                              appointment.centre_id}
                          </td>

                          <td>
                            {
                              appointment.appointment_date
                            }
                          </td>

                          <td>
                            {
                              appointment.appointment_time
                            }
                          </td>

                          <td>
                            {appointment.reason ||
                              "N/A"}
                          </td>

                          <td>
                            <span
                              className={`appointment-status ${statusClass}`}
                            >
                              {getStatusLabel(
                                status
                              )}
                            </span>
                          </td>

                          <td>
                            {appointment.status_reason ||
                              "N/A"}
                          </td>

                          <td>
                            {status ===
                              "SCHEDULED" && (
                              <div className="appointment-actions">
                                <button
                                  type="button"
                                  className="appointment-reschedule-button"
                                  onClick={() =>
                                    handleStatusChange(
                                      appointment,
                                      "VACCINATION_DONE"
                                    )
                                  }
                                >
                                  Mark Done
                                </button>

                                <button
                                  type="button"
                                  className="appointment-cancel-button"
                                  onClick={() =>
                                    handleStatusChange(
                                      appointment,
                                      "CANCELLED"
                                    )
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            {status ===
                              "MISSED" && (
                              <span>
                                No action
                              </span>
                            )}

                            {status ===
                              "VACCINATION_DONE" && (
                              <span>
                                Completed
                              </span>
                            )}

                            {status ===
                              "CANCELLED" && (
                              <span>
                                Cancelled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminAppointments;