import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import chroma from "chroma-js";
import { DEFAULT_COLORS } from "./common";

export { cva, type VariantProps } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getContrastTextColor = (
  backgroundColor: string,
  textColors = ["#ffffff", "#1b1c1e"],
) => {
  const { color } = textColors.reduce(
    (res, textColor) => {
      const contrast = chroma.contrast(backgroundColor, textColor);

      if (contrast > res.contrast) {
        res.contrast = contrast;
        res.color = textColor;
      }

      return res;
    },
    { contrast: 0, color: textColors[0] },
  );

  return color;
};

export const generateFontFamily = (
  fontFamily: string | undefined,
  defaultFamily: string[],
) => {
  // this makes sure that we dont include the font name twice
  // if the font name is already in the default font family
  return [...new Set([fontFamily?.split(","), ...defaultFamily])]
    .filter(Boolean)
    .join(",");
};

export const generateShadesFromRange = (
  range: (chroma.Color | string)[],
  shades: number[],
  options?: { gamma?: number; saturation?: number },
) => {
  return chroma
    .scale(range)
    .mode("hsl")
    .gamma(options?.gamma ?? 1)
    .domain(shades)
    .colors(shades.length, "saturate")
    .reduce<Record<string, string>>((acc, color, index) => {
      acc[String(shades[index])] = color
        .saturate(options?.saturation ?? 0)
        .hex();
      return acc;
    }, {});
};

/**
 * _NOTE:_ This function should not be used directly outside of the library
 */
export const generateThemeColors = (color: string | undefined) => {
  if (!color || !chroma.valid(color)) {
    return DEFAULT_COLORS.primary;
  }

  const mainColor = chroma(color).hex(); // always convert to hex

  // add 0 to offset white which is removed later along with the mainColor
  const beforeColors = generateShadesFromRange(
    ["#ffffff", mainColor],
    [0, 50, 100, 200, 300, 400, 500, 600, 700],
    { gamma: 2 },
  );

  // add 1000 to offset black which is removed later along with the mainColor
  const afterColors = generateShadesFromRange(
    [mainColor, "#000000"],
    [700, 800, 900, 950, 1000],
    { gamma: 1 },
  );

  const colors: Record<string, string> = {
    ...beforeColors,
    ...afterColors,
    "700": mainColor,
    "contrast-text": getContrastTextColor(mainColor),
  };

  // remove white and black offsets
  delete colors["0"];
  delete colors["1000"];

  return colors;
};
