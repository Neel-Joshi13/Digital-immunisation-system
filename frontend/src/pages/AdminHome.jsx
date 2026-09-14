import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import AdminMissedDoseAlert from "../components/AdminMissedDoseAlert";
import "../styles/admin.css";

function AdminHome() {
  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>

          <p>
            Welcome to the Digital Immunisation
            administration dashboard.
          </p>
        </div>

        <AdminMissedDoseAlert />

        <section className="admin-section">
          <h2>Administration</h2>

          <div className="admin-cards">
            <Link
              to="/admin/users"
              className="admin-card"
            >
              <h3>User Management</h3>

              <p>
                Manage system users and their roles.
              </p>
            </Link>

            <Link
              to="/admin/healthcare-centres"
              className="admin-card"
            >
              <h3>Healthcare Centres</h3>

              <p>
                Manage registered healthcare centres.
              </p>
            </Link>

            <Link
              to="/admin/vaccines"
              className="admin-card"
            >
              <h3>Vaccine Management</h3>

              <p>
                Manage available vaccines.
              </p>
            </Link>

            <Link
              to="/admin/immunisations"
              className="admin-card"
            >
              <h3>Immunisation Records</h3>

              <p>
                Manage patient immunisation records.
              </p>
            </Link>

            <Link
              to="/admin/vaccination-schedules"
              className="admin-card"
            >
              <h3>Vaccination Schedule</h3>

              <p>
                Manage vaccine dose schedules,
                recommended ages, intervals, and
                official sources.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminHome;