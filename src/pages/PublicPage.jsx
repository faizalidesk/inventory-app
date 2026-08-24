import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaCode, 
  FaFigma, 
  FaFlask, 
  FaPalette, 
  FaSpinner, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaEnvelope, 
  FaShieldAlt, 
  FaLayerGroup, 
  FaServer, 
  FaMobileAlt, 
  FaBrain 
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./PublicPage.css";
import { fetchCollection, fetchItemBySlug, subscribeToCollection } from "../services/workspaceService";
import { usePlatform } from "../context/PlatformContext";
import { useTheme } from "../context/ThemeContext";

export function PublicShell({ children }) {
  const { theme } = useTheme();

  return (
    <div className="public-page" data-theme={theme}>
      <SiteNavbar />
      <main>{children}</main>
      
      {/* COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="public-footer-rich">
        <div className="footer-container">
          <div className="footer-grid">
            {/* BRAND COLUMN */}
            <div className="footer-col brand-col">
              <Link to="/" className="public-brand footer-brand">
                <DesktopalieMark className="public-brand-mark" style={{ width: "28px", height: "26px", display: "inline-flex" }} />
                <span>DESKTOPALIE</span>
              </Link>
              <p className="footer-desc">
                <strong>Desktopalie</strong> is an independent digital space and creative studio dedicated to UI/UX design, modern full-stack web engineering, multi-platform architecture, and intelligent tools.
              </p>
              <div className="footer-status">
                <span className="status-dot"></span> All Systems Operational
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home Overview</Link></li>
                <li><Link to="/projects">Selected Work</Link></li>
                <li><Link to="/about" className="footer-active-link">About Desktopalie</Link></li>
                <li><Link to="/news">News & Warta</Link></li>
                <li><Link to="/experiments">Lab Experiments</Link></li>
                <li><Link to="/services">Services & Pricing</Link></li>
                <li><Link to="/contact">Get in Touch</Link></li>
              </ul>
            </div>

            {/* PLATFORMS */}
            <div className="footer-col">
              <h4>Ecosystem</h4>
              <ul>
                <li><Link to="/">Platform Alpha (Creative Lab)</Link></li>
                <li><a href="https://beta.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Beta (Fleet Logistics)</a></li>
                <li><a href="https://gamma.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Gamma (Video Transcoder)</a></li>
                <li><a href="https://delta.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Delta (Enterprise ERP)</a></li>
                <li><a href="https://back.desktopalie.my.id" target="_blank" rel="noreferrer">Admin Backoffice Workspace</a></li>
              </ul>
            </div>

            {/* SOCIAL & CONTACT */}
            <div className="footer-col">
              <h4>Connect</h4>
              <div className="footer-email-box">
                <FaEnvelope className="email-icon" />
                <a href="mailto:hello@desktopalie.my.id">hello@desktopalie.my.id</a>
              </div>
              <div className="footer-socials">
                <a href="https://github.com/faizalidesk" target="_blank" rel="noreferrer" title="GitHub">
                  <FaGithub />
                </a>
                <a href="https://linkedin.com/in/faizalidesk" target="_blank" rel="noreferrer" title="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="https://instagram.com/faizalidesk" target="_blank" rel="noreferrer" title="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {new Date().getFullYear()} <strong>Desktopalie</strong>. All rights reserved.
            </div>
            <div className="footer-badges">
              <span><FaShieldAlt className="shield-icon" /> ISO 27001 Security Ready</span>
              <span>•</span>
              <span>256-bit SSL Encrypted</span>
              <span>•</span>
              <span>React 19 & Vite 8</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PublicInfoPage({ type }) {
  useEffect(() => {
    if (type === "about") {
      // 1. Dynamic Title highlighting Desktopalie
      document.title = "About Desktopalie — Projects, Experiments & Digital Creations";

      // 2. Dynamic Meta Description highlighting Desktopalie
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = "Desktopalie is an independent digital space for projects, experiments, web development, UI/UX design, and digital creations.";
      }

      // 3. Dynamic Canonical Tag
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://desktopalie.my.id/${type}`;

      // 4. OpenGraph
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = "About Desktopalie — Projects, Experiments & Digital Creations";

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = "Desktopalie is an independent digital space for projects, experiments, web development, UI/UX design, and digital creations.";

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = `https://desktopalie.my.id/${type}`;

      // 5. Schema.org JSON-LD Organization / Project Structured Data
      const existingScript = document.getElementById('schema-about-desktopalie');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'schema-about-desktopalie';
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Desktopalie — Projects, Experiments & Digital Creations",
          "url": "https://desktopalie.my.id/about",
          "description": "Desktopalie is an independent digital space for projects, experiments, web development, UI/UX design, and digital creations.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Desktopalie",
            "url": "https://desktopalie.my.id",
            "logo": "https://desktopalie.my.id/favicon-512x512.png",
            "sameAs": [
              "https://github.com/faizalidesk",
              "https://linkedin.com/in/faizalidesk",
              "https://instagram.com/faizalidesk"
            ]
          }
        });
        document.head.appendChild(script);
      }
    } else if (type === "services") {
      document.title = "Services & Capabilities — Desktopalie";
    } else if (type === "contact") {
      document.title = "Contact & Inquiries — Desktopalie";
    }

    window.scrollTo(0, 0);

    return () => {
      const s = document.getElementById('schema-about-desktopalie');
      if (s) s.remove();
    };
  }, [type]);

  if (type === "about") {
    return (
      <PublicShell>
        {/* HERO */}
        <section className="public-hero">
          <span>03 / ABOUT</span>
          <h1>Building to learn. Sharing to connect.</h1>
          <p>
            <strong>Desktopalie</strong> is an independent digital space and creative studio for projects, experiments, and modern web creations, exploring the space between technology, human experience, and thoughtful engineering.
          </p>
        </section>

        {/* STATS & THE STORY */}
        <section className="public-content-grid">
          <div>
            <span className="public-label">THE STORY</span>
            <p>
              <strong>Desktopalie</strong> is an independent digital space—a growing archive of projects, lessons, and experiments. We care about simple ideas, precise details, accessible interfaces, and digital work with a clear reason to exist.
            </p>
            <p style={{ marginTop: "1rem" }}>
              What started as personal design explorations has evolved into a unified multi-tenant platform architecture, spanning web portals, real-time telemetry systems, and cross-platform native Android integration.
            </p>
          </div>
          <div className="public-facts">
            <div>
              <strong>4+</strong>
              <span>Years exploring</span>
            </div>
            <div>
              <strong>20+</strong>
              <span>Projects created</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Ideas in progress</span>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY CARDS */}
        <section className="about-detail-section">
          <div className="section-header-centered">
            <span className="public-label">PHILOSOPHY</span>
            <h2>Core Principles & Design Craft</h2>
          </div>
          <div className="about-cards-grid">
            <div className="about-card">
              <div className="card-icon"><FaPalette /></div>
              <h3>Clarity in Design</h3>
              <p>Interfaces should reduce cognitive load, emphasizing clean typography, intentional negative space, and responsive micro-interactions.</p>
            </div>
            <div className="about-card">
              <div className="card-icon"><FaCode /></div>
              <h3>Resilient Architecture</h3>
              <p>Built on modern React 19, Supabase PostgreSQL Row-Level Security (RLS), and zero-latency Edge caching for high-speed resilience.</p>
            </div>
            <div className="about-card">
              <div className="card-icon"><FaLayerGroup /></div>
              <h3>Multi-Platform Ecosystem</h3>
              <p>Supporting multiple domain flavors and native mobile apps seamlessly within a single unified codebase.</p>
            </div>
          </div>
        </section>

        {/* TECH STACK GRID */}
        <section className="about-detail-section">
          <div className="section-header-centered">
            <span className="public-label">TOOLCHAIN</span>
            <h2>Technologies & Stack</h2>
          </div>
          <div className="tech-stack-grid">
            <div className="tech-item">
              <FaCode className="tech-icon" />
              <div>
                <strong>Frontend</strong>
                <span>React 19, Vite, Tailwind CSS, shadcn/ui</span>
              </div>
            </div>
            <div className="tech-item">
              <FaServer className="tech-icon" />
              <div>
                <strong>Backend & Data</strong>
                <span>PostgreSQL, Supabase RLS, Edge Functions</span>
              </div>
            </div>
            <div className="tech-item">
              <FaMobileAlt className="tech-icon" />
              <div>
                <strong>Mobile Native</strong>
                <span>Capacitor Android, Live Server Sync</span>
              </div>
            </div>
            <div className="tech-item">
              <FaBrain className="tech-icon" />
              <div>
                <strong>Intelligence</strong>
                <span>Agentic AI Workflows, Obsidian Knowledge Sync</span>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="about-detail-section" style={{ paddingBottom: "120px" }}>
          <div className="section-header-centered">
            <span className="public-label">EVOLUTION</span>
            <h2>Milestones & Journey</h2>
          </div>
          <div className="timeline-list">
            <div className="timeline-item">
              <div className="timeline-badge">2023 — 2024</div>
              <div className="timeline-content">
                <h4>Foundations & UI/UX Explorations</h4>
                <p>Created early interactive prototypes, design systems, and component libraries focusing on web performance.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge">2025</div>
              <div className="timeline-content">
                <h4>Multi-Platform Flavoring & Supabase RLS</h4>
                <p>Architected 4-tenant platforms with isolated data security, realtime synchronization, and backoffice controls.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge">2026</div>
              <div className="timeline-content">
                <h4>Native Mobile APK & AI Knowledge Sync</h4>
                <p>Launched Capacitor Android release and integrated live sync with Obsidian intelligence systems.</p>
              </div>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  // SERVICES PAGE
  if (type === "services") {
    return (
      <PublicShell>
        <section className="public-hero">
          <span>04 / SERVICES</span>
          <h1>From first sketch to final interaction.</h1>
          <p>I help shape thoughtful digital experiences through strategy, interface design, and modern frontend development.</p>
        </section>
        <section className="public-content-grid">
          <div>
            <span className="public-label">THE APPROACH</span>
            <p>Every engagement starts by understanding the real problem. From there, I create a clear visual direction, build reusable systems, and turn them into fast, responsive interfaces.</p>
          </div>
          <div className="public-service-list">
            <article>
              <FaCode />
              <div>
                <h2>Web development</h2>
                <p>Responsive, accessible interfaces built with modern frontend technology.</p>
              </div>
            </article>
            <article>
              <FaPalette />
              <div>
                <h2>UI/UX design</h2>
                <p>Clear product experiences with useful systems and visual character.</p>
              </div>
            </article>
            <article>
              <FaFigma />
              <div>
                <h2>Prototyping</h2>
                <p>Fast, tangible experiments for validating ideas before full production.</p>
              </div>
            </article>
          </div>
        </section>
      </PublicShell>
    );
  }

  // CONTACT PAGE
  return (
    <PublicShell>
      <section className="public-hero">
        <span>05 / CONTACT</span>
        <h1>Let’s make something worth remembering.</h1>
        <p>Have a project, an idea, or simply want to talk about the web? I would love to hear from you.</p>
      </section>
      <section className="public-content-grid">
        <div>
          <span className="public-label">COLLABORATION</span>
          <p>Share a little about what you are building, where you are in the process, and how I might help. I usually reply within two working days.</p>
        </div>
        <div className="contact-options">
          <a href="mailto:hello@desktopalie.my.id">
            <span>Email</span>
            <strong>hello@desktopalie.my.id</strong>
            <FaArrowRight />
          </a>
          <a href="https://github.com/faizalidesk" target="_blank" rel="noreferrer">
            <span>Code</span>
            <strong>View GitHub</strong>
            <FaArrowRight />
          </a>
          <a href="https://linkedin.com/in/faizalidesk" target="_blank" rel="noreferrer">
            <span>Network</span>
            <strong>Connect on LinkedIn</strong>
            <FaArrowRight />
          </a>
        </div>
      </section>
    </PublicShell>
  );
}

