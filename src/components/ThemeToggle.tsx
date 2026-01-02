"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const html = document.documentElement;
    const newDark = !isDark;
    
    if (newDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(newDark);
  }

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-md p-2 text-white/80 transition-colors hover:bg-white/10"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
