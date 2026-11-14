import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../content/site";
import { track, identify } from "../lib/track";
import { useLang } from "../lib/i18n";
import { spring } from "../lib/motion";
import { attribution } from "../lib/attribution";
import PrivacyNotice from "./ui/PrivacyNotice";
import { redesign } from "../content/redesign";

/**
 * Discovery-call booking (/book, /book?with=alex). People, free times and the calendar invitation all
 * come from the Bluetrain Portal's public API; the booking also lands in the portal as a lead.
 */
const tzName = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Dar_es_Salaam"; } catch { return "Africa/Dar_es_Salaam"; } })();
const isEAT = ["Africa/Dar_es_Salaam", "Africa/Nairobi", "Africa/Kampala", "Africa/Addis_Ababa", "Indian/Comoro", "Indian/Mayotte", "Africa/Mogadishu", "Africa/Djibouti", "Africa/Asmara"].includes(tzName);

/* Boarding-pass styling. The ticket uses fixed paper colours so it reads the same in light and dark mode. */
const pill = (on, accent = false) =>
  `rounded-full border px-4 py-2.5 text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E8EFF] ${
    on ? (accent ? "border-[#F2B544] bg-[#F2B544] font-bold text-[#0B1C2E]" : "border-[#102A43] bg-[#102A43] text-[#fff]") : "border-[#C9CDD2] bg-[#fff] text-[#102A43] hover:border-[#102A43]"
  }`;
const field = "mt-2 w-full rounded-2xl border border-[#C9CDD2] bg-[#fff] px-4 py-3 text-[#102A43] placeholder:text-[#9AA5B1] focus:border-[#2E8EFF] focus:outline-none";
const mono = "font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#7E7F7F]";

/** Route line: station dots for Who → When → Details. */
function Route({ step }) {
  return (
    <span aria-hidden className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className={`h-[3px] w-6 rounded-full transition-colors duration-500 ${i <= step ? "bg-[#2E619C]" : "bg-[#DBDBDB]"}`} />}
          <span className={`h-3 w-3 rounded-full transition-colors duration-500 ${i < step ? "bg-[#2E619C]" : i === step ? "bg-[#F2B544]" : "border-2 border-[#DBDBDB]"}`} />
        </span>
      ))}
    </span>
  );
}

/** Ticket shell: paper body + perforated white stub (stub sits below on phones). */
function Ticket({ children, stub, className = "" }) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-[26px] bg-[#F5F3EE] text-[#102A43] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] md:flex-row ${className}`}>
      <div className="min-w-0 flex-1 p-6 sm:p-8">{children}</div>
      {stub && (
        <div className="relative flex flex-col justify-between gap-6 border-t-[3px] border-dashed border-[#C9CDD2] bg-[#fff] p-6 md:w-[13rem] md:border-l-[3px] md:border-t-0 md:px-5 md:py-8">
          {/* punched notches on the perforation */}
          <span aria-hidden className="absolute -top-[13px] -left-[13px] h-6 w-6 rounded-full bg-rail md:-left-[13px] md:-top-[13px]" />
          <span aria-hidden className="absolute -top-[13px] -right-[13px] h-6 w-6 rounded-full bg-rail md:-bottom-[13px] md:left-[-13px] md:right-auto md:top-auto" />
          {stub}
        </div>
      )}
    </div>
  );
}

