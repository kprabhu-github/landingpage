import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The thank-you page is served at <base>/thank-you. Copy index.html there so a
// reload or direct visit works on any static host (thank-you.html for hosts with
// extensionless URLs, thank-you/index.html for folder-style hosts).
const thankYouPage = (outDir) => ({
  name: "thank-you-page",
  apply: "build",
  closeBundle() {
    const src = join(outDir, "index.html");
    copyFileSync(src, join(outDir, "thank-you.html"));
    mkdirSync(join(outDir, "thank-you"), { recursive: true });
    copyFileSync(src, join(outDir, "thank-you", "index.html"));
  },
});

// `npm run build` -> normal multi-file build in dist/
// `npm run build:single` -> one self-contained HTML file in dist-single/
export default defineConfig(({ mode }) => ({
  base: "/usa/meta-ads/",
  plugins: [react(), ...(mode === "single" ? [viteSingleFile()] : []), thankYouPage(mode === "single" ? "dist-single" : "dist")],
  build: mode === "single" ? { outDir: "dist-single" } : { outDir: "dist" },
}));
