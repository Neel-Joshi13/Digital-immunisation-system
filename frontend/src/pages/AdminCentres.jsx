import { useEffect, useState } from "react";

import {
  getCentres,
  createHealthcareCentre,
} from "../services/api";

import AdminNav from "../components/AdminNav";

function AdminCentres() {
  const [centres, setCentres] = useState([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCentres() {
    try {
      const data = await getCentres();
      setCentres(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    loadCentres();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await createHealthcareCentre(
        name,
        address,
        phone,
        email
      );

      setMessage(
        "Healthcare centre created successfully."
      );

      setName("");
      setAddress("");
      setPhone("");
      setEmail("");

      await loadCentres();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <h1>Healthcare Centre Management</h1>

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

        <h2>Healthcare Centres</h2>

        {centres.length === 0 ? (
          <p>No healthcare centres found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {centres.map((centre) => (
                <tr key={centre.id}>
                  <td>{centre.name}</td>
                  <td>{centre.address}</td>
                  <td>{centre.phone}</td>
                  <td>{centre.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr />

        <h2>Create Healthcare Centre</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <br />

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Address</label>
            <br />

            <input
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Phone</label>
            <br />

            <input
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Email</label>
            <br />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <br />

          <button type="submit">
            Create Healthcare Centre
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminCentres;