import axios from "axios";
import { ApiConfig } from "../apiConfig";
import { EventAgenda, Event } from "./event";

const SESSION_DURATIONS = {
  KEYNOTE: 20 * 60 + 37, // 20 minutes 37 seconds
  TODD: 21 * 60 + 5, // 21 minutes 5 seconds
  DOMINIK: 19 * 60 + 19, // 19 minutes 19 seconds
  JAMES: 14 * 60 + 48, // 14 minutes 48 seconds
  BREAKOUT_1: 33 * 60 + 49, // 33 minutes 49 seconds
  BREAKOUT_2: 24 * 60 + 5, // 24 minutes 5 seconds
};

const SESSION_DURATIONS_SPEEDY = {
  KEYNOTE: 3, // 20 minutes 37 seconds
  TODD: 3, // 21 minutes 5 seconds
  DOMINIK: 3, // 19 minutes 19 seconds
  JAMES: 3, // 14 minutes 48 seconds
  BREAKOUT_1: 60 * 5, // 33 minutes 49 seconds
  BREAKOUT_2: 60 * 5, // 24 minutes 5 seconds
};

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/introvoke/image/upload/c_limit,w_200,h_200,q_auto/";

export const IMAGES = {
  DOMINIK: `${CLOUDINARY_BASE_URL}v1746181372/hs2q4ygyswkfehjylekc.png`,
  HENRY: `${CLOUDINARY_BASE_URL}v1746181396/ya2qqcdqvlz4atklyhlr.png`,
  TAL: `${CLOUDINARY_BASE_URL}v1746181346/hs7qjhievo5zzyfe2zjf.png`,
  TODD: `${CLOUDINARY_BASE_URL}v1746181413/pci5msyzppxpdiipbmiu.png`,
  JAMES: `${CLOUDINARY_BASE_URL}v1746181386/uwuplj985uvebfrrnx2q.png`,
  STEPHEN: `${CLOUDINARY_BASE_URL}v1746181363/rqnaasjdy4kgqh5uis95.png`,
  TOBY: `${CLOUDINARY_BASE_URL}v1746181403/pwjgkv24ta1ujh3tgphw.png`,
  KEITH_MARILEE: `${CLOUDINARY_BASE_URL}v1746259625/h8pkbjjnzsmj2lahymvb.png`,
} as const;

