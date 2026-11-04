// Renders template.html to public/social-preview.jpg (1200x630), the image shown when the site is shared.
// Needs Playwright, which is not a project dependency:
//   npm install --no-save playwright && npx playwright install chromium
//   node scripts/social-image/render.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// require() so a globally installed Playwright is found too.
const { chromium } = createRequire(import.meta.url)('playwright');
const template = new URL('./template.html', import.meta.url).href;
const output = fileURLToPath(new URL('../../public/social-preview.jpg', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(template);
await page.evaluate('document.fonts.ready');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: output, type: 'jpeg', quality: 88 });
await browser.close();
console.log(`Saved ${output}`);
