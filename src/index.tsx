import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import { onDocumentReady, renderApp, renderAppInsideDocument } from "@src/utils/dom";
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

    let sequelRoot = document.getElementById(`sequel_root`);
    if (!sequelRoot) {
      console.error(
        "The Sequel root element was not found. Please add a div with id `sequelRoot` to your html."
      );
      return;
    }

    let htmlForm = document.getElementById(`mktoForm`);
    if (!htmlForm) {
      const form = sequelRoot.appendChild(document.createElement("form"));
      htmlForm = form;
    }
    htmlForm.id = `mktoForm_${formId}`;

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
          e.onSuccess((registrant) => {
            const completeRegistration = async () => {
              const registeredAttendeee =
                await registrationApi.registerUser({
                  name: `${registrant.FirstName} ${registrant.LastName}`,
                  email: registrant.Email,
                  eventId: sequelEventId,
                });
              setSequelJoinCodeCookie(sequelEventId, registeredAttendeee.joinCode);

              renderAppInsideDocument(
                <MarketoRegistrationSuccess
                  event={event}
                  joinCode={registeredAttendeee.joinCode}
                  onOpenEvent={() =>
                    Sequel.renderEvent({
                      eventId: sequelEventId,
                      joinCode: registeredAttendeee.joinCode,
                    })
                  }
                />, htmlForm
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
        joinCode: joinCode || "",
      });
    }
  };

  static renderEvent = async ({ eventId, joinCode }: RenderEventParams) => {
    renderApp(<EmbedIframe eventId={eventId} joinCode={joinCode} />);
  };
}

window.Sequel = Sequel;
