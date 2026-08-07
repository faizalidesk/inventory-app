import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMoon, FaSun } from "react-icons/fa";
import "./Auth.css";

function BrandMark() {
  return <span className="auth-brand-mark" aria-hidden="true"><span /><span /></span>;
}

export default function AuthLayout({ eyebrow, title, description, children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className="auth-page" data-theme={theme}>
      <div className="auth-grid-pattern" aria-hidden="true" />
      <header className="auth-topbar">
        <Link to="/" className="auth-brand"><BrandMark /><span>desktopalie</span></Link>
        <div className="auth-top-actions">
          <Link to="/" className="auth-back"><FaArrowLeft /> Back to website</Link>
          <button onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} className="auth-theme" aria-label="Toggle color theme">
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <div className="auth-shell">
        <section className="auth-story">
          <div className="auth-story-copy">
            <span className="auth-kicker">DESIGN × CODE × CURIOSITY</span>
            <h2>A quiet place for <em>ideas in progress.</em></h2>
            <p>Access the private side of Desktopalie—notes, unfinished experiments, and behind-the-scenes project stories.</p>
          </div>
          <div className="auth-art" aria-hidden="true">
            <div className="auth-ring"><span>DESKTOPALIE · DIGITAL PLAYGROUND · </span></div>
            <div className="auth-shape shape-one" />
            <div className="auth-shape shape-two" />
            <div className="auth-code">ideas.<b>build</b>()</div>
          </div>
          <div className="auth-story-footer"><span>Independent creative studio</span><span>EST. 2026</span></div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <span className="auth-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="auth-description">{description}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