const generateAgenda = (
  useQuickDates: boolean = false,
  speedMode = false
): EventAgenda => {
  const baseTime = useQuickDates
    ? speedMode
      ? new Date()
      : new Date("2025-05-02T16:30:00.000+00:00")
    : new Date("2025-05-07T18:00:00.000+00:00");

  let currentTime = baseTime;

  const getNextTime = (seconds: number) => {
    const nextTime = new Date(currentTime);
    nextTime.setSeconds(nextTime.getSeconds() + seconds);
    currentTime = nextTime;
    return nextTime;
  };

  const DURATIONS = speedMode ? SESSION_DURATIONS_SPEEDY : SESSION_DURATIONS;
  return {
    heading: "The Future of Go-to-Market Starts Here",
    subheading:
      "Join ZoomInfo's flagship virtual conference for AI-driven strategies and cutting-edge insights that help sales, marketing, and RevOps teams stay ahead in a competitive market.",
    schedule: [
      {
        title: "Keynote",
        startDate: getNextTime(0),
        endDate: getNextTime(DURATIONS.KEYNOTE),
        eventId: "55ff41fa-55ff-4bf5-8012-1190dac93cb9",
        url: "https://www.zoominfo.com/live/gtm25-keynote",
        supheading: "Henry Schuck, CEO & Founder ZoomInfo",
        heading: "The Future of AI-Driven Go-To-Market Intelligence",
        content:
          "Today's go-to-market teams are full of bold, creative ideas—but too often, those ideas never see the light of day. Execution bottlenecks, fragmented data, and outdated processes slow down innovation, making it impossible to act in real time. But that's about to change.\n\nJoin Henry Schuck, Founder and CEO of ZoomInfo, as he unveils a bold vision for the future—where GTM Intelligence puts revenue leaders back in the driver's seat, allowing them to design, activate, and scale their most creative go-to-market strategies instantly.",
        list: [
          "Why creativity is the ultimate competitive advantage in revenue generation—and how AI is unlocking it.",
          "How GTM Intelligence transforms disconnected data into real-time execution, removing every obstacle between great ideas and action.",
          "How leading companies are harnessing creativity to move faster, engage with precision, and drive revenue.",
        ],
        coverImage: IMAGES.HENRY,
      },
      {
        title: "Main Session",
        startDate: getNextTime(0),
        endDate: getNextTime(DURATIONS.TODD),
        eventId: "8ea595c1-99df-4609-a475-fbc351935b54",
        url: "https://www.zoominfo.com/live/gtm25-ai-b2b-sales",
        supheading: "Todd Horst, Partner McKinsey & Company",
        heading:
          "An Unconstrained Future: How Generative AI Could Reshape B2B Sales",
        content:
          "The impact of generative AI on B2B sales is still in its early stages—but the transformation ahead is profound. Pioneering companies are already seeing measurable benefits. From enhancing efficiency to fundamentally reshaping sales organizations, AI is poised to redefine every stage of the deal cycle.\n\nTodd Horst, Partner at McKinsey, will explore three key pathways for AI-driven sales transformation and uncover the critical implications for B2B companies navigating this shift.",
        list: [
          "The three possible futures for generative AI in B2B sales—and how they're taking shape today",
          "What we can learn from early AI adopters",
          "The crucial steps companies must take to build a scalable, competitive AI strategy",
        ],
        coverImage: IMAGES.TODD,
      },
      {
        title: "Main Session",
        startDate: getNextTime(0),
        endDate: getNextTime(DURATIONS.DOMINIK),
        eventId: "91eb98d4-6cb9-4a91-ada0-8344d66a084f",
        url: "https://www.zoominfo.com/live/gtm25-intelligence-platform",
        supheading: "Dominik Facher, CPO ZoomInfo",
        heading: "Go-To-Market Intelligence Platform Reveal",
        content:
          "Chief Product Officer Dominik Facher will introduce ZoomInfo's groundbreaking GTM Intelligence Platform, where AI-enhanced data and workflows slash time to value and drive precision execution. Tune into this session to see a walkthrough of the ZoomInfo Go-to-market Intelligence Platform, including;",
        list: [
          "AI-Ready Data Foundation",
          "Surfacing High-Intent, AI-Prioritized Buyers",
          "The AI-Driven GTM Workflow",
        ],
        coverImage: IMAGES.DOMINIK,
      },
      {
        title: "Main Session",
        startDate: getNextTime(0),
        endDate: getNextTime(DURATIONS.JAMES),
        eventId: "988e550e-b3be-4fc4-b659-6782cd70f9a2",
        url: "https://www.zoominfo.com/live/gtm25-revenue-growth",
        supheading: "James Roth, CRO ZoomInfo",
        heading: "The Future of Revenue Growth",
        content:
          "ZoomInfo Chief Revenue Officer James Roth will demonstrate how bad data is costing you revenue and share how AI-fueled sales strategies can boost close rates, accelerate deal velocity, and reshape customer engagement. In this session you'll learn to:",
        list: [
          "Expand your TAM and drive higher close rates",
          "Grow & retain customers with precision engagement",
          "Maximize rep productivity with AI-powered automation",
        ],
        coverImage: IMAGES.JAMES,
      },
      {
        title: "Breakout Sessions",
        startDate: new Date(currentTime),
        endDate: new Date(currentTime.getTime() + DURATIONS.BREAKOUT_1 * 1000),
        eventId: "c7f88320-15b0-4ece-91a5-793503ddfdcb",
        url: "https://www.zoominfo.com/live/gtm25-breakout-1",
        supheading:
          "Keith Pearce, CMO Gainsight, and Marilee Bear, CRO at Gainsight",
        heading: "From Cold to Closed, How to Turn Whitespace Into Wins",
        content:
          "Join Keith Pearce, CMO at Gainsight, and Marilee Bear, CRO at Gainsight, for this must-attend session designed for sales and marketing leaders. Gain high-impact strategies, rewrite traditional playbooks, and architect your GTM motion to stay ahead. Join us and learn how to:",
        list: [
          "Find high-value accounts with real-time data & intent signals",
          "Automate execution for precision targeting across marketing & sales",
          "Maximize revenue from both new and existing accounts",
        ],
        coverImage: IMAGES.KEITH_MARILEE,
      },
      {
        title: "Breakout Session 2",
        startDate: new Date(currentTime),
        endDate: new Date(currentTime.getTime() + DURATIONS.BREAKOUT_2 * 1000),
        eventId: "c4dadc5f-6545-4d38-9692-661f425b0e76",
        url: "https://www.zoominfo.com/live/gtm25-breakout-2",
        supheading: "Toby Carrington, CBO Seismic",
        heading: "From Service to Strategy. The Rise of GTM Architects",
        content:
          "Designed for operations leaders across GTM—whether you're in marketing, sales, or revenue operations—Join Toby Carrington, Chief Business Officer at Seismic for this session that will equip you with the essential tools and strategies to transform your team into a high-performing revenue engine. Join us and learn how to:",
        list: [
          "Eliminate inefficiencies with AI-driven execution",
          "Prioritize the right accounts using intent data",
          "Scale revenue by automating GTM execution",
        ],
        coverImage: IMAGES.TOBY,
      },
    ],
  };
};

declare global {
  interface Window {
    IS_STORYBOOK: boolean;
  }
}

export const getEvent = async (eventId: string): Promise<Event> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}`;
  const response = await axios.get(configUrl);
  const data: Event = await response.data;
  const url = new URL(window.location.href);
  const isTestMode = url.searchParams.get("testMode") === "true";
  const isSpeedMode =
    window.IS_STORYBOOK || url.searchParams.get("speedMode") === "true";

  if (generateAgenda(false).schedule.some((item) => item.eventId === eventId)) {
    return {
      ...data,
      agenda:
        window.IS_STORYBOOK || isTestMode
          ? generateAgenda(true, isSpeedMode)
          : generateAgenda(false),
    };
  }

  return data;
};
