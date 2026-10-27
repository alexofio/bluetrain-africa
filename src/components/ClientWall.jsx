import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { clients } from "../content/cms";
import { industryLabel } from "../content/cms";
import { useLang } from "../lib/i18n";
import { Reveal, RevealItem } from "./ui/Reveal";

// Logos come from the Bluetrain Portal and are only sent once the client's logo permission is recorded there.
function Tile({ client, sector }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 220, damping: 20 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    mx.set(x); my.set(y);
    ref.current.style.setProperty("--sx", `${x * 100}%`);
    ref.current.style.setProperty("--sy", `${y * 100}%`);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };
  const logo = client.logo;

  return (
    <RevealItem className="[perspective:900px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        className="glass glow-hover group relative flex aspect-[5/3] flex-col items-center justify-center overflow-hidden rounded-3xl p-5 text-center [transform-style:preserve-3d]"
      >
        {/* spotlight that follows the cursor inside the tile */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(220px circle at var(--sx,50%) var(--sy,50%), rgb(46 142 255 / 0.22), transparent 70%)" }}
        />
        {logo ? (
          <img src={logo} alt={client.name} className="relative h-10 w-auto max-w-[70%] opacity-60 brightness-0 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-100 dark:invert group-hover:dark:invert-0" />
        ) : (
          <span className="relative font-display text-xl font-bold tracking-[-0.02em] text-white/55 transition-colors duration-300 group-hover:text-white sm:text-2xl [transform:translateZ(30px)]">
            {client.name}
          </span>
        )}
        <span className="relative mt-2 text-[0.72rem] uppercase tracking-[0.12em] text-steel transition-colors group-hover:text-brand-bright [transform:translateZ(20px)]">{sector}</span>
      </motion.div>
    </RevealItem>
  );
}

export default function ClientWall() {
  const { t, lang } = useLang();
  const w = t.ui.clientsWall;
  return (
    <section id="clients" className="relative border-t border-white/[0.06] py-24 lg:py-32">
      <div className="container-site">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RevealItem as="h2" className="font-display text-display-lg font-bold text-white lg:col-span-7">{w.heading}</RevealItem>
          <RevealItem as="p" className="text-lg leading-relaxed text-silver/75 lg:col-span-4 lg:col-start-9">{w.intro}</RevealItem>
        </Reveal>
        <Reveal gap={0.05} className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {clients.map((c) => <Tile key={c.slug || c.name} client={c} sector={industryLabel(c.sector, lang) || w.sectors[c.sector]} />)}
        </Reveal>
      </div>
    </section>
  );
}
