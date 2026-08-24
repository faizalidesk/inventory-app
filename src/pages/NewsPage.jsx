import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, X, Calendar, Clock, User, Tag, ChevronRight, Newspaper, Flame,
  GraduationCap, Building2, ShieldAlert, Cpu, TrendingUp, Sparkles, ArrowRight,
  Share2, Bookmark, Filter, CheckCircle2, ChevronLeft, Image as ImageIcon
} from "lucide-react";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./LandingPage.css";
import { NEWS_CATEGORIES, NEWS_ARTICLES } from "../data/newsData";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/auth-context";
import { fetchNewsArticles } from "../services/workspaceService";
import { supabase } from "../lib/supabase";
import toast, { Toaster } from "react-hot-toast";

// Helper to extract first image URL from article or content
const extractArticleImage = (article) => {
  if (!article) return null;
  if (article.image_url && typeof article.image_url === "string" && article.image_url.trim()) {
    return article.image_url.trim();
  }
  if (article.content && typeof article.content === "string") {
    const match = article.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export default function NewsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [articles, setArticles] = useState(NEWS_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    document.title = "News & Warta — Desktopalie Newsroom";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = "Warta terkini, berita teknologi, sains, pendidikan, dan inovasi digital kurasi Desktopalie.";
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://desktopalie.my.id/news";

    async function loadNews() {
      try {
        const data = await fetchNewsArticles();
        if (data && data.length > 0) {
          setArticles(data.filter(a => (a.status || "Published") === "Published"));
        }
      } catch (e) {
        console.error("Error fetching news:", e);
      } finally {
        setLoading(false);
      }
    }
    loadNews();

    const channel = supabase
      .channel("public_news_page_sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, (payload) => {
        if (payload.new && payload.new.key === "news_articles") {
          const val = typeof payload.new.value === "string" ? JSON.parse(payload.new.value) : payload.new.value;
          if (Array.isArray(val)) {
            setArticles(val.filter(a => (a.status || "Published") === "Published"));
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const itemsPerPage = 9;

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "teknologi": return <Cpu className="w-3.5 h-3.5" />;
      case "bencana": return <ShieldAlert className="w-3.5 h-3.5" />;
      case "pendidikan": return <GraduationCap className="w-3.5 h-3.5" />;
      case "politik": return <Building2 className="w-3.5 h-3.5" />;
      case "kriminal": return <Flame className="w-3.5 h-3.5" />;
      default: return <TrendingUp className="w-3.5 h-3.5" />;
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

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCat = activeCategory === "all" || article.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        article.title.toLowerCase().includes(q) ||
        (article.summary || "").toLowerCase().includes(q) ||
        (article.content || "").toLowerCase().includes(q) ||
        (article.tag && article.tag.toLowerCase().includes(q)) ||
        (article.author && article.author.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const heroArticle = filteredArticles[0] || articles[0];
  const sideArticles = filteredArticles.slice(1, 4);
  const gridArticles = activeCategory === "all" && !searchQuery ? filteredArticles.slice(4) : filteredArticles;
  const totalPages = Math.ceil(gridArticles.length / itemsPerPage) || 1;
  const paginatedArticles = gridArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <SiteNavbar activeNav="news" />

      <main className="site-wrap py-8 px-4 max-w-6xl mx-auto">
        {/* HERO FEATURED HEADLINE */}
        {activeCategory === "all" && !searchQuery && currentPage === 1 && heroArticle && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">BERITA UTAMA & PILIHAN REDAKSI</h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{articles.length} Berita Terverifikasi</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* HERO LEFT COLUMN CARD */}
              <div className="lg:col-span-7 bg-card/60 backdrop-blur-xs border border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 transition-all group overflow-hidden">
                <div>
                  <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${getCategoryBadgeClass(heroArticle.category)}`}>
                      {getCategoryIcon(heroArticle.category)}
                      {heroArticle.categoryLabel || heroArticle.category}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">• {heroArticle.readTime}</span>
                  </div>

                  <Link to={`/news/${heroArticle.id || heroArticle.slug}`} className="no-underline text-foreground block">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug group-hover:text-primary transition-colors mb-4 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                      {heroArticle.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {heroArticle.summary}
                  </p>

                  {/* HERO ARTICLE IMAGE BANNER */}
                  {extractArticleImage(heroArticle) && (
                    <Link to={`/news/${heroArticle.id || heroArticle.slug}`} className="block relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 border border-border/60 bg-muted/20">
                      <img
                        src={extractArticleImage(heroArticle)}
                        alt={heroArticle.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>{heroArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{heroArticle.date}</span>
                  </div>
                  <Link to={`/news/${heroArticle.id || heroArticle.slug}`} className="font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all no-underline ml-auto">
                    Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* SIDE HEADLINES (RIGHT COLUMN) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {sideArticles.map((item, idx) => {
                  const sideImg = extractArticleImage(item);
                  return (
                    <Link 
                      key={item.id || idx} 
                      to={`/news/${item.id || item.slug}`} 
                      className="bg-card/40 backdrop-blur-xs border border-border/70 rounded-xl p-4 sm:p-5 hover:border-primary/50 transition-all group flex flex-col justify-between no-underline overflow-hidden"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getCategoryBadgeClass(item.category)}`}>
                            {item.categoryLabel || item.category}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">{item.date}</span>
                        </div>

                        <div className="flex gap-3 items-start my-2">
                          {sideImg && (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted/20">
                              <img
                                src={sideImg}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1.5 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/40 mt-1">
                        <span>{item.author}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          </section>
        )}

        {/* CATEGORY & SEARCH TOOLBAR */}
        <section className="mb-8 bg-card/40 border border-border/70 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary shadow-xs" : "bg-muted/40 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari topik, judul, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-background/80 border border-border/80 rounded-xl pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-mono"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="mb-12">
          {paginatedArticles.length === 0 ? (
            <div className="text-center py-16 bg-card/20 rounded-2xl border border-dashed border-border">
              <Newspaper className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">Tidak Ada Berita Ditemukan</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">Coba sesuaikan kata kunci pencarian atau pilih kategori warta lainnya.</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold font-mono hover:bg-primary hover:text-primary-foreground transition-all">
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article, idx) => {
                const cardImg = extractArticleImage(article);
                return (
                  <article key={article.id || idx} className="bg-card/50 backdrop-blur-xs border border-border/80 rounded-2xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between group overflow-hidden">
                    <div>
                      {/* CARD IMAGE BANNER (IF PRESENT) */}
                      {cardImg && (
                        <Link to={`/news/${article.id || article.slug}`} className="block relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-border/60 bg-muted/20">
                          <img
                            src={cardImg}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </Link>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getCategoryBadgeClass(article.category)}`}>
                          {article.categoryLabel || article.category}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">{article.date}</span>
                      </div>

                      <Link to={`/news/${article.id || article.slug}`} className="no-underline text-foreground block">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug mb-2.5 line-clamp-2 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <Link to={`/news/${article.id || article.slug}`} className="font-bold text-primary text-xs flex items-center gap-1 group-hover:gap-1.5 transition-all no-underline">
                        Baca <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-card border border-border disabled:opacity-30 hover:border-primary transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-muted-foreground px-4">
                Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-card border border-border disabled:opacity-30 hover:border-primary transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* NEWSLETTER SUBSCRIPTION FOOTER BANNER */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-bold text-primary uppercase mb-2 block">Kabar Langsung ke Inbox</span>
            <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight">Berlangganan Warta Harian Desktopalie</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Dapatkan rangkuman perkembangan teknologi, sains, dan warta nasional pilihan setiap pagi hari tanpa spam.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda..."
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              className="bg-card/90 border border-border/80 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary flex-1 md:w-64 font-mono shadow-xs"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all shrink-0 cursor-pointer"
            >
              Langganan
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
