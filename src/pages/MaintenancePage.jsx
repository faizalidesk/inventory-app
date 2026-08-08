import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaClock,
  FaCodeBranch,
  FaLock,
  FaMoon,
  FaPaperPlane,
  FaServer,
  FaShieldAlt,
  FaSun,
  FaSyncAlt,
  FaTools,
  FaWrench,
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import { toggleThemeWithTransition } from "../utils/theme";
import "./MaintenancePage.css";

export default function MaintenancePage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Interactive Particle Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? "#6366f1" : "#14b8a6",
    }));

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interaction with mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - pdist / 110) * 0.15;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const handlePingStatus = () => {
    setPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setPinging(false);
      setPingResult({
        latency: Math.floor(Math.random() * 25) + 12,
        status: "Maintenance Active",
        database: "PostgreSQL Standard Upgrade",
        region: "ap-southeast-1 (Jakarta)",
      });
    }, 900);
  };

  return (
    <div className="maintenance-wrapper" data-theme={theme}>
      <canvas ref={canvasRef} className="maintenance-canvas" />

      {/* Floating Ambient Glow Orbs */}
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      <header className="maintenance-header">
        <div className="maintenance-brand">
          <DesktopalieMark className="brand-mark" />
          <span className="brand-name">desktopalie</span>
        </div>

        <div className="header-actions">
          <span className="maintenance-badge">
            <span className="pulse-dot" /> SYSTEM MAINTENANCE
          </span>
          <button
            className="theme-toggle-btn"
            onClick={(e) => toggleThemeWithTransition(e, theme, setTheme)}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <main className="maintenance-content">
        <div className="maintenance-card">
          <div className="maintenance-icon-badge">
            <FaWrench className="wrench-icon" />
            <FaTools className="tools-icon" />
          </div>

          <span className="maintenance-tagline">PLATFORM SYSTEM UPGRADE IN PROGRESS</span>
          <h1 className="maintenance-title">We are upgrading our workspace</h1>

          <p className="maintenance-description">
            Sistem <strong>Desktopalie</strong> sedang menjalani peningkatan performa, pemeliharaan basis data, dan penyempurnaan UI v2.5.
            Kami akan segera kembali dengan pengalaman yang jauh lebih cepat dan responsif.
          </p>

          {/* Maintenance Progress Tracker */}
          <div className="progress-box">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span className="progress-percentage">78%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "78%" }} />
            </div>

            <div className="progress-steps">
              <div className="step done">
                <FaCheckCircle className="step-icon" />
                <span>Database Indexing</span>
              </div>
              <div className="step done">
                <FaCheckCircle className="step-icon" />
                <span>Security Audit</span>
              </div>
              <div className="step active">
                <FaSyncAlt className="step-icon spinning" />
                <span>UI & Engine Deployment</span>
              </div>
              <div className="step pending">
                <FaClock className="step-icon" />
                <span>Final Healthchecks</span>
              </div>
            </div>
          </div>

          {/* Interactive Email Subscription */}
          <div className="notification-section">
            <h3>Beri tahu saya saat online kembali</h3>
            {subscribed ? (
              <div className="subscribe-success">
                <FaCheckCircle />
                <span>Terima kasih! Kami akan mengirim pesan segera setelah pemeliharaan selesai.</span>
              </div>
            ) : (
              <form className="subscribe-form" onSubmit={handleSubscribe}>
                <div className="input-group">
                  <FaBell className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="Masukkan email Anda..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="subscribe-btn">
                    <span>Notify Me</span>
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Interactive Server Ping Tool */}
          <div className="ping-tool-box">
            <div className="ping-tool-header">
              <div className="ping-title">
                <FaServer />
                <span>System Health Indicator</span>
              </div>
              <button
                className={`ping-btn ${pinging ? "loading" : ""}`}
                onClick={handlePingStatus}
                disabled={pinging}
              >
                <FaSyncAlt className={pinging ? "spinning" : ""} />
                <span>{pinging ? "Checking..." : "Ping Status"}</span>
              </button>
            </div>

            {pingResult && (
              <div className="ping-results">
                <div className="ping-chip">
                  <FaShieldAlt /> <span>Status: {pingResult.status}</span>
                </div>
                <div className="ping-chip">
                  <FaCodeBranch /> <span>Latency: {pingResult.latency}ms</span>
                </div>
                <div className="ping-chip">
                  <FaServer /> <span>Node: {pingResult.region}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="maintenance-footer">
        <div className="footer-left">
          <span>© {new Date().getFullYear()} Desktopalie Workspace by Faiz Ali</span>
        </div>
        <div className="footer-right">
          <Link to="/login" className="dev-bypass-link">
            <FaLock /> <span>Dev / Admin Access</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
