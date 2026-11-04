import { useEffect, useState } from 'react';
import { subscribe } from '../theme/theme.js';

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
  useEffect(() => subscribe(() => setColors(readThemeColors())), []);
  return colors;
}
