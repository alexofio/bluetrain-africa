import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { Reveal, RevealItem } from "./ui/Reveal";
import Icon from "./ui/Icons";

// Asymmetric 12-col bento: spans alternate so no two rows share the same rhythm
const spans = {
  strategy: "lg:col-span-7 lg:row-span-1",
  growth: "lg:col-span-5",
  insights: "lg:col-span-5",
  influence: "lg:col-span-7",
  experience: "lg:col-span-4",
  technology: "lg:col-span-8",
};

function Tile({ item, featured }) {
  return (
    <RevealItem
      as="article"
      id={item.id === "insights" ? "insights" : undefined}
      className={`glass glow-hover group relative flex flex-col overflow-hidden rounded-3xl p-7 sm:p-8 ${spans[item.id]} ${
        featured ? "lg:min-h-[26rem]" : "lg:min-h-[22rem]"
      }`}
    >
      {/* hover sheen anchored to the icon corner */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-bright/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-bright/15" />

      <div className="flex items-start justify-between gap-6">
        <motion.span
          whileHover={{ rotate: -6, scale: 1.06 }}
          transition={spring.hover}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-navy/60 text-brand-bright"
        >
          <Icon name={item.id} />
        </motion.span>
        <p className="max-w-[18rem] text-right text-sm leading-snug text-steel">{item.tagline}</p>
      </div>

      <h3 className="mt-8 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-[1.7rem]">{item.title}</h3>
      <p className="mt-3 max-w-[36rem] leading-relaxed text-silver/75">{item.body}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {item.capabilities.map((c) => (
          <li key={c} className="rounded-full border border-white/10 px-3 py-1 text-[0.8rem] text-silver/70">
            {c}
          </li>
        ))}
      </ul>

      <div aria-hidden className="min-h-8 flex-1" />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-white/10 pt-6">
        <span className="font-display text-3xl font-bold tracking-[-0.02em] text-white">{item.highlight.value}</span>
        <span className="text-sm text-steel">{item.highlight.label}</span>
      </div>
    </RevealItem>
  );
}

export default function Services() {
  const { t } = useLang();
  const services = t.services;
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem as="h2" className="font-display text-display-lg font-bold text-white lg:col-span-7">
            {services.heading}
          </RevealItem>
          <RevealItem as="p" className="text-lg leading-relaxed text-silver/75 lg:col-span-4 lg:col-start-9">
            {services.intro}
          </RevealItem>
        </Reveal>

        <Reveal gap={0.07} className="mt-14 grid gap-4 lg:grid-cols-12">
          {services.items.map((item, i) => (
            <Tile key={item.id} item={item} featured={i < 2} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
