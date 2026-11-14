import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { config } from "../content/site";
import { redesign } from "../content/redesign";
import { useLang } from "../lib/i18n";

/** Split-flap tiles: each character flips in once the board scrolls into view. */
function Flap({ text, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span ref={ref} className="inline-flex gap-1" aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="relative grid h-[1.25em] w-[0.8em] place-items-center overflow-hidden rounded-[6px] bg-[#071422] text-[#fff] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]"
          style={{ transition: `transform .6s cubic-bezier(.2,.7,.2,1) ${delay + i * 0.08}s, opacity .6s ${delay + i * 0.08}s`, transform: inView ? "rotateX(0)" : "rotateX(90deg)", opacity: inView ? 1 : 0 }}
        >
          <span className={ch === "+" ? "text-amber" : ""}>{ch}</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-[#0B1C2E]" />
        </span>
      ))}
    </span>
  );
}

/**
 * Active campaigns, published from Portal → Clients → Active campaigns.
 * Expected feed: { campaigns: [{ name, client, market, stats: [{ label, value }], url, anonymous }] }.
 * If the feed is missing or empty the strip is not shown — the lifetime figures stand alone.
 */
function useActiveCampaigns() {
  const [list, setList] = useState([]);
  useEffect(() => {
    let live = true;
    fetch(`${config.portalApi}/content/active-campaigns`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && Array.isArray(d?.campaigns) && setList(d.campaigns.filter((c) => c?.name)))
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return list;
}

export default function Results() {
  const { lang, t } = useLang();
  const r = t.ui.results;
  const d = redesign[lang].departures;
  const campaigns = useActiveCampaigns();
  return (
    <section id="outcomes" aria-label={r.heading} className="relative bg-rail py-20 text-[#fff] lg:py-28">
      <div className="container-site">
        <p className="kicker">{d.kicker}</p>
        <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-none tracking-[-0.03em]">{d.heading}</h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[#ffffff1a] bg-[#ffffff1a] sm:grid-cols-2 lg:grid-cols-4">
          {config.results.map((x, i) => (
            <div key={i} className="bt-rise bg-rail p-7 sm:p-8" style={{ "--i": i }}>
              <p className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-none">
                <Flap text={`${x.value.toLocaleString("en-US").replace(/,/g, "")}${x.suffix || ""}`} delay={i * 0.15} />
              </p>
              <p className="mt-5 font-display text-lg font-semibold">{r.items[i].label}</p>
              <p className="mt-1 text-sm text-[#9FB3C8]">{r.items[i].context}</p>
            </div>
          ))}
        </div>

        {campaigns.length > 0 && (
          <div className="mt-14">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9FB3C8]">
              <span className="h-2 w-2 rounded-full bg-teal motion-safe:animate-pulse" />
              {d.active}
            </p>
            <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c, i) => (
                <li key={`${c.name}-${i}`} className="bt-rise flex flex-col justify-between gap-6 rounded-3xl border border-[#ffffff1a] bg-[#ffffff08] p-6" style={{ "--i": i }}>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                    {!c.anonymous && (c.client || c.market) && <p className="mt-1 text-sm text-[#9FB3C8]">{[c.client, c.market].filter(Boolean).join(" · ")}</p>}
                    {c.anonymous && c.market && <p className="mt-1 text-sm text-[#9FB3C8]">{c.market}</p>}
                  </div>
                  <dl className="grid grid-cols-2 gap-4">
                    {(c.stats || []).slice(0, 4).map((s) => (
                      <div key={s.label}>
                        <dt className="text-xs text-[#9FB3C8]">{s.label}</dt>
                        <dd className="font-display text-2xl font-bold tabular-nums">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {/* Anonymous campaigns never link out */}
                  {c.url && !c.anonymous && (
                    <a href={c.url} target="_blank" rel="noopener" className="font-display text-sm font-semibold text-amber hover:underline">{d.site}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
