import React from "react";
import { EventEmbedWidget } from "./EventEmbedWidget";
import { DescriptionWidget } from "./DescriptionWidget";
import { EventAgendaWidget } from "./EventAgendaWidget";
import { EventsGridWidget } from "./EventsGridWidget";

// Widget types
type WidgetEmbed = {
  type: "eventEmbed";
  config: {
    id: string;
  };
};

type WidgetDescription = {
  type: "description";
  config: {
    description?: string;
  };
};

type WidgetEventAgenda = {
  type: "eventAgenda";
  config: {
    sections: {
      title: string;
      subheading?: string;
      image?: string;
    }[];
  };
};

type WidgetEventsGrid = {
  type: "eventsGrid";
  config: {
    events: {
      name: string;
      id: string;
      startDate: string | Date;
      endDate: string | Date;
      description?: string;
      picture?: string;
      thumbnail?: string;
    }[];
  };
};

type Widget =
  | WidgetEmbed
  | WidgetDescription
  | WidgetEventAgenda
  | WidgetEventsGrid;

interface WidgetContainerProps {
  widgets: Widget[];
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
  darkMode?: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widgets,
  joinCode,
  hybrid,
  isPopup,
  darkMode = false,
}) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {widgets.map((widget, index) => (
        <div key={index} className="widget-container">
          {widget.type === "eventEmbed" && (
            <EventEmbedWidget
              config={widget.config}
              joinCode={joinCode}
              hybrid={hybrid}
              isPopup={isPopup}
            />
          )}

          {widget.type === "description" && (
            <DescriptionWidget config={widget.config} />
          )}

          {widget.type === "eventAgenda" && (
            <EventAgendaWidget config={widget.config} />
          )}

          {widget.type === "eventsGrid" && (
            <EventsGridWidget config={widget.config} darkMode={darkMode} />
          )}
        </div>
      ))}
    </div>
  );
};
