import { useEffect, useState } from "react";


import {
  getUsers,
  createUser,
} from "../services/api";

import AdminNav from "../components/AdminNav";
import "../styles/admin-users.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await createUser(
        email,
        password,
        "PATIENT"
      );

      setMessage(
        "Patient account created successfully."
      );

      setEmail("");
      setPassword("");

      await loadUsers();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <h1>User Management</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    {user.is_active
                      ? "Yes"
                      : "No"}
                  </td>

                  <td>{user.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr />

        <h2>Create Patient Account</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <br />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="patient@example.com"
              required
            />
          </div>

          <br />

          <div>
            <label>Password</label>
            <br />

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
            />
          </div>

          <br />

          <p>
            Role: <strong>PATIENT</strong>
          </p>

          <button type="submit">
            Create Patient Account
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminUsers;