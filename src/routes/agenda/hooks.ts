import { useEffect, useMemo, useRef, useState } from "react";
import { isAfter, isBefore } from "date-fns";

import { useQuery } from "@tanstack/react-query";
import { useIntervalEffect } from "@react-hookz/web";

import { EventAgendaScheduleItem } from "@src/api/event/event";

const startTime = new Date();

export const useCurrentTime = () => {
  const [time, setTime] = useState(startTime);

  useIntervalEffect(() => {
    setTime(new Date());
  }, 1000);

  return time;
};

export const useGroupedSchedule = (schedule: EventAgendaScheduleItem[]) => {
  return useMemo(
    () =>
      Object.values(
        schedule.reduce((acc, item) => {
          const date = item.startDate.toISOString();
          acc[date] = [...(acc[date] || []), item];
          return acc;
        }, {} as Record<string, EventAgendaScheduleItem[]>)
      ),
    [schedule]
  );
};

export const useCurrentTimeScheduleItems = (
  schedule: EventAgendaScheduleItem[],
  now: Date
) => {
  const prevRef = useRef<EventAgendaScheduleItem[]>([]);

  // this is so that we dont cause re-renders with the same results from the .filter as that creates a new array
  return useMemo(() => {
    const next = schedule.filter(
      (item) => isAfter(now, item.startDate) && isBefore(now, item.endDate)
    );

    const prev = prevRef.current;
    const unchanged =
      prev.length === next.length && prev.every((item, i) => item === next[i]);

    if (unchanged) {
      return prev;
    }

    prevRef.current = next;
    return next;
  }, [schedule, now]);
};

export const useCurrentPageSchedule = (
  schedule: EventAgendaScheduleItem[],
  url: string
) =>
  useMemo(
    () =>
      schedule.find((item) => {
        return url.split("//")[1].startsWith(item.url.split("//")[1]);
      }),
    [schedule, url]
  );

interface EventStatusResponse {
  isStreamLive: boolean;
}

export const useManageAgendaRedirect = (
  schedule: EventAgendaScheduleItem[],
  now: Date
  // url: string,
  // setUrl: (url: string) => void
) => {
  const currentPageSchedule = useCurrentPageSchedule(
    schedule,
    window.location.href
  );
  const itemsScheduledForNow = useCurrentTimeScheduleItems(schedule, now);

  const [hasBeenOnPageWhilstScheduled, setHasBeenOnPageWhilstScheduled] =
    useState(false);

  const [waitingToRedirect, setWaitingToRedirect] = useState(false);

  useEffect(() => {
    if (
      !currentPageSchedule ||
      !itemsScheduledForNow ||
      !itemsScheduledForNow.length
    )
      return;

    const isOnPageWhilstScheduled = itemsScheduledForNow.some(
      (item) => item.url === currentPageSchedule.url
    );

    // keep track that we were on the active page whilst live.
    if (isOnPageWhilstScheduled && !hasBeenOnPageWhilstScheduled) {
      setHasBeenOnPageWhilstScheduled(true);
    }

    // if we haven't been on the page whilst live, don't redirect.
    if (!hasBeenOnPageWhilstScheduled) return;

    // if the current page schedule is not the same as the current time schedule, we need to redirect.
    if (!itemsScheduledForNow.includes(currentPageSchedule)) {
      // now we poll the status end point to check if the live really has event has ended.
      setWaitingToRedirect(true);
    }
  }, [currentPageSchedule, itemsScheduledForNow, hasBeenOnPageWhilstScheduled]);

  const { data: eventStatus } = useQuery<EventStatusResponse>({
    queryKey: ["eventStatus", currentPageSchedule?.eventId],
    queryFn: async () => {
      const isStreamLive = Math.random() < 0.3;
      // console.log("isStreamLive", isStreamLive);
      return { isStreamLive };
    },
    enabled: waitingToRedirect && !!currentPageSchedule?.eventId,
    refetchInterval: (query) => (query.state.data?.isStreamLive ? 3000 : false),
  });

  useEffect(() => {
    // only redirect if there is only one item to redirect to.
    if (
      eventStatus &&
      !eventStatus.isStreamLive &&
      itemsScheduledForNow.length === 1 &&
      itemsScheduledForNow[0].url
    ) {
      const targetUrl = new URL(itemsScheduledForNow[0].url);
      targetUrl.search = window.location.search;
      window.location.href = targetUrl.toString();
      // console.log("REDIRECTING TO", targetUrl.toString());
      setHasBeenOnPageWhilstScheduled(false);
      setWaitingToRedirect(false);
      // setUrl(targetUrl.toString());
    }
  }, [eventStatus, itemsScheduledForNow]);
};
