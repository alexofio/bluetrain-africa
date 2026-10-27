/**
 * bluetrain.africa — Cloudflare Worker.
 *
 * Everything on the site is served as static files (dist/). Code runs only for:
 *   /media/…   → images published from the Bluetrain Portal (R2), fetched from the portal and cached at the edge,
 *                so pages never depend on the portal's address
 *   /auth, /callback → GitHub sign-in for the old editor at /admin (removed once the portal has published live)
 * wrangler.jsonc routes just these paths here; every other request goes straight to the files.
 *
 * Secrets (Worker → Settings → Variables and Secrets): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET.
 */

// Pages allowed to receive a sign-in token.
const ALLOWED_ORIGINS = ["https://bluetrain.africa", "https://www.bluetrain.africa", "http://localhost:8787", "http://localhost:5173"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/media/")) return media(request, url, env, ctx);
    if (url.pathname === "/auth") return startSignIn(url, env);
    if (url.pathname === "/callback") return finishSignIn(request, url, env);
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

function startSignIn(url, env) {
  if (!env.GITHUB_CLIENT_ID) return page("error", { error: "Sign-in isn't set up yet: GITHUB_CLIENT_ID is missing on the Worker." });
  const state = crypto.randomUUID();
  const github = new URL("https://github.com/login/oauth/authorize");
  github.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  github.searchParams.set("redirect_uri", `${url.origin}/callback`);
  github.searchParams.set("scope", url.searchParams.get("scope") || "repo,user");
  github.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      // Ties the GitHub reply to this browser (protects against forged sign-in replies).
      "Set-Cookie": `bt_oauth_state=${state}; Path=/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "no-store",
    },
  });
}

async function finishSignIn(request, url, env) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = /(?:^|;\s*)bt_oauth_state=([^;]+)/.exec(request.headers.get("Cookie") || "")?.[1];
  if (!code) return page("error", { error: url.searchParams.get("error_description") || "GitHub didn't return a sign-in code." });
  if (!state || state !== cookie) return page("error", { error: "Sign-in expired or came from another window. Close this window and try again." });
  if (!env.GITHUB_CLIENT_SECRET) return page("error", { error: "Sign-in isn't set up yet: GITHUB_CLIENT_SECRET is missing on the Worker." });

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "bluetrain-africa-cms" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/callback` }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) return page("error", { error: `GitHub refused the sign-in: ${data.error_description || data.error || res.status}` });
  return page("success", { token: data.access_token, provider: "github" });
}

/** The standard Decap/Sveltia hand-off: tell /admin we're ready, then post the result to it only.
 *  Success payload: { token, provider }. Error payload: { error, provider } (Sveltia shows `error`). */
function page(status, payload) {
  payload = { provider: "github", ...payload };
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html><meta charset="utf-8"><title>Signing in…</title>
<body style="font-family:system-ui,sans-serif;padding:2rem;color:#0c2236">
<p>${status === "success" ? "Signed in. You can close this window." : "Sign-in failed: " + escapeHtml(payload.error)}</p>
<script>
(function () {
  var allowed = ${JSON.stringify(ALLOWED_ORIGINS)};
  var msg = ${JSON.stringify(message)};
  if (!window.opener) return;
  window.addEventListener("message", function receive(e) {
    if (allowed.indexOf(e.origin) === -1) return;
    window.opener.postMessage(msg, e.origin);
    window.removeEventListener("message", receive);
  });
  window.opener.postMessage("authorizing:github", "*");
})();
</script>`;
  return new Response(html, {
    status: status === "success" ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "bt_oauth_state=; Path=/callback; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
