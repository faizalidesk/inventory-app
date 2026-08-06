import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Indikator kekuatan password
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "#334155" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Lemah", color: "#ef4444", text: "#f87171" };
      case 2:
        return { score: 50, label: "Sedang", color: "#f59e0b", text: "#fbbf24" };
      case 3:
        return { score: 75, label: "Baik", color: "#3b82f6", text: "#60a5fa" };
      case 4:
        return { score: 100, label: "Sangat Kuat", color: "#10b981", text: "#34d399" };
      default:
        return { score: 0, label: "", color: "#334155", text: "#94a3b8" };
    }
  };

  const passStrength = getPasswordStrength(form.password);

  async function register(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <div className="register-wrapper">
      {/* ==================== INTERNAL CSS STYLES ==================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .register-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #020617;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 20px;
          box-sizing: border-box;
          overflow: hidden;
          color: #f8fafc;
        }

        /* Background Glowing Blobs */
        .blob-1 {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 350px;
          height: 350px;
          background: rgba(79, 70, 229, 0.25);
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .blob-2 {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 350px;
          height: 350px;
          background: rgba(147, 51, 234, 0.25);
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        /* Container Card Utama */
        .register-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(51, 65, 85, 0.7);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .register-card {
            flex-direction: row;
          }
        }

        /* Hero Panel Kiri (Desktop) */
        .hero-panel {
          display: none;
          flex: 5;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7e22ce 100%);
          padding: 40px;
          color: #ffffff;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        @media (min-width: 768px) {
          .hero-panel {
            display: flex;
          }
        }

        .hero-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-logo {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 20px;
        }

        .hero-title {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 16px;
        }

        .hero-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8px;
          line-height: 1.5;
        }

        .feature-list {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Section Form Kanan */
        .form-section {
          flex: 7;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .form-header p {
          font-size: 14px;
          color: #94a3b8;
          margin: 6px 0 24px 0;
        }

        /* Alert Error */
        .alert-error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        /* Group Input Form */
        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #cbd5e1;
          margin-bottom: 6px;
        }

        .input-container {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #64748b;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .toggle-btn:hover {
          color: #cbd5e1;
        }

        /* Password Strength Bar */
        .strength-bar-bg {
          height: 6px;
          width: 100%;
          background: #1e293b;
          border-radius: 99px;
          overflow: hidden;
          margin-top: 8px;
        }

        .strength-bar-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-text {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-top: 4px;
        }

        /* Submit Button */
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .btn-submit:hover:not(:disabled) {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Link Login */
        .login-redirect {
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
          margin-top: 20px;
        }

        .login-btn-link {
          background: none;
          border: none;
          color: #818cf8;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 14px;
        }

        .login-btn-link:hover {
          color: #a5b4fc;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Ambient Blobs */}
      <div className="blob-1" />
      <div className="blob-2" />

      {/* Main Card */}
      <div className="register-card">
        
        {/* Panel Kiri (Desktop Only) */}
        <div className="hero-panel">
          <div>
            <div className="hero-header">
              <div className="hero-logo">✨</div>
              <span style={{ fontWeight: 700, fontSize: 18 }}>AppLogo</span>
            </div>

            <div style={{ marginTop: 32 }}>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>
                🔒 Registrasi Cepat & Aman
              </span>
              <h2 className="hero-title">Mulai perjalanan Anda bersama kami.</h2>
              <p className="hero-desc">
                Bergabunglah dengan ribuan pengguna lainnya dan nikmati akses penuh fitur aplikasi kami.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Akses penuh ke fitur dasar
                </div>
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Keamanan data terenkripsi
                </div>
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Layanan dukungan 24/7
                </div>
              </div>
            </div>
          </div>

          <span style={{ fontSize: 12, opacity: 0.6 }}>
            © {new Date().getFullYear()} AppName. All rights reserved.
          </span>
        </div>

        {/* Panel Form Kanan */}
        <div className="form-section">
          <div className="form-header">
            <h1>Buat akun baru ✨</h1>
            <p>Daftar hanya dalam beberapa detik untuk mulai</p>
          </div>

          {error && (
            <div className="alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={register}>
            {/* Input: Nama */}
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={change}
                  placeholder="Contoh: Alex Ferguson"
                  className="form-input"
                />
              </div>
            </div>

            {/* Input: Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  placeholder="nama@email.com"
                  className="form-input"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={change}
                  placeholder="Minimal 6 karakter"
                  className="form-input"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-btn"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Strength */}
              {form.password && (
                <div>
                  <div className="strength-bar-bg">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${passStrength.score}%`,
                        backgroundColor: passStrength.color,
                      }}
                    />
                  </div>
                  <div className="strength-text">
                    <span style={{ color: '#94a3b8' }}>Kekuatan password:</span>
                    <span style={{ color: passStrength.text, fontWeight: 600 }}>
                      {passStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Register Sekarang →</span>
              )}
            </button>

            {/* Link Login */}
            <p className="login-redirect">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="login-btn-link"
              >
                Masuk
              </button>
            </p>
          </form>

        </div>

      </div>
    </div>
  );
}