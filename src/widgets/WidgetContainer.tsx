import React from "react";
import { EventEmbedWidget } from "./EventEmbedWidget";
import { DescriptionWidget } from "./DescriptionWidget";
import { EventAgendaWidget } from "./EventAgendaWidget";
import { EventsGridWidget } from "./EventsGridWidget";
import { SpeakerWidget } from "./SpeakerWidget";
import { AgendaWidget } from "./AgendaWidget";
import { CountdownWidget } from "./CountdownWidget";
import type { AppRouter } from "@introvoke/sequel-trpc";

// Infer widget types from tRPC API
type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];

// Extract the widgets array element type from the API
type ApiWidget = GetWidgetsOutput["widgets"][number];

// Local-only widgets not in API
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

type LocalEventEmbed = {
  type: "eventEmbed";
  data?: { eventId: string };
  config?: { id: string };
};

type LocalDescription = {
  type: "description";
  data: {
    html: string;
  };
  config: {
    horizontalSpacing?: "none" | "small" | "medium" | "large";
    fontColor?: string;
  };
};

// Combine API widgets with local-only widgets
type Widget = ApiWidget | WidgetEventAgenda | LocalEventEmbed | LocalDescription;

interface WidgetContainerProps {
  widgets: Widget[];
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widgets,
  joinCode,
  hybrid,
  isPopup,
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-[1280px]">
      {widgets.map((widget, index) => (
        <div key={index} className="w-full">
          {widget.type === "eventEmbed" && (
            <EventEmbedWidget
              widget={
                "data" in widget && widget.data?.eventId
                  ? widget
                  : ({
                      type: "eventEmbed",
                      data: {
                        eventId: (widget as LocalEventEmbed).config?.id || "",
                      },
                    } as any)
              }
              joinCode={joinCode}
              hybrid={hybrid}
              isPopup={isPopup}
            />
          )}

          {widget.type === "description" && (
            <DescriptionWidget widget={widget as LocalDescription} />
          )}

          {widget.type === "eventAgenda" && (
            <EventAgendaWidget config={widget.config} />
          )}

          {widget.type === "eventGrid" && <EventsGridWidget widget={widget} />}

          {widget.type === "speaker" && <SpeakerWidget widget={widget} />}

          {widget.type === "agenda" && <AgendaWidget widget={widget} />}

          {widget.type === "countdown" && <CountdownWidget widget={widget} />}
        </div>
      ))}
    </div>
  );
};
