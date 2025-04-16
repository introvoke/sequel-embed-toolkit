import { cn } from "@src/styles/utils";
import type { Agenda, AgendaScheduleItem } from "../api/event/event";

import { differenceInMinutes } from "date-fns";
import { IconWrapper } from "@src/components/IconWrapper";
import ClockStopwatch from "@src/components/icons/ClockStopwatch";
import Signal01 from "@src/components/icons/Signal01";
import Check from "@src/components/icons/Check";

interface AgendaItemProps {
  item: AgendaScheduleItem;
}

function getTimeLabel(startDate: Date, endDate: Date): string {
  const now = new Date();

  if (now >= startDate && now <= endDate) {
    return "Live";
  }

  if (now < startDate) {
    const diff = differenceInMinutes(startDate, now);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0) {
      return `Live in ${hours} hour${hours > 1 ? "s" : ""}${
        minutes > 0 ? `, ${minutes} minute${minutes > 1 ? "s" : ""}` : ""
      }`;
    } else {
      return `Live in ${diff} minute${diff !== 1 ? "s" : ""}`;
    }
  }

  return "Ended";
}

export const AgendaItem = ({ item }: AgendaItemProps) => {
  const label = getTimeLabel(item.startDate, item.endDate);
  const isLive = label === "Live";

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-0">
      <div className="flex flex-1 flex-col gap-1 md:gap-2 md:max-w-[300px] md:w-[20%] md:min-w-[100px] max-w-full w-full min-w-full">
        <h2 className="flex items-center flex-row font-bold text-[24px] leading-[120%] text-[#010D39] relative">
          <div className="absolute -left-[18px] h-1.5 w-1.5 bg-[#FF1B15] rounded-full z-1"></div>
          {item.title}
        </h2>
        <span
          className={cn(
            "text-[16px] flex flex-row items-center gap-2",
            isLive ? "text-[#FF1B15]" : "text-[#010D39]"
          )}
        >
          <IconWrapper size="md" icon={isLive ? Signal01 : ClockStopwatch} />
          <span>{label}</span>
        </span>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {item.blocks.map((block, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4 rounded-lg p-4 md:p-6 relative",
              block.coverImage
                ? "md:pr-40 lg:pr-[200px] pb-[110px] md:pb-6"
                : "",
              item.blocks.length > 1 ? "bg-[#F8F9FF]" : "bg-[#E6EFFF]"
            )}
          >
            <div className={cn("flex-1 flex-col flex gap-4")}>
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
};

const AgendaHeader = ({
  heading,
  subheading,
}: Pick<Agenda, "heading" | "subheading">) => {
  return (
    <div className="flex flex-col gap-2 text-center max-w-[720px] mx-auto text-[#010D39]">
      <h1 className="text-4xl font-bold">{heading}</h1>
      <p className="text-sm text-gray-500">{subheading}</p>
    </div>
  );
};

interface AgendaScheduleProps {
  schedule: AgendaScheduleItem[];
}

const AgendaSchedule = ({ schedule }: AgendaScheduleProps) => {
  return (
    <div className="mx-auto w-full mt-8 flex flex-col gap-12">
      <div className="flex flex-col gap-12 relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 border-r border-dashed border-[#3F486B50] z-0"></div>
        {schedule.map((item, index) => (
          <AgendaItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export const AgendaContainer = ({ agenda }: { agenda: Agenda }) => {
  return (
    <div className="w-full px-4 max-w-[1200px] mx-auto font-figtree [&_*]:font-figtree">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
        rel="stylesheet"
      />
      <AgendaHeader heading={agenda.heading} subheading={agenda.subheading} />
      <AgendaSchedule schedule={agenda.schedule} />
    </div>
  );
};
