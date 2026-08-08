import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaMoon,
  FaPaperPlane,
  FaPause,
  FaPlay,
  FaSun,
  FaTerminal,
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import { toggleThemeWithTransition } from "../utils/theme";
import "./MaintenancePage.css";

const INITIAL_LOGS = [
  "[SYSTEM] Maintenance mode initiated globally.",
  "[DATABASE] PostgreSQL RLS policies indexing complete.",
  "[SECURITY] SSL certificates and PKCE token validators refreshed.",
  "[OPTIMIZATION] Vite 8 assets pre-bundled & compressed.",
  "[DEPLOYMENT] Syncing edge servers across Asia Pacific...",
];

export default function MaintenancePage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("desktopalie-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated Live Log Stream
  useEffect(() => {
    if (!isLogStreaming) return undefined;
    const pool = [
      "[CACHE] Purging CDN cache nodes...",
      "[NETWORK] Latency health check 14ms (OK).",
      "[REFACTOR] Modernizing UI v2.5 micro-interactions...",
      "[STORAGE] Verifying Supabase bucket storage integrity...",
      "[SYNC] Realtime subscription channels synchronized.",
    ];
    const stream = setInterval(() => {
      const nextLog = pool[Math.floor(Math.random() * pool.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev.slice(-5), `[${timestamp}] ${nextLog.replace(/\[.*?\]\s*/, "")}`]);
    }, 3200);
    return () => clearInterval(stream);
  }, [isLogStreaming]);

  const toggleTheme = (event) => toggleThemeWithTransition(event, theme, setTheme);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="desktopalie maintenance-landing" data-theme={theme}>
      <div className="page-noise" aria-hidden="true" />

      {/* Unified Site Header */}
      <header className="site-header">
        <div className="site-wrap header-inner">
          <Link to="/" className="brand" aria-label="Desktopalie home">
            <DesktopalieMark className="brand-mark" />
            <span>Desktopalie</span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/experiments">Experiments</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <span className="maint-locked-chip">
              <FaLock /> Routes Locked
            </span>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section matching Landing Page */}
        <section className="hero-section maint-hero-section">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="site-wrap maint-hero-wrap">
            <div className="maint-hero-copy">
              <div className="status-pill">
                <span /> PLATFORM SYSTEM UPGRADE IN PROGRESS
              </div>
              <h1>
                We are upgrading <span>our workspace.</span>
              </h1>
              <p>
                Desktopalie is currently undergoing a core architecture refactor, database maintenance, and UI v2.5 performance enhancements. We will be back online shortly with a faster and more responsive digital experience.
              </p>

              {/* Countdown Timer Widget */}
              <div className="maint-timer-box">
                <span className="timer-tag">ESTIMATED TIME UNTIL COMPLETION</span>
                <div className="timer-display">
                  <div className="t-unit">
                    <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                    <span>HOURS</span>
                  </div>
                  <span className="t-colon">:</span>
                  <div className="t-unit">
                    <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                    <span>MINUTES</span>
                  </div>
                  <span className="t-colon">:</span>
                  <div className="t-unit">
                    <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                    <span>SECONDS</span>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="maint-steps-row">
                <div className="step-badge done">
                  <FaCheckCircle /> <span>Database Indexing</span>
                </div>
                <div className="step-badge done">
                  <FaCheckCircle /> <span>Security Audit</span>
                </div>
                <div className="step-badge active">
                  <span className="pulse-circle" /> <span>UI v2.5 Deployment</span>
                </div>
              </div>

              {/* Email Subscription Form */}
              <div className="maint-subscribe-card">
                <h3>Get notified when we are back online</h3>
                {subscribed ? (
                  <div className="sub-success">
                    <FaCheckCircle />
                    <span>Thank you! We will email you as soon as the upgrade is complete.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="maint-sub-form">
                    <div className="sub-input-row">
                      <FaBell className="sub-icon" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button type="submit" className="primary-button sub-btn">
                        Notify me <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Visual Browser Window & Live Terminal */}
            <div className="maint-visual-wrap">
              <div className="browser-window">
                <div className="browser-topbar">
                  <div className="browser-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="browser-url">desktopalie.my.id/maintenance</div>
                  <span className="browser-plus">+</span>
                </div>

                <div className="browser-content maint-browser-content">
                  <div className="maint-terminal-panel">
                    <div className="terminal-header">
                      <div className="t-left">
                        <FaTerminal />
                        <span>System Refactor Logs</span>
                      </div>
                      <button
                        className="t-stream-toggle"
                        onClick={() => setIsLogStreaming(!isLogStreaming)}
                      >
                        {isLogStreaming ? <FaPause /> : <FaPlay />}
                        <span>{isLogStreaming ? "Pause" : "Live"}</span>
                      </button>
                    </div>
                    <div className="terminal-logs-body">
                      {logs.map((logLine, idx) => (
                        <div key={idx} className="terminal-log-line">
                          <span className="t-prefix">&gt;</span> {logLine}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-code">
                <span>await</span> system.upgrade(<b>v2.5</b>);
              </div>
              <div className="floating-tag">MAINTENANCE MODE ✦</div>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Site Footer */}
      <footer className="site-footer">
        <div className="site-wrap footer-inner">
          <Link to="/" className="brand">
            <DesktopalieMark className="brand-mark" />
            <span>Desktopalie</span>
          </Link>
          <p>Projects, experiments, and digital creations.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
          <span className="copyright">© {new Date().getFullYear()} DESKTOPALIE</span>
        </div>
      </footer>
    </div>
  );
}
