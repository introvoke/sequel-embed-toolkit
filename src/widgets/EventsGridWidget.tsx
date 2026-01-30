import React from "react";
import { EventCard, type EventData } from "@src/components/EventGrid";
import type { AppRouter } from "@introvoke/sequel-trpc";
import { ApiConfig } from "@src/api/apiConfig";

// Infer types from tRPC API
type GetWidgetsOutput =
  AppRouter["widgets"]["getWidgets"]["_def"]["_output_out"];
type ApiWidget = GetWidgetsOutput["widgets"][number];
type EventGridWidget = Extract<ApiWidget, { type: "eventGrid" }>;

interface EventsGridWidgetProps {
  widget: EventGridWidget;
}

export const EventsGridWidget: React.FC<EventsGridWidgetProps> = ({
  widget,
}) => {
  const events = widget.data?.events ?? [];
  const config = widget.config as typeof widget.config & {
    title?: string;
  };
  const title = config?.title;
  const cardsToDisplay = config?.cardsToDisplay;

  const limitedEvents =
    typeof cardsToDisplay === "number"
      ? events.slice(0, cardsToDisplay)
      : events;

  // Convert widget events to EventData format
  const normalizedEvents: EventData[] = limitedEvents.map((event) => {
    // Use customUrl if present, otherwise construct Sequel URL using app.sequel.io
    const demoSiteUrl = ApiConfig.GetDemoSiteUrl();
    const sequelUrl = `${demoSiteUrl}/event/${event.id}`;
    const eventUrl = (event as typeof event & { customUrl?: string }).customUrl || sequelUrl;

    return {
      uid: event.id,
      name: event.name,
      description: event.description || "",
      picture: event.picture || event.thumbnail || "",
      // Dates come as strings from JSON serialization, handle both cases
      startDate:
        typeof event.startDate === "string"
          ? event.startDate
          : event.startDate.toISOString(),
      endDate:
        typeof event.endDate === "string"
          ? event.endDate
          : event.endDate.toISOString(),
      timezone: "",
      customUrl: eventUrl,
      isLive: false,
      isEventSeries: false,
      isOnDemand: false,
    };
  });

  // Determine if events are upcoming based on end date
  const now = new Date();
  const currentDate = now.getTime();

  if (normalizedEvents.length === 0) {
    return null;
  }

  return (
    <div className="@container w-full">
      {/* Grid Title */}
      {title && (
        <h2 className="mb-6 text-left text-heading-md">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 @[600px]:grid-cols-2 @[900px]:grid-cols-3">
        {normalizedEvents.map((event) => {
          const eventEndDate = new Date(event.endDate).getTime();
          const isUpcoming = eventEndDate > currentDate;

          return (
            <EventCard
              key={event.uid}
              event={event}
              isUpcoming={isUpcoming}
              showDescription={true}
            />
          );
        })}
      </div>
    </div>
  );
};
