import axios from "axios";
import { ApiConfig } from "../apiConfig";
import { Agenda, Event } from "./event";
import { addMinutes } from "date-fns";

const baseTime = new Date();
export const newStubbedAgenda: Agenda = {
  heading: "The Future of Go-to-Market Starts Here",
  subheading:
    "Join ZoomInfo's flagship virtual conference for AI-driven strategies and cutting-edge insights that help sales, marketing, and RevOps teams stay ahead in a competitive market.",
  schedule: [
    // --- Keynote ---
    {
      title: "Keynote",
      startDate: baseTime,
      endDate: addMinutes(baseTime, 30),
      blocks: [
        {
          supheading: "Henry Schuck, CEO & Founder ZoomInfo",
          heading: "The Future of AI-Driven Go-To-Market Intelligence",
          content:
            "Today’s go-to-market teams are full of bold, creative ideas—but too often, those ideas never see the light of day. Execution bottlenecks, fragmented data, and outdated processes slow down innovation, making it impossible to act in real time. But that’s about to change.\n\nJoin Henry Schuck, Founder and CEO of ZoomInfo, as he unveils a bold vision for the future—where GTM Intelligence puts revenue leaders back in the driver’s seat, allowing them to design, activate, and scale their most creative go-to-market strategies instantly.",
          list: [
            "Why creativity is the ultimate competitive advantage in revenue generation—and how AI is unlocking it.",
            "How GTM Intelligence transforms disconnected data into real-time execution, removing every obstacle between great ideas and action.",
            "How leading companies are harnessing creativity to move faster, engage with precision, and drive revenue.",
          ],
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/1132cc9f-a06c-4266-a529-3a48f26642fc.png",
        },
      ],
    },
    {
      title: "Main Session",
      startDate: addMinutes(baseTime, 35),
      endDate: addMinutes(baseTime, 65),
      blocks: [
        {
          supheading: "Todd Horst, Partner McKinsey & Company",
          heading:
            "An Unconstrained Future: How Generative AI Could Reshape B2B Sales",
          content:
            "The impact of generative AI on B2B sales is still in its early stages—but the transformation ahead is profound. Pioneering companies are already seeing measurable benefits. From enhancing efficiency to fundamentally reshaping sales organizations, AI is poised to redefine every stage of the deal cycle.\n\nTodd Horst, Partner at McKinsey, will explore three key pathways for AI-driven sales transformation and uncover the critical implications for B2B companies navigating this shift.",
          list: [
            "The three possible futures for generative AI in B2B sales—and how they’re taking shape today",
            "What we can learn from early AI adopters",
            "The crucial steps companies must take to build a scalable, competitive AI strategy",
          ],
        },
      ],
    },
    {
      title: "Main Session",
      startDate: addMinutes(baseTime, 70),
      endDate: addMinutes(baseTime, 100),
      blocks: [
        {
          supheading: "Dominik Facher, CPO ZoomInfo",
          heading: "Go-To-Market Intelligence Platform Reveal",
          content:
            "Chief Product Officer Dominik Facher will introduce ZoomInfo’s groundbreaking GTM Intelligence Platform, where AI-enhanced data and workflows slash time to value and drive precision execution. Tune into this session to see a walkthrough of the ZoomInfo Go-to-market Intelligence Platform, including;",
          list: [
            "AI-Ready Data Foundation",
            "Surfacing High-Intent, AI-Prioritized Buyers",
            "The AI-Driven GTM Workflow",
          ],
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/c0378de5-b1d7-4235-b637-9b831582646d.png",
        },
      ],
    },
    {
      title: "Main Session",
      startDate: addMinutes(baseTime, 105),
      endDate: addMinutes(baseTime, 135),
      blocks: [
        {
          supheading: "James Roth, CRO ZoomInfo",
          heading: "The Future of Revenue Growth",
          content:
            "ZoomInfo Chief Revenue Officer James Roth will demonstrate how bad data is costing you revenue and share how AI-fueled sales strategies can boost close rates, accelerate deal velocity, and reshape customer engagement. In this session you’ll learn to:",
          list: [
            "Expand your TAM and drive higher close rates",
            "Grow & retain customers with precision engagement",
            "Maximize rep productivity with AI-powered automation",
          ],
          coverImage:
            "https://stage-assets.sequelvideo.com/store/96decb66-07a9-4be2-2903-4e507615bcff/5e1ab63f-d218-49fb-a557-b9549a7daff5.png",
        },
      ],
    },
    {
      title: "Breakout Session",
      startDate: addMinutes(baseTime, 140),
      endDate: addMinutes(baseTime, 170),
      blocks: [
        {
          supheading: "Virtual Customer Presenter: Sourcing now",
          heading: "From Cold to Closed, How to Turn Whitespace Into Wins",
          content:
            "Gain high-impact strategies, rewrite traditional playbooks, and architect your GTM motion to stay ahead — this must attend session is designed for all sales and marketing leaders. Join us to learn how to:",
          list: [
            "Find high-value accounts with real-time data & intent signals",
            "Automate execution for precision targeting across marketing & sales",
            "Maximize revenue from both new and existing accounts",
          ],
        },
        {
          supheading: "Toby Carrington, CBO Seismic",
          heading: "From Service to Strategy. The Rise of GTM Architects",
          content:
            "Designed for operations leaders across GTM—whether you’re in marketing, sales, or revenue operations—Join Toby Carrington, Chief Business Officer at Seismic for this session that will equip you with the essential tools and strategies to transform your team into a high-performing revenue engine. Join us and learn how to:",
          list: [
            "Eliminate inefficiencies with AI-driven execution",
            "Prioritize the right accounts using intent data",
            "Scale revenue by automating GTM execution",
          ],
        },
      ],
    },
  ],
};

export const getEvent = async (eventId: string): Promise<Event> => {
  const configUrl = `${ApiConfig.GetApiUrl()}/api/v3/events/${eventId}`;
  const response = await axios.get(configUrl);
  const data: Event = await response.data;

  if (eventId === "55ff41fa-55ff-4bf5-8012-1190dac93cb9") {
    return {
      ...data,
      agenda: newStubbedAgenda,
    };
  }

  return data;
};
