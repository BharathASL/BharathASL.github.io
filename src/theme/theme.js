const STORAGE_KEY = 'theme';
const THEMES = ['dark', 'light'];
const root = document.documentElement;
const systemLight = window.matchMedia('(prefers-color-scheme: light)');

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  root.dataset.theme = theme;
  const background = getComputedStyle(root).getPropertyValue('--color-bg').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && background) meta.content = background;
}

export function getTheme() {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme) {
  apply(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this visit.
  }
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function followSystemTheme() {
  const onChange = () => {
    if (!readStored()) apply(systemLight.matches ? 'light' : 'dark');
  };
  systemLight.addEventListener('change', onChange);
  return () => systemLight.removeEventListener('change', onChange);
}
