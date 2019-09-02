import * as Bowser from 'bowser';

const browserObject = Bowser.getParser(window.navigator.userAgent);
export const browserName = browserObject.getBrowserName();
export const browserVersion = browserObject.getBrowserVersion();

const getMajorVersion = browserVersion
  ? parseInt(browserVersion.split('.')[0], 0)
  : false;

// Safari
export const isOldSafari = browserName === 'Safari' && getMajorVersion === 9;

export const isSafari = browserName === 'Safari' && getMajorVersion > 9;

// Edge
export const isOldEdge =
  browserName === 'Microsoft Edge' && getMajorVersion === 15;
export const isEdge = browserName === 'Microsoft Edge' && getMajorVersion > 15;

// Internet Explorer 6-11
export const isIE = browserName === 'Internet Explorer';

// Firefox
export const isFirefox = browserName === 'Firefox';

// Chrome
export const isChrome = browserName === 'Chrome';
export const isOldChrome = browserName === 'Chrome' && getMajorVersion < 65;
