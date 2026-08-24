import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ChevronRight, 
  Newspaper, 
  Flame, 
  GraduationCap, 
  Building2, 
  ShieldAlert, 
  Cpu, 
  Share2, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Home,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Send,
  Layers,
  FileText,
  Info
} from "lucide-react";
import { FaSun, FaMoon, FaArrowLeft, FaWhatsapp, FaTwitter, FaTelegram } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./LandingPage.css";
import { NEWS_ARTICLES, NEWS_CATEGORIES } from "../data/newsData";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/auth-context";
import { fetchNewsArticles } from "../services/workspaceService";
import toast, { Toaster } from "react-hot-toast";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const [allArticles, setAllArticles] = useState(() => {
    try {
      const cached = localStorage.getItem("desktopalie_news_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return NEWS_ARTICLES;
  });
  
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // small, normal, large
  const [bookmarked, setBookmarked] = useState(false);
  const [sidebarEmail, setSidebarEmail] = useState("");
  const [sidebarSubscribed, setSidebarSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function loadData() {
      try {
        const data = await fetchNewsArticles();
        if (data && data.length > 0) {
          setAllArticles(data);
          try {
            localStorage.setItem("desktopalie_news_cache", JSON.stringify(data));
          } catch (e) {}
        }
      } catch (e) {
        console.error("Error loading news detail:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const article = allArticles.find((a) => a.slug === id || a.id === id);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — Desktopalie News`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = article.summary || "";

      // Auto-canonicalize URL if opened via raw ID to clean title slug
      if (article.slug && id === article.id && id !== article.slug) {
        navigate(`/news/${article.slug}`, { replace: true });
      }
    }
  }, [article, id, navigate]);

  // If article not found, find by index or fallback
  const currentIndex = article ? allArticles.findIndex((a) => a.id === article.id) : -1;
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Related articles from same category
  const relatedArticles = article 
    ? allArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)
    : [];

  // Trending sidebar picks (4 articles from other categories)
  const trendingArticles = article
    ? allArticles.filter((a) => a.id !== article.id).slice(0, 4)
    : allArticles.slice(0, 4);

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "teknologi": return <Cpu className="w-3.5 h-3.5" />;
      case "bencana": return <Flame className="w-3.5 h-3.5" />;
      case "pendidikan": return <GraduationCap className="w-3.5 h-3.5" />;
      case "politik": return <Building2 className="w-3.5 h-3.5" />;
      case "kriminal": return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <Newspaper className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryBadgeClass = (categoryId) => {
    switch (categoryId) {
      case "teknologi": return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "bencana": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "pendidikan": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "politik": return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
      case "kriminal": return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      default: return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Tautan artikel berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!article) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\n\nBaca selengkapnya di: ${window.location.href}`)}`;
    window.open(url, "_blank");
  };

  const handleShareTwitter = () => {
    if (!article) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleShareTelegram = () => {
    if (!article) return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`;
    window.open(url, "_blank");
  };

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    toast.success(next ? "Artikel berhasil disimpan ke bookmark!" : "Artikel dihapus dari bookmark.");
  };

  const handleSidebarSubscribe = (e) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes("@")) {
      toast.error("Masukkan alamat email yang valid.");
      return;
    }
    setSidebarSubscribed(true);
    toast.success("Terima kasih! Anda telah berlangganan warta harian.");
    setSidebarEmail("");
  };

  if (!article) {
    if (loading) {
      return (
        <div className="desktopalie" data-theme={theme}>
          <SiteNavbar activeNav="news" />
          <div className="site-wrap py-24 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-mono text-muted-foreground">Memuat artikel berita...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="desktopalie" data-theme={theme}>
        <SiteNavbar activeNav="news" />
        <div className="site-wrap py-24 text-center">
          <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h1 className="text-2xl font-bold mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Artikel berita yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
          <Link to="/news" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold inline-block no-underline">
            Kembali ke Portal Berita
          </Link>
        </div>
      </div>
    );
  }

  const fontClass = fontSize === "large" ? "text-lg leading-relaxed" : fontSize === "small" ? "text-sm leading-relaxed" : "text-base leading-relaxed";

  return (
    <div className="desktopalie" data-theme={theme}>
      <div className="page-noise" aria-hidden="true" />
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* 1. UNIFIED SITE NAVBAR */}
      <SiteNavbar activeNav="news" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* MODERN RESPONSIVE BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-8 py-2.5 px-4 rounded-xl bg-card/70 border border-border/80 shadow-xs backdrop-blur-sm overflow-x-auto scrollbar-none">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors shrink-0 no-underline text-muted-foreground">
            <Home className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Beranda</span>
          </Link>
          
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          
          <Link to="/news" className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors shrink-0 no-underline text-muted-foreground">
            <Newspaper className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Warta & Berita</span>
          </Link>
          
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          
          <Link 
            to="/news" 
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border transition-opacity hover:opacity-80 shrink-0 no-underline ${getCategoryBadgeClass(article.category)}`}
          >
            {getCategoryIcon(article.category)}
            <span>{article.categoryLabel}</span>
          </Link>
          
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md shrink-0" title={article.title}>
            {article.title}
          </span>
        </nav>

        {/* 3-COLUMN EDITORIAL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* =========================================================================
              LEFT COLUMN: ELEGANT FLOATING DOCK & READING ASSISTANT (Col 1-2 on desktop)
             ========================================================================= */}
          <aside className="hidden lg:flex lg:col-span-2 flex-col gap-4 sticky top-24">
            
            {/* Quick Navigation Back Pill */}
            <Link 
              to="/news" 
              className="flex items-center justify-between gap-2 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground p-3 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/50 transition-all group no-underline"
            >
              <span className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
                <span>Portal Berita</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">ESC</span>
            </Link>

            {/* Quick Meta Badge Card */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col gap-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
                Info Liputan
              </span>
              <div className="flex flex-col gap-1.5 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>{article.readTime || "2 mnt baca"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>

            {/* Reading Font Size Controller Card */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col gap-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
                Ukuran Teks
              </span>
              <div className="grid grid-cols-3 gap-1 bg-muted/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFontSize("small")}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === "small" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize("normal")}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === "normal" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize("large")}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === "large" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Vertical Social Sharing Dock */}
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col items-center gap-2.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold">
                Bagikan
              </span>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  title="Bagikan ke WhatsApp"
                  className="h-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </button>

                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  title="Bagikan ke Twitter / X"
                  className="h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <FaTwitter className="w-4 h-4" />
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  title="Bagikan ke Telegram"
                  className="h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <FaTelegram className="w-4 h-4" />
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Salin Tautan Berita"
                  className="h-9 rounded-xl bg-muted/60 text-foreground border border-border/80 flex items-center justify-center hover:border-primary transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-primary" />}
                </button>
              </div>

              <div className="w-full h-px bg-border/60 my-0.5" />

              {/* Bookmark Toggle Full Pill */}
              <button
                type="button"
                onClick={toggleBookmark}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  bookmarked 
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40" 
                    : "bg-card text-muted-foreground border-border/80 hover:text-foreground hover:border-primary/50"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{bookmarked ? "Tersimpan" : "Simpan"}</span>
              </button>
            </div>
          </aside>

          {/* =========================================================================
              CENTER COLUMN: MAIN EDITORIAL ARTICLE (Col 3-9 on desktop)
             ========================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* ARTICLE HEADER */}
            <div className="article-header pb-6 border-b border-border/70">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md border ${getCategoryBadgeClass(article.category)}`}>
                  {getCategoryIcon(article.category)}
                  <span>{article.categoryLabel || article.category}</span>
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
                {article.title}
              </h1>

              {/* Author & Editorial Byline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{article.author}</div>
                    <div className="text-xs text-muted-foreground font-mono">Redaksi Berita Publik Nusantara</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Liputan Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* ARTICLE BODY */}
            <article className="space-y-6">
              {/* Executive Summary Box */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> RINGKASAN EKSEKUTIF
                </div>
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-foreground">
                  {article.summary}
                </p>
              </div>

              {/* Full Narrative Content */}
              <div className={`space-y-5 text-foreground/90 leading-relaxed article-content-rendered ${fontClass}`}>
                {article.content && (article.content.includes('<') && article.content.includes('>')) ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                    className="rich-article-html space-y-4"
                  />
                ) : (
                  <>
                    <p>{article.content}</p>
                    <p>
                      Perkembangan ini menjadi salah satu tonggak strategis dalam agenda penguatan infrastruktur dan tata kelola di Indonesia. Sinergi antara pemerintah pusat, pemerintah daerah, dan partisipasi publik diharapkan dapat mengoptimalkan dampak positif bagi kemajuan masyarakat di seluruh pelosok Tanah Air.
                    </p>
                  </>
                )}
              </div>

              {/* Tag and Topic Badge */}
              <div className="pt-6 border-t border-border/60 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">Topik:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                    <Tag className="w-3 h-3" />
                    {article.tag}
                  </span>
                </div>

                {/* Social Sharing (Mobile Only) */}
                <div className="flex lg:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 h-8 rounded-lg bg-card border border-border/80 text-xs font-bold text-foreground flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-primary" />}
                    <span>{copied ? "Tersalin!" : "Salin"}</span>
                  </button>
                </div>
              </div>
            </article>

            {/* PREVIOUS & NEXT NAVIGATION */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border/70">
              {prevArticle ? (
                <Link
                  to={`/news/${prevArticle.slug || prevArticle.id}`}
                  className="p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all text-left flex flex-col justify-between group no-underline"
                >
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform text-primary" /> Berita Sebelumnya
                  </span>
                  <span className="text-xs sm:text-sm font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : <div />}

              {nextArticle && (
                <Link
                  to={`/news/${nextArticle.slug || nextArticle.id}`}
                  className="p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all text-right flex flex-col justify-between group no-underline"
                >
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center justify-end gap-1 mb-1">
                    Berita Selanjutnya <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-primary" />
                  </span>
                  <span className="text-xs sm:text-sm font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </nav>

            {/* RELATED ARTICLES IN SAME CATEGORY */}
            {relatedArticles.length > 0 && (
              <section className="pt-2">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      Berita Terkait Kategori {article.categoryLabel}
                    </h3>
                  </div>
                  <Link to="/news" className="text-xs text-primary font-bold hover:underline no-underline">
                    Lihat Semua ➔
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/news/${rel.slug || rel.id}`)}
                      className="p-4 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground block mb-2">{rel.date}</span>
                        <h4 className="text-xs sm:text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 text-foreground">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-2 border-t border-border/40">
                        Baca Artikel ➔
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: EDITORIAL CHANNELS & CURATED PICKS (Col 10-12 on desktop)
             ========================================================================= */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
            
            {/* Widget 1: Kanal Kategori Warta (Category Navigator) */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-border/60">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                  Kanal Warta
                </h3>
              </div>

              <div className="flex flex-col gap-1.5">
                {NEWS_CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                  <Link
                    key={cat.id}
                    to="/news"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground no-underline group"
                  >
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(cat.id)}
                      <span className="group-hover:text-primary transition-colors">{cat.label}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground">
                      15
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 2: Trending Warta Terhangat */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-border/60">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                  Warta Terhangat
                </h3>
              </div>

              <div className="space-y-3">
                {trendingArticles.map((trend, idx) => (
                  <div
                    key={trend.id}
                    onClick={() => navigate(`/news/${trend.slug || trend.id}`)}
                    className="group cursor-pointer flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                        {trend.title}
                      </h4>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {trend.categoryLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Transparansi Sumber & Regulasi */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-primary font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keterbukaan Informasi</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Portal warta independen menyajikan informasi terverifikasi sesuai prinsip transparansi publik dan rilis resmi kementerian/lembaga nasional.
              </p>
            </div>

            {/* Widget 4: Quick Newsletter Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/80 shadow-xs">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary block mb-1">
                Langganan Warta
              </span>
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                Terima ringkasan warta terpenting langsung ke email Anda.
              </p>
              
              {sidebarSubscribed ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terima kasih telah bergabung!</span>
                </div>
              ) : (
                <form onSubmit={handleSidebarSubscribe} className="space-y-2">
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={sidebarEmail}
                    onChange={(e) => setSidebarEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border/80 focus:border-primary outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" /> Berlangganan
                  </button>
                </form>
              )}
            </div>

          </aside>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-wrap footer-inner">
          <Link to="/" className="brand">
            <DesktopalieMark className="brand-mark" />
            <span>Desktopalie</span>
          </Link>
          <p className="text-xs font-mono text-muted-foreground">
            Pusat Kurasi Berita Publik Terverifikasi Nusantara.
          </p>
          <span className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} DESKTOPALIE
          </span>
        </div>
      </footer>
    </div>
  );
}
