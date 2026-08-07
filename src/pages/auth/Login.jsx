import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabase";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate("/dashboard");
  }

  async function loginGoogle() {
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

    if (authError) setError(authError.message);
  }

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title="Sign in to your space."
      description="Continue exploring ideas, notes, and works in progress."
    >
      {error && <div className="auth-alert" role="alert"><span>!</span><span>{error}</span></div>}

      <form className="auth-form" onSubmit={login}>
        <div className="auth-field">
          <label htmlFor="login-email">Email address</label>
          <div className="auth-input-shell">
            <FaEnvelope />
            <input
              id="login-email"
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-shell">
            <FaLock />
            <input
              id="login-password"
              className="auth-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-check"><input type="checkbox" /> Keep me signed in</label>
          <a href="mailto:hello@desktopalie.my.id?subject=Password reset">Forgot password?</a>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? <><span className="auth-spinner" /> Signing in...</> : "Sign in →"}
        </button>
      </form>

      <div className="auth-divider">or continue with</div>
      <button className="auth-google" type="button" onClick={loginGoogle}>
        <FcGoogle size={17} /> Google
      </button>

      <p className="auth-switch">New to Desktopalie? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
