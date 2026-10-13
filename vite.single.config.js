import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
// Builds one self-contained HTML file (all JS, CSS, fonts and images inlined)
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: "dist-single", assetsInlineLimit: 100_000_000 },
});
