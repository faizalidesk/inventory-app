import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCode,
  FaCss3Alt,
  FaFigma,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaMoon,
  FaPalette,
  FaSun,
} from "react-icons/fa";
import {
  SiFigma,
  SiGit,
  SiJavascript,
  SiReact,
  SiSupabase,
  SiVercel,
  SiVite,
} from "react-icons/si";
import DesktopalieMark from "../component/DesktopalieMark";
import "./LandingPage.css";
import { toggleThemeWithTransition } from "../utils/theme";

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

const STACK = [
  { name: "React", icon: SiReact, className: "react" },
  { name: "JavaScript", icon: SiJavascript, className: "javascript" },
  { name: "Vite", icon: SiVite, className: "vite" },
  { name: "Figma", icon: SiFigma, className: "figma" },
  { name: "Supabase", icon: SiSupabase, className: "supabase" },
  { name: "CSS", icon: FaCss3Alt, className: "css" },
  { name: "Git", icon: SiGit, className: "git" },
  { name: "Vercel", icon: SiVercel, className: "vercel" },
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

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = (event) => toggleThemeWithTransition(event, theme, setTheme);

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
              <div className="status-pill"><span /> Independent designer & developer</div>
              <h1>Ideas, crafted into <span>digital experiences.</span></h1>
              <p>
                Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.
              </p>
              <div className="hero-actions">
                <Link className="primary-button" to="/projects">Explore my work <FaArrowRight /></Link>
                <Link className="text-button" to="/about">More about me</Link>
              </div>
              <div className="hero-note">
                <span className="note-line" />
                Currently exploring creative interfaces, thoughtful motion, and useful AI.
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

        <div className="stack-strip" aria-label="Tools and technologies">
          <div className="stack-track">
            {[...STACK, ...STACK].map(({ name, icon: Icon, className }, index) => (
              <span className="stack-item" key={`${name}-${index}`}>
                <Icon className={`stack-logo ${className}`} aria-hidden="true" />
                {name}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="work">
          <div className="site-wrap">
            <div className="section-heading split-heading">
              <div><span className="section-index">01 / SELECTED WORK</span><h2>Things I have<br />been building.</h2></div>
              <p>A selection of digital products and visual experiments where strategy, design, and code meet.</p>
            </div>

            <div className="project-list">
              {PROJECTS.map((project) => (
                <article className="project-card" key={project.title}>
                  <div className={`project-visual ${project.className}`}>
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
                    <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
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
                <span className="portrait-caption">Based in Indonesia<br />Working worldwide</span>
              </div>
              <span className="about-sticker">Curious by default ✦</span>
            </div>
            <div className="about-copy">
              <span className="section-index">02 / ABOUT</span>
              <h2>I build to learn,<br />and share what I discover.</h2>
              <p className="large-copy">I am Faiz, a designer and developer interested in the space between technology and human experience.</p>
              <p>Desktopalie is where I collect the projects, lessons, and experiments that shape my creative journey. I care about simple ideas, precise details, and digital work with a clear reason to exist.</p>
              <div className="about-stats">
                <div><strong>4+</strong><span>Years exploring the web</span></div>
                <div><strong>20+</strong><span>Projects & experiments</span></div>
                <div><strong>∞</strong><span>Ideas still in progress</span></div>
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
            <h2>Let&apos;s make something<br /><em>worth remembering.</em></h2>
            <a className="contact-link" href="mailto:hello@desktopalie.my.id">hello@desktopalie.my.id <FaArrowRight /></a>
            <div className="contact-login">Already part of the studio? <Link to="/login">Sign in</Link></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-wrap footer-inner">
          <Link to="/" className="brand"><DesktopalieMark className="brand-mark" /><span>Desktopalie</span></Link>
          <p>Projects, experiments, and digital creations.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          </div>
          <span className="copyright">© {new Date().getFullYear()} DESKTOPALIE</span>
        </div>
      </footer>
    </div>
  );
}
