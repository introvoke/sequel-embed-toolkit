import Cookies from "js-cookie";

export function getSequelJoinCodeCookie(): string | null {
  return Cookies.get("sequel") ?? null;
}

export function setSequelJoinCodeCookie(joinCode: string): string {
  return Cookies.set("sequel", joinCode, { secure: true, expires: 31 }) ?? "";
}
