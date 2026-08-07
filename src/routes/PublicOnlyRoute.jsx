import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="route-loading" aria-live="polite">Verifying your session…</main>;
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
