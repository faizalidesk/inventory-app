import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaBoxOpen } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Login Email & Password
    async function login(e) {
        e.preventDefault();

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/dashboard");
    }

    // Login Google
    async function loginGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            alert(error.message);
        }
    }

    return (
        <div className="login-page">
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap");

                .login-page {
                    --navy: #1e3a5f;
                    --navy-dark: #14283f;
                    --amber: #f59e0b;
                    --bg: #f1f5f9;
                    --text: #0f172a;
                    --muted: #64748b;
                    --border: #e2e8f0;

                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top left, #eef2f7 0%, var(--bg) 55%);
                    font-family: "Inter", system-ui, sans-serif;
                    padding: 24px;
                    box-sizing: border-box;
                }

                .login-card {
                    width: 100%;
                    max-width: 380px;
                    background: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
                    overflow: hidden;
                    border: 1px solid var(--border);
                }

                /* decorative barcode strip - nods to inventory scanning */
                .login-barcode {
                    display: flex;
                    align-items: stretch;
                    gap: 2px;
                    height: 10px;
                    background: var(--navy-dark);
                    padding: 0 18px;
                }

                .login-barcode span {
                    flex: 1;
                    background: rgba(245, 158, 11, 0.85);
                }

                .login-barcode span:nth-child(3n) {
                    background: rgba(255, 255, 255, 0.25);
                }

                .login-barcode span:nth-child(5n) {
                    background: rgba(255, 255, 255, 0.5);
                }

                .login-brand {
                    text-align: center;
                    padding: 36px 32px 8px;
                }

                .login-brand-icon {
                    width: 52px;
                    height: 52px;
                    margin: 0 auto 14px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, var(--navy), var(--navy-dark));
                    color: var(--amber);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    box-shadow: 0 8px 16px rgba(30, 58, 95, 0.3);
                }

                .login-brand h1 {
                    font-family: "Plus Jakarta Sans", sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: var(--text);
                    margin: 0 0 4px;
                    letter-spacing: -0.02em;
                }

                .login-brand p {
                    color: var(--muted);
                    font-size: 13.5px;
                    margin: 0;
                }

                .login-form {
                    padding: 24px 32px 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .login-field {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1.5px solid var(--border);
                    border-radius: 10px;
                    padding: 0 14px;
                    background: #f8fafc;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }

                .login-field:focus-within {
                    border-color: var(--navy);
                    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.12);
                    background: #ffffff;
                }

                .login-icon {
                    color: var(--muted);
                    font-size: 14px;
                    display: flex;
                }

                .login-field input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    outline: none;
                    padding: 12px 0;
                    font-size: 14.5px;
                    color: var(--text);
                    font-family: inherit;
                }

                .login-field input::placeholder {
                    color: #94a3b8;
                }

                .login-btn-primary {
                    margin-top: 4px;
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    background: var(--navy);
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 14.5px;
                    cursor: pointer;
                    transition: background 0.15s ease, transform 0.05s ease;
                }

                .login-btn-primary:hover:not(:disabled) {
                    background: var(--navy-dark);
                }

                .login-btn-primary:active:not(:disabled) {
                    transform: scale(0.99);
                }

                .login-btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .login-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px 32px 0;
                    color: var(--muted);
                    font-size: 12.5px;
                }

                .login-divider::before,
                .login-divider::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }

                .login-btn-google {
                    margin: 16px 32px 0;
                    width: calc(100% - 64px);
                    padding: 11px;
                    border-radius: 10px;
                    border: 1.5px solid var(--border);
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text);
                    cursor: pointer;
                    transition: background 0.15s ease, border-color 0.15s ease;
                }

                .login-btn-google:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .login-footer {
                    text-align: center;
                    padding: 22px 32px 30px;
                    font-size: 13.5px;
                    color: var(--muted);
                    margin: 0;
                }

                .login-footer a {
                    color: var(--navy);
                    font-weight: 600;
                    text-decoration: none;
                }

                .login-footer a:hover {
                    text-decoration: underline;
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-btn-primary,
                    .login-btn-google {
                        transition: none;
                    }
                }
            `}</style>

            <div className="login-card">
                <div className="login-barcode" aria-hidden="true">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <span key={i} />
                    ))}
                </div>

                <div className="login-brand">
                    <div className="login-brand-icon">
                        <FaBoxOpen />
                    </div>
                    <h1>Inventory</h1>
                    <p>Masuk untuk mengelola stok dan gudang Anda</p>
                </div>

                <form onSubmit={login} className="login-form">
                    <label className="login-field">
                        <span className="login-icon">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="login-field">
                        <span className="login-icon">
                            <FaLock />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" className="login-btn-primary" disabled={loading}>
                        {loading ? "Memproses..." : "Login"}
                    </button>
                </form>

                <div className="login-divider">
                    <span>atau</span>
                </div>

                <button type="button" className="login-btn-google" onClick={loginGoogle}>
                    <FcGoogle size={20} />
                    Login dengan Google
                </button>

                <p className="login-footer">
                    Belum punya akun? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
