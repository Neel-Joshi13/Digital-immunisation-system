import { Link, Outlet } from "react-router-dom";

function WorkerLayout() {
  return (
    <div>
      <nav>
        <h2>Digital Immunisation</h2>

        <Link to="/worker">
          Dashboard
        </Link>

        {" | "}

        <Link to="/worker/patients">
          Patients
        </Link>

        {" | "}

        <Link to="/worker/vaccinations">
          Vaccinations
        </Link>

        {" | "}

        <Link to="/worker/appointments">
          Appointments
        </Link>
      </nav>

      <hr />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default WorkerLayout;