import axios from "axios";
import { ApiConfig } from "../apiConfig";
import { Agenda, Event } from "./event";
import { subMinutes, addMinutes } from "date-fns";

const stubbedAgenda: Agenda = {
  heading: "The Future of Go-to-Market Starts Here",
  subheading:
    "Join ZoomInfo's flagship virtual conference for AI-driven strategies and cutting-edge insights that help sales, marketing, and RevOps teams stay ahead in a competitive market.",
  schedule: [
    {
      title: "Keynote",
      startDate: subMinutes(new Date(), 10),
      endDate: addMinutes(new Date(), 10),
      blocks: [
        {
          supheading: "Founder and CEO",
          heading: "Henry Shuck",
          content:
            "Will share a bold vision for putting the power of creativity in the hands of revenue leaders through AI-powered GTM.",
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/1a103288-b940-4ae8-ba37-79b6c10f6edb.png",
        },
      ],
    },
    {
      title: "Interactive Breakout Sessions",
      startDate: addMinutes(new Date(), 45),
      endDate: addMinutes(new Date(), 75),
      blocks: [
        {
          supheading: "Option 1",
          heading: "Turn Whitespace Into Wins",
          content:
            "Gain high-impact strategies, rethink traditional playbooks, and redefine your GTM motion to stay ahead— this must attend session is designed for all sales and marketing GTM leaders.",
        },
        {
          supheading: "Option 2",
          heading:
            "RevOps Isn’t Just Support—It’s The Engine Of Revenue Growth.",
          content:
            "Designed for operations leaders across GTM—whether in marketing, sales, or revenue operations—this session will equip you with the essential tools and strategies to transform your team into a high-performing revenue engine.",
        },
      ],
    },
    {
      title: "General Session",
      startDate: addMinutes(new Date(), 75),
      endDate: addMinutes(new Date(), 105),
      blocks: [
        {
          supheading: "Chief Product Officer",
          heading: "Dominik Facher",
          content:
            "Will introduce ZoomInfo's groundbreaking GTM Intelligence Platform, where AI-enhanced data and workflows slash time to value and drive precision execution.",
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/edc973b2-bd9c-4d5c-881e-be9ea4cdafe0.png",
        },
      ],
    },
    {
      title: "General Session",
      startDate: addMinutes(new Date(), 105),
      endDate: addMinutes(new Date(), 135),
      blocks: [
        {
          supheading: "Chief Revenue Officer ",
          heading: "James Roth",
          content:
            "Will demonstrate how AI-fueled sales strategies are already boosting close rates, accelerating deal velocity, and reshaping customer engagement.",
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/0409b12d-89f2-4484-8282-8bdf2c172227.png",
        },
      ],
    },
  ],
};

export const getEvent = async (eventId: string): Promise<Event> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}`;
  const response = await axios.get(configUrl);
  const data: Event = await response.data;

  if (eventId === "723b6d9d-238c-48e5-84f7-17bb2d97fe02") {
    return {
      ...data,
      agenda: stubbedAgenda,
    };
  }

  return data;
};
