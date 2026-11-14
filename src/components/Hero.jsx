import { useLang } from "../lib/i18n";
import { config } from "../content/site";
import { redesign } from "../content/redesign";
import { to } from "../lib/router";
import { HeroHead } from "./Navbar";

/**
 * Night Rail hero: header, kinetic three-line headline, CTAs, then Alex's layered locomotive.
 * The train arrives once (far left → close right) and holds; only its wheels and rods keep moving.
 * On scroll the whole hero shrinks into a rounded card (CSS scroll timeline, see index.css).
 */
export default function Hero() {
  const { lang, t } = useLang();
  const hero = t.hero;
  const r = redesign[lang];
  return (
    <section id="top" className="bt-hero relative overflow-hidden bg-rail text-[#fff]">
      <HeroHead />

      <div className="relative z-10 mx-auto max-w-site px-5 pb-4 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        <p className="kicker bt-up mb-6">{r.hero.kicker}</p>
        <h1
          key={lang}
          className={`font-display font-bold ${lang === "sw" ? "text-[clamp(2.3rem,6.4vw,5.8rem)]" : "text-[clamp(2.6rem,7.6vw,7rem)]"} leading-[0.98] tracking-[-0.03em]`}
        >
          {hero.headline.map((text, i) => (
            <span key={text} className={`bt-line ${i === 1 ? "text-brand-bright" : ""}`} style={{ animationDelay: `${0.1 + i * 0.25}s` }}>
              {text}
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[32rem]">
            <p className="bt-up text-base leading-relaxed text-[#C9D6E3] sm:text-lg" style={{ animationDelay: ".9s" }}>{hero.body}</p>
            <p className="bt-up mt-4 font-display font-semibold" style={{ animationDelay: "1s" }}>{hero.kicker}</p>
          </div>
          <div className="bt-up flex flex-wrap items-center gap-3" style={{ animationDelay: "1.1s" }}>
            <a href={to(hero.primaryCta.href)} className="rounded-full bg-amber px-6 py-4 font-display font-semibold text-rail transition-transform hover:-translate-y-0.5">{hero.primaryCta.label} →</a>
            <a href={to(hero.secondaryCta.href)} className="rounded-full border-[1.5px] border-brand-bright px-6 py-4 font-display font-semibold transition-colors hover:bg-brand-bright/15">{hero.secondaryCta.label}</a>
            {hero.profileCta && (
              <a href={to(hero.profileCta.href)} className="px-2 py-4 font-display font-semibold text-[#C9D6E3] hover:text-[#fff]">{hero.profileCta.label}</a>
            )}
          </div>
        </div>

        <a href={to("#where")} aria-label={t.ui.countriesLink} className="bt-up mt-8 inline-flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-[#9FB3C8] hover:text-[#fff]" style={{ animationDelay: "1.2s" }}>
          {config.countries.map((id) => <span key={id}>{t.where.countries[id].name}</span>)}
        </a>
      </div>

      {/* Locomotive (decorative) */}
      <div aria-hidden className="relative h-[clamp(200px,38vw,480px)] overflow-hidden">
        <div className="bt-approach absolute bottom-0 right-[3%] w-[92%] max-w-[920px] sm:w-[72%] lg:w-[64%]">
          <img src="/train/loco.svg" alt="" width="1774" height="887" decoding="async" className="block h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
