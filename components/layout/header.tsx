"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 h-16 border-b border-sage-200 bg-white/80 backdrop-blur-md dark:border-midnight-700 dark:bg-midnight-950/80">
        <div className="flex h-full items-center justify-between px-6" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-sage-200 bg-white/80 backdrop-blur-md dark:border-midnight-700 dark:bg-midnight-950/80 transition-gentle">
      <div className="flex h-full items-center justify-between px-6">
        {/* Greeting */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-light text-midnight-900 dark:text-cream-50">
            {getGreeting()}{" "}
            <span className="text-lavender-600 dark:text-lavender-400">✨</span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
