import { useLang } from "../../lib/i18n";
import { to } from "../../lib/router";

/** One-line notice under forms that collect personal data. */
export default function PrivacyNotice({ className = "" }) {
  const n = useLang().t.ui.privacyNotice;
  return (
    <p className={`text-xs text-steel ${className}`}>
      {n.before}{" "}
      <a href={to("#/privacy")} className="underline underline-offset-2 hover:text-white">{n.link}</a>
      {n.after}
    </p>
  );
}
