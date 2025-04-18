import { useEffect, useMemo, useState } from "react";
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
) =>
  useMemo(
    () =>
      schedule.filter((item) => {
        return isAfter(now, item.startDate) && isBefore(now, item.endDate);
      }),
    [schedule, now]
  );

export const useCurrentPageSchedule = (schedule: EventAgendaScheduleItem[]) =>
  useMemo(
    () =>
      schedule.find((item) => {
        return item.url
          .split("//")[1]
          .startsWith(window.location.href.split("//")[1]);
      }),
    [schedule]
  );

interface EventStatusResponse {
  isStreamLive: boolean;
}

export const useManageAgendaRedirect = (
  schedule: EventAgendaScheduleItem[],
  now: Date
) => {
  const currentPageSchedule = useCurrentPageSchedule(schedule);
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
      return { isStreamLive: Math.random() < 0.86 };
    },
    enabled: waitingToRedirect && !!currentPageSchedule?.eventId,
    refetchInterval: (query) => (query.state.data?.isStreamLive ? 300 : false),
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
    }
  }, [eventStatus, itemsScheduledForNow]);
};
