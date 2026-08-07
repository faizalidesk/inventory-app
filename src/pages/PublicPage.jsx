import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCode, FaFigma, FaFlask, FaMoon, FaPalette, FaSun } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import "./PublicPage.css";

const PROJECTS = {
  "orbit-analytics": { number: "01", title: "Orbit Analytics", type: "Web application", summary: "A focused analytics experience that turns complex product data into clear, useful decisions.", challenge: "Product teams had access to plenty of data, but the information was fragmented and difficult to act on.", outcome: "A calm, modular dashboard that prioritizes useful signals and makes complex trends easy to understand.", tags: ["React", "Data visualization", "Product design"], tone: "violet" },
  "frame-archive": { number: "02", title: "Frame Archive", type: "Digital experience", summary: "A cinematic digital archive designed around discovery, motion, and thoughtful interaction.", challenge: "Traditional archive interfaces felt clinical and disconnected from the emotion of the work they contained.", outcome: "An immersive browsing system where typography, motion, and imagery create a more human path through the collection.", tags: ["Creative development", "UI/UX", "Motion"], tone: "teal" },
  "mono-systems": { number: "03", title: "Mono Systems", type: "Design experiment", summary: "An exploration of modular interfaces, expressive typography, and reusable design systems.", challenge: "Explore how a strict visual system can still leave room for personality, rhythm, and expressive composition.", outcome: "A flexible collection of interface primitives that can shift from quiet utility to bold editorial layouts.", tags: ["Design system", "Prototype", "Art direction"], tone: "rose" },
};

const EXPERIMENTS = [
  { id: "024", title: "Kinetic type studies", category: "Motion", description: "Small typographic interactions exploring rhythm, scale, and intent." },
  { id: "023", title: "Ambient interface", category: "UI", description: "A responsive surface that changes character with time and context." },
  { id: "022", title: "Generative grids", category: "Code", description: "Rule-based compositions created with CSS and lightweight JavaScript." },
  { id: "021", title: "Spatial navigation", category: "Prototype", description: "An alternative way to move through connected digital content." },
];


function PublicShell({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  useEffect(() => { localStorage.setItem("desktopalie-theme", theme); document.documentElement.style.colorScheme = theme; }, [theme]);
  return (
    <div className="public-page" data-theme={theme}>
      <header className="public-header">
        <Link to="/" className="public-brand"><DesktopalieMark className="public-brand-mark" /><span>Desktopalie</span></Link>
        <nav>
          <Link to="/projects">Projects</Link><Link to="/experiments">Experiments</Link><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/contact">Contact</Link>
        </nav>
        <div className="public-actions"><button onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <FaSun /> : <FaMoon />}</button><Link to="/login">Login <FaArrowRight /></Link></div>
      </header>
      <main>{children}</main>
      <footer className="public-footer"><Link to="/" className="public-brand"><DesktopalieMark className="public-brand-mark" /><span>Desktopalie</span></Link><span>Projects, experiments, and digital creations.</span><span>© {new Date().getFullYear()} DESKTOPALIE</span></footer>
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
  return <PublicShell><section className="public-hero"><span>01 / SELECTED WORK</span><h1>Projects shaped by curiosity and craft.</h1><p>A selection of product work, digital experiences, and visual systems.</p></section><section className="public-card-grid">{Object.entries(PROJECTS).map(([slug, project]) => <Link className={`public-project-card ${project.tone}`} to={`/projects/${slug}`} key={slug}><div className="public-project-art"><span>{project.number}</span><div>{project.title.slice(0,2).toUpperCase()}</div></div><span>{project.type}</span><h2>{project.title}</h2><p>{project.summary}</p><b>View case study <FaArrowRight /></b></Link>)}</section></PublicShell>;
}

export function ProjectDetailPage() {
  const { slug } = useParams(); const project = PROJECTS[slug];
  if (!project) return <PublicShell><section className="public-hero"><span>PROJECT NOT FOUND</span><h1>This project does not exist.</h1><Link className="public-back" to="/projects"><FaArrowLeft /> Back to projects</Link></section></PublicShell>;
  return <PublicShell><section className={`case-hero ${project.tone}`}><Link to="/projects" className="public-back"><FaArrowLeft /> All projects</Link><span>{project.number} / {project.type}</span><h1>{project.title}</h1><p>{project.summary}</p><div>{project.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></section><section className="case-content"><article><span>THE CHALLENGE</span><h2>Finding the useful signal inside the noise.</h2><p>{project.challenge}</p></article><div className={`case-visual ${project.tone}`}><div>{project.title.slice(0,2).toUpperCase()}</div></div><article><span>THE OUTCOME</span><h2>A clearer and more memorable experience.</h2><p>{project.outcome}</p></article><Link className="next-project" to="/projects">Explore more projects <FaArrowRight /></Link></section></PublicShell>;
}

export function ExperimentsPage() {
  return <PublicShell><section className="public-hero"><span>02 / THE LAB</span><h1>Small experiments. Useful discoveries.</h1><p>An open notebook of interface studies, prototypes, and creative code.</p></section><section className="experiment-list">{EXPERIMENTS.map((item) => <article id={`experiment-${item.id}`} key={item.id}><span>{item.id}</span><div><i>{item.category}</i><h2>{item.title}</h2><p>{item.description}</p></div><FaFlask /></article>)}</section></PublicShell>;
}
