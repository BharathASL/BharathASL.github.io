import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const tokensFile = join(root, 'src/styles/tokens.css');

const pairs = [
  ['text', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['text', 'surface-raised', 4.5],
  ['text-muted', 'bg', 4.5],
  ['text-muted', 'surface', 4.5],
  ['text-muted', 'surface-raised', 4.5],
  ['accent', 'bg', 4.5],
  ['accent', 'surface', 4.5],
  ['accent', 'surface-raised', 4.5],
  ['accent-hover', 'bg', 4.5],
  ['accent-hover', 'surface', 4.5],
  ['on-accent', 'accent', 4.5],
  ['on-accent', 'accent-hover', 4.5],
  ['focus', 'bg', 3],
  ['focus', 'surface', 3],
];

function parseThemes(css) {
  const themes = {};
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const name = selector.includes("'light'") ? 'light' : 'dark';
    themes[name] = Object.fromEntries(
      [...body.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, k, v]) => [k, v]),
    );
  }
  return themes;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(css|jsx?|tsx?)$/.test(name)) yield path;
  }
}

let failed = false;
const themes = parseThemes(readFileSync(tokensFile, 'utf8'));

for (const [theme, colors] of Object.entries(themes)) {
  console.log(`\n${theme} theme`);
  for (const [fg, bg, min] of pairs) {
    if (!colors[fg] || !colors[bg]) {
      console.log(`  MISSING  ${fg} on ${bg}`);
      failed = true;
      continue;
    }
    const ratio = contrast(colors[fg], colors[bg]);
    const ok = ratio >= min;
    failed ||= !ok;
    console.log(`  ${ok ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1 (min ${min})  ${fg} on ${bg}`);
  }
}

const hardcoded = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i;
for (const file of walk(join(root, 'src'))) {
  if (file === tokensFile) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (hardcoded.test(line)) {
        console.log(`\nHard-coded colour in ${relative(root, file)}:${i + 1}: ${line.trim()}`);
        failed = true;
      }
    });
}

const pageBackgrounds = new Set(Object.values(themes).map((colors) => colors.bg));
for (const page of ['index.html', 'projects/index.html', '404.html']) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const hex of html.match(/#[0-9a-f]{3,8}\b/gi) ?? []) {
    if (!pageBackgrounds.has(hex.toLowerCase())) {
      console.log(`\n${page} uses ${hex}, which is not a --color-bg token`);
      failed = true;
    }
  }
}

console.log(failed ? '\nColour check failed.' : '\nAll colour checks passed.');
process.exit(failed ? 1 : 0);
