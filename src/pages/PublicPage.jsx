import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaCode, 
  FaFigma, 
  FaFlask, 
  FaPalette, 
  FaSpinner, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaEnvelope, 
  FaShieldAlt, 
  FaLayerGroup, 
  FaServer, 
  FaMobileAlt, 
  FaBrain 
} from "react-icons/fa";
import DesktopalieMark from "../component/DesktopalieMark";
import SiteNavbar from "../component/SiteNavbar";
import "./PublicPage.css";
import { fetchCollection, fetchItemBySlug, subscribeToCollection } from "../services/workspaceService";
import { usePlatform } from "../context/PlatformContext";
import { useTheme } from "../context/ThemeContext";

// shadcn UI Components & Icons
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  Tag, 
  ExternalLink,
  CheckCircle2,
  Globe,
  Shield,
  Terminal,
  Zap,
  Code2,
  Rocket,
  Compass,
  HeartHandshake,
  Laptop,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  BookOpen,
  Clock,
  Calendar,
  Mail,
  Check,
  User
} from "lucide-react";

export function PublicShell({ children }) {
  const { theme } = useTheme();

  return (
    <div className="public-page" data-theme={theme}>
      <SiteNavbar />
      <main>{children}</main>
      
      {/* COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="public-footer-rich">
        <div className="footer-container">
          <div className="footer-grid">
            {/* BRAND COLUMN */}
            <div className="footer-col brand-col">
              <Link to="/" className="public-brand footer-brand">
                <DesktopalieMark className="public-brand-mark" style={{ width: "28px", height: "26px", display: "inline-flex" }} />
                <span>DESKTOPALIE</span>
              </Link>
              <p className="footer-desc">
                <strong>Desktopalie</strong> is an independent digital space and creative studio dedicated to UI/UX design, modern full-stack web engineering, multi-platform architecture, and intelligent tools.
              </p>
              <div className="footer-status">
                <span className="status-dot"></span> All Systems Operational
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home Overview</Link></li>
                <li><Link to="/projects">Selected Work</Link></li>
                <li><Link to="/about" className="footer-active-link">About Desktopalie</Link></li>
                <li><Link to="/news">News & Insights</Link></li>
                <li><Link to="/experiments">Lab Experiments</Link></li>
                <li><Link to="/services">Services & Pricing</Link></li>
                <li><Link to="/contact">Get in Touch</Link></li>
              </ul>
            </div>

            {/* PLATFORMS */}
            <div className="footer-col">
              <h4>Ecosystem</h4>
              <ul>
                <li><Link to="/">Platform Alpha (Creative Lab)</Link></li>
                <li><a href="https://beta.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Beta (Fleet Logistics)</a></li>
                <li><a href="https://gamma.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Gamma (Video Transcoder)</a></li>
                <li><a href="https://delta.desktopalie.my.id" target="_blank" rel="noreferrer">Platform Delta (Enterprise ERP)</a></li>
                <li><a href="https://back.desktopalie.my.id" target="_blank" rel="noreferrer">Admin Backoffice Workspace</a></li>
              </ul>
            </div>

            {/* SOCIAL & CONTACT */}
            <div className="footer-col">
              <h4>Connect</h4>
              <div className="footer-email-box">
                <FaEnvelope className="email-icon" />
                <a href="mailto:desktopalie@gmail.com">desktopalie@gmail.com</a>
              </div>
              <div className="footer-socials">
                <a href="https://github.com/desktopalie" target="_blank" rel="noreferrer" title="GitHub">
                  <FaGithub />
                </a>
                <a href="https://linkedin.com/company/desktopalie" target="_blank" rel="noreferrer" title="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="https://www.instagram.com/desktopalie" target="_blank" rel="noreferrer" title="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {new Date().getFullYear()} <strong>Desktopalie</strong>. All rights reserved.
            </div>
            <div className="footer-badges">
              <span><FaShieldAlt className="shield-icon" /> ISO 27001 Security Ready</span>
              <span>•</span>
              <span>256-bit SSL Encrypted</span>
              <span>•</span>
              <span>React 19 & Vite 8</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PublicInfoPage({ type }) {
  useEffect(() => {
    if (type === "about") {
      // 1. Dynamic Title highlighting Desktopalie Creative Technology Studio
      document.title = "About Desktopalie — Creative Technology Studio & Digital Lab";

      // 2. Dynamic Meta Description highlighting Desktopalie
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = "Desktopalie is an independent Creative Technology Studio & Digital Lab crafting modern UI/UX design, high-performance web engineering, and intelligent software ecosystems.";
      }

      // 3. Dynamic Canonical Tag
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://desktopalie.my.id/${type}`;

      // 4. OpenGraph
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = "About Desktopalie — Creative Technology Studio & Digital Lab";

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = "Desktopalie is an independent Creative Technology Studio & Digital Lab crafting modern UI/UX design, high-performance web engineering, and intelligent software ecosystems.";

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = `https://desktopalie.my.id/${type}`;

      // 5. Schema.org JSON-LD Organization / Project Structured Data
      const existingScript = document.getElementById('schema-about-desktopalie');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'schema-about-desktopalie';
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Desktopalie — Creative Technology Studio & Digital Lab",
          "url": "https://desktopalie.my.id/about",
          "description": "Desktopalie is an independent Creative Technology Studio & Digital Lab crafting modern UI/UX design, high-performance web engineering, and intelligent software ecosystems.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Desktopalie",
            "url": "https://desktopalie.my.id",
            "logo": "https://desktopalie.my.id/favicon-512x512.png",
            "image": "https://desktopalie.my.id/og-image.png",
            "sameAs": [
              "https://github.com/desktopalie",
              "https://linkedin.com/company/desktopalie",
              "https://www.instagram.com/desktopalie"
            ]
          }
        });
        document.head.appendChild(script);
      }
    } else if (type === "services") {
      document.title = "Services & Capabilities — Desktopalie Creative Technology Studio";
    } else if (type === "contact") {
      document.title = "Contact & Inquiries — Desktopalie Creative Technology Studio";
    }

    window.scrollTo(0, 0);

    return () => {
      const s = document.getElementById('schema-about-desktopalie');
      if (s) s.remove();
    };
  }, [type]);

  if (type === "about") {
    return (
      <PublicShell>
        {/* HERO SECTION */}
        <section className="py-20 md:py-28 relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="site-wrap relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-primary font-bold">About Studio</span>
            </div>

            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="purple" className="flex items-center gap-1.5 py-1 px-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>02 / ABOUT DESKTOPALIE</span>
                </Badge>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Q1/Q2 Collaborative Builds
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
                Building to learn.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#73e6ce] to-primary">
                  Sharing to connect.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                <strong>Desktopalie</strong> is an independent digital creative studio & software ecosystem crafting human-centered UI/UX design, resilient modern web applications, and multi-tenant architectures.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <Button asChild size="default" className="font-bold gap-2 shadow-sm rounded-xl">
                  <Link to="/projects">
                    <span>Explore Selected Work</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="font-bold gap-2 rounded-xl">
                  <Link to="/contact">
                    <span>Get in Touch</span>
                    <Mail className="w-3.5 h-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="default" className="font-bold gap-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <Link to="/news">
                    <span>News & Insights</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* THE STORY & STUDIO PROFILE GRID */}
        <section className="py-16 md:py-24 border-b border-border/60 bg-muted/10">
          <div className="site-wrap">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <Badge variant="outline" className="text-primary font-mono text-[10px] mb-3">THE ORIGIN & CRAFT</Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                    Where Strategy, Design, and Code Converge.
                  </h2>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <strong>Desktopalie</strong> started as a personal digital laboratory exploring modern frontend tooling and fluid micro-interactions. Over the years, it has grown into a cohesive ecosystem of production web portals, telemetry systems, native mobile clients, and automated content engines.
                </p>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  We believe that digital products should not only be visually distinctive, but also resilient, accessible, and fast. Every interface is built with strict semantic HTML, responsive layout tokens, and real-time backend synchronization.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-card border border-border/70">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Zero-Lag Performance</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimized Vite bundles, lightweight assets, and 98+ Lighthouse scores.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/70">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Enterprise Security</span>
                    </div>
                    <p className="text-xs text-muted-foreground">PostgreSQL Row-Level Security (RLS) with role-based auth tokens.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Studio Card & Metrics */}
              <div className="lg:col-span-5">
                <Card className="bg-card/90 backdrop-blur-md border-border/80 shadow-xl overflow-hidden">
                  <CardHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                          <DesktopalieMark size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">Desktopalie Studio</CardTitle>
                          <CardDescription className="text-xs font-mono">Independent Creative Lab</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                        EST. 2023
                      </Badge>
                    </div>
                  </CardHeader>

                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">4+</div>
                      <div className="text-xs font-bold text-foreground mt-1">Years Journey</div>
                      <div className="text-[11px] text-muted-foreground">Iterating & shipping</div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#73e6ce] font-mono">20+</div>
                      <div className="text-xs font-bold text-foreground mt-1">Projects Shipped</div>
                      <div className="text-[11px] text-muted-foreground">Live web applications</div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">75+</div>
                      <div className="text-xs font-bold text-foreground mt-1">News & Articles</div>
                      <div className="text-[11px] text-muted-foreground">Archived insights</div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">99.9%</div>
                      <div className="text-xs font-bold text-foreground mt-1">Uptime Reliability</div>
                      <div className="text-[11px] text-muted-foreground">Edge CDN network</div>
                    </div>
                  </div>

                  <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary" /> Indonesia • Global Ready
                    </span>
                    <span className="font-mono text-[10px]">v2.6.0 • Production</span>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PHILOSOPHY & PILLARS */}
        <section className="py-16 md:py-24 border-b border-border/60">
          <div className="site-wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="purple" className="mb-3">PHILOSOPHY & STANDARDS</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Craft Principles That Guide Every Build
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-3">
                No bloated dependencies, no neglected accessibility. Just clean engineering and intentional design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border/80 hover:border-primary/50 transition-all hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <FaPalette className="text-lg" />
                  </div>
                  <CardTitle className="text-base font-bold mb-2">Clarity & UI Systems</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Accessible typography scales, strict design tokens, and uncluttered layouts that minimize cognitive load for users.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card border-border/80 hover:border-primary/50 transition-all hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <FaCode className="text-lg" />
                  </div>
                  <CardTitle className="text-base font-bold mb-2">Resilient Architecture</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Powered by React 19, Supabase Realtime, and Edge Functions for near-instant response times and high availability.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card border-border/80 hover:border-primary/50 transition-all hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <FaLayerGroup className="text-lg" />
                  </div>
                  <CardTitle className="text-base font-bold mb-2">Multi-Platform Flavor</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Unified multi-tenant codebase powering Alpha, Beta (Logistics), Gamma (Video), and Delta (Enterprise ERP) seamlessly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card border-border/80 hover:border-primary/50 transition-all hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                    <FaBrain className="text-lg" />
                  </div>
                  <CardTitle className="text-base font-bold mb-2">AI-Augmented Workflows</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Deep integration with agentic code intelligence, Obsidian knowledge management, and automated content operations.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* TOOLCHAIN & ENGINEERING STACK */}
        <section className="py-16 md:py-24 border-b border-border/60 bg-muted/10">
          <div className="site-wrap">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="outline" className="text-primary font-mono text-[10px] mb-3">ENGINEERING TOOLCHAIN</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Modern Technologies in Active Production
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-primary">01 / FRONTEND</span>
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">React 19 & Vite 8</h3>
                  <p className="text-xs text-muted-foreground mb-4">Fast HMR development, optimized production trees, and modern hook lifecycle.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px]">Tailwind CSS</Badge>
                  <Badge variant="outline" className="text-[9px]">shadcn UI</Badge>
                  <Badge variant="outline" className="text-[9px]">Radix</Badge>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400">02 / BACKEND</span>
                    <FaServer className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">PostgreSQL & Supabase</h3>
                  <p className="text-xs text-muted-foreground mb-4">Row-Level Security (RLS), real-time websockets, and managed storage buckets.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px]">Realtime PubSub</Badge>
                  <Badge variant="outline" className="text-[9px]">RLS Auth</Badge>
                  <Badge variant="outline" className="text-[9px]">REST APIs</Badge>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-blue-400">03 / MOBILE NATIVE</span>
                    <Laptop className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">Capacitor Android</h3>
                  <p className="text-xs text-muted-foreground mb-4">Native Android APK packaging with live server asset synchronization.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px]">Android SDK</Badge>
                  <Badge variant="outline" className="text-[9px]">Capacitor 6</Badge>
                  <Badge variant="outline" className="text-[9px]">Offline Sync</Badge>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-400">04 / INTELLIGENCE</span>
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">AI Systems & Agents</h3>
                  <p className="text-xs text-muted-foreground mb-4">Autonomous coding engines, computer vision analysis, and Obsidian graph sync.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px]">Agentic AI</Badge>
                  <Badge variant="outline" className="text-[9px]">Vision OCR</Badge>
                  <Badge variant="outline" className="text-[9px]">Obsidian Hub</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JOURNEY & TIMELINE */}
        <section className="py-16 md:py-24 border-b border-border/60">
          <div className="site-wrap max-w-4xl">
            <div className="text-center mb-14">
              <Badge variant="purple" className="mb-3">EVOLUTION</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Studio Milestones & Timeline
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <Badge variant="purple" className="font-mono text-xs py-1 px-3 mt-0.5 shrink-0">
                    2023 — 2024
                  </Badge>
                  <div>
                    <h3 className="font-bold text-base text-foreground mb-1">Foundations & Interactive UI/UX Design</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Created early design systems, bespoke UI components, and accessible interactive prototypes focusing on core performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <Badge variant="accent" className="font-mono text-xs py-1 px-3 mt-0.5 shrink-0">
                    2025
                  </Badge>
                  <div>
                    <h3 className="font-bold text-base text-foreground mb-1">Multi-Platform Flavors & Supabase RLS</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Architected 4-tenant platform architecture (Alpha, Beta, Gamma, Delta) with isolated data security and live backoffice management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <Badge variant="purple" className="font-mono text-xs py-1 px-3 mt-0.5 shrink-0">
                    2026
                  </Badge>
                  <div>
                    <h3 className="font-bold text-base text-foreground mb-1">Native Android App & AI Knowledge Sync</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Shipped native Capacitor Android APK, 75+ dynamic news publishing system, and synchronized Obsidian graph intelligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="site-wrap max-w-3xl text-center">
            <Badge variant="purple" className="mb-4">LET'S COLLABORATE</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Have an ambitious idea or project in mind?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Whether you need modern web engineering, UI/UX design systems, or a multi-platform architecture, let's craft something memorable.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="font-bold gap-2 rounded-xl shadow-lg">
                <Link to="/contact">
                  <span>Start a Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-bold rounded-xl">
                <Link to="/projects">
                  <span>Browse Portfolio</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  // SERVICES PAGE
  if (type === "services") {
    return (
      <PublicShell>
        <section className="public-hero">
          <span>04 / SERVICES</span>
          <h1>From first sketch to final interaction.</h1>
          <p>Desktopalie shapes thoughtful digital experiences through strategy, interface design, and modern frontend development.</p>
        </section>
        <section className="public-content-grid">
          <div>
            <span className="public-label">THE APPROACH</span>
            <p>Desktopalie approaches every build by understanding the core challenge. From there, we create a clear visual direction, build reusable systems, and turn them into fast, responsive interfaces.</p>
          </div>
          <div className="public-service-list">
            <article>
              <FaCode />
              <div>
                <h2>Web development</h2>
                <p>Responsive, accessible interfaces built with modern frontend technology.</p>
              </div>
            </article>
            <article>
              <FaPalette />
              <div>
                <h2>UI/UX design</h2>
                <p>Clear product experiences with useful systems and visual character.</p>
              </div>
            </article>
            <article>
              <FaFigma />
              <div>
                <h2>Prototyping</h2>
                <p>Fast, tangible experiments for validating ideas before full production.</p>
              </div>
            </article>
          </div>
        </section>
      </PublicShell>
    );
  }

  // CONTACT PAGE
  return (
    <PublicShell>
      <section className="public-hero">
        <span>05 / CONTACT</span>
        <h1>Let’s make something worth remembering.</h1>
        <p>Have a project, an idea, or want to collaborate with Desktopalie? We would love to hear from you.</p>
      </section>
      <section className="public-content-grid">
        <div>
          <span className="public-label">COLLABORATION</span>
          <p>Share a little about what you are building, where you are in the process, and how Desktopalie can assist. The team usually replies within one working day.</p>
        </div>
        <div className="contact-options">
          <a href="mailto:desktopalie@gmail.com">
            <span>Email</span>
            <strong>desktopalie@gmail.com</strong>
            <FaArrowRight />
          </a>
          <a href="https://github.com/desktopalie" target="_blank" rel="noreferrer">
            <span>Code</span>
            <strong>View GitHub</strong>
            <FaArrowRight />
          </a>
          <a href="https://linkedin.com/company/desktopalie" target="_blank" rel="noreferrer">
            <span>Network</span>
            <strong>Connect on LinkedIn</strong>
            <FaArrowRight />
          </a>
        </div>
      </section>
    </PublicShell>
  );
}

