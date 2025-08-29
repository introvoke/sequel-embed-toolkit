import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import {
  forceLinksToNewTab,
  onDocumentReady,
  renderApp,
  renderAppInsideDocument,
} from "@src/utils/dom";
import { getValidatedJoinCode } from "@src/utils/user";
import registrationApi from "@src/api/registration";
import { MarketoRegistrationSuccess } from "@src/routes/MarketoRegistrationSuccess";
import { EmbedIframe } from "@src/routes/EmbedIframe";
import { getEvent } from "@src/api/event/getEvent";
import { trackIdentify, trackPageView } from "@src/api/website/website";
import { getUserEmailFromJoinCode } from "@src/api/registration/getUserJoinInformation";
import Cookies from "js-cookie";
import { CountdownIframe } from "@src/routes/CountdownIframe";
import type { EventAgenda } from "@src/api/event/event";
import { ZoomInfoAgendaContainer } from "./routes/agenda/ZoomInfoAgendaContainer";
import { isSameDay } from "date-fns";
import { useState, useEffect } from "react";

interface RenderMarketoFormParams {
  sequelEventId: string;
  renderAddToCalendar?: boolean;
  loadMarketoForm?: boolean;
}

interface RenderHubspotFormParams {
  sequelEventId: string;
  renderAddToCalendar?: boolean;
  loadHubspotForm?: boolean;
  renderCountdown?: boolean;
}

interface RenderEventParams {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
  agenda?: EventAgenda;
  isPopup?: boolean;
}

// Helper function to remove the element and its parent if the parent is empty
const removeElementAndParentIfEmpty = (element: HTMLElement | null) => {
  if (!element) return;

  const parentElement = element.parentElement;

  // Remove the element
  element.remove();

  // Check if the parent has no other child elements and remove it if true
  if (parentElement && parentElement.childElementCount === 0) {
    parentElement.remove();
  }
};

// EventGrid component
interface EventGridProps {
  companyId: string;
  darkMode?: boolean;
  excludeText?: string;
  showDescription?: boolean;
}

interface EventData {
  uid: string;
  name: string;
  description: string;
  picture: string;
  startDate: string;
  endDate: string;
  timezone: string;
  customUrl: string;
  isLive?: boolean;
  isEventSeries?: boolean;
  isOnDemand?: boolean;
}

interface EventGridData {
  upcoming: {
    events: EventData[];
    total: number;
    page: number;
    hasMore: boolean;
  };
  past: {
    events: EventData[];
    total: number;
    page: number;
    hasMore: boolean;
  };
}

