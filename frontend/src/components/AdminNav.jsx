import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <header className="admin-topbar">

      {}

      <div className="admin-brand">

        <div className="admin-brand-mark">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M24 42S9 30.9 9 18.4C9 10.8 14.1 6 20.1 6c3.4 0 6.1 1.7 7.9 4.4C29.8 7.7 32.5 6 35.9 6 41.9 6 47 10.8 47 18.4 47 30.9 32 42 24 42Z"
              fill="currentColor"
              transform="translate(-4 0)"
            />

            <path
              d="M24 13V29"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M16 21H32"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="admin-brand-text">

          <div className="admin-brand-name">
            Digital Immunisation
          </div>

          <div className="admin-brand-subtitle">
            Digital healthcare management
          </div>

        </div>

      </div>


      {}

      <nav className="admin-nav-links">

        <Link
          to="/admin"
          className={
            location.pathname === "/admin"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Dashboard
        </Link>


        <Link
          to="/admin/users"
          className={
            location.pathname === "/admin/users"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Users
        </Link>


        <Link
          to="/admin/healthcare-centres"
          className={
            location.pathname === "/admin/healthcare-centres"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Healthcare Centres
        </Link>


        <Link
          to="/admin/vaccines"
          className={
            location.pathname === "/admin/vaccines"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Vaccines
        </Link>


        <Link
          to="/admin/immunisations"
          className={
            location.pathname === "/admin/immunisations"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Immunisations
        </Link>


        <Link
          to="/admin/vaccination-schedules"
          className={
            location.pathname === "/admin/vaccination-schedules"
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Vaccination Schedule
        </Link>


        {/* Logout */}

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </header>
  );
}

export default AdminNav;
