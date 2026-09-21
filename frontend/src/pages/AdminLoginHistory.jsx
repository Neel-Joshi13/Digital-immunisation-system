import { useEffect, useState } from "react";

import { getLoginHistory } from "../services/api";

import AdminNav from "../components/AdminNav";
import "../styles/login-history.css";

function AdminLoginHistory() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [error, setError] = useState("");

  async function loadLoginHistory() {
    try {
      setError("");
      const data = await getLoginHistory();
      setLoginHistory(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadLoginHistory();
  }, []);

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  function getEventClass(eventType) {
    if (eventType === "LOGIN_SUCCESS") {
      return "login-history-success";
    }

    if (eventType === "LOGIN_FAILED") {
      return "login-history-failed";
    }

    if (eventType === "LOGOUT") {
      return "login-history-logout";
    }

    return "";
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="login-history-header">
          <div>
            <h1>Login History</h1>
            <p>
              View login and account security activity for users.
            </p>
          </div>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {loginHistory.length === 0 && !error ? (
          <p>No login history found.</p>
        ) : (
          <div className="login-history-table-wrapper">
            <table className="login-history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Date / Time</th>
                  <th>IP Address</th>
                  <th>Browser / Device</th>
                </tr>
              </thead>

              <tbody>
                {loginHistory.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>

                    <td>
                      <div className="login-history-user">
                        <strong>{record.email}</strong>
                        <span>
                          User ID: {record.user_id ?? "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`login-history-event ${getEventClass(
                          record.event_type
                        )}`}
                      >
                        {record.event_type}
                      </span>
                    </td>

                    <td>
                      {formatDateTime(record.created_at)}
                    </td>

                    <td>
                      {record.ip_address ?? "-"}
                    </td>

                    <td className="login-history-user-agent">
                      {record.user_agent ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminLoginHistory;