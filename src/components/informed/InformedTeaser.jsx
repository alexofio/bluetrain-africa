import { posts, loc } from "../../content/informed";
import { useLang } from "../../lib/i18n";
import { postHref, to } from "../../lib/router";
import { Reveal, RevealItem } from "../ui/Reveal";
import { ArrowIcon } from "../ui/Icons";
import { PostCard, Tags, Meta } from "./shared";

const byDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));

/** Homepage block: featured post + latest three, linking into the full Informed index. */
export default function InformedTeaser() {
  const { lang, t } = useLang();
  const ui = t.ui.informed;
  const featured = byDate.find((p) => p.featured) ?? byDate[0];
  const latest = byDate.filter((p) => p.slug !== featured.slug).slice(0, 3);

  return (
    <section id="informed" className="relative border-t border-white/[0.06] py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <RevealItem as="p" className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright">{ui.name}</RevealItem>
            <RevealItem as="h2" className="mt-4 max-w-[44rem] font-display text-display-lg font-bold text-white">{ui.kicker}</RevealItem>
          </div>
          <RevealItem>
            <a href={to("#/informed")} className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 font-display font-semibold text-white transition-colors hover:border-brand-bright hover:bg-white/5">
              {ui.readAll}
              <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            </a>
          </RevealItem>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 lg:grid-cols-12">
          <RevealItem className="lg:col-span-7">
            <PostCard post={featured} lang={lang} ui={ui} size="lg" />
          </RevealItem>
          <div className="flex flex-col divide-y divide-white/10 rounded-3xl border border-white/10 lg:col-span-5">
            {latest.map((p) => (
              <RevealItem as="article" key={p.slug} className="group relative flex-1 p-6 transition-colors hover:bg-white/[0.03]">
                <Tags post={p} lang={lang} />
                <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-[-0.01em] text-white transition-colors group-hover:text-brand-bright sm:text-xl">
                  <a href={postHref(p.slug)} className="after:absolute after:inset-0">{loc(p, lang, "title")}</a>
                </h3>
                <Meta post={p} lang={lang} ui={ui} className="mt-3" />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
