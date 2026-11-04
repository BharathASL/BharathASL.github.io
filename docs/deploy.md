# Deploying

The site is built by Vite and published to GitHub Pages by the `Deploy` workflow (`.github/workflows/deploy.yml`).

## How it works

- **Push to `main`**: builds the site and publishes `dist/` to GitHub Pages.
- **Manual run on any other branch**: builds the site and attaches it to the run as a `site-preview` download. Nothing is published.
- **Pull requests**: the `CI` workflow runs lint, format, colour and data checks, a build, and browser smoke tests in Chromium, Firefox and WebKit. It never publishes. If the browser tests fail, the run has a `playwright-report` download showing what went wrong.

The site has three pages, all built from the Vite config:

| File                  | Address                                                     |
| --------------------- | ----------------------------------------------------------- |
| `index.html`          | `/`                                                         |
| `projects/index.html` | `/projects/` (GitHub Pages also redirects `/projects` here) |
| `404.html`            | Any address that does not exist                             |

## Preview a build

Manual runs appear under **Actions → Deploy → Run workflow** once the workflow is on `main`, which happens at launch. Before that, preview locally:

```bash
npm ci
```

```bash
npm run build
```

```bash
npm run preview
```

To check a `site-preview` download from a manual run, unzip it and serve the folder from its root, for example:

```bash
npx serve site-preview
```

## Launch day

Until launch, GitHub Pages keeps serving v1 straight from the `main` branch. To switch to v2:

1. Make sure CI is green on `redesign/v2`.
2. Right before merging, in **Settings → Pages → Build and deployment**, change **Source** from "Deploy from a branch" to **GitHub Actions**. Doing this first matters: if `main` changed while Pages still deployed from the branch, it would publish the unbuilt source files.
3. Merge the launch pull request from `redesign/v2` into `main`.
4. Watch **Actions → Deploy**. When it finishes, the run links to the live site.
5. Check the home page, `/projects/` and a made-up address such as `/nope` (should show the 404 page), in both themes and on a phone.

## Rolling back to v1

v1 is kept at the `v1` tag.

1. Create a branch from the tag:

   ```bash
   git push origin v1:refs/heads/v1-site
   ```

2. In **Settings → Pages**, set **Source** to "Deploy from a branch", branch `v1-site`, folder `/ (root)`.

To go back to v2 afterwards, set **Source** to **GitHub Actions** again and re-run the latest `Deploy` run on `main`.

## Share preview and icons

- `public/social-preview.jpg` is the 1200x630 image shown when the site is shared. It is rendered from `scripts/social-image/template.html`, which has its own copy of the name, role and tagline. After changing those, or swapping the character, update the template and run:

  ```bash
  npm install --no-save playwright
  ```

  ```bash
  npx playwright install chromium
  ```

  ```bash
  node scripts/social-image/render.mjs
  ```

- Page titles, descriptions and canonical links live in each page's HTML file (`index.html`, `projects/index.html`). The Open Graph and Twitter tags are generated from them at build time by `scripts/seo-head.js`.
- Icons (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) are in `public/`. `robots.txt` and `sitemap.xml` are there too; add new pages to the sitemap.
- To check how a shared link looks after launch, use the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
