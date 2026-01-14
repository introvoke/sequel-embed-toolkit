import React, { useState, useEffect } from "react";
import { EventCard, type EventData } from "./EventCard";

interface RelatedEventsProps {
  companyId: string;
  darkMode?: boolean;
  excludeText?: string;
  showDescription?: boolean;
  maxEvents?: number;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({
  companyId,
  darkMode = false,
  excludeText = "",
  showDescription = false,
  maxEvents = 6,
}) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedEvents = async () => {
    // Fetch enough events to filter out current event and still have maxEvents
    const params = new URLSearchParams({
      upcomingPage: "1",
      pastPage: "1",
      pageSize: (maxEvents + 5).toString(), // Fetch extra to account for filtering
    });

    if (excludeText.trim()) {
      params.append("exclude", excludeText.trim());
    }

    const response = await fetch(
      `https://api.introvoke.com/api/v3/companies/${companyId}/gridEvents?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  };

  const getCurrentPageUrl = () => {
    return window.location.href;
  };

  const filterCurrentEvent = (allEvents: EventData[]) => {
    const currentUrl = getCurrentPageUrl();

    return allEvents.filter((event) => {
      if (!event.customUrl) return true;

      // Check if the current URL matches or contains the event's custom URL
      // This handles cases where the event URL might be a path within the current domain
      try {
        const eventUrl = new URL(event.customUrl);
        const currentUrlObj = new URL(currentUrl);

        // Compare full URLs
        if (eventUrl.href === currentUrlObj.href) {
          return false;
        }

        // Compare paths if they're on the same domain
        if (
          eventUrl.hostname === currentUrlObj.hostname &&
          eventUrl.pathname === currentUrlObj.pathname
        ) {
          return false;
        }

        return true;
      } catch (e) {
        // If URL parsing fails, do a simple string comparison
        return !currentUrl.includes(event.customUrl);
      }
    });
  };

  const selectBestEvents = (
    upcomingEvents: EventData[],
    pastEvents: EventData[]
  ) => {
    // Filter out current event from both arrays
    const filteredUpcoming = filterCurrentEvent(upcomingEvents);
    const filteredPast = filterCurrentEvent(pastEvents);

    let selectedEvents: EventData[] = [];

    // First, add upcoming events
    selectedEvents = [...filteredUpcoming];

    // If we need more events, add past events
    if (selectedEvents.length < maxEvents) {
      const remainingSlots = maxEvents - selectedEvents.length;
      selectedEvents = [
        ...selectedEvents,
        ...filteredPast.slice(0, remainingSlots),
      ];
    }

    // Trim to exact count if we have too many
    return selectedEvents.slice(0, maxEvents);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchRelatedEvents();

        const selectedEvents = selectBestEvents(
          data.upcoming.events || [],
          data.past.events || []
        );

        setEvents(selectedEvents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [companyId, excludeText, maxEvents]);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center p-8 ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="text-black dark:text-white">
          Loading related events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center p-8 ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="text-black dark:text-white">
          Failed to load related events.
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className={`flex justify-center items-center p-8 ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="text-black dark:text-white">
          No related events available.
        </div>
      </div>
    );
  }

  return (
    <div className={`font-['Inter'] ${darkMode ? "dark" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          const currentDate = new Date();
          const eventEndDate = new Date(event.endDate);
          const isUpcoming = eventEndDate > currentDate;

          return (
            <EventCard
              key={event.uid}
              event={event}
              isUpcoming={isUpcoming}
              showDescription={showDescription}
            />
          );
        })}
      </div>
    </div>
  );
};






