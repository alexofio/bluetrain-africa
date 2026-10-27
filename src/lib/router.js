import { useEffect, useState } from "react";

/**
 * Small router with two modes:
 *  - Path mode (any http/https host, e.g. Cloudflare Pages): real URLs
 *      /                    → home      (/#services etc. scroll to sections)
 *      /informed            → blog index
 *      /informed/<slug>     → article
 *      /work/<slug>         → case study
 *      /preview?token=…     → draft preview from the Bluetrain Portal (noindex)
 *      /book[?with=alex]    → discovery-call booking
 *      /privacy, /terms     → legal pages
 *      anything else        → not found
 *  - Hash mode (opened as a local file, e.g. the single-file preview): #/informed, #/informed/<slug>
 *
 * Content files write links as "#section" or "#/informed..."; `to()` turns them into the right href.
 */
export const PATH_MODE = typeof window !== "undefined" && /^https?:$/.test(window.location.protocol);

function parse() {
  const { pathname, hash } = window.location;
  let path, anchor = null;
  if (PATH_MODE) {
    // Old-style #/informed links (shared before launch) → upgrade to the real URL
    if (hash.startsWith("#/")) {
      window.history.replaceState(null, "", hash.slice(1));
      return parse();
    }
    path = pathname;
    anchor = hash.length > 1 ? decodeURIComponent(hash.slice(1)) : null;
  } else if (hash.startsWith("#/")) {
    path = hash.slice(1);
  } else {
    path = "/";
    anchor = hash.length > 1 ? hash.slice(1) : null;
  }
  path = path.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  if (path === "/") return { name: "home", path, anchor };
  if (path === "/informed") return { name: "informed", path };
  if (path === "/privacy" || path === "/terms") return { name: "legal", path, doc: path.slice(1) };
  if (path === "/preview") { const q = new URLSearchParams(window.location.search); return { name: "preview", path, token: q.get("token") || "", lang: q.get("lang") || "" }; }
  const w = path.match(/^\/work\/([\w-]+)$/);
  if (w) return { name: "work", path, slug: w[1] };
  if (path === "/book") return { name: "book", path, with: new URLSearchParams(window.location.search).get("with") || "" };
  const m = path.match(/^\/informed\/([\w-]+)$/);
  if (m) return { name: "post", path, slug: m[1] };
  return { name: "notfound", path };
}

/** Content href → real href for the current mode. External links, mailto and tel pass through. */
export function to(href) {
  if (!href || !href.startsWith("#")) return href;
  if (href.startsWith("#/")) return PATH_MODE ? href.slice(1) : href; // page
  return PATH_MODE ? `/${href}` : href; // section on the home page
}

export const postHref = (slug) => to(`#/informed/${slug}`);

export function navigate(href, { replace = false } = {}) {
  window.history[replace ? "replaceState" : "pushState"](null, "", href);
  window.dispatchEvent(new Event("routechange"));
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    window.addEventListener("popstate", on);
    window.addEventListener("routechange", on);

    // In path mode, internal links move between pages without a full reload
    const onClick = (e) => {
      if (!PATH_MODE || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, different section: let the browser scroll normally
      if (url.pathname === window.location.pathname && url.hash) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener("popstate", on);
      window.removeEventListener("routechange", on);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return route;
}
