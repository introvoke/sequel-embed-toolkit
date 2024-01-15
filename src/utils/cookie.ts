import Cookies from "js-cookie";

export function getSequelJoinCodeCookie(eventId: string): string | null {
  return Cookies.get(`sequel-${eventId}`) ?? null;
}

export function setSequelJoinCodeCookie(eventId: string, joinCode: string): string {
  return Cookies.set(`sequel-${eventId}`, joinCode, { secure: true, expires: 31 }) ?? "";
}
