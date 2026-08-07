import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaBookmark, FaCog, FaEllipsisH, FaFlask, FaFolderOpen, FaHome, FaMoon, FaSearch, FaSignOutAlt, FaStickyNote, FaSun, FaThLarge, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import WorkspaceContent, { OverviewContent } from "./WorkspaceContent";
import "./Dashboard.css";

const NAVIGATION = [
  { label: "Overview", icon: FaThLarge, to: "/dashboard" },
  { label: "Projects", icon: FaFolderOpen, to: "/dashboard/projects" },
  { label: "Experiments", icon: FaFlask, to: "/dashboard/experiments" },
  { label: "Notes", icon: FaStickyNote, to: "/dashboard/notes" },
  { label: "Bookmarks", icon: FaBookmark, to: "/dashboard/bookmarks" },
];
function BrandMark(){return <span className="studio-brand-mark" aria-hidden="true"><span/><span/></span>}

export default function Dashboard(){
  const {user,logout}=useAuth();const navigate=useNavigate();const location=useLocation();const searchRef=useRef(null);
  const [theme,setTheme]=useState(()=>localStorage.getItem("desktopalie-theme")||"dark");const [sidebarOpen,setSidebarOpen]=useState(false);const [query,setQuery]=useState("");
  useEffect(()=>{localStorage.setItem("desktopalie-theme",theme);document.documentElement.style.colorScheme=theme},[theme]);
  useEffect(()=>{function shortcut(event){if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();searchRef.current?.focus()}}window.addEventListener("keydown",shortcut);return()=>window.removeEventListener("keydown",shortcut)},[]);
  const fullName=user?.user_metadata?.full_name||user?.email?.split("@")[0]||"Creator";const firstName=fullName.split(" ")[0];const initials=fullName.split(" ").slice(0,2).map(part=>part[0]).join("").toUpperCase();
  async function handleLogout(){await logout();navigate("/")}
  function submitSearch(event){event.preventDefault();if(query.trim())navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`)}
  const overview=location.pathname==="/dashboard"||location.pathname==="/dashboard/";
  return <div className="studio-dashboard" data-theme={theme}>
    <div className={`studio-overlay ${sidebarOpen?"visible":""}`} onClick={()=>setSidebarOpen(false)}/>
    <aside className={`studio-sidebar ${sidebarOpen?"open":""}`}>
      <div className="sidebar-head"><Link to="/" className="studio-brand"><BrandMark/><span>desktopalie</span></Link><button className="sidebar-close" onClick={()=>setSidebarOpen(false)} aria-label="Close navigation"><FaTimes/></button></div>
      <nav className="sidebar-nav"><span className="nav-label">Workspace</span>{NAVIGATION.map(({label,icon:Icon,to})=>{const active=to==="/dashboard"?overview:location.pathname.startsWith(to);return <Link className={`sidebar-link ${active?"active":""}`} to={to} onClick={()=>setSidebarOpen(false)} key={label}><Icon/><span>{label}</span>{label==="Notes"&&<b>8</b>}</Link>})}</nav>
      <Link className="sidebar-lab-card" to="/dashboard/experiments"><div className="lab-icon"><FaFlask/></div><strong>Keep experimenting.</strong><p>Your next interesting idea may start as a tiny prototype.</p><span>Open the lab →</span></Link>
      <div className="sidebar-bottom"><Link className={`sidebar-link ${location.pathname==="/dashboard/settings"?"active":""}`} to="/dashboard/settings"><FaCog/><span>Settings</span></Link><button className="sidebar-link logout-link" onClick={handleLogout}><FaSignOutAlt/><span>Sign out</span></button><Link className="sidebar-profile" to="/dashboard/profile"><span className="profile-avatar">{initials}</span><div><strong>{fullName}</strong><span>{user?.email}</span></div><FaEllipsisH/></Link></div>
    </aside>
    <main className="studio-main">
      <header className="studio-topbar"><button className="mobile-menu" onClick={()=>setSidebarOpen(true)} aria-label="Open navigation"><FaBars/></button><form className="dashboard-search" onSubmit={submitSearch}><FaSearch/><input ref={searchRef} type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search projects, notes, experiments..."/><kbd>⌘ K</kbd></form><div className="topbar-actions"><Link to="/" className="view-site"><FaHome/><span>View website</span></Link><button className="topbar-icon" onClick={()=>setTheme(current=>current==="dark"?"light":"dark")} aria-label="Toggle color theme">{theme==="dark"?<FaSun/>:<FaMoon/>}</button><Link className="topbar-icon notification-button" to="/dashboard/notifications" aria-label="Notifications"><FaBell/><span/></Link><Link className="topbar-avatar" to="/dashboard/profile">{initials}</Link></div></header>
      <div className="studio-content">{overview?<OverviewContent firstName={firstName}/>:<WorkspaceContent path={location.pathname} theme={theme} setTheme={setTheme} user={user}/>}</div>
    </main>
  </div>
}
