import { setSequelJoinCodeCookie } from "@src/utils/cookie";
import { onDocumentReady, renderApp } from "@src/utils/dom";
import { getValidatedJoinCode } from "@src/utils/user";
import registrationApi from "@src/api/registration";
import { MarketoRegistrationSuccess } from "./routes/MarketoRegistrationSuccess";

interface RenderMarketoForm {
  marketoUrl: string;
  marketoId: string;
  marketoFormId: string;
  sequelCompanyId: string;
  sequelEventId: string;
}

class Sequel {
  static renderMarketoSequelRegistration = async ({
    marketoUrl,
    marketoId,
    marketoFormId,
    sequelCompanyId,
    sequelEventId,
  }: RenderMarketoForm) => {
    (
      document.getElementById(`mktoForm_${marketoFormId}`) as HTMLFormElement
    ).style.display = "none";

    renderApp(MarketoRegistrationSuccess);

    // done this
    if (Math.random() < 0) {
      const joinCode = await getValidatedJoinCode({
        eventId: sequelEventId,
      });

      if (!joinCode) {
        onDocumentReady(() => {
          window.MktoForms2?.loadForm(marketoUrl, marketoId, marketoFormId);
          window.MktoForms2?.whenReady((e) => {
            e.onSuccess(async (registrant) => {
              const registeredAttendeee =
                await registrationApi.registerMarketoAttendee({
                  name: `${registrant.FirstName} ${registrant.LastName}`,
                  email: registrant.Email,
                  formId: marketoFormId,
                  companyId: sequelCompanyId,
                });
              setSequelJoinCodeCookie(registeredAttendeee.joinCode);

              (
                document.getElementById(
                  `mktoForm_${marketoFormId}`
                ) as HTMLFormElement
              ).style.display = "none";

              console.log("render app");
              renderApp(MarketoRegistrationSuccess);
            });
          });
        });
      }
    }
  };
}

window.Sequel = Sequel;
