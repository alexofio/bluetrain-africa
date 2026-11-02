/**
 * Site text from the Bluetrain Portal (Website Content → Site text), applied by path over the built-in copy
 * in site.js / sw.js, e.g. "hero.body" or "services.items.2.title". Only existing plain-text values can be
 * replaced: links, ids, icons and functions are never touched, and legal pages are a separate module.
 */
const NOT_TEXT = new Set(["href", "id", "icon", "slug", "url", "email", "phone", "tel", "src", "image", "logo", "art", "key"]);

export function getPath(obj, path) {
  return String(path).split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Sets one path if it already holds a string. Returns true when it was applied. */
export function setPath(obj, path, value) {
  const keys = String(path).split(".");
  if (keys[0] === "legal" || NOT_TEXT.has(keys.at(-1)) || typeof value !== "string") return false;
  const parent = keys.slice(0, -1).reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const last = keys.at(-1);
  if (!parent || typeof parent[last] !== "string") return false;
  parent[last] = value;
  return true;
}

export function applyText(obj, map) {
  let n = 0;
  for (const [path, value] of Object.entries(map || {})) if (setPath(obj, path, value)) n++;
  return n;
}

/** Deep copy that keeps functions (some copy is a function of a number). */
export function cloneText(v) {
  if (Array.isArray(v)) return v.map(cloneText);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cloneText(x)]));
  return v;
}
