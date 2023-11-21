import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import { onDocumentReady, renderApp } from "@src/utils/dom";
import { getValidatedJoinCode } from "@src/utils/user";
import registrationApi from "@src/api/registration";
import { MarketoRegistrationSuccess } from "./routes/MarketoRegistrationSuccess";
import { EmbedIframe } from "./routes/EmbedIframe";

interface RenderMarketoFormParams {
  marketoUrl: string;
  marketoId: string;
  marketoFormId: string;
  sequelCompanyId: string;
  sequelEventId: string;
}

interface RenderEventParams {
  eventId: string;
  joinCode: string;
}

class Sequel {
  static renderMarketoSequelRegistration = async ({
    marketoUrl,
    marketoId,
    marketoFormId,
    sequelCompanyId,
    sequelEventId,
  }: RenderMarketoFormParams) => {
    // done this
    const joinCode = await getValidatedJoinCode({
      eventId: sequelEventId,
    });

    if (!joinCode) {
      onDocumentReady(() => {
        window.MktoForms2?.loadForm(marketoUrl, marketoId, marketoFormId);
        window.MktoForms2?.whenReady((e) => {
          e.onSuccess(async (registrant) => {
            const completeRegistration = async () => {
              const registeredAttendeee =
                await registrationApi.registerMarketoAttendee({
                  name: `${registrant.FirstName} ${registrant.LastName}`,
                  email: registrant.Email,
                  formId: marketoFormId,
                  companyId: sequelCompanyId,
                });
              setSequelJoinCodeCookie(registeredAttendeee.joinCode);

              const form = document.getElementById(`mktoForm_${marketoFormId}`);
              if (form) form.style.display = "none";

              renderApp(<MarketoRegistrationSuccess />);
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
