import { differenceInMinutes } from "date-fns";

export const getTimeLabel = (
  now: Date,
  startDate: Date,
  endDate: Date
): string => {
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
};
