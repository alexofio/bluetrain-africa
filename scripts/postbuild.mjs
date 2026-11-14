/**
 * Runs after `vite build`. Turns dist/ into a Cloudflare-ready site (Worker static assets):
 *  - one HTML file per page (own title, description, canonical, share tags, structured data)
 *  - 404.html, sitemap.xml, robots.txt
 *  - _redirects (old Wix URLs → new pages, plus address changes made in the portal) and _headers (caching + security)
 *  - llms.txt + llms-full.txt (indexes for AI answer engines) and content-version.json (tells the portal which content is live)
 *  - the /work hub (every case study), the IndexNow key file, search-console verification tags
 * Titles, organisation details, robots.txt rules for AI crawlers and the llms.txt intro come from the portal
 * (Website Content → SEO & AI); without them the built-in defaults below are used.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { config, en } from "../src/content/site.js";
import { posts } from "../src/content/informed.js";
import { legal } from "../src/content/legal.js";
import { caseStudies, hasPage, version as contentVersion } from "../src/content/cms.js";
import * as generated from "../src/content/cms.generated.js";
// Google tags: from the portal (Admin → Settings → Google tags) when set there, else site.js.
import { tags } from "../src/content/tags.js";

const contentRedirects = generated.redirects || [];
const SEO = generated.seo || null; // null = portal settings not set (or an older portal)
const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE = config.siteUrl.replace(/\/$/, "");
const absUrl = (src) => (src ? (/^https?:/.test(src) ? src : SITE + src) : "");
const OG = absUrl(SEO?.shareImage) || `${SITE}/og-image.jpg`;
const SITE_NAME = SEO?.siteName || "Bluetrain Africa";
const SUFFIX = SEO?.titleSuffix ?? " | Bluetrain Africa";
/** Fixed page title/description: from the portal when set, else the built-in text. */
const pageMeta = (key, title, description) => ({ title: SEO?.pages?.[key]?.title || title, description: SEO?.pages?.[key]?.description || description || SEO?.defaultDescription || "", extraLd: SEO?.pages?.[key]?.jsonld || [] });
// Custom schema markup (JSON-LD) pasted in the portal: for every page (SEO & AI tab) and per item (its SEO tab).
const customLd = (x) => (Array.isArray(x?.seo?.jsonld) ? x.seo.jsonld : []);
const today = new Date().toISOString().slice(0, 10);
const template = readFileSync(DIST + "index.html", "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

const org = SEO?.org || {};
const COUNTRY = { TZ: "Tanzania", KE: "Kenya", ZA: "South Africa", ZM: "Zambia", UG: "Uganda", RW: "Rwanda", MZ: "Mozambique", MW: "Malawi", BW: "Botswana", NA: "Namibia", NG: "Nigeria", GH: "Ghana", ET: "Ethiopia", CD: "DR Congo" };
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: SITE_NAME,
  legalName: org.legalName || "Bluetrain Limited",
  url: SITE,
  logo: absUrl(org.logo) || OG,
  description: org.description || undefined,
  foundingDate: org.foundingDate || undefined,
  email: org.email || config.email,
  telephone: org.phone || undefined,
  sameAs: [...new Set([...config.socials.map((s) => s.href), ...(org.sameAs || [])])],
  knowsAbout: org.knowsAbout?.length ? org.knowsAbout : undefined,
  address: config.offices.map((o) => ({ "@type": "PostalAddress", name: o.entity, streetAddress: o.lines.join(", "), addressCountry: o.id })),
  areaServed: (org.areaServed?.length ? org.areaServed : ["TZ", "KE", "ZA", "ZM"]).map((c) => ({ "@type": "Country", name: COUNTRY[c] || c })),
};
const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE}/#website`, name: SITE_NAME, url: `${SITE}/`, publisher: { "@id": `${SITE}/#organization` }, inLanguage: ["en", "sw"] };
// Search-console verification codes (Website Content → SEO & AI): on the homepage only, which is all the tools check.
const VERIFY = { google: "google-site-verification", bing: "msvalidate.01", facebook: "facebook-domain-verification", yandex: "yandex-verification" };
const verifyTags = () => Object.entries(VERIFY).filter(([k]) => SEO?.verify?.[k]).filter(([k]) => !template.includes(`content="${SEO.verify[k]}"`)).map(([k, n]) => `<meta name="${n}" content="${esc(SEO.verify[k])}" />`);

function ga4() {
  if (!tags.ga4Id) return "";
  const id = esc(tags.ga4Id);
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${id}",{send_page_view:false});gtag("event","page_view");</script>`;
}

