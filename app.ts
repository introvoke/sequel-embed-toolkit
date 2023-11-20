import Cookies from "js-cookie";

export interface RegisteredAttendeeResponse {
  uid: string;
  name: string;
  email: string;
  join_url: string;
  joinCode: string;
  authToken?: string;
  metadata?: any;
}

export interface MarketoFormSettings {
  marketoUrl: string;
  marketoId: string;
  formId: string;
}

class SequelUtility {
  public static getUrlParameter(name: string): string {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  public static getSequelCookie(): string {
    return Cookies.get("sequel") || "";
  }

  public static setSequelCookie(joinCode: string): string {
    return Cookies.set("sequel", joinCode, { secure: true });
  }

  public static async getUserJoinInformation(
    eventId: string,
    joinCode: string
  ): Promise<RegisteredAttendeeResponse> {
    const configUrl = `https://api.introvoke.com/api/v3/events/${eventId}/join/${joinCode}`;
    const response = await fetch(configUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data: RegisteredAttendeeResponse = response.body as any;
    return data;
  }

  public static async renderMarketoOfSequelForm(
    marketoUrl: string,
    marketoId: string,
    marketoFormId: string,
    sequelCompanyId: string,
    sequelEventId: string
  ) {
    const joinCode = SequelUtility.getUrlParameter("joinCode");
    const sequelCookie = SequelUtility.getSequelCookie();
    let displayForm = true;
    let validatedJoinCode = "";

    if (joinCode) {
      const userInfo = await SequelUtility.getUserJoinInformation(
        sequelEventId,
        joinCode
      );
      if (userInfo) {
        displayForm = false;
        validatedJoinCode = userInfo.joinCode;
      }
    }

    if (sequelCookie) {
      const userInfo = await SequelUtility.getUserJoinInformation(
        sequelEventId,
        sequelCookie
      );
      if (userInfo) {
        displayForm = false;
        validatedJoinCode = userInfo.joinCode;
      }
    }

    if (displayForm && (window as any).MktoForms2) {
      (window as any).MktoForms2.loadForm(
        marketoUrl,
        marketoId,
        marketoFormId
      );
      (window as any).MktoForms2.whenReady((e) => {
        e.onSuccess(function (a, b) {
          fetch("http://localhost:8000/api/v3/events/registrant/marketo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: a.FirstName + " " + a.LastName,
              email: a.Email,
              formId: e.getId(),
              url: window.location.href.split("?")[0],
              companyId: sequelCompanyId,
            }),
          });
          return false;
        });
      });
    }

    if (validatedJoinCode && !displayForm) {
      var iframeUrl = `https://embed.sequel.io/event/${sequelEventId}?joinCode=${validatedJoinCode}`;

      // Create the iframe element
      const iframe = document.createElement("iframe");
      iframe.title = "Sequel event";
      iframe.width = "100%";
      iframe.height = "80vh";
      iframe.src = iframeUrl;
      iframe.frameBorder = "0";
      iframe.allow = "camera *; microphone *; autoplay; display-capture *";
      iframe.allowFullscreen = true;
      iframe.style.cssText =
        "height: 80vh; margin-right: 40px; border-radius: 12px; border: 1px solid #dbdfec; box-shadow: 3px 3px 10px 0 rgb(20 20 43 / 4%); width: 100%";

      // Append the iframe to the document body or a specific container element
      document.body.appendChild(iframe);
    }
  }
}
