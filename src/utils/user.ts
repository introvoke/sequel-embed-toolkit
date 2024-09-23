import { getSequelJoinCodeCookie, setSequelJoinCodeCookie } from "./cookie";
import { getURLParameter } from "./url";

interface ValidatedJoinCodeParams {
  eventId: string;
}

export const getValidatedJoinCode = async ({
  eventId,
}: ValidatedJoinCodeParams): Promise<string | null> => {
  const joinCode = getURLParameter("joinCode") || getURLParameter("joincode") || getSequelJoinCodeCookie(eventId);
  if (joinCode && joinCode !== "undefined") {
    setSequelJoinCodeCookie(eventId, joinCode);
    return joinCode;
  }
  return null;
};
