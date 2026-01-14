import React from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { Countdown } from "@src/lib/introvoke-exports";

type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type CountdownWidgetType = Extract<ApiWidget, { type: "countdown" }>;

type CountdownWidgetProps = {
  widget: CountdownWidgetType;
};

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ widget }) => {
  const {
    valueTextColor,
    unitTextColor,
    cardBackgroundColor,
    cardBorderColor,
    showSeconds,
    hideCountDownAfterEventStarts,
  } = widget.config ?? {};

  // Build CSS variables for the Countdown component
  const cssVarStyles: React.CSSProperties = {
    "--sequel-countdown-widget-valueTextColor": valueTextColor,
    "--sequel-countdown-widget-unitTextColor": unitTextColor,
    "--sequel-countdown-widget-cardBackgroundColor": cardBackgroundColor,
    "--sequel-countdown-widget-cardBorderColor": cardBorderColor,
  } as React.CSSProperties;

  return (
    <div style={cssVarStyles}>
      <Countdown
        targetDate={widget.data.eventStartDate}
        showSeconds={showSeconds}
        hideAfterComplete={hideCountDownAfterEventStarts}
      />
    </div>
  );
};
