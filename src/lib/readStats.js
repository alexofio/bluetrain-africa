// Anonymous reading statistics for articles and case studies, shown in the Bluetrain Portal
// (Website Content → an item → Statistics). No cookies, no ids, nothing about the person: each page view sends
// where the visit came from (the referring site's host only, and UTM tags), the language, then on leaving the
// page the active reading time and how far down it was read; clicks report what kind of link was used.
// The portal turns the browser and location into counts and keeps nothing else. Visitors with Global Privacy
// Control switched on are not counted.
import { useEffect } from "react";
import { config } from "../content/site";

const URL_ = `${config.portalApi}/content/stats`;
const LAST = "bt-read-last"; // this tab only: which article the visitor read last, for "lead from this page"
let firstView = true;

const off = () => typeof window === "undefined" || navigator.globalPrivacyControl === true || /^\/preview/.test(location.pathname) || !!window.__BT;

function send(events) {
  if (off() || !events.length) return;
  const body = JSON.stringify(events);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(URL_, new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch(URL_, { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true, credentials: "include" }).catch(() => {});
}

const host = (u) => { try { return new URL(u, location.href).host.replace(/^www\./, ""); } catch { return ""; } };

/** What kind of link was clicked: a call to action, a source, an outbound or an internal link. */
function classify(a, root) {
  const href = a.getAttribute("href") || "";
  if (/^mailto:/i.test(href)) return ["email", ""];
  if (/^tel:/i.test(href)) return ["phone", ""];
  if (/wa\.me|whatsapp\.com/i.test(href)) return ["whatsapp", ""];
  if (/(^|\/|#)book\b|\/book(\?|$)/i.test(href) || href === config.bookingUrl) return ["book", ""];
  if (/#contact$/i.test(href)) return ["contact", ""];
  if (a.closest("section[aria-label]")?.querySelector("ol") && a.closest("ol") && root.contains(a) && a.target === "_blank") return ["source", host(href)];
  const h = host(href);
  if (h && h !== location.host.replace(/^www\./, "")) return ["out", h];
  try { return ["in", new URL(href, location.href).pathname.slice(0, 90)]; } catch { return null; }
}

/**
 * kind: "informed" | "work"; slug: the page's slug. Call once per article/case-study page (not on drafts).
 */
export function useReadStats(kind, slug, lang, rootRef) {
  useEffect(() => {
    if (!slug || off()) return;
    const path = `${kind}/${slug}`;
    const q = new URLSearchParams(location.search);
    const utm = firstView ? Object.fromEntries(["source", "medium", "campaign"].map((k) => [k, q.get(`utm_${k}`) || ""]).filter(([, v]) => v)) : {};
    const ref = firstView ? host(document.referrer) : location.host.replace(/^www\./, "");
    firstView = false;
    send([{ t: "view", path, ref, utm, lang }]);
    try { sessionStorage.setItem(LAST, JSON.stringify({ path, at: Date.now() })); } catch {}

    // active time: counted while the tab is visible and the reader did something in the last 30 s
    let secs = 0, last = Date.now(), maxScroll = 0, ended = false;
    const poke = () => { last = Date.now(); };
    const tick = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - last < 30000) secs++;
      const el = rootRef?.current || document.querySelector("article") || document.body;
      const r = el.getBoundingClientRect(), h = el.offsetHeight || 1;
      maxScroll = Math.max(maxScroll, Math.min(100, Math.round(((innerHeight - r.top) / h) * 100)));
    }, 1000);
    const end = () => { if (ended) return; ended = true; send([{ t: "end", path, secs, scroll: maxScroll }]); };
    const onHide = () => { if (document.visibilityState === "hidden") end(); };
    const onClick = (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const c = classify(a, rootRef?.current || document.body);
      if (c) send([{ t: "click", path, kind: c[0], target: c[1] }]);
    };
    const onSubmit = (e) => { if (e.target.closest?.('[data-stat="newsletter"]')) send([{ t: "click", path, kind: "newsletter", target: "" }]); };
    ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"].forEach((ev) => addEventListener(ev, poke, { passive: true }));
    document.addEventListener("visibilitychange", onHide);
    addEventListener("pagehide", end);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      end(); clearInterval(tick);
      ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"].forEach((ev) => removeEventListener(ev, poke));
      document.removeEventListener("visibilitychange", onHide);
      removeEventListener("pagehide", end);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, slug]);
}

/** After a form or booking is sent: credit the article read in this tab within the last hour. */
export function leadFromRead(method) {
  try {
    const l = JSON.parse(sessionStorage.getItem(LAST) || "null");
    if (l && Date.now() - l.at < 3600_000) send([{ t: "lead", path: l.path, method }]);
  } catch {}
}
