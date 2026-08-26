import React, { createContext, useContext, useEffect, useState } from "react";
import { toggleThemeWithTransition } from "../utils/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("desktopalie-theme") || "light");

  useEffect(() => {
    localStorage.setItem("desktopalie-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  const toggleTheme = (event) => {
    toggleThemeWithTransition(event, theme, setTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDarkMode: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if not wrapped in provider
    const local = localStorage.getItem("desktopalie-theme") || "light";
    return {
      theme: local,
      setTheme: () => {},
      toggleTheme: () => {},
      isDarkMode: local === "dark"
    };
  }
  return context;
}
