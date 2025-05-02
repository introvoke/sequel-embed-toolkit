import { EventAgenda } from "../../api/event/event";
import { useCurrentTime, useGroupedSchedule } from "./hooks";

import { Agenda } from "@src/components/AgendaZoomInfo";

export const ZoomInfoAgendaContainer = ({
  agenda,
}: {
  agenda: EventAgenda;
}) => {
  const { heading, subheading, schedule } = agenda;
  const now = useCurrentTime();
  const groupedSchedule = useGroupedSchedule(schedule);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
        rel="stylesheet"
      />
      {/* {url} */}
      <Agenda.Container
        heading={heading}
        subheading={subheading}
        schedule={groupedSchedule}
        now={now}
      />
    </>
  );
};
