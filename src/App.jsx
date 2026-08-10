import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MaintenancePage from "./pages/MaintenancePage";
import { ExperimentsPage, ProjectDetailPage, ProjectsPage, PublicInfoPage } from "./pages/PublicPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { CheckEmail, ForgotPassword, ResetPassword } from "./pages/auth/AuthRecovery";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { fetchMaintenanceSettings } from "./services/workspaceService";
import { supabase } from "./lib/supabase";

export default function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const settings = await fetchMaintenanceSettings();
        if (settings) {
          setIsMaintenance(!!settings.is_enabled);
        }
      } catch (err) {
        console.error("Error loading maintenance settings:", err);
      } finally {
        setLoading(false);
      }
    }

    checkMaintenance();

    // Listen to Supabase Realtime changes on site_settings table
    const channel = supabase
      .channel("app_site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          if (payload.new && payload.new.key === "maintenance") {
            setIsMaintenance(!!payload.new.value?.is_enabled);
          }
        }
      )
      .subscribe();

    // Listen to storage events for local testing
    const handleStorageChange = () => {
      const localData = localStorage.getItem("desktopalie_maintenance_settings");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setIsMaintenance(!!parsed.is_enabled);
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0B0F17",
        color: "#9CA3AF",
        fontFamily: "sans-serif"
      }}>
        Loading Desktopalie...
      </div>
    );
  }

  // IF MAINTENANCE MODE IS ENABLED FROM BACKOFFICE
  if (isMaintenance) {
    const publicRoutes = [
      "/",
      "/landing",
      "/landingpage",
      "/projects",
      "/projects/:slug",
      "/experiments",
      "/about",
      "/services",
      "/contact",
    ];

    return (
      <BrowserRouter>
        <Routes>
          {/* Public pages display MaintenancePage */}
          {publicRoutes.map((path) => (
            <Route key={path} path={path} element={<MaintenancePage />} />
          ))}

          {/* Admin routes remain accessible so admins can log in & manage Backoffice */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // NORMAL ROUTING WHEN MAINTENANCE IS OFF
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<Navigate to="/" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/about" element={<PublicInfoPage type="about" />} />
        <Route path="/services" element={<PublicInfoPage type="services" />} />
        <Route path="/contact" element={<PublicInfoPage type="contact" />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/check-email" element={<PublicOnlyRoute><CheckEmail /></PublicOnlyRoute>} />
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
