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
  ExternalLink
} from "lucide-react";
import { FaSun, FaMoon, FaArrowLeft, FaWhatsapp, FaTwitter, FaTelegram } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import { NEWS_ARTICLES, NEWS_CATEGORIES } from "../data/newsData";
import { toggleThemeWithTransition } from "../utils/theme";
import { useAuth } from "../context/auth-context";
import toast, { Toaster } from "react-hot-toast";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // small, normal, large

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const article = NEWS_ARTICLES.find((a) => a.id === id);

  // If article not found, find by index or fallback
  const currentIndex = NEWS_ARTICLES.findIndex((a) => a.id === id);
  const prevArticle = currentIndex > 0 ? NEWS_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < NEWS_ARTICLES.length - 1 ? NEWS_ARTICLES[currentIndex + 1] : null;

  // Related articles from same category
  const relatedArticles = article 
    ? NEWS_ARTICLES.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)
    : [];

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
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}

Baca selengkapnya di: ${window.location.href}`)}`;
    window.open(url, "_blank");
  };

  const handleShareTwitter = () => {
    if (!article) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  if (!article) {
    return (
      <div className="public-page" data-theme={theme}>
        <div className="site-wrap py-24 text-center">
          <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h1 className="text-2xl font-bold mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Artikel berita yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
          <Link to="/news" className="btn btn-primary px-6 py-2.5 rounded-xl font-bold">
            Kembali ke Portal Berita
          </Link>
        </div>
      </div>
    );
  }

  const fontClass = fontSize === "large" ? "text-lg leading-relaxed" : fontSize === "small" ? "text-sm leading-relaxed" : "text-base leading-relaxed";

  return (
    <div className="public-page" data-theme={theme}>
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* 1. UNIFIED SITE NAVBAR */}
      <SiteNavbar activeNav="news" />

      <main className="site-wrap py-8 px-4 max-w-4xl mx-auto">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono overflow-x-auto pb-1">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to="/news" className="hover:text-foreground">Warta</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-primary font-bold uppercase">{article.categoryLabel}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[200px] text-foreground">{article.title}</span>
        </nav>

        {/* ARTICLE HEADER */}
        <header className="mb-8 pb-6 border-b border-border/70">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md border ${getCategoryBadgeClass(article.category)}`}>
              {getCategoryIcon(article.category)}
              <span>{article.categoryLabel}</span>
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

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Author & Editorial Byline */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{article.author}</div>
                <div className="text-xs text-muted-foreground font-mono">Redaksi Berita Publik Nusantara</div>
              </div>
            </div>

            {/* Reading font size adjuster */}
            <div className="flex items-center gap-1 bg-card border border-border/60 rounded-xl p-1 text-xs">
              <span className="px-2 text-muted-foreground font-mono">Font:</span>
              <button
                type="button"
                onClick={() => setFontSize("small")}
                className={`px-2 py-1 rounded ${fontSize === "small" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                className={`px-2 py-1 rounded ${fontSize === "normal" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                className={`px-2 py-1 rounded ${fontSize === "large" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                A+
              </button>
            </div>
          </div>
        </header>

        {/* ARTICLE BODY */}
        <article className="space-y-6 mb-12">
          {/* Executive Summary Box */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" /> RINGKASAN EKSEKUTIF
            </div>
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-foreground">
              {article.summary}
            </p>
          </div>

          {/* Full Narrative Content */}
          <div className={`space-y-5 text-foreground/90 leading-relaxed ${fontClass}`}>
            <p>
              {article.content}
            </p>
            <p>
              Perkembangan ini menjadi salah satu tonggak strategis dalam agenda penguatan infrastruktur dan tata kelola di Indonesia. Sinergi antara pemerintah pusat, pemerintah daerah, dan partisipasi publik diharapkan dapat mengoptimalkan dampak positif bagi kemajuan masyarakat di seluruh pelosok Tanah Air.
            </p>
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

            {/* Social Sharing Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Bagikan:</span>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                title="Bagikan ke WhatsApp"
                className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleShareTwitter}
                title="Bagikan ke Twitter / X"
                className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaTwitter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                title="Salin Tautan Berita"
                className="px-3 h-8 rounded-lg bg-card border border-border/80 text-xs font-bold text-foreground flex items-center gap-1.5 hover:bg-muted transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-primary" />}
                <span>{copied ? "Tersalin!" : "Salin Link"}</span>
              </button>
            </div>
          </div>
        </article>

        {/* PREVIOUS & NEXT NAVIGATION */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border/70 mb-12">
          {prevArticle ? (
            <Link
              to={`/news/${prevArticle.id}`}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all text-left flex flex-col justify-between group"
            >
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Berita Sebelumnya
              </span>
              <span className="text-xs sm:text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {prevArticle.title}
              </span>
            </Link>
          ) : <div />}

          {nextArticle && (
            <Link
              to={`/news/${nextArticle.id}`}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-all text-right flex flex-col justify-between group"
            >
              <span className="text-[11px] font-mono text-muted-foreground flex items-center justify-end gap-1 mb-1">
                Berita Selanjutnya <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs sm:text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {nextArticle.title}
              </span>
            </Link>
          )}
        </nav>

        {/* RELATED ARTICLES IN SAME CATEGORY */}
        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/70">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold tracking-tight">Berita Terkait Kategori {article.categoryLabel}</h3>
              </div>
              <Link to="/news" className="text-xs text-primary font-bold hover:underline">
                Lihat Semua ➔
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/news/${rel.id}`)}
                  className="p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground block mb-2">{rel.date}</span>
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
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
      </main>

      {/* FOOTER */}
      <footer className="public-footer">
        <Link to="/news" className="public-brand" style={{ textDecoration: "none" }}>
          <DesktopalieMark className="public-brand-mark" />
          <span>Desktopalie News Portal</span>
        </Link>
        <span>Pusat Kurasi Berita Publik Terverifikasi Nusantara.</span>
        <span>© {new Date().getFullYear()} DESKTOPALIE</span>
      </footer>
    </div>
  );
}
