import { motion } from "framer-motion";
import { useLang } from "../../lib/i18n";
import { spring } from "../../lib/motion";

const options = [
  { id: "en", short: "EN", full: "English" },
  { id: "sw", short: "SW", full: "Kiswahili" },
];

/** Segmented EN | SW switch. Each option is labelled in its own language. */
export default function LangToggle({ className = "", layoutId = "lang-pill" }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.ui.language} className={`relative flex h-10 items-center rounded-full border border-white/10 p-1 ${className}`}>
      {options.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            lang={o.id}
            aria-pressed={active}
            aria-label={o.full}
            title={o.full}
            onClick={() => setLang(o.id)}
            className={`relative h-full rounded-full px-2.5 font-display text-xs font-semibold tracking-[0.02em] transition-colors ${
              active ? "text-navy" : "text-silver/70 hover:text-white"
            }`}
          >
            {active && <motion.span layoutId={layoutId} transition={spring.snappy} className="absolute inset-0 rounded-full bg-white" />}
            <span className="relative">{o.short}</span>
          </button>
        );
      })}
    </div>
  );
}
