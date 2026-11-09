// Analytics events. IDs come from src/content/tags.js (the portal's Google tags, or site.js).
import { tags } from "../content/tags.js";

export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  // Tag Manager: tags in the container pick events up by name from the dataLayer.
  if (tags.gtmId) (window.dataLayer = window.dataLayer || []).push({ event, ...params });
  // GA4 loaded directly (with or without Tag Manager): send through gtag.
  if (tags.ga4Id && typeof window.gtag === "function") window.gtag("event", event === "virtual_page_view" ? "page_view" : event, params);
  // Bluetrain Audiences (does nothing until the visitor accepts its banner).
  if (typeof window.bt === "function") {
    if (event === "page_view" || event === "virtual_page_view") window.bt("page");
    else window.bt("event", event, params.method ? { service: params.method.replace(/_/g, "-") } : undefined);
  }
}

// After a form is sent: links the visit to the email the person typed (hashed in the browser, consent only).
export function identify({ email, phone } = {}) {
  if (typeof window !== "undefined" && typeof window.bt === "function" && (email || phone)) window.bt("identify", { email, phone });
}
