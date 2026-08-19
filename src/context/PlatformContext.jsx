import { createContext, useContext, useEffect, useState } from "react";

export const PLATFORMS = {
  alpha: {
    id: "alpha",
    name: "Alpha Platform",
    code: "ALPHA ⚡",
    category: "DEVELOPER & CORE ENGINE",
    tagline: "Indigo Tech Core • System Architecture & Code Studio",
    heroTitle: "Architecting High-Performance Digital Systems.",
    heroSubtitle: "Engineered for speed, security, and developer productivity. Powering modern cloud infrastructure and real-time backend systems.",
    heroBadge: "⚡ PLATFORM ALPHA • DEV CORE 2.0",
    color: "#6366F1",
    colorHover: "#4F46E5",
    colorGlow: "rgba(99, 102, 241, 0.35)",
    badgeBg: "rgba(99, 102, 241, 0.18)",
    badgeText: "#818CF8",
    bgGradient: "radial-gradient(ellipse at 50% 0%, #1E1B4B 0%, #0B0F19 75%)",
    pageBg: "#0B0F19",
    surfaceBg: "rgba(17, 24, 39, 0.85)",
    headerBg: "rgba(11, 15, 25, 0.85)",
    cardBorder: "rgba(99, 102, 241, 0.3)",
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    layoutVariant: "tech-grid",
    logoSymbol: "⚡",
    stats: [
      { label: "Query Latency", value: "< 1.2ms" },
      { label: "Build Pipeline", value: "99.99%" },
      { label: "Active Nodes", value: "1,024" },
    ],
    features: [
      "Real-time PostgreSQL Edge Sync",
      "Type-safe API Contract Generators",
      "Automated CI/CD Deployment Mesh",
    ],
  },
  beta: {
    id: "beta",
    name: "Beta Platform",
    code: "BETA 🌿",
    category: "ECO & SUSTAINABLE INNOVATION",
    tagline: "Emerald Hub • Green Web Technology & Bio-Design",
    heroTitle: "Sustainable Technology for a Cleaner Digital Future.",
    heroSubtitle: "Building low-carbon web architectures, energy-efficient interfaces, and eco-friendly digital products.",
    heroBadge: "🌿 PLATFORM BETA • GREEN ECO LAB",
    color: "#10B981",
    colorHover: "#059669",
    colorGlow: "rgba(16, 185, 129, 0.35)",
    badgeBg: "rgba(16, 185, 129, 0.18)",
    badgeText: "#34D399",
    bgGradient: "radial-gradient(ellipse at 50% 0%, #064E3B 0%, #041D1A 75%)",
    pageBg: "#041D1A",
    surfaceBg: "rgba(6, 44, 39, 0.85)",
    headerBg: "rgba(4, 29, 26, 0.85)",
    cardBorder: "rgba(16, 185, 129, 0.3)",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    layoutVariant: "eco-clean",
    logoSymbol: "🌿",
    stats: [
      { label: "Carbon Saved", value: "84.2%" },
      { label: "Energy Rating", value: "A+ Green" },
      { label: "Green Servers", value: "100% Solar" },
    ],
    features: [
      "Zero-Waste Asset Optimization",
      "Low-Power Dynamic Rendering Engine",
      "Eco-Calculated Carbon Footprint Audit",
    ],
  },
  gamma: {
    id: "gamma",
    name: "Gamma Platform",
    code: "GAMMA ✨",
    category: "CREATIVE MOTION & ART STUDIO",
    tagline: "Purple Studio • Avant-Garde UI/UX & Visual Experiences",
    heroTitle: "Where Creative Artistry Meets Liquid Motion.",
    heroSubtitle: "Crafting immersive digital surfaces, kinetic typography, and memorable interactive art experiences.",
    heroBadge: "✨ PLATFORM GAMMA • MOTION STUDIO",
    color: "#9333EA",
    colorHover: "#7E22CE",
    colorGlow: "rgba(147, 51, 234, 0.35)",
    badgeBg: "rgba(147, 51, 234, 0.18)",
    badgeText: "#C084FC",
    bgGradient: "radial-gradient(ellipse at 50% 0%, #3B0764 0%, #130722 75%)",
    pageBg: "#130722",
    surfaceBg: "rgba(36, 10, 64, 0.85)",
    headerBg: "rgba(19, 7, 34, 0.85)",
    cardBorder: "rgba(147, 51, 234, 0.3)",
    fontFamily: "'Outfit', 'Syne', sans-serif",
    layoutVariant: "motion-art",
    logoSymbol: "✨",
    stats: [
      { label: "Frame Rate", value: "120 FPS" },
      { label: "Motion Shaders", value: "GLSL 3.0" },
      { label: "Design Awards", value: "18 Honoree" },
    ],
    features: [
      "GPU-Accelerated Shader Transitions",
      "Kinetic Micro-Interaction Framework",
      "Spatial Audio & Responsive Motion Grid",
    ],
  },
  delta: {
    id: "delta",
    name: "Delta Platform",
    code: "DELTA 🔥",
    category: "ENTERPRISE ANALYTICS & HUB",
    tagline: "Amber Suite • Executive Intelligence & Heatmap Command",
    heroTitle: "High-Octane Intelligence for Enterprise Decisions.",
    heroSubtitle: "Transforming massive data streams into immediate executive insight with military-grade precision.",
    heroBadge: "🔥 PLATFORM DELTA • ENTERPRISE SUITE",
    color: "#F59E0B",
    colorHover: "#D97706",
    colorGlow: "rgba(245, 158, 11, 0.35)",
    badgeBg: "rgba(245, 158, 11, 0.18)",
    badgeText: "#FBBF24",
    bgGradient: "radial-gradient(ellipse at 50% 0%, #451A03 0%, #1C1204 75%)",
    pageBg: "#1C1204",
    surfaceBg: "rgba(46, 27, 5, 0.85)",
    headerBg: "rgba(28, 18, 4, 0.85)",
    cardBorder: "rgba(245, 158, 11, 0.3)",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    layoutVariant: "enterprise-suite",
    logoSymbol: "🔥",
    stats: [
      { label: "Data Streamed", value: "4.8 PB/day" },
      { label: "Global Clusters", value: "48 Regions" },
      { label: "SLA Uptime", value: "99.999%" },
    ],
    features: [
      "Sub-Millisecond Heatmap Stream Processing",
      "Enterprise Multi-Tenant Security Shield",
      "Automated Predictive Financial Insights",
    ],
  },
};

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  const [platformsMap, setPlatformsMap] = useState(() => {
    const savedCustom = localStorage.getItem("desktopalie_custom_platforms");
    let custom = {};
    if (savedCustom) {
      try {
        custom = JSON.parse(savedCustom);
      } catch (e) {}
    }
    return { ...PLATFORMS, ...custom };
  });

  const [activePlatformId, setActivePlatformId] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramPlatform = searchParams.get("platform")?.toLowerCase();
    const savedCustom = localStorage.getItem("desktopalie_custom_platforms");
    let custom = {};
    if (savedCustom) {
      try { custom = JSON.parse(savedCustom); } catch (e) {}
    }
    const combined = { ...PLATFORMS, ...custom };

    if (paramPlatform && combined[paramPlatform]) {
      return paramPlatform;
    }
    const saved = localStorage.getItem("desktopalie_active_platform")?.toLowerCase();
    if (saved && combined[saved]) {
      return saved;
    }
    return "alpha";
  });

  const activePlatform = platformsMap[activePlatformId] || platformsMap.alpha || PLATFORMS.alpha;

  const setPlatform = (id) => {
    const key = String(id).toLowerCase();
    if (platformsMap[key]) {
      setActivePlatformId(key);
      localStorage.setItem("desktopalie_active_platform", key);
    }
  };

  const addCustomPlatform = (newPlatform) => {
    const key = newPlatform.id.toLowerCase().trim();
    const updated = {
      ...platformsMap,
      [key]: {
        ...newPlatform,
        status: newPlatform.status || "Active",
        stats: newPlatform.stats || [
          { label: "Query Latency", value: "< 2.0ms" },
          { label: "SLA Uptime", value: "99.95%" },
          { label: "Active Nodes", value: "256" },
        ],
        features: newPlatform.features || ["Isolated PostgreSQL RLS", "Custom Edge Domain Sync"],
      },
    };
    setPlatformsMap(updated);
    // save to localStorage
    const customOnly = {};
    Object.keys(updated).forEach((k) => {
      if (!PLATFORMS[k]) {
        customOnly[k] = updated[k];
      }
    });
    localStorage.setItem("desktopalie_custom_platforms", JSON.stringify(customOnly));
  };

  const updatePlatformStatus = (id, status) => {
    const key = id.toLowerCase();
    if (platformsMap[key]) {
      const updated = {
        ...platformsMap,
        [key]: {
          ...platformsMap[key],
          status: status,
        },
      };
      setPlatformsMap(updated);
      if (!PLATFORMS[key]) {
        const customOnly = JSON.parse(localStorage.getItem("desktopalie_custom_platforms") || "{}");
        customOnly[key] = updated[key];
        localStorage.setItem("desktopalie_custom_platforms", JSON.stringify(customOnly));
      }
    }
  };

  // Inject CSS Variables only inside dashboard/backoffice
  useEffect(() => {
    const isDashboard = window.location.pathname.startsWith("/dashboard");
    const root = document.documentElement;
    if (!isDashboard) {
      root.removeAttribute("data-platform");
      root.style.removeProperty("--platform-color");
      root.style.removeProperty("--platform-color-hover");
      root.style.removeProperty("--platform-color-glow");
      root.style.removeProperty("--platform-badge-bg");
      root.style.removeProperty("--platform-badge-text");
      root.style.removeProperty("--platform-page-bg");
      root.style.removeProperty("--platform-surface-bg");
      root.style.removeProperty("--platform-header-bg");
      root.style.removeProperty("--platform-card-border");
      root.style.removeProperty("--platform-bg-gradient");
      return;
    }

    root.setAttribute("data-platform", activePlatform.id);
    root.style.setProperty("--platform-color", activePlatform.color);
    root.style.setProperty("--platform-color-hover", activePlatform.colorHover);
    root.style.setProperty("--platform-color-glow", activePlatform.colorGlow);
    root.style.setProperty("--platform-badge-bg", activePlatform.badgeBg);
    root.style.setProperty("--platform-badge-text", activePlatform.badgeText);
    root.style.setProperty("--platform-page-bg", activePlatform.pageBg || "#0B0F19");
    root.style.setProperty("--platform-surface-bg", activePlatform.surfaceBg || "rgba(17, 24, 39, 0.85)");
    root.style.setProperty("--platform-header-bg", activePlatform.headerBg || "rgba(11, 15, 25, 0.85)");
    root.style.setProperty("--platform-card-border", activePlatform.cardBorder || "rgba(99, 102, 241, 0.3)");
    root.style.setProperty("--platform-bg-gradient", activePlatform.bgGradient || "radial-gradient(ellipse at 50% 0%, #1E1B4B 0%, #0B0F19 75%)");
  }, [activePlatform]);

  return (
    <PlatformContext.Provider
      value={{
        activePlatform,
        activePlatformId: activePlatform.id,
        setPlatform,
        platforms: platformsMap,
        addCustomPlatform,
        updatePlatformStatus,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
