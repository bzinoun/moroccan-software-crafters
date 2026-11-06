@AGENTS.md

# web/: the Next.js port of the site

A faithful port of the static site at the repo root to Next.js (App Router, static export to GitHub Pages), styled with Tailwind v4. Same look, same copy, same content files. The root site stays live until this port reaches parity on every page. The root `assets/css/style.css`, the root HTML pages and `assets/js/*.js` are the visual and behavioral reference only; nothing in `web/` imports them.

Before UI work, load the `msca-design` skill (principles, `TOKENS.md`, `TAILWIND.md`, `COMPONENTS.md`). For component API design load `vercel-composition-patterns` (skip rules that need a server runtime). Read `node_modules/next/dist/docs/` before you use a Next.js API: this version (16.4) differs from training data. This file holds structure, data, status, commands and gotchas.

## Commands

Run every command from `web/`. The repo root has no `package.json`.

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (http://localhost:3000) |
| Static export | `pnpm build` (writes `out/`; `prebuild` syncs images first) |
| Serve the export | `cd out && python3 -m http.server 8001` |
| Root site for comparison | `python3 -m http.server 8000` from the repo root |
| Tests | `pnpm vitest run <file>`: one or a few files, only the tests the change touches |
| Types and lint | `pnpm typecheck`, `pnpm lint` |
| Format | `pnpm format` writes; `pnpm format:check` checks. Prettier with `prettier-plugin-tailwindcss` sorts classes, including inside `tv()` and `cn()` (`.prettierrc.json`) |
| Images | `pnpm sync:assets` copies `../assets/img` into `public/assets/img` (git-ignored) |

Run `pnpm format` before each commit.

## Shape

- Next.js App Router, TypeScript `strict`, React Server Components by default. Add `"use client"` only for interaction: mobile nav, lightbox, filters, the 4-step funnel, forms.
- Static export: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH` (`/moroccan-software-crafters` on GitHub Pages, empty locally). Every feature must work as plain files: no route handlers, server actions, middleware, ISR, `cookies()` or `headers()`.
- Copy stays French, as on the root site.

## Where things live

- `src/app/globals.css`: the single source of tokens (`@theme`), the base layer and `@utility` blocks. `src/app/fonts.ts`: `next/font/google` faces. `src/app/layout.tsx`: shell, metadata, `data-page`.
- `src/lib/cn.ts`: `cn()` and `tv()` (`clsx` + `tailwind-merge` + `tailwind-variants`). Its merge config lists the custom `shadow`, `radius` and `container` token names and is hand-synced with `@theme`: add a token there when you add one to `@theme`.
- `src/components/`: one component per entry of `msca-design/COMPONENTS.md`, test next to it. Built: `Button`, `Container`, `Brand`, `SkipLink`, `SiteHeader`, `NavToggle`, `SiteFooter`, `HeroEm`.
- `src/content/load.ts`: loaders (`loadSite()`, `loadHome()`) read `../content/*.json` with zod. `src/content/types.ts`: types; a compile-time check keeps the schema output equal to them.
- `src/lib/routes.ts`: `toRoute()`, `pageRoute()`, `isExternal()`, `assetUrl()`. `src/lib/french.ts`: `frenchSpacing()`.

## Content

- `content/*.json` at the repo root is the single source of truth. `web/` reads it at build time with `fs` in server code, through the loaders only. The JSON is never copied into `web/` and never fetched from the browser.
- Add one zod schema and one loader per JSON file as a page needs it, so a broken edit fails the build, not the page.
- Port the derived logic of `assets/js/cms.js` as pure, unit-tested functions: `stats`, `companyStats`, `roleLabel`, `monogram`, `fmtDate`, `place`, and the mini Markdown renderer `md` (render to React elements). Companies link to events by exact `name` match with `host` and `sponsors[]`; keep and test that rule.
- Images: `public/assets/img/` is a build-time copy of `assets/img/`, so paths like `assets/img/meetups/<photo>.jpg` keep working. Build every plain `<img>` URL through `assetUrl()`.
- Show a partner logo only when the company has one in `companies.json`; an empty `logo` renders the monogram.

## Routes

| Root page | Route |
|---|---|
| `index.html` (anchor `#historique`) | `/` |
| `meetup.html` | `/meetup/` |
| `socrates.html` (anchor `#sponsoring`) | `/socrates/` |
| `association.html` | `/association/` |
| `actualites.html` | `/actualites/` |
| `actualites.html?a=<slug>` | `/actualites/[slug]/` with `generateStaticParams` and `dynamicParams = false` |
| `accueillir.html` | `/accueillir/` |

`site.json` `nav`, `cta` and `footer.links` hold `.html` hrefs; `toRoute()` maps them, so the JSON stays valid for the root site. Page metadata goes through the `metadata` export, with `metadataBase` from `site.json` `baseUrl`. Generate `sitemap.xml` and `robots.txt` with the App Router metadata files.

## Forms

The host funnel (`/accueillir/`) and the SoCraTes sponsor form post to `site.json` `form.endpoint` from the browser. Port `assets/js/funnel.js` behavior exactly: the 4 steps, the `type` field, `utm_*` and referrer capture, the hidden honeypot, and the fallback chain (endpoint, then prefilled `mailto:` to `contact.email`, then the LinkedIn page). Endpoint ids are public config in `site.json`, never secrets in code. Details of each form are in `COMPONENTS.md`.

## Port status

Done: page shell (`Button`, `Container`, `Brand`, `SkipLink`, `SiteHeader`, `NavToggle`, `SiteFooter`, `HeroEm`) in Tailwind, checked against the root site at 375, 768 and 1280 px; placeholder home hero (text and buttons only).

To do, in this order (section ids from the root HTML). Build each page from the components in `COMPONENTS.md` with token utilities, and update that file when a component is added.

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

- `cacheComponents` and `partialPrefetching` stay off: they imply PPR, which `output: "export"` refuses.
- `next/link` adds the base path; plain `<img src>` and metadata icons do not, so use `assetUrl()`.
- `vitest.setup.ts` sets `__NEXT_TRAILING_SLASH` so `next/link` hrefs in tests match the build.
- Interactive parts are small client components; everything else stays a server component that reads JSON at build time.
- `--color-*: initial` in `@theme` removed the stock palette: every color is a token, and white is `--color-white`. A missing color utility means a missing token.
- `@import "tailwindcss" source(none)` plus explicit `@source` paths (and `@source not` for test files) avoid a Turbopack crash on automatic scanning. Add a `@source` line when you create a folder with class names outside `src/`.
- The scanner reads comments: the word `container` in a comment generates a `.container` rule. Keep class-like words out of comments.
- Tailwind's reset removes the link underline; the base layer in `globals.css` restores it (green, underlined, `green-dark` on hover). Links that must not be underlined carry `no-underline`.
- `tailwind-merge` drops an earlier `leading-*` when a later `text-*` size follows. Repeat `leading-*` after the size in a `tv` variant (the `Button` `sm` size does).
- The three fonts are variable fonts loaded without a `weight` option, so any weight renders. The old site loaded only Fraunces 500 and 600 and the browser faked bold on the italic: the hero emphasis is weight 590 (measured: 97 percent of the old ink, +2.7 percent width) and the brand name is 600 (the old `<strong>` asked for 700 but rendered 600). Measure before you change either.
- Tailwind transforms are separate properties: transition `translate`, `rotate`, `scale`, not `transform`.
- Old breakpoints that are not Tailwind defaults map to the true nearest default (table in `TOKENS.md`, a proposal the owner confirms): nav at `lg`, hero grid at `lg`, tagline `max-sm`. A layout may switch up to about 160 px away from the old query width, one-pixel edge differences at exactly 640 and 1024 px included, and the owner confirms the proposal.

## Done means

A page is done when it renders the same content as the root page from the same JSON, keyboard order and focus styles match, `pnpm typecheck`, `pnpm lint` and `pnpm format:check` pass, `pnpm build` exports it with no error, and a browser comparison at 375, 768 and 1280 px shows no unexplained difference. For the comparison:
- Serve the export (`out/`) and the root site, open both at each width, and read computed styles (about 40 properties: color, font, spacing, border, shadow, display) plus the bounding boxes of the key elements in both pages. Fix each difference or record it as accepted with its reason in the commit message.
- If the browser window cannot be resized, use same-origin iframes at each width.
- Check hover, focus ring and open states with real mouse and keyboard events, and the console for errors.
- Use the `run` skill and the browser tools to drive this.
