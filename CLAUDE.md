@AGENTS.md

# MSCA site: the Next.js app

The community site of Moroccan Software Crafters (meetups, SoCraTes Maroc, partner offers). Next.js (App Router, prerendered pages on Vercel, one route handler for the lead forms), styled with Tailwind v4. The app lives at the repo root. The former static HTML site is in git history at commit 1353207: read a file with `git show 1353207:<path>`.

Before UI work, load the `msca-design` skill (principles, `TOKENS.md`, `TAILWIND.md`, `COMPONENTS.md`). For component API design load `vercel-composition-patterns` (skip rules that need a server runtime). Read `node_modules/next/dist/docs/` before you use a Next.js API: this version (16.4) differs from training data. This file holds rules, commands, structure, decisions and gotchas. Component facts are in `COMPONENTS.md`, Tailwind facts in `TAILWIND.md`, tokens in `TOKENS.md`.

## Rules for all work in this repo

- Site copy is French, sentence case, no exclamation marks in body text, numbers with their year.
- Never use em dashes in copy, code comments, docs or commit messages.
- The repo is public: no personal data (emails, phone numbers, attendee lists), no internal notes, no secrets. Form endpoint ids go in `content/site.json`; tokens go in GitHub secrets.
- Show a partner logo or a photo only with the partner's consent.
- Credit the whole organizer team for the meetups and SoCraTes Maroc, never one person.
- Contributions go through a fork and a pull request to `bzinoun/moroccan-software-crafters`.
- Node 24 (`.nvmrc`, `engines`). CI reads the version from `.nvmrc`.

## Skills in `.claude/skills/`

- `msca-design`: the design system of the app (`SKILL.md` principles and rules, `TOKENS.md` the `@theme` table and the `js` variant, `TAILWIND.md` Tailwind rules with doc links, `COMPONENTS.md` every component and the data layer).
- `vercel-composition-patterns`: React composition rules, third party, listed in `.claude/skills/THIRD_PARTY.md`.

## Commands