function StubRow({ label, value }) {
  return (
    <div>
      <p className={mono}>{label}</p>
      <p className="mt-0.5 font-display text-[1.05rem] font-bold leading-tight text-[#102A43]">{value || "—"}</p>
    </div>
  );
}

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
  const pass = redesign[lang].pass;
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
      track("generate_lead", { method: "discovery_call" });
      identify({ email: form.email, phone: form.phone });
    } catch {
      setStatus("idle"); setNotice(b.error(config.email));
    }
  }

  // ---------- views ----------

  const header = (
    <div className="max-w-[44rem]">
      <p className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-amber">● {b.kicker}</p>
      <h1 className="mt-4 font-display text-[clamp(2.3rem,4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[#fff]">{b.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-[#C9D6E3]">{b.intro}</p>
    </div>
  );

  if (status === "done" && done) {
    return (
      <section className="bg-rail text-[#fff]">
        <div className="container-site flex min-h-[80vh] flex-col justify-center pb-24 pt-36">
          <motion.div initial={{ opacity: 0, y: 40, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={spring.soft} role="status" className="max-w-[48rem]">
            <Ticket
              stub={
                <>
                  <div className="space-y-4">
                    <StubRow label={pass.from} value={pass.you} />
                    <StubRow label={pass.to} value={pass.growth} />
                    <StubRow label={pass.seat} value={fmtTime.format(new Date(done.start))} />
                  </div>
                  {done.meetLink && <a href={done.meetLink} target="_blank" rel="noreferrer" className="rounded-full bg-[#102A43] px-4 py-3 text-center font-display text-sm font-semibold text-[#fff]">{b.join}</a>}
                </>
              }
            >
              <div className="flex items-center justify-between gap-4">
                <span className={mono}>{pass.title(minutes)}</span>
                <motion.span initial={{ scale: 2.2, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} transition={{ delay: 0.45, type: "spring", stiffness: 260, damping: 14 }}
                  className="rounded-lg border-[3px] border-[#167D8D] px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#167D8D]">{pass.confirmed}</motion.span>
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">{b.doneTitle}</h1>
              <p className="mt-3 text-lg leading-relaxed text-[#3B4C5E]">
                {b.doneBody(`${fmtLong.format(new Date(done.start))} · ${done.with.name}`, form.email)}
              </p>
              <a href="#top" className="mt-8 inline-block text-sm font-semibold text-[#2E619C] hover:underline">{b.home} →</a>
            </Ticket>
          </motion.div>
        </div>
      </section>
    );
  }

  if (state === "closed") {
    return (
      <section className="bg-rail text-[#fff]">
        <div className="container-site flex min-h-[80vh] flex-col justify-center gap-10 pb-24 pt-36">
          {header}
          <Ticket className="max-w-[44rem]">
            <span className={mono}>{pass.title(minutes)}</span>
            <h2 className="mt-4 font-display text-2xl font-bold">{b.closedTitle}</h2>
            <p className="mt-3 text-[#3B4C5E]">{b.closedBody}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="rounded-full bg-[#102A43] px-5 py-3 font-display text-sm font-semibold text-[#fff]">{b.brief}</a>
              <a href={`mailto:${config.email}?subject=${encodeURIComponent("Discovery call")}`} className="rounded-full border border-[#C9CDD2] bg-[#fff] px-5 py-3 font-display text-sm font-semibold">{config.email}</a>
            </div>
          </Ticket>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-rail text-[#fff]">
     <div className="container-site pb-24 pt-32 sm:pt-36">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          {header}
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-[#9FB3C8]">{b.duration(minutes)}</p>
        </div>

        <div className="lg:col-span-8">
          <Ticket
            stub={
              <>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
                  <StubRow label={pass.with} value={host?.name?.split(" ")[0]} />
                  <StubRow label={pass.date} value={time ? fmtDay.format(new Date(day + "T12:00:00Z")) : null} />
                  <StubRow label={pass.seat} value={time ? fmtTime.format(new Date(time)) : null} />
                </div>
                {step === 2 ? (
                  <button type="submit" form="bt-book-form" disabled={status === "sending"} className="rounded-full bg-[#F2B544] px-4 py-3.5 font-display text-sm font-semibold text-[#0B1C2E] transition-transform hover:-translate-y-0.5 disabled:opacity-60">
                    {status === "sending" ? b.booking : `${b.confirm} →`}
                  </button>
                ) : (
                  <button type="button" disabled={!time || step !== 1} onClick={() => setStep(2)} className="rounded-full bg-[#102A43] px-4 py-3.5 font-display text-sm font-semibold text-[#fff] transition-opacity disabled:opacity-30">
                    {pass.continue} →
                  </button>
                )}
              </>
            }
          >
            {/* progress */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={mono}>{pass.title(minutes)}</span>
              <Route step={step} />
            </div>
            <p className="mt-3 text-sm text-[#7E7F7F]">{f.step(step + 1, 3)} · {b.steps[step]}</p>

            {notice && <p role="alert" className="mt-6 rounded-2xl border border-[#F2B544] bg-[#FDF3DD] px-4 py-3 text-sm text-[#7a4a10]">{notice}</p>}

            <div className="relative mt-8 min-h-[18rem]">
              <AnimatePresence mode="wait" initial={false}>
                {state === "loading" && (
                  <motion.p key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#7E7F7F]">{b.loading}</motion.p>
                )}

                {state === "pick" && step === 0 && (
                  <motion.div key="who" initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-[#102A43] outline-none sm:text-3xl">{b.whoQ}</h2>
                    <div className="mt-6 grid gap-3">
                      {info.hosts.map((h) => (
                        <button key={h.slug} type="button" onClick={() => choose(h)}
                          className="group flex items-center gap-4 rounded-3xl border border-[#C9CDD2] bg-[#fff] p-4 text-left transition-colors hover:border-[#102A43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2E8EFF]">
                          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#2E619C] font-display font-bold text-[#fff]" aria-hidden>{initials(h.name)}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-lg font-semibold text-[#102A43]">{h.name}</span>
                            {h.title && <span className="block text-sm text-[#3B4C5E]">{h.title}</span>}
                          </span>
                          <span aria-hidden className="font-display text-[#102A43] transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {state === "pick" && step === 1 && (
                  <motion.div key="when" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-[#102A43] outline-none sm:text-3xl">{b.whenQ}</h2>
                    <p className="mt-2 text-sm text-[#7E7F7F]">{isEAT ? b.eatNote : b.tzNote(tzName.replace(/_/g, " "))}</p>
                    {slots === "loading" && <p className="mt-6 text-[#7E7F7F]">{b.loading}</p>}
                    {slots === "error" && <p className="mt-6 text-[#9a6408]">{b.error(config.email)}</p>}
                    {slots && typeof slots === "object" && (slots.days.length === 0 ? (
                      <p className="mt-6 text-[#3B4C5E]">{b.noTimes}</p>
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
                              onClick={() => { setTime(iso); setNotice(""); setTimeout(() => setStep(2), 180); }} className={`${pill(time === iso, true)} font-mono`}>
                              {fmtTime.format(new Date(iso))}
                            </button>
                          ))}
                        </div>
                        {!isEAT && time && <p className="mt-3 text-sm text-[#7E7F7F]">{fmtTimeEAT.format(new Date(time))} EAT</p>}
                      </>
                    ))}
                  </motion.div>
                )}

                {state === "pick" && step === 2 && (
                  <motion.form id="bt-book-form" key="details" onSubmit={submit} noValidate initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={spring.snappy}>
                    <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold tracking-[-0.015em] text-[#102A43] outline-none sm:text-3xl">{b.detailsQ}</h2>
                    <p className="mt-2 text-sm text-[#7E7F7F]">{f.reassurance[2]}</p>
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" /></label>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-[#3B4C5E]">{f.name}</span>
                        <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={field} maxLength={120} />
                        {errors.name && <span className="mt-1.5 block text-sm text-[#B42318]">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-[#3B4C5E]">{f.email}</span>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className={field} maxLength={254} />
                        {errors.email && <span className="mt-1.5 block text-sm text-[#B42318]">{errors.email}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm text-[#3B4C5E]">{b.company}</span>
                        <input value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={field} maxLength={120} />
                      </label>
                      <label className="block">
                        <span className="text-sm text-[#3B4C5E]">{b.phone}</span>
                        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" className={field} maxLength={40} />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="text-sm text-[#3B4C5E]">{b.topic}</span>
                        <textarea rows={3} value={form.topic} onChange={(e) => set("topic", e.target.value)} placeholder={b.topicPlaceholder} className={`${field} resize-none`} maxLength={2000} />
                      </label>
                    </div>
                    <div className="mt-6 border-t border-[#DBDBDB] pt-5">
                      <button type="button" onClick={() => setStep(1)} className="text-sm text-[#3B4C5E] hover:text-[#102A43]">← {f.back}</button>
                    </div>
                    <PrivacyNotice className="mt-4 [&_*]:!text-[#7E7F7F]" />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {state === "pick" && step === 1 && info.hosts.length > 1 && (
              <div className="mt-6 border-t border-[#DBDBDB] pt-5">
                <button type="button" onClick={() => { setStep(0); setNotice(""); }} className="text-sm text-[#3B4C5E] hover:text-[#102A43]">← {f.back}</button>
              </div>
            )}
          </Ticket>
        </div>
      </div>
     </div>
    </section>
  );
}
