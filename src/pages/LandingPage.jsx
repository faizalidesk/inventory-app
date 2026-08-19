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
import { useAuth } from "../context/auth-context";

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
    description: "Fast, responsive web applications built with modern frontend architecture, accessibility in mind, and clean semantic code.",
  },
  {
    icon: <FaPalette />,
    title: "UI/UX design",
    description: "Interface systems, design kits, and interactive product surfaces designed to feel intuitive, structured, and visually engaging.",
  },
  {
    icon: <FaFigma />,
    title: "Creative coding & motion",
    description: "Micro-interactions, kinetic typography, and fluid visual animations that explain state transitions naturally.",
  },
  {
    icon: <FaTools />,
    title: "Design systems",
    description: "Scalable component libraries, coherent color palettes, typography scales, and tokens that keep digital products consistent.",
  },
];

function ThemeIcon({ theme }) {
  return theme === "dark" ? <FaSun /> : <FaMoon />;
}

const DEFAULT_LANDING_CONTENT = {
  hero_badge: "INDEPENDENT DESIGNER & DEVELOPER",
  hero_title: "Ideas, crafted into digital experiences.",
  hero_description: "Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.",
  hero_cta_text: "Explore my work",
  hero_secondary_cta_text: "More about me",
  hero_note: "CURRENTLY EXPLORING CREATIVE INTERFACES, THOUGHTFUL MOTION, AND USEFUL AI.",
  about_title: "Independent developer crafting interfaces with intent.",
  about_large_copy: "I build websites and software that focus on clarity, motion, and crafted detail.",
  about_description: "With a background bridging front-end engineering and product design, I help brands and teams bring ambitious digital concepts to life with clean code and refined interactions.",
  about_location: "BASED IN INDONESIA • OPEN TO GLOBAL WORK",
  stat_1_value: "04+",
  stat_1_label: "Years building for the web",
  stat_2_value: "20+",
  stat_2_label: "Digital projects shipped",
  stat_3_value: "100%",
  stat_3_label: "Focus on craft & detail",
  contact_title: "Let's make something thoughtful together.",
  contact_email: "faizalidesk@gmail.com",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  instagram_url: "https://instagram.com",
};

