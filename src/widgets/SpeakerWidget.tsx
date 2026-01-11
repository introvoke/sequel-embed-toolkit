import React from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { ArrowNarrowUpRight, IconWrapper } from "@src/lib/introvoke-exports";

// Infer types from tRPC API
type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type SpeakerWidgetType = Extract<ApiWidget, { type: "speaker" }>;

interface SpeakerWidgetProps {
  widget: SpeakerWidgetType;
}

export const SpeakerWidget: React.FC<SpeakerWidgetProps> = ({ widget }) => {
  const speakers = widget.data?.speakers ?? [];
  const {
    textColor,
    darkMode,
    cardBackgroundColor,
    cardBorderColor,
    linkColor,
    showSpeakerPhoto,
    showSpeakerTitle,
    showSpeakerLinkedIn,
  } = widget.config ?? {};

  if (!speakers || speakers.length === 0) {
    return null;
  }

  const shouldShowSpeakerPhoto = showSpeakerPhoto !== false;
  const shouldShowSpeakerTitle = showSpeakerTitle !== false;
  const shouldShowSpeakerLinkedIn = showSpeakerLinkedIn !== false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {speakers.map((speaker, idx) => {
        const linkedIn = speaker.linkedInProfileLink || undefined;
        const avatar = speaker.image || undefined;

        return (
          <div
            key={idx}
            className={[
              "speaker-card",
              "rounded-lg",
              "p-4",
              "h-24",
              "border",
              darkMode
                ? "bg-neutral-900 border-white/10 text-white"
                : "bg-neutral-weak border-gray-200 text-main",
            ].join(" ")}
            style={{
              backgroundColor: cardBackgroundColor,
              borderColor: cardBorderColor,
            }}
          >
            <div className="flex items-center gap-4 h-full">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 via-teal-400 to-green-400">
                  {shouldShowSpeakerPhoto && avatar ? (
                    <img
                      src={avatar}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Speaker Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className="text-body-md-medium text-main"
                  style={{ color: textColor }}
                >
                  {speaker.name}
                </h4>
                {shouldShowSpeakerTitle && speaker.title && (
                  <p
                    className="text-body-sm text-main"
                    style={{ color: textColor }}
                  >
                    {speaker.title}
                  </p>
                )}
                {shouldShowSpeakerLinkedIn && linkedIn && (
                  <a
                    href={linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-skittles-blue hover:text-skittles-blue-dark transition-colors font-medium"
                    style={{ color: linkColor }}
                  >
                    <span>LinkedIn</span>
                    <IconWrapper
                      className="text-skittles-blue"
                      icon={ArrowNarrowUpRight}
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
