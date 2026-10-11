import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

const THEME_STORAGE_KEY = "st-theme";

function updateMetaThemeColor(isDark: boolean) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", isDark ? "#020617" : "#ffffff");
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const initial: ThemeMode = stored ? stored : document.documentElement.classList.contains("dark") ? "dark" : "light";
      setThemeState(initial);
      const isDark = initial === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      updateMetaThemeColor(isDark);
    } catch {
      // fallback
    }
  }, []);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    const isDark = next === "dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
      updateMetaThemeColor(isDark);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {}
      window.dispatchEvent(new CustomEvent("st:theme-change", { detail: { theme: next } }));
    }
  };

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
