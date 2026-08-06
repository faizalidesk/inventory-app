import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaBoxOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Login Email & Password
  async function login(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  }

  // Login Google
  async function loginGoogle() {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-wrapper">
      {/* ==================== INTERNAL CSS STYLES ==================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .login-wrapper {
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

        /* Ambient Glow Background Blobs */
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

        /* Card Container */
        .login-card {
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
          .login-card {
            flex-direction: row;
          }
        }

        /* Panel Kiri Hero (Desktop) */
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
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 20px;
          color: #f59e0b;
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

        /* Group Form Input */
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
          font-size: 15px;
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
          font-family: inherit;
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
          font-size: 15px;
        }

        .toggle-btn:hover {
          color: #cbd5e1;
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

        /* Divider "atau" */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: #64748b;
          font-size: 13px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #334155;
        }

        /* Google Button */
        .btn-google {
          width: 100%;
          padding: 12px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-google:hover {
          background: #334155;
          border-color: #475569;
        }

        /* Link Register */
        .register-redirect {
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
          margin-top: 24px;
          margin-bottom: 0;
        }

        .register-redirect a {
          color: #818cf8;
          font-weight: 600;
          text-decoration: none;
        }

        .register-redirect a:hover {
          color: #a5b4fc;
          text-decoration: underline;
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
      <div className="login-card">
        
        {/* Panel Kiri Hero (Desktop Only) */}
        <div className="hero-panel">
          <div>
            <div className="hero-header">
              <div className="hero-logo">
                <FaBoxOpen />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>Inventory</span>
            </div>

            <div style={{ marginTop: 32 }}>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>
                📦 Real-Time Stock Management
              </span>
              <h2 className="hero-title">Selamat datang kembali!</h2>
              <p className="hero-desc">
                Kelola stok barang, gudang, dan transaksi masuk/keluar secara real-time dengan mudah.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Pemantauan stok secara real-time
                </div>
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Laporan transaksi otomatis
                </div>
                <div className="feature-item">
                  <span style={{ color: '#34d399' }}>✓</span> Keamanan data terjamin
                </div>
              </div>
            </div>
          </div>

          <span style={{ fontSize: 12, opacity: 0.6 }}>
            © {new Date().getFullYear()} Inventory App. All rights reserved.
          </span>
        </div>

        {/* Panel Form Kanan */}
        <div className="form-section">
          <div className="form-header">
            <h1>Masuk ke Akun 👋</h1>
            <p>Masukkan email dan password Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={login}>
            {/* Input Email */}
            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <div className="input-container">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-btn"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk Sekarang →</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>atau</span>
          </div>

          {/* Google Login Button */}
          <button type="button" className="btn-google" onClick={loginGoogle}>
            <FcGoogle size={20} />
            <span>Login dengan Google</span>
          </button>

          {/* Link Register */}
          <p className="register-redirect">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>

      </div>
    </div>
  );
}