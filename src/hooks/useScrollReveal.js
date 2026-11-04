import { useEffect } from 'react';

// The watched area runs from far above the page down to just above the bottom of the screen. So anything the
// visitor has scrolled past counts as seen, even when a jump (a nav link, the End key, dragging the scrollbar)
// skips over it without it ever being on screen.
const ROOT_MARGIN = '100000px 0px -12% 0px';

// Reveals every [data-reveal] element the first time it scrolls into view. With reduced motion the
// reveals are plain fades (see motion.css). Without the has-reveal class, for example if scripts fail,
// everything is simply visible.
export function useScrollReveal() {
  useEffect(() => {
    const html = document.documentElement;
    const elements = [...document.querySelectorAll('[data-reveal]')];

    elements
      .filter((element) => element.dataset.reveal === 'stagger')
      .forEach((element) => [...element.children].forEach((child, i) => child.style.setProperty('--reveal-i', i)));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: ROOT_MARGIN },
    );
    elements.forEach((element) => observer.observe(element));
    html.classList.add('has-reveal');

    return () => {
      observer.disconnect();
      html.classList.remove('has-reveal');
    };
  }, []);
}
