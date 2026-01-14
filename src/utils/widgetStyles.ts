/**
 * Builds CSS custom property styles from widget config
 *
 * Takes a widget config object and converts it to CSS variables
 * following the pattern: --sequel-{prefix}-widget-{key}
 *
 * Example:
 *   buildCssVarStyles('countdown', { cardBackgroundColor: '#fff' })
 *   => { '--sequel-countdown-widget-cardBackgroundColor': '#fff' }
 */

type CSSVarPrefix = "agenda" | "countdown" | "speaker" | "events-grid";

export function buildCssVarStyles(
  prefix: CSSVarPrefix,
  config: Record<string, unknown>
): React.CSSProperties {
  const styles: Record<string, string> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string" && value) {
      styles[`--sequel-${prefix}-widget-${key}`] = value;
    }
  }

  return styles as React.CSSProperties;
}
