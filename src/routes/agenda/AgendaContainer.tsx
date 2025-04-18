import { EventAgenda } from "../../api/event/event";
import {
  useCurrentTime,
  useGroupedSchedule,
  useManageAgendaRedirect,
} from "./hooks";

import { Agenda } from "@src/components/Agenda";
export const AgendaContainer = ({ agenda }: { agenda: EventAgenda }) => {
  const { heading, subheading, schedule } = agenda;
  const now = useCurrentTime();
  const groupedSchedule = useGroupedSchedule(schedule);
  // const [url, setUrl] = useState<string>(groupedSchedule[0][0].url);
  useManageAgendaRedirect(schedule, now); //) url, setUrl);

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
