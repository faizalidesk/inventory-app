import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import DesktopalieMark from "../component/DesktopalieMark";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="studio-loading-screen" aria-live="polite">
        <div className="studio-loading-box">
          <DesktopalieMark className="studio-loading-mark" />
          <span>Verifying session...</span>
        </div>
      </main>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
