import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../lib/motion";

/** Spring fade-in once the block enters the viewport. Children can use `RevealItem` to stagger. */
export function Reveal({ as = "div", gap = 0.08, delay = 0, className = "", children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ as = "div", className = "", children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp} {...rest}>
      {children}
    </Comp>
  );
}
