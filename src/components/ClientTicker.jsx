import { clients as cmsClients } from "../content/cms";
import { useLang } from "../lib/i18n";
import { Reveal, RevealItem } from "./ui/Reveal";

function ClientMark({ client, duplicate }) {
  return (
    <li aria-hidden={duplicate || undefined} className={`shrink-0 px-8 sm:px-10 ${duplicate ? "motion-reduce:hidden" : ""}`}>
      {client.logo ? (
        <img
          src={client.logo}
          alt={client.name}
          className="h-7 w-auto opacity-40 brightness-0 dark:invert transition-opacity duration-300 hover:opacity-100"
        />
      ) : (
        // Typeset fallback until approved monochrome logo files are supplied
        <span className="whitespace-nowrap font-display text-2xl font-semibold tracking-[-0.02em] text-white/35 transition-colors duration-300 hover:text-white">
          {client.name}
        </span>
      )}
    </li>
  );
}

export default function ClientTicker() {
  const { t } = useLang();
  const about = t.about;
  const clients = cmsClients;
  const loop = [...clients, ...clients];
  return (
    <section id="about" className="relative border-t border-white/[0.06] py-24 lg:py-32">
      <Reveal className="container-site grid gap-10 lg:grid-cols-12">
        <RevealItem as="h2" className="font-display text-display-md font-bold text-white lg:col-span-5">
          {about.heading}
        </RevealItem>
        <div className="space-y-5 text-lg leading-relaxed text-silver/75 lg:col-span-6 lg:col-start-7">
          {about.paragraphs.map((p, i) => (
            <RevealItem as="p" key={i} className={i === 2 ? "font-display font-semibold text-white" : ""}>
              {p}
            </RevealItem>
          ))}
        </div>
      </Reveal>

      <div className="mt-20">
        <div className="container-site">
          <p className="max-w-[46rem] text-sm leading-relaxed text-steel">{about.experience}</p>
        </div>
        <div
          className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
          aria-label={t.ui.clientsLabel}
        >
          {/* motion-safe: animates only when the visitor hasn't asked for reduced motion */}
          <ul className="flex w-max motion-safe:animate-[marquee_48s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6">
            {loop.map((c, i) => (
              <ClientMark key={`${c.name}-${i}`} client={c} duplicate={i >= clients.length} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