const DEFAULT_SHOWCASE_PROJECTS = [
  {
    id: "p1",
    number: "01",
    slug: "orbit-analytics",
    type: "Web Application",
    category: "web",
    title: "Orbit Analytics",
    description: "A focused analytics experience that turns complex product data into clear, useful decisions with sub-second queries.",
    tags: ["React 19", "Data Visualization", "Product Design", "Supabase"],
    image_url: "/project-1.png",
    stats: "99.8% Uptime • Realtime Sync",
    progress: 100,
    status: "Published",
  },
  {
    id: "p2",
    number: "02",
    slug: "frame-archive",
    type: "Digital Experience",
    category: "digital",
    title: "Frame Archive",
    description: "A cinematic digital archive designed around discovery, motion, and thoughtful interaction.",
    tags: ["Creative Development", "UI/UX Design", "Motion", "Tailwind CSS"],
    image_url: "/project-2.png",
    stats: "60 FPS Animations • Fluid UX",
    progress: 100,
    status: "Published",
  },
  {
    id: "p3",
    number: "03",
    slug: "mono-systems",
    type: "Design Systems",
    category: "design",
    title: "Mono Systems",
    description: "An exploration of modular interfaces, expressive typography, and reusable design systems.",
    tags: ["Design System", "shadcn UI", "Art Direction", "Figma Tokens"],
    image_url: "/project-3.png",
    stats: "30+ Components • Multi-theme",
    progress: 100,
    status: "Published",
  },
  {
    id: "p4",
    number: "04",
    slug: "fleet-telemetry-beta",
    type: "Logistics & Telemetry",
    category: "web",
    title: "Fleet Telemetry Beta",
    description: "Real-time cold-chain vehicle tracking and distance matrix route calculations for modern distribution fleets.",
    tags: ["IoT Telemetry", "Distance Matrix", "Route Optimization", "Live GPS"],
    image_url: "/project-4.png",
    stats: "Sub-second Latency • IoT Sync",
    progress: 95,
    status: "Active Beta",
  },
  {
    id: "p5",
    number: "05",
    slug: "video-intelligence-gamma",
    type: "AI & Video Cloud",
    category: "digital",
    title: "AI Video Intelligence Gamma",
    description: "Intelligent cloud transcoding and automated computer vision analysis pipeline for high-throughput video streaming.",
    tags: ["Agentic AI", "Video Transcoding", "Multimodal Analysis", "Cloud Edge"],
    image_url: "/project-5.png",
    stats: "4K 60fps Transcode • AI Vision",
    progress: 90,
    status: "Active Alpha",
  },
  {
    id: "p6",
    number: "06",
    slug: "enterprise-erp-delta",
    type: "Enterprise Suite",
    category: "design",
    title: "Enterprise ERP Delta",
    description: "Unified enterprise resource management system featuring intelligent OCR document scanning and automated ledger accounting.",
    tags: ["OCR Scanner", "Multi-tenant", "Automated Invoicing", "RBAC Auth"],
    image_url: "/project-6.png",
    stats: "99.9% Accuracy • Multi-tenant",
    progress: 85,
    status: "Staging",
  },
];

