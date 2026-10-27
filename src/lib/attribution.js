/**
 * Where a visitor came from, captured once per visit so it survives page changes inside the site.
 * Sent with the discovery form and bookings so the team can see which campaigns bring leads.
 */
const KEY = "bluetrain-attribution";

function capture() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const utm = {};
    for (const k of ["source", "medium", "campaign", "term", "content"]) if (q.get("utm_" + k)) utm[k] = q.get("utm_" + k).slice(0, 120);
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer.slice(0, 300) : "";
    sessionStorage.setItem(KEY, JSON.stringify({ utm, referrer: ref, landing: window.location.pathname }));
  } catch {}
}
if (typeof window !== "undefined") capture();

export function attribution() {
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch {}
  return {
    page: (window.location.pathname + window.location.hash).slice(0, 300),
    referrer: saved.referrer || "",
    utm: saved.utm && Object.keys(saved.utm).length ? saved.utm : undefined,
  };
}
