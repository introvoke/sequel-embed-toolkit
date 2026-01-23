import React from "react";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { Speaker } from "@src/lib/introvoke-exports";

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
    speakerNameColor,
    speakerTitleColor,
    cardBackgroundColor,
    cardBorderColor,
    linkedInLinkColor,
    showSpeakerPhoto,
    showSpeakerTitle,
    showSpeakerLinkedIn,
  } = widget.config ?? {};

  if (!speakers || speakers.length === 0) {
    return null;
  }

  // Build CSS variables for the Speaker component
  const cssVarStyles: React.CSSProperties = {
    "--sequel-speaker-widget-speakerNameColor": speakerNameColor,
    "--sequel-speaker-widget-speakerTitleColor": speakerTitleColor,
    "--sequel-speaker-widget-cardBackgroundColor": cardBackgroundColor,
    "--sequel-speaker-widget-cardBorderColor": cardBorderColor,
    "--sequel-speaker-widget-linkedInLinkColor": linkedInLinkColor,
  } as React.CSSProperties;

  return (
    <div style={cssVarStyles}>
      <Speaker
        speakers={speakers}
        showSpeakerPhoto={showSpeakerPhoto}
        showSpeakerTitle={showSpeakerTitle}
        showSpeakerLinkedIn={showSpeakerLinkedIn}
      />
    </div>
  );
};
