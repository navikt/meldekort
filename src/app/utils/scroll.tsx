export function scrollTilElement(elementid?: string, oppforsel: ScrollBehavior = 'smooth') {
  let elementPos = 0;

  if (typeof elementid !== 'undefined') {
    elementPos = document.getElementById(elementid)!.getBoundingClientRect().top + window.scrollY;
  }

  window.scroll({
    top: elementPos,
    behavior: typeof oppforsel === 'undefined' ? 'smooth' : oppforsel,
  });
}
