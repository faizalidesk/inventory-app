import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaThLarge,
    FaBoxOpen,
    FaTruck,
    FaBell,
    FaCog,
    FaSignOutAlt,
    FaSearch,
    FaShieldAlt,
    FaChartPie,
    FaUserCircle,
    FaWarehouse,
    FaPlus,
    FaArrowDown,
    FaArrowUp,
    FaChevronDown,
    FaSun,
    FaMoon,
} from "react-icons/fa";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light");

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    function toggleTheme() {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }

    const navItems = [
        { icon: <FaHome />, label: "Home", active: false },
        { icon: <FaThLarge />, label: "Dashboard", active: true },
        { icon: <FaBoxOpen />, label: "Produk", active: false },
        { icon: <FaBell />, label: "Notifikasi", active: false },
        { icon: <FaShieldAlt />, label: "Keamanan", active: false },
        { icon: <FaChartPie />, label: "Statistik", active: false },
    ];

    const categories = [
        {
            title: "Elektronik",
            desc: "Laptop, monitor, aksesoris kantor",
            fraction: "3 / 10 Produk",
            active: true,
        },
        {
            title: "Peralatan Gudang",
            desc: "Rak, palet, alat angkut",
            fraction: "0 / 8 Produk",
            active: false,
        },
        {
            title: "Consumables",
            desc: "ATK, kemasan, label",
            fraction: "0 / 5 Produk",
            active: true,
        },
        {
            title: "Spare Part",
            desc: "Komponen & suku cadang",
            fraction: "0 / 2 Produk",
            active: false,
        },
    ];

    const movement = [
        { label: "Jan", masuk: 60, keluar: 40 },
        { label: "Feb", masuk: 85, keluar: 55 },
        { label: "Mar", masuk: 50, keluar: 65 },
        { label: "Apr", masuk: 95, keluar: 45 },
        { label: "Mei", masuk: 70, keluar: 80 },
        { label: "Jun", masuk: 100, keluar: 60 },
    ];

    const summary = [
        { label: "Hari ini", value: "0,9 Kwt", percent: 28 },
        { label: "Minggu ini", value: "7,8 Kwt", percent: 45 },
        { label: "Bulan ini", value: "22,5 Kwt", percent: 68 },
    ];

    const team = [
        { name: "User 1", role: "Admin" },
        { name: "User 2", role: "Staff" },
        { name: "User 3", role: "Staff" },
    ];

    const stockHealth = 82;
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference * (1 - stockHealth / 100);

    return (
        <div className="dash-shell" data-theme={theme}>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap");

                * { box-sizing: border-box; }

                .dash-shell {
                    --navy: #1E3A5F;
                    --navy-dark: #16283F;
                    --amber: #f59e0b;
                    --green: #16a34a;
                    --red: #dc2626;
                    --blue: #2563eb;
                    --bg: #f4f6fa;
                    --card: #ffffff;
                    --text: #0f172a;
                    --muted: #64748b;
                    --border: #e4e7ee;
                    --table-divider: #f1f5f9;
                    --progress-track: #eef1f6;
                    --shadow: 0 8px 16px rgba(30, 58, 95, 0.1);

                    display: flex;
                    height: 100vh;
                    width: 100%;
                    background: var(--bg);
                    font-family: "Inter", system-ui, sans-serif;
                    color: var(--text);
                    overflow: hidden;
                    transition: background-color .4s ease, color .4s ease;
                }

                .dash-shell[data-theme="dark"] {
                    --navy: #2A4A73;
                    --navy-dark: #16283F;
                    --amber: #F2A63A;
                    --green: #35C99A;
                    --red: #E2685E;
                    --blue: #5B8DEF;
                    --bg: #0B1220;
                    --card: #121B2D;
                    --text: #ECEFF4;
                    --muted: #8B93A5;
                    --border: #212C42;
                    --table-divider: #1F2A3D;
                    --progress-track: #1A2438;
                    --shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
                }

                .dash-shell,
                .dash-sidebar,
                .dash-logo,
                .dash-nav-item,
                .dash-avatar-btn,
                .dash-search,
                .dash-icon-btn,
                .dash-card,
                .dash-cat-card,
                .dash-switch,
                .dash-progress,
                .dash-progress > div,
                .dash-member .circle,
                .dash-table tbody td,
                .dash-hero,
                .dash-bar,
                input {
                    transition: background-color .4s ease, background-image .4s ease,
                        border-color .4s ease, color .4s ease, box-shadow .4s ease;
                }

                .dash-shell h1,
                .dash-shell h2,
                .dash-shell h3 {
                    font-family: "Plus Jakarta Sans", sans-serif;
                    letter-spacing: -0.02em;
                    margin: 0;
                }

                /* ---------- Sidebar ---------- */
                .dash-sidebar {
                    width: 84px;
                    flex-shrink: 0;
                    background: var(--card);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 22px 0;
                    height: 100vh;
                }

                .dash-logo {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, var(--navy), var(--navy-dark));
                    color: var(--amber);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 17px;
                    margin-bottom: 30px;
                }

                .dash-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 100%;
                    align-items: center;
                }

                .dash-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    width: 64px;
                    padding: 10px 0;
                    border-radius: 12px;
                    color: var(--muted);
                    font-size: 9.5px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .dash-nav-item svg {
                    font-size: 16px;
                }

                .dash-nav-item:hover {
                    background: var(--progress-track);
                    color: var(--navy);
                }

                .dash-nav-item.active {
                    background: var(--navy);
                    color: #ffffff;
                    box-shadow: var(--shadow);
                }

                .dash-sidebar-bottom {
                    margin-top: auto;
                }

                .dash-avatar-btn {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--amber), #fbbf24);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    font-size: 16px;
                    cursor: pointer;
                    border: none;
                }

                /* ---------- Main / scrollable ---------- */
                .dash-main {
                    flex: 1;
                    height: 100vh;
                    overflow-y: auto;
                    padding: 26px 34px 60px;
                }

                /* Topbar */
                .dash-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 14px;
                    margin-bottom: 22px;
                }

                .dash-search {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    padding: 9px 14px;
                    color: var(--muted);
                    font-size: 13px;
                    width: 220px;
                    margin-right: auto;
                }

                .dash-search input {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 13px;
                    width: 100%;
                    font-family: inherit;
                    color: var(--text);
                }

                .dash-icon-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: var(--card);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--navy);
                    cursor: pointer;
                    font-size: 14px;
                    position: relative;
                }

                .dash-icon-btn:hover {
                    background: var(--progress-track);
                }

                .dash-icon-btn.logout {
                    color: var(--red);
                }

                .dash-icon-btn .dot {
                    position: absolute;
                    top: 7px;
                    right: 7px;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: var(--red);
                    border: 2px solid var(--card);
                }

                /* Layout grid: hero + rooms on top row, gauge/chart + members below */
                .dash-grid {
                    display: grid;
                    grid-template-columns: 1.7fr 1fr;
                    gap: 20px;
                }

                /* Hero card */
                .dash-hero {
                    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%);
                    border-radius: 20px;
                    padding: 30px 32px;
                    color: #ffffff;
                    position: relative;
                    overflow: hidden;
                    min-height: 190px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .dash-hero-blob {
                    position: absolute;
                    right: -30px;
                    top: -30px;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(245,158,11,0.35), transparent 70%);
                }

                .dash-hero-icon {
                    position: absolute;
                    right: 34px;
                    bottom: 18px;
                    font-size: 96px;
                    color: rgba(245, 158, 11, 0.18);
                }

                .dash-hero h1 {
                    font-size: 26px;
                    font-weight: 800;
                    max-width: 320px;
                    z-index: 1;
                }

                .dash-hero p {
                    color: rgba(255, 255, 255, 0.65);
                    font-size: 13.5px;
                    max-width: 320px;
                    margin: 8px 0 20px;
                    z-index: 1;
                }

                .dash-hero-stat {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1;
                }

                .dash-hero-stat .value {
                    font-size: 20px;
                    font-weight: 700;
                }

                .dash-hero-stat .label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                }

                /* Rooms / Kategori panel */
                .dash-panel-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .dash-panel-head h2 {
                    font-size: 16px;
                    font-weight: 700;
                }

                .dash-dropdown {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12.5px;
                    color: var(--muted);
                    cursor: pointer;
                }

                .dash-cat-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                .dash-cat-card {
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 18px;
                }

                .dash-cat-card h3 {
                    font-size: 15px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .dash-cat-card p {
                    font-size: 11.5px;
                    color: var(--muted);
                    margin: 0 0 16px;
                    line-height: 1.4;
                }

                .dash-cat-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .dash-toggle {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10.5px;
                    color: var(--muted);
                    font-weight: 600;
                }

                .dash-switch {
                    width: 34px;
                    height: 18px;
                    border-radius: 20px;
                    background: var(--border);
                    position: relative;
                    cursor: pointer;
                }

                .dash-switch.on {
                    background: var(--amber);
                }

                .dash-switch::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #ffffff;
                    transition: left 0.15s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
                }

                .dash-switch.on::after {
                    left: 18px;
                }

                .dash-cat-fraction {
                    font-size: 11px;
                    color: var(--muted);
                    font-family: "JetBrains Mono", monospace;
                }

                /* Second row */
                .dash-row-2 {
                    display: grid;
                    grid-template-columns: 1fr 1.3fr 1fr;
                    gap: 20px;
                    margin-top: 20px;
                }

                .dash-card {
                    background: var(--card);
                    border: 1px solid var(--border);
                    border-radius: 18px;
                    padding: 22px;
                }

                .dash-card-title {
                    font-size: 12px;
                    color: var(--muted);
                    font-weight: 500;
                    margin-bottom: 2px;
                }

                .dash-card h2.section-title {
                    font-size: 15px;
                    font-weight: 700;
                }

                /* Gauge */
                .dash-gauge-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 10px;
                }

                .dash-gauge {
                    position: relative;
                    width: 150px;
                    height: 150px;
                }

                .dash-gauge svg {
                    transform: rotate(-90deg);
                }

                .dash-gauge-center {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .dash-gauge-center .num {
                    font-family: "JetBrains Mono", monospace;
                    font-size: 26px;
                    font-weight: 700;
                    color: var(--navy);
                }

                .dash-gauge-center .txt {
                    font-size: 11px;
                    color: var(--muted);
                }

                .dash-gauge-caption {
                    text-align: center;
                    font-size: 11.5px;
                    color: var(--muted);
                    margin-top: 10px;
                    line-height: 1.5;
                }

                /* Bar chart */
                .dash-bars {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    height: 130px;
                    margin: 18px 0 10px;
                    gap: 10px;
                }

                .dash-bar-group {
                    display: flex;
                    align-items: flex-end;
                    gap: 3px;
                    flex: 1;
                    height: 100%;
                }

                .dash-bar {
                    flex: 1;
                    border-radius: 4px 4px 0 0;
                }

                .dash-bar.masuk {
                    background: linear-gradient(180deg, var(--navy), var(--navy-dark));
                }

                .dash-bar.keluar {
                    background: linear-gradient(180deg, var(--amber), #fbbf24);
                }

                .dash-bar-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10.5px;
                    color: var(--muted);
                }

                .dash-legend {
                    display: flex;
                    gap: 16px;
                    margin-top: 14px;
                    font-size: 11px;
                    color: var(--muted);
                }

                .dash-legend span {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .dash-legend i {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }

                .dash-legend .m i { background: var(--navy); }
                .dash-legend .k i { background: var(--amber); }

                /* Summary rows */
                .dash-summary-row {
                    margin-bottom: 14px;
                }

                .dash-summary-top {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    margin-bottom: 6px;
                }

                .dash-summary-top .label { color: var(--muted); }
                .dash-summary-top .value { font-family: "JetBrains Mono", monospace; font-weight: 600; color: var(--text); }

                .dash-progress {
                    height: 6px;
                    border-radius: 6px;
                    background: var(--progress-track);
                    overflow: hidden;
                }

                .dash-progress > div {
                    height: 100%;
                    border-radius: 6px;
                    background: linear-gradient(90deg, var(--amber), var(--navy));
                }

                /* Members */
                .dash-members {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-top: 14px;
                }

                .dash-member {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    color: var(--muted);
                }

                .dash-member .circle {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--navy), var(--blue));
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }

                .dash-member .circle.add {
                    background: var(--card);
                    border: 1.5px dashed var(--border);
                    color: var(--muted);
                }

                .dash-member b {
                    color: var(--text);
                    font-size: 12px;
                }

                /* Activity table (bonus section) */
                .dash-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 14px;
                    font-size: 13px;
                }

                .dash-table thead th {
                    color: var(--muted);
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    padding-bottom: 10px;
                    border-bottom: 1.5px solid var(--border);
                    text-align: left;
                }

                .dash-table tbody td {
                    padding: 12px 0;
                    border-bottom: 1px solid var(--table-divider);
                    color: var(--text);
                }

                .dash-mono {
                    font-family: "JetBrains Mono", monospace;
                    color: var(--muted);
                }

                .dash-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .dash-pill svg { font-size: 10px; }
                .dash-pill-in { background: color-mix(in srgb, var(--amber) 16%, transparent); color: var(--amber); }
                .dash-pill-out { background: color-mix(in srgb, var(--red) 14%, transparent); color: var(--red); }

                @media (max-width: 1180px) {
                    .dash-grid { grid-template-columns: 1fr; }
                    .dash-row-2 { grid-template-columns: 1fr 1fr; }
                }

                @media (max-width: 760px) {
                    .dash-sidebar { display: none; }
                    .dash-row-2 { grid-template-columns: 1fr; }
                    .dash-cat-grid { grid-template-columns: 1fr; }
                    .dash-main { padding: 20px; }
                }
            `}</style>

            {/* Sidebar */}
            <aside className="dash-sidebar">
                <div className="dash-logo">
                    <FaWarehouse />
                </div>

                <nav className="dash-nav">
                    {navItems.map((item, i) => (
                        <div className={`dash-nav-item ${item.active ? "active" : ""}`} key={i}>
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="dash-sidebar-bottom">
                    <button className="dash-avatar-btn" title="Profil">
                        <FaUserCircle />
                    </button>
                </div>
            </aside>

            {/* Main scrollable content */}
            <main className="dash-main">
                {/* Topbar */}
                <div className="dash-topbar">
                    <div className="dash-search">
                        <FaSearch />
                        <input placeholder="Cari produk, supplier..." />
                    </div>
                    <button
                        className="dash-icon-btn"
                        onClick={toggleTheme}
                        title={theme === "light" ? "Mode gelap" : "Mode terang"}
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                    <button className="dash-icon-btn">
                        <FaBell />
                        <span className="dot" />
                    </button>
                    <button className="dash-icon-btn">
                        <FaCog />
                    </button>
                    <button className="dash-icon-btn logout" onClick={handleLogout} title="Logout">
                        <FaSignOutAlt />
                    </button>
                </div>

                {/* Top grid: hero + kategori */}
                <div className="dash-grid">
                    <div className="dash-hero">
                        <div className="dash-hero-blob" />
                        <FaBoxOpen className="dash-hero-icon" />
                        <h1>Selamat datang, {user?.user_metadata?.full_name || "user"}!</h1>
                        <p>
                            Pantau stok, mutasi barang, dan aktivitas gudang Anda
                            langsung dari satu layar.
                        </p>
                        <div className="dash-hero-stat">
                            <FaArrowUp />
                            <span className="value">120 Produk</span>
                            <span className="label">Total stok aktif</span>
                        </div>
                    </div>

                    <div>
                        <div className="dash-panel-head">
                            <h2>Kategori</h2>
                            <div className="dash-dropdown">
                                Semua kategori <FaChevronDown />
                            </div>
                        </div>

                        <div className="dash-cat-grid">
                            {categories.map((cat, i) => (
                                <div className="dash-cat-card" key={i}>
                                    <h3>{cat.title}</h3>
                                    <p>{cat.desc}</p>
                                    <div className="dash-cat-footer">
                                        <div className="dash-toggle">
                                            OFF
                                            <div className={`dash-switch ${cat.active ? "on" : ""}`} />
                                            ON
                                        </div>
                                    </div>
                                    <div className="dash-cat-fraction" style={{ marginTop: 10 }}>
                                        {cat.fraction}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second row: gauge, chart, members+profile */}
                <div className="dash-row-2">
                    {/* Gauge */}
                    <div className="dash-card">
                        <p className="dash-card-title">Stok Gudang</p>
                        <h2 className="section-title">Kesehatan Stok</h2>

                        <div className="dash-gauge-wrap">
                            <div className="dash-gauge">
                                <svg width="150" height="150" viewBox="0 0 150 150">
                                    <circle
                                        cx="75"
                                        cy="75"
                                        r="54"
                                        fill="none"
                                        stroke="var(--progress-track)"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        cx="75"
                                        cy="75"
                                        r="54"
                                        fill="none"
                                        stroke="var(--amber)"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={dashOffset}
                                    />
                                </svg>
                                <div className="dash-gauge-center">
                                    <span className="num">{stockHealth}%</span>
                                    <span className="txt">Sehat</span>
                                </div>
                            </div>
                            <p className="dash-gauge-caption">
                                Rasio produk dengan stok di atas batas minimum
                                terhadap seluruh produk aktif.
                            </p>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="dash-card">
                        <p className="dash-card-title">Mutasi Barang</p>
                        <h2 className="section-title">Pergerakan · Semester ini</h2>

                        <div className="dash-bars">
                            {movement.map((m, i) => (
                                <div className="dash-bar-group" key={i}>
                                    <div className="dash-bar masuk" style={{ height: `${m.masuk}%` }} />
                                    <div className="dash-bar keluar" style={{ height: `${m.keluar}%` }} />
                                </div>
                            ))}
                        </div>
                        <div className="dash-bar-labels">
                            {movement.map((m, i) => (
                                <span key={i} style={{ flex: 1, textAlign: "center" }}>
                                    {m.label}
                                </span>
                            ))}
                        </div>

                        <div className="dash-legend">
                            <span className="m"><i /> Barang masuk</span>
                            <span className="k"><i /> Barang keluar</span>
                        </div>
                    </div>

                    {/* Summary + members */}
                    <div className="dash-card">
                        <p className="dash-card-title">Ringkasan</p>
                        <h2 className="section-title" style={{ marginBottom: 14 }}>
                            Aktivitas Gudang
                        </h2>

                        {summary.map((s, i) => (
                            <div className="dash-summary-row" key={i}>
                                <div className="dash-summary-top">
                                    <span className="label">{s.label}</span>
                                    <span className="value">{s.value}</span>
                                </div>
                                <div className="dash-progress">
                                    <div style={{ width: `${s.percent}%` }} />
                                </div>
                            </div>
                        ))}

                        <p className="dash-card-title" style={{ marginTop: 20 }}>
                            Tim Gudang
                        </p>
                        <div className="dash-members">
                            {team.map((m, i) => (
                                <div className="dash-member" key={i}>
                                    <div className="circle">{m.name.charAt(m.name.length - 1)}</div>
                                    <b>{m.name}</b>
                                    {m.role}
                                </div>
                            ))}
                            <div className="dash-member">
                                <div className="circle add">
                                    <FaPlus />
                                </div>
                                <b>Tambah</b>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity table */}
                <div className="dash-card" style={{ marginTop: 20 }}>
                    <p className="dash-card-title">Log Terbaru</p>
                    <h2 className="section-title">Aktivitas Terbaru</h2>

                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Aktivitas</th>
                                <th>Produk</th>
                                <th>Jumlah</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span className="dash-pill dash-pill-in">
                                        <FaArrowDown /> Barang Masuk
                                    </span>
                                </td>
                                <td>Laptop Asus</td>
                                <td className="dash-mono">20</td>
                                <td className="dash-mono">05-08-2026</td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="dash-pill dash-pill-out">
                                        <FaArrowUp /> Barang Keluar
                                    </span>
                                </td>
                                <td>Mouse Logitech</td>
                                <td className="dash-mono">5</td>
                                <td className="dash-mono">05-08-2026</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
