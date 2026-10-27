/**
 * bluetrain.africa — Cloudflare Worker.
 *
 * Everything on the site is served as static files (dist/). Code runs only for:
 *   /media/…   → images published from the Bluetrain Portal (R2), fetched from the portal and cached at the edge,
 *                so pages never depend on the portal's address
 * wrangler.jsonc routes just this path here; every other request goes straight to the files.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/media/")) return media(request, url, env, ctx);
    return env.ASSETS.fetch(request);
  },
};

const PORTAL = "https://portal.bluetrain.africa";

async function media(request, url, env, ctx) {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
  if (!/^\/media\/m_[a-f0-9]{20}\/[\w.]+$/.test(url.pathname)) return new Response("Not found", { status: 404 });
  const cache = caches.default;
  const key = new Request(url.origin + url.pathname);
  let res = await cache.match(key);
  if (!res) {
    const up = await fetch(`${env.PORTAL_URL || PORTAL}/api/public${url.pathname}`, { cf: { cacheTtl: 86400 } });
    if (!up.ok) return new Response("Not found", { status: up.status === 404 ? 404 : 502, headers: { "Cache-Control": "no-store" } });
    const h = new Headers(up.headers);
    h.set("Cache-Control", up.headers.get("Cache-Control") || "public, max-age=86400");
    h.delete("Access-Control-Allow-Origin");
    h.delete("Set-Cookie");
    res = new Response(up.body, { status: 200, headers: h });
    ctx.waitUntil(cache.put(key, res.clone()));
  }
  return res;
}

