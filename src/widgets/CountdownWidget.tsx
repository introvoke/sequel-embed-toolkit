import React, { useEffect, useMemo, useState } from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";

type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type CountdownWidgetType = Extract<ApiWidget, { type: "countdown" }>;

type CountdownWidgetProps = {
  widget: CountdownWidgetType;
};

const getTimeParts = (target: Date, includeSeconds: boolean) => {
  const now = Date.now();
  const diff = Math.max(target.getTime() - now, 0);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Min", value: minutes },
  ];

  if (includeSeconds) {
    parts.push({ label: "Sec", value: seconds });
  }

  return parts;
};

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ widget }) => {
  const {
    textColor,
    cardBackgroundColor,
    cardBorderColor,
    unitColor,
    showSeconds,
    hideCountDownAfterEventStarts,
  } = widget.config ?? {};

  const includeSeconds = showSeconds ?? true;
  const startDate = useMemo(
    () => new Date(widget.data.eventStartDate),
    [widget.data.eventStartDate]
  );

  const [parts, setParts] = useState(() =>
    getTimeParts(startDate, includeSeconds)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParts(getTimeParts(startDate, includeSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate, includeSeconds]);

  const hasStarted = Date.now() >= startDate.getTime();
  if (hideCountDownAfterEventStarts && hasStarted) {
    return null;
  }

  const containerBg = cardBackgroundColor ?? "#f8f9fb";
  const containerBorder = cardBorderColor ?? "#e5e7eb";
  const valueColor = textColor ?? "#111827";
  const labelColor = unitColor ?? "#6b7280";

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap flex-row gap-0.5 w-full max-w-[600px]">
        {parts.map((part, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === parts.length - 1;
          return (
            <div
              key={part.label}
              className="flex-1 min-w-0 flex flex-col items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 border text-center"
              style={{
                backgroundColor: containerBg,
                borderColor: containerBorder,
                borderStyle: "solid",
                borderRadius: isFirst
                  ? "9999px 0 0 9999px"
                  : isLast
                  ? "0 9999px 9999px 0"
                  : "0",
              }}
            >
              <div
                className="text-heading-xs sm:text-heading-sm leading-tight"
                style={{ color: valueColor }}
              >
                {String(part.value).padStart(2, "0")}
              </div>
              <div
                className="text-body-xs uppercase"
                style={{ color: labelColor }}
              >
                {part.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
