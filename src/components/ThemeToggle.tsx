import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Activate Light Mode" : "Activate Dark Mode"}
      className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all hover:bg-secondary active:scale-95 shadow-sm ${className}`}
    >
      {!isDark ? (
        <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-800" />
      ) : (
        <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-400" />
      )}
    </button>
  );
}

export default ThemeToggle;
