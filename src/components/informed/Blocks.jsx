import { useEffect, useRef, useState } from "react";

/**
 * Body blocks published from the Bluetrain Portal. Inline `html` is sanitised by the portal (bold, italics,
 * links and line breaks only); everything else is plain text. Shared by articles and case studies.
 *   { h } | { h3 } | { html } | { list, ordered } | { quote, by } | { callout, tone } | { table: { head, rows } }
 *   | { img, srcset, webp, alt, caption, credit } | { gallery: [...] } | { embed: { src, provider, ratio, height } }
 *   | { hr } | { faq: [{ q, a }] }
 */
const H = (html) => ({ dangerouslySetInnerHTML: { __html: html } });

export function Picture({ b, className = "", sizes = "(min-width: 1024px) 42rem, 100vw" }) {
  return (
    <picture>
      {b.webp && <source type="image/webp" srcSet={b.webp} sizes={sizes} />}
      <img src={b.img} srcSet={b.srcset || undefined} sizes={b.srcset ? sizes : undefined} alt={b.alt || ""} width={b.w} height={b.h} loading="lazy" decoding="async" className={className} />
    </picture>
  );
}

/** Embeds load only when they scroll into view. */
export function Embed({ e }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current || on) return;
    if (!("IntersectionObserver" in window)) return setOn(true);
    const io = new IntersectionObserver((xs) => { if (xs.some((x) => x.isIntersecting)) { setOn(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [on]);
  const style = e.ratio ? { aspectRatio: e.ratio } : { height: `${e.height || 400}px` };
  return (
    <figure className="my-10">
      <div ref={ref} style={style} className="w-full overflow-hidden rounded-3xl border border-paper/10 bg-white/[0.03]">
        {on && (
          <iframe
            src={e.src}
            title={e.title || e.provider}
            loading="lazy"
            className="h-full w-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen; clipboard-write"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      {e.caption && <figcaption className="mt-3 text-sm text-steel">{e.caption}</figcaption>}
    </figure>
  );
}

export function FaqList({ items, title }) {
  return (
    <section className="my-12">
      {title && <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-white sm:text-[1.75rem]">{title}</h2>}
      <div className="mt-6 divide-y divide-white/10 rounded-3xl border border-white/10">
        {items.map((f, i) => (
          <details key={i} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold text-white">
              {f.q}
              <span aria-hidden className="mt-1 text-brand-bright transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3 text-silver/80" {...H(f.a)} />
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Block({ b, faqTitle }) {
  if (b.h) return <h2 className="mt-12 font-display text-2xl font-bold tracking-[-0.015em] text-white sm:text-[1.75rem]">{b.h}</h2>;
  if (b.h3) return <h3 className="mt-10 font-display text-xl font-bold tracking-[-0.01em] text-white">{b.h3}</h3>;
  if (b.list) {
    const Tag = b.ordered ? "ol" : "ul";
    return (
      <Tag className={`mt-6 space-y-3 ${b.ordered ? "list-decimal pl-6 marker:font-display marker:font-bold marker:text-amber" : ""}`}>
        {b.list.map((li, i) =>
          b.ordered ? <li key={i} className="pl-2" {...H(li)} /> : (
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
  if (b.callout)
    return (
      <aside className={`my-8 rounded-2xl border px-5 py-4 ${b.tone === "note" ? "border-amber/30 bg-amber/10" : "border-brand-bright/30 bg-brand-bright/10"}`}>
        <p {...H(b.callout)} />
      </aside>
    );
  if (b.table)
    return (
      <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full border-collapse text-left text-[0.95rem]">
          {b.table.head && (
            <thead><tr>{b.table.head.map((c, i) => <th key={i} className="border-b border-white/10 bg-white/[0.04] px-4 py-3 font-display font-semibold text-white" {...H(c)} />)}</tr></thead>
          )}
          <tbody>{b.table.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} className="border-b border-white/[0.06] px-4 py-3 align-top" {...H(c)} />)}</tr>)}</tbody>
        </table>
      </div>
    );
  if (b.img)
    return (
      <figure className="my-10">
        <Picture b={b} className="w-full rounded-3xl border border-paper/10" />
        {(b.caption || b.credit) && (
          <figcaption className="mt-3 text-sm text-steel">{b.caption}{b.credit && <span className="text-steel/70">{b.caption ? " · " : ""}{b.credit}</span>}</figcaption>
        )}
      </figure>
    );
  if (b.gallery)
    return (
      <div className="my-10 grid gap-3 sm:grid-cols-2">
        {b.gallery.map((g, i) => (
          <figure key={i}>
            <Picture b={g} sizes="(min-width: 640px) 21rem, 100vw" className="aspect-[4/3] w-full rounded-2xl border border-paper/10 object-cover" />
            {g.caption && <figcaption className="mt-2 text-sm text-steel">{g.caption}</figcaption>}
          </figure>
        ))}
      </div>
    );
  if (b.embed) return <Embed e={b.embed} />;
  if (b.hr) return <hr className="my-12 border-white/10" />;
  if (b.faq) return <FaqList items={b.faq} title={faqTitle} />;
  return <p className="mt-6" {...H(b.html ?? b.p ?? "")} />;
}
