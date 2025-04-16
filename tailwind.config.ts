import { createTailwindConfig } from "./src/styles/tailwind/config";

/** @type {import('tailwindcss').Config} */
module.exports = createTailwindConfig({
  theme: {
    extend: {
      fontFamily: {
        // This creates a `font-figtree` utility class
        figtree: ["Figtree", "sans-serif"],
      },
    },
  },
});
