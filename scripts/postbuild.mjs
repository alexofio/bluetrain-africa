/**
 * Runs after `vite build`. Turns dist/ into a Cloudflare-ready site (Worker static assets):
 *  - one HTML file per page (own title, description, canonical, share tags, structured data)
 *  - 404.html, sitemap.xml, robots.txt
 *  - _redirects (old Wix URLs → new pages) and _headers (caching + security)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { config, en } from "../src/content/site.js";
import { posts } from "../src/content/informed.js";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE = config.siteUrl.replace(/\/$/, "");
const OG = `${SITE}/og-image.jpg`;
const today = new Date().toISOString().slice(0, 10);
const template = readFileSync(DIST + "index.html", "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bluetrain Africa",
  legalName: "Bluetrain Limited",
  url: SITE,
  logo: `${SITE}/og-image.jpg`,
  email: config.email,
  sameAs: config.socials.map((s) => s.href),
  address: config.offices.map((o) => ({ "@type": "PostalAddress", name: o.entity, streetAddress: o.lines.join(", "), addressCountry: o.id })),
  areaServed: ["TZ", "KE", "ZA", "ZM"],
};

function ga4() {
  if (!config.ga4Id) return "";
  const id = esc(config.ga4Id);
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${id}",{send_page_view:false});gtag("event","page_view");</script>`;
}

function page({ path, title, description, type = "website", image = OG, ld = [], noscript = "", noindex = false }) {
  const url = SITE + (path === "/" ? "/" : path);
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : "",
    `<meta property="og:site_name" content="Bluetrain Africa" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    ...ld.map(jsonld),
    ga4(),
  ].filter(Boolean).join("\n    ");
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${esc(description)}" />`)
    .replace("<!--route-meta-->", head)
    // Plain-HTML fallback for visitors and crawlers without JavaScript
    .replace("<!--route-noscript-->", noscript ? `<noscript><main style="max-width:44rem;margin:0 auto;padding:6rem 1.25rem;font-family:Inter,system-ui,sans-serif;color:#dbdbdb">${noscript}</main></noscript>` : "");
}

function write(file, html) {
  const full = DIST + file;
  mkdirSync(full.replace(/[^/]+$/, ""), { recursive: true });
  writeFileSync(full, html);
}

const link = (href, text) => `<a href="${esc(href)}" style="color:#2e8eff">${esc(text)}</a>`;
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

// ---- Home
write("index.html", page({
  path: "/",
  title: en.meta.title,
  description: en.hero.body,
  ld: [organization],
  noscript: `<h1>${esc(en.hero.headline.join(" "))}</h1><p>${esc(en.hero.body)}</p>
    <h2>${esc(en.services.heading)}</h2><ul>${en.services.items.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.body)}</li>`).join("")}</ul>
    <p>${link("/informed", "Bluetrain Informed")} · ${link(`mailto:${config.email}`, config.email)}</p>`,
}));

// ---- Blog index (served at /informed)
write("informed.html", page({
  path: "/informed",
  title: "Bluetrain Informed | Market notes and campaign lessons from Africa",
  description: en.ui.informed.intro,
  ld: [{ "@context": "https://schema.org", "@type": "Blog", name: "Bluetrain Informed", url: `${SITE}/informed`, publisher: { "@type": "Organization", name: "Bluetrain Africa" } }],
  noscript: `<h1>Bluetrain Informed</h1><p>${esc(en.ui.informed.intro)}</p><ul>${sorted.map((p) => `<li>${link(`/informed/${p.slug}`, p.title)}</li>`).join("")}</ul>`,
}));

// ---- Articles (served at /informed/<slug>)
const abs = (src) => (src ? (/^https?:/.test(src) ? src : SITE + src) : "");
const isEditorial = (a) => !a.name || a.name === "Bluetrain Informed";

for (const p of posts) {
  const image = abs(p.coverImage) || OG;
  write(`informed/${p.slug}.html`, page({
    path: `/informed/${p.slug}`,
    type: "article",
    title: `${p.title} | Bluetrain Informed`,
    description: p.standfirst,
    image,
    ld: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description: p.standfirst,
      datePublished: p.date,
      dateModified: p.date,
      author: isEditorial(p.author) ? { "@type": "Organization", name: "Bluetrain Africa" } : { "@type": "Person", name: p.author.name, jobTitle: p.author.role || undefined },
      publisher: { "@type": "Organization", name: "Bluetrain Africa", logo: { "@type": "ImageObject", url: OG } },
      image,
      mainEntityOfPage: `${SITE}/informed/${p.slug}`,
      inLanguage: "en",
    }],
    noscript: `<p>${link("/informed", "← Bluetrain Informed")}</p><h1>${esc(p.title)}</h1><p><em>${esc(p.standfirst)}</em></p>${p.body
      .map((b) => (b.h ? `<h2>${esc(b.h)}</h2>` : b.html ? `<p>${b.html}</p>` : b.quote ? `<blockquote>${b.quote}</blockquote>` : b.list ? `<ul>${b.list.map((li) => `<li>${li}</li>`).join("")}</ul>` : b.img ? `<img src="${esc(b.img)}" alt="${esc(b.alt)}" style="max-width:100%" />` : ""))
      .join("")}`,
  }));
}

// ---- Discovery-call booking (served at /book; people and times load from the Bluetrain Portal)
write("book.html", page({
  path: "/book",
  title: `${en.ui.book.title} | Bluetrain Africa`,
  description: en.ui.book.intro,
  noscript: `<h1>${esc(en.ui.book.title)}</h1><p>${esc(en.ui.book.closedBody)}</p><p>${link(`mailto:${config.email}?subject=Discovery%20call`, config.email)}</p>`,
}));

// ---- 404 (Cloudflare serves this for any unknown path; the app shows its not-found view)
write("404.html", page({ path: "/404", title: "Page not found | Bluetrain Africa", description: "This page has moved or no longer exists.", noindex: true }));

// ---- sitemap + robots
const urls = [
  { loc: "/", lastmod: today, priority: "1.0" },
  { loc: "/informed", lastmod: sorted[0]?.date ?? today, priority: "0.8" },
  { loc: "/book", lastmod: today, priority: "0.7" },
  ...sorted.map((p) => ({ loc: `/informed/${p.slug}`, lastmod: p.date, priority: "0.6" })),
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE}/sitemap.xml\n`);

// ---- Redirects: every address on the old Wix site → its new home (301 = permanent, keeps rankings)
const slugs = new Set(posts.map((p) => p.slug));
// If an editor deletes or renames one of these articles, its old links fall back to the blog index.
const P = (s) => { if (slugs.has(s)) return `/informed/${s}`; console.warn(`postbuild: redirect target "${s}" no longer exists, sending to /informed`); return "/informed"; };
const redirects = [
  ["/home", "/"],
  ["/about", "/#about"],
  ["/services", "/#services"],
  ["/clients", "/#clients"],
  ["/contact", "/#contact"],
  ["/blog", "/informed"],
  // Old Informed posts — mapped to the closest new article
  ["/post/how-bluetrain-drives-brand-evolution-in-the-digital-space", P("bluetrain-limited-is-now-bluetrain-africa")],
  ["/post/the-power-of-leads-in-business-growth", P("does-cost-per-click-affect-cost-per-acquisition")],
  ["/post/monitoring-your-brand-s-online-presence", P("monitoring-your-brands-online-presence")],
  ["/post/unlock-your-brand-s-potential-how-bluetrain-can-craft-your-winning-strategy", P("planning-a-campaign-across-east-and-southern-africa")],
  ["/post/unveiling-the-power-of-quality-in-ranking", "/informed"],
  ["/post/the-magic-of-backlinking-in-digital-marketing", "/informed"],
  ["/post/impact-of-influencer-marketing", P("influence-is-bigger-than-influencers")],
  ["/post/does-cost-per-click-affect-cost-per-acquisition", P("does-cost-per-click-affect-cost-per-acquisition")],
  ["/post/unlock-the-potential-of-your-digital-marketing-campaigns-by-optimizing-your-cpa", P("does-cost-per-click-affect-cost-per-acquisition")],
  ["/post/all-your-advertising-needs-in-one-platform-seebait-x-eskimi", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/capabilities-are-now-advanced-on-a-single-platform-seebait-x-eskimi", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/multiple-products-can-now-go-on-a-single-platform-with-increased-reach-on-seebait-x-eskimi", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/programmatic-media-buying-is-much-improved-in-tanzania-through-seebait-x-eskimi", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/efficient-digital-media-buying", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/seebait-and-eskimi-join-forces-to-bring-global-solutions-to-tanzanian-advertisers", P("programmatic-buying-in-tanzania-a-primer")],
  ["/post/meet-the-pro-gwamaka-mwankyuse", "/#about"],
  ["/post/meet-the-mind-behind-grate-influencer-executions", "/#about"],
  ["/post/meet-the-team", "/#about"],
  ["/post/meet-our-business-head", "/#about"],
];
const dynamic = [
  ["/blog/*", "/informed"], // categories, paging
  ["/post/*", "/informed"], // any old post not listed above
];
write("_redirects", [
  "# Old Wix addresses → new site (301 permanent). Static rules first, wildcards last.",
  ...redirects.map(([a, b]) => `${a}  ${b}  301`),
  ...dynamic.map(([a, b]) => `${a}  ${b}  301`),
  "",
].join("\n"));

// ---- Headers: long cache for fingerprinted assets, sensible security defaults everywhere
write("_headers", `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000
`);

console.log(`postbuild: ${posts.length + 4} pages, ${redirects.length + dynamic.length} redirects, sitemap ${urls.length} URLs`);
