import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaBell, FaBookmark, FaClock, FaExternalLinkAlt, FaFlask, FaFolderOpen, FaPlus, FaSave, FaSpinner, FaStickyNote, FaTrash } from "react-icons/fa";
import UserAvatar from "../../component/UserAvatar";
import "./WorkspaceContent.css";
import { toggleThemeWithTransition } from "../../utils/theme";
import { createItem, deleteItem, fetchCollection, fetchItemBySlug } from "../../services/workspaceService";
import { supabase } from "../../lib/supabase";

export function OverviewContent({ firstName, user }) {
  const [stats, setStats] = useState({ projects: 0, experiments: 0, notes: 0 });
  const weekly = [42, 68, 47, 82, 58, 92, 72];

  useEffect(() => {
    async function loadStats() {
      const [projects, experiments, notes] = await Promise.all([
        fetchCollection("projects", user?.id),
        fetchCollection("experiments", user?.id),
        fetchCollection("notes", user?.id),
      ]);
      setStats({
        projects: projects.length,
        experiments: experiments.length,
        notes: notes.length,
      });
    }
    loadStats();
  }, [user?.id]);

  return <>
    <section className="welcome-row"><div><span className="dashboard-kicker">PERSONAL WORKSPACE / 2026</span><h1>Good to see you, {firstName}.</h1><p>Here is what is happening across your creative workspace today.</p></div><Link className="new-project-button" to="/dashboard/projects/new"><FaPlus /> New project</Link></section>
    <section className="stats-grid">
      <article className="stat-card"><div className="stat-head"><span>Active projects</span><i className="violet"><FaFolderOpen /></i></div><strong>{String(stats.projects).padStart(2, "0")}</strong><p><b>Real-time</b> from Supabase</p></article>
      <article className="stat-card"><div className="stat-head"><span>Experiments</span><i className="teal"><FaFlask /></i></div><strong>{String(stats.experiments).padStart(2, "0")}</strong><p><b>Real-time</b> from Supabase</p></article>
      <article className="stat-card"><div className="stat-head"><span>Creative notes</span><i className="amber"><FaStickyNote /></i></div><strong>{String(stats.notes).padStart(2, "0")}</strong><p><b>Real-time</b> from Supabase</p></article>
      <article className="stat-card stat-progress-card"><div className="stat-head"><span>Weekly momentum</span><i className="rose"><FaClock /></i></div><div className="mini-bars">{weekly.map((height,index)=><span key={index} style={{height:`${height}%`}} />)}</div><p><b>18h 42m</b> focused time</p></article>
    </section>
  </>;
}

function CollectionPage({ type, title, description, icon: Icon, user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchCollection(type, user?.id);
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [type, user?.id]);

  return <section className="workspace-page">
    <div className="workspace-heading">
      <div><span className="dashboard-kicker">WORKSPACE / {type.toUpperCase()}</span><h1>{title}</h1><p>{description}</p></div>
      <Link className="new-project-button" to={`/dashboard/${type}/new`}><FaPlus /> New {type === "notes" ? "note" : type.slice(0,-1)}</Link>
    </div>
    {loading ? (
      <div className="empty-state" style={{ padding: "40px 0" }}><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} /><p style={{ marginTop: "12px" }}>Loading {type} from Supabase...</p></div>
    ) : (
      <div className="workspace-list">
        {items.length === 0 ? (
          <div className="empty-state"><h2>No {type} found.</h2><p>Click below to add your first item.</p><Link className="new-project-button" to={`/dashboard/${type}/new`}><FaPlus /> Create {type.slice(0,-1)}</Link></div>
        ) : (
          items.map((item) => (
            <Link to={`/dashboard/${type}/${item.slug}`} className="workspace-card" key={item.id || item.slug}>
              <i className={item.tone || "violet"}><Icon/></i>
              <div><span>{item.type}</span><h2>{item.title}</h2><p>{item.description}</p></div>
              <b>{item.status || "Draft"}</b>
              <FaArrowRight />
            </Link>
          ))
        )}
      </div>
    )}
  </section>;
}

