import { isBefore, isAfter, formatDistanceToNowStrict } from "date-fns";

import { cn } from "@src/styles/utils";
import { IconWrapper } from "@src/components/IconWrapper";
import ClockStopwatch from "@src/components/icons/ClockStopwatch";
import Signal01 from "@src/components/icons/Signal01";
import Check from "@src/components/icons/Check";
import CheckPurpleZoomInfo from "@src/components/icons/CheckPurpleZoomInfo";
import { EventAgenda, EventAgendaScheduleItem } from "@src/api/event/event";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { BreakoutChoiceModal } from "./BreakoutChoiceModal";

const getStatus = (
  now: Date,
  start: Date,
  end: Date
): { label: string; status: "upcoming" | "live" | "ended" } => {
  if (isBefore(now, start)) {
    return {
      label: `Live in: ${formatDistanceToNowStrict(start)}`,
      status: "upcoming",
    };
  }
  if (isAfter(now, end)) {
    return { label: "Ended", status: "ended" };
  }
  return { label: "Live now", status: "live" };
};

interface AgendaItemsProps {
  items: EventAgendaScheduleItem[];
  now: Date;
  isMainSession: boolean;
  showReplayButton: boolean;
  showJoinButton: boolean;
}

function AgendaItems({
  items,
  now,
  isMainSession,
  showReplayButton,
  showJoinButton,
}: AgendaItemsProps) {
  const [first] = items;
  const { label, status } = getStatus(
    now,
    new Date(first.startDate),
    new Date(first.endDate)
  );
  const isLive = status === "live";
  const isEnded = status === "ended";

  // Only show buttons if:
  // 1. For main sessions: when all main sessions are over (showReplayButton)
  // 2. For breakouts: when main sessions are over and breakouts are not over (showJoinButton)
  const shouldShowButton =
    (isMainSession && showReplayButton) || (!isMainSession && showJoinButton);

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-0">
      <div className="flex flex-1 flex-col gap-1 md:gap-2 md:max-w-[300px] md:w-[20%] md:min-w-[100px] max-w-full w-full min-w-full">
        <h2 className="flex items-center flex-row font-bold text-[24px] leading-[120%] text-[#010D39] relative">
          <div className="absolute -left-[18px] h-1.5 w-1.5 bg-[#FF1B15] rounded-full z-1"></div>
          {first.title}
        </h2>
        <span
          className={cn(
            "text-[16px] flex flex-row items-center gap-2 text-[#010D39]",
            isLive && "text-[#FF1B15]",
            isEnded && "text-[#0094FF]"
          )}
        >
          <IconWrapper
            size="md"
            icon={isLive ? Signal01 : isEnded ? Check : ClockStopwatch}
          />
          <span>{label}</span>
        </span>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {items.map((block, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4 p-4 md:p-6 relative text-[#202B52] rounded-xl",
              block.coverImage
                ? "md:pr-40 lg:pr-[200px] pb-[110px] md:pb-6"
                : "",
              items.length > 1 ? "bg-[#F8F9FF]" : "bg-[#E6EFFF]"
            )}
          >
            <div className="flex-col flex gap-4  items-start">
              <div className="flex flex-col gap-0.5">
                {block.supheading && (
                  <p className="text-[16px] font-medium leading-[160%]">
                    {block.supheading}
                  </p>
                )}
                <h3 className="text-[24px] leading-[120%] font-bold font-figtree">
                  {block.heading}
                </h3>
              </div>
              <p className="text-[16px] mt- leading-[160%]">{block.content}</p>
              {block.list && (
                <div className="flex flex-col gap-1 leading-[160%]">
                  {block.list.map((item, index) => (
                    <div
                      className="text-[16px] flex flex-row items-start gap-2 leading-[160%]"
                      key={index}
                    >
                      <IconWrapper
                        size="sm"
                        icon={CheckPurpleZoomInfo}
                        className="mt-1.5 w-[14px] h-[10px] min-w-[14px] min-h-[10px] mr-1"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {shouldShowButton && (
                <Button
                  className="bg-[#FF1B15] hover:enabled:bg-[#FF1B15]/80 focus-visible:enabled:bg-[#FF1B15]/80 active:enabled:bg-[#FF1B15]/80 text-white"
                  onClick={() => {
                    const url = new URL(block.url);
                    url.search = window.location.search;
                    window.location.href = url.toString();
                  }}
                >
                  {isMainSession ? "Watch Replay" : "Join Now"}
                </Button>
              )}
            </div>

            {block.coverImage && (
              <div className="absolute bottom-0 md:right-4 w-32 lg:w-[170px]">
                <img
                  src={block.coverImage}
                  alt={block.heading}
                  className="object-contain w-full h-auto "
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

AgendaItems.displayName = "Agenda.Items";

function AgendaHeader({
  heading,
  subheading,
}: Pick<EventAgenda, "heading" | "subheading">) {
  return (
    <header className="flex flex-col gap-2 text-center max-w-[720px] mx-auto text-[#010D39] leading-[120%]">
      <h2 className="text-4xl font-[800]">{heading}</h2>
      <p className="text-[16px] text-gray-500 leading-[160%]">{subheading}</p>
    </header>
  );
}
AgendaHeader.displayName = "Agenda.Header";

interface AgendaScheduleProps {
  schedule: Array<EventAgendaScheduleItem[]>;
  now: Date;
}

function AgendaScheduleContainer({ schedule, now }: AgendaScheduleProps) {
  const [showBreakoutModal, setShowBreakoutModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Split schedule into main sessions and breakouts
  const mainSessions = schedule.slice(0, 4);
  const breakouts = schedule.slice(4);

  // Check if all main sessions are over
  const allMainSessionsOver = mainSessions.every((sessionGroup) =>
    sessionGroup.every((session) => isAfter(now, new Date(session.endDate)))
  );

  // Check if any breakout is live
  const hasLiveBreakout = breakouts.some((sessionGroup) =>
    sessionGroup.some((session) => {
      const start = new Date(session.startDate);
      const end = new Date(session.endDate);
      return now >= start && now <= end;
    })
  );

  // Show modal when main sessions end and it hasn't been shown yet
  useEffect(() => {
    if (
      allMainSessionsOver &&
      !hasShownModal &&
      (window.location.href.startsWith(schedule[0][0].url) ||
        window.IS_STORYBOOK)
    ) {
      setShowBreakoutModal(true);
      setHasShownModal(true);
    }
  }, [allMainSessionsOver, hasShownModal]);

  const handleBreakoutSelect = (url: string) => {
    if (window.IS_STORYBOOK) {
      alert(url);
    } else {
      const fullUrl = new URL(url);
      fullUrl.search = window.location.search;
      window.location.href = fullUrl.toString();
    }
  };
  return (
    <div className="mx-auto w-full mt-8 flex flex-col gap-12">
      <div className="flex flex-col gap-12 relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 border-r border-dashed border-[#3F486B50] z-0"></div>
        {mainSessions.map((items, index) => (
          <AgendaItems
            key={index}
            items={items}
            now={now}
            isMainSession={true}
            showReplayButton={allMainSessionsOver}
            showJoinButton={false}
          />
        ))}
        {breakouts.map((items, index) => (
          <AgendaItems
            key={`breakout-${index}`}
            items={items}
            now={now}
            isMainSession={false}
            showReplayButton={false}
            showJoinButton={allMainSessionsOver && hasLiveBreakout}
          />
        ))}
      </div>
      {showBreakoutModal && (
        <BreakoutChoiceModal
          breakouts={breakouts.flat()}
          now={now}
          onClose={() => setShowBreakoutModal(false)}
          onSelect={handleBreakoutSelect}
        />
      )}
    </div>
  );
}
AgendaScheduleContainer.displayName = "Agenda.Schedule";

interface AgendaContainerProps {
  heading: string;
  subheading: string;
  schedule: Array<EventAgendaScheduleItem[]>;
  now: Date;
}

function AgendaContainer({
  heading,
  subheading,
  schedule,
  now,
}: AgendaContainerProps) {
  return (
    <section className="w-full px-4 max-w-[1200px] mx-auto font-figtree [&_*]:font-figtree">
      <AgendaHeader heading={heading} subheading={subheading} />
      <AgendaScheduleContainer schedule={schedule} now={now} />
    </section>
  );
}

AgendaContainer.displayName = "Agenda.Container";

export const Agenda = Object.assign(AgendaContainer, {
  Container: AgendaContainer,
  Header: AgendaHeader,
  Schedule: AgendaScheduleContainer,
  Items: AgendaItems,
});
