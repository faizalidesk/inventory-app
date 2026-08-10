import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaCode,
  FaFigma,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaMoon,
  FaPalette,
  FaSun,
  FaTools,
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import "./LandingPage.css";
import { toggleThemeWithTransition } from "../utils/theme";
import { fetchCollection, fetchMaintenanceSettings, fetchLandingPageSettings } from "../services/workspaceService";
import { supabase } from "../lib/supabase";

const PROJECTS = [
  {
    number: "01",
    slug: "orbit-analytics",
    type: "Web application",
    title: "Orbit Analytics",
    description: "A focused analytics experience that turns complex product data into clear, useful decisions.",
    tags: ["React", "Data visualization", "Product design"],
    className: "project-orbit",
  },
  {
    number: "02",
    slug: "frame-archive",
    type: "Digital experience",
    title: "Frame Archive",
    description: "A cinematic digital archive designed around discovery, motion, and thoughtful interaction.",
    tags: ["Creative development", "UI/UX", "Motion"],
    className: "project-frame",
  },
  {
    number: "03",
    slug: "mono-systems",
    type: "Design experiment",
    title: "Mono Systems",
    description: "An exploration of modular interfaces, expressive typography, and reusable design systems.",
    tags: ["Design system", "Prototype", "Art direction"],
    className: "project-mono",
  },
];

const SERVICES = [
  {
    icon: <FaCode />,
    title: "Web development",
    description: "Fast, accessible, and responsive interfaces built with modern frontend technology.",
  },
  {
    icon: <FaPalette />,
    title: "UI/UX design",
    description: "Digital products shaped around clarity, usability, and a distinctive visual character.",
  },
  {
    icon: <FaFigma />,
    title: "Creative experiments",
    description: "Small ideas, prototypes, and visual studies that explore what the web can become.",
  },
];

function ThemeIcon({ theme }) {
  return theme === "dark" ? <FaSun /> : <FaMoon />;
}

