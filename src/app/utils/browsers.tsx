// Edge
const isEdge = window.navigator.userAgent.indexOf('Edge') !== -1;

// Internet Explorer 6-11
export const isIE =
  window.navigator.userAgent.indexOf('Trident') !== -1 && !isEdge;

// Firefox
export const isFireFox = window.navigator.userAgent.indexOf('Mozilla') !== -1;