// Google Tag Manager: standard container snippet in <head> and the no-JavaScript iframe right after <body>.
function gtmHead() {
  if (!tags.gtmId) return "";
  const id = esc(tags.gtmId);
  return `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');</script>`;
}
function gtmBody() {
  if (!tags.gtmId) return "";
  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(tags.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
}

// Bluetrain Audiences: asks for consent with its own banner before it collects anything.
function audiences() {
  if (!/^https:\/\/portal\.bluetrain\.africa\/bt\/[a-z0-9]{16,40}\.js$/.test(config.audiencesTag || "")) return "";
  return `<script>window.bt=window.bt||function(){(bt.q=bt.q||[]).push(arguments)};</script>
    <script async src="${esc(config.audiencesTag)}"></script>`;
}

function page({ path, title, description, type = "website", image = OG, ld = [], noscript = "", noindex = false, canonical, extraHead = [], extraLd = [] }) {
  const url = canonical || SITE + (path === "/" ? "/" : path);
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    ...extraHead,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
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
    ...[...ld, ...extraLd, ...(Array.isArray(SEO?.jsonld) ? SEO.jsonld : [])].map(jsonld),
    gtmHead(), ga4(), audiences(),
  ].filter(Boolean).join("\n    ");
  return template
    .replace(/<body([^>]*)>/, (m) => m + gtmBody())
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${esc(description)}" />`)
    .replace("<!--route-meta-->", head)
    // Plain-HTML fallback for visitors and crawlers without JavaScript
    .replace("<!--route-noscript-->", noscript ? `<noscript><main style="max-width:44rem;margin:0 auto;padding:6rem 1.25rem;font-family:Inter,system-ui,sans-serif;color:#dbdbdb">${noscript}</main></noscript>` : "");
}

// Static pages copied from public/ (not built from the template) get the same Google tags.
function tagStatic(file) {
  if (!(tags.gtmId || tags.ga4Id) || !existsSync(DIST + file)) return;
  let html = readFileSync(DIST + file, "utf8");
  if (html.includes("googletagmanager.com/")) return;
  html = html.replace("</head>", `  ${gtmHead()}${ga4()}\n</head>`).replace(/<body([^>]*)>/, (m) => m + gtmBody());
  writeFileSync(DIST + file, html);
}

function write(file, html) {
  const full = DIST + file;
  mkdirSync(full.replace(/[^/]+$/, ""), { recursive: true });
  writeFileSync(full, html);
}

const link = (href, text) => `<a href="${esc(href)}" style="color:#2e8eff">${esc(text)}</a>`;
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

// ---- Home
const homeMeta = pageMeta("home", en.meta.title, en.hero.body);
write("index.html", page({
  path: "/",
  ...homeMeta,
  ld: [organization, website],
  extraHead: [...verifyTags(), `<link rel="alternate" type="text/plain" title="llms.txt" href="${SITE}/llms.txt" />`],
  noscript: `<h1>${esc(en.hero.headline.join(" "))}</h1><p>${esc(en.hero.body)}</p>
    <h2>${esc(en.services.heading)}</h2><ul>${en.services.items.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.body)}</li>`).join("")}</ul>
    <p>${link("/work", "Case studies")} · ${link("/informed", "Bluetrain Informed")} · ${link(`mailto:${config.email}`, config.email)}</p>`,
}));

// ---- Blog index (served at /informed)
write("informed.html", page({
  path: "/informed",
  ...pageMeta("informed", "Bluetrain Informed | Market notes and campaign lessons from Africa", en.ui.informed.intro),
  ld: [{ "@context": "https://schema.org", "@type": "Blog", name: "Bluetrain Informed", url: `${SITE}/informed`, publisher: { "@type": "Organization", name: "Bluetrain Africa" } }],
  noscript: `<h1>Bluetrain Informed</h1><p>${esc(en.ui.informed.intro)}</p><ul>${sorted.map((p) => `<li>${link(`/informed/${p.slug}`, p.title)}</li>`).join("")}</ul>`,
}));

// ---- Articles (served at /informed/<slug>)
const abs = absUrl;
// Structured-data type: set per item in the portal (SEO tab), else News → NewsArticle and everything else → Article.
const schemaType = (x) => x.seo?.schema || (x.format === "news" ? "NewsArticle" : "Article");
const modified = (x) => [x.reviewed, x.updated, x.date].filter(Boolean).sort().at(-1);
const citations = (x) => (x.sources?.length ? x.sources.map((c) => ({ "@type": "CreativeWork", name: c.title, url: c.url })) : undefined);
const keywords = (x) => [x.seo?.focus, ...(x.seo?.keywords || [])].filter(Boolean).join(", ") || undefined;
const sourcesHtml = (x) => (x.sources?.length ? `<h2>Sources</h2><ol>${x.sources.map((c) => `<li>${link(c.url, c.title)}</li>`).join("")}</ol>` : "");
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
    extraHead: [`<meta property="article:published_time" content="${p.date}" />`, `<meta property="article:modified_time" content="${modified(p)}" />`],
    description: p.metaDescription || p.standfirst,
    image,
    canonical: p.seo?.canonical,
    noindex: !!p.seo?.noindex,
    ld: [{
      "@context": "https://schema.org",
      "@type": schemaType(p),
      headline: p.title,
      description: p.standfirst,
      abstract: p.aiSummary || p.answer || undefined,
      datePublished: p.date,
      dateModified: modified(p),
      author: isEditorial(p.author) ? { "@type": "Organization", name: SITE_NAME, url: SITE } : { "@type": "Person", name: p.author.name, jobTitle: p.author.role || undefined, worksFor: { "@id": `${SITE}/#organization` } },
      publisher,
      isPartOf: { "@id": `${SITE}/#website` },
      citation: citations(p),
      articleSection: p.category || undefined,
      image,
      mainEntityOfPage: url,
      inLanguage: "en",
      keywords: keywords(p),
      mentions: p.entities?.length ? p.entities.map((name) => ({ "@type": "Thing", name })) : undefined,
    }, crumbs([["Home", "/"], ["Bluetrain Informed", "/informed"], [p.title, `/informed/${p.slug}`]]), ...faqLd(p.faqs), ...customLd(p)],
    noscript: `<p>${link("/informed", "← Bluetrain Informed")}</p><h1>${esc(p.title)}</h1><p><em>${esc(p.standfirst)}</em></p>${p.answer ? `<p><strong>${esc(p.answer)}</strong></p>` : ""}${blocksHtml(p.body)}${sourcesHtml(p)}`,
  }));
}

