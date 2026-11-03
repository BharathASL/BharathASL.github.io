# Site content

All text on the site comes from these files. Edit them instead of the components, then run `npm run check:data`.

Dates are `YYYY-MM` strings. `end: null` means "Present". Lists are ordered newest first.

## `profile.js`

`profile`

| Field | Type | Notes |
|-------|------|-------|
| `name`, `role`, `tagline`, `location` | string | |
| `careerStart` | `YYYY-MM` | Used to calculate `yearsOfExperience` |
| `roles` | string[] | Rotating titles in the hero |
| `about` | string[] | One string per paragraph |

`services`: the "What I Do" cards.

| Field | Type |
|-------|------|
| `id`, `title`, `description`, `details` | string |
| `tags` | string[] |

## `experience.js`

`experience`: one entry per company, each with its projects.

| Field | Type | Notes |
|-------|------|-------|
| `id`, `company`, `location` | string | |
| `start`, `end` | `YYYY-MM`, `YYYY-MM \| null` | |
| `projects` | Project[] | Newest first, dates inside the company dates |

Project:

| Field | Type | Notes |
|-------|------|-------|
| `id`, `title`, `role`, `summary` | string | No client names |
| `start`, `end` | `YYYY-MM`, `YYYY-MM \| null` | |
| `highlights` | string[] | One to three bullets |
| `tech` | string[] | |

## `projects.js`

`projects`: cards for the Work section and the projects page.

| Field | Type | Notes |
|-------|------|-------|
| `id`, `title`, `summary` | string | |
| `category` | `'work' \| 'personal'` | Labels in `PROJECT_CATEGORIES` |
| `status` | `'completed' \| 'in-progress'` | |
| `featured` | boolean | Shown in the Work section on the home page |
| `tech` | string[] | |
| `experienceId` | string, optional | Links a work project to its experience entry |
| `links` | `{ github?, live?, … }` | https URLs |
| `cover` | image or `null` | |
| `todo` | boolean, optional | Placeholder still waiting for details |

## `skills.js`

`skillGroups`: `{ id, title, skills: string[] }`.

## `links.js`

- `contact`: `{ email, cv }` (`cv` is `null` until the PDF is added)
- `socialLinks`: `{ id, label, url }[]`

## `credits.js`

`credits`: `{ work, author, license, licenseUrl, note }[]`, shown in the footer.
