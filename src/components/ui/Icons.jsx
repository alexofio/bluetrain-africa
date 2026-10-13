/** Custom 32px line icons. Stroke-based so they inherit currentColor; arcs echo the logomark. */
const base = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const paths = {
  // Route from a starting point to a destination
  strategy: (
    <>
      <circle cx="7" cy="25" r="2.5" />
      <path d="M9.5 25H17a4 4 0 0 0 4-4v-6a4 4 0 0 1 4-4h0" strokeDasharray="2.4 2.6" />
      <path d="M22 7.5l3.5 3.5L22 14.5" />
    </>
  ),
  // Bars rising under an arc of momentum
  growth: (
    <>
      <path d="M7 26v-5M13 26v-9M19 26v-7M25 26V13" />
      <path d="M5 13.5C10 6 19 4.5 26 7" />
      <path d="M22.5 5l3.5 2-2 3.5" />
    </>
  ),
  // A source with listening arcs either side (logomark arcs, turned)
  insights: (
    <>
      <circle cx="16" cy="16" r="3" />
      <path d="M10.5 10.5a7.8 7.8 0 0 0 0 11M21.5 10.5a7.8 7.8 0 0 1 0 11" />
      <path d="M6.3 6.3a13.7 13.7 0 0 0 0 19.4M25.7 6.3a13.7 13.7 0 0 1 0 19.4" />
    </>
  ),
  // One voice reaching a community
  influence: (
    <>
      <circle cx="16" cy="9" r="3.5" />
      <circle cx="7" cy="23" r="2.5" />
      <circle cx="16" cy="25" r="2.5" />
      <circle cx="25" cy="23" r="2.5" />
      <path d="M14 12.2l-5.3 8.6M16 12.5v10M18 12.2l5.3 8.6" />
    </>
  ),
  // A ticket — a real-world experience
  experience: (
    <>
      <path d="M5 10.5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v2.5a3 3 0 0 0 0 6v2.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V19a3 3 0 0 0 0-6z" />
      <path d="M19.5 8.5v15" strokeDasharray="1.8 2.2" />
      <path d="M10 16h5M10 12.8h3" />
    </>
  ),
  // Connected systems inside brackets
  technology: (
    <>
      <path d="M10 7H7v18h3M22 7h3v18h-3" />
      <circle cx="12.5" cy="16" r="2" />
      <circle cx="19.5" cy="12" r="2" />
      <circle cx="19.5" cy="20" r="2" />
      <path d="M14.3 15l3.4-2M14.3 17l3.4 2" />
    </>
  ),
};

export default function Icon({ name, className = "" }) {
  return (
    <svg {...base} className={className}>
      {paths[name]}
    </svg>
  );
}

export function ArrowIcon({ className = "" }) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" strokeWidth={1.8} className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
