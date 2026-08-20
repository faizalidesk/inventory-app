import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCode,
  FaFigma,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaPalette,
  FaTools,
} from "react-icons/fa";
import {
  SiReact,
  SiVite,
  SiSupabase,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Layers,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Palette,
  Send,
  Sparkles,
  Sun,
  Terminal,
  Zap,
} from "lucide-react";

import DesktopalieMark from "../component/DesktopalieMark";
import AntigravityLogo from "../component/AntigravityLogo";
import "./LandingPage.css";
import { toggleThemeWithTransition } from "../utils/theme";
import { fetchCollection, fetchMaintenanceSettings, fetchLandingPageSettings } from "../services/workspaceService";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/auth-context";

// shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PROJECTS = [
  {
    number: "01",
    slug: "orbit-analytics",
    type: "Web application",
    category: "web",
    title: "Orbit Analytics",
    description: "A focused analytics experience that turns complex product data into clear, useful decisions.",
    tags: ["React", "Data visualization", "Product design", "Supabase"],
    className: "project-orbit",
    stats: "99.8% Uptime • Realtime Sync",
  },
  {
    number: "02",
    slug: "frame-archive",
    type: "Digital experience",
    category: "digital",
    title: "Frame Archive",
    description: "A cinematic digital archive designed around discovery, motion, and thoughtful interaction.",
    tags: ["Creative development", "UI/UX", "Motion", "Tailwind CSS"],
    className: "project-frame",
    stats: "60 FPS Animations • Fluid UX",
  },
  {
    number: "03",
    slug: "mono-systems",
    type: "Design experiment",
    category: "design",
    title: "Mono Systems",
    description: "An exploration of modular interfaces, expressive typography, and reusable design systems.",
    tags: ["Design system", "Prototype", "Art direction", "Figma Tokens"],
    className: "project-mono",
    stats: "30+ Components • Multi-theme",
  },
];

const SERVICES = [
  {
    badge: "01 / ENGINEERING",
    icon: <FaCode />,
    title: "Web development",
    description: "Fast, responsive web applications built with modern frontend architecture, accessibility in mind, and clean semantic code.",
    features: ["React 19 & Next.js Architecture", "Tailwind CSS & shadcn UI components", "Supabase & RESTful API integration", "Speed & Lighthouse 95+ score"],
  },
  {
    badge: "02 / INTERFACE",
    icon: <FaPalette />,
    title: "UI/UX design",
    description: "Interface systems, design kits, and interactive product surfaces designed to feel intuitive, structured, and visually engaging.",
    features: ["Component-driven design in Figma", "Wireframing & interactive prototypes", "User flow & journey mapping", "Design token architecture"],
  },
  {
    badge: "03 / INTERACTION",
    icon: <FaFigma />,
    title: "Creative coding & motion",
    description: "Micro-interactions, kinetic typography, and fluid visual animations that explain state transitions naturally.",
    features: ["Fluid micro-interactions", "CSS & View Transitions API", "Visual feedback loops", "Reduced-motion accessibility"],
  },
  {
    badge: "04 / ARCHITECTURE",
    icon: <FaTools />,
    title: "Design systems",
    description: "Scalable component libraries, coherent color palettes, typography scales, and tokens that keep digital products consistent.",
    features: ["Radix UI accessibility primitives", "Consistent design tokens", "Comprehensive UI style guides", "Cross-team synchronization"],
  },
];

const TECH_STACK = [
  {
    name: "React 19",
    category: "Frontend Core",
    icon: <SiReact className="w-6 h-6 text-[#61dafb]" />,
    desc: "Modern reactive UI architecture with server components and hooks.",
    badgeVariant: "purple",
  },
  {
    name: "Vite 8",
    category: "Build Tooling",
    icon: <SiVite className="w-6 h-6 text-[#a277ff]" />,
    desc: "Blazing fast development server and optimized rollup production bundles.",
    badgeVariant: "pulse",
  },
  {
    name: "Tailwind CSS",
    category: "Styling & Tokens",
    icon: <SiTailwindcss className="w-6 h-6 text-[#38bdf8]" />,
    desc: "Utility-first CSS engine with dynamic theming and responsive design.",
    badgeVariant: "accent",
  },
  {
    name: "shadcn UI",
    category: "Component Library",
    icon: <Layers className="w-6 h-6 text-[#9d7cff]" />,
    desc: "Accessible, copy-pasteable components built on Radix UI primitives.",
    badgeVariant: "purple",
  },
  {
    name: "Supabase",
    category: "Backend & Auth",
    icon: <SiSupabase className="w-6 h-6 text-[#3ecf8e]" />,
    desc: "Realtime PostgreSQL, Row Level Security, Storage, and Edge APIs.",
    badgeVariant: "accent",
  },
  {
    name: "Figma",
    category: "Design & Tokens",
    icon: <FaFigma className="w-6 h-6 text-[#f24e1e]" />,
    desc: "Precision interface prototyping and design token synchronization.",
    badgeVariant: "pulse",
  },
  {
    name: "Antigravity AI",
    category: "Agentic Engineering",
    icon: <AntigravityLogo className="w-6 h-6 text-[#a855f7]" />,
    desc: "Next-generation agentic coding workflows for high-velocity software craft.",
    badgeVariant: "purple",
  },
  {
    name: "Vercel",
    category: "Deployment & CDN",
    icon: <SiVercel className="w-6 h-6 text-foreground" />,
    desc: "Global Edge network with automatic CI/CD and production preview deployments.",
    badgeVariant: "pulse",
  },
];

