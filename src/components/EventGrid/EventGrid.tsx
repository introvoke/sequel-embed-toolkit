import React, { useState, useEffect } from "react";
import { EventSection } from "./EventSection";
import type { EventData } from "./EventCard";

interface EventGridData {
  upcoming: {
    events: EventData[];
    total: number;
    page: number;
    hasMore: boolean;
  };
  past: {
    events: EventData[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}

interface EventGridProps {
  companyId: string;
  darkMode?: boolean;
  excludeText?: string;
  showDescription?: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({
  companyId,
  darkMode = false,
  excludeText = "",
  showDescription = false,
}) => {
  const [data, setData] = useState<EventGridData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const fetchEvents = async (upcomingPageNum: number, pastPageNum: number) => {
    const params = new URLSearchParams({
      upcomingPage: upcomingPageNum.toString(),
      pastPage: pastPageNum.toString(),
      pageSize: "9",
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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const result = await fetchEvents(1, 1);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [companyId, excludeText]);

  const loadMoreUpcoming = async () => {
    if (!data || loading) return;

    try {
      setLoading(true);
      const nextPage = upcomingPage + 1;
      const result = await fetchEvents(nextPage, pastPage);

      setData({
        ...data,
        upcoming: {
          ...result.upcoming,
          events: [...data.upcoming.events, ...result.upcoming.events],
        },
      });
      setUpcomingPage(nextPage);
    } catch (err) {
      console.error("Error loading more upcoming events:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePast = async () => {
    if (!data || loading) return;

    try {
      setLoading(true);
      const nextPage = pastPage + 1;
      const result = await fetchEvents(upcomingPage, nextPage);

      setData({
        ...data,
        past: {
          ...result.past,
          events: [...data.past.events, ...result.past.events],
        },
      });
      setPastPage(nextPage);
    } catch (err) {
      console.error("Error loading more past events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div
        className={`flex justify-center items-center p-8 ${
          darkMode ? "dark" : ""
        }`}
      >
        <div className="text-black dark:text-white">Loading events...</div>
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
          Failed to load events. Please try again later.
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`font-['Inter'] min-h-full ${darkMode ? "dark" : ""}`}>
      <div className="p-6">
        <EventSection
          title="Upcoming Events"
          events={data.upcoming.events}
          hasMore={data.upcoming.hasMore}
          onLoadMore={loadMoreUpcoming}
          isUpcoming={true}
          showDescription={showDescription}
          loading={loading}
        />
        <EventSection
          title="Past Events"
          events={data.past.events}
          hasMore={data.past.hasMore}
          onLoadMore={loadMorePast}
          isUpcoming={false}
          showDescription={showDescription}
          loading={loading}
        />
      </div>
    </div>
  );
};






