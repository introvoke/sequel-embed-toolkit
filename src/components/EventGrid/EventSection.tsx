import React from "react";
import { EventCard, type EventData } from "./EventCard";

interface EventSectionProps {
  title: string;
  events: EventData[];
  hasMore: boolean;
  onLoadMore: () => void;
  isUpcoming: boolean;
  showDescription: boolean;
  loading: boolean;
  darkMode?: boolean;
}

export const EventSection: React.FC<EventSectionProps> = ({
  title,
  events,
  hasMore,
  onLoadMore,
  isUpcoming,
  showDescription,
  loading,
  darkMode = false,
}) => {
  if (events.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-black dark:text-white text-2xl font-bold font-['Inter'] mb-5">
        {title}
      </h2>
      <div className="w-full max-w-[1280px] inline-flex justify-start items-start gap-4 flex-wrap content-start overflow-hidden">
        {events.map((event) => (
          <EventCard
            key={event.uid}
            event={event}
            isUpcoming={isUpcoming}
            showDescription={showDescription}
            darkMode={darkMode}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="p-2.5 bg-transparent rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 dark:outline-white/30 inline-flex justify-center items-center gap-1 overflow-hidden disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <div className="px-1 flex justify-center items-center gap-2.5">
              <div className="text-black dark:text-white text-sm font-medium font-['Inter'] leading-tight">
                {loading ? "Loading..." : "Load more"}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};






