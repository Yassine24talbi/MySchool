import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
const appDir = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: appDir,
  base: "./",
  plugins: [react()],
  define: { __ROLE__: JSON.stringify("teacher") },
  server: { 
    port: 5174, 
    fs: { allow: [path.resolve(appDir, "../..")] },
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: path.resolve(appDir, "dist"),
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(appDir, "index.html") },
  },
});
