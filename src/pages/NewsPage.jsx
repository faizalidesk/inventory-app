import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  X, 
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
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Share2,
  Bookmark,
  Filter,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { FaSun, FaMoon, FaArrowLeft } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./LandingPage.css";
import { NEWS_CATEGORIES, NEWS_ARTICLES } from "../data/newsData";
import { toggleThemeWithTransition } from "../utils/theme";
import { useAuth } from "../context/auth-context";
import toast, { Toaster } from "react-hot-toast";

export default function NewsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Scroll to top on page or category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, currentPage]);

  const itemsPerPage = 9;

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

  // Filtered & searched news
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      const matchCat = activeCategory === "all" || article.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        (article.tag && article.tag.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Featured headline (first article of current category or overall)
  const heroArticle = filteredArticles[0] || NEWS_ARTICLES[0];
  const sideArticles = filteredArticles.slice(1, 4);

  // Pagination for the remaining grid articles
  const gridArticles = activeCategory === "all" && !searchQuery 
    ? filteredArticles.slice(4) 
    : filteredArticles;

  const totalPages = Math.ceil(gridArticles.length / itemsPerPage) || 1;
  const paginatedArticles = gridArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribedEmail || !subscribedEmail.includes("@")) {
      toast.error("Masukkan alamat email yang valid.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Terima kasih! Anda telah berlangganan warta harian Desktopalie.");
    setSubscribedEmail("");
  };

  return (
    <div className="desktopalie" data-theme={theme}>
      <div className="page-noise" aria-hidden="true" />
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* 1. UNIFIED SITE NAVBAR */}
      <SiteNavbar activeNav="news" />

      <main className="site-wrap py-8 px-4 max-w-6xl mx-auto">
        {/* HERO SECTION / EDITOR PICKS (Shown on All tab without search) */}
        {activeCategory === "all" && !searchQuery && currentPage === 1 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">BERITA UTAMA & PILIHAN REDAKSI</h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">75 Berita Terverifikasi</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Featured Big Card */}
              {heroArticle && (
                <div 
                  className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/news/${heroArticle.id}`)}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors" />
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md border ${getCategoryBadgeClass(heroArticle.category)}`}>
                        {getCategoryIcon(heroArticle.category)}
                        <span>{heroArticle.categoryLabel}</span>
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {heroArticle.date} • {heroArticle.readTime}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 group-hover:text-primary transition-colors leading-tight">
                      {heroArticle.title}
                    </h1>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                      {heroArticle.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{heroArticle.author}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-foreground">{heroArticle.tag}</span>
                    </div>
                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca Artikel Lengkap <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* Side Trending Headlines (3 Items) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-1.5 pb-1">
                  <TrendingUp className="w-4 h-4" /> TRENDING HARI INI
                </div>
                {sideArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryBadgeClass(article.category)}`}>
                          {article.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">{article.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{article.date}</span>
                      <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform">Baca ➔</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEARCH & CATEGORY FILTER BAR */}
        <section className="mb-8">
          <div className="bg-card/70 border border-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul berita, topik, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9.5 pr-8 py-2 bg-background/80 border border-border/60 text-sm rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {NEWS_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === "all"
                  ? NEWS_ARTICLES.length
                  : NEWS_ARTICLES.filter((a) => a.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted-foreground/10 text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {activeCategory === "all" ? "Semua Indeks Berita" : `Kategori: ${NEWS_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
                {filteredArticles.length} Artikel
              </span>
            </div>

            {searchQuery && (
              <span className="text-xs text-muted-foreground">
                Hasil untuk: <b className="text-foreground">"{searchQuery}"</b>
              </span>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 px-4 border border-dashed border-border/80 rounded-2xl bg-card/40">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-bold mb-1">Tidak ada berita yang sesuai</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tidak ditemukan artikel dengan kata kunci "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="btn btn-primary btn-sm px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => {
                const badgeClass = getCategoryBadgeClass(article.category);
                return (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-sm relative flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
                          {getCategoryIcon(article.category)}
                          <span>{article.categoryLabel}</span>
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.date.split(" ")[0]} {article.date.split(" ")[1]}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="text-base sm:text-lg font-bold mb-2.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-3.5 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Tag className="w-3 h-3 text-primary" />
                        <span className="font-semibold text-foreground/80">{article.tag}</span>
                      </div>
                      <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Baca Selengkapnya ➔
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-border/70 bg-card text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border/60 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-border/70 bg-card text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted cursor-pointer flex items-center gap-1"
              >
                Berikutnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* NEWSLETTER SUBSCRIPTION SECTION */}
        <section className="rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-purple-500/5 to-primary/10 p-8 text-center relative overflow-hidden mb-12">
          <div className="max-w-xl mx-auto">
            <div className="inline-flex p-3 rounded-full bg-primary/20 text-primary mb-4">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Langganan Warta Harian Desktopalie</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
              Dapatkan rangkuman kurasi berita terpenting seputar teknologi, mitigasi bencana, pendidikan, dan hukum langsung ke inbox Anda setiap pagi.
            </p>

            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" /> Anda telah terdaftar dalam buletin harian!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  Berlangganan
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* PORTAL FOOTER */}
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
