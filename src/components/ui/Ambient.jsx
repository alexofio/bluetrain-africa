import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Page-wide atmosphere: a soft light that follows the cursor (fine pointers only, motion-safe)
 * plus a faint film grain. Both sit behind content and never take pointer events.
 */
export default function Ambient() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0, x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y;
    const move = (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); };
    const tick = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      ref.current?.style.setProperty("--lx", `${x}px`);
      ref.current?.style.setProperty("--ly", `${y}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [reduce]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        ref={ref}
        className="absolute inset-0 opacity-0 transition-opacity duration-700 [@media(pointer:fine)]:opacity-100 motion-reduce:hidden"
        style={{ background: "radial-gradient(520px circle at var(--lx,50%) var(--ly,30%), rgb(46 142 255 / 0.09), transparent 65%)" }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
