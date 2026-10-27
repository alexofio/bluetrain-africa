/**
 * Runs after `vite build`. Turns dist/ into a Cloudflare-ready site (Worker static assets):
 *  - one HTML file per page (own title, description, canonical, share tags, structured data)
 *  - 404.html, sitemap.xml, robots.txt
 *  - _redirects (old Wix URLs → new pages, plus address changes made in the portal) and _headers (caching + security)
 *  - llms.txt (a plain index for AI answer engines) and content-version.json (tells the portal which content is live)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { config, en } from "../src/content/site.js";
import { posts } from "../src/content/informed.js";
import { legal } from "../src/content/legal.js";
import { caseStudies, hasPage, version as contentVersion } from "../src/content/cms.js";
import { redirects as contentRedirects } from "../src/content/cms.generated.js";

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

function page({ path, title, description, type = "website", image = OG, ld = [], noscript = "", noindex = false, canonical }) {
  const url = canonical || SITE + (path === "/" ? "/" : path);
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
const blocksHtml = (body) => (body || []).map((b) =>
  b.h ? `<h2>${esc(b.h)}</h2>` : b.h3 ? `<h3>${esc(b.h3)}</h3>` : b.html ? `<p>${b.html}</p>` : b.quote ? `<blockquote>${b.quote}</blockquote>` : b.callout ? `<p>${b.callout}</p>`
  : b.list ? `<${b.ordered ? "ol" : "ul"}>${b.list.map((li) => `<li>${li}</li>`).join("")}</${b.ordered ? "ol" : "ul"}>`
  : b.img ? `<img src="${esc(b.img)}" alt="${esc(b.alt)}" style="max-width:100%" />` : b.gallery ? b.gallery.map((g) => `<img src="${esc(g.img)}" alt="${esc(g.alt)}" style="max-width:100%" />`).join("")
  : b.table ? `<table>${b.table.head ? `<tr>${b.table.head.map((c) => `<th>${c}</th>`).join("")}</tr>` : ""}${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`
  : b.faq ? `<dl>${b.faq.map((f) => `<dt>${esc(f.q)}</dt><dd>${f.a}</dd>`).join("")}</dl>` : b.embed ? `<p>${link(b.embed.src, b.embed.title || b.embed.provider)}</p>` : "").join("");
const strip = (h) => String(h).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const crumbs = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + path })) });
const faqLd = (faqs) => (faqs?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: strip(f.a) } })) }] : []);
const publisher = { "@type": "Organization", name: "Bluetrain Africa", url: SITE, logo: { "@type": "ImageObject", url: OG } };

for (const p of posts) {
  const image = abs(p.seo?.shareImage || p.coverImage) || OG;
  const url = `${SITE}/informed/${p.slug}`;
  write(`informed/${p.slug}.html`, page({
    path: `/informed/${p.slug}`,
    type: "article",
    title: p.metaTitle || `${p.title} | Bluetrain Informed`,
    description: p.metaDescription || p.standfirst,
    image,
    canonical: p.seo?.canonical,
    noindex: !!p.seo?.noindex,
    ld: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description: p.standfirst,
      abstract: p.answer || undefined,
      datePublished: p.date,
      dateModified: p.updated && p.updated > p.date ? p.updated : p.date,
      author: isEditorial(p.author) ? { "@type": "Organization", name: "Bluetrain Africa" } : { "@type": "Person", name: p.author.name, jobTitle: p.author.role || undefined },
      publisher,
      image,
      mainEntityOfPage: url,
      inLanguage: "en",
      keywords: p.seo?.focus || undefined,
      mentions: p.entities?.length ? p.entities.map((name) => ({ "@type": "Thing", name })) : undefined,
    }, crumbs([["Home", "/"], ["Bluetrain Informed", "/informed"], [p.title, `/informed/${p.slug}`]]), ...faqLd(p.faqs)],
    noscript: `<p>${link("/informed", "← Bluetrain Informed")}</p><h1>${esc(p.title)}</h1><p><em>${esc(p.standfirst)}</em></p>${p.answer ? `<p><strong>${esc(p.answer)}</strong></p>` : ""}${blocksHtml(p.body)}`,
  }));
}

// ---- Case studies with a page of their own (served at /work/<slug>)
const casePages = caseStudies.filter(hasPage);
for (const c of casePages) {
  const image = abs(c.seo?.shareImage || c.coverImage) || OG;
  write(`work/${c.slug}.html`, page({
    path: `/work/${c.slug}`,
    type: "article",
    title: c.metaTitle || `${c.title} | Bluetrain Africa`,
    description: c.metaDescription || c.standfirst,
    image,
    canonical: c.seo?.canonical,
    noindex: !!c.seo?.noindex,
    ld: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.standfirst,
      abstract: c.answer || undefined,
      datePublished: c.date,
      dateModified: c.updated && c.updated > c.date ? c.updated : c.date,
      author: { "@type": "Organization", name: "Bluetrain Africa" },
      publisher,
      image,
      mainEntityOfPage: `${SITE}/work/${c.slug}`,
      inLanguage: "en",
      about: c.client ? { "@type": "Organization", name: c.client.name } : undefined,
      mentions: c.entities?.length ? c.entities.map((name) => ({ "@type": "Thing", name })) : undefined,
    }, crumbs([["Home", "/"], ["Work", "/#work"], [c.title, `/work/${c.slug}`]]), ...faqLd(c.faqs)],
    noscript: `<p>${link("/#work", "← Work")}</p><h1>${esc(c.title)}</h1><p><em>${esc(c.standfirst)}</em></p>${c.metric ? `<p>${esc(c.metric)}</p>` : ""}${(c.results || []).map((r) => `<p><strong>${esc(r.value)}</strong> ${esc(r.label)}</p>`).join("")}${blocksHtml(c.body)}`,
  }));
}

// ---- Draft previews (/preview?token=…): one page, never indexed; the editor in the portal frames it.
write("preview.html", page({ path: "/preview", title: "Draft preview | Bluetrain Africa", description: "Draft preview.", noindex: true }));

// ---- Discovery-call booking (served at /book; people and times load from the Bluetrain Portal)
write("book.html", page({
  path: "/book",
  title: `${en.ui.book.title} | Bluetrain Africa`,
  description: en.ui.book.intro,
  noscript: `<h1>${esc(en.ui.book.title)}</h1><p>${esc(en.ui.book.closedBody)}</p><p>${link(`mailto:${config.email}?subject=Discovery%20call`, config.email)}</p>`,
}));

// ---- Privacy Policy and Terms of Use (English is the binding version; the app adds Kiswahili)
const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g, (_, txt, href) => `<a href="${href.startsWith("#/") ? href.slice(1) : href}" style="color:#8fb8ff">${txt}</a>`);
for (const doc of ["privacy", "terms"]) {
  const d = legal.en[doc];
  const body = d.sections.map((s, i) => `<h2>${i + 1}. ${esc(s.h)}</h2>` + s.body.map((b) =>
    b.h ? `<h3>${esc(b.h)}</h3>` : b.list ? `<ul>${b.list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>` : `<p>${inline(b.p)}</p>`).join("")).join("");
  write(`${doc}.html`, page({
    path: `/${doc}`,
    title: `${d.title} | Bluetrain Africa`,
    description: d.description,
    noscript: `<h1>${esc(d.title)}</h1><p>Effective ${d.effective}</p>${d.intro.map((p) => `<p>${inline(p)}</p>`).join("")}${body}`,
  }));
}

// ---- 404 (Cloudflare serves this for any unknown path; the app shows its not-found view)
write("404.html", page({ path: "/404", title: "Page not found | Bluetrain Africa", description: "This page has moved or no longer exists.", noindex: true }));

// ---- sitemap + robots
const urls = [
  { loc: "/", lastmod: today, priority: "1.0" },
  { loc: "/informed", lastmod: sorted[0]?.date ?? today, priority: "0.8" },
  { loc: "/book", lastmod: today, priority: "0.7" },
  { loc: "/privacy", lastmod: legal.en.privacy.effective, priority: "0.3" },
  { loc: "/terms", lastmod: legal.en.terms.effective, priority: "0.3" },
  ...sorted.filter((p) => !p.seo?.noindex && !p.seo?.canonical).map((p) => ({ loc: `/informed/${p.slug}`, lastmod: p.updated && p.updated > p.date ? p.updated : p.date, priority: "0.6" })),
  ...casePages.filter((c) => !c.seo?.noindex && !c.seo?.canonical).map((c) => ({ loc: `/work/${c.slug}`, lastmod: c.updated || c.date, priority: "0.6" })),
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /preview\n\nSitemap: ${SITE}/sitemap.xml\n`);

// ---- llms.txt: a plain index of the site for AI answer engines (https://llmstxt.org), rebuilt with every publish
const line = (title, path, text) => `- [${title}](${SITE}${path})${text ? `: ${String(text).replace(/\s+/g, " ").trim()}` : ""}`;
write("llms.txt", [
  "# Bluetrain Africa",
  "",
  `> ${en.hero.body}`,
  "",
  `Bluetrain Africa (legal name Bluetrain Limited) is based in Dar es Salaam and works across Tanzania, Kenya, South Africa and Zambia. Contact: ${config.email}.`,
  "",
  "## Services",
  ...en.services.items.map((x) => `- ${x.title}: ${x.body}`),
  "",
  "## Bluetrain Informed",
  ...sorted.filter((p) => !p.seo?.noindex).map((p) => line(p.title, `/informed/${p.slug}`, p.answer || p.standfirst)),
  "",
  "## Case studies",
  ...caseStudies.map((c) => line(c.title, hasPage(c) ? `/work/${c.slug}` : "/#work", [c.client?.name, c.metric, c.standfirst].filter(Boolean).join(". "))),
  "",
  "## Optional",
  line("Book a discovery call", "/book", "30 minutes with the team"),
  line("Privacy Policy", "/privacy"),
  line("Terms of Use", "/terms"),
  "",
].join("\n"));

// ---- What content this build carries: the portal reads it to mark published items "Live".
write("content-version.json", JSON.stringify({ version: contentVersion, builtAt: new Date().toISOString(), articles: posts.length, caseStudies: caseStudies.length }) + "\n");

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
// Address changes made in the portal after an item was published (old → new), skipping any that would loop.
const portalRedirects = contentRedirects.filter((r) => r.from !== r.to && !redirects.some(([a]) => a === r.from)).map((r) => [r.from, r.to]);
write("_redirects", [
  "# Old Wix addresses → new site (301 permanent). Static rules first, wildcards last.",
  ...redirects.map(([a, b]) => `${a}  ${b}  301`),
  "# Address changes made in the Bluetrain Portal",
  ...portalRedirects.map(([a, b]) => `${a}  ${b}  301`),
  ...dynamic.map(([a, b]) => `${a}  ${b}  301`),
  "",
].join("\n"));

// ---- Headers: long cache for fingerprinted assets, sensible security defaults everywhere
write("_headers", `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/content-version.json
  Cache-Control: no-store

/llms.txt
  Content-Type: text/plain; charset=utf-8

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000

/preview
  ! X-Frame-Options
  Content-Security-Policy: frame-ancestors 'self' https://portal.bluetrain.africa
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store
`);

console.log(`postbuild: ${posts.length + casePages.length + 5} pages, ${redirects.length + portalRedirects.length + dynamic.length} redirects, sitemap ${urls.length} URLs, llms.txt, content version ${contentVersion}`);