const WORKFLOW_STEPS = [
  {
    id: "step-1",
    step: "01",
    title: "Discovery & System Architecture",
    description: "Understanding your vision, business goals, and defining the optimal technical stack, data model, and roadmap before writing code.",
    deliverables: "Technical blueprint, architecture spec, and milestones plan.",
  },
  {
    id: "step-2",
    step: "02",
    title: "UI/UX Prototyping & Design Systems",
    description: "Designing high-fidelity interfaces in Figma with modular design tokens, typography scales, and accessible interaction patterns.",
    deliverables: "Interactive prototypes, design tokens, and UI component kit.",
  },
  {
    id: "step-3",
    step: "03",
    title: "Component Engineering & Integration",
    description: "Translating designs into clean React code with shadcn UI, Tailwind CSS, smooth animations, and robust backend Supabase integration.",
    deliverables: "Fully functioning web application, realtime features, clean code.",
  },
  {
    id: "step-4",
    step: "04",
    title: "Optimization, Testing & Launch",
    description: "Comprehensive Lighthouse audits, responsive QA testing, SEO optimization, and zero-downtime deployment to global edge CDN.",
    deliverables: "Production deployment, documentation, and handover support.",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "What types of projects do you specialize in?",
    answer: "I specialize in modern web applications, high-performance landing pages, custom dashboards, SaaS prototypes, and comprehensive design systems built with React, Tailwind CSS, shadcn UI, and Supabase.",
  },
  {
    id: "faq-2",
    question: "How long does a typical project take?",
    answer: "A focused landing page or prototype typically takes 1–2 weeks, while a full-scale web application or custom dashboard takes between 3–6 weeks depending on the complexity of features and integrations.",
  },
  {
    id: "faq-3",
    question: "Can you collaborate with existing teams or designs?",
    answer: "Yes, absolutely! I regularly collaborate with design teams on Figma files, integrate with existing backend APIs, or take an existing codebase and upgrade it with modern UI and performance improvements.",
  },
  {
    id: "faq-4",
    question: "How do we get started on a project?",
    answer: "You can reach out via email at faizalidesk@gmail.com or send a message using the quick inquiry form below. We'll set up an introductory discussion to map out your requirements and timeline.",
  },
];

function ThemeIcon({ theme }) {
  return theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-500" />;
}

const DEFAULT_LANDING_CONTENT = {
  hero_badge: "INDEPENDENT DESIGNER & DEVELOPER",
  hero_title: "Ideas, crafted into digital experiences.",
  hero_description: "Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.",
  hero_cta_text: "Explore my work",
  hero_secondary_cta_text: "More about me",
  hero_note: "CURRENTLY EXPLORING CREATIVE INTERFACES, THOUGHTFUL MOTION, AND USEFUL AI.",
  about_title: "Independent developer crafting interfaces with intent.",
  about_large_copy: "I build websites and software that focus on clarity, motion, and crafted detail.",
  about_description: "With a background bridging front-end engineering and product design, I help brands and teams bring ambitious digital concepts to life with clean code and refined interactions.",
  about_location: "BASED IN INDONESIA • OPEN TO GLOBAL WORK",
  stat_1_value: "04+",
  stat_1_label: "Years building for the web",
  stat_2_value: "20+",
  stat_2_label: "Digital projects shipped",
  stat_3_value: "100%",
  stat_3_label: "Focus on craft & detail",
  contact_title: "Let's make something thoughtful together.",
  contact_email: "faizalidesk@gmail.com",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  instagram_url: "https://instagram.com",
};

