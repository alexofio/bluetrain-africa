import { legal } from "../content/legal";
import { useLang } from "../lib/i18n";
import { to } from "../lib/router";

/** Inline markup: **bold** and [text](href). */
function Inline({ text }) {
  const parts = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={i++} className="font-semibold text-white">{m[1]}</strong>);
    else parts.push(<a key={i++} href={to(m[3])} className="text-brand-bright underline underline-offset-4 hover:text-white">{m[2]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ b }) {
  if (b.h) return <h3 className="mt-6 font-display text-lg font-semibold text-white">{b.h}</h3>;
  if (b.list)
    return (
      <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-brand-bright">
        {b.list.map((li, k) => <li key={k}><Inline text={li} /></li>)}
      </ul>
    );
  return <p className="mt-4"><Inline text={b.p} /></p>;
}

const fmtDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

export default function Legal({ doc }) {
  const { lang } = useLang();
  const L = legal[lang] || legal.en;
  const d = L[doc];
  if (!d) return null;

  return (
    <article className="container-site pb-24 pt-36">
      <header className="max-w-[48rem]">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright">Bluetrain Limited</p>
        <h1 className="mt-4 font-display text-display-lg font-bold text-white">{d.title}</h1>
        <p className="mt-4 text-sm text-steel">{L.effectiveLabel}: {fmtDate(d.effective, lang)}</p>
        {L.translationNote && (
          <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-silver/80">{L.translationNote}</p>
        )}
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <nav aria-label={L.contentsLabel} className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-white">{L.contentsLabel}</p>
            <ol className="mt-3 space-y-2 text-sm text-silver/70">
              {d.sections.map((s, k) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                    className="hover:text-white"
                  >
                    {k + 1}. {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-[46rem] text-base leading-relaxed text-silver/80 lg:col-span-9">
          {d.intro.map((p, k) => <p key={k} className="text-lg"><Inline text={p} /></p>)}
          {d.sections.map((s, k) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-white/[0.06] pt-8 mt-10">
              <h2 className="font-display text-2xl font-bold text-white">{k + 1}. {s.h}</h2>
              {s.body.map((b, j) => <Block key={j} b={b} />)}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
