/**
 * Clients and case studies — published from the Bluetrain Portal (Website Content).
 * scripts/content.mjs writes cms.generated.js before every dev run and build.
 */
import { clients as rawClients, industries, caseStudies as rawCases, version } from "./cms.generated.js";

export { version };
export const clients = rawClients.map((c) => ({ ...c, sector: c.sector || "" }));
export const caseStudies = rawCases;

/** Industry label in the visitor's language ("telco" → "Telecommunications" / "Mawasiliano ya simu"). */
export const industryLabel = (id, lang) => {
  const x = industries.find((i) => i.id === id);
  return x ? (lang === "sw" && x.sw) || x.en : "";
};

/** A case study opens its own page when it has more than the card shows. */
export const hasPage = (c) => (c.body?.length || 0) > 0 || (c.results?.length || 0) > 0 || (c.gallery?.length || 0) > 0 || !!c.quote;

/** Localised case-study field: sw.title / sw.standfirst, or the *Sw twin fields (metricSw, industrySw). */
export const cloc = (c, lang, key) => (lang === "sw" && (c.sw?.[key] || c[`${key}Sw`])) || c[key];
