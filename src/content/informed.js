/**
 * Bluetrain Informed — taxonomy and helpers.
 *
 * Article content is NOT in this file: each article is a Markdown file in content/informed/,
 * written in the editor at /admin (Sveltia CMS) or by hand. See scripts/content.mjs for the fields.
 * Categories, markets and formats below must match the options in public/admin/config.yml.
 */

export const categories = [
  { id: "strategy", en: "Strategy", sw: "Mkakati" },
  { id: "performance", en: "Performance & Media", sw: "Utendaji na Matangazo" },
  { id: "insights", en: "Insights & Listening", sw: "Maarifa na Usikilizaji" },
  { id: "influence", en: "Influence & Social", sw: "Ushawishi" },
  { id: "experiences", en: "Experiences", sw: "Matukio" },
  { id: "technology", en: "Technology", sw: "Teknolojia" },
  { id: "news", en: "Bluetrain News", sw: "Habari za Bluetrain" },
];

export const markets = [
  { id: "TZ", en: "Tanzania", sw: "Tanzania" },
  { id: "KE", en: "Kenya", sw: "Kenya" },
  { id: "ZA", en: "South Africa", sw: "Afrika Kusini" },
  { id: "ZM", en: "Zambia", sw: "Zambia" },
  { id: "AF", en: "Pan-Africa", sw: "Afrika Nzima" },
];

export const formats = {
  article: { en: "Article", sw: "Makala" },
  brief: { en: "Market Brief", sw: "Muhtasari wa Soko" },
  news: { en: "News", sw: "Habari" },
};

// Articles live in content/informed/*.md (edited at bluetrain.africa/admin).
// scripts/content.mjs turns them into this generated module before every dev run and build.
import generated from "./informed.posts.generated.js";
export const posts = generated;

/** Localised field helper: post.sw.title when Swahili exists, otherwise English. */
export const loc = (post, lang, key) => (lang === "sw" && post.sw?.[key]) || post[key];