// ---- Case studies with a page of their own (served at /work/<slug>)
const casePages = caseStudies.filter(hasPage);
for (const c of casePages) {
  const image = abs(c.seo?.shareImage || c.coverImage) || OG;
  write(`work/${c.slug}.html`, page({
    path: `/work/${c.slug}`,
    type: "article",
    title: c.metaTitle || `${c.title}${SUFFIX}`,
    description: c.metaDescription || c.standfirst,
    image,
    canonical: c.seo?.canonical,
    noindex: !!c.seo?.noindex,
    ld: [{
      "@context": "https://schema.org",
      "@type": c.seo?.schema || "Article",
      headline: c.title,
      description: c.standfirst,
      abstract: c.aiSummary || c.answer || undefined,
      datePublished: c.date,
      dateModified: modified(c),
      author: { "@type": "Organization", name: SITE_NAME, url: SITE },
      publisher,
      isPartOf: { "@id": `${SITE}/#website` },
      citation: citations(c),
      keywords: keywords(c),
      image,
      mainEntityOfPage: `${SITE}/work/${c.slug}`,
      inLanguage: "en",
      about: c.client ? { "@type": "Organization", name: c.client.name } : undefined,
      mentions: c.entities?.length ? c.entities.map((name) => ({ "@type": "Thing", name })) : undefined,
    }, crumbs([["Home", "/"], ["Case studies", "/work"], [c.title, `/work/${c.slug}`]]), ...faqLd(c.faqs), ...customLd(c)],
    noscript: `<p>${link("/work", "← All case studies")}</p><h1>${esc(c.title)}</h1><p><em>${esc(c.standfirst)}</em></p>${c.metric ? `<p>${esc(c.metric)}</p>` : ""}${(c.results || []).map((r) => `<p><strong>${esc(r.value)}</strong> ${esc(r.label)}</p>`).join("")}${blocksHtml(c.body)}${sourcesHtml(c)}`,
  }));
}

// ---- Case-studies hub (served at /work): every case study, with or without a page of its own
const caseHref = (c) => (hasPage(c) ? `/work/${c.slug}` : "/work");
const workMeta = pageMeta("work", `${en.work.hubTitle}${SUFFIX}`, en.work.hubIntro);
write("work.html", page({
  path: "/work",
  ...workMeta,
  ld: [{
    "@context": "https://schema.org", "@type": "CollectionPage", name: en.work.hubTitle, url: `${SITE}/work`, description: workMeta.description,
    isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#organization` },
    mainEntity: { "@type": "ItemList", itemListElement: caseStudies.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: SITE + caseHref(c) })) },
  }, crumbs([["Home", "/"], ["Case studies", "/work"]])],
  noscript: `<h1>${esc(en.work.hubTitle)}</h1><p>${esc(en.work.hubIntro)}</p><ul>${caseStudies.map((c) => `<li>${hasPage(c) ? link(`/work/${c.slug}`, c.title) : `<strong>${esc(c.title)}</strong>`}${c.client ? ` (${esc(c.client.name)})` : ""}: ${esc(c.standfirst || "")}${c.metric ? ` ${esc(c.metric)}.` : ""}</li>`).join("")}</ul>`,
}));

