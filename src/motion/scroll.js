// Shared access to the smooth scroller, so any component can scroll the page the same way it does.
let lenis = null;

export function setSmoothScroller(instance) {
  lenis = instance;
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scrolls to the top: smoothly through Lenis when it is running, otherwise with the browser's own scrolling.
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
