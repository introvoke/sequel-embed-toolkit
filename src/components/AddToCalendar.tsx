import { Event } from "@src/api/event/event";
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import 'add-to-calendar-button';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { memo } from "react";
interface AddToCalendarButtonProps {
    event: Event;
    joinCode: string | undefined;
  }
  
  const AddToCalendar = ({
    event,
    joinCode,
  }: AddToCalendarButtonProps) => {
    const location =
      event.registration?.customUrl ||
      window.location.origin + window.location.pathname;
    const joinUrl = !joinCode ? location : `${location}?joinCode=${joinCode}`;
    const startDateToTimezone = utcToZonedTime(event.startDate, event.timezone);
    const endDateToTimezone = utcToZonedTime(event.endDate, event.timezone);
  
    return <AddToCalendarButton
    name={event.name}
    options={[
      "Apple",
      "Google",
      "iCal",
      "Microsoft365",
      "Outlook.com",
      "Yahoo",
    ]}
    description={`You are successfully registered for ${event.name}. We look forward to seeing you soon. <br>Join event here: [url]${joinUrl}[/url]`}
    startDate={format(startDateToTimezone, "yyyy-MM-dd")}
    endDate={format(endDateToTimezone, "yyyy-MM-dd")}
    startTime={format(startDateToTimezone, "HH:mm")}
    endTime={format(endDateToTimezone, "HH:mm")}
    location={joinUrl}

   />
  };
  
  export default memo(AddToCalendar);