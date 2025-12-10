import React from "react";
import { EmbedIframe } from "@src/routes/EmbedIframe";

interface EventEmbedWidgetProps {
  config: {
    id: string;
  };
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
}

export const EventEmbedWidget: React.FC<EventEmbedWidgetProps> = ({
  config,
  joinCode,
  hybrid,
  isPopup,
}) => {
  return (
    <div className="event-embed-widget">
      <EmbedIframe
        eventId={config.id}
        joinCode={joinCode}
        hybrid={hybrid}
        isPopup={isPopup}
      />
    </div>
  );
};
