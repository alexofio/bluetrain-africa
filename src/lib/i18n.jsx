import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "../content/site";
import { sw } from "../content/sw";

const KEY = "bluetrain-lang";
const dictionaries = { en, sw };
const LangContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "sw") return saved;
  } catch {}
  // First visit: Swahili for visitors whose browser prefers it, otherwise English
  return (navigator.languages || [navigator.language]).some((l) => l?.toLowerCase().startsWith("sw")) ? "sw" : "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dictionaries[lang].meta.title;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** { lang, setLang, t } — `t` is the full content object for the active language. */
export function useLang() {
  return useContext(LangContext);
}
