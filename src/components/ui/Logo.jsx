import logoWhite from "../../assets/brand/main-logo-white.svg";
import logoColor from "../../assets/brand/main-logo-original.svg";

/**
 * Official Bluetrain Africa lockup (from the brand export). Guidelines: min. 150px wide on digital,
 * never recoloured — so it swaps approved files: full-colour on light, white on dark.
 */
export default function Logo({ className = "w-[150px]" }) {
  const img = "h-auto w-full";
  return (
    <span className={`block ${className}`}>
      <img src={logoColor} alt="Bluetrain Africa" width="1046" height="313" className={`${img} dark:hidden`} />
      <img src={logoWhite} alt="Bluetrain Africa" width="1046" height="313" className={`${img} hidden dark:block`} />
    </span>
  );
}
