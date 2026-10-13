import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import { Reveal, RevealItem } from "./ui/Reveal";

function Counter({ value, suffix, lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.6, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString(lang === "sw" ? "sw-TZ" : "en-GB")}
      <span className="text-brand-bright">{suffix}</span>
    </span>
  );
}

/** Outcomes strip: big counted numbers, every one with its context line. */
export default function Results() {
  const { lang, t } = useLang();
  const r = t.ui.results;
  return (
    <section aria-label={r.heading} className="relative py-20 lg:py-24">
      <div className="container-site">
        <Reveal className="grid gap-px overflow-hidden rounded-4xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {config.results.map((x, i) => (
            <RevealItem key={i} className="group relative bg-navy p-7 transition-colors hover:bg-navy-deep sm:p-8">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-brand-bright to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <p className="font-display text-[clamp(2.75rem,5vw,4.25rem)] font-bold leading-none tracking-[-0.03em] text-white">
                <Counter value={x.value} suffix={x.suffix} lang={lang} />
              </p>
              <p className="mt-3 font-display text-lg font-semibold text-white">{r.items[i].label}</p>
              <p className="mt-1 text-sm text-steel">{r.items[i].context}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
