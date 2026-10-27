import { useEffect, useState } from "react";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import Logo from "./ui/Logo";
import { to } from "../lib/router";

function LocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: config.timeZone }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="flex items-center gap-2 text-sm text-silver/70">
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      <span>
        Dar es Salaam <time className="tabular-nums text-white">{time}</time> {config.timeZoneLabel} (GMT+3)
      </span>
    </p>
  );
}

function Col({ title, children }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-2.5 text-sm text-silver/65">{children}</div>
    </div>
  );
}

function Offices({ t }) {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {config.offices.map((o) => (
        <address key={o.id} className="not-italic">
          <p className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <span className={`rounded-md px-1.5 py-0.5 text-[0.7rem] tracking-[0.08em] ${o.id === "TZ" ? "bg-amber text-ink" : "bg-white/10 text-white"}`}>{o.id}</span>
            {t.where.countries[o.id].name}
          </p>
          <p className="mt-3 text-sm font-medium text-silver/85">{o.entity}</p>
          <div className="mt-1 space-y-0.5 text-sm leading-relaxed text-silver/60">
            {o.lines.map((l) => <span key={l} className="block">{l}</span>)}
          </div>
        </address>
      ))}
    </div>
  );
}

export default function Footer() {
  const { t } = useLang();
  const { footer, nav } = t;
  const L = t.ui.footer;
  return (
    <footer className="border-t border-white/[0.06] bg-navy-deep pt-16">
      {/* Intent links: one row, four clear doors in */}
      <div className="container-site">
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {L.intents.map((it, i) => (
            <li key={it.label} className="bg-navy-deep">
              <a href={to(it.href)} className="group flex h-full items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-white/[0.04]">
                <span className={`font-display text-xl font-bold tracking-[-0.015em] ${i === 0 ? "text-white" : "text-silver"} group-hover:text-white`}>{it.label}</span>
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:translate-x-1 group-hover:border-brand-bright group-hover:bg-brand-bright/15">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-site grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="w-[170px]" />
          <p className="mt-6 max-w-[18rem] leading-relaxed text-silver/70">{footer.tagline}</p>
          <p className="mt-6 font-display text-sm font-semibold tracking-[0.12em] text-steel">
            {config.countries.map((id, i) => (
              <a key={id} href={to("#where")} title={t.where.countries[id].name} className="hover:text-white">
                {id}{i < config.countries.length - 1 && <span className="px-2 text-white/20" aria-hidden>·</span>}
              </a>
            ))}
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:col-span-3">
          <Col title={L.explore}>
            {nav.links.map((l) => (
              <a key={l.href} href={to(l.href)} className="block hover:text-white">{l.label}</a>
            ))}
            <a href={to("#contact")} className="block hover:text-white">{L.contact}</a>
          </Col>
          <Col title={L.follow}>
            {config.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block hover:text-white">{s.label}</a>
            ))}
            <a href={`mailto:${config.email}`} className="block pt-2 hover:text-white">{config.email}</a>
          </Col>
        </div>
        <div className="md:col-span-5">
          <h3 className="font-display text-sm font-semibold text-white">{L.offices}</h3>
          <div className="mt-4"><Offices t={t} /></div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-site flex flex-col gap-4 py-6 pb-24 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <LocalTime />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-steel">
            {footer.legal.map((l) => (
              <a key={l.label} href={to(l.href)} className="hover:text-white">{l.label}</a>
            ))}
            <span>{footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
