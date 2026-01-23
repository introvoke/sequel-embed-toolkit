import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.nextTick": "queueMicrotask",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "Sequel",
      formats: ["iife"],
      fileName: () => "sequel.js",
    },
    rollupOptions: {
      output: {
        // Ensure everything is in one file
        inlineDynamicImports: true,
        // Single CSS file
        assetFileNames: "sequel[extname]",
      },
    },
  },
});
