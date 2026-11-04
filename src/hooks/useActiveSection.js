import { useEffect, useState } from 'react';

const READING_BAND = '-40% 0px -55% 0px';

export function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const crossing = new Map();
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const update = () => setActive(atBottom() ? ids.at(-1) : (ids.find((id) => crossing.get(id)) ?? null));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => crossing.set(entry.target.id, entry.isIntersecting));
        update();
      },
      { rootMargin: READING_BAND },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [ids]);

  return active;
}
