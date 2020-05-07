export function scrollTilElement(
  elementid?: string,
  oppforsel: ScrollBehavior = 'smooth',
  deltaY: number = 0
) {
  let elementPos = 0;

  if (typeof elementid !== 'undefined') {
    elementPos =
      document.getElementById(elementid)!.getBoundingClientRect().top +
      window.scrollY;
  }

  if (typeof deltaY !== 'undefined') {
    elementPos += deltaY;
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
    } catch (e2) {
      console.log('Kunne ikke scrolle');
    }
  }
}
