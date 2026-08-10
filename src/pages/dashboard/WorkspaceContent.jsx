import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaBell, 
  FaBookmark, 
  FaCheckCircle, 
  FaClock, 
  FaEdit, 
  FaExternalLinkAlt, 
  FaFlask, 
  FaFolderOpen, 
  FaPlus, 
  FaSave, 
  FaSearch, 
  FaSpinner, 
  FaStickyNote, 
  FaTimes, 
  FaTrash,
  FaThList,
  FaThLarge
} from "react-icons/fa";
import UserAvatar from "../../component/UserAvatar";
import "./WorkspaceContent.css";
import { toggleThemeWithTransition } from "../../utils/theme";
import { 
  createItem, 
  deleteItem, 
  fetchCollection, 
  fetchItemBySlug, 
  updateItem,
  fetchProfile,
  updateProfile
} from "../../services/workspaceService";
import { supabase } from "../../lib/supabase";

export function OverviewContent({ firstName }) {
  const [stats, setStats] = useState({ projects: 0, experiments: 0, notes: 0, bookmarks: 0 });
  const weekly = [42, 68, 47, 82, 58, 92, 72];

  useEffect(() => {
    async function loadStats() {
      const [projects, experiments, notes, bookmarks] = await Promise.all([
        fetchCollection("projects"),
        fetchCollection("experiments"),
        fetchCollection("notes"),
        fetchCollection("bookmarks"),
      ]);
      setStats({
        projects: projects.length,
        experiments: experiments.length,
        notes: notes.length,
        bookmarks: bookmarks.length,
      });
    }
    loadStats();
  }, []);

  return <>
    <section className="welcome-row">
      <div>
        <span className="dashboard-kicker">PERSONAL WORKSPACE / 2026</span>
        <h1>Good to see you, {firstName}.</h1>
        <p>Here is what is happening across your creative workspace today.</p>
      </div>
      <Link className="new-project-button" to="/dashboard/projects/new"><FaPlus /> New project</Link>
    </section>
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-head"><span>Active projects</span><i className="violet"><FaFolderOpen /></i></div>
        <strong>{String(stats.projects).padStart(2, "0")}</strong>
        <p><b>Real-time</b> from Supabase</p>
      </article>
      <article className="stat-card">
        <div className="stat-head"><span>Experiments</span><i className="teal"><FaFlask /></i></div>
        <strong>{String(stats.experiments).padStart(2, "0")}</strong>
        <p><b>Real-time</b> from Supabase</p>
      </article>
      <article className="stat-card">
        <div className="stat-head"><span>Creative notes</span><i className="amber"><FaStickyNote /></i></div>
        <strong>{String(stats.notes).padStart(2, "0")}</strong>
        <p><b>Real-time</b> from Supabase</p>
      </article>
      <article className="stat-card">
        <div className="stat-head"><span>Saved Bookmarks</span><i className="rose"><FaBookmark /></i></div>
        <strong>{String(stats.bookmarks).padStart(2, "0")}</strong>
        <p><b>Real-time</b> from Supabase</p>
      </article>
    </section>
  </>;
}

