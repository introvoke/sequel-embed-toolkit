import React from "react";
import { EmbedIframe } from "@src/routes/EmbedIframe";

// Local type definition - eventEmbed is not in API types
type EventEmbedWidgetType = {
  type: "eventEmbed";
  data: { eventId: string };
};

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
