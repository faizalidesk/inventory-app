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
  ThumbsUp,
  MessageSquare,
  Share,
  Settings,
  HelpCircle,
  FolderTree,
  PenTool,
  Image as ImageIcon,
  Mail
} from "lucide-react";
import { FaSun, FaMoon, FaArrowLeft, FaWhatsapp, FaTwitter, FaTelegram, FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./LandingPage.css";
import { NEWS_ARTICLES, NEWS_CATEGORIES } from "../data/newsData";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/auth-context";
import { fetchNewsArticles } from "../services/workspaceService";
import toast, { Toaster } from "react-hot-toast";

// Helper image mapper for rich editorial display
const getArticleImage = (article) => {
  if (article.image) return article.image;
  switch (article.category) {
    case "teknologi":
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80";
    case "bencana":
      return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80";
    case "pendidikan":
      return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80";
    case "politik":
      return "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80";
    case "kriminal":
      return "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80";
    default:
      return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80";
  }
};

const getArticleThumbnail = (article, index = 0) => {
  if (article.thumbnail) return article.thumbnail;
  const sampleThumbs = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558441719-5a507a216f9f?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80"
  ];
  return sampleThumbs[index % sampleThumbs.length];
};

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
  const [likes, setLikes] = useState(13);
  const [isLiked, setIsLiked] = useState(false);
  const [shares, setShares] = useState(960);
  const [commentInput, setCommentInput] = useState("");
  const [commentsList, setCommentsList] = useState(["Liputan yang sangat mendalam dan informatif!"]);
  const [searchSidebar, setSearchSidebar] = useState("");

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

  // Related articles from same category & trending
  const relatedArticles = article 
    ? allArticles.filter((a) => a.id !== article.id).slice(0, 6)
    : allArticles.slice(0, 6);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setShares(prev => prev + 1);
    toast.success("Tautan artikel berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!article) return;
    setShares(prev => prev + 1);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\n\nBaca selengkapnya di: ${window.location.href}`)}`;
    window.open(url, "_blank");
  };

  const handleShareTwitter = () => {
    if (!article) return;
    setShares(prev => prev + 1);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleShareLinkedIn = () => {
    if (!article) return;
    setShares(prev => prev + 1);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleShareFacebook = () => {
    if (!article) return;
    setShares(prev => prev + 1);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      toast.success("Terima kasih atas apresiasi Anda!");
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentsList(prev => [commentInput.trim(), ...prev]);
    setCommentInput("");
    toast.success("Komentar Anda berhasil dikirim!");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchSidebar.trim()) return;
    navigate(`/news?q=${encodeURIComponent(searchSidebar.trim())}`);
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

  return (
    <div className="desktopalie" data-theme={theme}>
      <div className="page-noise" aria-hidden="true" />
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* 1. UNIFIED SITE NAVBAR (KEPT AS REQUESTED) */}
      <SiteNavbar activeNav="news" />

      {/* 2. HEADWAY-STYLE 3-PANEL EDITORIAL WORKSPACE */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
        <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
          
          {/* =========================================================================
              LEFT SIDEBAR: DASHBOARD & CHANNELS MENU (Col 1-2 on desktop)
             ========================================================================= */}
          <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between p-4 border-r border-border/70 bg-card/60">
            <div className="space-y-6">
              
              {/* Brand Headway Badge */}
              <div className="flex items-center gap-2.5 px-3 py-1">
                <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold">
                  <DesktopalieMark style={{ width: "18px", height: "17px" }} />
                </span>
                <span className="font-extrabold text-sm tracking-tight text-foreground">
                  Redaksi Hub
                </span>
              </div>

              {/* Main Navigation Items */}
              <div className="space-y-1 text-xs font-semibold">
                <Link
                  to="/news"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted text-foreground font-bold transition-colors no-underline"
                >
                  <Home className="w-4 h-4 text-primary" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/news"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>Articles</span>
                </Link>

                <Link
                  to="/about"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
                >
                  <User className="w-4 h-4" />
                  <span>Journalists</span>
                </Link>

                <Link
                  to="/projects"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Media</span>
                </Link>

                <Link
                  to="/experiments"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Editorial Notes</span>
                </Link>
              </div>

              {/* Categories Navigation Section */}
              <div className="pt-4 border-t border-border/60">
                <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 font-semibold block mb-2">
                  Kategori
                </span>
                <div className="space-y-1 text-xs font-medium">
                  {NEWS_CATEGORIES.filter(c => c.id !== "all").map((cat) => {
                    const isCurrent = article.category === cat.id;
                    return (
                      <Link
                        key={cat.id}
                        to={`/news?cat=${cat.id}`}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors no-underline ${
                          isCurrent 
                            ? "text-primary font-bold bg-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Support & Settings */}
            <div className="pt-4 border-t border-border/60 space-y-1 text-xs font-medium">
              <Link
                to="/#tech"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors no-underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Support</span>
              </Link>
            </div>
          </aside>

          {/* =========================================================================
              CENTER COLUMN: MAIN EDITORIAL ARTICLE READER (Col 3-9 on desktop)
             ========================================================================= */}
          <main className="lg:col-span-7 p-4 sm:p-8 flex flex-col justify-between">
            <div>
              
              {/* Back to Homepage Button */}
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 no-underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homepage</span>
              </Link>

              {/* Main Headline Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug mb-3">
                {article.title}
              </h1>

              {/* Author, Category, Date Sub-bar */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  <User className="w-3 h-3" />
                </div>
                <span className="font-semibold text-foreground">{article.author || "Rina Wulandari"}</span>
                <span>•</span>
                <span className="text-primary font-medium">{article.categoryLabel}</span>
                <span>•</span>
                <span>{article.date || "June 24, 2025"}</span>
              </div>

              {/* Featured Main Image Banner */}
              <div className="w-full h-60 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-6 border border-border/60 shadow-sm relative bg-muted">
                <img 
                  src={getArticleImage(article)} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content & Paragraphs */}
              <div className="space-y-4 text-foreground/90 text-sm sm:text-[15px] leading-relaxed">
                <p className="font-semibold text-foreground">
                  <strong>Jakarta, Indonesia — </strong>
                  {article.summary}
                </p>

                <p>
                  {article.content}
                </p>

                {/* Subheading & Strategic Focus Section */}
                <h3 className="text-base font-bold text-foreground pt-3">
                  A Regional Focus on Digital & National Transformation
                </h3>

                <p>
                  Sinergi antara kementerian terkait, pemerintah daerah, dan partisipasi aktif publik menjadi fondasi utama dalam mewujudkan implementasi program yang inklusif dan berkelanjutan di seluruh wilayah Nusantara.
                </p>

                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>Pemerataan infrastruktur terdepan ke lebih dari 20.000 titik layanan publik.</li>
                  <li>Standarisasi tata kelola data berbasis enkripsi modern dan transparansi publik.</li>
                  <li>Penguatan literasi digital generasi muda di institusi pendidikan nasional.</li>
                </ul>
              </div>
            </div>

            {/* Bottom Interaction Bar (Likes, Comments, Shares, Write Comment) */}
            <div className="pt-6 mt-8 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                
                {/* Likes Button */}
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isLiked 
                      ? "bg-primary/15 text-primary border-primary/30 font-bold" 
                      : "bg-card hover:bg-muted text-muted-foreground border-border/80"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes} Likes</span>
                </button>

                {/* Comments count */}
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{commentsList.length + 54} Comments</span>
                </div>

                {/* Shares count */}
                <div className="flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" />
                  <span>{shares} Shares</span>
                </div>
              </div>

              {/* Quick Comment Input */}
              <form onSubmit={handleSendComment} className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-border/70 focus:border-primary outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </main>

          {/* =========================================================================
              RIGHT SIDEBAR: SEARCH, SHARE & RELATED ARTICLES (Col 10-12 on desktop)
             ========================================================================= */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col p-4 sm:p-6 border-l border-border/70 bg-card/60 space-y-6">
            
            {/* Search News Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchSidebar}
                onChange={(e) => setSearchSidebar(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted/60 border border-border/70 focus:border-primary outline-none transition-colors"
              />
            </form>

            {/* Share to Social Media Icons */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-3">
                Share to
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  title="Share to LinkedIn"
                  className="w-8 h-8 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/40 transition-colors cursor-pointer"
                >
                  <FaLinkedin className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  title="Share to WhatsApp"
                  className="w-8 h-8 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/40 transition-colors cursor-pointer"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleShareTwitter}
                  title="Share to Twitter / X"
                  className="w-8 h-8 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
                >
                  <FaTwitter className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleShareFacebook}
                  title="Share to Facebook"
                  className="w-8 h-8 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:border-blue-600/40 transition-colors cursor-pointer"
                >
                  <FaFacebook className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy Link / Mail"
                  className="w-8 h-8 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Related Articles List with Square Rounded Thumbnails */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-foreground block">
                Related Articles
              </span>

              <div className="space-y-3.5">
                {relatedArticles.map((rel, idx) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/news/${rel.slug || rel.id}`)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border/60 bg-muted">
                      <img
                        src={getArticleThumbnail(rel, idx)}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] font-medium text-muted-foreground block mt-0.5">
                        {rel.categoryLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

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
