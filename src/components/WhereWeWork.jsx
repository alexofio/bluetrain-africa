import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../lib/i18n";
import { config } from "../content/site";
import map from "../content/africaMap";
import { spring } from "../lib/motion";
import { Reveal, RevealItem } from "./ui/Reveal";

/** Curved route from Dar es Salaam to another market — the logomark's arc, put to work. */
function routePath(from, to) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  // bow the curve sideways, proportional to distance
  const cx = mx - (dy / len) * len * 0.28;
  const cy = my + (dx / len) * len * 0.28;
  return `M${from.x} ${from.y} Q${cx} ${cy} ${to.x} ${to.y}`;
}

function AfricaMap({ active, setActive, names, label, hqLabel }) {
  const hq = map.hq;
  return (
    <svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={label} className="h-auto w-full overflow-visible">
      {/* the rest of the continent */}
      <path d={map.land} className="fill-white/[0.07] stroke-navy" strokeWidth="0.6" />

      {/* our markets */}
      {config.countries.map((id) => {
        const c = map.countries[id];
        const on = active === id;
        return (
          <motion.path
            key={id}
            d={c.d}
            onPointerEnter={() => setActive(id)}
            onPointerLeave={() => setActive(null)}
            initial={false}
            animate={{ opacity: active && !on ? 0.55 : 1 }}
            transition={spring.soft}
            className={`cursor-pointer stroke-navy transition-colors duration-300 ${on ? "fill-brand-bright" : "fill-brand"}`}
            strokeWidth="1"
          />
        );
      })}

      {/* routes out from headquarters */}
      {config.countries.filter((id) => id !== "TZ").map((id, i) => {
        const c = map.countries[id];
        const on = active === id;
        return (
          <motion.path
            key={`r-${id}`}
            d={routePath(hq, { x: c.cx, y: c.cy })}
            fill="none"
            className={on ? "stroke-white" : "stroke-white/50"}
            strokeWidth={on ? 2 : 1.4}
            strokeLinecap="round"
            strokeDasharray="1 0"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.1, delay: 0.3 + i * 0.18, ease: [0.2, 0.7, 0.2, 1] }}
          />
        );
      })}

      {/* country markers + labels */}
      {config.countries.map((id) => {
        const c = map.countries[id];
        const isHq = id === "TZ";
        const x = isHq ? hq.x : c.cx, y = isHq ? hq.y : c.cy;
        const labelRight = id !== "ZA";
        return (
          <g key={`m-${id}`} className="pointer-events-none">
            {isHq && <circle cx={x} cy={y} r="14" className="fill-amber/25 motion-safe:animate-pulse" />}
            <circle cx={x} cy={y} r={isHq ? 5.5 : 4} className={isHq ? "fill-amber" : "fill-white"} />
            <text
              x={labelRight ? x + 12 : x - 12}
              y={y + 4}
              textAnchor={labelRight ? "start" : "end"}
              className={`font-display text-[15px] font-semibold ${active === id ? "fill-white" : "fill-white/80"}`}
            >
              {names[id]}
            </text>
            {isHq && (
              <text x={x + 12} y={y + 20} className="fill-amber font-sans text-[12px] font-semibold">
                {hqLabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const office = (id) => config.offices.find((o) => o.id === id);

export default function WhereWeWork() {
  const { t } = useLang();
  const w = t.where;
  const [active, setActive] = useState(null);
  const names = Object.fromEntries(config.countries.map((id) => [id, w.countries[id].name]));

  return (
    <section id="where" className="relative overflow-hidden border-t border-white/[0.06] py-24 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <RevealItem as="h2" className="font-display text-display-lg font-bold text-white">
            {w.heading}
          </RevealItem>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-silver/75">
            {w.body.map((p) => (
              <RevealItem as="p" key={p}>{p}</RevealItem>
            ))}
          </div>

          {/* The four markets, set large — linked to the map on hover/focus */}
          <RevealItem as="ul" className="mt-10 border-t border-white/10">
            {config.countries.map((id) => {
              const c = w.countries[id];
              const on = active === id;
              return (
                <li key={id} className="border-b border-white/10">
                  <button
                    type="button"
                    onPointerEnter={() => setActive(id)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(id)}
                    onBlur={() => setActive(null)}
                    className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
                  >
                    <span className={`font-display text-3xl font-bold tracking-[-0.02em] transition-colors duration-300 sm:text-4xl ${on ? "text-brand-bright" : "text-white"}`}>
                      {c.name}
                    </span>
                    <span className={`shrink-0 text-sm ${id === "TZ" ? "text-amber" : "text-steel"}`}>{c.note}</span>
                  </button>
                  {/* registered office, revealed with the row */}
                  {office(id) && (
                    <motion.p
                      initial={false}
                      animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                      transition={spring.snappy}
                      className="overflow-hidden text-sm text-silver/60"
                    >
                      <span className="block pb-4">{office(id).entity} · {office(id).lines.join(", ")}</span>
                    </motion.p>
                  )}
                </li>
              );
            })}
          </RevealItem>

          <RevealItem as="p" className="mt-8 max-w-[30rem] leading-relaxed text-silver/70">
            {w.closing}
          </RevealItem>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <RevealItem className="relative mx-auto max-w-[40rem] lg:pl-6">
            <AfricaMap active={active} setActive={setActive} names={names} label={t.ui.mapLabel} hqLabel={t.ui.hq} />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
