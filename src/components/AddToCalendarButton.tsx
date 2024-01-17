import "add-to-calendar-button";
import { Event } from "@src/api/event/event";
import { atcb_action } from "add-to-calendar-button";
import { format, utcToZonedTime } from "date-fns-tz";
import { memo } from "react";
import { Button, ButtonProps } from "@introvoke/react";

interface AddToCalendarButtonProps extends ButtonProps {
  event: Event;

  joinCode: string | undefined;
}

const AddToCalendarButton = ({
  event,
  joinCode,
  ...props
}: AddToCalendarButtonProps) => {
  const location =
    event.registration?.customUrl ||
    `https://embed.sequel.io/event/${event.uid}`;
  const joinUrl = `${location}?joinCode=${joinCode}`;
  const startDateToTimezone = utcToZonedTime(event.startDate, event.timezone);
  const endDateToTimezone = utcToZonedTime(event.endDate, event.timezone);

  return (
    <Button
      onClick={(e) => {
        try {
          e.preventDefault();

          atcb_action({
            name: event.name,
            size: "4",
            description: `You are successfully registered for ${event.name}. We look forward to seeing you soon. <br>Join event here: [url]${joinUrl}[/url]`,
            startDate: format(startDateToTimezone, "yyyy-MM-dd"),
            endDate: format(endDateToTimezone, "yyyy-MM-dd"),
            startTime: format(startDateToTimezone, "HH:mm"),
            endTime: format(endDateToTimezone, "HH:mm"),
            location: joinUrl,
            options: [
              "Apple",
              "Google",
              "iCal",
              "Microsoft365",
              "Outlook.com",
              "Yahoo",
            ],
            timeZone: event.timezone,
            iCalFileName: "Reminder-Event",
          });
        } catch (error) {
          // ignore error, nothing we can do
        }
      }}
      {...props}
    ></Button>
  );
};

export default memo(AddToCalendarButton);
