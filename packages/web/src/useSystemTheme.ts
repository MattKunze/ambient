import { useEffect, useState } from "react";

export function useSystemTheme() {
  const [theme, setTheme] = useState<"acid" | "synthwave">("acid");

  useEffect(() => {
    // Check system preference on mount
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as
      | "acid"
      | "synthwave"
      | null;

    // Use saved theme if available, otherwise use system preference
    const initialTheme = savedTheme || (isDark ? "synthwave" : "acid");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "synthwave" : "acid";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "acid" ? "synthwave" : "acid";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
}