export default function LandingPage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("desktopalie-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [projectsList, setProjectsList] = useState(PROJECTS);
  const [maintenance, setMaintenance] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [landingContent, setLandingContent] = useState({
    hero_badge: 'Independent designer & developer',
    hero_title: 'Ideas, crafted into digital experiences.',
    hero_description: 'Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.',
    hero_cta_text: 'Explore my work',
    hero_secondary_cta_text: 'More about me',
    hero_note: 'Currently exploring creative interfaces, thoughtful motion, and useful AI.',
    about_title: 'I build to learn, and share what I discover.',
    about_large_copy: 'I am Ali, a designer and developer interested in the space between technology and human experience.',
    about_description: 'Desktopalie is where I collect the projects, lessons, and experiments that shape my creative journey. I care about simple ideas, precise details, and digital work with a clear reason to exist.',
    about_location: 'Based in Indonesia • Working worldwide',
    stat_1_value: '4+',
    stat_1_label: 'Years exploring the web',
    stat_2_value: '20+',
    stat_2_label: 'Projects & experiments',
    stat_3_value: '∞',
    stat_3_label: 'Ideas still in progress',
    contact_title: "Let's make something worth remembering.",
    contact_email: 'hello@desktopalie.my.id',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com'
  });

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Load Landing Content from Supabase
  useEffect(() => {
    async function loadLandingContent() {
      const data = await fetchLandingPageSettings();
      if (data) {
        setLandingContent(prev => ({ ...prev, ...data }));
      }
    }
    loadLandingContent();

    // Listen to Supabase Realtime changes on site_settings
    const channel = supabase
      .channel('landing_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        if (payload.new && payload.new.key === 'landing_page') {
          const val = typeof payload.new.value === 'string' ? JSON.parse(payload.new.value) : payload.new.value;
          setLandingContent(prev => ({ ...prev, ...val }));
        }
      })
      .subscribe();

    const handleStorage = () => {
      const local = localStorage.getItem('desktopalie_landing_settings');
      if (local) {
        try {
          setLandingContent(prev => ({ ...prev, ...JSON.parse(local) }));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Load Projects from Supabase
  useEffect(() => {
    async function loadProjects() {
      const data = await fetchCollection("projects");
      if (data && data.length > 0) {
        setProjectsList(data.map((p, i) => ({
          number: String(i + 1).padStart(2, "0"),
          slug: p.slug,
          type: p.type,
          title: p.title,
          description: p.description,
          tags: ["React", "Supabase", "UI/UX"],
          className: p.tone === "teal" ? "project-frame" : p.tone === "rose" ? "project-mono" : "project-orbit"
        })));
      }
    }
    loadProjects();
  }, []);

  // Load & Listen to Maintenance Settings from Supabase & LocalStorage
  useEffect(() => {
    async function loadMaintenance() {
      const settings = await fetchMaintenanceSettings();
      if (settings) {
        setMaintenance(settings);
      }
    }
    loadMaintenance();

    // Listen to Supabase Realtime changes on site_settings
    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        if (payload.new && payload.new.key === 'maintenance') {
          setMaintenance(payload.new.value);
        }
      })
      .subscribe();

    // Listen to window storage events for local testing
    const handleStorageChange = () => {
      const localData = localStorage.getItem('desktopalie_maintenance_settings');
      if (localData) {
        try {
          setMaintenance(JSON.parse(localData));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate live countdown matching Backoffice end_time / target_date
  useEffect(() => {
    if (!maintenance?.is_enabled) return;

    const calculateTimeLeft = () => {
      const targetStr = maintenance.end_time || maintenance.target_date;
      if (!targetStr) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const target = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [maintenance]);

  const toggleTheme = (event) => toggleThemeWithTransition(event, theme, setTheme);

  // IF MAINTENANCE MODE IS ENABLED IN BACKOFFICE
  if (maintenance && maintenance.is_enabled) {
    return (
      <div className="desktopalie" data-theme={theme} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: "2rem" }}>
        <div className="page-noise" aria-hidden="true" />
        
        {/* Background glow */}
        <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)", top: "15%", pointerEvents: "none" }} />

        <div style={{ maxWidth: "680px", width: "100%", textAlign: "center", zIndex: 2, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "20px", padding: "3rem 2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 10px 20px rgba(139,92,246,0.3)" }}>
            <FaTools />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 14px", borderRadius: "99px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
            <FaClock /> SYSTEM MAINTENANCE & COUNTDOWN
          </div>

          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800", letterSpacing: "-0.04em", marginBottom: "1rem", color: "var(--text)" }}>
            {maintenance.title || "Situs Sedang Dalam Pemeliharaan"}
          </h1>

          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.7", maxWidth: "540px", margin: "0 auto 2.5rem" }}>
            {maintenance.message || "Kami sedang melakukan peningkatan sistem dan optimasi performa. Kembali lagi dalam beberapa saat."}
          </p>

          {/* Real-time Live Countdown Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
            {[
              { label: "HARI", value: timeLeft.days },
              { label: "JAM", value: timeLeft.hours },
              { label: "MENIT", value: timeLeft.minutes },
              { label: "DETIK", value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: "12px", padding: "1rem 0.5rem" }}>
                <div style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: "800", color: "var(--accent)", fontFamily: "'DM Mono', monospace" }}>
                  {String(item.value).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--muted)", letterSpacing: "0.08em", marginTop: "4px" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Admin Bypass Link if allowed */}
          {maintenance.allow_admin_bypass !== false && (
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Administrator Backoffice?</span>
              <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontWeight: "700", fontSize: "12px", textDecoration: "none" }}>
                <FaLock /> Sign In to Backoffice
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="desktopalie" data-theme={theme}>
      <div className="page-noise" aria-hidden="true" />

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
            <button className="theme-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              <ThemeIcon theme={theme} />
            </button>
            <Link className="nav-login" to="/login">
              Login <FaArrowRight />
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="site-wrap hero-grid">
            <div className="hero-copy">
              <div className="status-pill"><span /> {landingContent.hero_badge}</div>
              <h1>{landingContent.hero_title}</h1>
              <p>
                {landingContent.hero_description}
              </p>
              <div className="hero-actions">
                <Link className="primary-button" to="/projects">{landingContent.hero_cta_text} <FaArrowRight /></Link>
                <Link className="text-button" to="/about">{landingContent.hero_secondary_cta_text}</Link>
              </div>
              <div className="hero-note">
                <span className="note-line" />
                {landingContent.hero_note}
              </div>
            </div>

            <div className="hero-visual" id="experiments" aria-label="Desktopalie creative workspace preview">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="browser-window">
                <div className="browser-topbar">
                  <div className="browser-dots"><i /><i /><i /></div>
                  <div className="browser-url">desktopalie.my.id/lab</div>
                  <span className="browser-plus">+</span>
                </div>
                <div className="browser-content">
                  <div className="mini-sidebar">
                    <DesktopalieMark className="brand-mark" />
                    <span className="side-active" />
                    <span />
                    <span />
                  </div>
                  <div className="mini-canvas">
                    <div className="canvas-label">EXPERIMENT / 024</div>
                    <div className="canvas-title">Make it useful.<br />Make it <em>memorable.</em></div>
                    <div className="canvas-art">
                      <div className="art-disc" />
                      <div className="art-card art-card-one">UI</div>
                      <div className="art-card art-card-two">01</div>
                    </div>
                    <div className="canvas-footer"><span>Creative development</span><span>2026 ↗</span></div>
                  </div>
                </div>
              </div>
              <div className="floating-code">
                <span>const</span> ideas = <b>await</b> create();
              </div>
              <div className="floating-tag">DESIGN × CODE</div>
            </div>
          </div>
        </section>

        <section className="section" id="work">
          <div className="site-wrap">
            <div className="section-heading split-heading">
              <div><span className="section-index">01 / SELECTED WORK</span><h2>Things I have<br />been building.</h2></div>
              <p>A selection of digital products and visual experiments where strategy, design, and code meet.</p>
            </div>

            <div className="project-list">
              {projectsList.map((project) => (
                <article className="project-card" key={project.slug || project.title}>
                  <div className={`project-visual ${project.className || "project-orbit"}`}>
                    <span className="project-number">{project.number}</span>
                    <div className="project-window">
                      <div className="project-window-bar"><span /><span /><span /></div>
                      <div className="project-window-body">
                        <i /><i /><i /><i />
                      </div>
                    </div>
                  </div>
                  <div className="project-info">
                    <span className="project-type">{project.type}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">{(project.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <Link className="project-arrow" to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><FaArrowRight /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="site-wrap about-grid">
            <div className="about-visual">
              <div className="portrait-card">
                <div className="portrait-grid" />
                <div className="portrait-monogram">FA</div>
                <span className="portrait-caption">{landingContent.about_location}</span>
              </div>
              <span className="about-sticker">Curious by default ✦</span>
            </div>
            <div className="about-copy">
              <span className="section-index">02 / ABOUT</span>
              <h2>{landingContent.about_title}</h2>
              <p className="large-copy">{landingContent.about_large_copy}</p>
              <p>{landingContent.about_description}</p>
              <div className="about-stats">
                <div><strong>{landingContent.stat_1_value}</strong><span>{landingContent.stat_1_label}</span></div>
                <div><strong>{landingContent.stat_2_value}</strong><span>{landingContent.stat_2_label}</span></div>
                <div><strong>{landingContent.stat_3_value}</strong><span>{landingContent.stat_3_label}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="capabilities">
          <div className="site-wrap">
            <div className="section-heading centered-heading">
              <span className="section-index">03 / CAPABILITIES</span>
              <h2>From first sketch<br />to final interaction.</h2>
            </div>
            <div className="services-grid">
              {SERVICES.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <span className="service-number">0{index + 1}</span>
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="site-wrap contact-inner">
            <span className="section-index">HAVE AN IDEA?</span>
            <h2>{landingContent.contact_title}</h2>
            <a className="contact-link" href={`mailto:${landingContent.contact_email}`}>{landingContent.contact_email} <FaArrowRight /></a>
            <div className="contact-login">Already part of the studio? <Link to="/login">Sign in</Link></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-wrap footer-inner">
          <Link to="/" className="brand"><DesktopalieMark className="brand-mark" /><span>Desktopalie</span></Link>
          <p>Projects, experiments, and digital creations.</p>
          <div className="social-links">
            <a href={landingContent.github_url || "https://github.com"} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href={landingContent.linkedin_url || "https://linkedin.com"} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href={landingContent.instagram_url || "https://instagram.com"} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          </div>
          <span className="copyright">© {new Date().getFullYear()} DESKTOPALIE</span>
        </div>
      </footer>
    </div>
  );
}
