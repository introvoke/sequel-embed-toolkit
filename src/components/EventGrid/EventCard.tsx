import React from "react";

export interface EventData {
  uid: string;
  name: string;
  description: string;
  picture: string;
  startDate: string;
  endDate: string;
  timezone: string;
  customUrl: string;
  isLive?: boolean;
  isEventSeries?: boolean;
  isOnDemand?: boolean;
}

interface EventCardProps {
  event: EventData;
  isUpcoming: boolean;
  showDescription: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isUpcoming,
  showDescription,
}) => {
  const isLive = isUpcoming && event.isLive;

  const formatDate = (dateString: string, timezone?: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    const timezoneDisplay = timezone ? ` ${timezone}` : "";

    return `${formattedDate} • ${formattedTime}${timezoneDisplay}`;
  };

  return (
    <div
      className={`w-full rounded-lg border flex flex-col justify-start items-start overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        isLive
          ? "bg-bg-neutral-weak/5 border-border-primary dark:bg-transparent dark:border-border-primary"
          : "bg-white dark:bg-transparent border-gray-200 dark:border-white/20"
      }`}
      onClick={() => window.open(event.customUrl, "_blank")}
    >
      {/* 16:9 aspect ratio container */}
      <div className="self-stretch aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={event.picture || "https://placehold.co/416x234"}
          alt={event.name}
        />
      </div>
      <div className="self-stretch p-4 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
          <div className="self-stretch text-black dark:text-white text-lg font-bold font-['Inter'] leading-7 line-clamp-3">
            {event.name}
          </div>
          {showDescription && event.description && (
            <div
              className="self-stretch text-text-sub/60 dark:text-gray-500 text-sm font-normal font-['Inter'] leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          )}
          <div className="self-stretch text-text-sub/70 dark:text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
            {formatDate(event.startDate, event.timezone)}
            {isLive && (
              <span className="text-green-600 dark:text-green-400 font-medium">
                {" "}
                • Live now
              </span>
            )}
            {event.isEventSeries && (
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                • Event Series
              </span>
            )}
          </div>
        </div>
        <div className="p-2 bg-black dark:bg-white rounded-lg inline-flex justify-center items-center gap-1 overflow-hidden">
          <div className="px-1 flex justify-center items-center gap-2.5">
            <div className="text-white dark:text-black text-sm font-medium font-['Inter'] leading-tight">
              {!isUpcoming ? "Watch now" : "View now"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
