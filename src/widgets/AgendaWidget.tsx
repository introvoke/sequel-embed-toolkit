import React from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { ClockStopwatch } from "@src/lib/introvoke-exports";

// Infer types from tRPC API
type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type AgendaWidgetType = Extract<ApiWidget, { type: "agenda" }>;

type AgendaWidgetProps = {
  widget: AgendaWidgetType;
};

type NormalizedAgendaItem = {
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  description?: string;
  speakers?:
    | {
        name: string;
        title: string;
        image?: string;
        linkedInProfileLink?: string;
      }[]
    | undefined;
};

// Broadcast/signal icon for live status
const LiveIcon = ({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" fill={color || "currentColor"} />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </svg>
);

const formatCountdown = (startDate: Date | string) => {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const diffMs = start - now;

  if (diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `Live in ${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    }`;
  } else if (hours > 0) {
    return `Live in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    return `Live in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const normalizeAgendaItems = (
  widget: AgendaWidgetType
): NormalizedAgendaItem[] => {
  if (widget.data?.items) {
    return widget.data.items.flatMap((item) => {
      const sessions =
        item.sessions && item.sessions.length > 0
          ? item.sessions
          : [
              {
                title: "Session",
                description: "",
                speakers: [],
              },
            ];

      return sessions.map((session) => ({
        title: session.title,
        description: session.description,
        speakers: session.speakers,
        startDate: item.startDate,
        endDate: item.endDate,
      }));
    });
  }

  return [];
};

export const AgendaWidget: React.FC<AgendaWidgetProps> = ({ widget }) => {
  const items = normalizeAgendaItems(widget);
  const now = Date.now();
  const showSpeakerPhoto =
    widget.config?.displaySpeakerPhoto === false ? false : true;
  const showLiveCountdowns =
    widget.config?.displayLiveCountdowns === false ? false : true;

  // Customizable colors from config
  const textColor = widget.config?.textColor ?? "#111827";
  const subtitleColor = widget.config?.subtitleColor ?? "#6b7280";
  const primaryColor = widget.config?.primaryColor ?? "#ef4444";
  const buttonColor = widget.config?.buttonColor ?? "#18181b";
  const buttonTextColor = widget.config?.buttonTextColor ?? "#ffffff";
  const cardTextColor = widget.config?.cardTextColor ?? "#111827";
  const cardBackground = widget.config?.primaryColor ?? "#F5CA0B";
  const lineColor = "#e5e7eb";

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const start = new Date(item.startDate).getTime();
        const end = new Date(item.endDate).getTime();
        const isLive = now >= start && now <= end;
        const isUpcoming = start > now;
        const countdownText = formatCountdown(item.startDate);

        return (
          <div
            key={`${item.title}-${index}`}
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-8 items-stretch pb-8"
          >
            {/* Left rail - Title and Status */}
            <div className="relative pl-7">
              {/* Timeline dashed vertical line - connects to next dot */}
              {!isLast && (
                <span
                  className="absolute left-[5px] top-[13px] border-l border-dashed"
                  style={{
                    borderColor: lineColor,
                    bottom: "-34px",
                  }}
                />
              )}

              {/* Timeline dot */}
              <span className="absolute left-0 top-[2px] w-[11px] h-[11px] rounded-full z-10 bg-skittles-coral" />

              {/* Title */}
              <h3
                className="text-lg font-bold leading-snug"
                style={{ color: textColor }}
              >
                {item.title}
              </h3>

              {/* Live/Countdown status */}
              {showLiveCountdowns && (isLive || isUpcoming) && (
                <div
                  className={`mt-1.5 flex items-center gap-1.5 text-sm ${
                    isLive ? "text-skittles-coral" : "text-sub"
                  }`}
                >
                  {isLive ? (
                    <>
                      <LiveIcon className="w-4 h-4" color={primaryColor} />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <ClockStopwatch className="w-4 h-4" />
                      <span>{countdownText}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right card */}
            <div
              className="rounded-xl py-5 px-6"
              style={{ backgroundColor: cardBackground }}
            >
              {/* Description */}
              {item.description && (
                <div
                  className="text-body-md"
                  style={{ color: cardTextColor }}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}

              {/* Speakers */}
              {item.speakers && item.speakers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {item.speakers.map((speaker, speakerIdx) => (
                    <div
                      key={`${speaker.name}-${speakerIdx}`}
                      className="flex items-center gap-2.5"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {showSpeakerPhoto && speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(speaker.name)
                        )}
                      </div>
                      {/* Name and Title */}
                      <div className="flex flex-col">
                        <span
                          className="text-heading-sm"
                          style={{ color: cardTextColor }}
                        >
                          {speaker.name}
                        </span>
                        <span
                          className="text-body-md-medium"
                          style={{ color: subtitleColor }}
                        >
                          {speaker.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Join now button - only for live sessions */}
              {isLive && (
                <button
                  className="mt-4 px-4 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                  }}
                >
                  Join now
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
