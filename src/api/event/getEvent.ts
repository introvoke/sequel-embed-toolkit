import axios from "axios";
import { ApiConfig } from "../apiConfig";
import { Event } from "./event";

export const getEvent = async (eventId: string): Promise<Event> => {
    const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}`;
    const response = await axios.get(configUrl);
    const data: Event = await response.data;
    return data;
  };