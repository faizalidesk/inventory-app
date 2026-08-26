import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAt, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import AuthLayout from "./AuthLayout";

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "Not entered", color: "var(--line)" };

  let level = 0;
  if (password.length >= 6) level += 1;
  if (password.length >= 10) level += 1;
  if (/[0-9]/.test(password)) level += 1;
  if (/[^A-Za-z0-9]/.test(password)) level += 1;

  const strengths = [
    { label: "Too short", color: "var(--danger)" },
    { label: "Weak", color: "#ff8d6b" },
    { label: "Fair", color: "#e6b85c" },
    { label: "Good", color: "var(--accent)" },
    { label: "Strong", color: "var(--accent2)" },
  ];

  return { level, ...strengths[level] };
}

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const strength = getPasswordStrength(form.password);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function register(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please complete every field before continuing.");
      return;
    }

    if (form.password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    const cleanUsername = (form.username.trim() || form.email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.name.trim(),
          username: cleanUsername,
        },
      },
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // Save/Sync profile record in 'profiles' table
    if (authData?.user) {
      try {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: form.name.trim(),
          username: cleanUsername,
          bio: "Independent designer & developer",
          location: "Indonesia",
          created_at: new Date().toISOString(),
        });
      } catch (profileErr) {
        console.warn("Could not insert profile record:", profileErr);
      }
    }

    setLoading(false);
    navigate("/check-email");
  }

  return (
    <AuthLayout
      eyebrow="JOIN THE STUDIO"
      title="Create your account."
      description="Get access to your personal Desktopalie creative workspace."
    >
      {error && <div className="auth-alert" role="alert"><span>!</span><span>{error}</span></div>}

      <form className="auth-form" onSubmit={register}>
        <div className="auth-field">
          <label htmlFor="register-name">Full name</label>
          <div className="auth-input-shell">
            <FaUser />
            <input
              id="register-name"
              className="auth-input"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={updateField}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-username">Username</label>
          <div className="auth-input-shell">
            <FaAt />
            <input
              id="register-username"
              className="auth-input"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="username (e.g. desktopalie)"
              value={form.username}
              onChange={updateField}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email address</label>
          <div className="auth-input-shell">
            <FaEnvelope />
            <input
              id="register-email"
              className="auth-input"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-password">Password</label>
          <div className="auth-input-shell">
            <FaLock />
            <input
              id="register-password"
              className="auth-input"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={updateField}
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
          {form.password && (
            <div style={{ "--strength-color": strength.color }}>
              <div className="password-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((level) => <span className={level <= strength.level ? "active" : ""} key={level} />)}
              </div>
              <div className="password-copy"><span>Password strength</span><strong>{strength.label}</strong></div>
            </div>
          )}
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? <><span className="auth-spinner" /> Creating account...</> : "Create account →"}
        </button>
      </form>

      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}
