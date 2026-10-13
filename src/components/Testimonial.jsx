import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { Reveal, RevealItem } from "./ui/Reveal";
import { ArrowIcon } from "./ui/Icons";

/** Client quote slider. Shows the brand's featured statement until approved testimonials exist. */
function Slider({ testimonials, ui }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const t = testimonials[i];
  const go = (d) => {
    setDir(d);
    setI((v) => (v + d + testimonials.length) % testimonials.length);
  };

  return (
    <div>
      <div className="relative min-h-[18rem]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={spring.soft}
          >
            <blockquote className="max-w-[56rem] font-display text-display-md font-semibold text-paper">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              {t.headshot && <img src={t.headshot} alt="" className="h-14 w-14 rounded-full object-cover" />}
              <div>
                <p className="font-display font-semibold text-paper">{t.name}</p>
                <p className="text-sm text-paper/70">
                  {t.title}, {t.company}
                </p>
              </div>
              {t.logo && <img src={t.logo} alt={t.company} className="ml-6 h-7 w-auto brightness-0 invert opacity-80" />}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {testimonials.length > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label={ui.prev} className="grid h-11 w-11 place-items-center rounded-full border border-paper/25 text-paper hover:bg-paper/10">
            <ArrowIcon className="rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={ui.next} className="grid h-11 w-11 place-items-center rounded-full border border-paper/25 text-paper hover:bg-paper/10">
            <ArrowIcon />
          </button>
          <p className="ml-3 text-sm text-paper/70" aria-live="polite">
            {ui.of(i + 1, testimonials.length)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Testimonial() {
  const { t } = useLang();
  const { statement, testimonials } = t;
  return (
    // The one large Bluetrain Blue field on the page — keeps the primary colour dominant per the guidelines
    <section aria-label={t.ui.statementLabel} className="relative overflow-hidden bg-brand py-24 lg:py-36">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 text-paper/[0.07]">
        {[60, 100, 140, 180].map((r) => (
          <g key={r} fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="butt">
            <path d={`M ${200 - r * Math.sin(0.4)} ${200 - r * Math.cos(0.4)} A ${r} ${r} 0 0 1 ${200 + r * Math.sin(0.4)} ${200 - r * Math.cos(0.4)}`} />
            <path d={`M ${200 - r * Math.sin(0.75)} ${200 + r * Math.cos(0.75)} A ${r} ${r} 0 0 0 ${200 + r * Math.sin(0.75)} ${200 + r * Math.cos(0.75)}`} />
          </g>
        ))}
      </svg>

      <div className="container-site relative">
        {testimonials.length > 0 ? (
          <Slider testimonials={testimonials} ui={t.ui} />
        ) : (
          <Reveal>
            <RevealItem as="p" className="max-w-[60rem] font-display text-display-lg font-bold text-paper">
              {statement.heading}
            </RevealItem>
            <RevealItem as="p" className="mt-8 max-w-[32rem] text-xl leading-relaxed text-paper/80">
              {statement.body}
            </RevealItem>
          </Reveal>
        )}
      </div>
    </section>
  );
}
