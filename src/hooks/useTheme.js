import { useSyncExternalStore } from 'react';
import { getTheme, subscribe, toggleTheme } from '../theme/theme.js';

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme);
  return { theme, toggleTheme };
}
