import { useState } from "react";
import { motion } from "framer-motion";
import { categories, markets, formats, loc } from "../../content/informed";
import { config } from "../../content/site";
import { postHref } from "../../lib/router";
import { spring } from "../../lib/motion";
import PostCover from "./PostCover";

export const catLabel = (id, lang) => categories.find((c) => c.id === id)?.[lang] ?? id;
export const marketLabel = (id, lang) => markets.find((m) => m.id === id)?.[lang] ?? id;
export const formatLabel = (id, lang) => formats[id]?.[lang] ?? id;
export const fmtDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

export function Meta({ post, lang, ui, className = "" }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-steel ${className}`}>
      <time dateTime={post.date}>{fmtDate(post.date, lang)}</time>
      <span aria-hidden>·</span>
      <span>{ui.min(post.readTime)}</span>
    </p>
  );
}

export function Tags({ post, lang }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="rounded-full bg-brand-bright/15 px-2.5 py-1 text-[0.72rem] font-medium text-brand-bright">{catLabel(post.category, lang)}</span>
      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.72rem] text-silver/70">{formatLabel(post.format, lang)}</span>
    </div>
  );
}

/** Grid card. `size="lg"` for the featured slot. */
export function PostCard({ post, lang, ui, size = "md" }) {
  const lg = size === "lg";
  return (
    <motion.article layout transition={spring.soft} className="glass glow-hover group relative flex h-full flex-col overflow-hidden rounded-3xl">
      <div className={`relative overflow-hidden ${lg ? "aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] lg:flex-1" : "aspect-[16/10]"}`}>
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06] motion-reduce:group-hover:scale-100">
          <PostCover seed={post.cover} category={post.category} image={post.coverImage} />
        </div>
        <span className="absolute bottom-4 left-4 flex gap-1.5">
          {post.markets.slice(0, 3).map((m) => (
            <span key={m} className="rounded-md bg-night/70 px-1.5 py-0.5 font-display text-[0.68rem] font-semibold tracking-[0.08em] text-paper/90 backdrop-blur-md">{m}</span>
          ))}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${lg ? "p-7 sm:p-9" : "p-6"}`}>
        <Tags post={post} lang={lang} />
        <h3 className={`mt-4 font-display font-bold tracking-[-0.015em] text-white ${lg ? "text-2xl sm:text-[2rem] sm:leading-tight" : "text-lg leading-snug sm:text-xl"}`}>
          {/* stretched link: whole card is clickable, one tab stop */}
          <a href={postHref(post.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {loc(post, lang, "title")}
          </a>
        </h3>
        {lg && <p className="mt-3 max-w-[40rem] leading-relaxed text-silver/75">{loc(post, lang, "standfirst")}</p>}
        <div className="flex-1" />
        <Meta post={post} lang={lang} ui={ui} className="mt-5" />
      </div>
    </motion.article>
  );
}

export function Newsletter({ ui, compact = false }) {
  const n = ui.newsletter;
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | invalid | done | mailto
  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    if (!config.newsletterEndpoint) {
      window.location.href = `mailto:${config.email}?subject=${encodeURIComponent("Subscribe: Bluetrain Informed")}&body=${encodeURIComponent(email)}`;
      return setState("mailto");
    }
    try {
      await fetch(config.newsletterEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setState("done");
    } catch {
      setState("mailto");
    }
  };
  return (
    <div className={`relative h-full overflow-hidden rounded-3xl border border-brand-bright/30 bg-gradient-to-br from-brand/40 via-navy to-teal/25 ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-bright/25 blur-3xl" />
      <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-brand-bright">Bluetrain Informed</p>
      <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.015em] text-white">{n.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver/75">{n.body}</p>
      {state === "done" || state === "mailto" ? (
        <p role="status" className="mt-6 font-medium text-amber">{state === "done" ? n.done : n.mailto}</p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`nl-${compact ? "c" : "f"}`}>{n.placeholder}</label>
          <input
            id={`nl-${compact ? "c" : "f"}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
            placeholder={n.placeholder}
            aria-invalid={state === "invalid"}
            className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-navy/60 px-5 text-white placeholder:text-steel/80 focus:border-brand-bright focus:outline-none"
          />
          <button type="submit" className="h-12 rounded-full bg-white px-6 font-display text-[0.95rem] font-semibold text-navy transition-colors hover:bg-silver">
            {n.cta}
          </button>
        </form>
      )}
      {state === "invalid" && <p className="mt-2 text-sm text-amber">{n.invalid}</p>}
    </div>
  );
}
