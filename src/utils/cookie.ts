import Cookies from "js-cookie";

export function getSequelJoinCodeCookie(eventId: string): string | null {
  return Cookies.get(`sequel-${eventId}`) ?? null;
}

export function setSequelJoinCodeCookie(eventId: string, joinCode: string): string {
  return Cookies.set(`sequel-${eventId}`, joinCode, { secure: true, expires: 31 }) ?? "";
}

interface SourcebusterData {
  typ?: string;
  src?: string;
  mdm?: string;
  cmp?: string;
  cnt?: string;
  trm?: string;
}

/**
 * Parse Sourcebuster.js cookie value
 * Example: typ%3Dutm%7C%7C%7Csrc%3Dgoogle_paid%7C%7C%7Cmdm%3Dpaid_search
 * Decodes to: typ=utm|||src=google_paid|||mdm=paid_search
 */
function parseSourcebusterCookie(cookieValue: string): SourcebusterData {
  const decoded = decodeURIComponent(cookieValue);
  const pairs = decoded.split('|||');
  const data: SourcebusterData = {};
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value && value !== '(none)' && value !== '(direct)') {
      data[key as keyof SourcebusterData] = value;
    }
  }
  
  return data;
}

/**
 * Map Sourcebuster.js fields to UTM parameter names
 */
function mapSourcebusterToUTM(data: SourcebusterData, prefix: string = ''): Record<string, string> {
  const utmParams: Record<string, string> = {};
  const fieldMap: Record<string, string> = {
    src: 'source',
    mdm: 'medium',
    cmp: 'campaign',
    cnt: 'content',
    trm: 'term',
  };
  
  for (const [sbKey, utmSuffix] of Object.entries(fieldMap)) {
    const value = data[sbKey as keyof SourcebusterData];
    if (value) {
      const paramName = prefix ? `${prefix}_utm_${utmSuffix}` : `utm_${utmSuffix}`;
      utmParams[paramName] = value;
    }
  }
  
  return utmParams;
}

/**
 * Get a cookie value by name using native browser API
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

/**
 * Get UTM parameters from Sourcebuster.js cookies
 * Returns both current and first touch attribution parameters
 */
export function getSourcebusterUTMParams(): Record<string, string> {
  const allParams: Record<string, string> = {};
  
  // Get current attribution (sbjs_current)
  const currentCookie = getCookie('sbjs_current');
  if (currentCookie) {
    const currentData = parseSourcebusterCookie(currentCookie);
    const currentUTMs = mapSourcebusterToUTM(currentData);
    Object.assign(allParams, currentUTMs);
  }
  
  // Get first touch attribution (sbjs_first)
  const firstCookie = getCookie('sbjs_first');
  if (firstCookie) {
    const firstData = parseSourcebusterCookie(firstCookie);
    const firstUTMs = mapSourcebusterToUTM(firstData, 'first');
    Object.assign(allParams, firstUTMs);
  }
  
  return allParams;
}
