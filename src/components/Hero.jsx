import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { config } from "../content/site";
import { spring } from "../lib/motion";
import Button from "./ui/Button";
import SignalField from "./SignalField";
import { to } from "../lib/router";

const line = {
  hidden: { y: "105%" },
  show: (i) => ({ y: "0%", transition: { ...spring.soft, delay: 0.25 + i * 0.14 } }),
};
const after = (d) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ...spring.soft, delay: d } },
});

export default function Hero() {
  const { lang, t } = useLang();
  const hero = t.hero;
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-40">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <motion.div initial="hidden" animate="show" className="lg:col-span-7">
          {/* Kinetic headline: each sentence rises out of its own mask — the page's one load moment */}
          <motion.h1
            key={lang}
            initial="hidden"
            animate="show"
            // Swahili runs ~20% longer per line, so it steps down one notch to hold three lines
            className={`font-display font-bold text-white ${lang === "sw" ? "text-[clamp(2.1rem,3.7vw,4rem)] leading-[1.02] tracking-[-0.035em]" : "text-display-xl"}`}
          >
            {hero.headline.map((text, i) => (
              <span key={text} className="block overflow-hidden pb-[0.08em]">
                <motion.span custom={i} variants={line} className="block">
                  {text}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p variants={after(0.75)} className="mt-8 max-w-[34rem] text-lg leading-relaxed text-silver/80">
            {hero.body}
          </motion.p>

          <motion.p variants={after(0.85)} className="mt-5 font-display text-lg font-semibold text-white">
            {hero.kicker}
          </motion.p>

          {hero.stat && (
            <motion.p variants={after(0.9)} className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-amber">{hero.stat.value}</span>
              <span className="text-sm text-silver/70">{hero.stat.label}</span>
            </motion.p>
          )}

          <motion.div variants={after(0.95)} className="mt-10 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>

          {/* Markets, surfaced in the hero — links to the map section */}
          <motion.a
            variants={after(1.05)}
            href={to("#where")}
            aria-label={t.ui.countriesLink}
            className="group mt-10 inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl py-1 text-[0.95rem] text-silver/80"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-amber" aria-hidden>
              <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" />
              <circle cx="8" cy="6.5" r="1.6" />
            </svg>
            {config.countries.map((id) => (
              <span key={id} className="font-display font-semibold text-white transition-colors group-hover:text-brand-bright">
                {t.where.countries[id].name}
              </span>
            ))}
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.soft, delay: 0.45 }}
          className="h-[22rem] sm:h-[28rem] lg:col-span-5 lg:h-[36rem]"
        >
          <SignalField />
        </motion.div>
      </div>
    </section>
  );
}
