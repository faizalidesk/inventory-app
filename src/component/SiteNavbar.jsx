import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  Sun, 
  Moon, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Newspaper,
  Briefcase,
  User,
  Cpu,
  HelpCircle,
  Mail,
  ChevronRight,
  Code
} from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import DesktopalieMark from "./DesktopalieMark";
import { useAuth } from "../context/auth-context";
import { useTheme } from "../context/ThemeContext";
import { fetchLandingPageSettings } from "../services/workspaceService";

// shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function ThemeIcon({ theme }) {
  return theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-500" />;
}

export default function SiteNavbar({ activeNav = "" }) {
  const { user } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isHomePage = location.pathname === "/" || location.pathname === "/landingpage";

  const [allowLogin, setAllowLogin] = useState(() => {
    try {
      const local = localStorage.getItem("desktopalie_landing_settings");
      if (local) {
        const parsed = JSON.parse(local);
        return parsed.allow_login !== false;
      }
    } catch (e) {}
    return true;
  });

  useEffect(() => {
    let mounted = true;
    async function checkLogin() {
      try {
        const data = await fetchLandingPageSettings();
        if (mounted && data) {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          if (parsed.allow_login !== undefined) {
            setAllowLogin(parsed.allow_login !== false);
          }
        }
      } catch (e) {}
    }
    checkLogin();
    return () => { mounted = false; };
  }, []);

  return (
    <TooltipProvider delayDuration={150}>
      <header className="site-navbar sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* BRAND & AVAILABILITY BADGE */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/" className="flex items-center gap-2.5 text-foreground no-underline group shrink-0" aria-label="Desktopalie home">
                  <span className="w-8 h-8 flex items-center justify-center shrink-0">
                    <DesktopalieMark style={{ width: "28px", height: "26px", display: "block" }} />
                  </span>
                  <span className="font-brand-script text-base sm:text-lg font-normal text-foreground group-hover:text-primary transition-colors tracking-normal pt-0.5">
                    Desktopalie
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <span>Desktopalie Studio • Portfolio & Lab</span>
              </TooltipContent>
            </Tooltip>

            <Badge variant="accent" className="hidden lg:inline-flex items-center gap-1.5 text-[10px] py-0.5 px-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for Q1/Q2
            </Badge>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground" aria-label="Primary navigation">
            <a 
              href={isHomePage ? "#work" : "/projects"} 
              className={`hover:text-foreground transition-colors no-underline ${location.pathname === "/projects" ? "text-foreground font-bold" : ""}`}
            >
              Work
            </a>
            <a 
              href={isHomePage ? "#about" : "/about"} 
              className={`hover:text-foreground transition-colors no-underline ${location.pathname === "/about" ? "text-foreground font-bold" : ""}`}
            >
              About
            </a>
            <Link 
              to="/news" 
              className={`hover:text-foreground transition-colors flex items-center gap-1.5 no-underline font-semibold ${location.pathname.startsWith("/news") ? "text-foreground font-bold" : ""}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              News
            </Link>
            <a 
              href={isHomePage ? "#tech" : "/#tech"} 
              className="hover:text-foreground transition-colors no-underline"
            >
              Tech
            </a>
            <a 
              href={isHomePage ? "#workflow" : "/#workflow"} 
              className="hover:text-foreground transition-colors no-underline"
            >
              Workflow
            </a>
            <a 
              href={isHomePage ? "#contact" : "/contact"} 
              className={`hover:text-foreground transition-colors no-underline ${location.pathname === "/contact" ? "text-foreground font-bold" : ""}`}
            >
              Contact
            </a>

            {/* EXPLORE DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors bg-transparent border-0 p-0 outline-none">
                  Explore <span className="text-[10px]">▼</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-md">
                <DropdownMenuLabel className="text-xs font-mono text-muted-foreground">Direct Links</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/news" className="w-full flex items-center justify-between cursor-pointer no-underline">
                    <span className="font-semibold text-primary">News Portal (75 Berita)</span>
                    <Newspaper className="w-3.5 h-3.5 text-primary" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="w-full flex items-center justify-between cursor-pointer no-underline">
                    <span>Projects Archive</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/experiments" className="w-full flex items-center justify-between cursor-pointer no-underline">
                    <span>Lab Experiments</span>
                    <Sparkles className="w-3 h-3 text-primary" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services" className="w-full flex items-center justify-between cursor-pointer no-underline">
                    <span>Services & Pricing</span>
                    <Layers className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full flex items-center justify-between cursor-pointer no-underline">
                    <span>About Desktopalie</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* RIGHT ACTIONS: THEME TOGGLE & AUTH */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-border/80 bg-card/90 flex items-center justify-center text-foreground hover:border-primary/50 transition-all cursor-pointer shadow-xs"
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
              <Button asChild size="sm" variant="default" className="hidden sm:inline-flex gap-2 font-bold shadow-sm rounded-lg">
                <Link to="/dashboard" className="no-underline">
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : allowLogin ? (
              <Button asChild size="sm" variant="default" className="hidden sm:inline-flex gap-2 font-bold shadow-sm rounded-lg">
                <Link to="/login" className="no-underline">
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : null}

            {/* MOBILE DRAWER SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] flex flex-col justify-between bg-card border-border p-5 overflow-y-auto">
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          <DesktopalieMark size={20} />
                        </span>
                        <div>
                          <SheetTitle className="font-brand-script text-lg font-normal leading-none">Desktopalie</SheetTitle>
                          <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">Creative Studio & Lab</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10 py-0.5 px-2">
                        ● Active
                      </Badge>
                    </div>
                  </SheetHeader>

                  {/* Navigation List */}
                  <div className="flex flex-col gap-1.5 py-4">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                      Menu Utama
                    </span>

                    <Link
                      to={isHomePage ? "/#work" : "/projects"}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                        location.pathname.startsWith("/projects") ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>01. Selected Work</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                      to={isHomePage ? "/#about" : "/about"}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                        location.pathname === "/about" ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-primary" />
                        <span>02. About Studio</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                      to="/news"
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                        location.pathname.startsWith("/news") ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Newspaper className="w-4 h-4 text-primary" />
                        <span>03. News & Warta</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-mono font-bold">
                        75+
                      </span>
                    </Link>

                    <Link
                      to="/experiments"
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                        location.pathname === "/experiments" ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span>04. Lab Experiments</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>

                    <a
                      href="/#workflow"
                      className="flex items-center justify-between p-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/60 transition-all no-underline"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        <span>05. Workflow & FAQ</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>

                    <Link
                      to="/contact"
                      className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                        location.pathname === "/contact" ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>06. Contact</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </div>

                  {/* Quick Socials & Ecosystem */}
                  <div className="pt-3 pb-2 border-t border-border/60">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-2 block mb-2">
                      Connect & Socials
                    </span>
                    <div className="flex items-center gap-2 px-1">
                      <a
                        href="https://github.com/faizalidesk"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 p-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/60 flex items-center justify-center text-foreground transition-colors"
                        title="GitHub"
                      >
                        <FaGithub className="text-sm" />
                      </a>
                      <a
                        href="https://linkedin.com/in/faizalidesk"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 p-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/60 flex items-center justify-center text-foreground transition-colors"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="text-sm" />
                      </a>
                      <a
                        href="https://www.instagram.com/desktopalie"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 p-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/60 flex items-center justify-center text-foreground transition-colors"
                        title="Instagram"
                      >
                        <FaInstagram className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Auth & Theme Switcher */}
                <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
                  {user ? (
                    <Button asChild className="w-full font-bold rounded-xl shadow-xs">
                      <Link to="/dashboard" className="no-underline">Go to Dashboard</Link>
                    </Button>
                  ) : allowLogin ? (
                    <Button asChild className="w-full font-bold rounded-xl shadow-xs">
                      <Link to="/login" className="no-underline">Sign In</Link>
                    </Button>
                  ) : null}

                  <div className="flex justify-between items-center text-xs p-2 rounded-xl bg-muted/40 border border-border/60">
                    <span className="font-mono text-muted-foreground flex items-center gap-2">
                      <ThemeIcon theme={theme} /> Theme: <strong className="text-foreground">{theme.toUpperCase()}</strong>
                    </span>
                    <Button variant="outline" size="sm" onClick={toggleTheme} className="h-7 text-xs px-2.5 rounded-lg">
                      Switch
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
