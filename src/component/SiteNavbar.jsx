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
  Newspaper 
} from "lucide-react";
import DesktopalieMark from "./DesktopalieMark";
import { toggleThemeWithTransition } from "../utils/theme";
import { useAuth } from "../context/auth-context";

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
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "dark");
  const isHomePage = location.pathname === "/" || location.pathname === "/landingpage";

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = (event) => {
    toggleThemeWithTransition(event, theme, setTheme);
  };

  const getHref = (anchor, fallbackRoute) => {
    return isHomePage ? `#${anchor}` : `/${fallbackRoute || anchor}`;
  };

  return (
    <TooltipProvider delayDuration={150}>
      <header className="site-header">
        <div className="site-wrap header-inner">
          {/* BRAND & AVAILABILITY BADGE */}
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

          {/* DESKTOP NAV LINKS */}
          <nav className="site-nav hidden md:flex items-center gap-6" aria-label="Primary navigation">
            <a 
              href={isHomePage ? "#work" : "/projects"} 
              className={`hover:text-primary transition-colors ${location.pathname === "/projects" ? "text-primary font-bold" : ""}`}
            >
              Work
            </a>
            <a 
              href={isHomePage ? "#about" : "/about"} 
              className={`hover:text-primary transition-colors ${location.pathname === "/about" ? "text-primary font-bold" : ""}`}
            >
              About
            </a>
            <Link 
              to="/news" 
              className={`hover:text-primary transition-colors flex items-center gap-1.5 font-semibold ${location.pathname.startsWith("/news") ? "text-primary font-bold" : ""}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              News
            </Link>
            <a 
              href={isHomePage ? "#tech" : "/#tech"} 
              className="hover:text-primary transition-colors"
            >
              Tech
            </a>
            <a 
              href={isHomePage ? "#workflow" : "/#workflow"} 
              className="hover:text-primary transition-colors"
            >
              Workflow
            </a>
            <a 
              href={isHomePage ? "#contact" : "/contact"} 
              className={`hover:text-primary transition-colors ${location.pathname === "/contact" ? "text-primary font-bold" : ""}`}
            >
              Contact
            </a>

            {/* EXPLORE DROPDOWN */}
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
                  <Link to="/news" className="w-full flex items-center justify-between cursor-pointer">
                    <span>Warta & Berita</span>
                    <Newspaper className="w-3.5 h-3.5 text-primary" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="w-full flex items-center justify-between cursor-pointer">
                    <span>Projects Archive</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/experiments" className="w-full flex items-center justify-between cursor-pointer">
                    <span>Lab Experiments</span>
                    <Sparkles className="w-3 h-3 text-primary" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services" className="w-full flex items-center justify-between cursor-pointer">
                    <span>Services & Pricing</span>
                    <Layers className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full flex items-center justify-between cursor-pointer">
                    <span>About Faiz Ali</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* RIGHT ACTIONS: THEME TOGGLE & AUTH */}
          <div className="header-actions flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
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

            {/* MOBILE DRAWER SHEET */}
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
                  <a 
                    href={isHomePage ? "#work" : "/projects"} 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    01. Selected Work
                  </a>
                  <a 
                    href={isHomePage ? "#about" : "/about"} 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    02. About Studio
                  </a>
                  <Link 
                    to="/news" 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors text-primary font-bold flex items-center justify-between"
                  >
                    <span>03. News & Warta</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">75 Berita</span>
                  </Link>
                  <a 
                    href="/#tech" 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    04. Tech Stack
                  </a>
                  <a 
                    href="/#workflow" 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    05. Workflow & FAQ
                  </a>
                  <a 
                    href={isHomePage ? "#contact" : "/contact"} 
                    className="py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    06. Contact
                  </a>
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
    </TooltipProvider>
  );
}
