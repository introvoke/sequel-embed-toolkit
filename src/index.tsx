import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import { onDocumentReady, renderApp } from "@src/utils/dom";
import { getValidatedJoinCode } from "@src/utils/user";
import registrationApi from "@src/api/registration";
import { MarketoRegistrationSuccess } from "./routes/MarketoRegistrationSuccess";
import { EmbedIframe } from "./routes/EmbedIframe";
import { getEvent } from "./api/event/getEvent";

interface RenderMarketoFormParams {
  sequelEventId: string;
  loadMarketoForm?: boolean;
}

interface RenderEventParams {
  eventId: string;
  joinCode: string;
}

class Sequel {
  static renderSequelWithMarketoFrame = async ({
    sequelEventId,
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
    let htmlForm = document.getElementById(`mktoForm_${formId}`);
    if (!htmlForm) {
      const form = document.body.appendChild(document.createElement("form"));
      form.id = `mktoForm_${formId}`;
      htmlForm = form;
    }

    if (!joinCode) {
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
          e.onSuccess((registrant) => {
            const completeRegistration = async () => {
              const registeredAttendeee =
                await registrationApi.registerMarketoAttendee({
                  name: `${registrant.FirstName} ${registrant.LastName}`,
                  email: registrant.Email,
                  formId: formId,
                  companyId: event.organizerUid,
                });
              setSequelJoinCodeCookie(sequelEventId, registeredAttendeee.joinCode);
              if (htmlForm) {
                htmlForm.style.display = "none";
              }
              
              renderApp(
                <MarketoRegistrationSuccess
                  event={event}
                  joinCode={registeredAttendeee.joinCode}
                  onOpenEvent={() =>
                    Sequel.renderEvent({
                      eventId: sequelEventId,
                      joinCode: registeredAttendeee.joinCode,
                    })
                  }
                />
              );
            };
            completeRegistration();
            return false;
          });
        });
      });
    } else {
      Sequel.renderEvent({
        eventId: sequelEventId,
        joinCode,
      });
    }
  };

  static renderEvent = async ({ eventId, joinCode }: RenderEventParams) => {
    renderApp(<EmbedIframe eventId={eventId} joinCode={joinCode} />);
  };
}

window.Sequel = Sequel;
