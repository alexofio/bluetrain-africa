import { useEffect, useState } from "react";
import { useLang } from "../../lib/i18n";
import { config } from "../../content/site";
import { redesign, crewFallback, partners } from "../../content/redesign";

/**
 * Team wall from the Portal HR module. Expected feed: { team: [{ name, title, photo, department,
 * country, bio, linkedin }] }. Until it is live, the leadership team is shown.
 */
function useCrew() {
  const [crew, setCrew] = useState(crewFallback);
  useEffect(() => {
    let live = true;
    fetch(`${config.portalApi}/content/team`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && Array.isArray(d?.team) && d.team.length && setCrew(d.team))
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return crew;
}

const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function Journey() {
  const { lang } = useLang();
  const j = redesign[lang].journey;
  const crew = useCrew();
  return (
    <section id="journey" className="relative border-t border-white/[0.06] py-24 lg:py-32">
      <div className="container-site">
        <p className="kicker">{j.kicker}</p>
        <h2 className="mt-4 max-w-[48rem] font-display text-display-lg font-bold text-white">{j.heading}</h2>

        {/* Timeline as a rail line with stations */}
        <ol className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-[2px] bg-gradient-to-r from-amber via-brand-bright to-teal lg:block" />
          {j.timeline.map((x, i) => (
            <li key={x.year} className="bt-rise relative pl-7 lg:pl-0 lg:pt-8" style={{ "--i": i }}>
              <span aria-hidden className="absolute left-0 top-1 h-4 w-4 rounded-full border-[3px] border-amber bg-navy lg:top-0" />
              <p className="font-mono text-sm text-amber">{x.year}</p>
              <p className="mt-2 font-display text-lg font-semibold leading-snug text-white">{x.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker">{j.valuesLabel}</p>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {j.values.map((v, i) => (
                <li key={v} className="flex items-baseline gap-4 py-4">
                  <span className="font-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl font-semibold text-white">{v}</span>
                </li>
              ))}
            </ul>
            <p className="kicker mt-12">{j.partnersLabel}</p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-display text-lg font-semibold text-silver">
              {partners.map((p) => <span key={p}>{p}</span>)}
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="kicker">{j.crewLabel}</p>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {crew.map((p, i) => (
                <li key={p.name} className="bt-rise" style={{ "--i": i % 3 }}>
                  <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-rail">
                    {p.photo ? (
                      <img src={p.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center font-display text-3xl font-bold text-[#ffffffcc]">{initials(p.name)}</span>
                    )}
                  </div>
                  <p className="mt-3 font-display font-semibold text-white">
                    {p.linkedin ? <a href={p.linkedin} target="_blank" rel="noopener" className="hover:underline">{p.name}</a> : p.name}
                  </p>
                  <p className="text-sm text-steel">{[p.title, p.country].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
