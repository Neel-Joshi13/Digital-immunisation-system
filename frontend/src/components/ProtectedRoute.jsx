import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyUser } from "../services/api";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const token = localStorage.getItem("access_token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMyUser();
        setUser(data);
      } catch (error) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/patient" replace />;
  }

  return children;
}

export default ProtectedRoute;