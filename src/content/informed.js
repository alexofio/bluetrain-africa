/**
 * Bluetrain Informed — taxonomy and helpers.
 *
 * Article content is NOT in this file: articles are written, approved and published in the Bluetrain Portal
 * (Website Content). scripts/content.mjs fetches the published ones before every build.
 * Categories, markets and formats below must match the portal's (public/assets/content/model.js there).
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

// One format per template in the portal: What happened (News), Why it matters (Analysis), What should we do next (Guide).
export const formats = {
  news: { en: "News", sw: "Habari" },
  analysis: { en: "Analysis", sw: "Uchambuzi" },
  guide: { en: "Guide", sw: "Mwongozo" },
};

// Published articles come from the Bluetrain Portal; scripts/content.mjs writes this module before every dev run and build.
import generated from "./informed.posts.generated.js";
export const posts = generated;

/** Localised field helper: post.sw.title when Swahili exists, otherwise English. */
export const loc = (post, lang, key) => (lang === "sw" && post.sw?.[key]) || post[key];