function NewItemPage({ type, user }) {
  const singular = type === "notes" ? "note" : type.slice(0,-1);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", type: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const slug = form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);
      await createItem(type, {
        title: form.title,
        type: form.type,
        description: form.description,
        slug,
        status: "Draft",
        tone: "violet"
      }, user?.id);

      navigate(`/dashboard/${type}`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save to Supabase.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="workspace-page narrow-workspace">
    <Link className="workspace-back" to={`/dashboard/${type}`}><FaArrowLeft/> Back to {type}</Link>
    <div className="workspace-heading"><div><span className="dashboard-kicker">NEW {singular.toUpperCase()}</span><h1>Create a {singular}.</h1><p>Saved directly to your Supabase database.</p></div></div>
    {errorMsg && <div style={{ color: "var(--rose)", marginBottom: "16px", fontSize: "14px" }}>{errorMsg}</div>}
    <form className="workspace-form" onSubmit={submit}>
      <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={`Name your ${singular}`} required/></label>
      <label>Category<input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Design, Development, Research..." required/></label>
      <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What is this about?" rows="7" required/></label>
      <button className="new-project-button" type="submit" disabled={saving}>
        {saving ? <><FaSpinner className="fa-spin" /> Saving...</> : <><FaSave/> Save {singular}</>}
      </button>
    </form>
  </section>;
}

function DetailPage({ type, slug }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      const data = await fetchItemBySlug(type, slug);
      setItem(data);
      setLoading(false);
    }
    loadItem();
  }, [type, slug]);

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    setDeleting(true);
    try {
      await deleteItem(type, "id", item.id);
      navigate(`/dashboard/${type}`);
    } catch (err) {
      alert("Failed to delete item: " + err.message);
      setDeleting(false);
    }
  }

  if (loading) return <section className="workspace-page"><div className="empty-state"><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} /><p style={{ marginTop: "12px" }}>Loading details from Supabase...</p></div></section>;

  if (!item) return <section className="workspace-page"><div className="empty-state"><h1>Item not found.</h1><p>It may have been removed or the address is incorrect.</p><Link to={`/dashboard/${type}`}><FaArrowLeft/> Back to {type}</Link></div></section>;

  const hasPublicPage = type === "projects";
  return <section className="workspace-page narrow-workspace">
    <Link className="workspace-back" to={`/dashboard/${type}`}><FaArrowLeft/> Back to {type}</Link>
    <div className={`workspace-detail-art ${item.tone||"violet"}`}><span>{item.title.slice(0,2).toUpperCase()}</span></div>
    <span className="dashboard-kicker">{item.type} / {item.status}</span>
    <h1>{item.title}</h1>
    <p className="workspace-detail-copy">{item.description}</p>
    <div className="detail-actions">
      {hasPublicPage && <Link to={`/projects/${item.slug}`}><FaExternalLinkAlt/> Open public view</Link>}
      <Link to={`/dashboard/${type}/new`}><FaPlus/> Create another</Link>
      <button onClick={handleDelete} disabled={deleting} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--rose)", background: "transparent", color: "var(--rose)", cursor: "pointer", fontWeight: 700 }}>
        <FaTrash /> {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  </section>;
}

function BookmarksPage({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarks() {
      setLoading(true);
      const data = await fetchCollection("bookmarks", user?.id);
      setItems(data);
      setLoading(false);
    }
    loadBookmarks();
  }, [user?.id]);

  async function removeBookmark(id) {
    try {
      await deleteItem("bookmarks", "id", id);
      setItems(current => current.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  }

  return <section className="workspace-page">
    <div className="workspace-heading">
      <div><span className="dashboard-kicker">LIBRARY</span><h1>Bookmarks</h1><p>Useful references and resources saved in Supabase.</p></div>
    </div>
    {loading ? (
      <div className="empty-state"><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} /><p style={{ marginTop: "12px" }}>Loading bookmarks...</p></div>
    ) : (
      <div className="workspace-list">
        {items.map(item => (
          <article className="workspace-card" key={item.id || item.url}>
            <i className="violet"><FaBookmark/></i>
            <div><span>{item.source}</span><h2>{item.title}</h2><p>{item.url}</p></div>
            <a href={item.url} target="_blank" rel="noreferrer"><FaExternalLinkAlt/></a>
            <button onClick={() => removeBookmark(item.id)} aria-label={`Remove ${item.title}`}><FaTrash/></button>
          </article>
        ))}
      </div>
    )}
  </section>;
}

