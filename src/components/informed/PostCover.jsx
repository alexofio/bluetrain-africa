/**
 * Generated cover art for a post — brand-coloured, unique per post, no stock imagery.
 * Three motifs echo the identity: logomark arcs, a signal grid, and contour waves.
 */
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

const tints = {
  strategy: ["#2e619c", "#2e8eff"],
  performance: ["#2e619c", "#167D8D"],
  insights: ["#167D8D", "#2e8eff"],
  influence: ["#2e619c", "#F2B544"],
  experiences: ["#F2B544", "#2e619c"],
  technology: ["#2e8eff", "#167D8D"],
  news: ["#2e8eff", "#F2B544"],
};

export default function PostCover({ seed = 1, category = "strategy", className = "", image = "", alt = "" }) {
  // A cover photo uploaded in the editor replaces the generated art.
  if (image) return <img src={image} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  const r = rng(seed);
  const [a, b] = tints[category] || tints.strategy;
  const motif = seed % 3;
  const id = `pc-${seed}-${category}`;
  const cx = 120 + r() * 360, cy = 90 + r() * 200;
  return (
    <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${id}-g1`} cx={cx / 600} cy={cy / 380} r="0.7">
          <stop offset="0" stopColor={a} stopOpacity="0.85" />
          <stop offset="1" stopColor="#0c2236" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-g2`} cx={1 - cx / 600} cy={1 - cy / 380} r="0.6">
          <stop offset="0" stopColor={b} stopOpacity="0.55" />
          <stop offset="1" stopColor="#0c2236" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="380" fill="#0c2236" />
      <rect width="600" height="380" fill={`url(#${id}-g1)`} />
      <rect width="600" height="380" fill={`url(#${id}-g2)`} />
      {motif === 0 &&
        [40, 80, 120, 160, 200, 240].map((rad, i) => (
          <g key={rad} fill="none" stroke="#fff" strokeOpacity={0.5 - i * 0.07} strokeWidth={i === 0 ? 6 : 2}>
            <path d={`M ${cx - rad * Math.sin(0.5)} ${cy - rad * Math.cos(0.5)} A ${rad} ${rad} 0 0 1 ${cx + rad * Math.sin(0.5)} ${cy - rad * Math.cos(0.5)}`} />
            <path d={`M ${cx - rad * Math.sin(0.8)} ${cy + rad * Math.cos(0.8)} A ${rad} ${rad} 0 0 0 ${cx + rad * Math.sin(0.8)} ${cy + rad * Math.cos(0.8)}`} />
          </g>
        ))}
      {motif === 1 &&
        Array.from({ length: 15 * 10 }).map((_, i) => {
          const x = (i % 15) * 40 + 20, y = Math.floor(i / 15) * 40 + 10;
          const d = Math.hypot(x - cx, y - cy);
          const on = d < 120 && r() > 0.3;
          return <circle key={i} cx={x} cy={y} r={on ? 3.2 : 1.6} fill={on ? "#fff" : b} opacity={on ? 0.9 : 0.35} />;
        })}
      {motif === 2 &&
        Array.from({ length: 11 }).map((_, i) => {
          const y0 = 40 + i * 32, amp = 18 + r() * 26, ph = r() * 6;
          let d = `M0 ${y0}`;
          for (let x = 0; x <= 600; x += 20) d += ` L${x} ${y0 + Math.sin(x / 70 + ph) * amp * Math.exp(-((x - cx) ** 2) / 60000)}`;
          return <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? "#fff" : b} strokeOpacity={i % 3 === 0 ? 0.55 : 0.4} strokeWidth="1.6" />;
        })}
    </svg>
  );
}
