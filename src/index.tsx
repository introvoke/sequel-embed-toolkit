import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import {
  onDocumentReady,
  renderApp,
  renderAppInsideDocument,
} from "@src/utils/dom";
import { getValidatedJoinCode } from "@src/utils/user";
import registrationApi from "@src/api/registration";
import { MarketoRegistrationSuccess } from "./routes/MarketoRegistrationSuccess";
import { EmbedIframe } from "./routes/EmbedIframe";
import { getEvent } from "./api/event/getEvent";
import { trackIdentify, trackPageView } from "./api/website/website";
import { getUserEmailFromJoinCode } from "./api/registration/getUserJoinInformation";

interface RenderMarketoFormParams {
  sequelEventId: string;
  renderAddToCalendar?: boolean;
  loadMarketoForm?: boolean;
}

interface RenderHubspotFormParams {
  sequelEventId: string;
  renderAddToCalendar?: boolean;
  loadHubspotForm?: boolean;
}

interface RenderEventParams {
  eventId: string;
  joinCode: string;
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

class Sequel {
  static companyId: string | null = null;
  static userId: string | null = null;
  static sessionId: string | null = null;

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
    Sequel.userId = Sequel.getOrCreateUserId();
    Sequel.sessionId = Sequel.getOrCreateSessionId();
    Sequel.checkJoinCode();
    Sequel.listenForIframeMessages();
  }

  static trackLinkClicks() {
    document.addEventListener("click", async (event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.href) {
        const data = {
          pageName: "Unknown", 
          url: target.href,
          referrer: window.location.href,
          userAgent: navigator.userAgent,
        };
        Sequel.sendData("page_view", data);
      }
    });
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
    window.addEventListener("load", () => Sequel.trackPageView());
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
    window.addEventListener("message", (event) => {
      if (event.data?.event === "user-registered") {
        const email = event.data?.data?.email;
        if (email) {
          console.log(`User registered with email: ${email}`);
          Sequel.identify(email); // Send identify event
        }
      }
    });
  }

  static renderSequelWithHubspotFrame = async ({
    sequelEventId,
    renderAddToCalendar = false,
    loadHubspotForm = true,
  }: RenderHubspotFormParams) => {
    const joinCode = await getValidatedJoinCode({ eventId: sequelEventId });
    const event = await getEvent(sequelEventId);

    if (!event) {
      console.error(
        "Sequel event not found. Please double check the event id."
      );
      return;
    }

    const hubspotFormId = event.registration?.hubspotFormId;
    if (!hubspotFormId) {
      console.error(
        "The Sequel script is set to render the HubSpot form but the event does not have a HubSpot form id. Please double check the event information in the Sequel dashboard."
      );
      return;
    }

    const hubspotPortalId = event.registration?.hubspotPortalId;
    if (!hubspotPortalId) {
      console.error(
        "The Sequel script is set to render the HubSpot form but the event does not have a HubSpot portal id. Please double check the event information in the Sequel dashboard."
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

    let htmlForm = document.getElementById(`hubspotForm`);
    if (!htmlForm) {
      console.error(
        "The HubSpot element was not found. Please add a div with id `hubspotForm` to your html."
      );
      return;
    }

    const form = htmlForm.appendChild(document.createElement("form"));
    form.id = `hubspotForm_${hubspotFormId}`;

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
            const completeRegistration = async () => {
              const registeredAttendeee = await registrationApi.registerUser({
                name: `${registrant.FirstName} ${registrant.LastName}`,
                email: registrant.Email,
                eventId: sequelEventId,
              });
              setSequelJoinCodeCookie(
                sequelEventId,
                registeredAttendeee.joinCode
              );
              if (!renderAddToCalendar) {
                if (followUpUrl) {
                  window.location.href = followUpUrl;
                } else {
                  removeElementAndParentIfEmpty(htmlForm);
                  Sequel.renderEvent({
                    eventId: sequelEventId,
                    joinCode: registeredAttendeee.joinCode,
                  });
                }
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
            };

            completeRegistration();
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

  static renderEvent = async ({ eventId, joinCode }: RenderEventParams) => {
    renderApp(<EmbedIframe eventId={eventId} joinCode={joinCode} />);
  };
}

window.Sequel = Sequel;
