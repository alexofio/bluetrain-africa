/**
 * Bluetrain Informed — content loader.
 *
 * Reads every article in content/informed/*.md (written by the editor at /admin, or by hand),
 * checks it, and writes src/content/informed.posts.generated.js, which the site and postbuild import.
 * Runs automatically before `npm run dev` and `npm run build`.
 *
 * File = <slug>.md. Front matter holds the fields; the Markdown below it is the English body.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = new URL("../", import.meta.url).pathname;
const DIR = ROOT + "content/informed/";
const OUT = ROOT + "src/content/informed.posts.generated.js";

const CATEGORIES = ["strategy", "performance", "insights", "influence", "experiences", "technology", "news"];
const MARKETS = ["TZ", "KE", "ZA", "ZM", "AF"];
const FORMATS = ["article", "brief", "news"];

marked.use({ gfm: true, breaks: false });

// Inline Markdown (bold, italics, links) → HTML. External links open in a new tab.
const inline = (s) =>
  marked
    .parseInline(String(s ?? "").trim())
    .replace(/<a href="(https?:\/\/(?!bluetrain\.africa)[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');

const plain = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** Markdown body → the block list the article page renders: { h } | { html } | { list } | { quote, by } | { img, alt, caption } */
function toBlocks(md) {
  const blocks = [];
  for (const t of marked.lexer(md || "")) {
    if (t.type === "heading") blocks.push({ h: plain(marked.parseInline(t.text)) });
    else if (t.type === "list") blocks.push({ list: t.items.map((i) => inline(i.text)), ordered: !!t.ordered });
    else if (t.type === "blockquote") {
      const paras = t.text.split(/\n\s*\n/).map((x) => x.replace(/^>\s?/gm, "").trim()).filter(Boolean);
      const last = paras.at(-1);
      const by = paras.length > 1 && /^[—–-]\s*/.test(last) ? last.replace(/^[—–-]\s*/, "") : "";
      blocks.push({ quote: inline((by ? paras.slice(0, -1) : paras).join(" ")), by: by ? plain(inline(by)) : undefined });
    } else if (t.type === "paragraph") {
      // A paragraph that is only an image becomes a full-width figure; the image title becomes its caption.
      const only = t.tokens?.length === 1 && t.tokens[0].type === "image" ? t.tokens[0] : null;
      if (only) blocks.push({ img: only.href, alt: only.text || "", caption: only.title || "" });
      else blocks.push({ html: inline(t.text) });
    } else if (t.type === "hr" || t.type === "space") continue;
    else if (t.raw.trim()) blocks.push({ html: inline(t.raw) });
  }
  return blocks;
}

const words = (s) => String(s || "").replace(/[#>*_\-[\]()!`]/g, " ").split(/\s+/).filter(Boolean).length;
const list = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : []);
const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d || "").slice(0, 10));

const errors = [];
const posts = [];
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md")).sort()) {
  const slug = file.replace(/\.md$/, "");
  const { data: d, content } = matter(readFileSync(DIR + file, "utf8"));
  const fail = (m) => errors.push(`${file}: ${m}`);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("file name must be lowercase words joined by hyphens");
  if (!d.title) fail("missing title");
  if (!d.standfirst) fail("missing summary (standfirst)");
  const date = isoDate(d.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("missing or invalid date");
  if (!CATEGORIES.includes(d.category)) fail(`category must be one of ${CATEGORIES.join(", ")}`);
  const format = d.format || "article";
  if (!FORMATS.includes(format)) fail(`format must be one of ${FORMATS.join(", ")}`);
  const markets = list(d.markets).filter((m) => MARKETS.includes(m));
  if (d.draft) continue; // drafts are kept in the repo but not published

  const swBody = String(d.sw_body || "").trim();
  posts.push({
    slug,
    date,
    readTime: Number(d.read_time) || Math.max(1, Math.round((words(content) + words(d.standfirst)) / 200)), // minutes; blank = from word count
    category: d.category,
    markets: markets.length ? markets : ["AF"],
    format,
    featured: !!d.featured,
    author: { name: d.author || "Bluetrain Informed", role: d.author_role || "" },
    cover: Number(d.cover_art) || ([...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 12) + 1,
    coverImage: d.cover_image || "",
    coverAlt: d.cover_alt || "",
    title: String(d.title || ""),
    standfirst: String(d.standfirst || ""),
    takeaways: list(d.takeaways),
    body: toBlocks(content),
    sw: {
      title: d.sw_title || undefined,
      standfirst: d.sw_standfirst || undefined,
      takeaways: list(d.sw_takeaways).length ? list(d.sw_takeaways) : undefined,
      body: swBody ? toBlocks(swBody) : undefined,
    },
  });
}

if (errors.length) {
  console.error("\nBluetrain Informed — fix these before publishing:\n  " + errors.join("\n  ") + "\n");
  process.exit(1);
}

posts.sort((a, b) => b.date.localeCompare(a.date));
writeFileSync(OUT, `// GENERATED by scripts/content.mjs from content/informed/*.md — do not edit by hand.\nexport default ${JSON.stringify(posts, null, 1)};\n`);
console.log(`content: ${posts.length} Informed articles`);
