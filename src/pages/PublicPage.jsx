import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCode, FaFigma, FaFlask, FaMoon, FaPalette, FaSun, FaSpinner } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./PublicPage.css";
import { toggleThemeWithTransition } from "../utils/theme";
import { fetchCollection, fetchItemBySlug, subscribeToCollection } from "../services/workspaceService";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/auth-context";

function PublicShell({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  useEffect(() => { 
    localStorage.setItem("desktopalie-theme", theme); 
    document.documentElement.style.colorScheme = theme; 
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="public-page" data-theme={theme}>
      <SiteNavbar />
      <main>{children}</main>
      <footer className="public-footer">
        <Link to="/" className="public-brand">
          <DesktopalieMark className="public-brand-mark" style={{ width: "26px", height: "24px", display: "inline-flex" }} />
          <span>Desktopalie</span>
        </Link>
        <span>Projects, experiments, and digital creations.</span>
        <span>© {new Date().getFullYear()} DESKTOPALIE</span>
      </footer>
    </div>
  );
}

const pageCopy = {
  about: { index: "03 / ABOUT", title: "Building to learn. Sharing to connect.", lead: "I am Faiz, a designer and developer interested in the space between technology and human experience.", body: "Desktopalie is my independent digital space—a growing archive of projects, lessons, and experiments. I care about simple ideas, precise details, accessible interfaces, and digital work with a clear reason to exist." },
  services: { index: "04 / SERVICES", title: "From first sketch to final interaction.", lead: "I help shape thoughtful digital experiences through strategy, interface design, and modern frontend development.", body: "Every engagement starts by understanding the real problem. From there, I create a clear visual direction, build reusable systems, and turn them into fast, responsive interfaces." },
  contact: { index: "05 / CONTACT", title: "Let’s make something worth remembering.", lead: "Have a project, an idea, or simply want to talk about the web? I would love to hear from you.", body: "Share a little about what you are building, where you are in the process, and how I might help. I usually reply within two working days." },
};

export function PublicInfoPage({ type }) {
  const page = pageCopy[type];
  return <PublicShell><section className="public-hero"><span>{page.index}</span><h1>{page.title}</h1><p>{page.lead}</p></section><section className="public-content-grid"><div><span className="public-label">THE STORY</span><p>{page.body}</p></div>{type === "about" && <div className="public-facts"><div><strong>4+</strong><span>Years exploring</span></div><div><strong>20+</strong><span>Projects created</span></div><div><strong>∞</strong><span>Ideas in progress</span></div></div>}{type === "services" && <div className="public-service-list"><article><FaCode /><div><h2>Web development</h2><p>Responsive, accessible interfaces built with modern frontend technology.</p></div></article><article><FaPalette /><div><h2>UI/UX design</h2><p>Clear product experiences with useful systems and visual character.</p></div></article><article><FaFigma /><div><h2>Prototyping</h2><p>Fast, tangible experiments for validating ideas before full production.</p></div></article></div>}{type === "contact" && <div className="contact-options"><a href="mailto:hello@desktopalie.my.id"><span>Email</span><strong>hello@desktopalie.my.id</strong><FaArrowRight /></a><a href="https://github.com" target="_blank" rel="noreferrer"><span>Code</span><strong>View GitHub</strong><FaArrowRight /></a></div>}</section></PublicShell>;
}

export function ProjectsPage() {
  const { activePlatform, activePlatformId } = usePlatform();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      // Fetch collection with platform_id filter
      let data = await fetchCollection("projects", null, activePlatformId);
      // Fallback to fetch all if no platform-specific items exist yet
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
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: activePlatform.color }} /><p style={{ marginTop: "12px" }}>Fetching projects from Supabase ({activePlatform.id})...</p></div>
      ) : (
        <section className="public-card-grid">
          {projects.map((project, index) => (
            <Link className={`public-project-card ${project.tone || "violet"}`} to={`/projects/${project.slug}`} key={project.id || project.slug}>
              <div className="public-project-art"><span>{String(index + 1).padStart(2, "0")}</span><div>{project.title.slice(0, 2).toUpperCase()}</div></div>
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
    return <PublicShell><section className="public-hero" style={{ textAlign: "center" }}><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} /><p style={{ marginTop: "12px" }}>Loading case study from Supabase...</p></section></PublicShell>;
  }

  if (!project) {
    return <PublicShell><section className="public-hero"><span>PROJECT NOT FOUND</span><h1>This project does not exist.</h1><Link className="public-back" to="/projects"><FaArrowLeft /> Back to projects</Link></section></PublicShell>;
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
        <article><span>THE CHALLENGE</span><h2>Finding the useful signal inside the noise.</h2><p>{project.description}</p></article>
        <div className={`case-visual ${project.tone || "violet"}`}><div>{project.title.slice(0, 2).toUpperCase()}</div></div>
        <article><span>THE OUTCOME</span><h2>A clearer and more memorable experience.</h2><p>Designed and built with modern web technologies, backed by Supabase PostgreSQL.</p></article>
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
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: activePlatform.color }} /><p style={{ marginTop: "12px" }}>Loading experiments from Supabase ({activePlatform.id})...</p></div>
      ) : (
        <section className="experiment-list">
          {experiments.map((item, index) => (
            <article id={`experiment-${item.slug}`} key={item.id || item.slug}>
              <span>{String(index + 1).padStart(3, "0")}</span>
              <div><i>{item.type} {item.platform_id ? `[${item.platform_id.toUpperCase()}]` : ""}</i><h2>{item.title}</h2><p>{item.description}</p></div>
              <FaFlask style={{ color: activePlatform.color }} />
            </article>
          ))}
        </section>
      )}
    </PublicShell>
  );
}
