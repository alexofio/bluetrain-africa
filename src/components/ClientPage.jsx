import { useEffect } from "react";
import { clients, caseStudies, hasPage, cloc, industryLabel } from "../content/cms";
import { config } from "../content/site";
import { redesign } from "../content/redesign";
import { useLang } from "../lib/i18n";
import { to } from "../lib/router";
import ClientLogo from "./ui/ClientLogo";
import WorkArt from "./WorkArt";

const MARKET = { TZ: "Tanzania", KE: "Kenya", ZA: "South Africa", ZM: "Zambia", AF: "Pan-African" };
const MARKET_SW = { TZ: "Tanzania", KE: "Kenya", ZA: "Afrika Kusini", ZM: "Zambia", AF: "Afrika nzima" };

/** Case studies for a client: by the client set on the case study, or the client's own list in the Portal. */
export function clientCases(client) {
  const listed = new Set(client.caseStudies || []);
  return caseStudies.filter((c) => c.client?.slug === client.slug || listed.has(c.slug));
}
export const clientHref = (client) => to(`#/clients/${client.slug}`);

/** Client page (/clients/<slug>): who they are, the case studies and the work Bluetrain has done for them. */
export default function ClientPage({ slug }) {
  const { lang, t } = useLang();
  const r = redesign[lang].clientPage;
  const client = clients.find((c) => c.slug === slug);

  useEffect(() => {
    if (client) document.title = `${client.name} · ${r.titleSuffix} | Bluetrain Africa`;
  }, [client, r.titleSuffix]);

  if (!client) {
    return (
      <section className="container-site pb-32 pt-40">
        <p className="text-lg text-silver/80">{t.ui.notFound.title}</p>
        <a href={to("#clients")} className="mt-6 inline-block text-brand-bright">← {r.all}</a>
      </section>
    );
  }

  const cases = clientCases(client);
  const services = Object.fromEntries(t.services.items.map((s) => [s.id, s.title]));
  const description = (lang === "sw" && client.descriptionSw) || client.description;
  const sector = industryLabel(client.sector, lang) || t.ui.clientsWall?.sectors?.[client.sector] || "";
  const markets = (client.markets || []).map((m) => (lang === "sw" ? MARKET_SW : MARKET)[m] || m);
  const parentClient = client.parent ? clients.find((c) => c.slug === client.parent || c.name === client.parent) : null;
  const siblings = clients.filter((c) => c.slug !== client.slug && c.sector && c.sector === client.sector).slice(0, 4);
  const projects = (client.projects || []).slice().sort((a, b) => String(b.year).localeCompare(String(a.year)));

  return (
    <article className="pb-24">
      {/* Header band */}
      <header className="bg-rail pb-16 pt-32 text-[#fff] sm:pt-36">
        <div className="container-site">
          <a href={to("#clients")} className="font-mono text-xs uppercase tracking-[0.14em] text-[#9FB3C8] hover:text-[#fff]">← {r.all}</a>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="kicker !text-amber">● {sector || r.client}</p>
              <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.03em]">{client.name}</h1>
              {description && <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-[#C9D6E3]">{description}</p>}
            </div>
            {client.logo && (
              <div className="lg:col-span-4 lg:justify-self-end">
                <div className="bt-logo-hover grid h-36 w-56 place-items-center rounded-3xl border border-[#ffffff1a] bg-[#ffffff0a] p-6">
                  <ClientLogo src={client.logo} alt={client.name} className="max-h-16 w-auto max-w-full" />
                </div>
              </div>
            )}
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-[#ffffff1a] pt-8 sm:grid-cols-4">
            {client.years && <Fact label={r.since} value={client.years} />}
            {markets.length > 0 && <Fact label={r.markets} value={markets.join(" · ")} />}
            {cases.length > 0 && <Fact label={r.caseCount} value={String(cases.length)} />}
            {client.website && (
              <div>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#9FB3C8]">{r.website}</dt>
                <dd className="mt-1 font-display text-lg font-semibold"><a href={client.website} target="_blank" rel="noopener" className="hover:text-amber">{client.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")} ↗</a></dd>
              </div>
            )}
          </dl>
          {client.parent && (
            <p className="mt-6 text-sm text-[#9FB3C8]">
              {r.partOf} {parentClient ? <a href={clientHref(parentClient)} className="text-[#fff] underline">{parentClient.name}</a> : <span className="text-[#fff]">{client.parent}</span>}
            </p>
          )}
        </div>
      </header>

      <div className="container-site">
        {/* Case studies */}
        <section className="pt-16 lg:pt-20">
          <p className="kicker">{r.casesKicker}</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{r.casesHeading(client.name)}</h2>
          {cases.length ? (
            <ul className="mt-10 grid gap-5 md:grid-cols-2">
              {cases.map((c, i) => {
                const inner = (
                  <>
                    <div className="relative aspect-[16/9] overflow-hidden bg-rail">
                      {c.coverImage ? <img src={c.coverImage} alt={c.coverAlt || ""} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <WorkArt kind={c.art} />}
                    </div>
                    <div className="p-6">
                      {cloc(c, lang, "industry") && <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-steel">{cloc(c, lang, "industry")}</p>}
                      <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white">{cloc(c, lang, "title")}</h3>
                      {cloc(c, lang, "metric") && <p className="mt-3 text-silver/80">{cloc(c, lang, "metric")}</p>}
                      {hasPage(c) && <p className="mt-5 font-display text-sm font-semibold text-brand-bright">{r.read} →</p>}
                    </div>
                  </>
                );
                return (
                  <li key={c.slug} className="bt-rise" style={{ "--i": i }}>
                    {hasPage(c) ? (
                      <a href={to(`#/work/${c.slug}`)} className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-brand-bright/50">{inner}</a>
                    ) : (
                      <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 max-w-[36rem] text-silver/75">{r.noCases}</p>
          )}
        </section>

        {/* Work done */}
        {projects.length > 0 && (
          <section className="pt-16 lg:pt-20">
            <p className="kicker">{r.workKicker}</p>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {projects.map((p, i) => (
                <li key={`${p.name}-${i}`} className="grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-mono text-sm text-amber sm:col-span-2">{p.year}</span>
                  <span className="font-display text-xl font-semibold text-white sm:col-span-7">{p.name}</span>
                  <span className="text-sm text-steel sm:col-span-3 sm:text-right">{services[p.capability] || p.capability}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="mt-20 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-brand p-8 text-[#fff] sm:p-10">
          <h2 className="max-w-[32rem] font-display text-2xl font-bold sm:text-3xl">{r.cta}</h2>
          <div className="flex flex-wrap gap-3">
            <a href={to(config.bookingUrl)} className="rounded-full bg-amber px-6 py-3.5 font-display font-semibold text-rail">{t.nav.cta} →</a>
            <a href={to("#/work")} className="rounded-full border border-[#ffffff66] px-6 py-3.5 font-display font-semibold">{r.allWork}</a>
          </div>
        </section>

        {/* Other clients in the same sector */}
        {siblings.length > 0 && (
          <section className="pt-16">
            <p className="kicker">{r.more(sector)}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {siblings.map((c) => (
                <li key={c.slug}><a href={clientHref(c)} className="block rounded-full border border-white/15 px-5 py-2.5 font-display font-semibold text-white hover:border-brand-bright">{c.name}</a></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#9FB3C8]">{label}</dt>
      <dd className="mt-1 font-display text-lg font-semibold">{value}</dd>
    </div>
  );
}
