// Google tags for every page: from the Bluetrain Portal (Admin → Settings → Google tags) when set there,
// otherwise the IDs in site.js. Either ID may be empty; both empty = no tracking script.
import { config } from "./site.js";
import { tags as fromPortal } from "./cms.generated.js";

const GA4 = /^G-[A-Z0-9]{4,20}$/, GTM = /^GTM-[A-Z0-9]{4,12}$/;
const src = fromPortal ?? { ga4Id: config.ga4Id, gtmId: config.gtmId };
export const tags = { ga4Id: GA4.test(src.ga4Id || "") ? src.ga4Id : "", gtmId: GTM.test(src.gtmId || "") ? src.gtmId : "" };
