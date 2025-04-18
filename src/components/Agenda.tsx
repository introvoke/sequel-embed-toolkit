import { isBefore, isAfter, formatDistanceToNowStrict } from "date-fns";

import { cn } from "@src/styles/utils";
import { IconWrapper } from "@src/components/IconWrapper";
import ClockStopwatch from "@src/components/icons/ClockStopwatch";
import Signal01 from "@src/components/icons/Signal01";
import Check from "@src/components/icons/Check";
import { EventAgenda, EventAgendaScheduleItem } from "@src/api/event/event";
import { Button } from "./Button";
import Stop from "./icons/Stop";

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
}

function AgendaItems({ items, now }: AgendaItemsProps) {
  const [first] = items;
  const { label, status } = getStatus(
    now,
    new Date(first.startDate),
    new Date(first.endDate)
  );
  const isLive = status === "live";
  const isEnded = status === "ended";

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
            icon={isLive ? Signal01 : isEnded ? Stop : ClockStopwatch}
          />
          <span>{label}</span>
        </span>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {items.map((block, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4 rounded-lg p-4 md:p-6 relative",
              block.coverImage
                ? "md:pr-40 lg:pr-[200px] pb-[110px] md:pb-6"
                : "",
              items.length > 1 ? "bg-[#F8F9FF]" : "bg-[#E6EFFF]"
            )}
          >
            <div className="flex-col flex gap-4  items-start">
              <div className="flex flex-col gap-0.5">
                {block.supheading && (
                  <p className="text-[16px] font-medium leading-[120%] text-[#010D39]">
                    {block.supheading}
                  </p>
                )}
                <h3 className="text-[24px] leading-[120%] font-bold text-[#010D39] font-figtree">
                  {block.heading}
                </h3>
              </div>
              <p className="text-[16px] text-[#010D39] mt-2">{block.content}</p>
              {block.list && (
                <div className="flex flex-col gap-1">
                  {block.list.map((item, index) => (
                    <div
                      className="text-[16px] text-[#010D39] flex flex-row items-center gap-2"
                      key={index}
                    >
                      <IconWrapper
                        size="md"
                        icon={Check}
                        className="text-[#A109BA]"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {isLive && items.length > 1 && (
                <Button
                  onClick={() => {
                    const url = new URL(items[0].url);
                    url.search = window.location.search;
                    window.location.href = url.toString();
                  }}
                >
                  Join Now
                </Button>
              )}
            </div>

            {block.coverImage && (
              <div className="absolute bottom-0 md:right-4 w-32 lg:w-[170px]">
                <img
                  src={block.coverImage}
                  alt={block.heading}
                  className="object-contain w-full h-auto rounded-md"
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
    <header className="flex flex-col gap-2 text-center max-w-[720px] mx-auto text-[#010D39]">
      <h2 className="text-4xl font-bold">{heading}</h2>
      <p className="text-sm text-gray-500">{subheading}</p>
    </header>
  );
}
AgendaHeader.displayName = "Agenda.Header";

interface AgendaScheduleProps {
  schedule: Array<EventAgendaScheduleItem[]>;
  now: Date;
}

function AgendaScheduleContainer({ schedule, now }: AgendaScheduleProps) {
  return (
    <div className="mx-auto w-full mt-8 flex flex-col gap-12">
      <div className="flex flex-col gap-12 relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 border-r border-dashed border-[#3F486B50] z-0"></div>
        {schedule.map((items, index) => (
          <AgendaItems key={index} items={items} now={now} />
        ))}
      </div>
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
