// @ts-check
const plugin = require("tailwindcss/plugin");
export const animatePlugin = require("tailwindcss-animate");
export const containerQueriesPlugin = require("@tailwindcss/container-queries");

/**
 * Simple plugin to select all direct children of a parent element
 */
export const childPlugin = plugin(({ addVariant }) => {
  addVariant("child", "&>*");
});

/**
 * Helper plugin to easily create a grid with auto-fit or auto-fill
 *
 * the fixed utilities will use the value as forcing the grid items to always be that size,
 * but the non-fixed utilities will use minmax allowing the element to shrink/expand but not below the provided min-value
 */
export const gridAutoFitPlugin = plugin(
  ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "grid-cols-auto-fit": (value) => ({
          gridTemplateColumns: `repeat(auto-fit, minmax(${value}, 1fr))`,
        }),
        "grid-cols-auto-fit-fixed": (value) => ({
          gridTemplateColumns: `repeat(auto-fit, ${value})`,
        }),
        "grid-cols-auto-fill": (value) => ({
          gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
        }),
        "grid-cols-auto-fill-fixed": (value) => ({
          gridTemplateColumns: `repeat(auto-fill, ${value})`,
        }),
      },
      { values: theme("gridAutoFitCols") },
    );

    matchUtilities(
      {
        "grid-rows-auto-fit": (value) => ({
          gridTemplateRows: `repeat(auto-fit, minmax(${value}, 1fr))`,
        }),
        "grid-rows-auto-fit-fixed": (value) => ({
          gridTemplateRows: `repeat(auto-fit, ${value})`,
        }),
        "grid-rows-auto-fill": (value) => ({
          gridTemplateRows: `repeat(auto-fill, minmax(${value}, 1fr))`,
        }),
        "grid-rows-auto-fill-fixed": (value) => ({
          gridTemplateRows: `repeat(auto-fill, ${value})`,
        }),
      },
      { values: theme("gridAutoFitRows") },
    );
  },
  {
    theme: {
      gridAutoFitCols: {
        DEFAULT: "256px",
        xs: "192px",
        sm: "224px",
        md: "256px",
        lg: "288px",
        xl: "320px",
      },
      gridAutoFitRows: {
        DEFAULT: "256px",
        xs: "192px",
        sm: "224px",
        md: "256px",
        lg: "288px",
        xl: "320px",
      },
    },
  },
);

/**
 * Helper plugin to easily create a mask that fades to transparent with preset and custom breakpoints
 */
export const maskPlugin = plugin(
  ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        /**
         * @param {string} value
         */
        "fade-to-top": (value) => ({
          maskImage: `linear-gradient(
            to top, black 0%, transparent ${value.replace("-", "")}
          )`,
        }),
        "fade-to-right": (value) => ({
          maskImage: `linear-gradient(
            to right, black 0%, transparent ${value.replace("-", "")}
          )`,
        }),
        "fade-to-bottom": (value) => ({
          maskImage: `linear-gradient(
            to bottom, black 0%, transparent ${value.replace("-", "")}
          )`,
        }),
        "fade-to-left": (value) => ({
          maskImage: `linear-gradient(
            to left, black 0%, transparent ${value.replace("-", "")}
          )`,
        }),
      },
      { values: theme("fade"), supportsNegativeValues: false },
    );
  },
  {
    theme: {
      fade: {
        DEFAULT: "100%",
        25: "25%",
        50: "50%",
        75: "75%",
      },
    },
  },
);

/**
 * Plugin that provides a set of utilities to unset properties
 */
const unsetPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    ".unset": { all: "unset" },
    ".position-unset": { position: "unset" },
    ".h-unset": { height: "unset" },
    ".w-unset": { width: "unset" },
  });
});

export const plugins = [
  animatePlugin,
  childPlugin,
  containerQueriesPlugin,
  gridAutoFitPlugin,
  maskPlugin,
  unsetPlugin,
];
