export function scrollTilElement(
  elementid?: string,
  oppforsel: ScrollBehavior = 'smooth'
) {
  let elementPos = 0;

  if (typeof elementid !== 'undefined') {
    elementPos =
      document.getElementById(elementid)!.getBoundingClientRect().top +
      window.scrollY;
  }

  try {
    window.scroll({
      top: elementPos,
      behavior: typeof oppforsel === 'undefined' ? 'smooth' : oppforsel,
    });
  } catch (e) {
    try {
      if (typeof elementid === 'undefined') {
        elementid = 'periodebanner';
      }
      document.getElementById(elementid)!.scrollIntoView();
    } catch (e) {
      console.log('Kunne ikke scrolle');
    }
  }
}
