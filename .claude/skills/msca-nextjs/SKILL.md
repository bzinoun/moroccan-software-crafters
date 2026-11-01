---
name: msca-nextjs
description: Project rules for the Next.js port of the Moroccan Software Crafters site in `web/`. Use when you scaffold, build, or change the Next.js app: routes, content loading from `content/*.json`, forms, images, static export to GitHub Pages.
---

# MSCA Next.js port

The Next.js app is a **faithful port** of the static site at the repo root. The root site (HTML, `assets/css/style.css`, `assets/js/*.js`, `content/*.json`) is the reference for behavior and copy. Load the `msca-design` skill for every visual decision; this skill covers structure, data, and build.

## Reference skills

- `msca-design`: tokens and the component inventory of the root site. Load it before any UI work.
- `vercel-react-best-practices` and `vercel-composition-patterns`: React rules. Skip their `server-*` and route handler rules: a static export has no server. Provenance in `.claude/skills/THIRD_PARTY.md`.
- Next.js API facts: read `web/node_modules/next/dist/docs/` (Next.js 16.3+ ships its docs there). `next dev` writes an `AGENTS.md` at the app root; keep it, it is generated.

## Shape

- App lives in `web/`. The root site keeps working and stays deployed until the port reaches parity.
- Next.js App Router, TypeScript `strict`, React Server Components by default. Add `"use client"` only for interaction: mobile nav, lightbox, FAQ open state when it needs JS, the 4-step funnel, forms.
- **Static export**: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`, `basePath` read from an env var (`/moroccan-software-crafters` on GitHub Pages, empty locally). Every feature must work as plain files on GitHub Pages: no route handlers, no server actions, no middleware, no ISR, no `cookies()`/`headers()`. Keep `cacheComponents` and `partialPrefetching` off: they imply PPR and `next build` refuses PPR in export mode.
- Styling: port `assets/css/style.css` as the global stylesheet first, keeping class names. Move a component's rules into a CSS Module only once that component is ported and pixel-checked. No Tailwind or UI kit unless the user decides otherwise.
- Copy stays in French, as on the root site.

## Content

- `content/*.json` at the repo root is the **single source of truth**. `web/` reads it at build time with `fs` in server code (one typed loader module, for example `web/src/content/`). The JSON is never copied into `web/` and never fetched from the browser.
- Give each file a TypeScript type, and validate at load time (zod or a hand-written guard) so a broken edit fails the build, not the page.
- Port the derived logic of `assets/js/cms.js` as pure, unit-tested functions: `stats`, `companyStats`, `roleLabel`, `monogram`, `fmtDate`, `place`, and the mini Markdown renderer `md`. Companies link to events by **exact `name`** match with `host` / `sponsors[]`; keep that rule and test it.
- Images: copy or symlink `assets/img/` into `web/public/assets/img/` at build time (one script), so paths like `assets/img/meetups/<photo>.jpg` keep working. Build every asset URL through one helper that adds `basePath`.

## Routes

| Root page | Next.js route |
|---|---|
| `index.html` (anchor `#historique`) | `/` |
| `meetup.html` | `/meetup/` |
| `socrates.html` (anchor `#sponsoring`) | `/socrates/` |
| `association.html` | `/association/` |
| `actualites.html` | `/actualites/` |
| `actualites.html?a=<slug>` | `/actualites/[slug]/` with `generateStaticParams` and `dynamicParams = false` |
| `accueillir.html` | `/accueillir/` |

`site.json` `nav`, `cta`, and `footer.links` hold `.html` hrefs. Map them to routes in one function, so the JSON stays valid for the root site during the transition. Per page metadata (`title`, `description`, `og:*`) goes through the `metadata` export, with `metadataBase` from `site.json` `baseUrl`. Generate `sitemap.xml` and `robots.txt` with the App Router metadata files.

## Forms

The hosting funnel (`accueillir`) and the SoCraTes sponsoring form post to `site.json` `form.endpoint` from the browser. Port `assets/js/funnel.js` behavior exactly: the 4 steps, the `type` field, `utm_*` and referrer capture, the hidden honeypot field, the fallback chain (endpoint, then prefilled `mailto:` to `contact.email`, then the LinkedIn page). Endpoint ids are public config in `site.json`, never secrets in code.

## Rules carried from the project

- Show a partner logo only when the company has one in `companies.json`; an empty `logo` renders the monogram.
- Never use em dashes in copy, code comments, or commit messages.
- The repo is public: no personal data, no internal notes, no secrets in commits.
- Commits and PRs go through the user's fork (`fork` remote), then a PR to `bzinoun/main`.

## Done means

A route is ported when: it renders the same content as the root page from the same JSON, it matches the root page side by side at 375 px, 768 px, and 1280 px widths, keyboard navigation and focus styles match, and `next build` exports it with no errors. Use the `run` skill and the browser to compare both versions.