function EditItemModal({ isOpen, onClose, item, type, onSaveSuccess }) {
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    status: "Draft",
    tone: "violet",
    progress: 0
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        type: item.type || "",
        description: item.description || "",
        status: item.status || "Draft",
        tone: item.tone || "violet",
        progress: item.progress || 0
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      await updateItem(type, item.id, form);
      onSaveSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to update item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "16px"
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "520px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Edit {type.slice(0, -1)}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: 0, color: "var(--muted)", cursor: "pointer", fontSize: "16px" }}><FaTimes /></button>
        </div>

        {errorMsg && <div style={{ color: "var(--rose)", marginBottom: "16px", fontSize: "13px" }}>{errorMsg}</div>}

        <form onSubmit={handleUpdate} className="workspace-form" style={{ padding: 0, border: 0, background: "transparent" }}>
          <label>Title<input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required /></label>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <label>Category<input value={form.type} onChange={e=>setForm({...form, type: e.target.value})} required /></label>
            <label>Tone Color
              <select value={form.tone} onChange={e=>setForm({...form, tone: e.target.value})} style={{ width: "100%", marginTop: "8px", padding: "13px", border: "1px solid var(--line)", borderRadius: "7px", background: "var(--raised)", color: "var(--text)" }}>
                <option value="violet">Violet</option>
                <option value="teal">Teal</option>
                <option value="amber">Amber</option>
                <option value="rose">Rose</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <label>Status<input value={form.status} onChange={e=>setForm({...form, status: e.target.value})} /></label>
            {type === "projects" && (
              <label>Progress ({form.progress}%)
                <input type="number" min="0" max="100" value={form.progress} onChange={e=>setForm({...form, progress: parseInt(e.target.value)||0})} />
              </label>
            )}
          </div>

          <label>Description<textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows="4" required /></label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 16px", borderRadius: "7px", border: "1px solid var(--line)", background: "transparent", color: "var(--text)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
            <button type="submit" className="new-project-button" disabled={saving}>
              {saving ? <FaSpinner className="fa-spin" /> : <><FaSave /> Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CollectionPage({ type, title, description, icon: Icon }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await fetchCollection(type);
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [type]);

  const loadDataAgain = async () => {
    const data = await fetchCollection(type);
    setItems(data);
  };

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteItem(type, "id", id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete item: " + err.message);
    }
  }

  const filteredItems = items.filter(item => 
    (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(search.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  return <section className="workspace-page">
    <div className="workspace-heading">
      <div>
        <span className="dashboard-kicker">WORKSPACE / {type.toUpperCase()}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "7px", padding: "3px" }}>
          <button 
            onClick={() => setViewMode("grid")}
            style={{ border: 0, background: viewMode === "grid" ? "var(--raised)" : "transparent", color: viewMode === "grid" ? "var(--text)" : "var(--muted)", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center" }}
            title="Grid View"
          >
            <FaThLarge />
          </button>
          <button 
            onClick={() => setViewMode("table")}
            style={{ border: 0, background: viewMode === "table" ? "var(--raised)" : "transparent", color: viewMode === "table" ? "var(--text)" : "var(--muted)", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center" }}
            title="Table View"
          >
            <FaThList />
          </button>
        </div>
        <Link className="new-project-button" to={`/dashboard/${type}/new`}><FaPlus /> New {type === "notes" ? "note" : type.slice(0,-1)}</Link>
      </div>
    </div>

    {/* Search Toolbar */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "12px", flexWrap: "wrap" }}>
      <div style={{ position: "relative", flex: "1", maxWidth: "350px" }}>
        <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "12px" }} />
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1px solid var(--line)", borderRadius: "7px", background: "var(--surface)", color: "var(--text)", outline: 0, fontSize: "12px" }}
        />
      </div>
      <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>
        TOTAL: <strong>{filteredItems.length}</strong> ITEMS
      </span>
    </div>

    {loading ? (
      <div className="empty-state" style={{ padding: "40px 0" }}>
        <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} />
        <p style={{ marginTop: "12px" }}>Loading {type} from Supabase...</p>
      </div>
    ) : filteredItems.length === 0 ? (
      <div className="empty-state">
        <h2>No {type} found.</h2>
        <p>Click below to add your first item.</p>
        <Link className="new-project-button" to={`/dashboard/${type}/new`}><FaPlus /> Create {type.slice(0,-1)}</Link>
      </div>
    ) : viewMode === "grid" ? (
      <div className="workspace-list">
        {filteredItems.map((item) => (
          <div className="workspace-card" key={item.id || item.slug} style={{ gridTemplateColumns: "43px 1fr auto auto auto" }}>
            <i className={item.tone || "violet"}><Icon/></i>
            <div>
              <span>{item.type}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <b>{item.status || "Draft"}</b>
            <button onClick={() => setEditingItem(item)} title="Edit Item" style={{ cursor: "pointer" }}><FaEdit /></button>
            <Link to={`/dashboard/${type}/${item.slug}`} style={{ display: "flex", alignItems: "center" }}><FaArrowRight /></Link>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ border: "1px solid var(--line)", borderRadius: "10px", overflow: "hidden", background: "var(--surface)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--raised)", color: "var(--muted)", textTransform: "uppercase", fontSize: "10px" }}>
              <th style={{ padding: "12px 16px" }}>Title & Slug</th>
              <th style={{ padding: "12px 16px" }}>Category</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id || item.slug} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "14px 16px" }}>
                  <Link to={`/dashboard/${type}/${item.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontWeight: 700 }}>
                    {item.title}
                  </Link>
                  <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>{item.slug}</div>
                </td>
                <td style={{ padding: "14px 16px", color: "var(--muted)" }}>{item.type}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: "99px", background: "var(--raised)", fontSize: "10px", fontWeight: 600, color: "var(--accent)" }}>
                    {item.status || "Draft"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "8px" }}>
                    <button onClick={() => setEditingItem(item)} style={{ background: "transparent", border: 0, color: "var(--text)", cursor: "pointer" }} title="Edit"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.id, item.title)} style={{ background: "transparent", border: 0, color: "var(--rose)", cursor: "pointer" }} title="Delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Modal Edit Item */}
    <EditItemModal
      isOpen={!!editingItem}
      onClose={() => setEditingItem(null)}
      item={editingItem}
      type={type}
      onSaveSuccess={loadDataAgain}
    />
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
    <div className="workspace-heading">
      <div>
        <span className="dashboard-kicker">NEW {singular.toUpperCase()}</span>
        <h1>Create a {singular}.</h1>
        <p>Saved directly to your Supabase database.</p>
      </div>
    </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: "", url: "", source: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    setLoading(true);
    const data = await fetchCollection("bookmarks");
    setItems(data);
    setLoading(false);
  }

  async function handleAddBookmark(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createItem("bookmarks", newBookmark, user?.id);
      setIsModalOpen(false);
      setNewBookmark({ title: "", url: "", source: "" });
      loadBookmarks();
    } catch (err) {
      alert("Failed to add bookmark: " + err.message);
    } finally {
      setSaving(false);
    }
  }

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
      <button className="new-project-button" onClick={() => setIsModalOpen(true)}><FaPlus /> Add Bookmark</button>
    </div>
    {loading ? (
      <div className="empty-state"><FaSpinner className="fa-spin" style={{ fontSize: "24px", color: "var(--accent)" }} /><p style={{ marginTop: "12px" }}>Loading bookmarks...</p></div>
    ) : (
      <div className="workspace-list">
        {items.map(item => (
          <article className="workspace-card" key={item.id || item.url}>
            <i className="violet"><FaBookmark/></i>
            <div><span>{item.source || "Web"}</span><h2>{item.title}</h2><p>{item.url}</p></div>
            <a href={item.url} target="_blank" rel="noreferrer"><FaExternalLinkAlt/></a>
            <button onClick={() => removeBookmark(item.id)} aria-label={`Remove ${item.title}`}><FaTrash/></button>
          </article>
        ))}
      </div>
    )}

    {/* Add Bookmark Modal */}
    {isModalOpen && (
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }} onClick={() => setIsModalOpen(false)}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", width: "100%", maxWidth: "460px", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Add New Bookmark</h3>
            <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: 0, color: "var(--muted)", cursor: "pointer" }}><FaTimes /></button>
          </div>
          <form onSubmit={handleAddBookmark} className="workspace-form" style={{ padding: 0, border: 0, background: "transparent" }}>
            <label>Title<input value={newBookmark.title} onChange={e=>setNewBookmark({...newBookmark, title: e.target.value})} placeholder="e.g. React Docs" required /></label>
            <label>URL Address<input type="url" value={newBookmark.url} onChange={e=>setNewBookmark({...newBookmark, url: e.target.value})} placeholder="https://react.dev" required /></label>
            <label>Source / Category<input value={newBookmark.source} onChange={e=>setNewBookmark({...newBookmark, source: e.target.value})} placeholder="Official Docs, Design..." /></label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 16px", borderRadius: "7px", border: "1px solid var(--line)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>Cancel</button>
              <button type="submit" className="new-project-button" disabled={saving}>
                {saving ? <FaSpinner className="fa-spin" /> : <><FaSave /> Save Bookmark</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </section>;
}

function NotificationsPage(){return <section className="workspace-page"><div className="workspace-heading"><div><span className="dashboard-kicker">INBOX</span><h1>Notifications</h1><p>Updates from across your creative workspace.</p></div></div><div className="workspace-list">{["Frame Archive is ready to publish","Your weekly creative summary is available","A new sign-in was detected"].map((title,index)=><article className="workspace-card" key={title}><i className={index===2?"amber":"teal"}><FaBell/></i><div><span>{index===0?"PROJECT":"SYSTEM"}</span><h2>{title}</h2><p>{index===0?"The project has completed all publishing checks.":"Open this update to review the details."}</p></div><b>{index===0?"Now":`${index}d`}</b></article>)}</div></section>}

function SettingsPage({theme,setTheme,user}){return <section className="workspace-page narrow-workspace"><div className="workspace-heading"><div><span className="dashboard-kicker">PREFERENCES</span><h1>Settings</h1><p>Control how your Desktopalie workspace looks and behaves.</p></div></div><div className="settings-list"><div><span><strong>Color theme</strong><small>Choose the workspace appearance.</small></span><select value={theme} onChange={e=>toggleThemeWithTransition(e, theme, setTheme, e.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></div><div><span><strong>Email notifications</strong><small>Receive a weekly summary at {user?.email}.</small></span><input type="checkbox" defaultChecked/></div><div><span><strong>Reduce visual motion</strong><small>Minimize non-essential interface animation.</small></span><input type="checkbox"/></div></div></section>}

function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", username: "", location: "", bio: "", website: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  async function loadProfileData() {
    if (!user) return;
    const data = await fetchProfile(user.id);
    if (data) {
      setProfile(data);
      setEditForm({
        full_name: data.full_name || "",
        username: data.username || "",
        location: data.location || "Indonesia",
        bio: data.bio || "Independent designer & developer",
        website: data.website || ""
      });
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(user.id, editForm);
      await loadProfileData();
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";
  const username = profile?.username || user?.user_metadata?.username || user?.email?.split("@")[0];

  return (
    <section className="workspace-page narrow-workspace">
      <div className="workspace-heading">
        <div>
          <span className="dashboard-kicker">ACCOUNT</span>
          <h1>Your profile</h1>
          <p>The identity connected to your Desktopalie workspace.</p>
        </div>
        <button className="new-project-button" onClick={() => setIsEditing(true)}>
          <FaEdit /> Edit profile
        </button>
      </div>

      <div className="profile-page-card">
        <UserAvatar user={user} className="profile-page-avatar"/>
        <div>
          <small>FULL NAME</small><strong>{name}</strong>
          <small>USERNAME</small><strong>@{username}</strong>
          <small>EMAIL ADDRESS</small><strong>{user?.email}</strong>
          <small>LOCATION</small><strong>{profile?.location || "Indonesia"}</strong>
          <small>BIO</small><p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 12px" }}>{profile?.bio || "Independent designer & developer"}</p>
          {profile?.website && <><small>WEBSITE</small><a href={profile.website} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "11px" }}>{profile.website}</a></>}
          <small>USER ID</small><code>{user?.id}</code>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }} onClick={() => setIsEditing(false)}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", width: "100%", maxWidth: "500px", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Edit Account Profile</h3>
              <button onClick={() => setIsEditing(false)} style={{ background: "transparent", border: 0, color: "var(--muted)", cursor: "pointer" }}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="workspace-form" style={{ padding: 0, border: 0, background: "transparent" }}>
              <label>Full Name<input value={editForm.full_name} onChange={e=>setEditForm({...editForm, full_name: e.target.value})} placeholder="Faiz Ali" required /></label>
              <label>Username<input value={editForm.username} onChange={e=>setEditForm({...editForm, username: e.target.value})} placeholder="faizali" required /></label>
              <label>Location<input value={editForm.location} onChange={e=>setEditForm({...editForm, location: e.target.value})} placeholder="Indonesia" /></label>
              <label>Website URL<input type="url" value={editForm.website} onChange={e=>setEditForm({...editForm, website: e.target.value})} placeholder="https://desktopalie.com" /></label>
              <label>Bio<textarea value={editForm.bio} onChange={e=>setEditForm({...editForm, bio: e.target.value})} rows="3" /></label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "10px 16px", borderRadius: "7px", border: "1px solid var(--line)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="new-project-button" disabled={saving}>
                  {saving ? <FaSpinner className="fa-spin" /> : <><FaSave /> Save Profile</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      const [projects, experiments, notes] = await Promise.all([
        fetchCollection("projects"),
        fetchCollection("experiments"),
        fetchCollection("notes"),
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
  }, [query]);

  return <section className="workspace-page">
    <div className="workspace-heading">
      <div><span className="dashboard-kicker">SEARCH</span><h1>Results for “{query}”</h1><p>{loading ? "Searching..." : `${results.length} matching items found.`}</p></div>
    </div>
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

  if (section === "projects") return action === "new" ? <NewItemPage type="projects" user={user} /> : action ? <DetailPage type="projects" slug={action}/> : <CollectionPage type="projects" title="Projects" description="Case studies, products, and client work in every stage." icon={FaFolderOpen}/>;
  if (section === "experiments") return action === "new" ? <NewItemPage type="experiments" user={user} /> : action ? <DetailPage type="experiments" slug={action}/> : <CollectionPage type="experiments" title="Experiments" description="Prototypes and small ideas created to learn something new." icon={FaFlask}/>;
  if (section === "notes") return action === "new" ? <NewItemPage type="notes" user={user} /> : action ? <DetailPage type="notes" slug={action}/> : <CollectionPage type="notes" title="Creative notes" description="Thoughts, lessons, and references worth keeping." icon={FaStickyNote}/>;
  if (section === "bookmarks") return <BookmarksPage user={user} />;
  if (section === "notifications") return <NotificationsPage/>;
  if (section === "settings") return <SettingsPage theme={theme} setTheme={setTheme} user={user}/>;
  if (section === "profile") return <ProfilePage user={user}/>;
  if (section === "search") return <SearchPage/>;

  return null;
}
