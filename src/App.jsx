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

// Set to true to lock the entire site under maintenance mode
const IS_MAINTENANCE = true;

function App() {
  if (IS_MAINTENANCE) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return <BrowserRouter><Routes>
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
  </Routes></BrowserRouter>;
}
export default App;
