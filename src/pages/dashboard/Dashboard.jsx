import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBars,
  FaBell,
  FaBookmark,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaEllipsisH,
  FaExternalLinkAlt,
  FaFlask,
  FaFolderOpen,
  FaHome,
  FaMoon,
  FaPenNib,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaStickyNote,
  FaSun,
  FaThLarge,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const NAVIGATION = [
  { label: "Overview", icon: FaThLarge, active: true },
  { label: "Projects", icon: FaFolderOpen },
  { label: "Experiments", icon: FaFlask },
  { label: "Notes", icon: FaStickyNote },
  { label: "Bookmarks", icon: FaBookmark },
];

const PROJECTS = [
  { title: "Orbit Analytics", type: "Web application", progress: 84, status: "In progress", color: "violet", updated: "2 hours ago" },
  { title: "Frame Archive", type: "Digital experience", progress: 100, status: "Published", color: "teal", updated: "Yesterday" },
  { title: "Mono Systems", type: "Design experiment", progress: 62, status: "Exploring", color: "rose", updated: "3 days ago" },
];

const ACTIVITIES = [
  { icon: FaPenNib, title: "Updated the Frame Archive case study", time: "Today, 10:32", tone: "violet" },
  { icon: FaCheckCircle, title: "Published a new interaction experiment", time: "Yesterday, 16:08", tone: "teal" },
  { icon: FaStickyNote, title: "Added 4 notes to Mono Systems", time: "May 18, 09:24", tone: "amber" },
];

const WEEKLY_ACTIVITY = [42, 68, 47, 82, 58, 92, 72];

function BrandMark() {
  return <span className="studio-brand-mark" aria-hidden="true"><span /><span /></span>;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";
  const firstName = fullName.split(" ")[0];
  const initials = fullName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="studio-dashboard" data-theme={theme}>
      <div className={`studio-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`studio-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <Link to="/" className="studio-brand"><BrandMark /><span>desktopalie</span></Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><FaTimes /></button>
        </div>

        <nav className="sidebar-nav" aria-label="Studio navigation">
          <span className="nav-label">Workspace</span>
          {NAVIGATION.map(({ label, icon: Icon, active }) => (
            <button className={`sidebar-link ${active ? "active" : ""}`} key={label}>
              <Icon /><span>{label}</span>{label === "Notes" && <b>8</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-lab-card">
          <div className="lab-icon"><FaFlask /></div>
          <strong>Keep experimenting.</strong>
          <p>Your next interesting idea may start as a tiny prototype.</p>
          <button>Open the lab <FaArrowRight /></button>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-link"><FaCog /><span>Settings</span></button>
          <button className="sidebar-link logout-link" onClick={handleLogout}><FaSignOutAlt /><span>Sign out</span></button>
          <div className="sidebar-profile">
            <span className="profile-avatar">{initials}</span>
            <div><strong>{fullName}</strong><span>{user?.email}</span></div>
            <FaEllipsisH />
          </div>
        </div>
      </aside>

      <main className="studio-main">
        <header className="studio-topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><FaBars /></button>
          <div className="dashboard-search"><FaSearch /><input type="search" placeholder="Search projects, notes, experiments..." aria-label="Search workspace" /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <Link to="/" className="view-site"><FaHome /> <span>View website</span></Link>
            <button className="topbar-icon" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} aria-label="Toggle color theme">{theme === "dark" ? <FaSun /> : <FaMoon />}</button>
            <button className="topbar-icon notification-button" aria-label="Notifications"><FaBell /><span /></button>
            <span className="topbar-avatar">{initials}</span>
          </div>
        </header>

        <div className="studio-content">
          <section className="welcome-row">
            <div>
              <span className="dashboard-kicker">PERSONAL WORKSPACE / 2026</span>
              <h1>Good to see you, {firstName}.</h1>
              <p>Here is what is happening across your creative workspace today.</p>
            </div>
            <button className="new-project-button"><FaPlus /> New project</button>
          </section>

          <section className="stats-grid" aria-label="Workspace statistics">
            <article className="stat-card">
              <div className="stat-head"><span>Active projects</span><i className="violet"><FaFolderOpen /></i></div>
              <strong>06</strong><p><b>+2</b> this month</p>
            </article>
            <article className="stat-card">
              <div className="stat-head"><span>Experiments</span><i className="teal"><FaFlask /></i></div>
              <strong>24</strong><p><b>4</b> waiting to publish</p>
            </article>
            <article className="stat-card">
              <div className="stat-head"><span>Creative notes</span><i className="amber"><FaStickyNote /></i></div>
              <strong>128</strong><p><b>+12</b> this week</p>
            </article>
            <article className="stat-card stat-progress-card">
              <div className="stat-head"><span>Weekly momentum</span><i className="rose"><FaClock /></i></div>
              <div className="mini-bars">
                {WEEKLY_ACTIVITY.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
              </div>
              <p><b>18h 42m</b> focused time</p>
            </article>
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-panel projects-panel">
              <div className="panel-heading"><div><span className="dashboard-kicker">RECENT WORK</span><h2>Projects in motion</h2></div><button>View all <FaArrowRight /></button></div>
              <div className="dashboard-projects">
                {PROJECTS.map((project) => (
                  <article className="dashboard-project" key={project.title}>
                    <div className={`project-thumb ${project.color}`}>
                      <span>{project.title.slice(0, 2).toUpperCase()}</span>
                      <div className="thumb-window"><i /><i /><i /></div>
                    </div>
                    <div className="dashboard-project-copy">
                      <span className="project-meta">{project.type}</span>
                      <h3>{project.title}</h3>
                      <div className="progress-row"><div><span style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></div>
                      <div className="project-bottom"><span className={`status-chip ${project.color}`}>{project.status}</span><span>Updated {project.updated}</span></div>
                    </div>
                    <button className="project-open" aria-label={`Open ${project.title}`}><FaExternalLinkAlt /></button>
                  </article>
                ))}
              </div>
            </section>

            <aside className="right-column">
              <section className="dashboard-panel quick-panel">
                <div className="panel-heading"><div><span className="dashboard-kicker">QUICK START</span><h2>Create something</h2></div></div>
                <div className="quick-actions">
                  <button><i className="violet"><FaFolderOpen /></i><span><strong>New project</strong><small>Start a new case study</small></span><FaArrowRight /></button>
                  <button><i className="teal"><FaFlask /></i><span><strong>New experiment</strong><small>Capture a prototype</small></span><FaArrowRight /></button>
                  <button><i className="amber"><FaStickyNote /></i><span><strong>Quick note</strong><small>Save an idea for later</small></span><FaArrowRight /></button>
                </div>
              </section>

              <section className="dashboard-panel activity-panel">
                <div className="panel-heading"><div><span className="dashboard-kicker">ACTIVITY</span><h2>Latest updates</h2></div></div>
                <div className="activity-list">
                  {ACTIVITIES.map(({ icon: Icon, title, time, tone }) => (
                    <div className="activity-item" key={title}>
                      <i className={tone}><Icon /></i>
                      <div><strong>{title}</strong><span>{time}</span></div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
