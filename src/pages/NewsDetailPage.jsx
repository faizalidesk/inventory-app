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
  Search,
  Mail
} from "lucide-react";
import { FaSun, FaMoon, FaArrowLeft, FaWhatsapp, FaTwitter, FaTelegram, FaLinkedin, FaFacebook } from "react-icons/fa";
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

  // Trending sidebar picks (4 articles)
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
      case "teknologi": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
      case "bencana": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "pendidikan": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "politik": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
      case "kriminal": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-purple-500/10 text-purple-400 border-purple-500/25";
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
    toast.success(next ? "Artikel berhasil disimpan!" : "Artikel dihapus dari bookmark.");
  };

  const handleSidebarSubscribe = (e) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes("@")) {
      toast.error("Masukkan alamat email yang valid.");
      return;
    }
    setSidebarSubscribed(true);
    toast.success("Terima kasih! Anda telah berlangganan.");
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

      {/* 2. SEAMLESS UNIFIED EDITORIAL CONTAINER */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* CLEAN MINIMALIST BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6 overflow-x-auto scrollbar-none">
          <Link to="/" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
            Beranda
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link to="/news" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
            Warta & Berita
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link to="/news" className="hover:text-foreground transition-colors no-underline font-medium text-primary">
            {article.categoryLabel}
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground truncate max-w-[280px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 2-COLUMN UNIFIED EDITORIAL LAYOUT (MAIN READING + UNIFIED SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* =========================================================================
              LEFT: SLIM FLOATING ACTION PILL (Subtle single floating capsule)
             ========================================================================= */}
          <aside className="hidden xl:flex xl:col-span-1 flex-col items-center sticky top-24 z-20">
            <div className="flex flex-col items-center gap-3 p-2 rounded-full bg-card/90 border border-border/80 shadow-md backdrop-blur-md">
              {/* Back button */}
              <Link 
                to="/news" 
                title="Kembali ke Portal Berita"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors no-underline"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="w-4 h-px bg-border" />

              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                title="Bagikan ke WhatsApp"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleShareTwitter}
                title="Bagikan ke Twitter / X"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
              >
                <FaTwitter className="w-3.5 h-3.5" />
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                title="Bagikan ke Telegram"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
              >
                <FaTelegram className="w-3.5 h-3.5" />
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                title="Salin Tautan"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>

              <div className="w-4 h-px bg-border" />

              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={toggleBookmark}
                title={bookmarked ? "Hapus dari Bookmark" : "Simpan Berita"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  bookmarked ? "text-amber-400 bg-amber-500/15" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* =========================================================================
              CENTER: CONTINUOUS SEAMLESS EDITORIAL ARTICLE (Col 2-8 / 1-8)
             ========================================================================= */}
          <div className="lg:col-span-8 xl:col-span-7 space-y-8">
            
            {/* ARTICLE HEADER & BYLINE */}
            <div className="space-y-4 pb-6 border-b border-border/70">
              
              {/* Category Pill & Time Meta */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(article.category)}`}>
                  {getCategoryIcon(article.category)}
                  <span>{article.categoryLabel}</span>
                </span>
                <span className="text-muted-foreground font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {article.date}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>

              {/* Bold Editorial Headline Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-foreground">
                {article.title}
              </h1>

              {/* Author Info Bar + Font Size Switcher (Unified Row) */}
              <div className="flex items-center justify-between gap-4 pt-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">{article.author}</div>
                    <div className="text-[11px] text-muted-foreground">Redaksi Berita Publik Nusantara</div>
                  </div>
                </div>

                {/* Font Size Adjuster in header */}
                <div className="flex items-center gap-1 bg-card border border-border/70 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFontSize("small")}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${fontSize === "small" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("normal")}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${fontSize === "normal" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("large")}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${fontSize === "large" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* ARTICLE NARRATIVE */}
            <article className="space-y-6">
              
              {/* Executive Summary Callout (Seamless left-accent quote) */}
              <div className="p-4 sm:p-5 rounded-r-2xl bg-card border-l-4 border-primary border-y border-r border-border/60 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider block mb-1.5">
                  Ringkasan Eksekutif
                </span>
                <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-foreground">
                  {article.summary}
                </p>
              </div>

              {/* Narrative Content Paragraphs */}
              <div className={`space-y-5 text-foreground/90 leading-relaxed ${fontClass}`}>
                {article.content && (article.content.includes('<') && article.content.includes('>')) ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                    className="rich-article-html space-y-4"
                  />
                ) : (
                  <>
                    <p>
                      <strong>Jakarta, Indonesia — </strong>
                      {article.content}
                    </p>
                    <p>
                      Perkembangan ini menjadi salah satu tonggak strategis dalam agenda penguatan infrastruktur dan tata kelola di Indonesia. Sinergi antara pemerintah pusat, pemerintah daerah, dan partisipasi publik diharapkan dapat mengoptimalkan dampak positif bagi kemajuan masyarakat di seluruh pelosok Tanah Air.
                    </p>
                  </>
                )}
              </div>

              {/* Topic Tag and Mobile Share Row */}
              <div className="pt-6 border-t border-border/60 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">Topik:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-semibold">
                    <Tag className="w-3 h-3 text-primary" />
                    {article.tag}
                  </span>
                </div>

                {/* Mobile-only share buttons */}
                <div className="flex xl:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center"
                  >
                    <FaTwitter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 h-8 rounded-lg bg-card border border-border text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                  </button>
                </div>
              </div>
            </article>

            {/* PREVIOUS & NEXT NAVIGATION */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border/70">
              {prevArticle ? (
                <Link
                  to={`/news/${prevArticle.slug || prevArticle.id}`}
                  className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all text-left flex flex-col justify-between group no-underline"
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
                  className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all text-right flex flex-col justify-between group no-underline"
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

            {/* RELATED ARTICLES */}
            {relatedArticles.length > 0 && (
              <section className="pt-2">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/70">
                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Warta Terkait Kategori {article.categoryLabel}</span>
                  </h3>
                  <Link to="/news" className="text-xs text-primary font-bold hover:underline no-underline">
                    Lihat Semua ➔
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/news/${rel.slug || rel.id}`)}
                      className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground block mb-1.5">{rel.date}</span>
                        <h4 className="text-xs font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 text-foreground">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-primary pt-2 border-t border-border/40">
                        Baca ➔
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* =========================================================================
              RIGHT: SINGLE UNIFIED SEAMLESS SIDEBAR PANEL (Col 9-12 / 8-12)
             ========================================================================= */}
          <aside className="lg:col-span-4 xl:col-span-4 sticky top-24">
            
            {/* ONE SINGLE UNIFIED CONTAINER (No chopped cards!) */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
              
              {/* SECTION 1: WARTA TERHANGAT */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border/60">
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
                        <h4 className="text-xs font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                          {trend.title}
                        </h4>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {trend.categoryLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: KANAL KATEGORI */}
              <div className="pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 pb-2.5 mb-2.5">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                    Kanal Kategori
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {NEWS_CATEGORIES.filter(c => c.id !== "all").map((cat) => (
                    <Link
                      key={cat.id}
                      to="/news"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors no-underline"
                    >
                      {getCategoryIcon(cat.id)}
                      <span>{cat.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/60">(15)</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* SECTION 3: LANGGANAN BULETIN */}
              <div className="pt-4 border-t border-border/60">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground block mb-1">
                  Langganan Warta Harian
                </span>
                <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                  Kurasi berita penting langsung ke email Anda setiap pagi.
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
