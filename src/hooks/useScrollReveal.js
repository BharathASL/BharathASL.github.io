import { useEffect } from 'react';

const ROOT_MARGIN = '0px 0px -12% 0px';

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