export function ProjectsPage() {
  const { activePlatform, activePlatformId } = usePlatform();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      let data = await fetchCollection("projects", null, activePlatformId);
      if (!data || data.length === 0) {
        const allData = await fetchCollection("projects");
        data = allData;
      }
      setProjects(data);
      setLoading(false);
    }
    loadProjects();

    const unsubscribe = subscribeToCollection("projects", () => {
      loadProjects();
    }, activePlatformId);

    return () => {
      unsubscribe();
    };
  }, [activePlatformId]);

  return (
    <PublicShell>
      <section className="public-hero">
        <span style={{ color: activePlatform.color }}>01 / SELECTED WORK • {activePlatform.name}</span>
        <h1>Projects shaped by curiosity and craft.</h1>
        <p>Filtered for <strong>{activePlatform.name}</strong> ({activePlatform.tagline}).</p>
      </section>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: activePlatform.color }} />
          <p style={{ marginTop: "12px" }}>Fetching projects from Supabase ({activePlatform.id})...</p>
        </div>
      ) : (
        <section className="public-card-grid">
          {projects.map((project, index) => (
            <Link className={`public-project-card ${project.tone || "violet"}`} to={`/projects/${project.slug}`} key={project.id || project.slug}>
              <div className="public-project-art">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>{project.title.slice(0, 2).toUpperCase()}</div>
              </div>
              <span>{project.type} {project.platform_id ? `• ${project.platform_id.toUpperCase()}` : ""}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <b>View case study <FaArrowRight /></b>
            </Link>
          ))}
        </section>
      )}
    </PublicShell>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      const data = await fetchItemBySlug("projects", slug);
      setProject(data);
      setLoading(false);
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <PublicShell>
        <section className="public-hero" style={{ textAlign: "center" }}>
          <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} />
          <p style={{ marginTop: "12px" }}>Loading case study from Supabase...</p>
        </section>
      </PublicShell>
    );
  }

  if (!project) {
    return (
      <PublicShell>
        <section className="public-hero">
          <span>PROJECT NOT FOUND</span>
          <h1>This project does not exist.</h1>
          <Link className="public-back" to="/projects"><FaArrowLeft /> Back to projects</Link>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className={`case-hero ${project.tone || "violet"}`}>
        <Link to="/projects" className="public-back"><FaArrowLeft /> All projects</Link>
        <span>{project.type} / {project.status} {project.platform_id ? `(${project.platform_id.toUpperCase()})` : ""}</span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div><i>Progress: {project.progress}%</i></div>
      </section>
      <section className="case-content">
        <article>
          <span>THE CHALLENGE</span>
          <h2>Finding the useful signal inside the noise.</h2>
          <p>{project.description}</p>
        </article>
        <div className={`case-visual ${project.tone || "violet"}`}>
          <div>{project.title.slice(0, 2).toUpperCase()}</div>
        </div>
        <article>
          <span>THE OUTCOME</span>
          <h2>A clearer and more memorable experience.</h2>
          <p>Designed and built with modern web technologies, backed by Supabase PostgreSQL.</p>
        </article>
        <Link className="next-project" to="/projects">Explore more projects <FaArrowRight /></Link>
      </section>
    </PublicShell>
  );
}

