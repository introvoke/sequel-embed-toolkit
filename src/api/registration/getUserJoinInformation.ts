import axios from "axios";
import { ApiConfig } from "@src/api/apiConfig";

interface UserJoinInformationRequest {
  eventId: string;
  joinCode: string;
}

interface UserJoinInformationResponse {
  uid: string;
  name: string;
  email: string;
  join_url: string;
  joinCode: string;
  authToken?: string;
  metadata?: unknown;
}

export const getUserJoinInformation = async ({
  eventId,
  joinCode,
}: UserJoinInformationRequest): Promise<UserJoinInformationResponse> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}/join/${joinCode}`;
  const response = await axios.get(configUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data: UserJoinInformationResponse = await response.data;
  return data;
};

export const getUserEmailFromJoinCode = async ({
  joinCode,
}: { joinCode: string }): Promise<string> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/joinCodeEmail/${joinCode}`;
  const response = await axios.get(configUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data: string = await response.data;
  return data;
};
