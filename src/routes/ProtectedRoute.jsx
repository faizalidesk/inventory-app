import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="route-loading" aria-live="polite">Verifying your session…</main>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
