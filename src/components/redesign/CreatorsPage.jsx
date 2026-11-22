import { useLang } from "../../lib/i18n";
import { redesign, creatorPortal } from "../../content/redesign";
import { to } from "../../lib/router";
import { track } from "../../lib/track";

const card = "rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7";
const primary = "inline-flex items-center justify-center rounded-full bg-amber px-7 py-4 font-display font-semibold text-rail transition-transform hover:-translate-y-0.5";
const secondary = "inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 font-display font-semibold text-white transition-colors hover:border-brand-bright/60 hover:bg-white/5";

/** The two ways into the Bluetrain Influencer Portal (influencers.bluetrain.africa). */
function Actions({ c, where }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={creatorPortal.join} onClick={() => track("creator_join_click", { where })} className={primary}>{c.join} →</a>
      <a href={creatorPortal.home} onClick={() => track("creator_signin_click", { where })} className={secondary}>{c.signin}</a>
    </div>
  );
}

/**
 * For creators (/creators): what the Bluetrain creator network is, how it works, what you need,
 * and the way in. Profiles, offers, contracts and payments live on influencers.bluetrain.africa.
 */
export default function CreatorsPage() {
  const { lang } = useLang();
  const c = redesign[lang].creatorsPage;
  const home = redesign[lang].creators;
  return (
    <article className="pb-24 pt-36 lg:pt-44">
      <header className="container-site">
        <div className="max-w-[52rem]">
          <p className="kicker">{c.kicker}</p>
          <h1 className="mt-5 font-display text-display-lg font-bold text-white">{c.heading}</h1>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-silver/80">{c.body}</p>
          <div className="mt-9"><Actions c={c} where="top" /></div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-steel">{c.joinNote}</p>
        </div>
      </header>

      <section className="container-site mt-24 lg:mt-32" aria-labelledby="cr-steps">
        <p className="kicker">{c.stepsKicker}</p>
        <h2 id="cr-steps" className="mt-4 max-w-[36rem] font-display text-display-md font-bold text-white">{c.stepsHeading}</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {c.steps.map((s, i) => (
            <li key={s.title} className={card}>
              <p className="font-mono text-sm text-amber" aria-hidden>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-display text-xl font-bold leading-tight text-white">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-silver/75">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6"><a href={creatorPortal.guide} className="text-brand-bright underline underline-offset-4 hover:text-white">{c.guide} ↗</a></p>
      </section>

      <section className="container-site mt-24 lg:mt-32" aria-labelledby="cr-need">
        <p className="kicker">{c.needKicker}</p>
        <h2 id="cr-need" className="mt-4 font-display text-display-md font-bold text-white">{c.needHeading}</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {c.needs.map((n) => (
            <li key={n.title} className={card}>
              <h3 className="font-display text-xl font-bold leading-tight text-white">{n.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-silver/75">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-site mt-24 lg:mt-32" aria-labelledby="cr-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="kicker">{c.faqKicker}</p>
            <h2 id="cr-faq" className="mt-4 font-display text-display-md font-bold text-white">{c.faqHeading}</h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {c.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="mt-1 text-amber transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[40rem] leading-relaxed text-silver/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site mt-24 lg:mt-32">
        <div className="rounded-3xl bg-gradient-to-br from-[#2E619C] to-[#102A43] p-8 text-[#fff] sm:p-12">
          <h2 className="font-display text-display-md font-bold">{c.closeHeading}</h2>
          <p className="mt-3 text-lg text-[#ffffffcc]">{c.closeBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={creatorPortal.join} onClick={() => track("creator_join_click", { where: "bottom" })} className={primary}>{c.join} →</a>
            <a href={creatorPortal.home} onClick={() => track("creator_signin_click", { where: "bottom" })} className="inline-flex items-center justify-center rounded-full border border-[#ffffff40] px-7 py-4 font-display font-semibold text-[#fff] transition-colors hover:bg-[#ffffff14]">{c.signin}</a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/10 p-8 sm:p-10">
          <div className="max-w-[36rem]">
            <p className="kicker">{c.brandsKicker}</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">{c.brandsHeading}</h2>
            <p className="mt-2 text-silver/80">{c.brandsBody}</p>
          </div>
          <a href={to("#contact")} onClick={() => { try { sessionStorage.setItem("bt-intent", "creators"); } catch { /* storage blocked */ } }} className="rounded-full bg-white px-6 py-3.5 font-display font-semibold text-navy">{home.request} →</a>
        </div>
      </section>
    </article>
  );
}
