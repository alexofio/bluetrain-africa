import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../content/site";
import { caseStudies, hasPage, cloc } from "../content/cms";
import { redesign, whatsapp } from "../content/redesign";
import { useLang } from "../lib/i18n";
import LangToggle from "./ui/LangToggle";
import Logo from "./ui/Logo";
import ThemeToggle from "./ui/ThemeToggle";
import WorkArt from "./WorkArt";
import { to } from "../lib/router";
import logoWhiteSrc from "../assets/brand/main-logo-white.svg";

const creatorsLabel = (lang) => redesign[lang].menu.links[3].label;

/* Menu open/close is shared between the hero header, the pill nav and the menu itself. */
const EVT = "bt:menu";
export const openMenu = () => window.dispatchEvent(new CustomEvent(EVT, { detail: true }));
const closeMenu = () => window.dispatchEvent(new CustomEvent(EVT, { detail: false }));

/** Newest published case study (date, then last updated). */
export function latestCase() {
  return [...caseStudies].sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.updated || "").localeCompare(a.updated || ""))[0];
}
const caseHref = (c) => (hasPage(c) ? `#/work/${c.slug}` : "#work");

function MenuIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 9h16M4 15h16" />
    </svg>
  );
}

export function MenuButton({ className = "" }) {
  const { lang } = useLang();
  return (
    <button type="button" onClick={openMenu} aria-label={redesign[lang].menu.open} aria-controls="site-menu" className={`grid h-11 w-11 place-items-center rounded-full ${className}`}>
      <MenuIcon />
    </button>
  );
}

