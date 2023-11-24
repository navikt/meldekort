import * as Bowser from "bowser";

const browserObject = Bowser.getParser(window.navigator.userAgent);
export const browserName = browserObject.getBrowserName();
export const browserVersion = browserObject.getBrowserVersion();
export const OSName = browserObject.getOSName();

const getMajorVersion = browserVersion
  ? parseInt(browserVersion.split(".")[0], 0)
  : 0;

// Safari
export const isSafari = browserName === "Safari";
export const isOldSafari = browserName === "Safari" && getMajorVersion < 10;

// Edge
export const isEdge = browserName === "Microsoft Edge" && getMajorVersion < 16;
export const isOldEdge =
  browserName === "Microsoft Edge" && getMajorVersion < 16;

// Internet Explorer 6-11
export const isIE = browserName === "Internet Explorer";
export const isOldIE =
  browserName === "Internet Explorer" && getMajorVersion < 10;

// Firefox
export const isFirefox = browserName === "Firefox";
export const isOldFirefox = browserName === "Firefox" && getMajorVersion < 52;

// Chrome
export const isChrome = browserName === "Chrome";
export const isOldChrome = browserName === "Chrome" && getMajorVersion < 65;
