# Portfolio v2 Plan

A full rebuild of [bharathasl.github.io](https://bharathasl.github.io). v1 is kept under the `v1` tag.

## Goals

- Present 8+ years of full-stack work across backend, cloud, data and Android in a way that is easy for recruiters to scan.
- A memorable hero with an interactive 3D character and smooth scroll-driven motion.
- Accessible (WCAG AA contrast, keyboard friendly, respects reduced motion) and fast on mobile.
- Content kept in data files so updating experience or projects never means touching layout code.

## Non-goals (v2)

- Blog or CMS.
- Mini-game / "Play" page. Revisit after launch.
- Client names. All client work is described without naming the client.

## Decisions

| Area | Decision | Status |
|------|----------|--------|
| Stack | Vite + React, React Three Fiber (Three.js), GSAP + ScrollTrigger, Lenis | Agreed |
| Hosting | GitHub Pages, deployed by a GitHub Actions workflow | Agreed |
| Accent colour | Electric blue: `#60a5fa` (dark theme), `#1d4ed8` (light theme) | Agreed |
| Themes | Dark default, light mode with saved preference | Agreed |
| Fonts | Space Grotesk (headings), Inter (body), self-hosted | Agreed |
| 3D character | Placeholder model first, later a stylised model of me built in Blender | Agreed |
| Client names | Not shown anywhere on the site | Agreed |

## Page structure

1. **Loader**: progress counter while the 3D scene loads, then an intro reveal.
2. **Navbar**: monogram, section links with active state, theme toggle, mobile menu.
3. **Hero**: name, rotating role titles, 3D character reacting to the mouse.
4. **About**: short story, camera and character move as the section scrolls in.
5. **What I Do**: three cards: Backend & Cloud, Mobile & Frontend, Data & Automation.
6. **Career**: timeline that draws itself on scroll, projects grouped under each company.
7. **Work**: pinned horizontal strip of project cards (work projects and Ninja6-MC).
8. **Tech Stack**: grouped skills.
9. **Contact + Footer**: email, LinkedIn, GitHub, CV download, credits.
10. **/projects**: grid of all projects.

## Content

### Experience

**VueData Technologies** (Oct 2021 - Present)

| Period | Project | Role |
|--------|---------|------|
| Dec 2025 - Present | Android keyboard app: Unified Search, a bottom sheet with an "All" tab for recent emojis, GIFs and media, plus keyword search grouped by type | Android Developer |
| May 2025 - Dec 2025 | Sports lesson tutorial platform | Full-Stack Developer |
| Mar 2025 - May 2025 | Real-time customer support POC (LiveKit, Twilio) | Developer (POC) |
| May 2024 - Mar 2025 | Shopping analytics for a major web browser: petabyte-scale pipelines, Scope, ADF, Power BI | Data Analytics |
| Feb 2024 - May 2024 | Coupon auto-apply automation: Azure Functions, Docker, Selenium, AI-based selector extraction | Team Lead |
| Dec 2023 - Feb 2024 | Skilled-professionals marketplace app: system design and backend (Node.js, Azure, CosmosDB) | Team Lead |
| Sep 2022 - Nov 2023 | Deposit insurance enterprise system for a national financial body (Kotlin, Java, MariaDB, React) | Software Developer |
| Oct 2021 - Sep 2022 | Server sustainability platform: carbon footprint, energy and CPU/GPU metrics, hub-and-spoke data model | Software Developer |

**GoDB Tech** (Jun 2018 - Oct 2021)

Insurance platforms across life, motor, medical and home lines: REST and SOAP APIs, claims automation, payment gateway integration and payroll processing.

### Personal projects (Ninja6-MC)

- 2 Minecraft plugins (completed), 2 in progress
- Texture pack web tool (completed)
- Texture pack (in progress)

Names, descriptions, links and media to be filled in.

## 3D character

- **Placeholder**: "Alex (Minecraft) T-Pose" by Bo Nakamura, CC BY 4.0. Credit shown in the footer while it is in use. Simplified to a web budget and renamed before committing.
- **Final**: stylised model of me (Blender), rigged with Mixamo. Expected names used by the code:
  - Bones: `Hips`, `Spine`, `Spine1`, `Spine2`, `Neck`, `Head`, `LeftArm`, `LeftForeArm`, `LeftHand`, `RightArm`, `RightForeArm`, `RightHand`
  - Actions: `Idle`, `Typing`
  - Shape key: `Blink`
  - Screen material: `ScreenGlow`
- **Budgets**: under 40k triangles for the whole scene, textures 1024px or smaller, final `.glb` under 2 MB after compression.

## Motion

- Lenis smooth scrolling driving GSAP ScrollTrigger.
- Intro: split-text reveal (rise, fade and un-blur, staggered).
- Hero to About: character rotates and slides aside while the camera moves, scrubbed to scroll.
- Career line grows with scroll; Work section pins and scrolls horizontally.
- Custom cursor and hover effects on desktop only.
- `prefers-reduced-motion`: animations replaced by simple fades, no smooth scrolling.
- 3D on mobile uses a lighter scene instead of being removed.

## Quality targets

- Lighthouse (mobile): Performance 90+, Accessibility 100, Best Practices 100, SEO 100.
- First load under 3 seconds on a mid-range phone on 4G.
- All text meets WCAG AA contrast in both themes.
- Fully usable with keyboard only.

## Workflow

- `redesign/v2` is the integration branch for the whole rebuild. `main` keeps serving v1 until launch.
- Each task gets its own branch from `redesign/v2`, named `v2/<issue-number>-<short-name>` (for example `v2/21-vite-setup`), and is merged back through a pull request.
- Launch is a single pull request from `redesign/v2` into `main`.
- Work is tracked in the private "Portfolio v2" GitHub project: one epic per area below, tasks as sub-issues, with blocked-by links between tasks.

## Epics

1. Foundation & tooling
2. Design system
3. Content & assets
4. 3D character
5. Sections
6. Motion
7. Quality & launch

## Credits

- Placeholder 3D model: "Alex (Minecraft) T-Pose 3D Model" by Bo Nakamura, licensed under CC BY 4.0.
