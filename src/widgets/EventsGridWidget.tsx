import React from "react";
import { EventCard, type EventData } from "@src/components/EventGrid";

interface EventsGridWidgetProps {
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
  darkMode?: boolean;
}

export const EventsGridWidget: React.FC<EventsGridWidgetProps> = ({
  config,
  darkMode = false,
}) => {
  // Convert widget events to EventData format
  const events: EventData[] = config.events.map((event) => ({
    uid: event.id,
    name: event.name,
    description: event.description || "",
    picture: event.picture || event.thumbnail || "",
    startDate:
      typeof event.startDate === "string"
        ? event.startDate
        : event.startDate.toISOString(),
    endDate:
      typeof event.endDate === "string"
        ? event.endDate
        : event.endDate.toISOString(),
    timezone: "",
    customUrl: "", // Widget events might not have custom URLs
    isLive: false,
    isEventSeries: false,
    isOnDemand: false,
  }));

  // Determine if events are upcoming based on end date
  const now = new Date();
  const currentDate = now.getTime();

  return (
    <div className={`events-grid-widget ${darkMode ? "dark" : ""}`}>
      <div className="mb-5">
        <h2 className="text-black dark:text-white text-2xl font-bold font-['Inter']">
          Related Events
        </h2>
      </div>
      <div className="w-full max-w-[1280px] inline-flex justify-start items-start gap-4 flex-wrap content-start overflow-hidden">
        {events.map((event) => {
          const eventEndDate = new Date(event.endDate).getTime();
          const isUpcoming = eventEndDate > currentDate;

          return (
            <EventCard
              key={event.uid}
              event={event}
              isUpcoming={isUpcoming}
              showDescription={true}
              darkMode={darkMode}
            />
          );
        })}
      </div>
    </div>
  );
};
