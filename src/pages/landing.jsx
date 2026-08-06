import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const TICKER_ENTRIES = [
  { type: "in", sku: "SKU-2291", wh: "Gudang Cikarang", qty: "+240 unit" },
  { type: "out", sku: "SKU-1187", wh: "Gudang Bandung", qty: "-18 unit" },
  { type: "in", sku: "SKU-4402", wh: "Gudang Surabaya", qty: "+96 unit" },
  { type: "out", sku: "SKU-0765", wh: "Gudang Cikarang", qty: "-312 unit" },
  { type: "in", sku: "SKU-3319", wh: "Gudang Medan", qty: "+54 unit" },
  { type: "out", sku: "SKU-8842", wh: "Gudang Bandung", qty: "-7 unit" },
];

const STOCK_ROWS = [
  { sku: "SKU-2291", nama: "Kabel HDMI 2m", gudang: "Cikarang", stok: "1.240", status: "in" },
  { sku: "SKU-1187", nama: "Baterai AA (12pcs)", gudang: "Bandung", stok: "86", status: "out" },
  { sku: "SKU-4402", nama: "Rak Sepatu Lipat", gudang: "Surabaya", stok: "312", status: "in" },
  { sku: "SKU-0765", nama: "Casing Ponsel Bening", gudang: "Cikarang", stok: "2.008", status: "out" },
];

const FEATURES = [
  {
    tag: "SCN-01",
    title: "Scan Barcode",
    desc: "Pindai barang masuk dan keluar lewat kamera ponsel atau alat scan — otomatis tercatat ke sistem, tanpa input manual.",
    icon: (
      <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 9v6M12 9v6M16 9v6" />
    ),
  },
  {
    tag: "WH-02",
    title: "Multi-Gudang",
    desc: "Pantau stok di setiap lokasi secara terpisah maupun gabungan, ter-update real-time dari mana saja Anda bekerja.",
    icon: <path d="M3 10l9-6 9 6M5 9v10h14V9M9 19v-6h6v6" />,
  },
  {
    tag: "LOG-03",
    title: "Laporan & Audit",
    desc: "Setiap pergerakan stok tercatat lengkap dengan waktu, pengguna, dan alasannya — siap diaudit kapan saja dibutuhkan.",
    icon: (
      <>
        <path d="M9 3h6l2 4H7l2-4ZM5 7h14l-1 14H6L5 7Z" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
  },
];

const STEPS = [
  {
    num: "01 / Masuk",
    title: "Pindai barang masuk",
    desc: "Saat barang tiba, scan barcode-nya. Sistem otomatis mencatat jumlah, waktu, dan siapa yang menerima.",
    width: "100%",
  },
  {
    num: "02 / Tersimpan",
    title: "Terpantau real-time",
    desc: "Stok langsung ter-update dan tersinkron ke semua gudang — tim lain langsung melihat angka yang sama.",
    width: "70%",
  },
  {
    num: "03 / Keluar",
    title: "Keluar & teraudit",
    desc: "Setiap barang yang keluar tercatat lengkap dengan alasannya. Laporan siap diunduh kapan pun dibutuhkan.",
    width: "40%",
  },
];

function LogoMark({ size = 28 }) {
  return (
    <svg className="logo-mark" viewBox="0 0 28 28" fill="none" style={{ width: size, height: size }}>
      <rect x="2" y="8" width="10" height="10" rx="2" fill="var(--accent)" />
      <rect x="16" y="8" width="10" height="10" rx="2" fill="var(--border)" />
      <rect x="9" y="18" width="10" height="8" rx="2" fill="var(--ink)" />
    </svg>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="landing" data-theme={theme}>
      <header className="nav">
        <div className="wrap nav-inner">
          <div className="logo">
            <LogoMark />
            Inventory
          </div>
          <nav className="nav-links">
            <a href="#fitur">Fitur</a>
            <a href="#produk">Produk</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#mulai">Harga</a>
          </nav>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Ganti tema">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
                </svg>
              )}
            </button>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="eyebrow">Manajemen Gudang Real-Time</div>
          <h1>
            Setiap barang punya jejak.
            <br />
            Setiap gudang, <span>satu dashboard.</span>
          </h1>
          <p className="lead">
            Catat barang masuk, pantau stok di seluruh gudang, dan audit setiap pergerakan barang —
            tanpa spreadsheet, tanpa tebak-tebakan.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Coba Gratis 14 Hari
            </Link>
            <a href="#cara-kerja" className="btn btn-ghost">
              Lihat Cara Kerja
            </a>
          </div>
        </div>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...TICKER_ENTRIES, ...TICKER_ENTRIES].map((e, i) => (
              <div className="ticker-item" key={i}>
                <span className={`stamp ${e.type}`}>{e.type === "in" ? "MASUK" : "KELUAR"}</span>
                <b>{e.sku}</b>
                <span>{e.wh}</span>
                <span>{e.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FITUR */}
      <section className="section" id="fitur">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              Fitur
            </div>
            <h2>Semua yang gudang Anda butuhkan, dalam satu layar</h2>
            <p>Dari pindai barang sampai laporan audit — tiga alat inti yang dipakai tim gudang setiap hari.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.tag}>
                <span className="feature-tag">{f.tag}</span>
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round">
                    {f.icon}
                  </svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUK */}
      <section className="section section-alt" id="produk">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Produk</div>
            <h2>Dashboard yang menunjukkan kondisi gudang Anda sebenarnya</h2>
            <p>Bukan angka perkiraan akhir bulan — stok yang tampil adalah stok yang benar-benar ada di rak, saat ini juga.</p>
          </div>
          <div className="preview-shell">
            <div className="preview-bar">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="path">inventory.app/dashboard/stok</span>
            </div>
            <table className="stock">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nama Barang</th>
                  <th>Gudang</th>
                  <th>Stok</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STOCK_ROWS.map((r) => (
                  <tr key={r.sku}>
                    <td className="sku">{r.sku}</td>
                    <td>{r.nama}</td>
                    <td className="gudang">{r.gudang}</td>
                    <td className="qty">{r.stok}</td>
                    <td>
                      <span className={`badge ${r.status}`}>
                        {r.status === "in" ? "↓ Masuk" : "↑ Keluar"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA */}
      <section className="section" id="cara-kerja">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Cara Kerja</div>
            <h2>Dari barang masuk sampai laporan, dalam tiga langkah</h2>
            <p>Alur kerja yang sama seperti di gudang — hanya lebih cepat, dan tercatat otomatis.</p>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="step-visual">
                  <span style={{ width: s.width }}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA + FOOTER */}
      <section className="section" id="mulai" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-box">
            <h2>Gudang Anda, akhirnya bisa diandalkan</h2>
            <p>Coba gratis 14 hari, tanpa kartu kredit. Aktif dalam hitungan menit.</p>
            <div className="cta-actions">
              <Link to="/login" className="btn btn-primary">
                Coba Gratis 14 Hari
              </Link>
              <a href="#" className="btn btn-ghost">
                Jadwalkan Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <div className="logo" style={{ fontSize: 15 }}>
            <LogoMark size={20} />
            Inventory
          </div>
          <div className="footer-links">
            <a href="#fitur">Fitur</a>
            <a href="#produk">Produk</a>
            <a href="#cara-kerja">Cara Kerja</a>
          </div>
          <div className="footer-copy">© 2026 INVENTORY.APP</div>
        </div>
      </footer>
    </div>
  );
}