export default function LandingPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [projectsList, setProjectsList] = useState(PROJECTS);

  // MAINTENANCE STATE
  const [maintenance, setMaintenance] = useState(() => {
    const local = localStorage.getItem("desktopalie_maintenance_settings");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return {
      is_enabled: false,
      title: "System Under Maintenance",
      message: "We are currently performing scheduled maintenance and performance upgrades. We will be back online shortly.",
      end_time: null,
      allow_admin_bypass: true
    };
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // CUSTOMIZABLE LANDING CONTENT (Synchronously hydrated to eliminate text blinking)
  const [landingContent, setLandingContent] = useState(() => {
    const local = localStorage.getItem("desktopalie_landing_settings");
    if (local) {
      try {
        return { ...DEFAULT_LANDING_CONTENT, ...JSON.parse(local) };
      } catch (e) {}
    }
    return DEFAULT_LANDING_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Load customizable landing page settings & maintenance settings from Supabase
  useEffect(() => {
    async function loadSettings() {
      // 1. Landing Page Content
      try {
        const landingData = await fetchLandingPageSettings();
        if (landingData) {
          const parsed = typeof landingData === "string" ? JSON.parse(landingData) : landingData;
          setLandingContent(prev => ({ ...prev, ...parsed }));
          localStorage.setItem("desktopalie_landing_settings", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error loading landing settings:", e);
      }

      // 2. Maintenance Settings
      try {
        const maintData = await fetchMaintenanceSettings();
        if (maintData) {
          const parsed = typeof maintData === "string" ? JSON.parse(maintData) : maintData;
          setMaintenance(parsed);
        }
      } catch (e) {
        console.error("Error loading maintenance settings:", e);
      }

      // 3. Projects from Supabase
      try {
        const liveProjects = await fetchCollection("projects");
        if (liveProjects && liveProjects.length > 0) {
          setProjectsList(liveProjects.map((p, idx) => ({
            number: String(idx + 1).padStart(2, "0"),
            slug: p.slug,
            type: p.type || "Web application",
            title: p.title,
            description: p.description,
            tags: [p.type || "Web", p.status || "Published"],
            className: idx % 3 === 0 ? "project-orbit" : idx % 3 === 1 ? "project-frame" : "project-mono",
          })));
        }
      } catch (e) {
        console.error("Error loading projects for landing:", e);
      }
    }

    loadSettings();

    // Listen to real-time changes
    const channel = supabase
      .channel("landing_page_site_settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          if (payload.new) {
            if (payload.new.key === "landing_page") {
              const val = typeof payload.new.value === "string" ? JSON.parse(payload.new.value) : payload.new.value;
              setLandingContent(prev => ({ ...prev, ...val }));
            }
            if (payload.new.key === "maintenance") {
              const val = typeof payload.new.value === "string" ? JSON.parse(payload.new.value) : payload.new.value;
              setMaintenance(val);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Countdown timer calculation for maintenance mode
  useEffect(() => {
    if (!maintenance.is_enabled || !maintenance.end_time) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const target = new Date(maintenance.end_time).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [maintenance.is_enabled, maintenance.end_time]);

  const toggleTheme = (event) => {
    toggleThemeWithTransition(event, theme, setTheme);
  };

  const isMaintenanceActive = maintenance.is_enabled === true || maintenance.is_enabled === "true" || maintenance.is_enabled === 1;

  // MAINTENANCE MODE VIEW
  if (isMaintenanceActive) {
    return (
      <div className="desktopalie maintenance-view" data-theme={theme}>
        <div className="page-noise" aria-hidden="true" />
        <div className="maintenance-card">
          <div className="maintenance-badge">
            <span className="pulsing-dot" /> SYSTEM UPGRADE IN PROGRESS
          </div>
          <h1>{maintenance.title || "System Under Maintenance"}</h1>
          <p className="maintenance-text">
            {maintenance.message || "We are performing system upgrades and optimizations. Please check back shortly."}
          </p>

          {maintenance.end_time && (
            <div className="countdown-grid">
              <div className="count-unit">
                <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                <span>DAYS</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                <span>HOURS</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                <span>MINUTES</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                <span>SECONDS</span>
              </div>
            </div>
          )}

          {maintenance.allow_admin_bypass !== false && (
            <div className="admin-bypass">
              <Link to="/login" className="admin-login-btn">
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
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <button className="theme-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              <ThemeIcon theme={theme} />
            </button>
            {user ? (
              <Link className="nav-login" to="/dashboard">
                Dashboard <FaArrowRight />
              </Link>
            ) : (
              <Link className="nav-login" to="/login">
                Login <FaArrowRight />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="site-wrap hero-grid">
            <div className="hero-copy">
              <div className="status-pill">
                <span /> {landingContent.hero_badge}
              </div>
              <h1>{landingContent.hero_title}</h1>
              <p>
                {landingContent.hero_description}
              </p>
              
              <div className="hero-actions">
                <a className="primary-button" href="#work">
                  {landingContent.hero_cta_text} <FaArrowRight />
                </a>
                <a className="text-button" href="#about">
                  {landingContent.hero_secondary_cta_text}
                </a>
              </div>

              <div className="hero-note">
                <span className="note-line" />
                {landingContent.hero_note}
              </div>
            </div>

            <div className="hero-visual" id="experiments" aria-label="Desktopalie workspace preview">
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
            <div className="contact-login">
              {user ? (
                <>Welcome back, {user.email?.split("@")[0]}! <Link to="/dashboard">Go to Dashboard →</Link></>
              ) : (
                <>Already part of the studio? <Link to="/login">Sign in</Link></>
              )}
            </div>
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
