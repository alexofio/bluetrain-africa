import { useLang } from "../../lib/i18n";
import { redesign } from "../../content/redesign";
import Words from "./Words";

const CARD_BG = ["from-[#2E619C] to-[#102A43]", "from-[#167D8D] to-[#0B1C2E]", "from-[#1E3A56] to-[#0B1C2E]"];

/**
 * Pinned statement: the belief rises word by word, three in-progress campaigns slide up,
 * then the promise completes the sentence. Static stack on phones and with reduced motion.
 */
export default function BluetrainWay() {
  const { lang, t } = useLang();
  const r = redesign[lang].way;
  return (
    <section className="bt-way" aria-label={t.ui.statementLabel}>
      <div className="bt-way-pin flex flex-col items-center justify-start gap-8 px-5 py-20 sm:px-8 md:justify-center md:py-16">
        <p className="kicker">{r.kicker}</p>
        <h2 className="max-w-[68rem] text-center font-display text-[clamp(2rem,5.2vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
          <Words text={t.statement.heading} className="bt-way-word" />
        </h2>
        <div className="flex w-full max-w-[52rem] flex-col gap-4 md:flex-row md:justify-center md:gap-5">
          {r.cards.map((c, i) => (
            <article
              key={c.title}
              style={{ "--i": i }}
              className={`bt-way-card flex min-h-[12rem] flex-col justify-between rounded-[18px] bg-gradient-to-b ${CARD_BG[i]} p-6 text-[#fff] shadow-[0_18px_42px_rgba(16,42,67,0.18)] md:h-[22rem] md:w-[16.25rem]`}
            >
              <p className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-amber">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-amber opacity-60 motion-safe:animate-ping" /><span className="relative h-2 w-2 rounded-full bg-amber" /></span>
                {r.live} · {c.client}
              </p>
              <div>
                <h3 className="font-display text-2xl font-bold leading-tight">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#C9D6E3]">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="max-w-[40rem] text-center text-[clamp(1.15rem,2vw,1.4rem)] leading-snug tracking-[-0.01em] text-brand-bright">
          <Words text={t.statement.body} className="bt-way-bw" />
        </p>
      </div>
    </section>
  );
}
