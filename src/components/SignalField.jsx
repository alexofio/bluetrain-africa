import { useEffect, useRef } from "react";
import { useLang } from "../lib/i18n";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * Hero visual: concentric arc pairs drawn from the Bluetrain logomark's upper/lower arcs.
 * Signals pulse outward; the field leans toward the pointer and the panel tilts in 3D.
 * Pauses when off-screen; renders a single still frame under prefers-reduced-motion.
 */
export default function SignalField() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();
  const { t } = useLang();

  // pointer, normalised -1..1, shared by canvas + 3D tilt
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });
  const rotY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotX = useTransform(sy, [-1, 1], [6, -6]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, start = performance.now();
    let lean = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.52;
      const maxR = Math.hypot(w, h) * 0.62;
      const rings = 15;
      const gap = maxR / (rings + 1);
      lean += (sx.get() * 0.35 - lean) * 0.08;

      // core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, gap * 2.4);
      g.addColorStop(0, "rgba(46,142,255,0.55)");
      g.addColorStop(1, "rgba(46,142,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, gap * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2); ctx.fill();

      const pulse1 = ((t * 0.16) % 1) * maxR;
      const pulse2 = (((t * 0.16) + 0.5) % 1) * maxR;

      for (let i = 1; i <= rings; i++) {
        const r = gap * (i + 0.6);
        const fade = 1 - i / (rings + 2);
        const p = Math.max(
          Math.exp(-((r - pulse1) ** 2) / (2 * (gap * 0.9) ** 2)),
          Math.exp(-((r - pulse2) ** 2) / (2 * (gap * 0.9) ** 2))
        );
        const alpha = (0.1 + p * 0.75) * fade + 0.04;
        ctx.lineWidth = 1.2 + p * 2.6 + (i < 3 ? 1.5 : 0);
        ctx.lineCap = "round";
        ctx.strokeStyle = p > 0.55 ? `rgba(255,255,255,${alpha})` : `rgba(46,142,255,${alpha})`;
        // upper arc: tighter span (as in the logomark); lower arc: wider span
        const up = 0.42 - i * 0.008, down = 0.62 - i * 0.01;
        const sway = lean * (1 + i * 0.04);
        ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 - up + sway, -Math.PI / 2 + up + sway); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI / 2 - down + sway, Math.PI / 2 + down + sway); ctx.stroke();
      }
    };

    const loop = (now) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(start + 2500); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (reduce) draw(start + 2500);
    else raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [reduce, sx]);

  const onMove = (e) => {
    const r = wrapRef.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <div ref={wrapRef} onPointerMove={onMove} onPointerLeave={onLeave} className="relative h-full w-full [perspective:1200px]">
      <motion.div
        style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}
        className="relative h-full w-full overflow-hidden rounded-4xl border border-paper/10 bg-night shadow-[0_40px_120px_-40px_rgba(46,142,255,0.45)]"
      >
        {/* slow mesh-gradient wash behind the arcs */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -left-1/4 top-[-20%] h-[70%] w-[80%] rounded-full bg-brand/50 blur-[90px] motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate]" />
          <div className="absolute -bottom-1/4 right-[-15%] h-[65%] w-[70%] rounded-full bg-teal/40 blur-[100px] motion-safe:animate-[drift_22s_ease-in-out_infinite_alternate-reverse]" />
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label={t.ui.signalLabel} />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-paper/5" />
      </motion.div>
    </div>
  );
}
