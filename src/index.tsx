import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import {
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
import { AgendaContainer } from "@src/routes/agenda/AgendaContainer";

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
  }

  static initializeTracking() {
    if (Sequel.hasConsent) {
      return;
    }

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
        {agenda && <AgendaContainer agenda={agenda} />}
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

    renderApp(<AgendaContainer agenda={event.agenda} />);
  };

  static handleWebinarRegistration = (formValues: any, form: any, companyId: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dates: string[] = [];

    // Collect all selected webinar dates
    for (let i = 1; i <= 5; i++) {
      const fieldName = `mktoWebinar0${i}`;
      const input = document.querySelector(`input[name="${fieldName}"]`);

      // Handle both radio buttons and checkboxes
      if (input && (input as HTMLInputElement).checked) {
        const disclaimer = document.querySelector(`label[id="Lbl${fieldName}"] .disclaimer`) ||
                         document.querySelector(`#${fieldName}`)?.closest(".mktoFormRow")?.querySelector(".disclaimer");

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
              const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
              dates.push(formattedDate);
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
      companyId: companyId
    };

    // If no dates were found, send one registration without a date
    if (dates.length === 0) {
      fetch("https://api.introvoke.com/api/v3/events/registrant/marketo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload)
      }).catch(error => {
        console.error("Error sending webinar registration:", error);
      });
      return;
    }

    // Send a registration for each selected date
    dates.forEach(date => {
      const payload = {
        ...basePayload,
        date: date
      };

      fetch("https://api.introvoke.com/api/v3/events/registrant/marketo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(error => {
        console.error("Error sending webinar registration:", error);
      });
    });
  };
}

window.Sequel = Sequel;
