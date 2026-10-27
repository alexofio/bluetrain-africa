import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { caseStudies, hasPage, cloc } from "../content/cms";
import { useLang } from "../lib/i18n";
import { to } from "../lib/router";
import { spring } from "../lib/motion";
import { Reveal, RevealItem } from "./ui/Reveal";
import WorkArt from "./WorkArt";

function Card({ item, lead, span }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={spring.soft}
      className={`glass glow-hover group relative flex flex-col overflow-hidden rounded-3xl ${span}`}
    >
      <div className={`relative overflow-hidden ${lead ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : span.includes("12") ? "aspect-[16/9] lg:aspect-[21/8]" : "aspect-[16/9]"}`}>
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100">
          {item.image ? <img src={item.image} srcSet={item.srcset} sizes="(min-width: 1024px) 60vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover" /> : <WorkArt kind={item.art} />}
        </div>
        <span className="absolute left-4 top-4 rounded-full border border-paper/15 bg-night/60 px-3 py-1 text-xs text-paper/85 backdrop-blur-md">
          {item.industry}
        </span>
        {item.metric && (
          <span className="absolute bottom-4 left-4 rounded-full bg-paper px-3.5 py-1.5 font-display text-sm font-semibold text-ink">
            {item.metric}
          </span>
        )}
      </div>
      <div className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-bold tracking-[-0.015em] text-white sm:text-2xl">
          {item.href ? <a href={item.href} className="after:absolute after:inset-0 focus-visible:outline-none">{item.title}</a> : item.title}
        </h3>
        <p className="mt-2 max-w-[38rem] text-[0.95rem] leading-relaxed text-silver/70">{item.body}</p>
        {item.href && <p className="mt-4 font-display text-sm font-semibold text-brand-bright">{item.more} →</p>}
      </div>
    </motion.article>
  );
}

export default function Work() {
  const { t, lang } = useLang();
  const work = t.work;
  const [filter, setFilter] = useState("all");
  // Filters: "All" plus each capability used by a published case study, in the order of work.capabilities.
  const used = new Set(caseStudies.flatMap((c) => c.capabilities || []));
  const filters = [{ id: "all", label: work.all }, ...Object.entries(work.capabilities).filter(([id]) => used.has(id)).map(([id, label]) => ({ id, label }))];
  const items = caseStudies
    .filter((c) => filter === "all" || (c.capabilities || []).includes(filter))
    .map((c) => ({
      id: c.slug, art: c.art || "routes", image: c.coverImage || null, srcset: c.coverSrcset,
      title: cloc(c, lang, "title"), body: cloc(c, lang, "standfirst"), industry: cloc(c, lang, "industry"), metric: cloc(c, lang, "metric"),
      href: hasPage(c) ? to(`#/work/${c.slug}`) : null, more: work.readMore,
    }));
  if (!caseStudies.length) return null;

  return (
    <section id="work" className="relative border-t border-white/[0.06] py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <RevealItem as="h2" className="max-w-[40rem] font-display text-display-lg font-bold text-white">
            {work.heading}
          </RevealItem>
          <RevealItem>
            <div role="group" aria-label={t.ui.filterLabel} className="flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${filter === f.id ? "text-navy" : "text-silver/70 hover:text-white"}`}
                >
                  {filter === f.id && <motion.span layoutId="work-filter" transition={spring.snappy} className="absolute inset-0 -z-0 rounded-full bg-white" />}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
          </RevealItem>
        </Reveal>

        <LayoutGroup>
          <motion.div layout className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <Card
                  key={item.id}
                  item={item}
                  lead={items.length === 3 && i === 0}
                  span={items.length === 3 ? (i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5") : items.length === 2 ? "lg:col-span-6" : "lg:col-span-12"}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
        <p aria-live="polite" className="sr-only">
          {t.ui.showing(items.length)}
        </p>
      </div>
    </section>
  );
}
