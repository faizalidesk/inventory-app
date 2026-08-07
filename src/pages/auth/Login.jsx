import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { setRememberSession, supabase } from "../../lib/supabase";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSessionState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
