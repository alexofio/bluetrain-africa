/**
 * Brand-coloured art panels standing in for campaign photography.
 * Each is drawn from what the project actually was, not decoration.
 */
function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Castle Lite — rows of unique promotional codes; a few redeemed codes light up
function Codes() {
  const r = rand(7);
  const rows = 40, cols = 16;
  return (
    <svg viewBox="0 0 640 760" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="640" height="760" fill="#0c2236" />
      {Array.from({ length: rows * cols }).map((_, i) => {
        const x = (i % cols) * 42 + 8, y = Math.floor(i / cols) * 19 + 6;
        const lit = r() > 0.975;
        return <rect key={i} x={x} y={y} width={22 + r() * 12} height="7" rx="3.5" fill={lit ? "#F2B544" : "#2e619c"} opacity={lit ? 1 : 0.35 + r() * 0.4} />;
      })}
    </svg>
  );
}

// Vodacom — a crowd of participants, with winners picked out
function Crowd() {
  const r = rand(19);
  return (
    <svg viewBox="0 0 360 260" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="360" height="260" fill="#0c2236" />
      {Array.from({ length: 420 }).map((_, i) => {
        const a = r() * Math.PI * 2, d = Math.pow(r(), 0.6) * 150;
        const win = r() > 0.82;
        return <circle key={i} cx={180 + Math.cos(a) * d * 1.3} cy={130 + Math.sin(a) * d * 0.75} r={win ? 2.6 : 1.8} fill={win ? "#ffffff" : "#2e8eff"} opacity={win ? 0.95 : 0.45} />;
      })}
    </svg>
  );
}

// CPS Africa — Zanzibar reaching investors in Europe, the Middle East and North America
function Routes() {
  const origin = [236, 198];
  const dests = [[150, 62], [262, 96], [36, 84]];
  return (
    <svg viewBox="0 0 360 260" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="360" height="260" fill="#0c2236" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" x2="360" y1={i * 22 + 10} y2={i * 22 + 10} stroke="#2e619c" strokeOpacity="0.18" />
      ))}
      {dests.map(([x, y], i) => {
        const mx = (origin[0] + x) / 2, my = Math.min(origin[1], y) - 60;
        return (
          <g key={i}>
            <path d={`M${origin[0]} ${origin[1]} Q${mx} ${my} ${x} ${y}`} fill="none" stroke="#2e8eff" strokeWidth="1.6" strokeDasharray="3 5" />
            <circle cx={x} cy={y} r="4" fill="#ffffff" />
          </g>
        );
      })}
      <circle cx={origin[0]} cy={origin[1]} r="14" fill="#F2B544" opacity="0.2" />
      <circle cx={origin[0]} cy={origin[1]} r="5" fill="#F2B544" />
    </svg>
  );
}

const arts = { codes: Codes, crowd: Crowd, routes: Routes };

export default function WorkArt({ kind }) {
  const Art = arts[kind] ?? Codes;
  return <Art />;
}
