const path = require("path");
const { defineConfig } = require("vite");

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/app.ts"),
      name: "SequelEmbedToolkit",
      fileName: (format) => `app.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
});
