import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaGamepad,
  FaHeart,
  FaHome,
  FaMoon,
  FaRedo,
  FaShieldAlt,
  FaSun,
  FaTrophy,
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import { toggleThemeWithTransition } from "../utils/theme";
import "./NotFound.css";

export default function NotFound() {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");

  // Mini Game State
  const [gameState, setGameState] = useState("idle"); // 'idle' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("desktopalie-404-highscore")) || 0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const bugsRef = useRef([]);
  const particlesRef = useRef([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Handle Game Loop
  useEffect(() => {
    if (gameState !== "playing") return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = 240);

    bugsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);

    let lastSpawn = 0;

    const spawnBug = () => {
      const isVirus = Math.random() < 0.25;
      bugsRef.current.push({
        id: Math.random(),
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        radius: isVirus ? 16 : Math.random() * 8 + 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        isVirus,
        life: 180, // frames to live before despawning
        color: isVirus ? "#ef4444" : Math.random() > 0.5 ? "#06b6d4" : "#8b5cf6",
      });
    };

    const renderGame = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Spawn Bug periodically
      if (time - lastSpawn > 900 && bugsRef.current.length < 8) {
        spawnBug();
        lastSpawn = time;
      }

      // Update & Render Bugs
      bugsRef.current.forEach((bug, idx) => {
        bug.x += bug.vx;
        bug.y += bug.vy;
        bug.life -= 1;

        if (bug.x < bug.radius || bug.x > width - bug.radius) bug.vx *= -1;
        if (bug.y < bug.radius || bug.y > height - bug.radius) bug.vy *= -1;

        // Despawned non-virus bug reduces life
        if (bug.life <= 0) {
          bugsRef.current.splice(idx, 1);
          if (!bug.isVirus) {
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState("gameover");
            }
          }
          return;
        }

        ctx.beginPath();
        ctx.arc(bug.x, bug.y, bug.radius, 0, Math.PI * 2);
        ctx.fillStyle = bug.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = bug.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bug Ring / Pulsing core
        ctx.beginPath();
        ctx.arc(bug.x, bug.y, bug.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // Update & Render Explosion Particles
      particlesRef.current.forEach((p, pIdx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          particlesRef.current.splice(pIdx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (livesRef.current > 0) {
        gameLoopRef.current = requestAnimationFrame(renderGame);
      }
    };

    gameLoopRef.current = requestAnimationFrame(renderGame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  // Click Canvas to zap bugs
  const handleCanvasClick = (e) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    bugsRef.current.forEach((bug, idx) => {
      const dx = clickX - bug.x;
      const dy = clickY - bug.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= bug.radius + 10) {
        // Spawn particle explosion
        for (let i = 0; i < 12; i++) {
          particlesRef.current.push({
            x: bug.x,
            y: bug.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            radius: Math.random() * 3 + 1,
            color: bug.color,
            alpha: 1,
          });
        }

        // Hit logic
        bugsRef.current.splice(idx, 1);
        if (bug.isVirus) {
          // Virus hit penalties
          livesRef.current -= 1;
          setLives(livesRef.current);
          setCombo(1);
          if (livesRef.current <= 0) {
            setGameState("gameover");
          }
        } else {
          // Bug hit bonus
          const points = 10 * combo;
          scoreRef.current += points;
          setScore(scoreRef.current);
          setCombo((prev) => Math.min(prev + 1, 5));

          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("desktopalie-404-highscore", scoreRef.current);
          }
        }
      }
    });
  };

  const startGame = () => {
    setGameState("playing");
  };

  return (
    <div className="not-found-wrapper" data-theme={theme}>
      {/* Background Ambient Glows */}
      <div className="nf-orb nf-orb-1" />
      <div className="nf-orb nf-orb-2" />

      {/* Header */}
      <header className="nf-header">
        <Link to="/" className="nf-brand">
          <DesktopalieMark className="nf-brand-mark" />
          <span className="nf-brand-title">desktopalie</span>
        </Link>
        <button
          className="nf-theme-btn"
          onClick={(e) => toggleThemeWithTransition(e, theme, setTheme)}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      {/* Main Content */}
      <main className="nf-main">
        <div className="nf-glass-card">
          <div className="nf-badge">
            <FaExclamationTriangle className="nf-warning-icon" />
            <span>ERROR 404 • PATH NOT FOUND</span>
          </div>

          <h1 className="nf-code">404</h1>
          <h2 className="nf-title">Page Not Found</h2>

          <p className="nf-desc">
            The page you are looking for does not exist. While you are here, try zapping quantum bugs in the mini-game below!
          </p>

          {/* Mini Arcade Game Container */}
          <div className="mini-game-container">
            <div className="game-header">
              <div className="game-title">
                <FaGamepad className="game-icon" />
                <span>Cyber Bug Hunter 404</span>
              </div>
              <div className="game-stats">
                <div className="stat-chip">
                  <FaTrophy className="trophy-icon" /> High: {highScore}
                </div>
                {gameState === "playing" && (
                  <>
                    <div className="stat-chip score-chip">Score: {score}</div>
                    <div className="stat-chip combo-chip">x{combo}</div>
                    <div className="stat-chip lives-chip">
                      {Array.from({ length: lives }).map((_, i) => (
                        <FaHeart key={i} className="heart-icon" />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Game Canvas Board */}
            <div className="game-board-wrap">
              <canvas
                ref={canvasRef}
                className="game-canvas"
                onClick={handleCanvasClick}
              />

              {gameState === "idle" && (
                <div className="game-overlay">
                  <h3>Zap the Cyan Bugs, Avoid Red Viruses!</h3>
                  <p>Click or tap as many bugs as you can before they escape.</p>
                  <button className="game-start-btn" onClick={startGame}>
                    <FaGamepad /> <span>Start Mini-Game</span>
                  </button>
                </div>
              )}

              {gameState === "gameover" && (
                <div className="game-overlay gameover">
                  <h3>Game Over!</h3>
                  <p>Your Final Score: <strong>{score}</strong></p>
                  {score >= highScore && score > 0 && (
                    <span className="high-score-badge">🏆 New High Score!</span>
                  )}
                  <button className="game-start-btn" onClick={startGame}>
                    <FaRedo /> <span>Play Again</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="nf-actions">
            <Link to="/" className="nf-btn primary">
              <FaHome /> <span>Back to Home</span>
            </Link>
            <Link to="/" className="nf-btn secondary">
              <FaArrowLeft /> <span>Check Maintenance Status</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="nf-footer">
        <div className="nf-chip">
          <FaShieldAlt /> <span>Protected Endpoint</span>
        </div>
        <span>© {new Date().getFullYear()} Desktopalie Workspace. All rights reserved.</span>
      </footer>
    </div>
  );
}
