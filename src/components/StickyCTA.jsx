import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { to } from "../lib/router";

/** Mobile-only action bar: appears after the hero, hides near the contact form and footer. */
export default function StickyCTA() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const contact = document.getElementById("contact");
    const nearEnd = contact ? contact.getBoundingClientRect().top < innerHeight * 0.9 : y + innerHeight > document.body.scrollHeight - 400;
    setShow(y > innerHeight * 0.8 && !nearEnd);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label={t.ui.sticky.label}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={spring.snappy}
          className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] z-40 flex gap-2 rounded-full border border-white/10 bg-navy/85 p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md md:hidden"
        >
          <a href={to("#contact")} className="flex h-11 flex-1 items-center justify-center rounded-full font-display text-sm font-semibold text-white">{t.hero.primaryCta.label}</a>
          <a href={config.bookingUrl} target="_blank" rel="noreferrer" className="flex h-11 flex-1 items-center justify-center rounded-full bg-white font-display text-sm font-semibold text-navy">{t.nav.cta}</a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
