import { useEffect } from "react";

import {
  DEFAULT_FONT_FAMILY_DISPLAY,
  DEFAULT_FONT_FAMILY_BODY,
  type FontOptions,
  DEFAULT_COLORS,
} from "./common";
import { generateFontFamily, generateThemeColors } from "./utils";

export type ThemeProviderProps = Partial<{
  colors: Partial<{
    /**
     * The primary color of the theme. If not provided, the Sequel primary color will be used.
     */
    primary: string;
  }>;
  fonts: Partial<{
    /** The font settings used for heading text */
    display: FontOptions;
    /** The font settings used for body and normal text */
    body: FontOptions;
  }>;
}> & {
  children: React.ReactNode;
  parent?: HTMLElement;
};

export const ThemeProvider = ({
  colors = {},
  fonts = {},
  children,
  parent = document.documentElement,
}: ThemeProviderProps) => {
  // set colors
  useEffect(() => {
    const generatedPrimaryColors = colors.primary
      ? generateThemeColors(colors.primary)
      : DEFAULT_COLORS.primary;

    return Object.entries(generatedPrimaryColors).forEach(([key, value]) => {
      parent.style.setProperty(`--primary-color-${key}`, value as string);
    });
  }, [colors, parent]);

  // set font families
  useEffect(() => {
    const fontFamilies = {
      display: generateFontFamily(
        fonts.display?.fontFamily,
        DEFAULT_FONT_FAMILY_DISPLAY
      ),
      body: generateFontFamily(
        fonts.body?.fontFamily,
        DEFAULT_FONT_FAMILY_BODY
      ),
    };

    return Object.entries(fontFamilies).forEach(([key, value]) => {
      parent.style.setProperty(`--font-family-${key}`, value);
    });
  }, [fonts.body?.fontFamily, fonts.display?.fontFamily, parent]);

  return children;
};

ThemeProvider.displayName = "ThemeProvider";
