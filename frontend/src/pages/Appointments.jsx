import { useEffect, useState } from "react";

import {
  getMyAppointments,
  getCentres,
  createAppointment,
} from "../services/api";

import "../styles/appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [centres, setCentres] = useState([]);

  const [centreId, setCentreId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAppointments() {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function loadCentres() {
    try {
      const data = await getCentres();
      setCentres(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadAppointments();
    loadCentres();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await createAppointment(
        centreId,
        appointmentDate,
        appointmentTime,
        reason
      );

      setMessage("Appointment booked successfully.");

      setCentreId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="appointments-page">

      <div className="appointments-header">

        <div className="appointments-header-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="3" />

            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />

            <line x1="3" y1="10" x2="21" y2="10" />

            <line x1="12" y1="14" x2="12" y2="18" />
            <line x1="10" y1="16" x2="14" y2="16" />
          </svg>
        </div>

        <div>
          <h1>My Appointments</h1>

          <p>
            Book and manage your vaccination appointments
          </p>
        </div>

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

      <div className="appointments-card">

        <div className="appointments-card-header">
          <div>
            <h2>Appointment History</h2>

            <p>
              View your scheduled and completed appointments.
            </p>
          </div>
        </div>

        {appointments.length === 0 ? (

          <div className="appointments-empty">
            <div className="appointments-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="3"
                />

                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />

                <line x1="3" y1="10" x2="21" y2="10" />

                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="10" y1="16" x2="14" y2="16" />
              </svg>
            </div>

            <h3>No appointments found</h3>

            <p>
              You do not have any vaccination appointments yet.
            </p>
          </div>

        ) : (

          <div className="appointments-table-wrapper">

            <table className="appointments-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Centre</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map((appointment) => {

                  const status =
                    appointment.status || "N/A";

                  const statusClass =
                    status.toLowerCase() === "completed"
                      ? "completed"
                      : status.toLowerCase() === "scheduled"
                      ? "scheduled"
                      : "default";

                  return (
                    <tr key={appointment.id}>

                      <td>
                        <span className="appointment-date">
                          {appointment.appointment_date}
                        </span>
                      </td>

                      <td>
                        {appointment.appointment_time}
                      </td>

                      <td>
                        {appointment.centre?.name ||
                          appointment.centre_name ||
                          appointment.centre_id}
                      </td>

                      <td>
                        {appointment.reason || "N/A"}
                      </td>

                      <td>
                        <span
                          className={`appointment-status ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      <div className="book-appointment-card">

        <div className="book-appointment-header">

          <div className="book-appointment-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="3"
              />

              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />

              <line x1="3" y1="10" x2="21" y2="10" />

              <line x1="12" y1="14" x2="12" y2="18" />
              <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
          </div>

          <div>
            <h2>Book an Appointment</h2>

            <p>
              Schedule your next vaccination appointment.
            </p>
          </div>

        </div>

        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >

          <div className="appointment-form-grid">

            <div className="appointment-field appointment-field-full">

              <label htmlFor="centre">
                Healthcare Centre
              </label>

              <select
                id="centre"
                value={centreId}
                onChange={(event) =>
                  setCentreId(event.target.value)
                }
                required
              >
                <option value="">
                  Select a healthcare centre
                </option>

                {centres.map((centre) => (
                  <option
                    key={centre.id}
                    value={centre.id}
                  >
                    {centre.name}
                  </option>
                ))}
              </select>

            </div>

            <div className="appointment-field">

              <label htmlFor="appointment-date">
                Date
              </label>

              <input
                id="appointment-date"
                type="date"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(event.target.value)
                }
                required
              />

            </div>

            <div className="appointment-field">

              <label htmlFor="appointment-time">
                Time
              </label>

              <input
                id="appointment-time"
                type="time"
                value={appointmentTime}
                onChange={(event) =>
                  setAppointmentTime(event.target.value)
                }
                required
              />

            </div>

            <div className="appointment-field appointment-field-full">

              <label htmlFor="reason">
                Reason
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Reason for appointment"
                required
              />

            </div>

          </div>

          <div className="appointment-form-footer">

            <button
              type="submit"
              className="book-appointment-button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>

              Book Appointment
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Appointments;