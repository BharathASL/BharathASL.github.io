import { useEffect, useState } from 'react';

function readThemeColors() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const token = (name) => styles.getPropertyValue(name).trim();
  return {
    theme: root.dataset.theme === 'light' ? 'light' : 'dark',
    bg: token('--color-bg'),
    text: token('--color-text'),
    accent: token('--color-accent'),
  };
}

export function useThemeColors() {
  const [colors, setColors] = useState(readThemeColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readThemeColors()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
