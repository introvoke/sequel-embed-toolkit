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

export interface JoinInfo {
  joinUrl: string;
  authToken: string;
  joinCode: string;
  email: string;
}

export interface MarketoFormSettings {
  marketoUrl: string;
  marketoId: string;
  formId: string;
}

export function getUrlParameter(name: string): string {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function getSequelCookie(): string {
  return Cookies.get("sequel") || "";
}

export function setSequelCookie(joinCode: string): string {
  return Cookies.set("sequel", joinCode, { secure: true, expires: 31 }) ?? "";
}

export async function getUserJoinInformation(
  eventId: string,
  joinCode: string
): Promise<RegisteredAttendeeResponse> {
  const configUrl = `https://api.introvoke.com/api/v3/events/${eventId}/join/${joinCode}`;
  const response = await fetch(configUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data: RegisteredAttendeeResponse = (await response.json()) as any;
  return data;
}

export function registerAttendee(
  name: string,
  email: string,
  formId: string,
  companyId: string
) {
  fetch(
    "http://localhost:8000/api/v3/events/registrant/marketo",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        formId,
        url: window.location.href.split("?")[0],
        companyId,
      }),
    }
  ).then(async (response) => {
    const info = await response.json() as JoinInfo;
    if (info && info.joinCode) {
      setSequelCookie(info.joinCode);
    }

    return false;
  }).catch((error) => {
    console.error(error);
    return false;
  });

  return false;
}

export async function renderMarketoOfSequelForm(
  marketoUrl: string,
  marketoId: string,
  marketoFormId: string,
  sequelCompanyId: string,
  sequelEventId: string
) {
  const joinCode = getUrlParameter("joinCode");
  const sequelCookie = getSequelCookie();
  let displayForm = true;
  let validatedJoinCode = "";

  if (joinCode) {
    const userInfo = await getUserJoinInformation(sequelEventId, joinCode);
    if (userInfo && userInfo.joinCode) {
      displayForm = false;
      validatedJoinCode = userInfo.joinCode;
      setSequelCookie(validatedJoinCode);
    }
  }

  if (sequelCookie) {
    const userInfo = await getUserJoinInformation(sequelEventId, sequelCookie);
    if (userInfo && userInfo.joinCode) {
      displayForm = false;
      validatedJoinCode = userInfo.joinCode;
    }
  }

  if ( displayForm && (window as any).MktoForms2) {
    (window as any).MktoForms2.loadForm(marketoUrl, marketoId, marketoFormId);
    (window as any).MktoForms2.whenReady((e: any) => {
      e.onSuccess(function (a: any) {
        return registerAttendee(
          a.FirstName + " " + a.LastName,
          a.Email,
          marketoFormId,
          sequelCompanyId
        );
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

// Call the function directly or set it up to be called from your HTML
(window as any).renderMarketoOfSequelForm = renderMarketoOfSequelForm;
