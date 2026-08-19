import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaDatabase,
  FaLayerGroup,
  FaPlus,
  FaPlusCircle,
  FaShieldAlt,
  FaSlidersH,
  FaSync,
  FaTimes,
} from "react-icons/fa";
import { usePlatform } from "../../context/PlatformContext";
import { fetchTenantMetrics } from "../../services/workspaceService";
import DesktopalieMark from "../../component/DesktopalieMark";
import "./TenantManagement.css";

export default function TenantManagement({ user }) {
  const { activePlatform, activePlatformId, setPlatform, platforms, addCustomPlatform, updatePlatformStatus } = usePlatform();

  const [metrics, setMetrics] = useState({});
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTenantDetail, setSelectedTenantDetail] = useState(null);

  // New tenant form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    code: "",
    category: "ENTERPRISE SOLUTION",
    logoSymbol: "⚡",
    color: "#8B5CF6",
    tagline: "",
    heroTitle: "",
    heroSubtitle: "",
    status: "Active",
  });

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    const data = await fetchTenantMetrics();
    setMetrics(data);
    setLoadingMetrics(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleCreateTenant = (e) => {
    e.preventDefault();
    if (!form.id || !form.name) return;

    const slug = form.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    const colorHover = form.color;
    const colorGlow = `${form.color}55`;
    const badgeBg = `${form.color}25`;

    addCustomPlatform({
      id: slug,
      name: form.name,
      code: form.code || `${form.name.toUpperCase()} ${form.logoSymbol}`,
      category: form.category,
      tagline: form.tagline || `${form.name} Enterprise Platform`,
      heroTitle: form.heroTitle || `High Performance ${form.name} Infrastructure`,
      heroSubtitle: form.heroSubtitle || `Accelerating business outcomes with ${form.name} tenant architecture.`,
      heroBadge: `${form.logoSymbol} PLATFORM ${form.name.toUpperCase()} • CUSTOM TENANT`,
      color: form.color,
      colorHover,
      colorGlow,
      badgeBg,
      badgeText: form.color,
      bgGradient: `radial-gradient(ellipse at 50% 0%, ${form.color}33 0%, #0B0F19 75%)`,
      pageBg: "#0B0F19",
      surfaceBg: "rgba(17, 24, 39, 0.85)",
      headerBg: "rgba(11, 15, 25, 0.85)",
      cardBorder: `${form.color}40`,
      fontFamily: "'Inter', system-ui, sans-serif",
      layoutVariant: "custom-tenant",
      logoSymbol: form.logoSymbol,
      status: form.status,
      stats: [
        { label: "Query Latency", value: "< 1.5ms" },
        { label: "SLA Uptime", value: "99.99%" },
        { label: "Active Nodes", value: "512" },
      ],
      features: [
        "Dynamic PostgreSQL RLS Tenant Partition",
        "Custom SSL & Multi-Domain Edge Routing",
        "Automated Subtenant Data Sync",
      ],
    });

    setShowAddModal(false);
    setForm({
      id: "",
      name: "",
      code: "",
      category: "ENTERPRISE SOLUTION",
      logoSymbol: "⚡",
      color: "#8B5CF6",
      tagline: "",
      heroTitle: "",
      heroSubtitle: "",
      status: "Active",
    });
  };

  const platformList = Object.values(platforms);
  const totalTenants = platformList.length;
  const activeCount = platformList.filter((p) => (p.status || "Active") === "Active").length;

  return (
    <section className="workspace-page tenant-management-page">
      {/* HEADER SECTION */}
      <div className="workspace-heading tenant-heading">
        <div>
          <span className="dashboard-kicker">MULTI-TENANT BACKOFFICE HUB</span>
          <h1>Platforms & Tenants Manager</h1>
          <p>Supervise multi-platform tenancy, database RLS isolation, status modes, and tenant metrics.</p>
        </div>
        <div className="tenant-heading-actions">
          <button className="refresh-metrics-btn" onClick={loadMetrics} title="Refresh live metrics">
            <FaSync className={loadingMetrics ? "fa-spin" : ""} /> Refresh Data
          </button>
          <button className="new-tenant-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Register New Tenant
          </button>
        </div>
      </div>

      {/* TOP SYSTEM OVERVIEW BAR */}
      <div className="tenant-overview-stats">
        <div className="overview-card">
          <div className="overview-icon violet">
            <FaLayerGroup />
          </div>
          <div>
            <span className="overview-label">Total Registered Tenants</span>
            <strong className="overview-value">{totalTenants} Platforms</strong>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon teal">
            <FaCheckCircle />
          </div>
          <div>
            <span className="overview-label">Active Operational Tenants</span>
            <strong className="overview-value">{activeCount} / {totalTenants} Live</strong>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon amber">
            <FaShieldAlt />
          </div>
          <div>
            <span className="overview-label">Database RLS Isolation</span>
            <strong className="overview-value">Enforced 100%</strong>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon rose">
            <FaDatabase />
          </div>
          <div>
            <span className="overview-label">Realtime Partition Stream</span>
            <strong className="overview-value">Supabase Postgres</strong>
          </div>
        </div>
      </div>

      {/* ACTIVE TENANT BANNER */}
      <div className="active-tenant-banner" style={{ borderColor: activePlatform.color, boxShadow: `0 8px 30px ${activePlatform.colorGlow || "rgba(99,102,241,0.2)"}` }}>
        <div className="active-tenant-badge" style={{ background: activePlatform.badgeBg, color: activePlatform.badgeText }}>
          <span>CURRENT ACTIVE CONTEXT</span>
        </div>
        <div className="active-tenant-content">
          <div className="active-tenant-symbol" style={{ color: activePlatform.color, borderColor: `${activePlatform.color}50` }}>
            <DesktopalieMark platform={activePlatform.id} style={{ width: "32px", height: "32px", color: activePlatform.color }} />
          </div>
          <div className="active-tenant-info">
            <h2>{activePlatform.name} <code>({activePlatform.id.toUpperCase()})</code></h2>
            <p>{activePlatform.tagline || activePlatform.heroSubtitle}</p>
            <div className="active-tenant-tags">
              <span className="tenant-tag" style={{ background: `${activePlatform.color}20`, color: activePlatform.color }}>
                {activePlatform.category}
              </span>
              <span className="tenant-tag status-pill active">● Active Session</span>
              <span className="tenant-tag">Layout: {activePlatform.layoutVariant || "Default"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TENANTS GRID */}
      <div className="tenant-grid-heading">
        <h2>Registered Platform Tenants ({totalTenants})</h2>
        <p>Switch active workspace context or toggle operational status (Active / Maintenance / Staging).</p>
      </div>

      <div className="tenant-cards-grid">
        {platformList.map((platform) => {
          const isCurrentActive = platform.id === activePlatformId;
          const status = platform.status || "Active";
          const tenantMetric = metrics[platform.id] || { projects: 0, experiments: 0, notes: 0, total: 0 };

          return (
            <div
              key={platform.id}
              className={`tenant-card ${isCurrentActive ? "selected-active" : ""}`}
              style={{
                borderColor: isCurrentActive ? platform.color : "var(--line, rgba(255,255,255,0.08))",
              }}
            >
              <div className="tenant-card-header">
                <div className="tenant-identity">
                  <span className="tenant-icon-box" style={{ background: platform.badgeBg || "rgba(99,102,241,0.15)", color: platform.color }}>
                    <DesktopalieMark platform={platform.id} style={{ width: "24px", height: "24px", color: platform.color }} />
                  </span>
                  <div>
                    <h3>{platform.name}</h3>
                    <span className="tenant-code-sub">{platform.code}</span>
                  </div>
                </div>

                <div className="tenant-status-picker">
                  <select
                    value={status}
                    onChange={(e) => updatePlatformStatus(platform.id, e.target.value)}
                    className={`status-select ${status.toLowerCase()}`}
                  >
                    <option value="Active">● Active</option>
                    <option value="Staging">▲ Staging</option>
                    <option value="Maintenance">✖ Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="tenant-tagline">{platform.tagline}</div>

              {/* METRICS ROW */}
              <div className="tenant-metrics-list">
                <div className="metric-box">
                  <span>Projects</span>
                  <strong>{tenantMetric.projects}</strong>
                </div>
                <div className="metric-box">
                  <span>Experiments</span>
                  <strong>{tenantMetric.experiments}</strong>
                </div>
                <div className="metric-box">
                  <span>Notes</span>
                  <strong>{tenantMetric.notes}</strong>
                </div>
              </div>

              {/* STATS HIGHLIGHT */}
              {platform.stats && (
                <div className="tenant-stats-row">
                  {platform.stats.map((st, i) => (
                    <div key={i} className="stat-pill">
                      <small>{st.label}:</small> <b>{st.value}</b>
                    </div>
                  ))}
                </div>
              )}

              {/* ACTIONS FOOTER */}
              <div className="tenant-card-actions">
                <button
                  className={`switch-context-btn ${isCurrentActive ? "active-now" : ""}`}
                  onClick={() => setPlatform(platform.id)}
                  disabled={isCurrentActive}
                >
                  {isCurrentActive ? "Active Context" : "Switch to Tenant"}
                </button>
                <button
                  className="config-tenant-btn"
                  onClick={() => setSelectedTenantDetail(platform)}
                  title="Inspect Tenant Config"
                >
                  <FaSlidersH /> Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RLS ISOLATION TABLE INSPECTOR */}
      <div className="tenant-isolation-section">
        <div className="isolation-header">
          <div className="isolation-title">
            <FaShieldAlt style={{ color: "var(--teal)" }} />
            <div>
              <h3>Supabase Row Level Security (RLS) Isolation Inspector</h3>
              <p>Ensuring data records are isolated cleanly using <code>platform_id</code> partition key.</p>
            </div>
          </div>
        </div>

        <div className="isolation-table-wrap">
          <table className="isolation-table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Partition Key</th>
                <th>RLS Policy Status</th>
                <th>Alpha Record Count</th>
                <th>Beta Record Count</th>
                <th>Gamma Record Count</th>
                <th>Delta Record Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>public.projects</code></td>
                <td><code>platform_id</code></td>
                <td><span className="rls-badge enabled">Enforced</span></td>
                <td>{metrics["alpha"]?.projects || 0}</td>
                <td>{metrics["beta"]?.projects || 0}</td>
                <td>{metrics["gamma"]?.projects || 0}</td>
                <td>{metrics["delta"]?.projects || 0}</td>
              </tr>
              <tr>
                <td><code>public.experiments</code></td>
                <td><code>platform_id</code></td>
                <td><span className="rls-badge enabled">Enforced</span></td>
                <td>{metrics["alpha"]?.experiments || 0}</td>
                <td>{metrics["beta"]?.experiments || 0}</td>
                <td>{metrics["gamma"]?.experiments || 0}</td>
                <td>{metrics["delta"]?.experiments || 0}</td>
              </tr>
              <tr>
                <td><code>public.notes</code></td>
                <td><code>platform_id</code></td>
                <td><span className="rls-badge enabled">Enforced</span></td>
                <td>{metrics["alpha"]?.notes || 0}</td>
                <td>{metrics["beta"]?.notes || 0}</td>
                <td>{metrics["gamma"]?.notes || 0}</td>
                <td>{metrics["delta"]?.notes || 0}</td>
              </tr>
              <tr>
                <td><code>public.bookmarks</code></td>
                <td><code>user_id</code></td>
                <td><span className="rls-badge enabled">Global Shared</span></td>
                <td colSpan="4" style={{ textAlign: "center", color: "var(--muted)" }}>Shared across user workspace</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW TENANT MODAL */}
      {showAddModal && (
        <div className="tenant-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="tenant-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tenant-modal-head">
              <h3>Register New Platform Tenant</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="tenant-modal-form">
              <div className="form-row-2">
                <label>
                  <span>Tenant ID (Slug)*</span>
                  <input
                    type="text"
                    placeholder="e.g. omega, titan, zeta"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required
                  />
                </label>

                <label>
                  <span>Platform Display Name*</span>
                  <input
                    type="text"
                    placeholder="e.g. Omega Platform"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="form-row-3">
                <label>
                  <span>Symbol Emoji</span>
                  <input
                    type="text"
                    placeholder="⚡, 🌿, 🚀, 💎"
                    value={form.logoSymbol}
                    onChange={(e) => setForm({ ...form, logoSymbol: e.target.value })}
                  />
                </label>

                <label>
                  <span>Primary Color</span>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    style={{ height: "42px", padding: "4px" }}
                  />
                </label>

                <label>
                  <span>Initial Status</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Staging">Staging</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Category Banner</span>
                <input
                  type="text"
                  placeholder="e.g. CLOUD ARCHITECTURE & AI HUB"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </label>

              <label>
                <span>Tagline</span>
                <input
                  type="text"
                  placeholder="e.g. Titan Hub • Next-Gen AI Compute Infrastructure"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </label>

              <label>
                <span>Hero Title</span>
                <input
                  type="text"
                  placeholder="Headline for landing page..."
                  value={form.heroTitle}
                  onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                />
              </label>

              <div className="modal-form-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <FaPlusCircle /> Create Platform Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TENANT DETAIL MODAL */}
      {selectedTenantDetail && (
        <div className="tenant-modal-overlay" onClick={() => setSelectedTenantDetail(null)}>
          <div className="tenant-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tenant-modal-head">
              <h3>Tenant Configuration: {selectedTenantDetail.name}</h3>
              <button onClick={() => setSelectedTenantDetail(null)} className="modal-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="tenant-detail-body">
              <div className="detail-hero-box" style={{ background: selectedTenantDetail.bgGradient || "var(--raised)" }}>
                <span className="symbol-large" style={{ color: selectedTenantDetail.color }}>
                  <DesktopalieMark platform={selectedTenantDetail.id} style={{ width: "36px", height: "36px", color: selectedTenantDetail.color }} />
                </span>
                <div>
                  <h4>{selectedTenantDetail.name}</h4>
                  <code>ID: {selectedTenantDetail.id}</code>
                  <p>{selectedTenantDetail.tagline}</p>
                </div>
              </div>

              <div className="detail-grid">
                <div>
                  <small>CATEGORY</small>
                  <strong>{selectedTenantDetail.category}</strong>
                </div>
                <div>
                  <small>STATUS</small>
                  <strong>{selectedTenantDetail.status || "Active"}</strong>
                </div>
                <div>
                  <small>THEME COLOR</small>
                  <strong style={{ color: selectedTenantDetail.color }}>{selectedTenantDetail.color}</strong>
                </div>
                <div>
                  <small>LAYOUT VARIANT</small>
                  <strong>{selectedTenantDetail.layoutVariant || "Standard"}</strong>
                </div>
              </div>

              {selectedTenantDetail.features && (
                <div className="detail-features-box">
                  <small>ENABLED TENANT FEATURES</small>
                  <ul>
                    {selectedTenantDetail.features.map((feat, idx) => (
                      <li key={idx}><FaCheckCircle style={{ color: selectedTenantDetail.color }} /> {feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-form-actions">
                <button onClick={() => { setPlatform(selectedTenantDetail.id); setSelectedTenantDetail(null); }} className="btn-submit">
                  Switch Active Context to {selectedTenantDetail.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
