@AGENTS.md

# web/: the Next.js port of the site

A faithful port of the static site at the repo root to Next.js (App Router, static export to GitHub Pages). Same look, same copy, same content files. The root site stays live until this port reaches parity on every page.

Before any work here, load the `msca-nextjs` skill (structure, data, routes, forms, done criteria) and the `msca-design` skill (tokens and the component inventory). They are the spec; this file holds status, commands and gotchas.

## Commands

Run every command from `web/`. The repo root has no `package.json`.

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (http://localhost:3000) |
| Static export | `pnpm build` (writes `out/`; `prebuild` syncs images first) |
| Serve the export | `cd out && python3 -m http.server 8001` |
| Root site for comparison | `python3 -m http.server 8000` from the repo root |
| Tests | `pnpm vitest run <file>`, one or a few files: only the tests the change touches |
| Types and lint | `pnpm typecheck`, `pnpm lint` |
| Images | `pnpm sync:assets` copies `../assets/img` into `public/assets/img` (git-ignored) |

## Where things live

- `src/content/load.ts`: `loadSite()`, `loadHome()` read `../content/*.json` with zod. Add one schema and one loader per JSON file as pages need them. The schema output must stay equal to the type in `src/content/types.ts` (a compile-time check enforces it).
- `src/lib/routes.ts`: `toRoute()` maps root hrefs (`meetup.html`) to routes (`/meetup/`), `assetUrl()` adds the base path to plain `<img>` paths. `src/lib/french.ts`: `frenchSpacing()` for every rendered string.
- `src/components/`: one component per entry of `msca-design/COMPONENTS.md`, named as that file suggests, test next to it.
- `src/app/globals.css`: an unchanged copy of `../assets/css/style.css`. When the root stylesheet changes, copy it again.

## Port status

Done: page shell (`SkipLink`, `SiteHeader`, `NavToggle`, `SiteFooter`), placeholder home hero (text and buttons only).

To do, in this order (section ids from the root HTML):

1. Home `/` (`index.html`): hero collage and post-it, `stats`, `#format` topic wall, `#historique` featured event, filters and timeline, `#galerie` gallery and lightbox, `#partenaires` logo wall, `#socrates` teaser, `#offres` offer cards, `#faq`, CTA band. Needs loaders for `events.json`, `companies.json`, `offers.json`.
2. `/meetup/` (`meetup.html`, `meetup.json`).
3. `/association/` (`association.html`, `association.json`).
4. `/actualites/` and `/actualites/[slug]/` (`actualites.html`, `articles.json`, the `md` renderer from `assets/js/cms.js`).
5. `/socrates/` (`socrates.html`, `socrates.json`, `sponsoring.json`): dark hero, editions, sponsor form.
6. `/accueillir/` (`accueillir.html`): the 4-step host funnel from `assets/js/funnel.js`.
7. Per-page `<body data-page>` (TODO in `src/app/layout.tsx`), per-page metadata, `sitemap.xml`, `robots.txt`.
8. GitHub Actions deploy of `out/` with `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters`. Cutover from the root site is the organizers' decision.

Update this list in the same commit as each finished page.

## Gotchas

- Read the Next.js docs in `node_modules/next/dist/docs/` before you use an API: this version (16.4) differs from training data.
- `cacheComponents` and `partialPrefetching` stay off: they imply PPR, which `output: "export"` refuses.
- `next/link` adds the base path; plain `<img src>` does not, so use `assetUrl()`.
- `vitest.setup.ts` sets `__NEXT_TRAILING_SLASH` so `next/link` hrefs in tests match the build.
- Interactive parts are small client components (`"use client"`); everything else stays a server component that reads JSON at build time.
- Compare every finished page with the root site side by side at 375, 768 and 1280 px in a browser before you call it done.
