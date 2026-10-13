import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import LangToggle from "./ui/LangToggle";
import { spring } from "../lib/motion";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";
import { to } from "../lib/router";

function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

// Section ids are fixed; labels come from the active language
const SECTION_IDS = ["work", "services", "about"];

export default function Navbar({ route = { name: "home" } }) {
  const { t } = useLang();
  const nav = t.nav;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-5">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring.soft, delay: 0.1 }}
        className={`mx-auto flex max-w-site items-center justify-between rounded-full border py-2.5 pl-5 pr-2.5 backdrop-blur-md transition-colors duration-300 sm:pl-6 ${
          scrolled ? "border-white/10 bg-navy/70 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]" : "border-white/5 bg-brand/10"
        }`}
      >
        <a href={to("#top")} className="shrink-0" aria-label={t.ui.backToTop}>
          <Logo className="w-[150px] shrink-0" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.links.map((l) => {
            const isActive = l.href.startsWith("#/") ? route.name === "informed" || route.name === "post" : route.name === "home" && active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={to(l.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? "text-white" : "text-silver/70 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring.snappy}
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:flex" />
          <ThemeToggle />
          <Button href={config.bookingUrl} target="_blank" rel="noreferrer" size="sm" className="hidden sm:inline-flex">
            {nav.cta}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={spring.snappy}
            className="mx-auto mt-2 max-w-site rounded-3xl border border-white/10 bg-navy/90 p-3 backdrop-blur-md md:hidden"
          >
            <ul>
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={to(l.href)} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-display text-lg text-white hover:bg-white/5">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between rounded-2xl px-4 py-2">
              <span className="text-sm text-steel">{t.ui.language}</span>
              <LangToggle layoutId="lang-pill-mobile" />
            </div>
            <Button href={config.bookingUrl} target="_blank" rel="noreferrer" className="mt-2 w-full">
              {nav.cta}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
