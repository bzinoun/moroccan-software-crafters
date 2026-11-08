@AGENTS.md

# MSCA site: the Next.js app

The community site of Moroccan Software Crafters (meetups, SoCraTes Maroc, partner offers). Next.js (App Router, static export to GitHub Pages), styled with Tailwind v4. The app lives at the repo root. The former static HTML site was removed; it stays in git history at commit 1353207 (for example `git show 1353207:assets/css/style.css`, `git show 1353207:assets/js/cms.js`, `git show 1353207:index.html`). Use it as a visual and behavioral reference only; nothing in the app imports it.

Before UI work, load the `msca-design` skill (principles, `TOKENS.md`, `TAILWIND.md`, `COMPONENTS.md`). For component API design load `vercel-composition-patterns` (skip rules that need a server runtime). Read `node_modules/next/dist/docs/` before you use a Next.js API: this version (16.4) differs from training data. This file holds rules, structure, data, status, commands and gotchas.

## Rules for all work in this repo

- Site copy is French, sentence case, no exclamation marks in body text, numbers with their year.
- Never use em dashes in copy, code comments, docs or commit messages.
- The repo is public: no personal data (emails, phone numbers, attendee lists), no internal notes, no secrets. Form endpoint ids go in `content/site.json`; tokens go in GitHub secrets.
- Show a partner logo or a photo only with the partner's consent.
- Credit the whole organizer team for the meetups and SoCraTes Maroc, never one person.
- Contributions go through a fork and a pull request to `bzinoun/moroccan-software-crafters`.

## Skills in `.claude/skills/`

- `msca-design`: the design system of the app (`SKILL.md` principles and rules, `TOKENS.md` the `@theme` table, `TAILWIND.md` Tailwind rules with doc links, `COMPONENTS.md` built and planned components).
- `vercel-composition-patterns`: React composition rules, third party, listed in `.claude/skills/THIRD_PARTY.md`.

## Commands

