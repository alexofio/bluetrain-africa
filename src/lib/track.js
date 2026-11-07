// Analytics events. With Google Tag Manager (config.gtmId) events go to the dataLayer, where tags in the
// container pick them up by name; with a bare GA4 ID (config.ga4Id) they go through gtag.
import { config } from "../content/site.js";

export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  if (config.gtmId) {
    (window.dataLayer = window.dataLayer || []).push({ event, ...params });
  } else if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
