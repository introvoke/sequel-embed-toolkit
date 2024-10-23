import axios, { AxiosResponse } from "axios";
import { ApiConfig } from "../apiConfig";

export const trackPageView = async (companyId: string, userId: string, sessionId: string, data: any): Promise<AxiosResponse<any, any>> => {
    const configUrl = `${ApiConfig.GetAnalyticsUrl()}/api/analytics/website/pageView`;
    const payload = {
        companyId,
        userId,
        sessionId,
        ...data
    }
    const response = await axios.post(configUrl, payload);
    return response;
};

export const trackIdentify = async (companyId: string, userId: string, sessionId: string, data: any): Promise<AxiosResponse<any, any>> => {
    const configUrl = `${ApiConfig.GetAnalyticsUrl()}/api/analytics/website/identify`;
    const payload = {
        companyId,
        userId,
        sessionId,
        ...data
    }
    const response = await axios.post(configUrl, payload);
    return response;
};