import React from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { Agenda, type SessionData } from "@src/lib/introvoke-exports";

// Infer types from tRPC API
type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type AgendaWidgetType = Extract<ApiWidget, { type: "agenda" }>;

type AgendaWidgetProps = {
  widget: AgendaWidgetType;
};

const normalizeAgendaItems = (widget: AgendaWidgetType): SessionData[] => {
  if (widget.data?.items) {
    return widget.data.items.flatMap((item, itemIdx) => {
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

      return sessions.map((session, sessionIdx) => ({
        id: `${itemIdx}-${sessionIdx}`,
        title: session.title,
        description: session.description,
        startTime: item.startDate,
        endTime: item.endDate,
        speakers: session.speakers?.map((s) => ({
          name: s.name,
          title: s.title,
          avatar: s.image,
          linkedIn: s.linkedInProfileLink,
        })),
      }));
    });
  }

  return [];
};

export const AgendaWidget: React.FC<AgendaWidgetProps> = ({ widget }) => {
  const sessions = normalizeAgendaItems(widget);
  const {
    displaySpeakerPhoto,
    sessionCardBackgroundColor,
    sessionCardTextColor,
    breakoutCardBackgroundColor,
    breakoutCardTextColor,
    buttonBackgroundColor,
    buttonTextColor,
    timelineDotColor,
    timelineTitleColor,
    timelineSubtitleColor,
    liveIndicatorColor,
    speakerNameColor,
    speakerTitleColor,
  } = widget.config ?? {};

  // Build CSS variables for the Agenda component
  const cssVarStyles: React.CSSProperties = {
    "--sequel-agenda-widget-sessionCardBackgroundColor":
      sessionCardBackgroundColor,
    "--sequel-agenda-widget-sessionCardTextColor": sessionCardTextColor,
    "--sequel-agenda-widget-breakoutCardBackgroundColor":
      breakoutCardBackgroundColor,
    "--sequel-agenda-widget-breakoutCardTextColor": breakoutCardTextColor,
    "--sequel-agenda-widget-buttonBackgroundColor": buttonBackgroundColor,
    "--sequel-agenda-widget-buttonTextColor": buttonTextColor,
    "--sequel-agenda-widget-timelineDotColor": timelineDotColor,
    "--sequel-agenda-widget-timelineTitleColor": timelineTitleColor,
    "--sequel-agenda-widget-timelineSubtitleColor": timelineSubtitleColor,
    "--sequel-agenda-widget-liveIndicatorColor": liveIndicatorColor,
    "--sequel-agenda-widget-speakerNameColor": speakerNameColor,
    "--sequel-agenda-widget-speakerTitleColor": speakerTitleColor,
  } as React.CSSProperties;

  if (sessions.length === 0) return null;

  return (
    <div style={cssVarStyles}>
      <Agenda
        sessions={sessions}
        showSpeakerPhoto={displaySpeakerPhoto}
        showSpeakerTitle={true}
        showLinkedIn={true}
      />
    </div>
  );
};