const EventGrid = ({ companyId, darkMode = false, excludeText = '', showDescription = false }: EventGridProps) => {
  const [data, setData] = useState<EventGridData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const fetchEvents = async (upcomingPageNum: number, pastPageNum: number) => {
    const params = new URLSearchParams({
      upcomingPage: upcomingPageNum.toString(),
      pastPage: pastPageNum.toString(),
      pageSize: '9'
    });

    if (excludeText.trim()) {
      params.append('exclude', excludeText.trim());
    }

    const response = await fetch(
      `https://api.introvoke.com/api/v3/companies/${companyId}/gridEvents?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  };

  const formatDate = (dateString: string, timezone?: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const timezoneDisplay = timezone ? ` ${timezone}` : '';
    
    return `${formattedDate} • ${formattedTime}${timezoneDisplay}`;
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const result = await fetchEvents(1, 1);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [companyId, excludeText]);

  const loadMoreUpcoming = async () => {
    if (!data || loading) return;

    try {
      setLoading(true);
      const nextPage = upcomingPage + 1;
      const result = await fetchEvents(nextPage, pastPage);
      
      setData({
        ...data,
        upcoming: {
          ...result.upcoming,
          events: [...data.upcoming.events, ...result.upcoming.events]
        }
      });
      setUpcomingPage(nextPage);
    } catch (err) {
      console.error('Error loading more upcoming events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePast = async () => {
    if (!data || loading) return;

    try {
      setLoading(true);
      const nextPage = pastPage + 1;
      const result = await fetchEvents(upcomingPage, nextPage);
      
      setData({
        ...data,
        past: {
          ...result.past,
          events: [...data.past.events, ...result.past.events]
        }
      });
      setPastPage(nextPage);
    } catch (err) {
      console.error('Error loading more past events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className={`flex justify-center items-center p-8 ${darkMode ? 'dark' : ''}`}>
        <div className="text-black dark:text-white">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center p-8 ${darkMode ? 'dark' : ''}`}>
        <div className="text-black dark:text-white">Failed to load events. Please try again later.</div>
      </div>
    );
  }

  if (!data) return null;

  const EventCard = ({ event, isUpcoming, showDescription }: { event: EventData; isUpcoming: boolean; showDescription: boolean }) => {
    const isLive = isUpcoming && event.isLive;
    
    return (
      <div 
        className={`w-96 rounded-lg border inline-flex flex-col justify-start items-start overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
          isLive 
            ? 'bg-bg-neutral-weak/5 border-border-primary dark:bg-transparent dark:border-border-primary' 
            : 'bg-white dark:bg-transparent border-gray-200 dark:border-white/20'
        }`}
        onClick={() => window.open(event.customUrl, '_blank')}
      >
        {/* 16:9 aspect ratio container */}
        <div className="self-stretch aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            src={event.picture || 'https://placehold.co/416x234'} 
            alt={event.name}
          />
        </div>
        <div className="self-stretch p-4 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch text-black dark:text-white text-lg font-bold font-['Inter'] leading-7 line-clamp-2 h-14 flex items-start">
              <span>{event.name}</span>
            </div>
            {showDescription && event.description && (
              <div 
                className="self-stretch text-text-sub/60 dark:text-gray-500 text-sm font-normal font-['Inter'] leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
            <div className="self-stretch text-text-sub/70 dark:text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
              {formatDate(event.startDate, event.timezone)}
              {isLive && <span className="text-green-600 dark:text-green-400 font-medium"> • Live now</span>}
              {event.isEventSeries && <span className="text-blue-600 dark:text-blue-400"> • Event Series</span>}
            </div>
          </div>
          <div className="p-2 bg-black dark:bg-white rounded-lg inline-flex justify-center items-center gap-1 overflow-hidden">
            <div className="px-1 flex justify-center items-center gap-2.5">
              <div className="text-white dark:text-black text-sm font-medium font-['Inter'] leading-tight">
                {!isUpcoming ? 'Watch now' : 'View now'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EventSection = ({ 
    title, 
    events, 
    hasMore, 
    onLoadMore, 
    isUpcoming,
    showDescription 
  }: { 
    title: string; 
    events: EventData[]; 
    hasMore: boolean; 
    onLoadMore: () => void;
    isUpcoming: boolean;
    showDescription: boolean;
  }) => {
    if (events.length === 0) return null;

    return (
      <div className="mb-10">
        <h2 className="text-black dark:text-white text-2xl font-bold font-['Inter'] mb-5">{title}</h2>
        <div className="w-full max-w-[1280px] inline-flex justify-start items-start gap-4 flex-wrap content-start overflow-hidden">
          {events.map(event => (
            <EventCard key={event.uid} event={event} isUpcoming={isUpcoming} showDescription={showDescription} />
          ))}
        </div>
        {hasMore && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="p-2.5 bg-transparent rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 dark:outline-white/30 inline-flex justify-center items-center gap-1 overflow-hidden disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="px-1 flex justify-center items-center gap-2.5">
                <div className="text-black dark:text-white text-sm font-medium font-['Inter'] leading-tight">
                  {loading ? 'Loading...' : 'Load more'}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`font-['Inter'] min-h-full ${darkMode ? 'dark' : ''}`}>
      <div className="p-6">
        <EventSection
          title="Upcoming Events"
          events={data.upcoming.events}
          hasMore={data.upcoming.hasMore}
          onLoadMore={loadMoreUpcoming}
          isUpcoming={true}
          showDescription={showDescription}
        />
        <EventSection
          title="Past Events"
          events={data.past.events}
          hasMore={data.past.hasMore}
          onLoadMore={loadMorePast}
          isUpcoming={false}
          showDescription={showDescription}
        />
      </div>
    </div>
  );
};

// RelatedEvents component
interface RelatedEventsProps {
  companyId: string;
  darkMode?: boolean;
  excludeText?: string;
  showDescription?: boolean;
  maxEvents?: number;
}

const RelatedEvents = ({ companyId, darkMode = false, excludeText = '', showDescription = false, maxEvents = 6 }: RelatedEventsProps) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedEvents = async () => {
    // Fetch enough events to filter out current event and still have maxEvents
    const params = new URLSearchParams({
      upcomingPage: '1',
      pastPage: '1',
      pageSize: (maxEvents + 5).toString() // Fetch extra to account for filtering
    });

    if (excludeText.trim()) {
      params.append('exclude', excludeText.trim());
    }

    const response = await fetch(
      `https://api.introvoke.com/api/v3/companies/${companyId}/gridEvents?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  };

  const getCurrentPageUrl = () => {
    return window.location.href;
  };

  const filterCurrentEvent = (allEvents: EventData[]) => {
    const currentUrl = getCurrentPageUrl();
    
    return allEvents.filter(event => {
      if (!event.customUrl) return true;
      
      // Check if the current URL matches or contains the event's custom URL
      // This handles cases where the event URL might be a path within the current domain
      try {
        const eventUrl = new URL(event.customUrl);
        const currentUrlObj = new URL(currentUrl);
        
        // Compare full URLs
        if (eventUrl.href === currentUrlObj.href) {
          return false;
        }
        
        // Compare paths if they're on the same domain
        if (eventUrl.hostname === currentUrlObj.hostname && 
            eventUrl.pathname === currentUrlObj.pathname) {
          return false;
        }
        
        return true;
      } catch (e) {
        // If URL parsing fails, do a simple string comparison
        return !currentUrl.includes(event.customUrl);
      }
    });
  };

  const selectBestEvents = (upcomingEvents: EventData[], pastEvents: EventData[]) => {
    // Filter out current event from both arrays
    const filteredUpcoming = filterCurrentEvent(upcomingEvents);
    const filteredPast = filterCurrentEvent(pastEvents);
    
    let selectedEvents: EventData[] = [];
    
    // First, add upcoming events
    selectedEvents = [...filteredUpcoming];
    
    // If we need more events, add past events
    if (selectedEvents.length < maxEvents) {
      const remainingSlots = maxEvents - selectedEvents.length;
      selectedEvents = [...selectedEvents, ...filteredPast.slice(0, remainingSlots)];
    }
    
    // Trim to exact count if we have too many
    return selectedEvents.slice(0, maxEvents);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchRelatedEvents();
        
        const selectedEvents = selectBestEvents(
          data.upcoming.events || [],
          data.past.events || []
        );
        
        setEvents(selectedEvents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [companyId, excludeText, maxEvents]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${darkMode ? 'dark' : ''}`}>
        <div className="text-black dark:text-white">Loading related events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center p-8 ${darkMode ? 'dark' : ''}`}>
        <div className="text-black dark:text-white">Failed to load related events.</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`flex justify-center items-center p-8 ${darkMode ? 'dark' : ''}`}>
        <div className="text-black dark:text-white">No related events available.</div>
      </div>
    );
  }

  const EventCard = ({ event }: { event: EventData }) => {
    const currentDate = new Date();
    const eventEndDate = new Date(event.endDate);
    const isUpcoming = eventEndDate > currentDate;
    const isLive = isUpcoming && event.isLive;
    
    return (
      <div 
        className={`w-full rounded-lg border inline-flex flex-col justify-start items-start overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
          isLive 
            ? 'bg-bg-neutral-weak/5 border-border-primary dark:bg-transparent dark:border-border-primary' 
            : 'bg-white dark:bg-transparent border-gray-200 dark:border-white/20'
        }`}
        onClick={() => window.open(event.customUrl, '_blank')}
      >
        {/* 16:9 aspect ratio container */}
        <div className="self-stretch aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            src={event.picture || 'https://placehold.co/416x234'} 
            alt={event.name}
          />
        </div>
        <div className="self-stretch p-4 flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch text-black dark:text-white text-base font-bold font-['Inter'] leading-6 line-clamp-2">
              {event.name}
            </div>
            {showDescription && event.description && (
              <div 
                className="self-stretch text-text-sub/60 dark:text-gray-500 text-sm font-normal font-['Inter'] leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
            <div className="self-stretch text-text-sub/70 dark:text-gray-400 text-sm font-normal font-['Inter'] leading-tight">
              {formatDate(event.startDate, event.timezone)}
              {isLive && <span className="text-green-600 dark:text-green-400 font-medium"> • Live now</span>}
              {event.isEventSeries && <span className="text-blue-600 dark:text-blue-400"> • Event Series</span>}
            </div>
          </div>
          <div className="p-2 bg-black dark:bg-white rounded-lg inline-flex justify-center items-center gap-1 overflow-hidden">
            <div className="px-1 flex justify-center items-center gap-2.5">
              <div className="text-white dark:text-black text-sm font-medium font-['Inter'] leading-tight">
                {!isUpcoming ? 'Watch now' : 'View now'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string, timezone?: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const timezoneDisplay = timezone ? ` ${timezone}` : '';
    
    return `${formattedDate} • ${formattedTime}${timezoneDisplay}`;
  };

  return (
    <div className={`font-['Inter'] ${darkMode ? 'dark' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <EventCard key={event.uid} event={event} />
        ))}
      </div>
    </div>
  );
};

class Sequel {
  static companyId: string | null = null;
  static userId: string | null = null;
  static sessionId: string | null = null;
  static hasConsent: boolean = false;

  static generateId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  static init(companyId: string) {
    if (!companyId) {
      console.error("Company ID is required for Sequel tracking.");
      return;
    }
    Sequel.companyId = companyId;

    onDocumentReady(() => {
      // Check if consent was previously given
      const consentCookie = Cookies.get("sequel-consent");
      if (consentCookie === "true") {
        // Initialize tracking without setting cookie again
        Sequel.hasConsent = true;
        Sequel.userId = Sequel.getOrCreateUserId();
        Sequel.sessionId = Sequel.getOrCreateSessionId();
        Sequel.checkJoinCode();
        Sequel.listenForIframeMessages();
        Sequel.trackWebsite();
      }
    });
  }

  static initializeTracking() {
    if (Sequel.hasConsent) {
      return;
    }

    onDocumentReady(() => {
      Sequel.hasConsent = true;
      Sequel.userId = Sequel.getOrCreateUserId();
      Sequel.sessionId = Sequel.getOrCreateSessionId();
      Sequel.checkJoinCode();
      Sequel.listenForIframeMessages();
      Sequel.trackWebsite();

      // Store consent cookie only when explicitly initialized
      Cookies.set("sequel-consent", "true", {
        secure: true,
        sameSite: "strict",
        expires: 365, // 1 year
      });
    });
  }

  static disableTracking() {
    Sequel.hasConsent = false;
    Sequel.userId = null;
    Sequel.sessionId = null;

    // Clear cookies
    Cookies.remove("sequel-consent");
    Cookies.remove("sequelUserId");
    Cookies.remove("sequelSessionId");
  }

  // Check the URL for joinCode or joincode and call the API to identify the user
  static async checkJoinCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get("joinCode") || urlParams.get("joincode");

    if (joinCode) {
      try {
        const email = await getUserEmailFromJoinCode({ joinCode });
        if (email) {
          console.log(
            `User identified with joinCode: ${joinCode}, email: ${email}`
          );
          Sequel.identify(email); // Send identify event with the email
        } else {
          console.error("Failed to retrieve email for joinCode:", joinCode);
        }
      } catch (error) {
        console.error("Error fetching joinCode email:", error);
      }
    }
  }

  // Get or create a unique userId and store it in cookies
  static getOrCreateUserId(): string {
    const userId = Sequel.getCookie("sequelUserId");
    if (userId) return userId;

    const newUserId = `user_${Sequel.generateId()}`;
    Sequel.setCookie("sequelUserId", newUserId, 365);
    return newUserId;
  }

  // Get or create a sessionId and store it in cookies
  static getOrCreateSessionId(): string {
    const sessionId = Sequel.getCookie("sequelSessionId");
    if (sessionId) return sessionId;

    const newSessionId = `session_${Sequel.generateId()}`;
    Sequel.setCookie("sequelSessionId", newSessionId, 1); // 1-day session
    return newSessionId;
  }

  // Set a cookie
  static setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  // Get a cookie value
  static getCookie(name: string): string | null {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.split("=")[1];
      }
    }
    return null;
  }

  // Send tracking data to the backend
  static async sendData(eventType: string, data: any) {
    if (!Sequel.hasConsent) {
      console.debug("Analytics tracking blocked - user consent not given");
      return;
    }

    if (!Sequel.companyId) {
      console.error(
        "Company ID is not set. Call Sequel.init() with a valid company ID."
      );
      return;
    }

    const payload = {
      userId: Sequel.userId,
      sessionId: Sequel.sessionId,
      companyId: Sequel.companyId,
      eventType,
      timestamp: new Date().toISOString(),
      ...data,
    };

    try {
      const response =
        eventType === "page_view"
          ? await trackPageView(
              Sequel.companyId,
              Sequel.userId as string,
              Sequel.sessionId as string,
              payload
            )
          : await trackIdentify(
              Sequel.companyId,
              Sequel.userId as string,
              Sequel.sessionId as string,
              payload
            );

      if (response.status !== 200) {
        console.error("Failed to send event:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending event:", error);
    }
  }

  // Track page view events
  static trackPageView() {
    const data = {
      pageName: document.title,
      url: window.location.href,
      referrer: document.referrer || "Direct",
      userAgent: navigator.userAgent,
    };
    Sequel.sendData("page_view", data);
  }

  // Initialize website tracking (page views and forms)
  static trackWebsite() {
    if (!Sequel.companyId) {
      console.error(
        "Company ID is not set. Call Sequel.init() with a valid company ID."
      );
      return;
    }
    Sequel.trackPageView();
  }

  static renderThankYouPage = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("eventId") || !urlParams.has("joinCode")) {
      console.error(
        "The Sequel script is set to render the thank you page but the event id or join code was not found in the url. Please double check the url."
      );
      return;
    }

    const event = await getEvent(urlParams.get("eventId") || "");
    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    const joinCode = urlParams.get("joinCode") || "";

    renderApp(
      <MarketoRegistrationSuccess
        event={event}
        joinCode={joinCode}
        onOpenEvent={() => {
          const location =
            event.registration?.customUrl ||
            `https://embed.sequel.io/event/${event.uid}`;
          const joinUrl = `${location}?joinCode=${joinCode}`;
          window.location.href = joinUrl;
        }}
      />
    );
  };

  // Identify a user with additional details
  static identify(
    email: string,
    details: {
      name?: string;
      phone?: string;
      companyName?: string;
      title?: string;
    } = {}
  ) {
    if (!email) {
      console.error("Email is required to identify a user.");
      return;
    }
    Sequel.sendData("identify", { email, ...details });
  }

  // Listen for iframe messages and handle registration events
  static listenForIframeMessages() {
    // Listen for iframe registration events
    window.addEventListener("message", (event) => {
      // Handle Sequel iframe registration
      if (event.data?.event === "user-registered") {
        const email = event.data?.data?.email;
        if (email) {
          Sequel.identify(email);
        }
      }

      // Handle Marketo form submissions
      if (
        event.data?.type === "mktoForm" &&
        event.data?.eventName === "formSubmitted"
      ) {
        const formData = event.data?.data?.formData;
        if (formData) {
          const email = formData.Email || formData.email;

          if (email) {
            Sequel.identify(email);
          }
        }
      }

      // Handle HubSpot form submissions
      if (
        event.data?.type === "hsFormCallback" &&
        event.data?.eventName === "onFormSubmitted"
      ) {
        const submissionValues = event.data.data?.submissionValues;
        if (submissionValues) {
          const email = submissionValues.email;

          if (email) {
            Sequel.identify(email);
          }
        }
      }
    });

    // Listen for direct Marketo form submissions via MktoForms2
    if (window.MktoForms2) {
      window.MktoForms2.whenReady((form: any) => {
        form.onSuccess((values: any) => {
          const email = values.Email || values.email;

          if (email) {
            Sequel.identify(email);
          }
        });
      });
    }
  }

  static renderSequelWithHubspotFrame = async ({
    sequelEventId,
    renderAddToCalendar = false,
    loadHubspotForm = true,
    renderCountdown = false,
  }: RenderHubspotFormParams) => {
    const joinCode = await getValidatedJoinCode({ eventId: sequelEventId });
    const event = await getEvent(sequelEventId);

    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    let sequelRoot = document.getElementById(`sequel_root`);
    if (!sequelRoot) {
      console.error(
        "The Sequel root element was not found. Please add a div with id `sequelRoot` to your html."
      );
      return;
    }

    // If outsideOfAppEnabled is false or we have a joinCode, render Sequel directly
    if (!event.registration?.outsideOfAppEnabled || joinCode) {
      let htmlForm = document.getElementById(`hubspotForm`);
      removeElementAndParentIfEmpty(htmlForm);
      return Sequel.renderEvent({
        eventId: sequelEventId,
        joinCode: joinCode || "",
      });
    }

    // Rest of the existing HubSpot form logic for when outsideOfAppEnabled is true
    const hubspotFormId = event.registration?.hubspotFormId || "";
    const hubspotPortalId = event.registration?.hubspotPortalId || "";
    let htmlForm = document.getElementById(`hubspotForm`);
    let form: HTMLFormElement | null = null;

    if (!htmlForm) {
      console.error(
        "The HubSpot element was not found. Please add a div with id `hubspotForm` to your html."
      );
      return;
    }

    if (loadHubspotForm) {
      if (!hubspotFormId) {
        console.error(
          "The Sequel script is set to render the HubSpot form but the event does not have a HubSpot form id. Please double check the event information in the Sequel dashboard."
        );
        return;
      }

      if (!hubspotPortalId) {
        console.error(
          "The Sequel script is set to render the HubSpot form but the event does not have a HubSpot portal id. Please double check the event information in the Sequel dashboard."
        );
        return;
      }

      form = htmlForm.appendChild(document.createElement("form"));
      form.id = `hubspotForm_${hubspotFormId}`;
    }

    if (!joinCode && renderCountdown) {
      CountdownIframe({
        eventId: sequelEventId,
      });
    }

    if (!joinCode && event.registration?.outsideOfAppEnabled) {
      onDocumentReady(() => {
        if (loadHubspotForm) {
          window.hbspt?.forms?.create({
            portalId: hubspotPortalId,
            formId: hubspotFormId,
            target: `#hubspotForm_${hubspotFormId}`,
            onFormSubmit: async (form, data) => {
              const getFieldValue = (fieldName: string) => {
                const field = data.find(
                  (field: { name: string; value: string }) =>
                    field.name === fieldName
                );
                return field ? field.value : "";
              };

              const firstName = getFieldValue("firstname");
              const lastName = getFieldValue("lastname");
              const email = getFieldValue("email");

              const registeredAttendeee = await registrationApi.registerUser({
                name: `${firstName} ${lastName}`,
                email: email,
                eventId: sequelEventId,
              });
              setSequelJoinCodeCookie(
                sequelEventId,
                registeredAttendeee.joinCode
              );
              if (!renderAddToCalendar) {
                removeElementAndParentIfEmpty(htmlForm);
                if (document.getElementById("sequel_countdown")) {
                  removeElementAndParentIfEmpty(
                    document.getElementById("sequel_countdown")
                  );
                }
                Sequel.renderEvent({
                  eventId: sequelEventId,
                  joinCode: registeredAttendeee.joinCode,
                });
              } else {
                renderAppInsideDocument(
                  <MarketoRegistrationSuccess
                    event={event}
                    joinCode={registeredAttendeee.joinCode}
                    onOpenEvent={() => {
                      removeElementAndParentIfEmpty(htmlForm);
                      Sequel.renderEvent({
                        eventId: sequelEventId,
                        joinCode: registeredAttendeee.joinCode,
                      });
                    }}
                  />,
                  form
                );
              }
              return false;
            },
          });
        } else {
          // Listen for HubSpot form submission via postMessage
          window.addEventListener("message", async (eventSubmission) => {
            if (
              eventSubmission.data.type === "hsFormCallback" &&
              eventSubmission.data.eventName === "onFormSubmitted"
            ) {
              const submissionValues =
                eventSubmission.data.data.submissionValues;
              const submittedFormId = eventSubmission.data.data.formGuid;

              if (hubspotFormId && submittedFormId !== hubspotFormId) {
                return;
              }

              const firstName = submissionValues.firstname || "";
              const lastName = submissionValues.lastname || "";
              const email = submissionValues.email || "";

              if (!firstName || !lastName || !email) {
                console.error(
                  "The HubSpot form was submitted but the first name, last name, or email was not found for Sequel to register the user. Please double check the form fields."
                );
                return;
              }

              const registeredAttendeee = await registrationApi.registerUser({
                name: `${firstName} ${lastName}`,
                email: email,
                eventId: sequelEventId,
              });
              setSequelJoinCodeCookie(
                sequelEventId,
                registeredAttendeee.joinCode
              );
              if (!renderAddToCalendar) {
                removeElementAndParentIfEmpty(htmlForm);
                Sequel.renderEvent({
                  eventId: sequelEventId,
                  joinCode: registeredAttendeee.joinCode,
                });
              } else {
                renderAppInsideDocument(
                  <MarketoRegistrationSuccess
                    event={event}
                    joinCode={registeredAttendeee.joinCode}
                    onOpenEvent={() => {
                      removeElementAndParentIfEmpty(htmlForm);
                      Sequel.renderEvent({
                        eventId: sequelEventId,
                        joinCode: registeredAttendeee.joinCode,
                      });
                    }}
                  />,
                  form
                );
              }
            }
          });
        }
      });
    } else {
      removeElementAndParentIfEmpty(htmlForm);
      Sequel.renderEvent({
        eventId: sequelEventId,
        joinCode: joinCode || "",
      });
    }
  };

  static renderSequelWithMarketoFrame = async ({
    sequelEventId,
    renderAddToCalendar = false,
    loadMarketoForm = true,
  }: RenderMarketoFormParams) => {
    const joinCode = await getValidatedJoinCode({
      eventId: sequelEventId,
    });

    const event = await getEvent(sequelEventId);
    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    const formId = event.registration?.marketoFormId;
    if (!formId) {
      console.error(
        "The Sequel script is set to render the Marketo form but the event does not have a Marketo form id. Please double check the event information in the Sequel dashboard."
      );
      return;
    }

    let sequelRoot = document.getElementById(`sequel_root`);
    if (!sequelRoot) {
      console.error(
        "The Sequel root element was not found. Please add a div with id `sequelRoot` to your html."
      );
      return;
    }

    let htmlForm = document.getElementById(`mktoForm`);
    if (!htmlForm) {
      console.error(
        "The Marketo element was not found. Please add a div with id `mktoForm` to your html."
      );
      return;
    }

    const form = htmlForm.appendChild(document.createElement("form"));
    form.id = `mktoForm_${formId}`;

    if (!joinCode && event.registration?.outsideOfAppEnabled) {
      onDocumentReady(() => {
        // Check for pending Marketo registrations after page refresh
        Sequel.checkPendingMarketoRegistration();

        if (loadMarketoForm) {
          if (
            !event?.registration?.marketoFormId ||
            !event.registration?.marketoBaseUrl ||
            !event.registration?.marketoMunchkinId
          ) {
            console.error(
              "The Sequel script is set to render the Marketo form but the event does not have a Marketo form id, base url, or munchkin id. Please double check the event information in the Sequel dashboard."
            );
          } else {
            window.MktoForms2?.loadForm(
              event.registration?.marketoBaseUrl,
              event.registration?.marketoMunchkinId,
              event.registration?.marketoFormId
            );
          }
        }

        window.MktoForms2?.whenReady((e) => {
          e.onSuccess((registrant: any, followUpUrl: string) => {
            // Store form submission data in localStorage before async operation
            // in case the page refreshes and interrupts the API call
            const pendingRegistrationData = {
              registrant,
              eventId: sequelEventId,
              renderAddToCalendar,
              followUpUrl,
              timestamp: Date.now()
            };
            
            localStorage.setItem("sequelPendingMarketoRegistration", JSON.stringify(pendingRegistrationData));
            
            // Immediately prevent default form submission behavior
            // and handle registration asynchronously to avoid Firefox issues
            const completeRegistration = async () => {
              let joinCode: string = "";
              try { 
                const registeredAttendeee = await registrationApi.registerUser({
                  name: `${registrant.FirstName} ${registrant.LastName}`,
                  email: registrant.Email,
                  eventId: sequelEventId,
                });
                joinCode = registeredAttendeee.joinCode;
                setSequelJoinCodeCookie(
                  sequelEventId,
                  registeredAttendeee.joinCode
                );
                
                // Clear the pending registration data since we completed successfully
                localStorage.removeItem("sequelPendingMarketoRegistration");
              } catch (error) {
                console.error("Error registering Marketo attendee:", error);
                // Don't clear localStorage here - let the page refresh handle it
                // On error, still allow the form to proceed with followUpUrl if available
                if (followUpUrl) {
                  window.location.href = followUpUrl;
                }
                return;
              }

              if (!joinCode) {
                // If no joinCode, allow form to proceed with followUpUrl if available
                if (followUpUrl) {
                  window.location.href = followUpUrl;
                }
                return;
              }
              
              if (!renderAddToCalendar) {
                if (followUpUrl) {
                  window.location.href = followUpUrl;
                } else {
                  removeElementAndParentIfEmpty(htmlForm);
                  Sequel.renderEvent({
                    eventId: sequelEventId,
                    joinCode,
                  });
                }
              } else {
                renderAppInsideDocument(
                  <MarketoRegistrationSuccess
                    event={event}
                    joinCode={joinCode}
                    onOpenEvent={() => {
                      removeElementAndParentIfEmpty(htmlForm);
                      Sequel.renderEvent({
                        eventId: sequelEventId,
                        joinCode,
                      });
                    }}
                  />,
                  form
                );
              }
            };

            // Execute async operation without blocking the callback
            completeRegistration().catch((error) => {
              console.error("Error in completeRegistration:", error);
              // Fallback to followUpUrl if available
              if (followUpUrl) {
                window.location.href = followUpUrl;
              }
            });

            // Return false immediately to prevent default form submission
            return false;
          });
        });
      });
    } else {
      removeElementAndParentIfEmpty(htmlForm);
      Sequel.renderEvent({
        eventId: sequelEventId,
        joinCode: joinCode || "",
      });
    }
  };

  static renderEvent = async ({
    eventId,
    joinCode,
    hybrid,
    isPopup,
    agenda,
  }: RenderEventParams & { isPopup?: boolean }) => {
    renderApp(
      <div className="flex flex-col gap-20">
        <EmbedIframe
          eventId={eventId}
          joinCode={joinCode}
          hybrid={hybrid}
          isPopup={isPopup}
        />
        {agenda && <ZoomInfoAgendaContainer agenda={agenda} />}
      </div>
    );
  };

  static embedSequelRegistration = async ({
    sequelEventId,
    isPopup = false,
  }: {
    sequelEventId: string;
    isPopup?: boolean;
  }) => {
    const joinCode = await getValidatedJoinCode({ eventId: sequelEventId });
    const event = await getEvent(sequelEventId);

    console.log(sequelEventId);

    const searchParams = new URLSearchParams(window.location.search);
    const testMode = searchParams.get("testMode");

    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    if (sequelEventId === "723b6d9d-238c-48e5-84f7-17bb2d97fe02") {
      const isOnZoomInfoMainPage = window.location.href.startsWith(
        "https://www.zoominfo.com/gtm25-virtual"
      );

      const isDayOfEvent = isSameDay(new Date(), new Date(event.startDate));

      if (testMode || (isOnZoomInfoMainPage && joinCode && isDayOfEvent)) {
        const targetUrl = new URL(
          "https://www.zoominfo.com/live/gtm25-keynote"
        );
        targetUrl.search = window.location.search;
        window.location.href = targetUrl.toString();
      }

      if (joinCode && isDayOfEvent) {
        forceLinksToNewTab();
        window.addEventListener("DOMContentLoaded", forceLinksToNewTab);
      }
    }

    const sequelRoot = document.getElementById(`sequel_root`);
    if (!sequelRoot) {
      console.error(
        "The Sequel root element was not found. Please add a div with id `sequelRoot` to your html."
      );
      return;
    }
    // Apply special styling for popup mode
    if (isPopup) {
      // Set styles for the sequel_root element
      sequelRoot.style.margin = "0";
      sequelRoot.style.padding = "0";
      sequelRoot.style.width = "100%";
      sequelRoot.style.overflow = "hidden";
    }

    // Add event listener for registration redirect
    window.addEventListener("message", (e) => {
      if (
        e.data.event === "user-registered" &&
        e.data.data.redirectUrl &&
        e.data.data.joinCode &&
        e.data.data.eventId
      ) {
        const { eventId, joinCode, redirectUrl } = e.data.data;

        // Handle URLs that might already have query parameters
        const url = new URL(redirectUrl);
        url.searchParams.append("joinCode", joinCode);
        url.searchParams.append("eventId", eventId);

        setTimeout(() => {
          window.location.href = url.toString();
        }, 3000);
      }
    });

    // Simply render the Sequel event with the joinCode if it exists
    Sequel.renderEvent({
      eventId: sequelEventId,
      joinCode: joinCode || "",
      hybrid: true,
      isPopup: isPopup,
      agenda: event.agenda,
    });
  };

  static getHubspotFormId = async ({
    sequelEventId,
  }: {
    sequelEventId: string;
  }) => {
    const event = await getEvent(sequelEventId);
    return event.registration?.hubspotFormId;
  };

  static embedSequel = async ({ sequelEventId }: { sequelEventId: string }) => {
    const joinCode = await getValidatedJoinCode({ eventId: sequelEventId });
    const event = await getEvent(sequelEventId);

    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    let sequelRoot = document.getElementById(`sequel_root`);
    if (!sequelRoot) {
      console.error(
        "The Sequel root element was not found. Please add a div with id `sequelRoot` to your html."
      );
      return;
    }
    sequelRoot.style.marginTop = "100px";
    sequelRoot.style.padding = "20px";

    // Simply render the Sequel event with the joinCode if it exists
    Sequel.renderEvent({
      eventId: sequelEventId,
      joinCode: joinCode || "",
      agenda: event.agenda,
    });
  };

  static renderEmbedAgenda = async ({ eventId }: { eventId: string }) => {
    const event = await getEvent(eventId);

    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    if (!event.agenda) {
      console.error(
        "The Sequel event does not have an agenda. Please double check the event information in the Sequel dashboard."
      );
      return;
    }

    renderApp(<ZoomInfoAgendaContainer agenda={event.agenda} />);
  };

  static handleWebinarRegistration = (
    formValues: any,
    form: any,
    companyId: string
  ) => {
    const dates: string[] = [];

    // Check for the select dropdown for webinar date
    const webinarDateSelect = document.querySelector('select[name="mktoWebinarDate"]') as HTMLSelectElement;
    if (webinarDateSelect && webinarDateSelect.value) {
      // The value is in MM-DD-YYYY format, convert to YYYY-MM-DD
      const [month, day, year] = webinarDateSelect.value.split("-");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      dates.push(formattedDate);
    } else {
      // Fallback: Check for legacy checkbox/radio format
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Collect all selected webinar dates from checkboxes/radios
      for (let i = 1; i <= 5; i++) {
        const fieldName = `mktoWebinar0${i}`;
        const input = document.querySelector(`input[name="${fieldName}"]`);

        // Handle both radio buttons and checkboxes
        if (input && (input as HTMLInputElement).checked) {
          const disclaimer =
            document.querySelector(`label[id="Lbl${fieldName}"] .disclaimer`) ||
            document
              .querySelector(`#${fieldName}`)
              ?.closest(".mktoFormRow")
              ?.querySelector(".disclaimer");

          if (disclaimer) {
            const text = disclaimer.textContent?.trim();
            if (!text) continue;

            const parts = text.split(",");
            if (parts.length > 1) {
              const dateStr = parts[1].trim();
              const match = dateStr.match(/(\w+)\. (\d+)/); // e.g., Apr. 22
              if (match && match.length === 3) {
                const monthIndex = months.indexOf(match[1]);
                const day = parseInt(match[2], 10);
                const year = new Date().getFullYear();
                const date = new Date(year, monthIndex, day);
                const formattedDate = `${date.getFullYear()}-${(
                  date.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`;
                dates.push(formattedDate);
              }
            }
          }
        }
      }
    }

    // Prepare the base payload
    const basePayload = {
      name: formValues.FirstName + " " + formValues.LastName,
      email: formValues.Email,
      formId: form.getId(),
      url: window.location.href.split("?")[0],
      companyId: companyId,
    };

    // If no dates were found, send one registration without a date
    if (dates.length === 0) {
      fetch("https://api.introvoke.com/api/v3/events/registrant/marketo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      }).catch((error) => {
        console.error("Error sending webinar registration:", error);
      });
      return;
    }

    // Send a registration for each selected date
    dates.forEach((date) => {
      const payload = {
        ...basePayload,
        date: date,
      };

      fetch("https://api.introvoke.com/api/v3/events/registrant/marketo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((error) => {
        console.error("Error sending webinar registration:", error);
      });
    });
  };

  // Check for pending Marketo registrations stored in localStorage
  static async checkPendingMarketoRegistration() {
    const pendingData = localStorage.getItem("sequelPendingMarketoRegistration");
    if (!pendingData) {
      return;
    }

    try {
      const { registrant, eventId, renderAddToCalendar, followUpUrl } = JSON.parse(pendingData);
      
      // Clear the stored data immediately to prevent duplicate processing
      localStorage.removeItem("sequelPendingMarketoRegistration");
      
      console.log("Processing pending Marketo registration for:", registrant.Email);
      
      // Complete the registration
      const registeredAttendeee = await registrationApi.registerUser({
        name: `${registrant.FirstName} ${registrant.LastName}`,
        email: registrant.Email,
        eventId: eventId,
      });
      
      setSequelJoinCodeCookie(eventId, registeredAttendeee.joinCode);
      
      if (!renderAddToCalendar) {
        if (followUpUrl) {
          window.location.href = followUpUrl;
        } else {
          // Remove form elements and render event
          const htmlForm = document.getElementById("mktoForm");
          removeElementAndParentIfEmpty(htmlForm);
          Sequel.renderEvent({
            eventId: eventId,
            joinCode: registeredAttendeee.joinCode,
          });
        }
      } else {
        const event = await getEvent(eventId);
        const form = document.getElementById(`mktoForm_${event.registration?.marketoFormId}`);
        renderAppInsideDocument(
          <MarketoRegistrationSuccess
            event={event}
            joinCode={registeredAttendeee.joinCode}
            onOpenEvent={() => {
              const htmlForm = document.getElementById("mktoForm");
              removeElementAndParentIfEmpty(htmlForm);
              Sequel.renderEvent({
                eventId: eventId,
                joinCode: registeredAttendeee.joinCode,
              });
            }}
          />,
          form
        );
      }
      
      console.log("Pending Marketo registration completed successfully");
    } catch (error) {
      console.error("Error processing pending Marketo registration:", error);
      // Clear the stored data even if there was an error
      localStorage.removeItem("sequelPendingMarketoRegistration");
    }
  }

  /**
   * Renders an event grid with upcoming and past events using React and Tailwind
   * @param {Object} options - Configuration options
   * @param {string} options.companyId - The company ID to fetch events for
   * @param {boolean} [options.darkMode=false] - Whether to use dark mode styling
   * @param {string} [options.excludeText=''] - Text to exclude events starting with (e.g., 'test')
   * @param {boolean} [options.showDescription=false] - Whether to show event descriptions
   */
  static renderEventGrid = async ({
    companyId,
    darkMode = false,
    excludeText = '',
    showDescription = false
  }: {
    companyId: string;
    darkMode?: boolean;
    excludeText?: string;
    showDescription?: boolean;
  }) => {
    if (!companyId) {
      console.error('Company ID is required for Sequel event grid.');
      return;
    }

    // Check if sequel_root exists before rendering
    const sequelRoot = document.getElementById('sequel_root');
    if (!sequelRoot) {
      console.error('Element with id "sequel_root" not found. Please add a div with this id to your HTML.');
      return;
    }
    
    renderApp(<EventGrid companyId={companyId} darkMode={darkMode} excludeText={excludeText} showDescription={showDescription} />);
  };

  /**
   * Renders related events widget for event pages
   * @param {Object} options - Configuration options
   * @param {string} options.companyId - The company ID to fetch events for
   * @param {boolean} [options.darkMode=false] - Whether to use dark mode styling
   * @param {string} [options.excludeText=''] - Text to exclude events starting with (e.g., 'test')
   * @param {boolean} [options.showDescription=false] - Whether to show event descriptions
   * @param {number} [options.maxEvents=6] - Maximum number of events to show
   */
  static renderRelatedEvents = async ({
    companyId,
    darkMode = false,
    excludeText = '',
    showDescription = false,
    maxEvents = 6
  }: {
    companyId: string;
    darkMode?: boolean;
    excludeText?: string;
    showDescription?: boolean;
    maxEvents?: number;
  }) => {
    if (!companyId) {
      console.error('Company ID is required for Sequel related events.');
      return;
    }

    // Check if sequel_root exists before rendering
    const sequelRoot = document.getElementById('sequel_root');
    if (!sequelRoot) {
      console.error('Element with id "sequel_root" not found. Please add a div with this id to your HTML.');
      return;
    }
    
    renderApp(<RelatedEvents companyId={companyId} darkMode={darkMode} excludeText={excludeText} showDescription={showDescription} maxEvents={maxEvents} />);
  };
}

window.Sequel = Sequel;
