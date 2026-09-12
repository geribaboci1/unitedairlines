import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite's hashed JS/CSS bundles go to dist/static/ so that dist/assets/
    // stays exclusively YOUR media (copied verbatim from public/assets/).
    // Without this, Vite's default assetsDir is also "assets" and the two mix.
    assetsDir: "static",
  },
});
