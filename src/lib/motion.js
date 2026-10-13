/** Spring presets — tuned to settle quickly with no visible overshoot loops. */
export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 22, mass: 0.9 },
  snappy: { type: "spring", stiffness: 340, damping: 30 },
  hover: { type: "spring", stiffness: 260, damping: 24 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring.soft },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
