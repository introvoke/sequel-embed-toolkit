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

  static renderSequelWithHubspotFrame = async ({
    sequelEventId,
    renderAddToCalendar = false,
    loadHubspotForm = true,
  }: RenderHubspotFormParams) => {
    const joinCode = await getValidatedJoinCode({ eventId: sequelEventId });
    const event = await getEvent(sequelEventId);


//     <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
// <script>
//   hbspt.forms.create({
//     region: "na1",
//     portalId: "5876265",
//     formId: "8b2d955c-7616-489c-8cc1-4c2499e3fb35"
//   });
// </script>
  
    if (!event) {
      console.error("Sequel event not found. Please double check the event id.");
      return;
    }
  
    // const hubspotFormId = event.registration?.hubspotFormId;
    const hubspotFormId = "8b2d955c-7616-489c-8cc1-4c2499e3fb35";
    if (!hubspotFormId) {
      console.error(
        "The Sequel script is set to render the HubSpot form but the event does not have a HubSpot form id. Please double check the event information in the Sequel dashboard."
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
           // portalId: event.registration?.hubspotPortalId,
            portalId: "5876265",
            formId: hubspotFormId,
            target: `#hubspotForm_${hubspotFormId}`,
          });

          window.addEventListener('message', eventSubmission => {
            if(eventSubmission.data.type === 'hsFormCallback' && eventSubmission.data.eventName === 'onFormSubmitted') {
                const completeRegistration = async (data: any) => {
                  const registeredAttendeee = await registrationApi.registerUser({
                    name: `${data.submissionValues.firstname} ${data.submissionValues.lastname}`,
                    email: data.submissionValues.email,
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
                };

                completeRegistration(eventSubmission.data.data);

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

  static renderEvent = async ({ eventId, joinCode }: RenderEventParams) => {
    renderApp(<EmbedIframe eventId={eventId} joinCode={joinCode} />);
  };
}

window.Sequel = Sequel;
