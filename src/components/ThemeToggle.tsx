import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("st-theme") as Theme | null;
    const isDark = stored ? stored === "dark" : document.documentElement.classList.contains("dark");
    const currentTheme: Theme = isDark ? "dark" : "light";
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      window.localStorage.setItem("st-theme", next);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all hover:bg-secondary active:scale-95 shadow-sm ${className}`}
    >
      {mounted && theme === "light" ? (
        <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-800" />
      ) : (
        <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-400" />
      )}
    </button>
  );
}

