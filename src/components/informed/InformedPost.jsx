import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { posts, loc } from "../../content/informed";
import { config } from "../../content/site";
import { useLang } from "../../lib/i18n";
import { spring } from "../../lib/motion";
import Button from "../ui/Button";
import PostCover from "./PostCover";
import { PostCard, Tags, Meta, Newsletter, marketLabel } from "./shared";
import { to } from "../../lib/router";

// Body blocks come from Markdown (scripts/content.mjs). `html` holds inline formatting only — bold,
// italics and links written by the team in the editor.
const H = (html) => ({ dangerouslySetInnerHTML: { __html: html } });

function Block({ b }) {
  if (b.h) return <h2 className="mt-12 font-display text-2xl font-bold tracking-[-0.015em] text-white sm:text-[1.75rem]">{b.h}</h2>;
  if (b.list) {
    const Tag = b.ordered ? "ol" : "ul";
    return (
      <Tag className="mt-6 space-y-3">
        {b.list.map((li, i) => (
          <li key={i} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-bright" {...H(li)} />
        ))}
      </Tag>
    );
  }
  if (b.quote)
    return (
      <figure className="my-12 border-l-2 border-brand-bright pl-6">
        <blockquote className="font-display text-2xl font-semibold leading-snug tracking-[-0.015em] text-white sm:text-3xl">
          “<span {...H(b.quote)} />”
        </blockquote>
        {b.by && <figcaption className="mt-3 text-sm text-steel">{b.by}</figcaption>}
      </figure>
    );
  if (b.img)
    return (
      <figure className="my-10">
        <img src={b.img} alt={b.alt} loading="lazy" className="w-full rounded-3xl border border-paper/10" />
        {b.caption && <figcaption className="mt-3 text-sm text-steel">{b.caption}</figcaption>}
      </figure>
    );
  return <p className="mt-6" {...H(b.html ?? b.p ?? "")} />;
}

export default function InformedPost({ slug }) {
  const { lang, t } = useLang();
  const ui = t.ui.informed;
  const post = posts.find((p) => p.slug === slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (post) document.title = `${loc(post, lang, "title")} | Bluetrain Informed`;
  }, [post, lang]);

  if (!post) {
    return (
      <section className="container-site pb-32 pt-40">
        <p className="text-lg text-silver/80">{ui.none}</p>
        <a href={to("#/informed")} className="mt-6 inline-block text-brand-bright">← {ui.back}</a>
      </section>
    );
  }

  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.markets.filter((m) => post.markets.includes(m)).length }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, 3)
    .map((x) => x.p);

  const swBody = lang === "sw" && post.sw?.body?.length ? post.sw.body : null;
  const englishBody = lang === "sw" && !swBody && ui.englishOnly;

  return (
    <article className="relative pb-24 pt-28 sm:pt-32">
      {/* reading progress, pinned under the floating nav */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-bright via-brand-bright to-amber shadow-[0_0_12px_rgba(46,142,255,0.8)]"
      />

      <div className="container-site">
        <a href={to("#/informed")} className="inline-flex items-center gap-2 text-sm text-silver/70 transition-colors hover:text-white">
          <span aria-hidden>←</span> {ui.back}
        </a>

        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} className="mt-8 max-w-[56rem]">
          <Tags post={post} lang={lang} />
          <h1 className="mt-6 font-display text-display-lg font-bold text-white">{loc(post, lang, "title")}</h1>
          <p className="mt-6 max-w-[44rem] text-xl leading-relaxed text-silver/80">{loc(post, lang, "standfirst")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-sm font-bold text-paper">BI</span>
              <div>
                <p className="text-sm font-medium text-white">{post.author.name}</p>
                <p className="text-xs text-steel">{post.author.role}</p>
              </div>
            </div>
            <Meta post={post} lang={lang} ui={ui} />
            <p className="flex flex-wrap gap-1.5">
              {post.markets.map((m) => (
                <span key={m} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-silver/70">{marketLabel(m, lang)}</span>
              ))}
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.soft, delay: 0.1 }}
          className="mt-12 aspect-[21/9] overflow-hidden rounded-4xl border border-paper/10"
        >
          <PostCover seed={post.cover} category={post.category} image={post.coverImage} alt={post.coverAlt} />
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* Key takeaways — sticky alongside the body on desktop */}
          <aside className="lg:col-span-4 lg:col-start-1">
            <div className="glass rounded-3xl p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">{ui.takeaways}</h2>
              <ol className="mt-4 space-y-4">
                {(post.sw?.takeaways && lang === "sw" ? post.sw.takeaways : post.takeaways).map((k, i) => (
                  <li key={k} className="flex gap-3 text-[0.95rem] leading-relaxed text-silver/85">
                    <span className="font-display font-bold text-amber">{String(i + 1).padStart(2, "0")}</span>
                    {k}
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="informed-body max-w-[42rem] text-[1.075rem] leading-[1.75] text-silver/85 lg:col-span-7 lg:col-start-6" lang={englishBody ? "en" : undefined}>
            {englishBody && <p className="mb-8 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-silver" lang="sw">{ui.englishOnly}</p>}
            {(swBody || post.body).map((b, i) => <Block key={i} b={b} />)}

            {/* Topic-matched CTA */}
            <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-brand/30 to-transparent p-7">
              <p className="font-display text-xl font-bold text-white">{ui.ctaTitle}</p>
              <p className="mt-2 text-silver/75">{ui.ctaBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={config.bookingUrl}>{t.nav.cta}</Button>
                <Button href="#contact" variant="secondary">{t.hero.primaryCta.label}</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-24 border-t border-white/10 pt-14">
          <h2 className="font-display text-display-md font-bold text-white">{ui.related}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <PostCard key={p.slug} post={p} lang={lang} ui={ui} />)}
            <Newsletter ui={ui} compact />
          </div>
        </section>
      </div>
    </article>
  );
}
