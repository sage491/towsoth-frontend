import { useEffect } from "react";

type StoredPreferences = {
  theme?: string;
};

function getInitialTheme(): string {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedPrefs = localStorage.getItem("towsoth_user_preferences");

  if (savedPrefs) {
    try {
      const prefs = JSON.parse(savedPrefs) as StoredPreferences;
      return prefs.theme || "light";
    } catch {
      return "light";
    }
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useThemeBootstrap(): void {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
}
