import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "../content/site";
import { sw } from "../content/sw";
import { bridge } from "./editBridge";

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
  const [rev, setRev] = useState(0); // bumped by the on-page editor after it changes text in place

  useEffect(() => {
    document.documentElement.lang = lang; // page titles are set per route in App
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }, []);

  bridge.lang = () => lang;
  bridge.setLang = setLang;
  bridge.refresh = () => setRev((r) => r + 1);
  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang], rev }), [lang, setLang, rev]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** { lang, setLang, t } — `t` is the full content object for the active language. */
export function useLang() {
  return useContext(LangContext);
}
