import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaBan } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { setRememberSession, supabase } from "../../lib/supabase";
import { fetchLandingPageSettings } from "../../services/workspaceService";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSessionState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allowLogin, setAllowLogin] = useState(() => {
    try {
      const local = localStorage.getItem("desktopalie_landing_settings");
      if (local) {
        const parsed = JSON.parse(local);
        return parsed.allow_login !== false;
      }
    } catch (e) {}
    return true;
  });
  const [disabledMessage, setDisabledMessage] = useState(() => {
    try {
      const local = localStorage.getItem("desktopalie_landing_settings");
      if (local) {
        const parsed = JSON.parse(local);
        return parsed.login_disabled_message || "";
      }
    } catch (e) {}
    return "";
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuthSettings() {
      try {
        const data = await fetchLandingPageSettings();
        if (data) {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          if (parsed.allow_login !== undefined) {
            setAllowLogin(parsed.allow_login !== false);
          }
          if (parsed.login_disabled_message) {
            setDisabledMessage(parsed.login_disabled_message);
          }
        }
      } catch (e) {}
    }
    checkAuthSettings();
  }, []);

  function getSafeDestination() {
    const requestedLocation = location.state?.from;
    if (!requestedLocation?.pathname?.startsWith("/dashboard")) return "/dashboard";
    return `${requestedLocation.pathname}${requestedLocation.search || ""}`;
  }

  async function syncProfile(user) {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        // Automatically create a profile row if it doesn't exist yet
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
        const username = user.user_metadata?.username || user.email?.split("@")[0];
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: name,
          username: username,
          bio: "Independent designer & developer",
          location: "Indonesia",
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Error syncing user profile on login:", err);
    }
  }

  async function login(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setRememberSession(rememberSession);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError || !data.session) {
      setLoading(false);
      setError("Unable to sign in. Check your credentials and try again.");
      return;
    }

    // Sync profile in 'profiles' table
    await syncProfile(data.user);

    setLoading(false);
    navigate(getSafeDestination(), { replace: true });
  }

  async function loginGoogle() {
    setError("");
    setRememberSession(rememberSession);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: "select_account" },
      },
    });

    if (authError) {
      setLoading(false);
      setError("Google sign-in could not be started. Please try again.");
    }
  }

  if (!allowLogin) {
    return (
      <AuthLayout 
        eyebrow="AUTHENTICATION ACCESS" 
        title="Akses Login Ditutup." 
        description="Akses autentikasi pengguna saat ini sedang dinonaktifkan oleh administrator."
      >
        <div 
          className="auth-alert" 
          style={{ 
            background: "rgba(239, 68, 68, 0.08)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            color: "var(--danger, #ef4444)",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "1rem",
            borderRadius: "10px",
            fontSize: "0.85rem",
            lineHeight: "1.5"
          }}
        >
          <FaLock style={{ fontSize: "1.1rem", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <strong>Login Dinonaktifkan:</strong>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-subtle, #94a3b8)" }}>
              {disabledMessage || "Akses login dan autentikasi pengguna sedang dinonaktifkan sementara oleh administrator."}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link 
            to="/" 
            className="auth-submit" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center", 
              textDecoration: "none",
              fontWeight: "bold",
              gap: "8px"
            }}
          >
            <span>← Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="WELCOME BACK" title="Sign in to your space." description="Continue exploring ideas, notes, and works in progress.">
      {error && <div className="auth-alert" role="alert"><span>!</span><span>{error}</span></div>}

      <form className="auth-form" onSubmit={login}>
        <div className="auth-field">
          <label htmlFor="login-email">Email address</label>
          <div className="auth-input-shell">
            <FaEnvelope />
            <input id="login-email" className="auth-input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-shell">
            <FaLock />
            <input id="login-password" className="auth-input" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
            <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" checked={rememberSession} onChange={(event) => setRememberSessionState(event.target.checked)} />
            Keep me signed in
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? <><span className="auth-spinner" /> Signing in...</> : "Sign in →"}
        </button>
      </form>

      <div className="auth-divider">or continue with</div>
      <button className="auth-google" type="button" onClick={loginGoogle} disabled={loading}>
        <FcGoogle size={17} /> Google
      </button>

      <p className="auth-switch">New to Desktopalie? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
