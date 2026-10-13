import { useCallback, useEffect, useState } from "react";

const KEY = "bluetrain-theme";
const META = { dark: "#102A43", light: "#f6f7f7" };

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META[theme]);
}

/** Theme state: saved choice → otherwise the visitor's system setting. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");

  // Follow system changes until the visitor picks a theme themselves
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch {}
      if (!saved) { const t = e.matches ? "light" : "dark"; apply(t); setTheme(t); }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch {}
      return next;
    });
  }, []);

  return { theme, toggle };
}
