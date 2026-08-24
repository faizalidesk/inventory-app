import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
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
import { PlatformProvider } from "./context/PlatformContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  const [isMaintenance, setIsMaintenance] = useState(() => {
    const localData = localStorage.getItem("desktopalie_maintenance_settings");
    if (localData) {
      try {
        const val = JSON.parse(localData);
        return val?.is_enabled === true || val?.is_enabled === "true" || val?.is_enabled === 1;
      } catch (e) {}
    }
    return false;
  });

  useEffect(() => {
    // Enforce tab bar favicon to Desktopalie.jpg
    const updateFavicons = () => {
      const links = document.querySelectorAll("link[rel*='icon']");
      links.forEach((l) => {
        l.href = "/Desktopalie.jpg";
      });
      if (links.length === 0) {
        const link = document.createElement("link");
        link.rel = "shortcut icon";
        link.href = "/Desktopalie.jpg";
        document.head.appendChild(link);
      }
    };
    updateFavicons();

    async function checkMaintenance() {
      try {
        const settings = await fetchMaintenanceSettings();
        if (settings) {
          const val = typeof settings === "string" ? JSON.parse(settings) : settings;
          const active = val?.is_enabled === true || val?.is_enabled === "true" || val?.is_enabled === 1;
          setIsMaintenance(active);
        } else {
          setIsMaintenance(false);
        }
      } catch (err) {
        console.error("Error loading maintenance settings:", err);
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
            const rawVal = payload.new.value;
            const val = typeof rawVal === "string" ? JSON.parse(rawVal) : rawVal;
            const active = val?.is_enabled === true || val?.is_enabled === "true" || val?.is_enabled === 1;
            setIsMaintenance(active);
          }
        }
      )
      .subscribe();

    // Listen to storage events for local tab sync
    const handleStorageChange = () => {
      const localData = localStorage.getItem("desktopalie_maintenance_settings");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          const active = parsed?.is_enabled === true || parsed?.is_enabled === "true" || parsed?.is_enabled === 1;
          setIsMaintenance(active);
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // IF MAINTENANCE MODE IS ENABLED FROM BACKOFFICE -> LOCK ALL ROUTES TOTALLY (INCLUDING /login & /register)
  if (isMaintenance) {
    return (
      <ThemeProvider>
        <PlatformProvider>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<MaintenancePage />} />
            </Routes>
          </BrowserRouter>
        </PlatformProvider>
      </ThemeProvider>
    );
  }

  // NORMAL ROUTING WHEN MAINTENANCE IS OFF
  return (
    <ThemeProvider>
      <PlatformProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landingpage" element={<Navigate to="/" replace />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
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
      </PlatformProvider>
    </ThemeProvider>
  );
}
