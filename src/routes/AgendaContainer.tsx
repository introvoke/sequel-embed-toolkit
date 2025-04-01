import type { Agenda, AgendaScheduleItem } from "../api/event/event";

import { differenceInMinutes } from "date-fns";

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

  return (
    <div className="flex flex-col gap-4 py-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-2">
        <h2 className="font-medium text-[#010D39]">{item.title}</h2>
        <span className="text-xs text-red-500">{label}</span>
      </div>

      <div className="flex flex-col gap-8">
        {item.blocks.map((block, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {block.supheading && (
                <p className="text-sm font-semibold text-gray-600">
                  {block.supheading}
                </p>
              )}
              <h3 className="text-lg font-bold text-[#010D39]">
                {block.heading}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{block.content}</p>
            </div>

            {block.coverImage && (
              <div className="flex-shrink-0 w-full md:w-32 lg:w-40">
                <img
                  src={block.coverImage}
                  alt={block.heading}
                  className="object-cover w-full h-auto rounded-md"
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
    <div className="max-w-[720px] mx-auto w-full mt-8">
      {schedule.map((item, index) => (
        <AgendaItem key={index} item={item} />
      ))}
    </div>
  );
};

export const AgendaContainer = ({ agenda }: { agenda: Agenda }) => {
  return (
    <div>
      <AgendaHeader heading={agenda.heading} subheading={agenda.subheading} />
      <AgendaSchedule schedule={agenda.schedule} />
    </div>
  );
};
