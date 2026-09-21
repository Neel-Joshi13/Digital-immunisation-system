import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import PatientHome from "./pages/PatientHome";
import WorkerHome from "./pages/WorkerHome";
import AdminHome from "./pages/AdminHome";
import AdminUsers from "./pages/AdminUsers";
import AdminCentres from "./pages/AdminCentres";
import AdminVaccines from "./pages/AdminVaccines";
import AdminImmunisations from "./pages/AdminImmunisations";
import AdminVaccinationSchedules from "./pages/AdminVaccinationSchedules";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminLoginHistory from "./pages/AdminLoginHistory";
import VaccineChatbot from "./pages/VaccineChatbot";
import AIAssistant from "./pages/AIAssistant";
import CertificateVerification from "./pages/CertificateVerification";
import PatientNotifications from "./pages/PatientNotifications";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientLayout from "./layouts/PatientLayout";
import WorkerLayout from "./layouts/WorkerLayout";
import VaccinationHistory from "./pages/VaccinationHistory";
import Appointments from "./pages/Appointments";
import PatientVaccinationSchedule from "./pages/PatientVaccinationSchedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/verify/:token"
          element={<CertificateVerification />}
        />

        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientHome />} />
          <Route path="profile" element={<PatientDashboard />} />
          <Route path="vaccinations" element={<VaccinationHistory />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="vaccine-assistant" element={<VaccineChatbot />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route
            path="schedule"
            element={<PatientVaccinationSchedule />}
          />
          <Route
            path="vaccination-schedule"
            element={<PatientVaccinationSchedule />}
          />
        </Route>

        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={["HEALTHCARE_WORKER"]}>
              <WorkerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WorkerHome />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/healthcare-centres"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCentres />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vaccines"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminVaccines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/immunisations"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminImmunisations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vaccination-schedules"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminVaccinationSchedules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/login-history"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLoginHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;