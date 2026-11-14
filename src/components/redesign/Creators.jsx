import { useLang } from "../../lib/i18n";
import { redesign } from "../../content/redesign";
import { to } from "../../lib/router";

const REEL_BG = ["from-[#2E8EFF] to-[#102A43]", "from-[#F2B544] to-[#7a4a10]", "from-[#167D8D] to-[#0B1C2E]"];

/**
 * Creators (Next Gen Influencer). Launches with the showcase only; "Request creators" opens the
 * contact brief tagged Creators. The roster and creator sign-up switch on when the Portal module ships.
 */
export default function Creators() {
  const { lang } = useLang();
  const c = redesign[lang].creators;
  return (
    <section id="creators" className="relative py-24 lg:py-32">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[40rem]">
            <p className="kicker">{c.kicker}</p>
            <h2 className="mt-4 font-display text-display-lg font-bold text-white">{c.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-silver/80">{c.body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={to("#contact")} onClick={() => { try { sessionStorage.setItem("bt-intent", "creators"); } catch { /* storage blocked */ } }} className="rounded-full bg-white px-6 py-3.5 font-display font-semibold text-navy">{c.request} →</a>
            <span className="rounded-full border border-dashed border-white/25 px-5 py-3.5 text-sm text-steel">{c.signup}</span>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {c.reels.map((reel, i) => (
            <li key={reel.title} className="bt-rise" style={{ "--i": i }}>
              <article className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${REEL_BG[i]} p-6 text-[#fff]`}>
                <span aria-hidden className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-[#ffffff26] backdrop-blur transition-transform duration-500 group-hover:scale-110">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0l14 8-14 8z" /></svg>
                </span>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[#ffffffb3]">Reel · {reel.tag}</p>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{reel.title}</h3>
                <p className="mt-2 text-sm text-[#ffffffcc]">{reel.body}</p>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-steel">{c.roster}</p>
      </div>
    </section>
  );
}