export default function LandingPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const [projectsList, setProjectsList] = useState(PROJECTS);
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [heroCanvasTab, setHeroCanvasTab] = useState("preview");

  // Quick Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryService, setInquiryService] = useState("General Inquiry");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // MAINTENANCE STATE
  const [maintenance, setMaintenance] = useState(() => {
    const local = localStorage.getItem("desktopalie_maintenance_settings");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return {
      is_enabled: false,
      title: "System Under Maintenance",
      message: "We are currently performing scheduled maintenance and performance upgrades. We will be back online shortly.",
      end_time: null,
      allow_admin_bypass: true
    };
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // CUSTOMIZABLE LANDING CONTENT
  const [landingContent, setLandingContent] = useState(() => {
    const local = localStorage.getItem("desktopalie_landing_settings");
    if (local) {
      try {
        return { ...DEFAULT_LANDING_CONTENT, ...JSON.parse(local) };
      } catch (e) {}
    }
    return DEFAULT_LANDING_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Load customizable landing page settings & maintenance settings from Supabase
  useEffect(() => {
    async function loadSettings() {
      // 1. Landing Page Content
      try {
        const landingData = await fetchLandingPageSettings();
        if (landingData) {
          const parsed = typeof landingData === "string" ? JSON.parse(landingData) : landingData;
          setLandingContent(prev => ({ ...prev, ...parsed }));
          localStorage.setItem("desktopalie_landing_settings", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error loading landing settings:", e);
      }

      // 2. Maintenance Settings
      try {
        const maintData = await fetchMaintenanceSettings();
        if (maintData) {
          const parsed = typeof maintData === "string" ? JSON.parse(maintData) : maintData;
          setMaintenance(parsed);
        }
      } catch (e) {
        console.error("Error loading maintenance settings:", e);
      }

      // 3. Projects from Supabase
      try {
        const liveProjects = await fetchCollection("projects");
        if (liveProjects && liveProjects.length > 0) {
          setProjectsList(liveProjects.map((p, idx) => ({
            number: String(idx + 1).padStart(2, "0"),
            slug: p.slug,
            type: p.type || "Web application",
            category: (p.type || "").toLowerCase().includes("design") ? "design" : (p.type || "").toLowerCase().includes("digital") ? "digital" : "web",
            title: p.title,
            description: p.description,
            tags: [p.type || "Web", p.status || "Published", ...(p.tags || [])],
            className: idx % 3 === 0 ? "project-orbit" : idx % 3 === 1 ? "project-frame" : "project-mono",
            stats: p.stats || "Featured Project",
          })));
        }
      } catch (e) {
        console.error("Error loading projects for landing:", e);
      }
    }

    loadSettings();

    // Listen to real-time changes
    const channel = supabase
      .channel("landing_page_site_settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          if (payload.new) {
            if (payload.new.key === "landing_page") {
              const val = typeof payload.new.value === "string" ? JSON.parse(payload.new.value) : payload.new.value;
              setLandingContent(prev => ({ ...prev, ...val }));
            }
            if (payload.new.key === "maintenance") {
              const val = typeof payload.new.value === "string" ? JSON.parse(payload.new.value) : payload.new.value;
              setMaintenance(val);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Countdown timer calculation for maintenance mode
  useEffect(() => {
    if (!maintenance.is_enabled || !maintenance.end_time) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const target = new Date(maintenance.end_time).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [maintenance.is_enabled, maintenance.end_time]);

  const toggleTheme = (event) => {
    toggleThemeWithTransition(event, theme, setTheme);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(landingContent.contact_email || "faizalidesk@gmail.com");
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!", {
      icon: "✨",
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "#16161d" : "#ffffff",
        color: theme === "dark" ? "#f7f5ff" : "#17131e",
        border: "1px solid rgba(157, 124, 255, 0.3)",
      },
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmittingInquiry(true);
    // Simulate inquiry submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmittingInquiry(false);
    setIsInquiryOpen(false);
    toast.success("Thank you! Your message has been sent.", {
      icon: "🚀",
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "#16161d" : "#ffffff",
        color: theme === "dark" ? "#f7f5ff" : "#17131e",
      },
    });
    setInquiryName("");
    setInquiryEmail("");
    setInquiryMessage("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProjects = activeProjectTab === "all"
    ? projectsList
    : projectsList.filter((p) => (p.category || "").toLowerCase() === activeProjectTab);

  const isMaintenanceActive = maintenance.is_enabled === true || maintenance.is_enabled === "true" || maintenance.is_enabled === 1;

  // MAINTENANCE MODE VIEW
  if (isMaintenanceActive) {
    return (
      <div className="desktopalie maintenance-view" data-theme={theme}>
        <div className="page-noise" aria-hidden="true" />
        <div className="maintenance-card">
          <div className="maintenance-badge">
            <span className="pulsing-dot" /> SYSTEM UPGRADE IN PROGRESS
          </div>
          <h1>{maintenance.title || "System Under Maintenance"}</h1>
          <p className="maintenance-text">
            {maintenance.message || "We are performing system upgrades and optimizations. Please check back shortly."}
          </p>

          {maintenance.end_time && (
            <div className="countdown-grid">
              <div className="count-unit">
                <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                <span>DAYS</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                <span>HOURS</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                <span>MINUTES</span>
              </div>
              <div className="count-unit">
                <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                <span>SECONDS</span>
              </div>
            </div>
          )}

          {maintenance.allow_admin_bypass !== false && (
            <div className="admin-bypass">
              <Link to="/login" className="admin-login-btn">
                <FaLock /> Sign In to Backoffice
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="desktopalie" data-theme={theme}>
        <div className="page-noise" aria-hidden="true" />

        {/* 1. HEADER / NAVIGATION BAR WITH SHADCN UI */}
        <header className="site-header">
          <div className="site-wrap header-inner">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="brand" aria-label="Desktopalie home">
                    <DesktopalieMark className="brand-mark" />
                    <span>Desktopalie</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>Desktopalie Studio • Portfolio & Lab</span>
                </TooltipContent>
              </Tooltip>

              <Badge variant="accent" className="hidden lg:inline-flex text-[10px] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#73e6ce] animate-pulse" />
                Available for Q1/Q2
              </Badge>
            </div>

            <nav className="site-nav hidden md:flex items-center gap-6" aria-label="Primary navigation">
              <a href="#work" className="hover:text-primary transition-colors">Work</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#capabilities" className="hover:text-primary transition-colors">Capabilities</a>
              <a href="#tech" className="hover:text-primary transition-colors">Tech</a>
              <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>

              {/* shadcn Dropdown Menu for quick exploration */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    Explore <span className="text-[10px]">▼</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Direct Links</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/projects" className="w-full flex items-center justify-between">
                      <span>Projects Archive</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/experiments" className="w-full flex items-center justify-between">
                      <span>Lab Experiments</span>
                      <Sparkles className="w-3 h-3 text-primary" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/services" className="w-full flex items-center justify-between">
                      <span>Services & Pricing</span>
                      <Layers className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="w-full flex items-center justify-between">
                      <span>About Faiz Ali</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="header-actions flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="theme-button"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  >
                    <ThemeIcon theme={theme} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
                </TooltipContent>
              </Tooltip>

              {user ? (
                <Button asChild size="sm" variant="default" className="hidden sm:inline-flex gap-2">
                  <Link to="/dashboard">
                    Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="default" className="hidden sm:inline-flex gap-2 font-bold">
                  <Link to="/login">
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}

              {/* Mobile Drawer Navigation (shadcn Sheet) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col justify-between">
                  <SheetHeader>
                    <div className="flex items-center gap-2 pt-2 pb-4 border-b border-border/60">
                      <DesktopalieMark className="w-6 h-6 text-primary" />
                      <SheetTitle className="text-base font-bold">Desktopalie</SheetTitle>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 py-6 font-mono text-sm">
                    <a href="#work" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">01. Selected Work</a>
                    <a href="#about" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">02. About Studio</a>
                    <a href="#capabilities" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">03. Capabilities</a>
                    <a href="#tech" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">04. Tech Stack</a>
                    <a href="#workflow" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">05. Workflow & FAQ</a>
                    <a href="#contact" className="py-2 px-3 rounded-lg hover:bg-muted transition-colors">06. Contact</a>
                  </div>
                  <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
                    {user ? (
                      <Button asChild className="w-full">
                        <Link to="/dashboard">Go to Dashboard</Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/login">Sign In</Link>
                      </Button>
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                      <span>Theme: {theme.toUpperCase()}</span>
                      <Button variant="outline" size="sm" onClick={toggleTheme}>
                        Toggle
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main id="top">
          {/* 2. HERO SECTION WITH SHADCN UI BADGES, BUTTONS & INTERACTIVE TABS */}
          <section className="hero-section">
            <div className="hero-glow hero-glow-one" aria-hidden="true" />
            <div className="hero-glow hero-glow-two" aria-hidden="true" />
            <div className="site-wrap hero-grid">
              <div className="hero-copy">
                <div className="mb-6 inline-flex">
                  <Badge variant="pulse" className="px-3 py-1 text-xs gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#73e6ce] animate-pulse" />
                    {landingContent.hero_badge}
                  </Badge>
                </div>
                <h1>{landingContent.hero_title}</h1>
                <p>{landingContent.hero_description}</p>
                
                <div className="hero-actions flex flex-wrap items-center gap-4 mt-8">
                  <Button asChild size="lg" variant="glow" className="gap-3">
                    <a href="#work">
                      {landingContent.hero_cta_text} <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="glass" className="gap-2">
                    <a href="#about">
                      {landingContent.hero_secondary_cta_text}
                    </a>
                  </Button>
                </div>

                <div className="hero-note flex items-center gap-3 mt-12 text-xs font-mono text-muted-foreground">
                  <span className="note-line" />
                  {landingContent.hero_note}
                </div>
              </div>

              {/* HERO VISUAL WITH INTERACTIVE SHADCN TABS & HOVER CARDS */}
              <div className="hero-visual" id="experiments" aria-label="Desktopalie workspace preview">
                <div className="visual-orbit orbit-one" />
                <div className="visual-orbit orbit-two" />
                
                <div className="browser-window">
                  <div className="browser-topbar">
                    <div className="browser-dots"><i /><i /><i /></div>
                    <div className="browser-url">desktopalie.my.id/interactive-lab</div>
                    <Tabs value={heroCanvasTab} onValueChange={setHeroCanvasTab} className="w-auto">
                      <TabsList className="h-7 bg-black/20 p-0.5 border-none">
                        <TabsTrigger value="preview" className="text-[10px] px-2 py-0.5 h-6">Preview</TabsTrigger>
                        <TabsTrigger value="code" className="text-[10px] px-2 py-0.5 h-6">Code</TabsTrigger>
                        <TabsTrigger value="tokens" className="text-[10px] px-2 py-0.5 h-6">Tokens</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="browser-content">
                    <div className="mini-sidebar">
                      <DesktopalieMark className="brand-mark" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="side-active cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="right">Workspace Canvas</TooltipContent>
                      </Tooltip>
                      <span className="cursor-pointer" />
                      <span className="cursor-pointer" />
                    </div>

                    <div className="mini-canvas relative">
                      {heroCanvasTab === "preview" && (
                        <>
                          <div className="canvas-label font-mono text-xs flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#73e6ce]" />
                            EXPERIMENT / 024 • LIVE CANVAS
                          </div>
                          <div className="canvas-title">Make it useful.<br />Make it <em>memorable.</em></div>
                          <div className="canvas-art">
                            <div className="art-disc" />
                            <div className="art-card art-card-one">UI/UX</div>
                            <div className="art-card art-card-two">2026</div>
                          </div>
                          <div className="canvas-footer">
                            <span>Creative Development</span>
                            <span>Radix + Tailwind ↗</span>
                          </div>
                        </>
                      )}

                      {heroCanvasTab === "code" && (
                        <div className="p-4 font-mono text-xs text-foreground/90 space-y-2 h-full flex flex-col justify-center">
                          <div className="text-muted-foreground text-[10px]">// Interactive shadcn integration</div>
                          <div><span className="text-[#9d7cff]">const</span> app = <span className="text-[#73e6ce]">await</span> createStudio({`{`}</div>
                          <div className="pl-4">framework: <span className="text-amber-300">"React 19 + Vite 8"</span>,</div>
                          <div className="pl-4">components: <span className="text-amber-300">"shadcn UI / Radix"</span>,</div>
                          <div className="pl-4">styling: <span className="text-amber-300">"Tailwind CSS v3.4"</span>,</div>
                          <div className="pl-4">database: <span className="text-amber-300">"Supabase Realtime"</span></div>
                          <div>{`}`});</div>
                          <div className="pt-2 text-[11px] text-[#73e6ce]">✓ Production Ready & Verified</div>
                        </div>
                      )}

                      {heroCanvasTab === "tokens" && (
                        <div className="p-4 grid grid-cols-2 gap-2 text-xs font-mono h-full items-center">
                          <div className="p-2 rounded-lg bg-[#9d7cff]/15 border border-[#9d7cff]/30">
                            <div className="text-[10px] text-muted-foreground">PRIMARY</div>
                            <div className="font-bold text-[#9d7cff]">#9d7cff</div>
                          </div>
                          <div className="p-2 rounded-lg bg-[#73e6ce]/15 border border-[#73e6ce]/30">
                            <div className="text-[10px] text-muted-foreground">ACCENT</div>
                            <div className="font-bold text-[#73e6ce]">#73e6ce</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-[10px] text-muted-foreground">RADIUS</div>
                            <div className="font-bold">0.75rem</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-[10px] text-muted-foreground">FONT</div>
                            <div className="font-bold">Manrope</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating tags with shadcn HoverCard */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="floating-code cursor-pointer select-none">
                      <span>const</span> craft = <b>await</b> build();
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-64">
                    <div className="flex items-center gap-2 mb-1">
                      <Terminal className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs font-bold">Autonomous Engine</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Engineered with precision code and modern reactive architecture.
                    </p>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="floating-tag cursor-pointer select-none">
                      DESIGN × CODE ✦
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="bottom" className="w-64">
                    <div className="flex items-center gap-2 mb-1">
                      <Palette className="w-4 h-4 text-[#73e6ce]" />
                      <span className="font-mono text-xs font-bold">Visual Craft</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bridging the gap between Figma design systems and accessible frontend code.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </section>

          {/* 3. TECH STACK & TOOLING SECTION WITH SHADCN HOVERCARDS & BADGES */}
          <section className="py-12 border-y border-border/60 bg-muted/20" id="tech">
            <div className="site-wrap">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <Badge variant="purple" className="mb-2">CORE TECHNOLOGIES</Badge>
                  <h3 className="text-xl sm:text-2xl font-bold">Engineered with modern tools</h3>
                </div>
                <p className="text-xs font-mono text-muted-foreground max-w-sm">
                  Hover any technology to inspect the architecture and ecosystem role.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {TECH_STACK.map((tech) => (
                  <HoverCard key={tech.name}>
                    <HoverCardTrigger asChild>
                      <Card className="p-3 bg-card/60 hover:bg-card hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.03] flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {tech.icon}
                        </div>
                        <span className="font-mono text-[11px] font-semibold">{tech.name}</span>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64" side="top">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-sm">{tech.name}</span>
                        <Badge variant={tech.badgeVariant} className="text-[9px] py-0 px-1.5">
                          {tech.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          </section>

          {/* 4. SELECTED WORK / PROJECTS SECTION WITH SHADCN TABS, CARDS & MODAL DIALOG */}
          <section className="section" id="work">
            <div className="site-wrap">
              <div className="section-heading split-heading">
                <div>
                  <Badge variant="purple" className="mb-4">01 / SELECTED WORK</Badge>
                  <h2>Things I have<br />been building.</h2>
                </div>
                <div>
                  <p className="mb-6">A selection of digital products and visual experiments where strategy, design, and code meet.</p>
                  
                  {/* Category Filter Tabs */}
                  <Tabs value={activeProjectTab} onValueChange={setActiveProjectTab}>
                    <TabsList className="grid grid-cols-4 w-full max-w-md">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="web">Web</TabsTrigger>
                      <TabsTrigger value="digital">Motion</TabsTrigger>
                      <TabsTrigger value="design">Systems</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.slug || project.title}
                    className="group relative overflow-hidden bg-card/80 border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Project Visual Header */}
                      <div className={`project-visual ${project.className || "project-orbit"} h-48 relative overflow-hidden rounded-t-xl`}>
                        <span className="project-number">{project.number}</span>
                        <div className="project-window">
                          <div className="project-window-bar"><span /><span /><span /></div>
                          <div className="project-window-body">
                            <i /><i /><i /><i />
                          </div>
                        </div>
                      </div>

                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <Badge variant="accent" className="text-[10px]">{project.type}</Badge>
                          <span className="text-[10px] font-mono text-muted-foreground">{project.stats}</span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2 mt-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                    </div>

                    <CardFooter className="p-5 pt-3 flex flex-col gap-4 border-t border-border/40 mt-4">
                      <div className="flex flex-wrap gap-1.5 w-full">
                        {(project.tags || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[9px] py-0 px-2">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between w-full pt-1">
                        {/* Quick View Dialog Trigger */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1.5 h-8 px-2.5"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="w-3.5 h-3.5" /> Quick View
                        </Button>

                        <Button asChild size="sm" variant="default" className="text-xs gap-1 h-8 px-3">
                          <Link to={`/projects/${project.slug}`}>
                            Case Study <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECT QUICK VIEW MODAL (SHADCN DIALOG) */}
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

                  <div className="py-3 space-y-4">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                        Technologies & Design Tokens
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProject.tags || []).map((t) => (
                          <Badge key={t} variant="pulse" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs font-mono text-muted-foreground">
                      <span>Status: Verified & Live in Portfolio Database</span>
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

          {/* 5. ABOUT SECTION WITH SHADCN CARDS, TABS & STATS */}
          <section className="section about-section" id="about">
            <div className="site-wrap about-grid">
              <div className="about-visual group">
                <div className="about-glow" aria-hidden="true" />
                <Card className="portrait-card relative overflow-hidden border-border/80 shadow-2xl">
                  <div className="portrait-grid" />
                  <div className="portrait-monogram">FA</div>
                  <span className="portrait-caption flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#73e6ce] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#73e6ce]" />
                    </span>
                    {landingContent.about_location}
                  </span>
                </Card>
                <Badge variant="accent" className="about-sticker shadow-lg">
                  Curious by default ✦
                </Badge>
              </div>

              <div className="about-copy">
                <Badge variant="purple" className="mb-4">02 / ABOUT</Badge>
                <h2>{landingContent.about_title}</h2>

                {/* About Content Tabs */}
                <Tabs defaultValue="story" className="mt-6">
                  <TabsList className="grid grid-cols-3 w-full max-w-sm mb-4">
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
                    <TabsTrigger value="approach">Approach</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="story" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-1 duration-300">
                    <p className="large-copy text-foreground font-medium text-lg leading-relaxed">
                      {landingContent.about_large_copy}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {landingContent.about_description}
                    </p>
                  </TabsContent>

                  <TabsContent value="philosophy" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-1 duration-300">
                    <p className="large-copy text-foreground font-medium text-lg leading-relaxed">
                      Form and function are not opposing forces—they amplify each other.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every interface decision should serve clarity, accessibility, and delight. I believe software should feel tactile, fast, and respectful of human attention.
                    </p>
                  </TabsContent>

                  <TabsContent value="approach" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-1 duration-300">
                    <p className="large-copy text-foreground font-medium text-lg leading-relaxed">
                      Modular design tokens meet scalable fullstack engineering.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      By utilizing atomic design principles with shadcn UI, Tailwind CSS, and typed component contracts, I create design systems that scale effortlessly from day one.
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Stats Grid using shadcn Cards */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border/60">
                  <Card className="p-4 text-center bg-card/50 border-border/60 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group cursor-default">
                    <strong className="block text-2xl sm:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">{landingContent.stat_1_value}</strong>
                    <span className="block mt-1 text-[11px] font-mono text-muted-foreground">{landingContent.stat_1_label}</span>
                  </Card>
                  <Card className="p-4 text-center bg-card/50 border-border/60 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group cursor-default">
                    <strong className="block text-2xl sm:text-3xl font-bold text-[#73e6ce] group-hover:scale-110 transition-transform duration-300">{landingContent.stat_2_value}</strong>
                    <span className="block mt-1 text-[11px] font-mono text-muted-foreground">{landingContent.stat_2_label}</span>
                  </Card>
                  <Card className="p-4 text-center bg-card/50 border-border/60 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group cursor-default">
                    <strong className="block text-2xl sm:text-3xl font-bold text-[#ff8eb4] group-hover:scale-110 transition-transform duration-300">{landingContent.stat_3_value}</strong>
                    <span className="block mt-1 text-[11px] font-mono text-muted-foreground">{landingContent.stat_3_label}</span>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* 6. CAPABILITIES SECTION WITH SHADCN CARDS & FEATURE LISTS */}
          <section className="section" id="capabilities">
            <div className="site-wrap">
              <div className="section-heading centered-heading text-center flex flex-col items-center justify-center mx-auto">
                <Badge variant="purple" className="mb-4">03 / CAPABILITIES</Badge>
                <h2 className="text-center">From first sketch<br />to final interaction.</h2>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4 text-center">
                  Comprehensive engineering and design services tailored for ambitious teams and digital products.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {SERVICES.map((service) => (
                  <Card
                    key={service.title}
                    className="p-6 bg-card/80 border-border/70 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="pulse" className="text-[10px] font-mono">{service.badge}</Badge>
                        <div className="service-icon w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base">
                          {service.icon}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mt-6 mb-2 text-foreground">{service.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>

                      <Separator className="my-4" />

                      <ul className="space-y-2">
                        {service.features.map((feat) => (
                          <li key={feat} className="text-xs font-mono text-foreground/80 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#73e6ce] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-6 text-xs gap-1.5"
                      onClick={() => {
                        setInquiryService(service.title);
                        setIsInquiryOpen(true);
                      }}
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Inquire Service
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* 7. NEW SECTION: WORKFLOW PROCESS & FAQ WITH SHADCN ACCORDIONS */}
          <section className="section bg-card/30 border-y border-border/60" id="workflow">
            <div className="site-wrap">
              <div className="section-heading split-heading">
                <div>
                  <Badge variant="purple" className="mb-4">04 / PROCESS & FAQ</Badge>
                  <h2>How ideas become<br />reality.</h2>
                </div>
                <p>
                  A structured, transparent development lifecycle paired with answers to common collaboration questions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
                {/* Left: 4-Stage Development Workflow */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-primary" />
                    <h3 className="text-lg font-bold font-mono uppercase tracking-wider">Development Lifecycle</h3>
                  </div>

                  <Accordion type="single" collapsible defaultValue="step-1" className="w-full">
                    {WORKFLOW_STEPS.map((step) => (
                      <AccordionItem key={step.id} value={step.id}>
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-3">
                            <Badge variant="purple" className="text-[10px] px-2">{step.step}</Badge>
                            <span>{step.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-xs space-y-2">
                          <p>{step.description}</p>
                          <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40 font-mono text-[11px] text-foreground">
                            <span className="text-[#73e6ce] font-semibold">Key Deliverables:</span> {step.deliverables}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* Right: Frequently Asked Questions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#73e6ce]" />
                    <h3 className="text-lg font-bold font-mono uppercase tracking-wider">Frequently Asked Questions</h3>
                  </div>

                  <Accordion type="single" collapsible defaultValue="faq-1" className="w-full">
                    {FAQS.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-sm text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs">
                          <p className="leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </section>

          {/* 8. CONTACT SECTION WITH SHADCN CARD, BUTTONS, EMAIL COPY & INQUIRY MODAL */}
          <section className="contact-section relative overflow-hidden" id="contact">
            <div className="site-wrap contact-inner">
              <Badge variant="pulse" className="mb-4">HAVE AN IDEA?</Badge>
              <h2>{landingContent.contact_title}</h2>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  variant="glow"
                  className="gap-2.5 text-sm font-mono"
                  onClick={handleCopyEmail}
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4 text-emerald-950" />}
                  {landingContent.contact_email}
                </Button>

                <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="gap-2 text-sm font-semibold">
                      <Mail className="w-4 h-4" /> Send Quick Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Start a Conversation</DialogTitle>
                      <DialogDescription className="text-xs">
                        Have a project, experiment, or collaboration in mind? Leave a note and I'll get back within 24 hours.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSendInquiry} className="space-y-3.5 py-2">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-muted-foreground">Your Name *</label>
                        <Input
                          placeholder="e.g. Alex Morgan"
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-muted-foreground">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="alex@company.com"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-muted-foreground">Topic / Service</label>
                        <Input
                          value={inquiryService}
                          onChange={(e) => setInquiryService(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-muted-foreground">Project Details *</label>
                        <Textarea
                          placeholder="Tell me a bit about what you want to build..."
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          rows={3}
                          required
                        />
                      </div>

                      <DialogFooter className="pt-2">
                        <Button type="submit" disabled={isSubmittingInquiry} className="w-full gap-2 font-bold">
                          {isSubmittingInquiry ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Submit Inquiry</>}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="contact-login mt-8 text-xs text-muted-foreground">
                {user ? (
                  <>Welcome back, <span className="text-primary font-bold">{user.email?.split("@")[0]}</span>! <Link to="/dashboard" className="text-primary font-semibold hover:underline">Go to Dashboard →</Link></>
                ) : (
                  <>Already part of the studio? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in to Backoffice →</Link></>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* 9. FOOTER WITH SHADCN SEPARATOR, TOOLTIPS & BACK TO TOP BUTTON */}
        <footer className="site-footer">
          <div className="site-wrap footer-inner">
            <Link to="/" className="brand">
              <DesktopalieMark className="brand-mark" />
              <span>Desktopalie</span>
            </Link>
            
            <p className="text-xs font-mono text-muted-foreground">
              Projects, experiments, and digital creations.
            </p>

            <div className="social-links flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={landingContent.github_url || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="p-2 rounded-full border border-border/70 hover:border-primary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaGithub />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">GitHub Profile</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={landingContent.linkedin_url || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="p-2 rounded-full border border-border/70 hover:border-primary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaLinkedinIn />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">LinkedIn Profile</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={landingContent.instagram_url || "https://instagram.com"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="p-2 rounded-full border border-border/70 hover:border-primary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaInstagram />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">Instagram</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={scrollToTop}
                    className="rounded-full w-8 h-8 ml-2 hover:bg-muted"
                    aria-label="Scroll to top"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Back to top</TooltipContent>
              </Tooltip>
            </div>

            <span className="copyright text-[10px] font-mono text-muted-foreground">
              © {new Date().getFullYear()} DESKTOPALIE
            </span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