export function ProjectsPage() {
  const { activePlatform, activePlatformId } = usePlatform();
  const [projects, setProjects] = useState(DEFAULT_SHOWCASE_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    document.title = "Selected Projects & Portfolio — Desktopalie Creative Technology Studio";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = "Explore selected software projects, UI/UX systems, and full-stack web applications crafted by Desktopalie Creative Technology Studio & Digital Lab.";
    }

    async function loadProjects() {
      setLoading(true);
      try {
        let data = await fetchCollection("projects", null, activePlatformId);
        if (!data || data.length === 0) {
          data = await fetchCollection("projects");
        }
        if (data && data.length > 0) {
          const visible = data.filter(p => {
            const st = (p.status || "Published").toLowerCase();
            return st !== "unpublished" && st !== "draft" && st !== "archived";
          });
          const merged = visible.map((p, idx) => ({
            id: p.id || `p-${idx}`,
            number: p.number || String(idx + 1).padStart(2, "0"),
            slug: p.slug || `project-${idx + 1}`,
            type: p.type || "Web Application",
            category: p.category || ((p.type || "").toLowerCase().includes("design") ? "design" : (p.type || "").toLowerCase().includes("digital") ? "digital" : "web"),
            title: p.title,
            description: p.description,
            image_url: p.image_url || p.cover_url || `/project-${(idx % 6) + 1}.png`,
            tags: [p.type || "Web", ...(Array.isArray(p.tags) ? p.tags : ["React 19", "Tailwind CSS"])],
            stats: p.stats || "Featured Showcase",
            progress: p.progress || 100,
            status: p.status || "Published",
          }));
          setProjects(merged);
        } else {
          setProjects(DEFAULT_SHOWCASE_PROJECTS);
        }
      } catch (e) {
        console.error("Error loading projects:", e);
        setProjects(DEFAULT_SHOWCASE_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();

    const unsubscribe = subscribeToCollection("projects", () => {
      loadProjects();
    }, activePlatformId);

    return () => {
      unsubscribe();
    };
  }, [activePlatformId]);

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* 1. HERO HEADER */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple" className="text-xs px-3 py-1 font-mono uppercase tracking-wider">
              01 / SELECTED WORK
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              {projects.length} Total Projects
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Projects shaped by curiosity, craft, and engineering.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A curated index of production applications, design systems, and software experiments developed across the Desktopalie platform ecosystem.
          </p>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2.5 sm:p-3 rounded-2xl bg-card/70 border border-border/80 shadow-xs mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search projects by name, tag, or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/60 border-border/60 text-sm h-10 rounded-xl"
            />
          </div>

          {/* Category Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto h-10 p-1 rounded-xl bg-muted/60">
              <TabsTrigger value="all" className="rounded-lg text-xs font-medium">All ({projects.length})</TabsTrigger>
              <TabsTrigger value="web" className="rounded-lg text-xs font-medium">Web</TabsTrigger>
              <TabsTrigger value="digital" className="rounded-lg text-xs font-medium">Motion</TabsTrigger>
              <TabsTrigger value="design" className="rounded-lg text-xs font-medium">Systems</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 3. SHADCN CARDS GRID */}
        {loading ? (
          <div className="text-center py-24 text-muted-foreground flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-2xl text-primary" />
            <p className="text-sm font-mono">Fetching projects database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl bg-card/40 my-8">
            <p className="text-muted-foreground text-sm">No projects matched your search criteria.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProjects.map((project) => (
              <Card
                key={project.slug || project.id}
                className="group relative overflow-hidden bg-card/80 border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between rounded-2xl"
              >
                <div>
                  {/* Project Cover Image */}
                  <div className="h-56 w-full relative overflow-hidden rounded-t-2xl bg-muted/30 border-b border-border/60">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent pointer-events-none" />
                    <span className="project-number absolute top-3.5 left-3.5 bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border border-border/80 shadow-xs">
                      {project.number}
                    </span>
                    <Badge
                      variant="outline"
                      className="absolute top-3.5 right-3.5 bg-background/80 backdrop-blur-md text-[10px] font-mono border-border/80 shadow-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant="accent" className="text-[10px] px-2 py-0.5">{project.type}</Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">{project.stats}</span>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardFooter className="p-5 pt-3 flex flex-col gap-4 border-t border-border/40 mt-4">
                  <div className="flex flex-wrap gap-1.5 w-full">
                    {(project.tags || []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[9px] py-0 px-2 font-mono">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between w-full pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1.5 h-8 px-2.5"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </Button>

                    <Button asChild size="sm" variant="default" className="text-xs gap-1.5 h-8 px-3.5 rounded-lg shadow-xs">
                      <Link to={`/projects/${project.slug}`}>
                        Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 4. PROJECT QUICK VIEW MODAL (SHADCN DIALOG) */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-lg">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="purple">{selectedProject.number}</Badge>
                  <Badge variant="accent">{selectedProject.type}</Badge>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-sm pt-2">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* Cover Image in Modal */}
              <div className="rounded-lg overflow-hidden border border-border/70 my-2 aspect-video bg-muted/20">
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="py-2 space-y-3">
                <div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                    Technologies & Architecture
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProject.tags || []).map((t) => (
                      <Badge key={t} variant="pulse" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs font-mono text-muted-foreground flex items-center justify-between">
                  <span>Status: {selectedProject.status}</span>
                  <span>{selectedProject.stats}</span>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Close</Button>
                </DialogClose>
                <Button asChild size="sm" variant="glow" className="gap-2">
                  <Link to={`/projects/${selectedProject.slug}`}>
                    Read Full Case Study <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PublicShell>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      const data = await fetchItemBySlug("projects", slug);
      if (data) {
        const st = (data.status || "Published").toLowerCase();
        if (st === "unpublished" || st === "draft" || st === "archived") {
          setProject(null);
        } else {
          setProject(data);
          document.title = `${data.title} — Desktopalie Case Study`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.content = data.description || "";
        }
      } else {
        const fallback = DEFAULT_SHOWCASE_PROJECTS.find(p => p.slug === slug || p.id === slug);
        if (fallback) {
          const st = (fallback.status || "Published").toLowerCase();
          if (st === "unpublished" || st === "draft" || st === "archived") {
            setProject(null);
          } else {
            setProject(fallback);
            document.title = `${fallback.title} — Desktopalie Case Study`;
          }
        } else {
          setProject(null);
        }
      }
      setLoading(false);
    }
    loadProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <PublicShell>
        <div className="max-w-4xl mx-auto px-4 py-28 text-center flex flex-col items-center justify-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-primary" />
          <p className="text-sm font-mono text-muted-foreground">Loading case study details...</p>
        </div>
      </PublicShell>
    );
  }

  if (!project) {
    return (
      <PublicShell>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
          <Badge variant="outline" className="text-xs">404 NOT FOUND</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold">This project does not exist.</h1>
          <p className="text-muted-foreground text-sm">The project you are looking for may have been updated or moved.</p>
          <Button asChild variant="default" size="sm" className="mt-4">
            <Link to="/projects" className="gap-2">
              <FaArrowLeft className="w-3.5 h-3.5" /> Back to all projects
            </Link>
          </Button>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/projects">
              <FaArrowLeft className="w-3 h-3" /> Back to Selected Work
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="text-xs font-mono">{project.number || "01"}</Badge>
            <Badge variant="accent" className="text-xs">{project.type}</Badge>
            <Badge variant="outline" className="text-xs font-mono">{project.status}</Badge>
          </div>
        </div>

        {/* Header Hero */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Hero Cover Image Showcase */}
        <div className="rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-muted/20 aspect-video mb-12">
          <img
            src={project.image_url || `/project-1.png`}
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Key Metrics & Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="p-4 bg-card/60 border-border/80">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Architecture</span>
            <strong className="text-sm font-semibold text-foreground">{project.type || "Web Application"}</strong>
          </Card>
          <Card className="p-4 bg-card/60 border-border/80">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Performance Metric</span>
            <strong className="text-sm font-semibold text-[#73e6ce]">{project.stats || "99.8% Uptime"}</strong>
          </Card>
          <Card className="p-4 bg-card/60 border-border/80">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Completion Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress || 100}%` }} />
              </div>
              <span className="text-xs font-mono font-bold">{project.progress || 100}%</span>
            </div>
          </Card>
        </div>

        {/* Content Section: Challenge & Outcome */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">01 / The Challenge</Badge>
            <h2 className="text-2xl font-bold text-foreground">Solving interface complexity with structured architecture.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">02 / Technologies & Systems</Badge>
            <h2 className="text-2xl font-bold text-foreground">Modern Frontend & Real-time Cloud Pipeline</h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {(Array.isArray(project.tags) ? project.tags : ["React 19", "Tailwind CSS", "Supabase", "shadcn UI"]).map((tag) => (
                <Badge key={tag} variant="pulse" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-border/60 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to="/projects" className="gap-2">
              <FaArrowLeft className="w-3.5 h-3.5" /> All Projects
            </Link>
          </Button>
          <Button asChild variant="glow" size="sm">
            <Link to="/projects" className="gap-2">
              Explore More Case Studies <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </PublicShell>
  );
}

export function ExperimentsPage() {
  const { activePlatform, activePlatformId } = usePlatform();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Lab Experiments & Prototypes — Desktopalie Digital Lab";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = "Explore creative code experiments, UI prototypes, and software architecture studies from Desktopalie Digital Lab.";
    }

    async function loadExperiments() {
      setLoading(true);
      let data = await fetchCollection("experiments", null, activePlatformId);
      if (!data || data.length === 0) {
        data = await fetchCollection("experiments");
      }
      setExperiments(data);
      setLoading(false);
    }
    loadExperiments();

    const unsubscribe = subscribeToCollection("experiments", () => {
      loadExperiments();
    }, activePlatformId);

    return () => {
      unsubscribe();
    };
  }, [activePlatformId]);

  return (
    <PublicShell>
      <section className="public-hero">
        <span style={{ color: activePlatform.color }}>02 / THE LAB • {activePlatform.name}</span>
        <h1>Small experiments. Useful discoveries.</h1>
        <p>An open notebook of interface studies, prototypes, and creative code for platform: <strong>{activePlatform.name}</strong>.</p>
      </section>
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <FaSpinner className="fa-spin" style={{ fontSize: "24px", color: activePlatform.color }} />
          <p style={{ marginTop: "12px" }}>Loading experiments from Supabase ({activePlatform.id})...</p>
        </div>
      ) : (
        <section className="experiment-list">
          {experiments.map((item, index) => (
            <article id={`experiment-${item.slug}`} key={item.id || item.slug}>
              <span>{String(index + 1).padStart(3, "0")}</span>
              <div>
                <i>{item.type} {item.platform_id ? `[${item.platform_id.toUpperCase()}]` : ""}</i>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <FaFlask style={{ color: activePlatform.color }} />
            </article>
          ))}
        </section>
      )}
    </PublicShell>
  );
}


