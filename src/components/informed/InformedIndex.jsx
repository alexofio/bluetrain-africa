import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { categories, markets, posts, loc } from "../../content/informed";
import { useLang } from "../../lib/i18n";
import { spring } from "../../lib/motion";
import { postHref } from "../../lib/router";
import { PostCard, Newsletter, Tags, Meta, catLabel, marketLabel } from "./shared";

const PAGE = 6;
const byDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));

function Chip({ active, onClick, children, layoutId }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${active ? "text-navy" : "text-silver/70 hover:text-white"}`}
    >
      {active && <motion.span layoutId={layoutId} transition={spring.snappy} className="absolute inset-0 rounded-full bg-white" />}
      <span className="relative">{children}</span>
    </button>
  );
}

export default function InformedIndex() {
  const { lang, t } = useLang();
  const ui = t.ui.informed;
  const [cat, setCat] = useState("all");
  const [market, setMarket] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const searchRef = useRef(null);

  // "/" focuses search, like most docs and editorial sites
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setShown(PAGE), [cat, market, q]);

  const featured = byDate.find((p) => p.featured) ?? byDate[0];
  const filtering = cat !== "all" || market !== "all" || q.trim();

  const results = useMemo(() => {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return byDate.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (market !== "all" && !p.markets.includes(market)) return false;
      if (!words.length) return true;
      const hay = [p.title, p.standfirst, p.sw?.title, p.sw?.standfirst, catLabel(p.category, "en"), catLabel(p.category, "sw"), ...p.markets.map((m) => marketLabel(m, "en")), ...p.body.map((b) => b.p || b.h || "")]
        .join(" ")
        .toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [cat, market, q]);

  // When not filtering, the featured post sits in the hero, so leave it out of the grid
  const grid = filtering ? results : results.filter((p) => p.slug !== featured.slug);
  const alsoNew = byDate.filter((p) => p.slug !== featured.slug).slice(0, 2);
  const visible = grid.slice(0, shown);

  const clear = () => { setCat("all"); setMarket("all"); setQ(""); };

  return (
    <section className="relative pb-24 pt-32 sm:pt-36 lg:pb-32">
      <div className="container-site">
        {/* Masthead */}
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright">{ui.kicker}</p>
            <h1 className="mt-4 font-display text-display-xl font-bold text-white">Informed.</h1>
          </div>
          <p className="text-lg leading-relaxed text-silver/75 lg:col-span-4">{ui.intro}</p>
        </motion.header>

        {/* Featured + also new */}
        <AnimatePresence initial={false}>
          {!filtering && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={spring.soft}
              className="overflow-hidden"
            >
              <div className="grid gap-4 pt-14 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="mb-3 text-sm font-medium text-amber">{ui.featured}</p>
                  <PostCard post={featured} lang={lang} ui={ui} size="lg" />
                </div>
                <div className="flex flex-col gap-4 lg:col-span-4">
                  <p className="mb-[-0.25rem] text-sm text-steel">{ui.alsoNew}</p>
                  {alsoNew.map((p) => (
                    <article key={p.slug} className="glass glow-hover group relative flex-1 rounded-3xl p-6">
                      <Tags post={p} lang={lang} />
                      <h3 className="mt-4 font-display text-xl font-bold leading-snug tracking-[-0.015em] text-white">
                        <a href={postHref(p.slug)} className="after:absolute after:inset-0">{loc(p, lang, "title")}</a>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-silver/70">{loc(p, lang, "standfirst")}</p>
                      <Meta post={p} lang={lang} ui={ui} className="mt-4" />
                    </article>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar: search + filters, sticks under the nav while browsing */}
        <div className="sticky top-[calc(env(safe-area-inset-top,0px)+5.25rem)] z-30 mt-14 rounded-3xl border border-white/10 bg-navy/80 p-3 backdrop-blur-md sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block lg:w-80 lg:shrink-0">
              <span className="sr-only">{ui.search}</span>
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={ui.search}
                className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-14 text-white placeholder:text-steel focus:border-brand-bright focus:outline-none focus:ring-2 focus:ring-brand-bright/25"
              />
              <kbd title={ui.searchHint} className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/15 px-1.5 text-xs text-steel sm:block">/</kbd>
            </label>
            <div role="group" aria-label={ui.filterBy} className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
              <Chip active={cat === "all"} onClick={() => setCat("all")} layoutId="cat-pill">{ui.all}</Chip>
              {categories.map((c) => (
                <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} layoutId="cat-pill">{c[lang]}</Chip>
              ))}
            </div>
          </div>
          <div role="group" aria-label={ui.filterMarket} className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
            {[{ id: "all", en: ui.allMarkets, sw: ui.allMarkets }, ...markets].map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={market === m.id}
                onClick={() => setMarket(m.id)}
                className={`rounded-full border px-3 py-1 text-[0.8rem] transition-colors ${market === m.id ? "border-brand-bright bg-brand-bright/15 text-white" : "border-white/10 text-silver/70 hover:border-white/30 hover:text-white"}`}
              >
                {m.id !== "all" && <span className="mr-1.5 font-display text-[0.68rem] font-semibold tracking-[0.08em] text-steel">{m.id === "AF" ? "★" : m.id}</span>}
                {m[lang]}
              </button>
            ))}
            <p aria-live="polite" className="ml-auto text-sm text-steel">
              {ui.results(results.length)}
              {filtering && (
                <button type="button" onClick={clear} className="ml-3 text-brand-bright underline-offset-4 hover:underline">{ui.clear}</button>
              )}
            </p>
          </div>
        </div>

        {/* Grid */}
        {grid.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-lg text-silver/80">{ui.none}</p>
            <button type="button" onClick={clear} className="mt-5 rounded-full border border-white/20 px-5 py-2 text-white hover:border-brand-bright">{ui.clear}</button>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.flatMap((p, i) => {
                  const card = (
                    <motion.div key={p.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring.soft}>
                      <PostCard post={p} lang={lang} ui={ui} />
                    </motion.div>
                  );
                  // newsletter sits inside the list after the 5th card (or at the end of short lists)
                  const nlAt = Math.min(5, visible.length) - 1;
                  return i === nlAt
                    ? [card, <motion.div key="newsletter" layout transition={spring.soft} className="sm:col-span-2 lg:col-span-1"><Newsletter ui={ui} compact /></motion.div>]
                    : [card];
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {shown < grid.length && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setShown((n) => n + PAGE)} className="rounded-full border border-white/20 px-7 py-3 font-display font-semibold text-white transition-colors hover:border-brand-bright hover:bg-white/5">
              {ui.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
