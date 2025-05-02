import { EventAgendaScheduleItem } from "@src/api/event/event";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import XClose from "./icons/XClose";
import { IconWrapper } from "./IconWrapper";
import CheckPurpleZoomInfo from "./icons/CheckPurpleZoomInfo";

interface BreakoutChoiceModalProps {
  breakouts: EventAgendaScheduleItem[];
  now: Date;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function BreakoutChoiceModal({
  breakouts,
  now,
  onClose,
  onSelect,
}: BreakoutChoiceModalProps) {
  const isBreakoutLive = (breakout: EventAgendaScheduleItem) => {
    const start = new Date(breakout.startDate);
    const end = new Date(breakout.endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[850px] w-full mx-4 relative max-h-[80vh] flex-col flex ">
        <IconButton
          icon={XClose}
          onClick={onClose}
          className="absolute top-4 right-4"
        />
        <div className="px-4 py-3 border-b border-[#D7DAE0] flex-0">
          <h2 className="font-[600] text-[18px] leading-[160%]">
            Choose Your Breakout Session
          </h2>
          <p className="text-[#565E73] text-[14px] leading-[160%]">
            The main sessions have concluded. Please select which breakout
            session you'd like to attend.
          </p>
        </div>

        <div className="p-4 flex flex-col md:flex-row gap-4 overflow-y-auto">
          {breakouts.map((breakout, index) => {
            const isLive = isBreakoutLive(breakout);
            return (
              <div
                key={breakout.eventId}
                className="p-4 bg-[#F8F9FF] text-[#010D39] rounded-md flex-1 flex flex-col gap-4"
              >
                <div className="flex-col flex gap-4 flex-1 items-start">
                  <div className="flex flex-col gap-0.5">
                    {breakout.supheading && (
                      <p className="text-[12px] font-medium leading-[120%]">
                        OPTION {index + 1}
                      </p>
                    )}
                    <h3 className="text-[18px] leading-[120%] font-bold font-figtree">
                      {breakout.heading}
                    </h3>
                  </div>
                  <p className="text-[14px] leading-[160%]">
                    {breakout.content}
                  </p>
                  {breakout.list && (
                    <div className="flex flex-col gap-1 leading-[160%]">
                      {breakout.list.map((item, index) => (
                        <div
                          className="text-[14px] flex flex-row items-start gap-2"
                          key={index}
                        >
                          <IconWrapper
                            size="md"
                            icon={CheckPurpleZoomInfo}
                            className="mt-1.5 w-[14px] h-[10px] min-w-[14px] min-h-[10px] mr-1"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  className="bg-[#FF1B15] hover:enabled:bg-[#FF1B15]/80 focus-visible:enabled:bg-[#FF1B15]/80 active:enabled:bg-[#FF1B15]/80 text-white self-start"
                  onClick={() => onSelect(breakout.url)}
                  disabled={!isLive}
                >
                  {isLive ? "Join Now" : "Not Started Yet"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
