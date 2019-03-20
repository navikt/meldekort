export function scrollToTop() {
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top > 0) {
        window.scrollTo(0, top - 15);
        setTimeout(scrollToTop, 10);
    }
}