/** Bluetrain Africa design tokens — mapped from Brand Guidelines V3 (2026). */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Primary
        brand: { DEFAULT: "#2e619c", bright: "#2e8eff" }, // Primary + Tertiary
        // Secondary accents — use sparingly (guideline: keep blue dominant)
        // Theme-aware tokens (values flip in index.css). In dark mode they are the literal
        // colours; in light mode "white" becomes the ink colour and "navy" the page colour.
        white: "rgb(var(--fg) / <alpha-value>)",
        navy: { DEFAULT: "rgb(var(--bg) / <alpha-value>)", deep: "rgb(var(--bg-deep) / <alpha-value>)" },
        // Fixed colours for surfaces that stay the same in both themes
        paper: "#ffffff",
        ink: "#102A43",
        night: "#0c2236",
        teal: "#167D8D",
        amber: "#F2B544",
        // Neutrals
        silver: "rgb(var(--silver) / <alpha-value>)",
        steel: "rgb(var(--steel) / <alpha-value>)",
        slate: "#7e7f7f", // Secondary colour
      },
      fontFamily: {
        // ITC Avant Garde (brand) and Inter, self-hosted from src/assets/fonts.
        display: ['"ITC Avant Garde Gothic Pro"', '"Jost"', "Century Gothic", "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Modular scale (~1.25) for body/UI, larger steps for display
        "display-xl": ["clamp(2.4rem, 4.3vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2.1rem, 4vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.75rem, 2.8vw, 2.6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: { site: "84rem" },
      borderRadius: { "4xl": "2rem" },
      keyframes: {
        drift: { "0%": { transform: "translate(0,0) scale(1)" }, "100%": { transform: "translate(14%,10%) scale(1.12)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
