import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config, en } from "../content/site";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { Reveal, RevealItem } from "./ui/Reveal";
import Button from "./ui/Button";
import { to } from "../lib/router";
import { attribution } from "../lib/attribution";

function Option({ name, label, checked, onChange }) {
  return (
    <label
      className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-bright ${
        checked ? "border-white bg-white text-navy" : "border-white/15 text-silver hover:border-white/40 hover:text-white"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function DiscoveryForm() {
  const { lang, t } = useLang();
  const contact = t.contact;
  const f = t.ui.form;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  // choices are stored as option indexes so they survive a language switch mid-form
  const [data, setData] = useState({ building: -1, other: "", timeline: -1, budget: -1, name: "", email: "", note: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | mailto | error
  const [errors, setErrors] = useState({});
  const startedAt = useRef(Date.now());
  const [trap, setTrap] = useState(""); // hidden field: people never see it, bots fill it in
  const headingRef = useRef(null);
  const total = contact.steps.length;
  const current = contact.steps[step];

  // Move focus to the new question so keyboard and screen-reader users follow the step change
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [step]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const go = (d) => { setDir(d); setStep((s) => s + d); };

  const otherIndex = contact.steps[0].options.length; // "Something else"
  const choose = (k, i) => {
    set(k, i);
    // auto-advance for single-choice steps (keeps the flow frictionless)
    if (step < total - 1 && !(step === 0 && i === otherIndex)) setTimeout(() => go(1), 220);
  };

  const canContinue =
    step === 0 ? data.building >= 0 && (data.building !== otherIndex || data.other.trim()) : data[current.key] >= 0;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (data.budget < 0) errs.budget = "errBudget";
    if (!data.name.trim()) errs.name = "errName";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = "errEmail";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Answers are sent in English so the team gets consistent data, plus the visitor's language
    const opts = (k) => en.contact.steps.find((s) => s.key === k).options;
    const payload = {
      building: data.building === otherIndex ? data.other : opts("building")[data.building],
      timeline: opts("timeline")[data.timeline],
      budget: opts("budget")[data.budget],
      language: lang === "sw" ? "Swahili" : "English",
      name: data.name,
      email: data.email,
      note: data.note,
    };
    // For the portal: spam checks and where the visitor came from (not shown in the email fallback)
    const extra = { website: trap, elapsed: Date.now() - startedAt.current, ...attribution() };

    if (!config.formEndpoint) {
      const body = Object.entries(payload).map(([k, v]) => `${k}: ${v || "-"}`).join("\n");
      window.location.href = `mailto:${config.email}?subject=${encodeURIComponent("New project enquiry")}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(config.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, ...extra }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent" || status === "mailto") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} role="status" className="py-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-amber text-ink" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg>
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-white">
          {status === "sent" ? f.sentTitle : f.mailtoTitle}
        </h3>
        <p className="mt-3 max-w-[28rem] leading-relaxed text-silver/75">
          {status === "sent" ? f.sentBody(data.name.split(" ")[0], data.email) : f.mailtoBody}
        </p>
        <Button href={config.bookingUrl} variant="secondary" className="mt-8">
          {t.nav.cta}
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" /></label>
      </div>
      {/* progress — a real 3-step sequence, so numbered */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-steel">
          {f.step(step + 1, total)}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {contact.steps.map((_, i) => (
            <motion.span key={i} animate={{ width: i === step ? 28 : 8, opacity: i <= step ? 1 : 0.3 }} transition={spring.snappy} className="h-2 rounded-full bg-white" />
          ))}
        </div>
      </div>

      <div className="relative mt-8 min-h-[17rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={spring.snappy}
          >
            <legend ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-white outline-none sm:text-3xl">
              {current.question}
            </legend>
            <p className="mt-2 text-sm text-steel">{f.reassurance[step]}</p>

            <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label={current.question}>
              {[...current.options, ...(current.allowOther ? [f.somethingElse] : [])].map((o, i) => (
                <Option key={i} name={current.key} label={o} checked={data[current.key] === i} onChange={() => choose(current.key, i)} />
              ))}
            </div>
            {errors.budget && step === 2 && <p className="mt-3 text-sm text-amber">{f[errors.budget]}</p>}

            {step === 0 && data.building === otherIndex && (
              <label className="mt-5 block">
                <span className="text-sm text-silver/80">{f.tellUs}</span>
                <input
                  autoFocus
                  value={data.other}
                  onChange={(e) => set("other", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-navy/50 px-4 py-3 text-white placeholder:text-steel/70 focus:border-brand-bright focus:outline-none"
                  placeholder={f.otherPlaceholder}
                />
              </label>
            )}

            {step === 2 && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-silver/80">{f.name}</span>
                  <input
                    value={data.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-navy/50 px-4 py-3 text-white focus:border-brand-bright focus:outline-none"
                  />
                  {errors.name && <span className="mt-1.5 block text-sm text-amber">{f[errors.name]}</span>}
                </label>
                <label className="block">
                  <span className="text-sm text-silver/80">{f.email}</span>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-navy/50 px-4 py-3 text-white focus:border-brand-bright focus:outline-none"
                  />
                  {errors.email && <span className="mt-1.5 block text-sm text-amber">{f[errors.email]}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-silver/80">{f.note}</span>
                  <textarea
                    rows={3}
                    value={data.note}
                    onChange={(e) => set("note", e.target.value)}
                    className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-navy/50 px-4 py-3 text-white focus:border-brand-bright focus:outline-none"
                  />
                </label>
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className={`text-sm text-silver/70 hover:text-white ${step === 0 ? "invisible" : ""}`}
        >
          {f.back}
        </button>
        {step < total - 1 ? (
          <Button type="button" onClick={() => canContinue && go(1)} aria-disabled={!canContinue} className={canContinue ? "" : "opacity-40"}>
            {f.continue}
          </Button>
        ) : (
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? f.sending : f.send}
          </Button>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-amber">
          {f.error(config.email)}
        </p>
      )}
    </form>
  );
}

export default function Contact() {
  const { t } = useLang();
  const contact = t.contact;
  const f = t.ui.form;
  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <RevealItem as="h2" className="font-display text-display-lg font-bold text-white">
            {contact.heading}
          </RevealItem>
          <div className="mt-8 space-y-2 text-lg leading-relaxed text-silver/75">
            {contact.lines.map((l) => (
              <RevealItem as="p" key={l}>{l}</RevealItem>
            ))}
          </div>
          <RevealItem className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm text-steel">{f.talk}</p>
            <a href={to(config.bookingUrl)} className="mt-2 inline-block font-display text-xl font-semibold text-white underline decoration-brand-bright/60 underline-offset-[6px] hover:decoration-white">
              {f.bookLong}
            </a>
            <p className="mt-6 text-sm text-steel">
              {f.orEmail} <a href={`mailto:${config.email}`} className="text-silver hover:text-white">{config.email}</a>
            </p>
          </RevealItem>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          <RevealItem className="glass rounded-4xl p-6 sm:p-9">
            <DiscoveryForm />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