export function ExperimentsPage() {
  const { activePlatform, activePlatformId } = usePlatform();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExperiments() {
      setLoading(true);
      let data = await fetchCollection("experiments", null, activePlatformId);
      if (!data || data.length === 0) {
        data = await fetchCollection("experiments");
      }
      setExperiments(data);
      setLoading(false);
    }
    loadExperiments();

    const unsubscribe = subscribeToCollection("experiments", () => {
      loadExperiments();
    }, activePlatformId);

    return () => {
      unsubscribe();
    };
  }, [activePlatformId]);

  return (
    <PublicShell>
      <section className="public-hero">
        <span style={{ color: activePlatform.color }}>02 / THE LAB • {activePlatform.name}</span>
        <h1>Small experiments. Useful discoveries.</h1>
        <p>An open notebook of interface studies, prototypes, and creative code for platform: <strong>{activePlatform.name}</strong>.</p>
      </section>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: activePlatform.color }} />
          <p style={{ marginTop: "12px" }}>Loading experiments from Supabase ({activePlatform.id})...</p>
        </div>
      ) : (
        <section className="experiment-list">
          {experiments.map((item, index) => (
            <article id={`experiment-${item.slug}`} key={item.id || item.slug}>
              <span>{String(index + 1).padStart(3, "0")}</span>
              <div>
                <i>{item.type} {item.platform_id ? `[${item.platform_id.toUpperCase()}]` : ""}</i>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <FaFlask style={{ color: activePlatform.color }} />
            </article>
          ))}
        </section>
      )}
    </PublicShell>
  );
}


