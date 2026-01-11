import React from "react";
import { EmbedIframe } from "@src/routes/EmbedIframe";
import type { AppRouter } from "@introvoke/sequel-trpc";

type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type EventEmbedWidgetType = Extract<ApiWidget, { type: "eventEmbed" }>;

interface EventEmbedWidgetProps {
  widget: EventEmbedWidgetType;
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
}

export const EventEmbedWidget: React.FC<EventEmbedWidgetProps> = ({
  widget,
  joinCode,
  hybrid,
  isPopup,
}) => {
  const eventId = widget.data.eventId;

  return (
    <div className="event-embed-widget">
      <EmbedIframe
        eventId={eventId}
        joinCode={joinCode}
        hybrid={hybrid}
        isPopup={isPopup}
      />
    </div>
  );
};
