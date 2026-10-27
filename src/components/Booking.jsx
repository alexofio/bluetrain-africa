import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { attribution } from "../lib/attribution";
import Button from "./ui/Button";

/**
 * Discovery-call booking (/book, /book?with=alex). People, free times and the calendar invitation all
 * come from the Bluetrain Portal's public API; the booking also lands in the portal as a lead.
 */
const tzName = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Dar_es_Salaam"; } catch { return "Africa/Dar_es_Salaam"; } })();
const isEAT = ["Africa/Dar_es_Salaam", "Africa/Nairobi", "Africa/Kampala", "Africa/Addis_Ababa", "Indian/Comoro", "Indian/Mayotte", "Africa/Mogadishu", "Africa/Djibouti", "Africa/Asmara"].includes(tzName);

const pill = (on) =>
  `rounded-full border px-4 py-2.5 text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright ${
    on ? "border-white bg-white text-navy" : "border-white/15 text-silver hover:border-white/40 hover:text-white"
  }`;
const field = "mt-2 w-full rounded-2xl border border-white/15 bg-navy/50 px-4 py-3 text-white placeholder:text-steel/70 focus:border-brand-bright focus:outline-none";

async function get(path) {
  const res = await fetch(config.portalApi + path, { headers: { Accept: "application/json" } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "Request failed"), { status: res.status });
  return data;
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function Booking({ preselect = "" }) {
  const { lang, t } = useLang();
  const b = t.ui.book, f = t.ui.form;
  const locale = lang === "sw" ? "sw-TZ" : "en-GB";
  const fmtDay = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }), [locale]);
  const fmtTime = useMemo(() => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: tzName }), [locale]);
  const fmtTimeEAT = useMemo(() => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Dar_es_Salaam" }), [locale]);
  const fmtLong = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: tzName, timeZoneName: "short" }), [locale]);

  const [info, setInfo] = useState(null);       // { open, hosts, minutes }
  const [state, setState] = useState("loading"); // loading | closed | pick
  const [host, setHost] = useState(null);
  const [slots, setSlots] = useState(null);      // { days: [{date, times}] } | "loading" | "error"
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", topic: "" });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");  // idle | sending | done
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(null);
  const startedAt = useRef(Date.now());
  const headingRef = useRef(null);

  useEffect(() => {
    get("/booking")
      .then((d) => {
        setInfo(d);
        if (!d.open) return setState("closed");
        setState("pick");
        const pre = d.hosts.find((h) => h.slug === preselect.toLowerCase());
        if (pre) choose(pre);
        else if (d.hosts.length === 1) choose(d.hosts[0]);
      })
      .catch(() => setState("closed"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (state === "pick") headingRef.current?.focus({ preventScroll: true }); }, [step, state]);

  function loadSlots(h, keepDay) {
    setSlots("loading");
    get("/booking/slots?with=" + encodeURIComponent(h.slug))
      .then((d) => {
        setSlots(d);
        setDay((cur) => (keepDay && d.days.some((x) => x.date === cur) ? cur : d.days[0]?.date || null));
      })
      .catch(() => setSlots("error"));
  }

  function choose(h) {
    setHost(h); setTime(null); setNotice(""); setStep(1);
    loadSlots(h);
  }

  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const times = slots && typeof slots === "object" ? slots.days.find((d) => d.date === day)?.times || [] : [];
  const minutes = info?.minutes || 30;

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = f.errName;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = f.errEmail;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending"); setNotice("");
    try {
      const res = await fetch(config.portalApi + "/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          with: host.slug, start: time, ...form,
          language: lang === "sw" ? "Swahili" : "English", timeZone: tzName,
          website: trap, elapsed: Date.now() - startedAt.current, ...attribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setStatus("idle"); setNotice(b.taken); setTime(null); setStep(1); loadSlots(host, true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setDone(data); setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: "discovery_call" });
    } catch {
      setStatus("idle"); setNotice(b.error(config.email));
    }
  }

  // ---------- views ----------

  const header = (
    <div className="max-w-[44rem]">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright">{b.kicker}</p>
      <h1 className="mt-4 font-display text-display-lg font-bold text-white">{b.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-silver/75">{b.intro}</p>
    </div>
  );

  if (status === "done" && done) {
    return (
      <section className="container-site flex min-h-[70vh] flex-col justify-center pb-24 pt-36">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} role="status" className="glass max-w-[40rem] rounded-4xl p-7 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber text-ink" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg>
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-white">{b.doneTitle}</h1>
          <p className="mt-3 text-lg leading-relaxed text-silver/80">
            {b.doneBody(`${fmtLong.format(new Date(done.start))} · ${done.with.name}`, form.email)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {done.meetLink && <Button href={done.meetLink} target="_blank" rel="noreferrer">{b.join}</Button>}
            <Button href="#top" variant="secondary">{b.home}</Button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (state === "closed") {
    return (
      <section className="container-site flex min-h-[70vh] flex-col justify-center gap-10 pb-24 pt-36">
        {header}
        <div className="glass max-w-[40rem] rounded-4xl p-7 sm:p-9">
          <h2 className="font-display text-2xl font-bold text-white">{b.closedTitle}</h2>
          <p className="mt-3 text-silver/75">{b.closedBody}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="#contact">{b.brief}</Button>
            <Button href={`mailto:${config.email}?subject=${encodeURIComponent("Discovery call")}`} variant="secondary">{config.email}</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-site pb-24 pt-36">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          {header}
          {host && (
            <div className="mt-10 border-t border-white/10 pt-8 text-silver/80">
              <p className="text-sm text-steel">{b.steps[0]}</p>
              <p className="mt-1 font-display text-xl font-semibold text-white">{host.name}</p>
              {host.title && <p className="text-sm">{host.title}</p>}
              <p className="mt-4 text-sm text-steel">{b.duration(minutes)}</p>
              {time && <p className="mt-4 font-display text-lg font-semibold text-white">{fmtLong.format(new Date(time))}</p>}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="glass rounded-4xl p-6 sm:p-9">
            {/* progress */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-steel">{f.step(step + 1, 3)} · {b.steps[step]}</p>
              <div className="flex gap-1.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ width: i === step ? 28 : 8, opacity: i <= step ? 1 : 0.3 }} transition={spring.snappy} className="h-2 rounded-full bg-white" />
                ))}
              </div>
            </div>

            {notice && <p role="alert" className="mt-6 rounded-2xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">{notice}</p>}

            <div className="relative mt-8 min-h-[18rem]">
              <AnimatePresence mode="wait" initial={false}>
                {state === "loading" && (
                  <motion.p key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-silver/70">{b.loading}</motion.p>
                )}

                {state === "pick" && step === 0 && (
                  <motion.div key="who" initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-white outline-none sm:text-3xl">{b.whoQ}</h2>
                    <div className="mt-6 grid gap-3">
                      {info.hosts.map((h) => (
                        <button key={h.slug} type="button" onClick={() => choose(h)}
                          className="flex items-center gap-4 rounded-3xl border border-white/15 p-4 text-left transition-colors hover:border-brand-bright/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-bright">
                          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-brand font-display font-bold text-white" aria-hidden>{initials(h.name)}</span>
                          <span className="min-w-0">
                            <span className="block font-display text-lg font-semibold text-white">{h.name}</span>
                            {h.title && <span className="block text-sm text-silver/70">{h.title}</span>}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {state === "pick" && step === 1 && (
                  <motion.div key="when" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-white outline-none sm:text-3xl">{b.whenQ}</h2>
                    <p className="mt-2 text-sm text-steel">{isEAT ? b.eatNote : b.tzNote(tzName.replace(/_/g, " "))}</p>
                    {slots === "loading" && <p className="mt-6 text-silver/70">{b.loading}</p>}
                    {slots === "error" && <p className="mt-6 text-amber">{b.error(config.email)}</p>}
                    {slots && typeof slots === "object" && (slots.days.length === 0 ? (
                      <p className="mt-6 text-silver/75">{b.noTimes}</p>
                    ) : (
                      <>
                        <div className="-mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2" role="radiogroup" aria-label={b.whenQ}>
                          {slots.days.map((d) => (
                            <button key={d.date} type="button" role="radio" aria-checked={day === d.date} onClick={() => { setDay(d.date); setTime(null); }} className={`${pill(day === d.date)} flex-none whitespace-nowrap`}>
                              {fmtDay.format(new Date(d.date + "T12:00:00Z"))}
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={fmtDay.format(new Date((day || "2026-01-01") + "T12:00:00Z"))}>
                          {times.map((iso) => (
                            <button key={iso} type="button" role="radio" aria-checked={time === iso}
                              onClick={() => { setTime(iso); setNotice(""); setTimeout(() => setStep(2), 180); }} className={pill(time === iso)}>
                              {fmtTime.format(new Date(iso))}
                            </button>
                          ))}
                        </div>
                        {!isEAT && time && <p className="mt-3 text-sm text-steel">{fmtTimeEAT.format(new Date(time))} EAT</p>}
                      </>
                    ))}
                  </motion.div>
                )}

                {state === "pick" && step === 2 && (
                  <motion.form key="details" onSubmit={submit} noValidate initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-white outline-none sm:text-3xl">{b.detailsQ}</h2>
                    <p className="mt-2 text-sm text-steel">{f.reassurance[2]}</p>
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" /></label>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-silver/80">{f.name}</span>
                        <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={field} maxLength={120} />
                        {errors.name && <span className="mt-1.5 block text-sm text-amber">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-silver/80">{f.email}</span>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className={field} maxLength={254} />
                        {errors.email && <span className="mt-1.5 block text-sm text-amber">{errors.email}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-silver/80">{b.company}</span>
                        <input value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={field} maxLength={120} />
                      </label>
                      <label className="block">
                        <span className="text-sm text-silver/80">{b.phone}</span>
                        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" className={field} maxLength={40} />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="text-sm text-silver/80">{b.topic}</span>
                        <textarea rows={3} value={form.topic} onChange={(e) => set("topic", e.target.value)} placeholder={b.topicPlaceholder} className={`${field} resize-none`} maxLength={2000} />
                      </label>
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                      <button type="button" onClick={() => setStep(1)} className="text-sm text-silver/70 hover:text-white">{f.back}</button>
                      <Button type="submit" disabled={status === "sending"}>{status === "sending" ? b.booking : b.confirm}</Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {state === "pick" && step === 1 && info.hosts.length > 1 && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <button type="button" onClick={() => { setStep(0); setNotice(""); }} className="text-sm text-silver/70 hover:text-white">{f.back}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
