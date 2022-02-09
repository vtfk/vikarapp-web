/**
 * Determines if the request is made by a Microsoft Teams client
 * @returns { Boolean }
 */
export function isFromTeams() {
  if(!window?.navigator?.userAgent) return false;
  const userAgent = window.navigator.userAgent.toLocaleLowerCase();
  return userAgent.includes('microsoftteams') || userAgent.includes('teamsmobile') || true;
}

/**
 * Determines if the request is made by a mobile device
 * @returns { Boolean }
 */
 export function isFromMobile() {
  if(!window?.navigator?.userAgent) return false;
  const userAgent = window.navigator.userAgent.toLocaleLowerCase();
  return userAgent.includes('mobile') || userAgent.includes('android') || false;
}