import { useEffect, useState } from "react";
import { config } from "../content/site";
import { useLang } from "../lib/i18n";
import InformedPost from "./informed/InformedPost";
import CaseStudy from "./CaseStudy";

/**
 * /preview?token=… — one draft from the Bluetrain Portal, rendered with the real page components.
 * The token is a private 7-day link for one item; the page is noindex. `lang=sw|en` picks the language
 * (the portal editor's EN/SW switch). Nothing here is cached or listed anywhere on the site.
 */
export default function Preview({ token, lang: want }) {
  const { t, setLang } = useLang();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    if (want === "sw" || want === "en") setLang(want);
    const meta = document.createElement("meta");
    meta.name = "robots"; meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [want]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!token) return setState({ error: t.ui.preview.error });
    fetch(`${config.portalApi}/content/preview?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || t.ui.preview.error); return j; })
      .then((j) => setState({ data: j }))
      .catch((e) => setState({ error: e.message }));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = t.ui.preview;
  return (
    <>
      <div role="status" className="fixed inset-x-0 bottom-0 z-[70] bg-amber px-4 py-2.5 text-center font-display text-sm font-semibold text-navy">{p.banner}</div>
      {state.loading && <p className="container-site pb-32 pt-40 text-silver/80">{p.loading}</p>}
      {state.error && <p className="container-site pb-32 pt-40 text-lg text-silver/80">{state.error}</p>}
      {state.data && (state.data.type === "case_study" ? <CaseStudy draft={state.data.item} /> : <InformedPost draft={state.data.item} />)}
    </>
  );
}
