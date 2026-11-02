/**
 * Edit on the page. A website author opens the site from the Bluetrain Portal (…?bt-edit=1). The site remembers
 * that in this browser and loads the editor from the portal; everything about who may edit, drafts and approval
 * lives in the portal. Ordinary visitors never load any of it: without the flag this file does nothing.
 * The editor talks to the page through window.__BT (below).
 */
import { en, enDefaults, config } from "../content/site";
import { sw, swDefaults } from "../content/sw";
import { setPath } from "../content/textPaths";

const KEY = "bt-edit";
export const bridge = { lang: () => "en", setLang() {}, refresh() {}, showDraft() {}, route: () => ({}) };

export function maybeStartEditing() {
  let on = false;
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("bt-edit")) {
      localStorage.setItem(KEY, "1");
      q.delete("bt-edit");
      window.history.replaceState(null, "", window.location.pathname + (q.toString() ? `?${q}` : "") + window.location.hash);
    }
    on = localStorage.getItem(KEY) === "1";
  } catch {}
  if (!on || window.location.pathname.startsWith("/preview") || window.__BT) return;
  const portal = String(config.portalApi || "").replace(/\/api\/public\/?$/, "") || config.portalUrl;
  window.__BT = {
    portal,
    dicts: { en, sw },
    defaults: { en: enDefaults, sw: swDefaults },
    lang: () => bridge.lang(),
    setLang: (l) => bridge.setLang(l),
    route: () => bridge.route(),
    refresh: () => bridge.refresh(),
    apply(lang, map) {
      const dict = lang === "sw" ? sw : en;
      for (const [path, value] of Object.entries(map || {})) setPath(dict, path, value);
      bridge.refresh();
    },
    showDraft: (kind, slug, item) => bridge.showDraft(kind, slug, item),
    stop() {
      try { localStorage.removeItem(KEY); } catch {}
      window.location.reload();
    },
  };
  const s = document.createElement("script");
  s.type = "module";
  s.src = `${portal}/assets/site-edit/editor.js`;
  document.head.appendChild(s);
}
