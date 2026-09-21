import { useEffect, useState } from "react";

import {
  getMyAppointments,
  getCentres,
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

import "../styles/appointments.css";

function Appointments() {
  const { language } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [centres, setCentres] = useState([]);

  const [centreId, setCentreId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const text = {
    en: {
      title: "My Appointments",
      subtitle:
        "Book and manage your vaccination appointments",
      success: "Appointment booked successfully.",
      history: "Appointment History",
      historyDescription:
        "View your scheduled and completed appointments.",
      noAppointments: "No appointments found",
      noAppointmentsDescription:
        "You do not have any vaccination appointments yet.",
      date: "Date",
      time: "Time",
      centre: "Centre",
      reason: "Reason",
      status: "Status",
      action: "Action",
      scheduled: "SCHEDULED",
      completed: "COMPLETED",
      cancelled: "CANCELLED",
      missed: "MISSED",
      bookTitle: "Book an Appointment",
      bookDescription:
        "Schedule your next vaccination appointment.",
      healthcareCentre: "Healthcare Centre",
      selectCentre: "Select a healthcare centre",
      appointmentReason: "Reason",
      reasonPlaceholder: "Reason for appointment",
      bookAppointment: "Book Appointment",
      notAvailable: "N/A",
      cancel: "Cancel",
      reschedule: "Reschedule",
      saveReschedule: "Save Changes",
      cancelReschedule: "Cancel",
      cancelConfirmation:
        "Are you sure you want to cancel this appointment?",
      cancelledSuccess:
        "Appointment cancelled successfully.",
      rescheduledSuccess:
        "Appointment rescheduled successfully.",
    },

    hi: {
      title: "मेरे अपॉइंटमेंट",
      subtitle:
        "अपने टीकाकरण अपॉइंटमेंट बुक और प्रबंधित करें",
      success: "अपॉइंटमेंट सफलतापूर्वक बुक किया गया।",
      history: "अपॉइंटमेंट इतिहास",
      historyDescription:
        "अपने निर्धारित और पूरे किए गए अपॉइंटमेंट देखें।",
      noAppointments: "कोई अपॉइंटमेंट नहीं मिला",
      noAppointmentsDescription:
        "आपके पास अभी कोई टीकाकरण अपॉइंटमेंट नहीं है।",
      date: "तारीख",
      time: "समय",
      centre: "केंद्र",
      reason: "कारण",
      status: "स्थिति",
      action: "कार्रवाई",
      scheduled: "निर्धारित",
      completed: "पूरा हुआ",
      cancelled: "रद्द",
      missed: "छूट गया",
      bookTitle: "अपॉइंटमेंट बुक करें",
      bookDescription:
        "अपना अगला टीकाकरण अपॉइंटमेंट निर्धारित करें।",
      healthcareCentre: "स्वास्थ्य केंद्र",
      selectCentre: "स्वास्थ्य केंद्र चुनें",
      appointmentReason: "कारण",
      reasonPlaceholder: "अपॉइंटमेंट का कारण",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      notAvailable: "उपलब्ध नहीं",
      cancel: "रद्द करें",
      reschedule: "पुनर्निर्धारित करें",
      saveReschedule: "बदलाव सहेजें",
      cancelReschedule: "रद्द करें",
      cancelConfirmation:
        "क्या आप वाकई इस अपॉइंटमेंट को रद्द करना चाहते हैं?",
      cancelledSuccess:
        "अपॉइंटमेंट सफलतापूर्वक रद्द किया गया।",
      rescheduledSuccess:
        "अपॉइंटमेंट सफलतापूर्वक पुनर्निर्धारित किया गया।",
    },
  };

  const currentText = text[language];

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

      setMessage(currentText.success);

      setCentreId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleCancelAppointment(appointmentId) {
    const confirmed = window.confirm(
      currentText.cancelConfirmation
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await cancelAppointment(appointmentId);

      setMessage(
        currentText.cancelledSuccess
      );

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleStartReschedule(appointment) {
    setMessage("");
    setError("");

    setRescheduleId(appointment.id);
    setRescheduleDate(
      appointment.appointment_date
    );
    setRescheduleTime(
      appointment.appointment_time
        ? appointment.appointment_time.slice(0, 5)
        : ""
    );
  }

  function handleCancelReschedule() {
    setRescheduleId(null);
    setRescheduleDate("");
    setRescheduleTime("");
  }

  async function handleRescheduleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await rescheduleAppointment(
        rescheduleId,
        rescheduleDate,
        rescheduleTime
      );

      setMessage(
        currentText.rescheduledSuccess
      );

      handleCancelReschedule();

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  function getAppointmentStatus(appointment) {
    const storedStatus =
      appointment.status || "N/A";

    const normalizedStatus =
      storedStatus.toLowerCase();

    if (normalizedStatus === "scheduled") {
      if (
        appointment.appointment_date &&
        appointment.appointment_time
      ) {
        const appointmentDateTime = new Date(
          `${appointment.appointment_date}T${appointment.appointment_time}`
        );

        const now = new Date();

        if (
          !Number.isNaN(
            appointmentDateTime.getTime()
          ) &&
          appointmentDateTime < now
        ) {
          return "MISSED";
        }
      }
    }

    return storedStatus;
  }

  function getStatusLabel(status) {
    const normalizedStatus =
      status.toLowerCase();

    if (normalizedStatus === "scheduled") {
      return currentText.scheduled;
    }

    if (normalizedStatus === "completed") {
      return currentText.completed;
    }

    if (normalizedStatus === "cancelled") {
      return currentText.cancelled;
    }

    if (normalizedStatus === "missed") {
      return currentText.missed;
    }

    return status;
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
          <h1>{currentText.title}</h1>

          <p>
            {currentText.subtitle}
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
            <h2>{currentText.history}</h2>

            <p>
              {currentText.historyDescription}
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

            <h3>{currentText.noAppointments}</h3>

            <p>
              {currentText.noAppointmentsDescription}
            </p>

          </div>

        ) : (

          <div className="appointments-table-wrapper">

            <table className="appointments-table">

              <thead>
                <tr>
                  <th>{currentText.date}</th>
                  <th>{currentText.time}</th>
                  <th>{currentText.centre}</th>
                  <th>{currentText.reason}</th>
                  <th>{currentText.status}</th>
                  <th>{currentText.action}</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map((appointment) => {

                  const status =
                    getAppointmentStatus(appointment);

                  const statusClass =
                    status.toLowerCase() === "completed"
                      ? "completed"
                      : status.toLowerCase() === "scheduled"
                      ? "scheduled"
                      : status.toLowerCase() === "cancelled"
                      ? "cancelled"
                      : status.toLowerCase() === "missed"
                      ? "missed"
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
                        {appointment.reason ||
                          currentText.notAvailable}
                      </td>

                      <td>
                        <span
                          className={`appointment-status ${statusClass}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </td>

                      <td>

                        {status.toLowerCase() ===
                          "scheduled" && (
                          <div className="appointment-actions">

                            <button
                              type="button"
                              className="appointment-reschedule-button"
                              onClick={() =>
                                handleStartReschedule(
                                  appointment
                                )
                              }
                            >
                              {currentText.reschedule}
                            </button>

                            <button
                              type="button"
                              className="appointment-cancel-button"
                              onClick={() =>
                                handleCancelAppointment(
                                  appointment.id
                                )
                              }
                            >
                              {currentText.cancel}
                            </button>

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {rescheduleId !== null && (
        <div className="appointment-reschedule-card">

          <div className="appointment-reschedule-header">
            <h2>{currentText.reschedule}</h2>
          </div>

          <form
            className="appointment-reschedule-form"
            onSubmit={handleRescheduleSubmit}
          >

            <div className="appointment-reschedule-fields">

              <div className="appointment-field">

                <label htmlFor="reschedule-date">
                  {currentText.date}
                </label>

                <input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(event) =>
                    setRescheduleDate(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="appointment-field">

                <label htmlFor="reschedule-time">
                  {currentText.time}
                </label>

                <input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(event) =>
                    setRescheduleTime(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            <div className="appointment-reschedule-actions">

              <button
                type="button"
                className="appointment-reschedule-cancel-button"
                onClick={handleCancelReschedule}
              >
                {currentText.cancelReschedule}
              </button>

              <button
                type="submit"
                className="appointment-reschedule-save-button"
              >
                {currentText.saveReschedule}
              </button>

            </div>

          </form>

        </div>
      )}

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
            <h2>{currentText.bookTitle}</h2>

            <p>
              {currentText.bookDescription}
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
                {currentText.healthcareCentre}
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
                  {currentText.selectCentre}
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
                {currentText.date}
              </label>

              <input
                id="appointment-date"
                type="date"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="appointment-field">

              <label htmlFor="appointment-time">
                {currentText.time}
              </label>

              <input
                id="appointment-time"
                type="time"
                value={appointmentTime}
                onChange={(event) =>
                  setAppointmentTime(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="appointment-field appointment-field-full">

              <label htmlFor="reason">
                {currentText.appointmentReason}
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder={
                  currentText.reasonPlaceholder
                }
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

              {currentText.bookAppointment}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Appointments;