Run every command from the repo root.

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (http://localhost:3000) |
| Static export | `pnpm build` (writes `out/`) |
| Serve the export | `cd out && python3 -m http.server 8001` |
| Tests | `pnpm vitest run <file>`: one or a few files, only the tests the change touches. CI runs the full suite |
| Types and lint | `pnpm typecheck` (runs `next typegen && tsc --noEmit`), `pnpm lint` |
| Format | `pnpm format` writes; `pnpm format:check` checks. Prettier with `prettier-plugin-tailwindcss` sorts classes, including inside `tv()` and `cn()` (`.prettierrc.json`) |
| Workflow files | `actionlint .github/workflows/*.yml` and `yamllint -d relaxed .github/workflows/` |

Run `pnpm format` before each commit.

## Shape

- Next.js App Router, TypeScript `strict`, React Server Components by default. Add `"use client"` only for interaction: mobile nav, lightbox, filters, the 4-step funnel, forms.
- Static export: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH` (`/moroccan-software-crafters` on GitHub Pages, empty locally). Every feature must work as plain files: no route handlers, server actions, middleware, ISR, `cookies()` or `headers()`.
- Copy stays French, as on the former site.

## Where things live

- `src/app/globals.css`: the single source of tokens (`@theme`), the base layer and `@utility` blocks. `src/app/fonts.ts`: `next/font/google` faces. `src/app/layout.tsx`: the root layout (`<html>`, `<body>`, fonts, site metadata) and nothing else. `src/app/PageFrame.tsx`: the page shell, see "Layouts and the current page" below.
- `src/lib/cn.ts`: `cn()` and `tv()` (`clsx` + `tailwind-merge` + `tailwind-variants`). Its merge config lists the custom `shadow`, `radius` and `container` token names and is hand-synced with `@theme`: add a token there when you add one to `@theme`.
- `src/components/`: one component per entry of `msca-design/COMPONENTS.md`, test next to it. Shell: `Button` (with `PageLink`, the anchor for any href), `Container`, `Brand`, `SkipLink`, `SiteHeader`, `NavToggle`, `SiteFooter`. Text and layout primitives: `HeroEm`, `Eyebrow`, `Lead`, `SectionHead`, `SectionFoot`, `Section`, `PostIt`, `TagList`, `Monogram`, `Reveal`, `FactList`, `CardGrid`, `CardsSection` (takes `marker`), `StepRows`, `PageHero`, `DarkHero`, `Lightbox` (`LightboxProvider`, `useLightbox`). Form primitives: `Field`, `FieldRow`, `TextInput`, `TextArea`, `Select`, `PillGroup`, `ChoiceCard`, `ConsentCheckbox`, `Honeypot`, `FormAlert`.
- `src/components/meetup/`: `ZoomSplit`, `NumberedList`. `src/components/association/`: `HistoryTimeline` (`AssociationHistory`), `HostsSection`. `src/components/actualites/`: `ArticleListSection`, `ArticleGrid`, `ArticleCard`, `ArticleView`, `ArticlePhotosLink`, `Prose`. `src/components/socrates/`: `OpenSpaceLaws`, `DayStrip`, `EditionGrid`, `FamilyGrid`, `PackageGrid`, `SponsoringSection`, `SponsorLayout`, `SponsorForm`. `src/components/accueillir/`: `HostLayout` (`HostHero`, `ProcessSteps`, `ProofCard`), `HostFunnel`, its `useHostFunnel` hook and its pieces (`OfferStep`, `EventStep`, `CompanyStep`, `ContactStep`, progress, step, nav, recap). The shared `SuccessPanel` is in `src/components/`.
- `src/components/home/`: the home sections, `HomeHero` (`Polaroid`), `StatsBand`, `FormatAgenda` (`TopicWall`), `HistorySection` (`FeaturedEvents`, `FilterChips`, `EventTimeline`, `EventBadge`), `PhotoGallery`, `PartnersSection` (`LogoWall`, `LogoTile`, `LogoSticker`), `SocratesTeaser` (`EditionChips`, `SponsorCall`, `LogoRow`), `OffersSection` (`OfferGrid`), `Faq` (`FaqList`), `CtaBand`. `src/app/(home)/page.tsx` assembles them.
- `src/content/load.ts`: loaders (`loadSite()`, `loadHome()`, `loadEvents()`, `loadCompanies()`, `loadOffers()`, `loadSponsoring()`) read `../content/*.json` with zod (`schemas.ts`). `src/content/types.ts`: types; a compile-time check keeps the schema output equal to them.
- `src/lib/derive.ts`: ports of the former `cms.js` (`git show 1353207:assets/js/cms.js`): `fmtDate`, `place`, `stats`, `companyStats`, `roleLabel`, `monogram`, `logoWallTiles`, and more. `src/lib/home-data.ts`: ports of the inline derivations of `home.js` (hero note, stats, featured events, timeline, gallery, SoCraTes, offers). Pure and unit-tested; pages call them and pass plain props.
- `src/lib/pages-data.ts`: pure derivations for the meetup, association, actualites and socrates pages (server only): the topic board, the association facts, the logo walls, the SoCraTes laws, family, editions and sponsor packages (`socratesLaws`, `socratesFamily`, `socratesEditionCards`, `sponsorPackages`, `sponsorLevels`, `levelForPackage`), the article cards and views. `src/lib/md.tsx`: the mini Markdown renderer `md()`; plain text goes through `frenchSpacing()`, code spans and hrefs do not.
- `src/lib/funnel.ts`: the pure logic of the host funnel (steps, field lists, validation per step, recap, draft read and write, `restoreDraft`). `src/lib/validation.ts`: the e-mail and phone checks shared by both forms (`isValidEmail`, `normalizePhone`, `validPhone`). `src/lib/motion.ts`: `scrollBehavior()`, smooth unless reduced motion. `src/lib/submit-outcome.tsx`: `outcomeOf()`, the success text or the alert content for a submit result, shared by both forms. `src/lib/forms.ts` and `src/lib/forms-browser.ts`: the submit code, see "Forms".
- `src/lib/routes.ts`: `toRoute()`, `pageRoute()`, `isExternal()`, `assetUrl()`. `src/lib/french.ts`: `frenchSpacing()`.

## Layouts and the current page

The root layout owns `<html>` and `<body>` only. Each route segment has a `layout.tsx` that renders `<PageFrame page="...">` (skip link, header, `main#main`, footer, in this order) with the `PageId` of that segment. The header marks the current nav link with `aria-current="page"` from this id, so the state is right in the static HTML, with no client code. `PageFrame` also puts `data-page={id}` on its wrapper `<div>`; no CSS depends on it (the two old rules became the `zellige-corner` class and the `Eyebrow` `marker` prop).

| Segment | Layout | Page id |
|---|---|---|
| `/` | `src/app/(home)/layout.tsx` (route group, so the URL is unchanged) | `home` |
| `/meetup/` | `src/app/meetup/layout.tsx` | `meetup` |
| `/actualites/` and `/actualites/[slug]/` | `src/app/actualites/layout.tsx` | `news` |
| `/association/` | `src/app/association/layout.tsx` | `association` |
| `/socrates/` | `src/app/socrates/layout.tsx` | `socrates` |
| `/accueillir/` | `src/app/accueillir/layout.tsx` (also passes `skip`) | `host` |

To add a page: pick a `PageId` (a new one goes in `PageId` of `content/types.ts` and in `PAGE_ROUTES` of `routes.ts`), create `src/app/<segment>/layout.tsx` with the same four lines as `meetup/layout.tsx`, change the page id, and add the id to the table in `PageFrame.test.tsx`. A layout that uses `LayoutProps` needs `pnpm exec next typegen` first for a new route; the layouts here use a plain `{ children: ReactNode }` type. Two root layouts would force a full page load between pages, so the shell stays in the segment layouts.

The 404 page (`src/app/not-found.tsx`) renders `<PageFrame>` without a page id: no nav link is current and the wrapper has no `data-page`. The static export writes it to `out/404.html`.

## Content

- `content/*.json` at the repo root is the single source of truth. The app reads it at build time with `fs` in server code, through the loaders only. The JSON is never copied into `src/` or `public/` and never fetched from the browser.
- Add one zod schema and one loader per JSON file as a page needs it, so a broken edit fails the build, not the page.
- The derived logic of the former `cms.js` (`git show 1353207:assets/js/cms.js`) lives as pure, unit-tested functions: `stats`, `companyStats`, `roleLabel`, `monogram`, `fmtDate`, `place`, and the mini Markdown renderer `md` (render to React elements). Companies link to events by exact `name` match with `host` and `sponsors[]`; keep and test that rule.
- Images: `public/assets/img/` holds the photos and logos, edited in place (no copy script). URLs stay `/assets/img/meetups/<photo>.jpg`, so `content/*.json` references them as before. Build every plain `<img>` URL through `assetUrl()`.
- Show a partner logo only when the company has one in `companies.json`; an empty `logo` renders the monogram.

## Routes

| Former page (`git show 1353207:<file>`) | Route |
|---|---|
| `index.html` (anchor `#historique`) | `/` |
| `meetup.html` | `/meetup/` |
| `socrates.html` (anchor `#sponsoring`) | `/socrates/` |
| `association.html` | `/association/` |
| `actualites.html` | `/actualites/` |
| `actualites.html?a=<slug>` | `/actualites/[slug]/` with `generateStaticParams` and `dynamicParams = false` |
| `accueillir.html` | `/accueillir/` |

`site.json` `nav`, `cta` and `footer.links` still hold `.html` hrefs; `toRoute()` maps them to the routes above. Old `.html` links from outside (for example `meetup.html`) now give the 404 page (decided, no redirect stubs). Page metadata goes through the `metadata` export, with `metadataBase` from `site.json` `baseUrl`. `src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` and `robots.txt`; both export `dynamic = "force-static"` (a static export refuses them otherwise) and build absolute URLs from `baseUrl`, which already carries the base path.

## Forms

The host funnel (`/accueillir/`) and the SoCraTes sponsor form post to `site.json` `form.endpoint` from the browser. Keep the behavior of the former `funnel.js` (`git show 1353207:assets/js/funnel.js`): the 4 steps, the `type` field, `utm_*` and referrer capture, the hidden honeypot, and the fallback chain (endpoint, then prefilled `mailto:` to `contact.email`, then the LinkedIn page). Endpoint ids are public config in `site.json`, never secrets in code. Details of each form are in `COMPONENTS.md`.

Shared submit code (port of `sendLead` and `tracking` in the former `cms.js`): `src/lib/forms.ts` is pure and takes its browser dependencies as arguments (`readTracking`, `defaultMailBody`, `buildMailtoUrl`, `buildPayload`, `submitForm(input, deps)`, `HONEYPOT_FIELD`). `src/lib/forms-browser.ts` wires the real globals: client components call `submitFormInBrowser({ site, data, type, subject, body?, honeypot?, fallbackOnError? })` from an event handler and switch on `result.mode` (`endpoint`, `mailto`, `linkedin`, `none`, `honeypot`, `error`). It never throws. Page code keeps the validation, the drafts and the French messages; `outcomeOf()` in `src/lib/submit-outcome.tsx` turns the result into the success text or the alert. While a form sends, its button is `aria-disabled` (not `disabled`) so it keeps the focus. Tests inject a fake `fetch`; nothing posts to the real endpoint.

## Status

All pages are built: home `/`, `/meetup/`, `/association/`, `/actualites/` with its articles, `/socrates/` (sponsor form with level preselect) and `/accueillir/` (host funnel), plus `sitemap.xml`, `robots.txt` and the 404 page. The legacy static site is removed; it lives in git history at 1353207. Old links such as `meetup.html` give the 404 page (decided).

Remaining owner decisions:

- The breakpoint mapping of the old queries to Tailwind defaults (proposal in `TOKENS.md`).
- The behavior of the filters without JavaScript.
- The behavior of the show-more buttons, the photo buttons and the mobile nav without JavaScript.
- Whether the host funnel needs a path without JavaScript (the static HTML shows step 1 only).
- The empty `form.endpoint` and the contact e-mail in `content/site.json`: the forms fall back to `mailto:` and LinkedIn until they are filled.

Update `COMPONENTS.md` in the same commit as each component change.

## Deploy

- `.github/workflows/ci.yml` runs on pull requests: format check, typecheck, lint, the full test suite and the build, with no deploy.
- `.github/workflows/deploy.yml` runs on push to `main` (and by hand): the same checks, then `pnpm build` with `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters`, and it publishes `out/` to GitHub Pages. The pnpm store and `.next/cache` are cached.
- The owner sets Settings > Pages > Source to "GitHub Actions" once. Until then the deploy job cannot publish.
- Check a workflow change with `actionlint .github/workflows/*.yml` and `yamllint -d relaxed .github/workflows/`.

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
- The three fonts are variable fonts loaded without a `weight` option, so any weight renders. The former site loaded only Fraunces 500 and 600 and the browser faked bold on the italic: the hero emphasis is weight 590 (measured: 97 percent of the old ink, +2.7 percent width), except in `DarkHero` where it is 520: at 590 the SoCraTes title wraps to a third line at 1280 px (the emphasis is 3 px too wide for the 820 px column), at 520 it fits with 4 px to spare and the brand name is 600 (the old `<strong>` asked for 700 but rendered 600). Measure before you change either.
- Tailwind transforms are separate properties: transition `translate`, `rotate`, `scale`, not `transform`.
- Old breakpoints that are not Tailwind defaults map to the true nearest default (table in `TOKENS.md`, a proposal the owner confirms): nav at `lg`, hero grid at `lg`, tagline `max-sm`. A layout may switch up to about 160 px away from the old query width, one-pixel edge differences at exactly 640 and 1024 px included, and the owner confirms the proposal.
- `Lightbox` is a client component that renders one closed `<dialog>` after `children`; mount `LightboxProvider` once around the page content (a server component can render it). Its dialog needs explicit full-screen utilities because Tailwind removes the dialog margins, and `open:flex` keeps it at `display: none` when closed. jsdom has no `showModal()`: stub it in tests. Check the backdrop and the sage focus ring in a real browser at 375, 768 and 1280 px.
- `Event.type` is a closed enum: a new type in `events.json` fails the build until `EVENT_TYPES` (`types.ts`) and `TYPE_LABEL` (`derive.ts`) get an entry.
- `toRoute()` splits only on `#`, so `toRoute("accueillir.html?formule=x")` gives `/accueillir.html?formule=x`. `offerHref()` carries the query string itself: it builds `/accueillir/?formule={id}` from `pageRoute("host")`. Fix `toRoute` before another link carries a query string.
- `stats().followers` uses `toLocaleString("fr-FR")` (U+202F separator): the output depends on the ICU data of the Node that runs the build.
- The breakpoint mapping of the home sections (old 960 and 900 to `lg`, old 700, 600 and 560 to `sm`, old 760 to `md`) still awaits the owner. Visible effect: from 961 to 1023 px the featured cards are rows (old: three columns), from 601 to 639 px they stack (old: rows), and the timeline year sticks from 640 px (old: 701 px).
- Testing Library folds U+202F into a plain space in node text, but not in the expected string. A `getByText("... ?")` with a U+202F (written as an escape) never matches: read `textContent` and compare it exactly, and write U+202F in test literals as `\u202f`, never as a plain space.
- The old home timeline has no vertical line and no dots (the old `.timeline` had no rule). The line and the dots belong to `HistoryTimeline` on the association page.
- `green-soft` (`#e6f2ea`) is a token because `Monogram` and the meetup badge share it. The other badge colors are arbitrary values until a second use.
- `PostIt` sets its line height with `[line-height:1.15]`, not `leading-*`, because `tailwind-merge` drops `leading-*` when a caller adds a text size.
- Tailwind 4.3 does not generate quarter-step spacing such as `mb-2.4` or `mb-0.6`: write a rem literal (`mb-[0.6rem]`) when the old value is not a multiple of 0.25rem.
- `Field` clones its single child to inject its ids and `aria-*`: give it exactly one element child. It merges the child's own `aria-describedby` (child first, then help, then error), keeps the child's `id` (the label `htmlFor` uses it) and keeps `aria-invalid` true when the child sets it.
- Hash-only hrefs (`#sponsor-form`) render a plain anchor (`PageLink`, used by `Button`, `CardGrid` and the logo sticker): `next/link` does not scroll again when the hash is already in the URL, so a second click on "Choisir ce niveau" would do nothing. Internal routes still go through `next/link` for the base path.
- A dark hero needs `zellige-corner zellige-corner-dark`: the plain corner sits at `z-index: -1`, under the photo layer, so it would be invisible there. The `-dark` utility only sets the sage tile and `z-index: 1`.
- `CardsSection` lives in `src/components/` (not in a page folder): the meetup page and the association page share it.
- `lib/pages-data.ts` reads JSON through the loaders (`node:fs`): import it only from server components and pages, never from a `"use client"` file.
- A dynamic route under `output: "export"` keeps `dynamicParams = false` and a sync `generateStaticParams()`; keep the slug source (`articleSlugs()`) the same for the params, the metadata and the sitemap.
- `CtaBand` takes `tight` for the 56px padding of the closing band of meetup and association; `TopicWall` takes `variant="board"` and `LogoWall` takes `compact`.
- The alt text of the SoCraTes group photo was static in the former `index.html`, not in `home.json`; copy it into the component.
- The header gets its page id as a prop, so render every page through a segment `layout.tsx` that passes it (see "Layouts and the current page"). A route without such a layout renders no header and no footer, because the root layout holds only `<html>` and `<body>`.
- `md()` applies `frenchSpacing()` to the plain text of the article body, as the former site did on every text node. Do not apply it again to the output.
- `HostFunnel` renders step 1 on the server and reads the draft and `?formule=<id>` in a mount effect (`window.location.search`). Do not move that to `useSearchParams`: it needs a Suspense boundary and the static HTML would hold only the fallback. A query link such as `/accueillir/?formule=<id>` resolves to the static page.
- Run `pnpm exec next typegen` after adding a route, or `pnpm typecheck` fails on the stale `.next/dev/types/validator.ts`.
- `PageFrame` takes an optional `skip` prop (`{ href, label }`) for the skip link; only the host layout sets it ("Aller au formulaire" to `#funnel`).
- `SponsorForm` takes an injectable `submit` prop and the `HostFunnel` tests mock `@/lib/forms-browser`: nothing posts to the real endpoint in a test.

## Done means

A page is done when it renders the same content as the former page from the same JSON, keyboard order and focus styles match, `pnpm typecheck`, `pnpm lint` and `pnpm format:check` pass, `pnpm build` exports it with no error, and a browser comparison at 375, 768 and 1280 px shows no unexplained difference. For the comparison:
- Extract the former site into an empty folder (`mkdir /tmp/old && git archive 1353207 | tar -x -C /tmp/old`) and serve it (`python3 -m http.server 8000` there). Serve the export (`out/`) too, open both at each width, and read computed styles (about 40 properties: color, font, spacing, border, shadow, display) plus the bounding boxes of the key elements in both pages. Fix each difference or record it as accepted with its reason in the commit message.
- If the browser window cannot be resized, use same-origin iframes at each width.
- Check hover, focus ring and open states with real mouse and keyboard events, and the console for errors.
- Use the `run` skill and the browser tools to drive this.