Run every command from the repo root.

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (http://localhost:3000) |
| Production build | `pnpm build` |
| Serve the build | `pnpm start` (http://localhost:3000) |
| Remove build output | `pnpm clean` (`.next` and `out`) |
| Tests | `pnpm vitest run <file>`: one or a few files, only the tests the change touches. CI runs the full suite |
| Coverage | `pnpm test:coverage` (v8, `src/`) |
| Types and lint | `pnpm typecheck` (runs `next typegen && tsc --noEmit`), `pnpm lint` (`--max-warnings 0`) |
| Format | `pnpm format` writes; `pnpm format:check` checks. Prettier with `prettier-plugin-tailwindcss` sorts classes, including inside `tv()` and `cn()` (`.prettierrc.json`). `CLAUDE.md`, `AGENTS.md`, `.claude` and `docs` are not formatted |
| Whole gate | `pnpm check` runs format check, typecheck, lint, the whole test suite and the build. CI runs it; on a laptop run only the tests the change touches |
| Workflow files | `actionlint` and `yamllint --strict -c .yamllint.yml .github .yamllint.yml` |

Run `pnpm format` before each commit.

## Shape

- Next.js App Router, TypeScript `strict` (plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`), React Server Components by default. Add `"use client"` only for interaction: mobile nav, lightbox, filters, the 4-step funnel, forms.
- Hosting: Vercel, at the domain root. `images: { unoptimized: true }`, `trailingSlash: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH` (empty on Vercel; `parseBasePath` in `src/lib/base-path.ts` rejects a value without a leading slash). Every page is prerendered. The only server code is `POST /api/leads` (`src/app/api/leads/route.ts`, logic in `src/lib/leads/leads-handler.ts`): it validates a lead (`src/lib/leads/lead.ts`) and stores it through the `LeadRepository` port (Notion adapter in production, in-memory adapter in tests). It takes JSON from the forms with JavaScript and a plain form post without it (redirect to `/merci/` or `/envoi-impossible/`). A route handler, not a Server Action, on purpose: its URL survives deploys, while Server Action ids change with every build and Skew Protection is not on the Hobby plan. Its server variables are `NOTION_TOKEN` (secret) and `NOTION_LEADS_DATA_SOURCE_ID`, set in the Vercel project for production and preview, never in the repo; without them the forms show their fallback. Add no other server feature (other route handlers, middleware, `cookies()`) without a decision.
- Every page works without JavaScript: all content is in the HTML, and the `js` variant hides what needs script (`TOKENS.md`, "Progressive enhancement").
- Copy stays French.

## Where things live

- `src/app/globals.css`: the single source of tokens (`@theme`), the `js` variant, the base layer and `@utility` blocks. `src/app/fonts.ts` and `fonts-italic.ts`: `next/font/google` faces (the italic is separate, per route). `src/app/layout.tsx`: the root layout (`<html>`, `<body>`, the `js` class script in `<head>`, site metadata) and nothing else. `src/app/js-class-script.ts`: that script. `src/app/PageFrame.tsx`: the page shell, see "Layouts and the current page".
- `src/lib/cn.ts`: `cn()` and `tv()` (`clsx` + `tailwind-merge` + `tailwind-variants`) and `twMergeConfig`, hand-synced with `@theme` (`TAILWIND.md`).
- `src/components/`: one component per entry of `msca-design/COMPONENTS.md`, test next to it. Page folders: `home/`, `meetup/`, `association/`, `actualites/`, `socrates/`, `accueillir/`. Shared shell, text, layout, form and photo primitives sit at the top level (`Button`, `PageLink`, `Photo`, `Section`, `FormPanel`, `SuccessPanel`, `Lightbox`, ...). `CardsSection` is shared by the meetup, association and SoCraTes pages.
- `src/content/load.ts`: the ten loaders (`loadSite`, `loadHome`, `loadEvents`, `loadCompanies`, `loadOffers`, `loadSponsoring`, `loadMeetup`, `loadAssociation`, `loadSocrates`, `loadArticles`). They read `../content/*.json` with zod (`schemas.ts`) and start with `import "server-only"`. `src/content/types.ts`: the types, `z.infer` aliases of the schemas except `PageId` and the resolved `Socrates` type, which are written by hand.
- `src/lib/derive.ts`, `home-data.ts`, `pages-data.ts`, `socrates.ts`: pure, unit-tested derivations; pages call them and pass plain props. They import no `node:` module and no loader (`server-boundary.test.ts`). The server-only helpers are `articles-server.ts`, `images-server.ts` and `page-metadata.ts` (`pageMetadata()` builds title, canonical, Open Graph and Twitter for every page).
- `src/lib/md.tsx`: the mini Markdown renderer `md()`; plain text goes through `frenchSpacing()`, code spans and hrefs do not, so do not apply it again to the output. Links are `https` URLs or `/routes`.
- Forms: `src/lib/forms.ts` (pure submit code) and `forms-browser.ts` (the real globals), `funnel-fields.ts`, `funnel-validate.ts`, `funnel-draft.ts`, `funnel-text.ts` and `dates.ts` (the host funnel), `validation.ts` (`validateContact`, `withoutError`, e-mail and phone checks, shared by both forms), `submit-outcome.tsx` (`outcomeOf`, `useLeadSubmit`), `motion.ts`. The hooks are `useHostFunnel` and `useSponsorForm`; the package buttons reach the sponsor form through the store in `socrates/package-choice.ts`; `FormPanel` is the shared card. Details in `COMPONENTS.md`.
- `src/lib/routes.ts`: `pageRoute()`, `isExternal()`, `assetUrl()`. `src/lib/french.ts`: `frenchSpacing()`, `countLabel()`.

## Layouts and the current page

The root layout owns `<html>` and `<body>` only. Each route segment has a `layout.tsx` that renders `<PageFrame page="...">` (skip link, header, `main#main`, footer, in this order) with the `PageId` of that segment. The header marks the current nav link with `aria-current="page"` from this id, so the state is right in the static HTML, with no client code. A route without such a layout renders no header and no footer. `PageFrame` also puts `data-page={id}` on its wrapper `<div>` (for tests; no CSS depends on it).

| Route | Layout | Page id |
|---|---|---|
| `/` | `src/app/(home)/layout.tsx` (route group, so the URL is unchanged) | `home` |
| `/meetup/` | `src/app/meetup/layout.tsx` | `meetup` |
| `/actualites/` and `/actualites/[slug]/` | `src/app/actualites/layout.tsx` | `news` |
| `/association/` | `src/app/association/layout.tsx` | `association` |
| `/socrates/` | `src/app/socrates/layout.tsx` | `socrates` |
| `/accueillir/` | `src/app/accueillir/layout.tsx` (also passes `skip`) | `host` |

To add a page: pick a `PageId` (a new one goes in `PageId` of `content/types.ts` and in `PAGE_ROUTES` of `routes.ts`), create `src/app/<segment>/layout.tsx` with the same four lines as `meetup/layout.tsx`, change the page id, add the id to the table in `PageFrame.test.tsx`. `pnpm typecheck` already runs `next typegen`, and `tsc` skips the dev validator (see Gotchas). Two root layouts would force a full page load between pages, so the shell stays in the segment layouts. A layout that needs the italic font imports `fonts-italic` and passes its `.variable` as `className` (`TOKENS.md`, "Fonts").

The 404 page (`src/app/not-found.tsx`) renders `<PageFrame>` without a page id and exports its own `metadata` (own title, no canonical, no indexing). Next serves it for every unknown URL. Old `.html` links from outside (for example `meetup.html`) give the 404 page (decided, no redirect stubs).

`src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` and `robots.txt`; both export `dynamic = "force-static"` (a static export refuses them otherwise) and build absolute URLs from `baseUrl`, which already carries the base path. A dynamic route (`/actualites/[slug]/`) keeps `dynamicParams = false` and a sync `generateStaticParams()`; the params and the metadata use `articleSlugs()`. `sitemap.ts` reads `loadArticles().items` itself, so a filter added to `articleSlugs()` goes into the sitemap too.

## Content

- `content/*.json` at the repo root is the single source of truth. The app reads it at build time with `fs` in server code, through the loaders only. The JSON is never copied into `src/` or `public/` and never fetched from the browser.
- One zod schema and one loader per JSON file, so a broken edit fails the build, not the page.
- Every `href` in the content is a route (`/meetup/#proposer`), a hash on the same page or an `https` URL. No `.html` href exists; a test fails on one.
- Fields that no page reads do not exist: an unknown key is silently stripped by zod, so delete a field from the schema and the JSON together.
- The SoCraTes sponsors wall labels a company with the years it sponsored (`sponsoredYears` of `companyStats()`), not the years it hosted a meetup. `events.json` is the source of the SoCraTes numbers: the edition cards and the hero counters of the SoCraTes page (editions, partners) come from the events of type `socrates` (`sponsors[]`, `participants`, `date` and the optional `endDate`). An item of `socrates.json` points to its event by id. A link to a missing or non-SoCraTes event fails the build. When `events.json` and `socrates.json` disagree, `events.json` wins.
- `Event.type` is a closed enum: a new type in `events.json` fails the build until `EVENT_TYPES` (`schemas.ts`) and `TYPE_LABEL` (`derive.ts`) get an entry.
- Companies link to events by exact `name` match with `host` and `sponsors[]`; keep and test that rule.
- Images: `public/assets/img/` holds the photos and logos, edited in place (no copy script). Content stores a meetup photo as a file name without extension (`2026-10-sg-gscm-5`; `meetupPhotoUrl()` builds the URL) and a logo as a file name with extension (`axa.png`, under `public/assets/img/logos/`). An `<img>` goes through `Photo`, and its URL through `assetUrl()` or a helper that calls it. Meetup photos are at most 1600 px wide (the two 2022 SoCraTes group photos are 1200 px), logos 240 by 240 px (`logo.png` of the brand is 104 px).
- Show a partner logo only when the company has one in `companies.json`; an empty `logo` renders the monogram.
- Text with a number that goes stale (`linkedinFollowers`, some prose counts) is written by hand: check it at each event.

## Tests use ports, not mocks

A test never uses `vi.mock`, `vi.doMock`, `vi.fn`, `vi.spyOn`, `vi.stubGlobal` or `vi.stubEnv` (nor `vi.hoisted`, `vi.mocked`, `vi.importActual`, an alias or a destructure of `vi`), and never assigns a global by hand. A side effect (clock, storage, error report, motion, scroll, viewport, image probe, modal dialog) sits behind a port in `src/lib/ports/`; a config value is a plain parameter. A client component reads its ports with `usePorts()`; with no provider the real browser adapters answer. A test wraps the tree in `renderWithPorts(ui, ports)` (`src/test/ports.tsx`, over `PortsProvider`) and passes the in-memory adapters of `src/test/` (`inMemoryClock`, `inMemoryStorage`, `inMemoryLeadSubmit`, `recorder`, and so on). ESLint enforces it: `no-restricted-properties` in `eslint.config.mjs` fails on those `vi.*` calls, on `vi` aliases and on `window.x = ...` style assignments in `*.test.ts(x)` and `src/test/**`.

## Forms

The host funnel (`/accueillir/`) and the SoCraTes sponsor form post to `site.json` `form.endpoint` from the browser: the 4 steps of the funnel, the `type` field, `utm_*` and referrer capture, the hidden honeypot, and the fallback chain (endpoint, then prefilled `mailto:` to `contact.email`, then the LinkedIn page). The mailto body has no length cap. `form.endpoint` is `/api/leads`. Both form tags have `action="/api/leads" method="post"` and hidden `_type` and `_source` fields, so without JavaScript the browser posts the whole form once and the handler redirects to `/merci/` or `/envoi-impossible/`; with JavaScript the submit handlers prevent that post and send JSON. Never a GET: the answers never go into a URL.

`src/lib/forms.ts` is pure and takes its browser dependencies as arguments (`submitForm(input, deps)`). `submitFormInBrowser` in `forms-browser.ts` wires the real globals, never throws, and returns a `result.mode` (`endpoint`, `mailto`, `linkedin`, `none`, `honeypot`, `error`). Both forms take an injected `submit`, so a test never posts to the real endpoint. The funnel option lists live in code (`funnel-fields.ts`). A saved draft expires after 30 days.

## Status and decisions

All pages are built: home `/`, `/meetup/`, `/association/`, `/actualites/` with its articles, `/socrates/` (sponsor form with level preselect) and `/accueillir/` (host funnel), plus `sitemap.xml`, `robots.txt` and the 404 page.

Decided:

- Breakpoints follow the Tailwind defaults (`TOKENS.md` holds the mapping).
- No-JavaScript behavior is progressive enhancement through the `js` variant: all content in the HTML, controls that need JavaScript hide without it, and both forms show their fields with a note that points to LinkedIn.
- The funnel option lists live in code; drafts expire after 30 days; the mailto fallback has no length cap.
- `events.json` wins over `socrates.json`. Old `.html` links give the 404 page.

Remaining owner decisions:

- The form endpoint (`form.endpoint`) and the contact e-mail (`contact.email`) in `content/site.json`, empty on purpose until the owner gives the values: the forms fall back to LinkedIn until they are filled.
- Logo and photo consent: the consent fields live in Notion (values), the repo has none.
- Hosting: the site runs on Vercel (project `moroccan-software-crafters`, today on a maintainer's account). The repo owner decides where production lives; a new Vercel project needs `NOTION_TOKEN` and `NOTION_LEADS_DATA_SOURCE_ID` (README, "Set or rotate the Notion token") and `baseUrl` in `content/site.json` to match its domain.
- Prices: the site prints none, by the owner's decision (offers, sponsor packages, funnel and mail text). `src/content/copy-agreement.test.ts` fails if an amount or a price note comes back. Attendance stays free for crafters and the copy says so.
- The SoCraTes partner counts after the move to `events.json`: 2022 went from 8 to 7 and 2023 from 10 to 8. If the real counts are 8 and 10, add the missing names to `sponsors[]` of those two events (each name must exist in `companies.json`).

## CI and deploy

- `.github/workflows/ci.yml` (pull requests, merge queue, by hand): job `check` runs format check, typecheck, lint, the test suite, `pnpm audit --prod --audit-level=high` and the build; job `workflows` runs `actionlint` and `yamllint` (config in `.yamllint.yml`). A new advisory can fail the audit step with no code change.
- Deploy: Vercel (project `moroccan-software-crafters`, Git-connected). Each push to `main` deploys production at https://moroccan-software-crafters.vercel.app; other branches get preview URLs.
- `.github/actions/setup` is the shared setup: pnpm from `packageManager`, Node from `.nvmrc`, the Next.js build cache, `pnpm install --frozen-lockfile`.
- `.github/dependabot.yml`: weekly updates for npm (minor and patch in one group) and for the GitHub Actions. Actions are pinned by commit SHA.
- `pnpm-workspace.yaml` holds the pnpm build settings and an override that lifts `minimatch` (a dev dependency advisory).

## Gotchas

- `cacheComponents` and `partialPrefetching` stay off: they imply PPR, which `output: "export"` refuses.
- `next/link` adds the base path; plain `<img src>` and metadata icons do not, so use `assetUrl()`. `PageLink` renders a plain anchor with `assetUrl()` for a route that carries a hash (`/#historique`), because `next/link` does not scroll again on a second click.
- `vitest.setup.ts` sets `__NEXT_TRAILING_SLASH` so `next/link` hrefs in tests match the build, and nothing else. `vitest.config.mts` aliases `server-only` and `next/font/google` to plain modules (`src/test/next-font-google.ts`).
- Interactive parts are small client components; everything else stays a server component that reads JSON at build time.
- `stats().followers` uses `toLocaleString("fr-FR")` (U+202F separator): the output depends on the ICU data of the Node that runs the build.
- Testing Library folds U+202F into a plain space in node text, but not in the expected string. A `getByText("... ?")` with a U+202F never matches: read `textContent` and compare it exactly, and write U+202F in test literals as `\u202f`, never as a plain space or a raw character.
- A test does not read live content for counts or copy: it uses a fixture written in the test, with values worked out by hand. The content test (`load.test.ts`) checks the shape and the cross-file links of the real files.
- `next build` adds `allowJs: true` to `tsconfig.json` on every run: leave it.
- The dev server file `.next/dev/types/validator.ts` is excluded from `tsc`; `.next/types/validator.ts` from `next typegen` is checked.

## Done means

A change is done when it keeps the site working, not when it matches an older version. Run, from the repo root:

- `pnpm format:check`, `pnpm typecheck` and `pnpm lint`.
- The tests the change touches (`pnpm vitest run <files>`), and a new test first for a changed behavior.
- `pnpm build` with no warning, served with `pnpm start`.
- A crawl of the served pages for broken links.
- A browser check of each changed page at 375, 768 and 1280 px (use the `run` skill and the browser tools): keyboard order and focus rings, hover and open states with real mouse and keyboard events, the console for errors, and the page with JavaScript off. If the window cannot be resized, use same-origin iframes at each width.
