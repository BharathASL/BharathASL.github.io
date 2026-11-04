# Deploying

The site is built by Vite and published to GitHub Pages by the `Deploy` workflow (`.github/workflows/deploy.yml`).

## How it works

- **Push to `main`**: builds the site and publishes `dist/` to GitHub Pages.
- **Manual run on any other branch**: builds the site and attaches it to the run as a `site-preview` download. Nothing is published.
- **Pull requests**: the `CI` workflow runs lint, format, colour and data checks and a build. It never publishes.

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