/** Big header that sits on the dark hero (home page only); fades away on scroll. */
export function HeroHead() {
  const { lang, t } = useLang();
  return (
    <header className="bt-hero-head relative z-10 mx-auto flex max-w-site items-center justify-between gap-6 px-5 pt-[calc(env(safe-area-inset-top,0px)+1.4rem)] sm:px-8 lg:px-12">
      <a href={to("#top")} aria-label={t.ui.backToTop}>
        <img src={logoWhiteSrc} alt="Bluetrain Africa" width="1046" height="313" className="h-9 w-auto sm:h-[42px]" />
      </a>
      <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-[#ffffff1a] bg-[#ffffff0f] p-1.5 text-sm lg:flex">
        {t.nav.links.map((l) => (
          <a key={l.href} href={to(l.href)} className="rounded-full px-3.5 py-2 text-[#C9D6E3] transition-colors hover:bg-[#ffffff1a] hover:text-[#fff]">{l.label}</a>
        ))}
        <a href={to("#creators")} className="rounded-full px-3.5 py-2 text-[#C9D6E3] transition-colors hover:bg-[#ffffff1a] hover:text-[#fff]">{creatorsLabel(lang)}</a>
      </nav>
      <div className="flex items-center gap-2 text-[#fff]">
        <a href={to(config.bookingUrl)} className="hidden rounded-full bg-amber px-5 py-3 font-display text-sm font-semibold text-rail transition-transform hover:-translate-y-0.5 sm:inline-flex">{t.nav.cta}</a>
        <MenuButton />
      </div>
    </header>
  );
}


/** Compact glass pill: appears after the hero on the home page, always shown on other pages. */
function PillNav({ home }) {
  const { lang, t } = useLang();
  const [on, setOn] = useState(!home);
  useEffect(() => {
    if (!home) return setOn(true);
    if (CSS.supports?.("animation-timeline: view()")) return;
    const f = () => setOn(scrollY > 300);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, [home]);
  return (
    <div className={`fixed left-1/2 top-[calc(env(safe-area-inset-top,0px)+0.85rem)] z-50 w-[min(1180px,94%)] ${home ? `bt-pillnav ${on ? "is-on" : ""}` : "-translate-x-1/2"}`}>
      <nav aria-label="Primary (compact)" className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-navy/95 py-2 pl-4 pr-2 shadow-[0_12px_32px_rgba(16,42,67,0.12)] backdrop-blur-md sm:pl-5">
        <a href={to("#top")} aria-label={t.ui.backToTop}><Logo className="w-[118px] sm:w-[132px]" /></a>
        <span className="hidden gap-5 text-[0.82rem] text-white lg:flex">
          {t.nav.links.map((l) => <a key={l.href} href={to(l.href)} className="bt-ul pb-0.5">{l.label}</a>)}
          <a href={to("#creators")} className="bt-ul pb-0.5">{creatorsLabel(lang)}</a>
        </span>
        <span className="flex items-center gap-1 text-white">
          <a href={to(config.bookingUrl)} className="hidden rounded-xl bg-white px-4 py-2.5 font-display text-[0.82rem] font-semibold text-navy sm:inline-flex">{t.nav.cta}</a>
          <MenuButton />
        </span>
      </nav>
    </div>
  );
}

function CaseCard({ c, compact = false }) {
  const { lang } = useLang();
  const m = redesign[lang].menu;
  if (!c) return null;
  return (
    <a href={to(caseHref(c))} onClick={closeMenu} className="group block overflow-hidden rounded-3xl bg-rail text-[#fff]">
      {!compact && (
        <div className="relative aspect-[16/10] overflow-hidden">
          {c.coverImage ? <img src={c.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <WorkArt kind={c.art} />}
        </div>
      )}
      <div className={compact ? "flex items-center gap-4 p-4" : "p-6"}>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-amber">{m.latest}</p>
          <p className={`mt-1.5 font-display font-semibold leading-tight ${compact ? "truncate text-base" : "text-xl"}`}>{cloc(c, lang, "title")}</p>
          {!compact && <p className="mt-2 text-sm text-[#C9D6E3]">{cloc(c, lang, "metric")}</p>}
        </div>
        <span aria-hidden className={`grid shrink-0 place-items-center rounded-full border border-[#ffffff33] transition-all group-hover:translate-x-1 group-hover:border-amber ${compact ? "h-9 w-9" : "mt-5 h-10 w-10"}`}>→</span>
      </div>
    </a>
  );
}

/** Drop-down menu (desktop) / full sheet (mobile). The page behind is blurred. */
function Menu({ open }) {
  const { lang, t } = useLang();
  const m = redesign[lang].menu;
  const latest = useMemo(latestCase, []);
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <button type="button" aria-label={m.close} onClick={closeMenu} className="absolute inset-0 h-full w-full cursor-default bg-rail/40 backdrop-blur-xl" />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="relative flex max-h-[100svh] flex-col overflow-y-auto bg-navy text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] md:rounded-b-[2rem]"
          >
            <div className="container-site flex items-center justify-between pt-[calc(env(safe-area-inset-top,0px)+1.1rem)]">
              <a href={to("#top")} onClick={closeMenu}><Logo className="w-[132px]" /></a>
              <div className="flex items-center gap-2">
                <LangToggle layoutId="lang-pill-menu" />
                <ThemeToggle />
                <button type="button" onClick={closeMenu} aria-label={m.close} className="grid h-11 w-11 place-items-center rounded-full border border-white/15" autoFocus>
                  <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l12 12M15 3L3 15" /></svg>
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="container-site grid flex-1 gap-10 pb-8 pt-8 md:grid-cols-12 md:pb-12 md:pt-12"
            >
              {/* Big numbered links */}
              <nav aria-label="Menu" className="md:order-2 md:col-span-6">
                <ol className="space-y-1 md:space-y-2">
                  {m.links.map((l, i) => (
                    <li key={l.href} className="flex items-baseline gap-4">
                      <span className="w-7 font-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
                      <a href={to(l.href)} onClick={closeMenu} className="bt-ul font-display text-[clamp(2.6rem,6.2vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">{l.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Secondary links + talk to us */}
              <div className="space-y-8 md:order-1 md:col-span-3">
                <ul className="space-y-2.5 text-[0.95rem]">
                  {m.secondary.map((l) => (
                    <li key={l.label}>
                      <a href={to(l.href)} onClick={closeMenu} {...(l.external ? { target: "_blank", rel: "noopener" } : {})} className="bt-ul pb-0.5 text-silver hover:text-white">{l.label}</a>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="kicker">{m.talk}</p>
                  <a href={whatsapp.href} target="_blank" rel="noopener" className="mt-3 block font-display text-lg font-semibold">{m.whatsapp} {whatsapp.label}</a>
                  <a href={`mailto:${config.email}`} className="mt-1 block text-silver hover:text-white">{config.email}</a>
                  <a href={to(config.bookingUrl)} onClick={closeMenu} className="mt-5 inline-flex rounded-full bg-amber px-5 py-3 font-display text-sm font-semibold text-rail">{t.nav.cta}</a>
                </div>
              </div>

              {/* Latest case study (desktop) */}
              <div className="hidden md:order-3 md:col-span-3 md:block">
                <CaseCard c={latest} />
              </div>
            </motion.div>

            {/* Mobile bottom bar: latest case study + WhatsApp */}
            <div className="sticky bottom-0 flex gap-2 border-t border-white/10 bg-navy/95 p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] md:hidden">
              <div className="min-w-0 flex-1"><CaseCard c={latest} compact /></div>
              <a href={whatsapp.href} target="_blank" rel="noopener" aria-label={`${m.whatsapp} ${whatsapp.label}`} className="grid w-16 shrink-0 place-items-center rounded-3xl bg-[#25D366] text-[#fff]">
                <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.1z" /></svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar({ route = { name: "home" } }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onEvt = (e) => setOpen(!!e.detail);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener(EVT, onEvt);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener(EVT, onEvt); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => setOpen(false), [route.path, route.name]);
  return (
    <>
      <PillNav home={route.name === "home"} />
      <Menu open={open} />
    </>
  );
}
