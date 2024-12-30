import axios from "axios";
import { ApiConfig } from "@src/api/apiConfig";

interface RegisterUserRequest {
  name: string;
  email: string;
  eventId: string;
}
interface RegisterMarketoAttendeeRequest {
  name: string;
  email: string;
  formId: string;
  companyId: string;
}
interface RegisterMarketoAttendeeResponse {
  joinUrl: string;
  authToken: string;
  joinCode: string;
  email: string;
}

export const registerUser = async ({
  name,
  email,
  eventId
}: RegisterUserRequest): Promise<RegisterMarketoAttendeeResponse> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}/registrant`;
  const response = await axios.post(configUrl, {
    name,
    email,
    resendInvite: true,
    ignoreCustomQuestions: true
  });
  const data: RegisterMarketoAttendeeResponse = await response.data;
  return data;
};

export const registerMarketoAttendee = async ({
  name,
  email,
  formId,
  companyId,
}: RegisterMarketoAttendeeRequest): Promise<RegisterMarketoAttendeeResponse> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/registrant/marketo`;
  const response = await axios.post(configUrl, {
    name,
    email,
    formId,
    url: window.location.href.split("?")[0],
    companyId,
  });
  const data: RegisterMarketoAttendeeResponse = await response.data;
  return data;
};
