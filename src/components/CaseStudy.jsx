import { useEffect } from "react";
import { motion } from "framer-motion";
import { caseStudies, cloc } from "../content/cms";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { to, postHref } from "../lib/router";
import Button from "./ui/Button";
import WorkArt from "./WorkArt";
import Block, { Picture, Embed } from "./informed/Blocks";

const month = (ym, lang) => (ym ? new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { month: "short", year: "numeric" }).format(new Date(`${ym}-01T12:00:00Z`)) : "");

/** Case study page (/work/<slug>). `draft` = an unpublished case study on /preview. */
export default function CaseStudy({ slug, draft }) {
  const { lang, t } = useLang();
  const w = t.work;
  const c = draft || caseStudies.find((x) => x.slug === slug);

  useEffect(() => {
    if (c) document.title = `${cloc(c, lang, "title")} | Bluetrain Africa`;
  }, [c, lang]);

  if (!c) {
    return (
      <section className="container-site pb-32 pt-40">
        <p className="text-lg text-silver/80">{t.ui.notFound.title}</p>
        <a href={to("#work")} className="mt-6 inline-block text-brand-bright">← {w.back}</a>
      </section>
    );
  }
  const body = lang === "sw" && c.sw?.body?.length ? c.sw.body : c.body || [];
  const period = c.period ? [month(c.period.start, lang), month(c.period.end, lang)].filter(Boolean).join(" – ") : "";

  return (
    <article className="relative pb-24 pt-28 sm:pt-32">
      <div className="container-site">
        <a href={to("#work")} className="inline-flex items-center gap-2 text-sm text-silver/70 transition-colors hover:text-white">
          <span aria-hidden>←</span> {w.back}
        </a>
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} className="mt-8 max-w-[56rem]">
          <div className="flex flex-wrap items-center gap-1.5">
            {cloc(c, lang, "industry") && <span className="rounded-full bg-brand-bright/15 px-2.5 py-1 text-[0.72rem] font-medium text-brand-bright">{cloc(c, lang, "industry")}</span>}
            {(c.capabilities || []).map((k) => <span key={k} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.72rem] text-silver/70">{w.capabilities[k] || k}</span>)}
          </div>
          <h1 className="mt-6 font-display text-display-lg font-bold text-white">{cloc(c, lang, "title")}</h1>
          <p className="mt-6 max-w-[44rem] text-xl leading-relaxed text-silver/80">{cloc(c, lang, "standfirst")}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            {c.client && <div><dt className="text-steel">{w.client}</dt><dd className="font-medium text-white">{c.client.name}</dd></div>}
            {period && <div><dt className="text-steel">{w.period}</dt><dd className="font-medium text-white">{period}</dd></div>}
          </dl>
        </motion.header>

        <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-4xl border border-paper/10">
          {c.coverImage ? <img src={c.coverImage} srcSet={c.coverSrcset || undefined} alt={cloc(c, lang, "coverAlt") || ""} className="h-full w-full object-cover" /> : <WorkArt kind={c.art || "routes"} />}
          {cloc(c, lang, "metric") && <span className="absolute bottom-5 left-5 rounded-full bg-paper px-4 py-2 font-display text-base font-semibold text-ink">{cloc(c, lang, "metric")}</span>}
        </div>

        {c.results?.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">{w.results}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.results.map((r, i) => (
                <div key={i} className="glass rounded-3xl p-6">
                  <p className="font-display text-4xl font-bold text-white">{r.value}</p>
                  <p className="mt-2 text-silver/80">{(lang === "sw" && r.labelSw) || r.label}</p>
                  {r.source && <p className="mt-3 text-xs text-steel">{r.source}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 max-w-[42rem] text-[1.075rem] leading-[1.75] text-silver/85 lg:ml-[calc(5/12*100%)]">
          {cloc(c, lang, "answer") && <p className="mb-8 text-xl leading-relaxed text-white">{cloc(c, lang, "answer")}</p>}
          {body.map((b, i) => <Block key={i} b={b} />)}

          {c.quote && (
            <figure className="my-14 border-l-2 border-amber pl-6">
              <blockquote className="font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">“{(lang === "sw" && c.quote.textSw) || c.quote.text}”</blockquote>
              <figcaption className="mt-3 text-sm text-steel">{c.quote.name}{c.quote.title ? `, ${(lang === "sw" && c.quote.titleSw) || c.quote.title}` : ""}{c.client ? ` · ${c.client.name}` : ""}</figcaption>
            </figure>
          )}
        </div>

        {c.gallery?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-display-md font-bold text-white">{w.gallery}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {c.gallery.map((g, i) =>
                g.embed ? <Embed key={i} e={g.embed} /> : (
                  <figure key={i}>
                    <Picture b={{ ...g, alt: (lang === "sw" && g.altSw) || g.alt }} sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full rounded-3xl border border-paper/10 object-cover" />
                    {g.caption && <figcaption className="mt-2 text-sm text-steel">{(lang === "sw" && g.captionSw) || g.caption}</figcaption>}
                  </figure>
                ))}
            </div>
          </section>
        )}

        {!draft && c.relatedInformed?.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <h2 className="font-display text-display-md font-bold text-white">{w.related}</h2>
            <ul className="mt-6 space-y-3">{c.relatedInformed.map((r) => <li key={r.slug}><a className="text-lg text-brand-bright hover:underline" href={postHref(r.slug)}>{r.title}</a></li>)}</ul>
          </section>
        )}

        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-brand/30 to-transparent p-7">
          <p className="font-display text-xl font-bold text-white">{t.ui.informed.ctaTitle}</p>
          <p className="mt-2 text-silver/75">{t.ui.informed.ctaBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={config.bookingUrl}>{t.nav.cta}</Button>
            <Button href="#contact" variant="secondary">{t.hero.primaryCta.label}</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
