// @ts-check

/** @typedef {import("tailwindcss").Config["theme"]} Theme */

/**
 * @type {Theme}
 */
export const DEFAULT_TAILWIND_THEME = {
  fontFamily: {
    body: "var(--font-family-body)",
    display: "var(--font-family-display)",
  },
  fontSize: {
    xxs: ["10px", { lineHeight: "10px", letterSpacing: "-0px" }],
    xs: ["12px", { lineHeight: "16px", letterSpacing: "-0px" }],
    sm: ["14px", { lineHeight: "20px", letterSpacing: "-0px" }],
    base: ["16px", { lineHeight: "24px", letterSpacing: "-0px" }],
    lg: ["18px", { lineHeight: "28px", letterSpacing: "-0px" }],
    xl: ["20px", { lineHeight: "30px", letterSpacing: "-0px" }],
    "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
    "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.6px" }],
    "4xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.7px" }],
    "5xl": ["48px", { lineHeight: "60px", letterSpacing: "-1px" }],
    "6xl": ["60px", { lineHeight: "72px", letterSpacing: "-1.2px" }],
    "7xl": ["72px", { lineHeight: "90px", letterSpacing: "-1.5px" }],
  },
  spacing: {
    0: "0px", // 0rem
    0.5: "2px", // 0.125rem
    1: "4px", // 0.25rem
    1.5: "6px", // 0.375rem
    2: "8px", // 0.5rem
    2.5: "10px", // 0.625rem
    3: "12px", // 0.75rem
    3.5: "14px", // 0.875rem
    4: "16px", // 1rem
    4.5: "18px", // 1.125rem
    5: "20px", // 1.25rem
    5.5: "22px", // 1.375rem
    6: "24px", // 1.5rem
    6.5: "26px", // 1.625rem
    7: "28px", // 1.75rem
    7.5: "30px", // 1.875rem
    8: "32px", // 2rem
    8.5: "34px", // 2.125rem
    9: "36px", // 2.25rem
    9.5: "38px", // 2.375rem
    10: "40px", // 2.5rem
    10.5: "42px", // 2.625rem
    11: "44px", // 2.75rem
    11.5: "46px", // 2.875rem
    12: "48px", // 3rem
    12.5: "50px", // 3.125rem
    13: "52px", // 3.25rem
    13.5: "54px", // 3.375rem
    14: "56px", // 3.5rem
    14.5: "58px", // 3.625rem
    15: "60px", // 3.75rem
    15.5: "62px", // 3.875rem
    16: "64px", // 4rem
    16.5: "66px", // 4.125rem
    20: "80px", // 5rem
    24: "96px", // 6rem
    25: "100px", // 6.25rem
    28: "112px", // 7rem
    32: "128px", // 8rem
    36: "144px", // 9rem
    40: "160px", // 10rem
    44: "176px", // 11rem
    48: "192px", // 12rem
    52: "208px", // 13rem
    56: "224px", // 14rem
    60: "240px", // 15rem
    64: "256px", // 16rem
    72: "288px", // 18rem
    80: "320px", // 20rem
    96: "384px", // 24rem
  },
  borderRadius: {
    DEFAULT: "8px",
    none: "0px",
    sm: "2px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
    full: "9999px",
  },
  // Tailwind is mobile first so all breakpoints are essentially specified breakpoint and up
  // Tailwind has its own breakpoints but we are using the same breakpoints as MUI for now
  screens: {
    xs: "0px", // media (min-width: 0px) { ... }
    sm: "600px", // media (min-width: 600px) { ... }
    md: "900px", // media (min-width: 900px) { ... }
    lg: "1200px", // media (min-width: 1200px) { ... }
    xl: "1536px", // media (min-width: 1536px) { ... }
  },
  colors: {
    black: "#1b1c1e",
    white: "#ffffff",
    transparent: "transparent",
    current: "currentColor",
    gray: {
      50: "#f6f7f9",
      100: "#edeef1",
      200: "#d7dae0",
      300: "#b3b9c6",
      400: "#8a94a6",
      500: "#667085",
      600: "#565e73",
      700: "#464c5e",
      800: "#3d424f",
      900: "#363a44",
      950: "#24262d",
    },
    primary: {
      50: "var(--primary-color-50)",
      100: "var(--primary-color-100)",
      200: "var(--primary-color-200)",
      300: "var(--primary-color-300)",
      400: "var(--primary-color-400)",
      500: "var(--primary-color-500)",
      600: "var(--primary-color-600)",
      700: "var(--primary-color-700)",
      800: "var(--primary-color-800)",
      900: "var(--primary-color-900)",
      950: "var(--primary-color-950)",
      "contrast-text": "var(--primary-color-contrast-text)",
    },
    coral: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fda4a4",
      400: "#f97474",
      500: "#f04343",
      600: "#dd2525",
      700: "#ba1b1b",
      800: "#9a1a1a",
      900: "#801c1c",
      950: "#450a0a",
    },
    plum: {
      50: "#fbf5ff",
      100: "#f5e8ff",
      200: "#ecd5ff",
      300: "#deb4fe",
      400: "#c984fc",
      500: "#b14ef6",
      600: "#a134e9",
      700: "#8b23cd",
      800: "#7522a7",
      900: "#601c87",
      950: "#420764",
    },
    kelly: {
      50: "#f5ffe6",
      100: "#e8fec9",
      200: "#d0fc9a",
      300: "#b0f75f",
      400: "#8eeb28",
      500: "#72d210",
      600: "#56a808",
      700: "#427f0c",
      800: "#37650f",
      900: "#2f5512",
      950: "#162f04",
    },
    lemon: {
      50: "#fefde8",
      100: "#fefdc3",
      200: "#fdf68b",
      300: "#fcea48",
      400: "#f8d817",
      500: "#f5ca0b",
      600: "#c99605",
      700: "#a06b08",
      800: "#84540f",
      900: "#704513",
      950: "#422406",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    orange: {
      50: "#fffbea",
      100: "#fff2c5",
      200: "#ffe685",
      300: "#ffd246",
      400: "#ffbd1b",
      500: "#ff9900",
      600: "#e27200",
      700: "#bb4d02",
      800: "#983b08",
      900: "#7c310b",
      950: "#481700",
    },
    green: {
      50: "#f0fdf5",
      100: "#dcfce8",
      200: "#bbf7d1",
      300: "#86efad",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803c",
      800: "#166533",
      900: "#14532b",
      950: "#052e14",
    },
    "fusion-red": {
      50: "#fef2f3",
      100: "#ffe1e2",
      200: "#ffc8ca",
      300: "#ffa2a6",
      400: "#fd5c63",
      500: "#f63d45",
      600: "#e31f28",
      700: "#bf161d",
      800: "#9e161c",
      900: "#83191e",
      950: "#47080b",
    },
    "heroic-blue": {
      50: "#edf7ff",
      100: "#d7ebff",
      200: "#b9ddff",
      300: "#88c9ff",
      400: "#50aaff",
      500: "#2886ff",
      600: "#1769ff",
      700: "#0a4eeb",
      800: "#0f3fbe",
      900: "#133a95",
      950: "#11255a",
    },
    "fire-bolt": {
      50: "#fff6ec",
      100: "#ffead3",
      200: "#ffd1a5",
      300: "#ffb06d",
      400: "#ff8232",
      500: "#ff5f0a",
      600: "#ff4500",
      700: "#cc2f02",
      800: "#a1250b",
      900: "#82220c",
      950: "#460d04",
    },
    android: {
      50: "#f8fbea",
      100: "#eff5d2",
      200: "#deecaa",
      300: "#c6dd79",
      400: "#a4c639",
      500: "#90b230",
      600: "#708d23",
      700: "#566c1f",
      800: "#46561e",
      900: "#3b4a1d",
      950: "#1e280b",
    },
    cherry: {
      50: "#ffeff2",
      100: "#ffe0e6",
      200: "#ffc6d3",
      300: "#ff97af",
      400: "#ff5d85",
      500: "#ff2461",
      600: "#ff0050",
      700: "#d70043",
      800: "#b40041",
      900: "#99023e",
      950: "#57001c",
    },
    "glitter-lake": {
      50: "#eff8ff",
      100: "#dff0ff",
      200: "#b8e3ff",
      300: "#78cdff",
      400: "#45bbff",
      500: "#069af1",
      600: "#007ace",
      700: "#0061a7",
      800: "#02528a",
      900: "#084572",
      950: "#062b4b",
    },
    fuchsia: {
      50: "#fdf5fe",
      100: "#faebfc",
      200: "#f5d6f8",
      300: "#eeb6f1",
      400: "#e58ae8",
      500: "#d354d6",
      600: "#bc3dbc",
      700: "#9b3099",
      800: "#7f297d",
      900: "#692666",
      950: "#440e41",
    },
    "shadow-blue": {
      50: "#f4f7f9",
      100: "#eaf2f5",
      200: "#d9e6ec",
      300: "#c2d4df",
      400: "#a9bed0",
      500: "#92a9c2",
      600: "#768cad",
      700: "#697c99",
      800: "#56657d",
      900: "#4a5565",
      950: "#2b313b",
    },
  },
  boxShadow: {
    none: "0 0 #000",
    100: "0px 1px 1px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    200: "0px 2px 4px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    300: "0px 4px 8px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    400: "0px 8px 16px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    500: "0px 16px 24px 0px rgba(48, 49, 51, 0.09), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    600: "0px 24px 40px 0px rgba(48, 49, 51, 0.08), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-100":
      "0px -1px 1px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-200":
      "0px -2px 4px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-300":
      "0px -4px 8px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-400":
      "0px -8px 16px 0px rgba(48, 49, 51, 0.10), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-500":
      "0px -16px 24px 0px rgba(48, 49, 51, 0.09), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    "reverse-600":
      "0px -24px 40px 0px rgba(48, 49, 51, 0.08), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)",
    inner: "0px 2px 2px 0px rgba(0, 0, 0, 0.50) inset",
    "inner-50": "0px 1px 2px 0px rgba(0, 0, 0, 0.25) inset",
  },
  extend: {
    height: {
      half: "50%",
    },
    width: {
      half: "50%",
    },
    aspectRatio: {
      tv: "4 / 3",
      portrait: "9 / 16",
    },
    containers: {
      0: "0px",
      xs: "320px",
      sm: "384px",
      md: "448px",
      lg: "512px",
      xl: "576px",
      "2xl": "672px",
      "3xl": "768px",
      "4xl": "896px",
      "5xl": "1024px",
      "6xl": "1152px",
      "7xl": "1280p",
    },
  },
};

/**
 * Create a tailwind theme by merging the passed theme object with our default tailwind theme.
 *
 * _NOTE_: This overrides any default values, so if you want to extend the default theme,
 * you should import the default config and extend it manually.
 *
 * @param {Theme} [theme]
 * @returns {Theme} The merged theme object
 */
export const createTailwindTheme = (theme = {}) => {
  /** @type {Theme} */
  const overrides = {
    ...DEFAULT_TAILWIND_THEME,
    ...theme,
  };

  return overrides;
};
