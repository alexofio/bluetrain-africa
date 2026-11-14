/** Splits text into word spans with an index (--i) for staggered scroll animations. */
export default function Words({ text, className, start = 0 }) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((w, i) => (
    <span key={i}>
      <span className={`${className} inline-block`} style={{ "--i": start + i }}>{w}</span>
      {i < words.length - 1 ? " " : ""}
    </span>
  ));
}
