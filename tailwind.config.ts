const {
  DEFAULT_TAILWIND_THEME,
} = require("@introvoke/react/styles/tailwind/theme");
const {
  DEFAULT_TAILWIND_CONFIG,
} = require("@introvoke/react/styles/tailwind/config");
const { mergeWith, cloneDeep } = require("lodash");
const plugin = require("tailwindcss/plugin");

const clonedDefault = cloneDeep(DEFAULT_TAILWIND_THEME || {});

const enabledPlugin = plugin(({ addVariant }) => {
  addVariant("enabled", "&:not([disabled])");
  addVariant("disabled", ["&[disabled]", "&:disabled"]);
});

/** @type {import('tailwindcss').Config} */
const config =
  require("@introvoke/react/styles/tailwind/config").createTailwindConfig({
    theme: mergeWith(
      clonedDefault,
      {
        /** @type {(import('tailwindcss').Config["theme"] & {})["extend"]} */
        extend: {
          zIndex: {
            1: "1",
          },
          fontSize: {
            "body-xxs": [
              "10px",
              { lineHeight: "12px", letterSpacing: "0px", fontWeight: 400 },
            ],
            "body-xxs-medium": [
              "10px",
              { lineHeight: "12px", letterSpacing: "0px", fontWeight: 500 },
            ],
            "body-xs": [
              "12px",
              { lineHeight: "16px", letterSpacing: "0px", fontWeight: 400 },
            ],
            "body-xs-medium": [
              "12px",
              { lineHeight: "16px", letterSpacing: "0px", fontWeight: 500 },
            ],
            "body-sm": [
              "14px",
              { lineHeight: "20px", letterSpacing: "0px", fontWeight: 400 },
            ],
            "body-sm-medium": [
              "14px",
              { lineHeight: "20px", letterSpacing: "0px", fontWeight: 500 },
            ],
            "body-md": [
              "16px",
              { lineHeight: "24px", letterSpacing: "0px", fontWeight: 400 },
            ],
            "body-md-medium": [
              "16px",
              { lineHeight: "24px", letterSpacing: "0px", fontWeight: 500 },
            ],
            "heading-xs": [
              "18px",
              { lineHeight: "28px", letterSpacing: "-0.5px", fontWeight: 700 },
            ],
            "heading-sm": [
              "24px",
              { lineHeight: "32px", letterSpacing: "-1px", fontWeight: 700 },
            ],
            "heading-md": [
              "36px",
              { lineHeight: "40px", letterSpacing: "-1.5px", fontWeight: 700 },
            ],
            "heading-lg": [
              "48px",
              { lineHeight: "48px", letterSpacing: "-2px", fontWeight: 700 },
            ],
          },
          fontFamily: {
            grotesk: "Sequel Grotesk, Inter, Arial, sans-serif",
          },
          colors: {
            neutral: {
              invisible: "rgba(255,255,255,1)",
              // alpha dark 50
              weak: "rgba(0,0,0,0.04)",
              // alpha dark 200
              soft: "rgba(0,0,0,0.1)",
              // alpha dark 700
              surface: "rgba(0,0,0,0.6)",
              // alpha dark 1000
              strong: "rgba(0,0,0,1)",
            },
            green: {
              lighter: "#E8FEC9",
              light: "#D0FC9A",
              DEFAULT: "#72D210",
              dark: "#37650F",
              darker: "#162F04",
            },
            yellow: {
              lighter: "#FEFDC3",
              light: "#FDF68B",
              DEFAULT: "#F5CA0B",
              dark: "#84540F",
              darker: "#422406",
            },
            red: {
              lighter: "#FEE2E2",
              light: "#FECACA",
              DEFAULT: "#C73030",
              dark: "#970A0A",
              darker: "#450A0A",
            },
            skittles: {
              coral: "#FD5C63",
              blue: "#1769FF",
              orange: "#FF4500",
              android: "#A4C639",
              cherry: "#FF2461",
              fuchsia: "#D354D6",
              ocean: "#35B9E9",
            },
            foreground: {
              "on-brand": "#FFFFFF",
              main: "#000000",
              primary: "#571BEA",
              inverted: "#FFFFFF",
              strong: "rgba(0,0,0,0.45)",
              success: "#72D210",
              error: "#C73030",
              warning: "#F5CA0B",
              weak: "rgba(0,0,0,0.1)",
            },
          },
          backgroundColor: {
            primary: {
              // lighter
              weak: "#EEE8FC",
              // light
              soft: "#D3C3F9",
              // base
              surface: "#571BEA",
              // dark
              hover: "#4311BC",
              // darker
              darker: "#1E0855",
              "alpha-soft": "#571BEA1A",
              "alpha-strong": "#571BEA4D",
            },
            green: {
              weak: "#E8FEC9",
              soft: "#D0FC9A",
              surface: "#72D210",
            },
            yellow: {
              weak: "#FEFDC3",
              soft: "#FDF68B",
              surface: "#F5CA0B",
            },
            red: {
              weak: "#FEE2E2",
              soft: "#FECACA",
              surface: "#C73030",
            },
          },
          textColor: {
            inverted: "#FFFFFF",
            primary: {
              DEFAULT: "#4311BC",
            },
            main: "#000000",
            sub: "rgba(0,0,0,0.6)",
            // alpha dark 500
            soft: "rgba(0,0,0,0.32)",
            // alpha dark 300
            disabled: "rgba(0,0,0,0.15)",
            // green dark
            success: "#37650F",
            // red dark
            error: "#970A0A",
            // yellow dark
            warning: "#84540F",
          },
          borderColor: {
            inverted: "#FFFFFF",
            weak: "rgba(0,0,0,0.07)", // alpha 100
            soft: "rgba(0,0,0,0.15)", // alpha 300
            surface: "rgba(0,0,0,0.32)", // alpha 500
            strong: "rgba(0,0,0,1)", // alpha 1000
            success: "#72D210",
            error: "#C73030",
            warning: "#F5CA0B",
            primary: {
              DEFAULT: "#571BEA",
            },
          },
          spacing: {
            xxs: "4px",
            xs: "6px",
            sm: "8px",
            md: "12px",
            lg: "16px",
            xl: "24px",
            "2xl": "32px",
            "3xl": "40px",
          },
          boxShadow: {
            xs: "0px 1px 1px 0px rgba(0, 0, 0, 0.07)",
            sm: "0px 2px 4px 0px rgba(0, 0, 0, 0.07)",
            md: "0px 16px 32px -12px rgba(0, 0, 0, 0.07)",
          },
          keyframes: {
            shine: {
              "0%": { "background-position": "100%" },
              "100%": { "background-position": "-100%" },
            },
            float: {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          },
          animation: {
            shine: "shine 5s linear infinite",
            float: "float 3s ease-in-out infinite",
          },
        },
      },
      (value, src) => (Array.isArray(value) ? src : undefined)
    ),
    plugins: DEFAULT_TAILWIND_CONFIG.plugins.concat(enabledPlugin),
  });

module.exports = config;
