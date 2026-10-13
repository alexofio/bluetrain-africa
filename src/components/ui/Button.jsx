import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { spring } from "../../lib/motion";
import { to } from "../../lib/router";

const styles = {
  // High-contrast pill, with a neon halo on hover
  primary: "bg-white text-navy hover:bg-silver hover:shadow-[0_0_0_1px_rgb(46_142_255/0.5),0_10px_40px_-8px_rgb(46_142_255/0.7)]",
  secondary: "border border-white/20 text-white hover:border-brand-bright/60 hover:bg-white/5",
  brand: "bg-brand text-white hover:bg-[#3670b3]",
};

/** Pill button. Primary buttons are magnetic: they lean a few px toward a fine pointer. */
export default function Button({ href, variant = "primary", size = "md", magnetic = variant === "primary", className = "", children, ...rest }) {
  const Comp = href ? motion.a : motion.button;
  const sizing = size === "sm" ? "h-10 px-5 text-sm" : "h-12 px-7 text-[0.95rem]";
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring.hover);
  const y = useSpring(useMotionValue(0), spring.hover);
  const onMove = (e) => {
    if (!magnetic || reduce || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <Comp
      ref={ref}
      href={to(href)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      transition={spring.hover}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,border-color,color] duration-300 ${sizing} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
