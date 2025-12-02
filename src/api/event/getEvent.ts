import axios from "axios";
import { ApiConfig } from "../apiConfig";
import { EventAgenda, Event } from "./event";

const SESSION_DURATIONS = {
  KEYNOTE: 22 * 60 + 34, // 22 minutes 34 seconds
  TODD: 21 * 60 + 5, // 21 minutes 5 seconds
  DOMINIK: 19 * 60 + 19, // 19 minutes 19 seconds
  JAMES: 14 * 60 + 48, // 14 minutes 48 seconds
  BREAKOUT_1: 33 * 60 + 49, // 33 minutes 49 seconds
  BREAKOUT_2: 24 * 60 + 5, // 24 minutes 5 seconds
};

const SESSION_DURATIONS_SPEEDY = {
  KEYNOTE: 10, // 10 seconds for demo
  TODD: 10, // 10 seconds for demo
  BREAKOUT_1: 10, // 10 seconds for demo
  BREAKOUT_2: 10, // 10 seconds for demo
};

const BREAK_BETWEEN_SESSIONS = 10; // 10 seconds break between sessions

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
  const DURATIONS = speedMode ? SESSION_DURATIONS_SPEEDY : SESSION_DURATIONS;
  const BREAK_TIME = speedMode ? BREAK_BETWEEN_SESSIONS : 0;
  
  // Adjust base time based on current URL in speed mode
  let baseTime = useQuickDates
    ? speedMode
      ? new Date()
      : new Date("2025-05-05T18:30:00.000+00:00")
    : new Date("2025-05-07T18:00:00.000+00:00");

  // In speed mode, adjust start time based on which page user is on
  if (speedMode && useQuickDates) {
    const currentUrl = window.location.href;
    const now = new Date();
    
    // If on main session URL, rewind so keynote is finished and main session is live
    if (currentUrl.includes('/main-session')) {
      baseTime = new Date(now.getTime() - (DURATIONS.KEYNOTE + BREAK_TIME) * 1000);
    }
    // If on breakout URL, rewind so keynote and main session are finished
    else if (currentUrl.includes('/breakout-')) {
      baseTime = new Date(now.getTime() - (DURATIONS.KEYNOTE + BREAK_TIME + DURATIONS.TODD + BREAK_TIME) * 1000);
    }
    // Otherwise (on keynote or other page), start from now
  }

  let currentTime = baseTime;

  const getNextTime = (seconds: number) => {
    const nextTime = new Date(currentTime);
    nextTime.setSeconds(nextTime.getSeconds() + seconds);
    currentTime = nextTime;
    return nextTime;
  };
  
  return {
    heading: "Annual Virtual Summit 2025",
    subheading:
      "Join us for an inspiring day of keynotes, sessions, and networking opportunities designed to help you grow your business and connect with industry leaders.",
    schedule: [
      {
        title: "Keynote",
        startDate: getNextTime(0),
        endDate: getNextTime(DURATIONS.KEYNOTE),
        eventId: "keynote-session-2025",
        url: "https://sequel-conference-demo.webflow.io/virtual-summit/keynote",
        supheading: "Opening Keynote Speaker",
        heading: "The Future of Digital Transformation",
        content:
          "Join us for an inspiring keynote address that explores the latest trends and innovations shaping the future of business. Our keynote speaker will share valuable insights on navigating digital transformation, embracing new technologies, and building resilient organizations in a rapidly changing world.\n\nDiscover how leading companies are leveraging cutting-edge tools and strategies to stay ahead of the curve and deliver exceptional value to their customers.",
        list: [
          "Key trends driving digital transformation across industries",
          "Best practices for implementing new technologies and workflows",
          "Real-world case studies from successful companies",
          "Actionable strategies you can apply to your own organization",
        ],
        coverImage: IMAGES.HENRY,
      },
      {
        title: "Main Session",
        startDate: getNextTime(BREAK_TIME),
        endDate: getNextTime(DURATIONS.TODD),
        eventId: "main-session-2025",
        url: "https://sequel-conference-demo.webflow.io/virtual-summit/main-session",
        supheading: "Featured Industry Expert",
        heading: "Strategies for Sustainable Growth in 2025",
        content:
          "In this main session, our featured expert will dive deep into proven strategies for achieving sustainable growth in today's competitive landscape. Learn how to optimize your operations, engage your customers more effectively, and build a strong foundation for long-term success.\n\nWhether you're a startup founder or leading an established enterprise, this session will provide actionable insights to help you scale your business while maintaining quality and customer satisfaction.",
        list: [
          "Core principles of sustainable business growth",
          "How to identify and capitalize on new market opportunities",
          "Building strong customer relationships that drive retention",
          "Measuring success and adjusting your strategy based on data",
        ],
        coverImage: IMAGES.TODD,
      },
      {
        title: "Breakout Session 1",
        startDate: (() => {
          // Add break time before breakouts
          const breakoutStart = getNextTime(BREAK_TIME);
          // Save for breakout 2 to start at same time
          const breakoutStartTime = new Date(breakoutStart);
          return breakoutStartTime;
        })(),
        endDate: (() => {
          const endDate = new Date(currentTime);
          endDate.setSeconds(endDate.getSeconds() + DURATIONS.BREAKOUT_1);
          return endDate;
        })(),
        eventId: "breakout-1-2025",
        url: "https://sequel-conference-demo.webflow.io/virtual-summit/breakout-1",
        supheading: "Deep Dive Workshop",
        heading: "Mastering Customer Engagement & Retention",
        content:
          "This interactive breakout session focuses on advanced techniques for engaging customers throughout their journey and building lasting relationships. Learn from real-world examples and get hands-on experience with tools and frameworks that drive customer loyalty.\n\nPerfect for marketing, sales, and customer success professionals looking to enhance their engagement strategies and improve retention rates.",
        list: [
          "Understanding the modern customer journey and key touchpoints",
          "Personalization strategies that drive engagement and conversion",
        ],
        coverImage: IMAGES.KEITH_MARILEE,
      },
      {
        title: "Breakout Session 2",
        startDate: new Date(currentTime),
        endDate: (() => {
          const endDate = new Date(currentTime);
          endDate.setSeconds(endDate.getSeconds() + DURATIONS.BREAKOUT_2);
          // Update currentTime to the end of breakouts (they run simultaneously)
          currentTime = new Date(Math.max(
            currentTime.getTime() + DURATIONS.BREAKOUT_1 * 1000,
            currentTime.getTime() + DURATIONS.BREAKOUT_2 * 1000
          ));
          return endDate;
        })(),
        eventId: "breakout-2-2025",
        url: "https://sequel-conference-demo.webflow.io/virtual-summit/breakout-2",
        supheading: "Expert Panel Discussion",
        heading: "Innovation & Technology Trends",
        content:
          "Join our expert panel for an engaging discussion on the latest technology trends and innovations that are transforming industries. Hear diverse perspectives from thought leaders and get your questions answered in this interactive session.\n\nIdeal for technology leaders, product managers, and anyone interested in staying ahead of emerging trends and understanding how to apply them to their business.",
        list: [
          "Emerging technologies and their potential business impact",
          "How to evaluate and prioritize new technology investments",
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
  const isSpeedMode =
    window.IS_STORYBOOK || url.searchParams.get("speedMode") === "true";

    return {
      ...data,
      agenda: generateAgenda(true, isSpeedMode)
    };
};