function NotificationsPage(){return <section className="workspace-page"><div className="workspace-heading"><div><span className="dashboard-kicker">INBOX</span><h1>Notifications</h1><p>Updates from across your creative workspace.</p></div></div><div className="workspace-list">{["Frame Archive is ready to publish","Your weekly creative summary is available","A new sign-in was detected"].map((title,index)=><article className="workspace-card" key={title}><i className={index===2?"amber":"teal"}><FaBell/></i><div><span>{index===0?"PROJECT":"SYSTEM"}</span><h2>{title}</h2><p>{index===0?"The project has completed all publishing checks.":"Open this update to review the details."}</p></div><b>{index===0?"Now":`${index}d`}</b></article>)}</div></section>}
function SettingsPage({theme,setTheme,user}){return <section className="workspace-page narrow-workspace"><div className="workspace-heading"><div><span className="dashboard-kicker">PREFERENCES</span><h1>Settings</h1><p>Control how your Desktopalie workspace looks and behaves.</p></div></div><div className="settings-list"><div><span><strong>Color theme</strong><small>Choose the workspace appearance.</small></span><select value={theme} onChange={e=>toggleThemeWithTransition(e, theme, setTheme, e.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></div><div><span><strong>Email notifications</strong><small>Receive a weekly summary at {user?.email}.</small></span><input type="checkbox" defaultChecked/></div><div><span><strong>Reduce visual motion</strong><small>Minimize non-essential interface animation.</small></span><input type="checkbox"/></div></div></section>}
function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setProfile(data);
    }
    loadProfile();
  }, [user]);

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";
  const username = profile?.username || user?.user_metadata?.username || user?.email?.split("@")[0];

  return (
    <section className="workspace-page narrow-workspace">
      <div className="workspace-heading">
        <div><span className="dashboard-kicker">ACCOUNT</span><h1>Your profile</h1><p>The identity connected to your Desktopalie workspace.</p></div>
      </div>
      <div className="profile-page-card">
        <UserAvatar user={user} className="profile-page-avatar"/>
        <div>
          <small>FULL NAME</small><strong>{name}</strong>
          <small>USERNAME</small><strong>@{username}</strong>
          <small>EMAIL ADDRESS</small><strong>{user?.email}</strong>
          <small>LOCATION</small><strong>{profile?.location || "Indonesia"}</strong>
          <small>BIO</small><p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 12px" }}>{profile?.bio || "Independent designer & developer"}</p>
          <small>USER ID</small><code>{user?.id}</code>
        </div>
      </div>
    </section>
  );
}

function SearchPage({ user }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      const [projects, experiments, notes] = await Promise.all([
        fetchCollection("projects", user?.id),
        fetchCollection("experiments", user?.id),
        fetchCollection("notes", user?.id),
      ]);
      const all = [
        ...projects.map(item => ({ ...item, section: "projects" })),
        ...experiments.map(item => ({ ...item, section: "experiments" })),
        ...notes.map(item => ({ ...item, section: "notes" })),
      ];
      const filtered = all.filter(item => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
      setLoading(false);
    }
    performSearch();
  }, [query, user?.id]);

  return <section className="workspace-page">
    <div className="workspace-heading"><div><span className="dashboard-kicker">SEARCH</span><h1>Results for “{query}”</h1><p>{loading ? "Searching..." : `${results.length} matching items found.`}</p></div></div>
    <div className="workspace-list">
      {results.map(item => (
        <Link className="workspace-card" to={`/dashboard/${item.section}/${item.slug}`} key={`${item.section}-${item.id || item.slug}`}>
          <i className="violet"><FaFolderOpen/></i>
          <div><span>{item.type}</span><h2>{item.title}</h2><p>{item.description}</p></div>
          <FaArrowRight/>
        </Link>
      ))}
    </div>
  </section>;
}

export default function WorkspaceContent({ path, theme, setTheme, user }) {
  const segments = path.replace(/^\/dashboard\/?/,"").split("/").filter(Boolean);
  const section = segments[0] || "overview";
  const action = segments[1];

  if (section === "projects") return action === "new" ? <NewItemPage type="projects" user={user} /> : action ? <DetailPage type="projects" slug={action}/> : <CollectionPage type="projects" title="Projects" description="Case studies, products, and client work in every stage." icon={FaFolderOpen} user={user} />;
  if (section === "experiments") return action === "new" ? <NewItemPage type="experiments" user={user} /> : action ? <DetailPage type="experiments" slug={action}/> : <CollectionPage type="experiments" title="Experiments" description="Prototypes and small ideas created to learn something new." icon={FaFlask} user={user} />;
  if (section === "notes") return action === "new" ? <NewItemPage type="notes" user={user} /> : action ? <DetailPage type="notes" slug={action}/> : <CollectionPage type="notes" title="Creative notes" description="Thoughts, lessons, and references worth keeping." icon={FaStickyNote} user={user} />;
  if (section === "bookmarks") return <BookmarksPage user={user} />;
  if (section === "notifications") return <NotificationsPage/>;
  if (section === "settings") return <SettingsPage theme={theme} setTheme={setTheme} user={user}/>;
  if (section === "profile") return <ProfilePage user={user}/>;
  if (section === "search") return <SearchPage user={user}/>;

  return null;
}
