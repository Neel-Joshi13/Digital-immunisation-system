import { useEffect, useState } from "react";

import { getAuditLogs } from "../services/api";

import AdminNav from "../components/AdminNav";
import "../styles/audit-logs.css";

function AdminAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState("");

  async function loadAuditLogs() {
    try {
      setError("");
      const data = await getAuditLogs();
      setAuditLogs(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadAuditLogs();
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

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="audit-logs-header">
          <div>
            <h1>Audit Logs</h1>
            <p>
              View recorded administrative actions in the system.
            </p>
          </div>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {auditLogs.length === 0 && !error ? (
          <p>No audit logs found.</p>
        ) : (
          <div className="audit-logs-table-wrapper">
            <table className="audit-logs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Target Type</th>
                  <th>Target ID</th>
                  <th>Details</th>
                  <th>Date / Time</th>
                </tr>
              </thead>

              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user_id ?? "-"}</td>
                    <td>{log.action}</td>
                    <td>{log.target_type ?? "-"}</td>
                    <td>{log.target_id ?? "-"}</td>
                    <td>{log.details ?? "-"}</td>
                    <td>{formatDateTime(log.created_at)}</td>
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

export default AdminAuditLogs;