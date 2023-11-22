// @ts-check
/**
 * @typedef {import("tailwindcss").Config} Config
 */

import { createTailwindTheme } from "./theme";
import { plugins } from "./plugins";

/**
 * @type {Config}
 */
export const DEFAULT_TAILWIND_CONFIG = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{html,js,jsx,ts,tsx}",
    "./components/**/*.{html,js,jsx,ts,tsx}",
    "./app/**/*.{html,js,jsx,ts,tsx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@introvoke/react/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@introvoke/newdesign/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: createTailwindTheme(),
  plugins,
};

/**
 * Create a tailwind config by shallow merging the passed config object with our default tailwind config.
 *
 * _NOTE_: This overrides any default values, so if you want to extend the default config,
 * you should import the default config and extend it manually.
 *
 * @param {Partial<Config>} [config]
 * @returns {Config} The merged config object
 */
export const createTailwindConfig = (config = {}) => {
  /** @type {Config} */
  const overrides = {
    ...DEFAULT_TAILWIND_CONFIG,
    ...config,
    theme: createTailwindTheme(config.theme),
  };

  return overrides;
};
