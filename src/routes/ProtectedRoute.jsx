// src/routes/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLodaing } = useAuth();

  // show spinner
  if (isLodaing) {
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p>Redirecting...</p>
      </div>
    </div>;
  }

  // not logged in go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // logged in render the protected page
  return children;
}
