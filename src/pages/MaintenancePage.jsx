import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaCog,
  FaGlobe,
  FaLock,
  FaMicrochip,
  FaMoon,
  FaPaperPlane,
  FaPause,
  FaPlay,
  FaRocket,
  FaServer,
  FaShieldAlt,
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
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mode, setMode] = useState("turbo"); // 'turbo' | 'quantum'
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const canvasRef = useRef(null);

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
      setLogs((prev) => [...prev.slice(-6), `[${timestamp}] ${nextLog.replace(/\[.*?\]\s*/, "")}`]);
    }, 3200);
    return () => clearInterval(stream);
  }, [isLogStreaming]);

  // Interactive Particle Warp & Ripple Canvas
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

    const speedMultiplier = mode === "quantum" ? 1.8 : 0.8;
    const mainColor = mode === "quantum" ? "#06b6d4" : "#8b5cf6";
    const accentColor = mode === "quantum" ? "#3b82f6" : "#ec4899";

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * speedMultiplier,
      vy: (Math.random() - 0.5) * speedMultiplier,
      color: Math.random() > 0.5 ? mainColor : accentColor,
    }));

    let ripples = [];
    const handleCanvasClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        alpha: 1,
        color: mainColor,
      });
    };
    window.addEventListener("click", handleCanvasClick);

    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      try {
        ctx.clearRect(0, 0, width, height);

        // Safe radial gradient
        const safeX = Number.isFinite(mouse.x) && mouse.x > 0 ? mouse.x : width / 2;
        const safeY = Number.isFinite(mouse.y) && mouse.y > 0 ? mouse.y : height / 2;
        const safeRadius = Math.max(50, width * 0.6);

        const grad = ctx.createRadialGradient(safeX, safeY, 5, safeX, safeY, safeRadius);
        if (theme === "dark") {
          grad.addColorStop(0, mode === "quantum" ? "rgba(6, 182, 212, 0.12)" : "rgba(139, 92, 246, 0.12)");
          grad.addColorStop(1, "rgba(11, 15, 25, 0)");
        } else {
          grad.addColorStop(0, "rgba(99, 102, 241, 0.08)");
          grad.addColorStop(1, "rgba(248, 250, 252, 0)");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Render & update ripples
        ripples.forEach((r, i) => {
          r.radius += 4;
          r.alpha -= 0.015;
          if (r.alpha <= 0) {
            ripples.splice(i, 1);
            return;
          }
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = Math.max(0, r.alpha);
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Render & connect particles
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Subtle attraction to mouse
          const dx = safeX - p.x;
          const dy = safeY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 150) {
            p.x += (dx / dist) * 0.4;
            p.y += (dy / dist) * 0.4;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = mode === "quantum" ? 0.8 : 0.5;
          ctx.shadowBlur = mode === "quantum" ? 12 : 6;
          ctx.shadowColor = p.color;
          ctx.fill();

          // Lines connecting close particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p.x - p2.x;
            const pdy = p.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pdist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - pdist / 100) * 0.12;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });

        ctx.globalAlpha = 1;
      } catch (err) {
        console.error("Canvas render error:", err);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mode]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="maintenance-cyber-wrapper" data-theme={theme} data-mode={mode}>
      <canvas ref={canvasRef} className="cyber-canvas" />

      {/* Top Header Navigation */}
      <header className="cyber-header">
        <div className="cyber-brand">
          <DesktopalieMark className="brand-mark" />
          <span className="brand-title">desktopalie</span>
          <span className="version-tag">v2.5 REFACTOR</span>
        </div>

        <div className="cyber-header-controls">
          {/* Quantum / Turbo Mode Switcher */}
          <div className="mode-switcher">
            <button
              className={`mode-btn ${mode === "turbo" ? "active" : ""}`}
              onClick={() => setMode("turbo")}
              title="Turbo Engine Mode"
            >
              <FaRocket /> <span>Turbo</span>
            </button>
            <button
              className={`mode-btn ${mode === "quantum" ? "active" : ""}`}
              onClick={() => setMode("quantum")}
              title="Quantum Speed Mode"
            >
              <FaMicrochip /> <span>Quantum</span>
            </button>
          </div>

          <button
            className="theme-btn"
            onClick={(e) => toggleThemeWithTransition(e, theme, setTheme)}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      {/* Central Content Split */}
      <main className="cyber-main">
        <div className="cyber-split-container">
          {/* Left Column: Hero & Hologram & Timer */}
          <div className="cyber-glass-panel cyber-col-left">
            <div className="holo-core-container">
              <div className="holo-ring ring-outer" />
              <div className="holo-ring ring-inner" />
              <div className="holo-center">
                <FaCog className="holo-gear" />
              </div>
            </div>

            <div className="cyber-badge-wrap">
              <span className="cyber-badge">
                <span className="cyber-pulse" /> SYSTEM UPGRADE IN PROGRESS
              </span>
            </div>

            <h1 className="cyber-headline">Under Maintenance</h1>

            <p className="cyber-subtext">
              Desktopalie workspace is currently undergoing a core architecture upgrade.
              Click anywhere on the screen to trigger shockwave ripples or switch engine modes.
            </p>

            {/* Digital Timer Display */}
            <div className="timer-section">
              <span className="timer-label">ESTIMATED BACK ONLINE IN</span>
              <div className="timer-digits">
                <div className="digit-box">
                  <span className="digit-val">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="digit-unit">HOURS</span>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-box">
                  <span className="digit-val">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="digit-unit">MINS</span>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-box">
                  <span className="digit-val">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="digit-unit">SECS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal & Health Metrics & Subscription */}
          <div className="cyber-glass-panel cyber-col-right">
            <div className="col-right-header">
              <h3>System Refactor Monitor</h3>
              <p>Real-time telemetry and engine upgrade logs.</p>
            </div>

            {/* Interactive Live Log Terminal */}
            <div className="cyber-terminal">
              <div className="terminal-top">
                <div className="terminal-left">
                  <FaTerminal className="terminal-icon" />
                  <span>Live Refactor Logs</span>
                </div>
                <button
                  className="terminal-stream-btn"
                  onClick={() => setIsLogStreaming(!isLogStreaming)}
                >
                  {isLogStreaming ? <FaPause /> : <FaPlay />}
                  <span>{isLogStreaming ? "Pause" : "Live"}</span>
                </button>
              </div>
              <div className="terminal-body">
                {logs.map((logLine, idx) => (
                  <div key={idx} className="terminal-line">
                    <span className="line-prefix">&gt;</span> {logLine}
                  </div>
                ))}
              </div>
            </div>

            {/* System Health Indicators */}
            <div className="health-metrics-grid">
              <div className="metric-card">
                <FaShieldAlt className="metric-icon" />
                <div>
                  <strong>SSL & Auth</strong>
                  <span>Encrypted (OK)</span>
                </div>
              </div>
              <div className="metric-card">
                <FaServer className="metric-icon" />
                <div>
                  <strong>Database</strong>
                  <span>Indexed 100%</span>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="cyber-subscribe">
              <h3>Get notified when we launch</h3>
              {subscribed ? (
                <div className="sub-success">
                  <FaCheckCircle />
                  <span>Notification registered! We will email you the moment we launch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="sub-form">
                  <div className="sub-input-wrap">
                    <FaBell className="sub-icon" />
                    <input
                      type="email"
                      required
                      placeholder="Enter email to get notified..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="sub-submit-btn">
                      <span>Subscribe</span>
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cyber Footer */}
      <footer className="cyber-footer">
        <div className="footer-chip">
          <FaShieldAlt /> <span>Encrypted Session</span>
        </div>
        <div className="footer-chip">
          <FaServer /> <span>Node: ap-southeast-1</span>
        </div>
        <div className="footer-chip">
          <FaGlobe /> <span>Status: Maintenance</span>
        </div>
        <div className="footer-chip lock-chip">
          <FaLock /> <span>Routes Locked</span>
        </div>
      </footer>
    </div>
  );
}
