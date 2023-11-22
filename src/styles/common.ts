import { deepFreeze } from "@src/utils/object";

export interface FontOptions {
  fontFamily: string;
}

export const DEFAULT_COLORS = deepFreeze({
  primary: {
    50: "#f3f2ff",
    100: "#eae7ff",
    200: "#d7d2ff",
    300: "#b8aeff",
    400: "#9581ff",
    500: "#734eff",
    600: "#6329fe",
    700: "#571bea",
    800: "#4613c4",
    900: "#3c12a0",
    950: "#22086d",
    "contrast-text": "white",
  },
  common: {
    black: "#1b1c1e",
    white: "#ffffff",
  },
});

export const DEFAULT_FONT_FAMILY_BODY = ["Inter", "Arial", "sans-serif"];
export const DEFAULT_FONT_FAMILY_DISPLAY = [
  "Sequel Grotesk",
  "Arial",
  "sans-serif",
];
