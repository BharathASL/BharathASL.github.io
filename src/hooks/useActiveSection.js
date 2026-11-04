import { useEffect, useState } from 'react';

const READING_BAND = '-40% 0px -55% 0px';

// The section crossing the reading band is active. Once the footer is in view, the last section is,
// since a short last section may never reach the band. Only observers, so no layout reads while scrolling.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const crossing = new Map();
    let atBottom = false;
    const update = () => setActive(atBottom ? ids.at(-1) : (ids.find((id) => crossing.get(id)) ?? null));

    const sections = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => crossing.set(entry.target.id, entry.isIntersecting));
        update();
      },
      { rootMargin: READING_BAND },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) sections.observe(element);
    });

    const footer = document.querySelector('.site-footer');
    const bottom = new IntersectionObserver(([entry]) => {
      atBottom = entry.isIntersecting;
      update();
    });
    if (footer) bottom.observe(footer);

    return () => {
      sections.disconnect();
      bottom.disconnect();
    };
  }, [ids]);

  return active;
}
