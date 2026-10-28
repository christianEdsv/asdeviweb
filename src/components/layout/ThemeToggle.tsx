"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "asdevi-theme";
const THEME_EVENT = "asdevi-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const shouldBeDark = saved === "dark";
      if (document.documentElement.classList.contains("dark") !== shouldBeDark) {
        document.documentElement.classList.toggle("dark", shouldBeDark);
        window.dispatchEvent(new Event(THEME_EVENT));
      }
    } catch {
      // Ignorar si el almacenamiento local está restringido.
    }
  }, []);

  function handleToggle() {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignorar si el almacenamiento local está restringido.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="group relative inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {isDark ? (
        <Sun
          className="size-4 transition-transform duration-300 group-hover:rotate-45"
          aria-hidden
        />
      ) : (
        <Moon
          className="size-4 transition-transform duration-300 group-hover:-rotate-12"
          aria-hidden
        />
      )}
    </button>
  );
}