// ---- Draft previews (/preview?token=…): one page, never indexed; the editor in the portal frames it.
write("preview.html", page({ path: "/preview", title: "Draft preview | Bluetrain Africa", description: "Draft preview.", noindex: true }));

// ---- Discovery-call booking (served at /book; people and times load from the Bluetrain Portal)
write("book.html", page({
  path: "/book",
  ...pageMeta("book", `${en.ui.book.title}${SUFFIX}`, en.ui.book.intro),
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
tagStatic("company-profile/index.html");

// ---- sitemap + robots
const urls = [
  { loc: "/", lastmod: today, priority: "1.0" },
  { loc: "/informed", lastmod: sorted[0]?.date ?? today, priority: "0.8" },
  { loc: "/work", lastmod: caseStudies.map(modified).filter(Boolean).sort().at(-1) || today, priority: "0.8" },
  { loc: "/book", lastmod: today, priority: "0.7" },
  { loc: "/company-profile/", lastmod: today, priority: "0.6" },
  { loc: "/privacy", lastmod: legal.en.privacy.effective, priority: "0.3" },
  { loc: "/terms", lastmod: legal.en.terms.effective, priority: "0.3" },
  ...sorted.filter((p) => !p.seo?.noindex && !p.seo?.canonical).map((p) => ({ loc: `/informed/${p.slug}`, lastmod: modified(p), priority: "0.6" })),
  ...casePages.filter((c) => !c.seo?.noindex && !c.seo?.canonical).map((c) => ({ loc: `/work/${c.slug}`, lastmod: modified(c), priority: "0.6" })),
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);
// robots.txt: built by the portal from Website Content → SEO & AI (which AI crawlers may read the site).
// Without portal settings: everyone allowed, and the main AI crawlers named explicitly so a blanket rule elsewhere can't shut them out.
const AI_DEFAULT = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Applebot-Extended"];
write("robots.txt", SEO?.robots || [
  "User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /preview", "",
  "# AI crawlers: allowed", ...AI_DEFAULT.map((b) => `User-agent: ${b}`), "Allow: /", "Disallow: /admin/", "Disallow: /preview", "",
  `Sitemap: ${SITE}/sitemap.xml`, "",
].join("\n"));

// IndexNow key file (tells Bing, Yandex and others the portal's change notices are really from this site)
if (SEO?.indexnow?.on && /^[a-f0-9]{32}$/.test(SEO.indexnow.key || "")) write(`${SEO.indexnow.key}.txt`, SEO.indexnow.key);

// ---- llms.txt: a plain index of the site for AI answer engines (https://llmstxt.org), rebuilt with every publish.
// Intro and "about" come from the portal (Website Content → SEO & AI); items can be left out there (SEO tab).
const one = (t) => String(t || "").replace(/\s+/g, " ").trim();
const line = (title, path, text) => `- [${title}](${SITE}${path})${text ? `: ${one(text)}` : ""}`;
const inLlms = (x) => x.seo?.llms !== false && !x.seo?.noindex;
const aiLine = (x) => x.aiSummary || x.answer || x.standfirst;
const fullOn = SEO?.llms?.full !== false;
write("llms.txt", [
  `# ${SITE_NAME}`,
  "",
  `> ${one(SEO?.llms?.summary || en.hero.body)}`,
  "",
  one(SEO?.llms?.about) || `${SITE_NAME} (legal name ${org.legalName || "Bluetrain Limited"}) is based in Dar es Salaam and works across Tanzania, Kenya, South Africa and Zambia. Contact: ${org.email || config.email}.`,
  ...(org.knowsAbout?.length ? ["", `Expertise: ${org.knowsAbout.join(", ")}.`] : []),
  "",
  "## Services",
  ...en.services.items.map((x) => `- ${x.title}: ${x.body}`),
  "",
  "## Case studies",
  line(en.work.hubTitle, "/work", `All ${caseStudies.length} case studies. ${en.work.hubIntro}`),
  ...caseStudies.filter(inLlms).map((c) => line(c.title, caseHref(c), [c.client?.name, c.metric, aiLine(c)].filter(Boolean).join(". "))),
  "",
  "## Bluetrain Informed",
  line("Bluetrain Informed", "/informed", en.ui.informed.intro),
  ...sorted.filter(inLlms).map((p) => line(p.title, `/informed/${p.slug}`, aiLine(p))),
  "",
  "## Optional",
  ...(fullOn ? [line("Full text of every article and case study", "/llms-full.txt")] : []),
  line("This index", "/llms.txt"),
  line("Book a discovery call", "/book", "30 minutes with the team"),
  line("Company profile", "/company-profile/"),
  line("Privacy Policy", "/privacy"),
  line("Terms of Use", "/terms"),
  "",
].join("\n"));

// ---- llms-full.txt: the full text of every article and case study, as plain Markdown, for AI engines to read in one go.
const md = (h) => strip(String(h).replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, t) => `[${t}](${href.startsWith("/") ? SITE + href : href})`).replace(/<br\s*\/?>/g, "\n").replace(/<\/?(strong|b)>/g, "**").replace(/<\/?(em|i)>/g, "_"));
const mdBlocks = (body) => (body || []).map((b) =>
  b.h ? `## ${b.h}` : b.h3 ? `### ${b.h3}` : b.html ? md(b.html) : b.quote ? `> ${md(b.quote)}${b.by ? ` — ${b.by}` : ""}` : b.callout ? `> ${md(b.callout)}`
  : b.list ? b.list.map((li, i) => `${b.ordered ? `${i + 1}.` : "-"} ${md(li)}`).join("\n")
  : b.table ? [b.table.head, ...b.table.rows].filter(Boolean).map((r, i) => `| ${r.map(md).join(" | ")} |${i === 0 && b.table.head ? `\n|${r.map(() => " --- |").join("")}` : ""}`).join("\n")
  : b.faq ? b.faq.map((f) => `**${f.q}**\n${md(f.a)}`).join("\n\n") : b.img ? (b.alt ? `[Image: ${b.alt}]` : "") : b.embed ? `[${b.embed.title || b.embed.provider}](${b.embed.src})` : "").filter(Boolean).join("\n\n");
const mdSources = (x) => (x.sources?.length ? `\n\n### Sources\n${x.sources.map((c) => `- [${c.title}](${c.url})`).join("\n")}` : "");
if (fullOn) write("llms-full.txt", [
  `# ${SITE_NAME}: full text`, "", `> ${one(SEO?.llms?.summary || en.hero.body)}`, "",
  `Index: ${SITE}/llms.txt`, "",
  "# Case studies", "",
  ...caseStudies.filter(inLlms).map((c) => [`## ${c.title}`, `URL: ${SITE}${caseHref(c)}`,
    [c.client && `Client: ${c.client.name}`, c.industry && `Industry: ${c.industry}`, c.period?.start && `Period: ${c.period.start}${c.period.end ? ` to ${c.period.end}` : ""}`, c.metric && `Headline: ${c.metric}`].filter(Boolean).join(" · "), "",
    one(c.standfirst), c.answer ? `\n${one(c.answer)}` : "",
    (c.results || []).length ? `\nResults:\n${c.results.map((r) => `- ${r.value} ${r.label}${r.source ? ` (source: ${r.source})` : ""}`).join("\n")}` : "",
    c.body?.length ? `\n${mdBlocks(c.body)}` : "", c.quote ? `\n> ${c.quote.text} — ${c.quote.name}${c.quote.title ? `, ${c.quote.title}` : ""}` : "", mdSources(c), ""].join("\n")),
  "# Bluetrain Informed", "",
  ...sorted.filter(inLlms).map((p) => [`## ${p.title}`, `URL: ${SITE}/informed/${p.slug}`,
    `Published ${p.date}${modified(p) !== p.date ? ` · updated ${modified(p)}` : ""}${isEditorial(p.author) ? "" : ` · by ${p.author.name}${p.author.role ? `, ${p.author.role}` : ""}`}`, "",
    one(p.standfirst), p.answer ? `\n${one(p.answer)}` : "", p.takeaways?.length ? `\nKey takeaways:\n${p.takeaways.map((t) => `- ${t}`).join("\n")}` : "",
    `\n${mdBlocks(p.body)}`, mdSources(p), ""].join("\n")),
].join("\n").replace(/\n{3,}/g, "\n\n"));

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

/llms-full.txt
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

console.log(`postbuild: ${posts.length + casePages.length + 6} pages, ${redirects.length + portalRedirects.length + dynamic.length} redirects, sitemap ${urls.length} URLs, llms.txt${fullOn ? " + llms-full.txt" : ""}, robots from ${SEO?.robots ? "portal" : "defaults"}, content version ${contentVersion}`);
