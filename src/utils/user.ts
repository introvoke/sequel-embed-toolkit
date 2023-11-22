import registrationApi from "@src/api/registration";
import { getSequelJoinCodeCookie, setSequelJoinCodeCookie } from "./cookie";
import { getURLParameter } from "./url";

interface ValidatedJoinCodeParams {
  eventId: string;
}

export const getValidatedJoinCode = async ({
  eventId,
}: ValidatedJoinCodeParams): Promise<string | null> => {
  const joinCode = getURLParameter("joinCode") || getSequelJoinCodeCookie(eventId);
  if (joinCode) {
    const userInfo = await registrationApi.getUserJoinInformation({
      eventId,
      joinCode,
    });
    setSequelJoinCodeCookie(eventId, userInfo.joinCode);
    return userInfo.joinCode;
  }
  return null;
};
