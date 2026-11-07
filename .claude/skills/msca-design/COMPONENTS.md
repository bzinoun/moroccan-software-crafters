# MSCA component inventory

Two parts. "Built" lists what exists in `web/src/components/` (and the data layer in `web/src/content/` and `web/src/lib/`) with its real props and the classes that matter. "To build" lists the remaining components by role, so each page port picks the right one. Tokens are in `TOKENS.md`, Tailwind rules in `TAILWIND.md`.

Conventions for every component:
- A variant is a `tv()` variant (`@/lib/cn`); a caller `className` is merged with `cn()`.
- Mobile first on the default breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). The "Responsive" line says what changes and from which breakpoint.
- Rendered strings go through `frenchSpacing()` (`@/lib/french`); links go through `toRoute()`; plain `<img>` paths go through `assetUrl()` (`@/lib/routes`).
- A component that needs state or events is a client component (`"use client"`); the rest stay server components.
- A decorative photo has `alt=""`; photos below the fold have `loading="lazy"`.
- Pages: `home`, `meetup`, `socrates`, `association`, `news` (actualites), `host` (accueillir). `PageId` in `src/content/types.ts` names them.
- "Old site reference" names the page, section and old class names in the root HTML. It is the visual reference only; do not copy those names into the new code.

## Built

### Button
`src/components/Button.tsx`. Exports `Button` and `buttonStyles` (a `tv`).
- Props: `variant: "primary" | "primary-flat" | "inverse" | "ghost" | "ghost-on-dark"` (default primary), `size: "md" | "sm"` (default md), `className`, plus native `<a>` props when `href` is set, native `<button>` props otherwise (`type` defaults to `button`).
- Renders `next/link` for an internal `href`, a plain `<a>` when `isExternal(href)`, a `<button>` without `href`.
- Classes that matter: pill (`rounded-full`), `border-2 border-transparent`, `font-body text-base leading-none font-semibold no-underline`, `motion-safe:` transition on `translate`, `background-color`, `box-shadow`, `hover:-translate-y-px`, `disabled:opacity-55 disabled:cursor-not-allowed`. Primary: `bg-red text-white` with the red shadow, `hover:bg-red-dark`. Ghost: `border-ink bg-transparent text-ink`, `hover:bg-ink hover:text-white`. `primary-flat`: primary without the red shadow. `inverse`: `bg-white text-red`, `hover:bg-paper hover:text-red-dark`, no shadow. `ghost-on-dark`: `border-white text-white`, `hover:bg-white hover:text-ink`. Size `sm` repeats `leading-none` after its font size, because `tailwind-merge` drops an earlier `leading-*` when a text size follows.
- Dark surfaces (SoCraTes hero and teaser, dark sections, CTA band) use the explicit variants: `primary-flat` for the primary action, `ghost-on-dark` for the secondary, `inverse` for the CTA band primary. Per-call differences go in `className` and win over the variant through `tailwind-merge` (the CTA band ghost sets `hover:text-green`, its green variant sets `text-green hover:text-green` on `inverse`).
- Old site reference: every page, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-row`.

### Container
`src/components/Container.tsx`. Props: native `<div>` props. Classes: `mx-auto w-[calc(100%-32px)] max-w-wrap`. Wraps the content of every section and the header and footer rows.

### Brand
`src/components/Brand.tsx`. Props: `site`, `line` (text under the name, default `site.tagline`; the footer passes `site.mission`), `size: "md" | "lg"` (logo 44px or 52px), `tone: "light" | "dark"`. A `tv` with slots `root`, `logo`, `name`, `line`. The tagline line is hidden below `sm` (`max-sm:hidden`). The name is `font-display` 600. Light tone hovers to `green-dark`; dark tone is white with `on-dark-muted` line.

### SkipLink
`src/components/SkipLink.tsx`. Props: `href` (default `#main`), `label` (default "Aller au contenu"). Off-screen at `-left-[999px]`, `focus:left-2`, ink background, white text, `z-100`. On the host page use `href="#funnel"` and label "Aller au formulaire".

### SiteHeader and NavToggle
`SiteHeader.tsx` (server): props `site`, `page`. `NavToggle.tsx` (client): props `children` (the nav links), owns the open state.
- Header: `sticky top-0 z-50`, `bg-paper/90 backdrop-blur-[10px] backdrop-saturate-[1.4]`, `border-b border-line`, row `h-18` inside `Container`. Contains `Brand`, `NavToggle` with the links, and a small header `Button`.
- Per-page CTA (`headerCta`), shown twice (panel copy and header copy): `home`, `meetup`, `association`, `news` give the primary `site.cta`; `socrates` gives primary "Devenir partenaire" to `#sponsoring`; `host` gives ghost "Les formules" to `index.html#offres`.
- Active link: `aria-current="page"` when the link has no `#` and its route equals the current page route. Home has no active link.
- Nav links: `text-[0.95rem] font-medium text-ink-soft no-underline hover:text-red`; active red text on mobile, ink text with a red `border-b-2` from `lg`.
- Responsive: below `lg` the burger shows (`size-11`, `lg:hidden`), the header button hides (`max-lg:hidden`), and the nav is an absolute panel (`max-lg:absolute max-lg:inset-x-0 max-lg:top-18 max-lg:hidden`, shown by `max-lg:data-[open=true]:flex`) with `shadow-lift`, column links with 1px `border-line` separators and the panel button (`lg:hidden`) at the bottom. From `lg` the nav is a row with `lg:ml-auto`.
- Burger: three bars, `group` plus `group-aria-expanded:` utilities morph them into a cross (outer bars `translate-y-[7px]` and `rotate-45`, middle `opacity-0`). Button has `aria-label="Ouvrir le menu"`, `aria-expanded`, `aria-controls="nav"`. Clicking a link inside the nav closes the panel.
- Old site reference: all pages, `.site-header`, `.nav`, `.nav-toggle`, `.nav-cta`, `initNav` in `assets/js/cms.js`.

### SiteFooter
`src/components/SiteFooter.tsx`. Props: `site`. `bg-green-deep text-on-dark`, `pt-14 pb-10`, `**:focus-visible:outline-sage`. `Container` is a wrapping flex row: `Brand` (size lg, tone dark, line = mission), a nav of `site.footer.links` (cream, no underline, hover white and underlined; external `http(s)` links open in a new tab with `rel="noopener"`), and the legal line (full width, `border-t border-white/16`). Old site reference: all pages, `.site-footer`.

### HeroEm
`src/components/HeroEm.tsx`. Props: `text`. Turns `<em>word</em>` in a JSON title into a React `<em>` without `dangerouslySetInnerHTML`. The red italic and the underline come from the base layer (`h1 em`, `h2 em`).

### Eyebrow, Lead, SectionHead, SectionFoot
`Eyebrow.tsx`, `Lead.tsx`, `SectionHead.tsx`, `SectionFoot.tsx`.
- `Eyebrow`: props `tone: "default" | "dark" | "cream"`, `marker: "rule" | "khatam" | "none"` (default rule), native `<p>` props. Exports `eyebrowStyles`. The marker is a `before:` pseudo-element (rule 22px by 2px, khatam 14px by `clip-path`); `default` is red, `dark` is sage, `cream` is cream (SoCraTes hero), and the marker takes the text color on the two dark tones. Marker `none` is `before:hidden`: the pseudo-element is out of the layout (an empty one would still be a flex item and shift the label). A string child goes through `frenchSpacing()`.
- `Lead`: props `tone: "default" | "dark"`, native `<p>` props. Exports `leadStyles`. `max-w-[60ch] text-[1.15rem]`, soft ink or `text-on-dark`. The bottom margin comes from the base layer paragraph rule.
- `SectionHead`: props `eyebrow?`, `title` (may hold one `<em>`, rendered by `HeroEm`), `lead?`, `align: "start" | "center"` (default start), `tone: "default" | "dark"`, `marker: "rule" | "khatam" | "none"` (default `rule`, or `none` when `align` is `center`), `titleId?`, `className`, `children` (after the lead). `mb-11 max-w-[760px]`; `align="center"` adds `mx-auto text-center`, hides the eyebrow marker (`Eyebrow` marker `none` is `before:hidden`, so no empty box shifts the label) and centers the lead. The `h2` color on dark comes from the dark `Section`.
- `SectionFoot`: native `<p>` props. `mt-9 flex flex-wrap justify-center gap-[0.8rem]`. Hide it with the `hidden` attribute (Preflight forces `display: none` for it).
- Responsive: none. Old site reference: all pages; `.eyebrow`, `.lead`, `.section-head`, `.section-foot`.

### Section
`src/components/Section.tsx`. Exports `Section` and `sectionStyles`. Props: `variant: "plain" | "alt" | "dark"` (default plain), `tight` (boolean), `containerClassName` (classes for the inner `Container`), native `<section>` props. Padding `py-22`, tight `py-14`. `alt` is `bg-sage-soft`; `dark` is `bg-green-deep text-cream **:focus-visible:outline-sage` with white `h2` and `h3`, and a sage `h2 em` without the hand-drawn mark (`[&_h2_em]:bg-none`). A `Button` on a dark section uses the `primary-flat` or `ghost-on-dark` variant. Anchor offset: the base layer sets `scroll-padding-top: 84px` on `html`. Old site reference: `.section`, `.section.alt`, `.section.dark`, `.section.tight`.

### PostIt
`src/components/PostIt.tsx`. Exports `PostIt` and `postItStyles`. Props: `color: "yellow" | "pink" | "green" | "blue" | "orange"` (default yellow), `caption?` (small line in the body font, for the year on a topic note), `className`, native `<div>` props. Classes: `w-[170px] p-[16px_18px_20px] font-hand text-[1.35rem] [line-height:1.15] text-ink`, post-it shadow, `bg-postit-*`. The line height is an arbitrary property on purpose: `tailwind-merge` drops a `leading-*` when a caller adds a text size (1.15rem, 1.25rem, 1.5rem on the old site). The parent sets rotation, position and width with `className`. Old site reference: `.postit`.

### TagList
`src/components/TagList.tsx`. Props: `tags?: readonly string[]`, `max?`, native `<ul>` props. Renders nothing for a missing or empty list. `mt-[0.2rem] mb-4 flex list-none flex-wrap gap-1.5 p-0`; pills `rounded-full bg-paper-2 px-[9px] py-[3px] text-[0.76rem] text-ink-soft`. The timeline and article cards pass their own margins with `className`. Old site reference: `.tags`.

### Monogram
`src/components/Monogram.tsx`. Exports `Monogram` and `monogramStyles`. Props: `initials` (from `monogram(name)` in `src/lib/derive.ts`), `label?`, `size: "lg" | "md" | "sm"` (default lg), native `<span>` props. Sizes: `lg` 84px box with `text-[1.6rem]` (logo wall), `md` 60px with `text-[1.2rem]` (compact wall), `sm` 56px bordered `rounded-xl` square (logo row). Look: `bg-green-soft font-display font-semibold text-green-dark`, `rounded-[14px]` for lg and md. A11y: `aria-hidden` by default; with `label`, `role="img"` and `aria-label` (use it when the name is not printed next to the tile). Old site reference: `.monogram`.

### Reveal
`src/components/Reveal.tsx` (client). Props: `as: "div" | "li" | "article" | "section"` (default div), native `<div>` props. The server HTML carries no hidden state, so content shows without JavaScript. On mount a layout effect sets `data-reveal="waiting"` (instant, no fade out), except when the element already sits above the viewport bottom minus 60px: then it stays visible. An `IntersectionObserver` (`rootMargin: "0px 0px -60px 0px"`) sets `data-reveal="shown"` once and disconnects. Without `IntersectionObserver`, nothing is hidden. Both states sit behind `motion-safe:`: waiting is `translate-y-4 opacity-0`, shown adds `transition-[opacity,translate] duration-600 ease-[ease]`. Under reduced motion the content is always at rest. Applied to: feature cards, offers, cards, editions, article cards. Old site reference: `.reveal`, `initReveal`.

### Lightbox, LightboxProvider, useLightbox
`src/components/Lightbox.tsx` (client). Exports `LightboxProvider` (`{ children }`), `useLightbox()` returning `{ open(items, startIndex) }` (throws outside the provider) and the type `LightboxItem = { src: string; caption?: string }`. Mount the provider once around the page content; it renders the dialog once after `children`. `src` is a final URL (callers use `assetUrl()`); the caption is optional and goes through `frenchSpacing()`.
- Native `<dialog aria-label="Photo agrandie">` opened with `showModal()` (top layer, native Escape, focus trap, `::backdrop`). Inside: close button, previous button, `<figure><img><figcaption>`, next button, labelled "Fermer", "Photo précédente", "Photo suivante". ArrowLeft and ArrowRight are handled by a `keydown` listener on `document`, added while the dialog is open (a click on the photo or caption moves focus out of the dialog, so a handler on the dialog would miss the keys).
- Classes that matter: dialog `m-0 size-full max-h-none max-w-none flex-col items-center justify-center bg-transparent px-4 py-10 text-white open:flex backdrop:bg-[rgba(15,13,12,0.94)] **:focus-visible:outline-sage` (`open:flex` keeps the closed dialog at `display: none`; the full-screen utilities are explicit because Tailwind removes the dialog margins). Round buttons `absolute size-12 rounded-full bg-white/12 hover:bg-white/25`; close top right, previous and next centered at the edges. Image `max-h-[calc(100vh-140px)] w-auto rounded-[6px]`; caption `text-[0.92rem] text-[#e8e2d9]` (no token for that color).
- Behavior: several photos show "{caption} · 3 / 12" (the counter alone without a caption), step buttons and wraparound; one photo shows the caption only. Close button, Escape and a click on the dialog itself (backdrop and padding) all end in the native `close` event, whose handler clears the state, restores `document.body.style.overflow` and returns focus to the element active at `open()`. Opening focuses the close button and locks body scroll. `open()` clamps `startIndex` and ignores an empty list.
- Tests: jsdom has no `showModal()` or `close()`; the test file stubs both on `HTMLDialogElement.prototype`. A closed dialog is not in the accessibility tree: query it by tag.
- Pages: home (gallery, feature cards), news. Old site reference: `lightbox` in `assets/js/cms.js`, `.lightbox`, `.lb-close`, `.lb-prev`, `.lb-next`.

### Data layer for the home page
Not a component: typed loaders and pure derivations. A page loads the JSON once in a server component, derives plain props and passes them to the section components. A component never reads files.
- Loaders (`src/content/load.ts`, schemas in `schemas.ts`, types in `types.ts`): `loadSite()`, `loadHome()` (all of `home.json`), `loadEvents()`, `loadCompanies()`, `loadOffers()`, `loadSponsoring()`. Each reads `../content/*.json` with `fs` at build time and parses with zod; a broken edit throws `Invalid content in content/<file>.json: <path>: <message>`. `Event.date` is `YYYY-MM-DD` or `YYYY-MM`; `Event.type` is a closed enum (`meetup`, `socrates`, `codesnack`, `online`): a new type fails the build until `EVENT_TYPES` and `TYPE_LABEL` get an entry.
- Derivations of `cms.js` (`src/lib/derive.ts`): `fmtDate`, `place`, `photoItems`, `stats`, `companyStats`, `roleLabel`, `monogram`, `TYPE_LABEL`, `meetupPhotoUrl`, `logoUrl`, `logoWallTiles`. Companies link to events by exact `name` match with `host` and `sponsors[]`. `PhotoItem` is `{ photo, src, caption, eventId }`; the lightbox uses `src`.
- Derivations of `home.js` (`src/lib/home-data.ts`): `heroNote`, `heroCollage`, `statItems`, `formatSteps`, `topicsFromEvents`, `featuredEvents`, `featuredMeta`, `eventLinks`, `timelineWhere`, `filterEvents`, `eventsByYear`, `timelineMoreLabel`, `galleryItems`, `socratesEditions`, `socratesPhoto`, `trustLogos`, `offerPrice`, `offerHref` (it builds `/accueillir/?formule={id}` from `pageRoute("host")`, because `toRoute()` cannot carry a query string).
- Rules the components must keep: `limit` values use `||` (`home.history.limit || 6`, `home.gallery.limit || 8`, `home.topics.limit || 10` inside `topicsFromEvents`). Timeline and gallery: the "more" button shows when the total is larger than the limit; after the click, focus moves to the item at index `limit`; a filter click shows the first `limit` events again; the lightbox walks all gallery items. Strings come back with plain spaces: render them through `frenchSpacing()`. The logo wall sticker is not in `logoWallTiles`: read `companies.sticker.host`. The alt text of the SoCraTes group photo is static in `index.html`, not in `home.json`: `socratesPhoto(home)` gives the URL, the alt is copied into the component.
- Old site reference: `assets/js/cms.js`, `assets/js/home.js`.

### Home sections (`src/components/home/`)
The home page `src/app/page.tsx` is a server component: it calls the loaders and the derivations of `home-data.ts`, wraps the sections in `LightboxProvider` and renders, in the order and with the ids of the root `index.html`: `HomeHero`, `StatsBand`, `FormatAgenda` (`#format`), `HistorySection` (`#historique`), `PhotoGallery` (`#galerie`), `PartnersSection` (`#partenaires`), `SocratesTeaser` (`#socrates`), `OffersSection` (`#offres`), `Faq` (`#faq`), `CtaBand`. The skip link target `main#main` stays in the layout. Breakpoint note for all of them: old queries map to the nearest default (960 and 900 to `lg`, 760 to `md`, 700, 600 and 560 to `sm`), a proposal the owner has not confirmed (see `TOKENS.md`).

#### HomeHero, Polaroid
`HomeHero.tsx` (server), `Polaroid.tsx` (server). Props: `HomeHero` (`hero: Home["hero"]`, `note: string` from `heroNote(home, events)`, `collage: { src, caption }[]` from `heroCollage(home)`; `hero.collage` is ignored); `Polaroid` (`index`, `src`, `caption`).
- Section `zellige-corner overflow-hidden pt-16 pb-10`; `Container` grid `items-center gap-12 lg:grid-cols-[1.05fr_1fr]`. Left column: `Eyebrow`, `h1` with `HeroEm`, `Lead` (`mb-[1.8rem]`), a primary and a ghost `Button` through `toRoute()`, and the hero note (`mt-[1.4rem] text-[0.9rem] text-muted`, only when not empty).
- Collage box: `relative h-[380px] lg:h-[480px]` with `aria-hidden="true"`. `Polaroid`: `figure` `absolute rounded-[3px] bg-white px-2.5 pt-2.5 pb-[34px] shadow-lift`, empty-alt `img` (`object-cover`), `figcaption` in `font-hand` ellipsized on one line. The index picks the slot (width, height, offset, tilt, layer): `-rotate-3` `z-2`, `rotate-4` `z-4`, `-rotate-[1.5deg]` `z-3`; heights grow from `lg`. The post-it (`hero.postit`) is a `PostIt` `absolute top-2.5 right-[6%] z-5 w-35 rotate-[5deg]`, `lg:w-[170px] lg:text-[1.35rem]`.
- Old site reference: `index.html` hero; `.hero`, `.collage`, `.polaroid`, `.hero-note`.

#### StatsBand
`StatsBand.tsx` (server). Props: `items: StatItem[]` from `statItems(home, site, events)`. `<section aria-label="Chiffres clés">` `border-y border-line bg-paper-2 py-7`, a `ul` grid `grid-cols-2 gap-5 md:grid-cols-5 md:gap-4`; the last item spans the row below `md` (`last:col-span-full md:last:col-auto`). Value in a `b`: `font-display text-[length:clamp(1.8rem,3vw,2.4rem)] leading-[1.1] font-semibold text-green`; label `text-[0.88rem] text-ink-soft`. Old site reference: `.stats`.

#### FormatAgenda, TopicWall
`FormatAgenda.tsx`, `TopicWall.tsx` (server). Props: `FormatAgenda` (`eyebrow`, `title`, `lead?`, `steps: FormatStepItem[]` from `formatSteps(home)`, `topics: TopicNote[]` from `topicsFromEvents(events, home.topics.limit)`, `topicsLabel`, `more?: Cta` with the raw `.html` href); `TopicWall` (`label`, `topics`).
- `Section id="format" aria-labelledby="format-title"`, `SectionHead`, then an `<ol>` `grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4`. Card (`li`): `group flex flex-col overflow-hidden rounded-card border border-line bg-card`; optional photo (`aspect-16/10`, empty alt, lazy, `motion-safe:group-hover:scale-[1.04]` over 500ms); body `px-5.5 pt-4.5 pb-5.5` with the number `01` to `04` (`aria-hidden`, `font-display text-[1.9rem]` red), time (`text-[0.78rem]` uppercase green), `h3`, text. Then `TopicWall`, then a ghost `Button` in a `SectionFoot` when `more` is set.
- `TopicWall`: `div role="group" aria-label` `mt-12 flex flex-wrap justify-center gap-3.5`; one `PostIt` per topic (`w-auto max-w-60 p-[12px_16px_14px] text-[1.25rem]`), color from the tone (`default` is yellow), the year as caption, tilt by index (even `-rotate-2`, odd `rotate-[1.5deg]`, every third `-rotate-[0.5deg]`). Not built yet: the cork `board` variant (meetup page).
- Old site reference: `#format`, `.agenda`, `.topic-wall`.

#### HistorySection, FeaturedEvents, FilterChips, EventTimeline, EventBadge
All in `src/components/home/`, all client components. `HistorySection` must render inside `LightboxProvider` (it calls `useLightbox()`).
- `HistorySection` props: `history` (`home.history`), `events` (`loadEvents()`). `Section id="historique" variant="alt"`: `SectionHead`, `FeaturedEvents`, `FilterChips` (label "Filtrer les événements", static in `index.html`), `EventTimeline id="timeline"` and, while events are hidden, a `SectionFoot` with a ghost `Button` (`aria-controls="timeline" aria-expanded={false}`) labelled by `timelineMoreLabel(history.more, total)`. State: the filter (starts at `history.filters[0].value`) and the expanded flag. Rules kept from `home.js`: limit `history.limit || 6`; the button shows when the filtered total is larger than the limit and disappears after the click; the click shows every event of the filter and moves focus to the item at index `limit`; a filter click shows the first `limit` events again.
- `FeaturedEvents` props: `events` (`featuredEvents(events)`), `onOpenPhotos(event)` (the section opens the lightbox on `photoItems(event)` at index 0). List `mb-14 grid grid-cols-1 gap-6 lg:grid-cols-3`. Card (`Reveal as="article"`): `flex flex-col overflow-hidden rounded-card bg-card shadow-card sm:flex-row lg:flex-col`. Photo: a `<button aria-label="Voir les {n} photos de {title}">` (`group relative aspect-16/10 cursor-zoom-in overflow-hidden`, from `sm` `sm:w-2/5 sm:aspect-auto`, from `lg` stacked again) with the first photo (`alt=""`, lazy, zoom `motion-safe:group-hover:scale-104`) and the count pill "{n} photos". Body: `featuredMeta(e)`, `h3`, summary, `TagList max={4}`, links from `eventLinks(e)` (`min-h-11`, `target="_blank" rel="noopener"`).
- `FilterChips` props: `label`, `options: readonly HistoryFilter[]`, `value`, `onChange(value)`, `className`. `div role="group" aria-label` of `<button type="button" aria-pressed>`; chip `rounded-full border-[1.5px] border-line bg-card px-[0.95rem] py-[0.45rem] text-[0.9rem] font-medium leading-[normal]`, pressed `aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white`.
- `EventTimeline` props: `groups: YearGroup[]` (`eventsByYear(events, filter, limit)`), `id?`, `focusId?` (the item of that event gets `tabIndex={-1}` and takes the focus when it mounts). Exports `EventTimeline`, `EventBadge` (`kind: EventType`, label from `TYPE_LABEL`) and `eventBadgeStyles` (a `tv`; meetup `bg-green-soft text-green-dark`, the other three badge colors are arbitrary values, see `TOKENS.md`). Year group `grid grid-cols-1 gap-2 border-t border-line py-4.5 sm:grid-cols-[120px_1fr] sm:gap-6`, year `h3` `text-[2rem] text-green sm:sticky sm:top-[90px]`; item `li` `rounded-sm border border-line bg-card px-[18px] py-3.5`, from `sm` `sm:grid-cols-[92px_1fr_auto] sm:gap-4`, with `<time dateTime>`, `h4`, `timelineWhere(e)`, `TagList max={6}` and the badge. The home timeline has no vertical line and no dots: the old `.timeline` had no such rule (they belong to `HistoryTimeline` on the association page).
- Old site reference: `#historique`, `#featured`, `.feature-card`, `.filters`, `.chip`, `.year-group`, `.tl-item`, `.badge--*`.

#### PhotoGallery
`PhotoGallery.tsx` (client; inside `LightboxProvider`). Props: `eyebrow`, `title`, `more` (button label), `limit?` (`home.gallery.limit`; a missing or zero value means 8), `items: PhotoItem[]` from `galleryItems(events)`. `Section id="galerie"`, `SectionHead`, then a `div#gallery` of CSS columns `columns-2 gap-x-2.5 sm:gap-x-3.5 md:columns-3 lg:columns-4`. Each item is a `<button aria-label="Agrandir : {caption}">` (`group relative mb-2.5 sm:mb-3.5 cursor-zoom-in overflow-hidden rounded-sm break-inside-avoid`) with a lazy `img` (`alt` = caption, zoom `motion-safe:group-hover:scale-103`) and a caption overlay (gradient, visible on `group-hover` and `group-focus-visible`). A click calls `lightbox.open(items, index)` on all items. The ghost "more" button (`aria-controls="gallery"`) appends the rest, disappears, and focuses the first added item. Old site reference: `.gallery`, `.cap`.

#### PartnersSection, LogoWall, LogoTile, LogoSticker, LogoImage
`PartnersSection.tsx`, `LogoWall.tsx` (exports `LogoWall`, `LogoTile`, `LogoSticker`). Props: `PartnersSection` (`eyebrow`, `title`, `lead`, `tiles: LogoTile[]` from `logoWallTiles(companies.items, events)`, `sticker: Sticker` from `companies.sticker.host`); `LogoWall` (`tiles`, `sticker?`, `id?`); `LogoTile` (`tile`); `LogoSticker` (`sticker`).
- `PartnersSection`: `Section variant="alt" id="partenaires"`, centered `SectionHead`, `LogoWall id="logo-wall"`, then a `SectionFoot` with a primary `Button` "Rejoindre les hôtes" (to the host page) and a ghost `Button` "Soutenir SoCraTes Maroc" (to `socrates/#sponsoring`); both labels are static, as in `index.html`.
- `LogoWall`: `flex flex-wrap justify-center gap-3.5`. `LogoTile`: `w-42 rounded-card border border-line bg-card`, logo `size-21` in a `size-23` box (lazy, `alt` = name) or a `Monogram` when the company has no logo; name `text-[0.88rem] font-semibold`, label `text-[0.74rem] text-muted`; an `<a target="_blank" rel="noopener">` with lift on hover (`motion-safe:hover:-translate-y-0.75`, `shadow-lift`) only when the company has a LinkedIn page, else a `div`. `LogoSticker`: one `<a>` with the footprint of a tile, `bg-postit-yellow -rotate-2`, `font-hand`, named by `aria-labelledby`, described by `aria-describedby`. Not built yet: the `compact` wall (association page) and the dark tone (SoCraTes page).
- `LogoImage` (`LogoImage.tsx`, client): a lazy `img`; it swaps itself for a `Monogram` on the `error` event, and on mount when the load already failed (`complete` with `naturalWidth` 0). `LogoTile` and `LogoRow` use it.
- Old site reference: `.logo-wall`, `.logo-tile`, `.sticker`.

#### SocratesTeaser, EditionChips, SponsorCall, LogoRow
`SocratesTeaser.tsx` (exports `SocratesTeaser`, `EditionChips`, `SponsorCall`), `LogoRow.tsx`; all server components. Props: `SocratesTeaser` (`eyebrow`, `title`, `lead`, `cta`, `editions: SocratesEdition[]` from `socratesEditions(events)`, `photoSrc` from `socratesPhoto(home)`, `sponsor` (`home.socrates.sponsor`), `trust: TrustLogo[]` from `trustLogos(sponsoring, companies.items)`); `EditionChips` (`editions`, native `ul` props); `SponsorCall` (`sponsor`, `trust`, native `div` props, so the SoCraTes page can pass `my-10`); `LogoRow` (`logos: TrustLogo[]`, native `div` props).
- `Section variant="dark" id="socrates"` with `containerClassName="grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr]"`. Left: khatam `Eyebrow`, `h2` with `HeroEm`, dark `Lead`, `EditionChips` (`grid-cols-2 gap-3`; cell `rounded-sm border border-white/15`, title in `font-display` white, detail `text-on-dark`), a `Button` to the `cta`, then `SponsorCall` (`rounded-card border border-sage/35 bg-sage/10 px-6.5 py-6`: khatam `Eyebrow`, `h3`, text, `LogoRow` labelled "Partenaires présents à chaque édition", ghost button with white text and border). Right: the group photo `aspect-4/3 object-cover object-[center_75%]`, lazy, with a static French alt text (it is in `index.html`, not in `home.json`).
- `LogoRow`: `div role="group"` `flex flex-wrap items-center justify-center gap-3`; a lazy `img` `size-14 rounded-xl border border-line bg-white object-contain p-1` (`alt` and `title` = name) or a `Monogram size="sm"` with `label`.
- Old site reference: `.socrates`, `.editions`, `.sponsor-call`, `.logo-row`.

#### OfferGrid, OffersSection
`OfferGrid.tsx` (server; client boundary only through `Reveal`), `OffersSection.tsx` (server). One card is an `article` inside `OfferGrid`, not a separate export. Props: `OfferGrid` (`items: Offer[]`, `tone?: "light" | "dark"`, default light); `OffersSection` (`eyebrow`, `title`, `lead`, `note`, `items`). The highlight and the badge come from each `Offer` (`highlight`, `badge`).
- `OffersSection`: `Section id="offres" aria-labelledby="offres-title"`, centered `SectionHead`, the grid, then the note (`mt-7 text-center text-[0.92rem] text-muted`).
- Grid `mx-auto grid max-w-[560px] items-stretch gap-5.5 lg:max-w-none lg:grid-cols-3`. Card (`Reveal as="article"`): `relative flex flex-col rounded-card border-[1.5px] px-6.5 py-7`; highlighted: `border-green shadow-lift` and the badge as a flag (`absolute -top-3.25 left-6.5`, green pill). Content: `h3` name, price `offerPrice()` (empty gives "Sur devis"; `text-[1.5rem]`, not `text-2xl`, to keep the line height), tagline (`lg:min-h-[3em]`), two `h4` lists "Vous apportez" (yellow bullets, `#c9a400` border) and "Nous apportons" (green bullets), each bullet a 10px `before:` square. The button "Choisir cette formule" is `mt-auto self-start`, solid for the highlighted card and ghost for the others, and links through `offerHref()` to `/accueillir/?formule={id}`. Dark tone (unit-tested only, no dark section uses it yet): translucent card, sage border, flag and price, white ghost button.
- Old site reference: `#offres`, `.offers`, `.offer`, `.flag`, `.give`.

#### Faq, FaqList
`Faq.tsx` (server). Exports `Faq` and `FaqList`. Props: `Faq` (`eyebrow`, `title`, `items: { q, a }[]` from `home.faq.items`); `FaqList` (`items`, `tone?: "default" | "dark"`, native `div` props). `Faq` is `Section variant="alt" id="faq" aria-labelledby="faq-title"` with a centered `SectionHead` and the list. `FaqList`: `mx-auto max-w-[820px]`; native `<details>` and `<summary>` (no JS): summary `flex cursor-pointer list-none justify-between gap-4 py-4.5 text-[1.05rem] font-semibold`, plus sign drawn by `after:content-['+']` that turns 45 degrees under `group-open:`; only its transition sits behind `motion-safe:`. Default tone: `border-line`, green plus, `text-ink-soft` answers; dark tone: `border-white/14`, sage plus, `text-on-dark` answers. Old site reference: `.faq`.

#### CtaBand
`CtaBand.tsx` (server). Props: `title`, `text`, `primary: Cta`, `secondary: Cta` (`home.cta`), `variant?: "default" | "green"`. `Section aria-labelledby="cta-title"` holding the band: `rounded-[22px] bg-green px-6 py-10 text-white md:grid-cols-[1.4fr_1fr] md:px-12 md:py-14 **:focus-visible:outline-sage`, white `h2`, text `text-[#d9efe2]`. Primary button inverted (white fill, hover paper, red text, or green text in the `green` variant), ghost button white outline (hover white fill, green text). A link is opened in a new tab (`rel="noopener"`) when `isExternal()`. Old site reference: `.cta-band`.

## To build

Home sections are built (see Built). The entries below are ordered as the port reaches them. "Native HTML" says what to use instead of JS.

### PageHero
- Role: inner page hero with facts and a figure. Props: eyebrow, title, lead, `facts`, `image`, `postit` (`color`, text).
- Layout: two columns `lg:grid-cols-[1.1fr_0.9fr]`, `gap-12`. Image 4/3, `rounded-card`, `shadow-lift`, rotated `1.5deg`; post-it overlaps the bottom left (`-left-3.5 -bottom-4`, `-4deg`). Facts in two columns, `mt-8`. Zellige corner.
- Pages: meetup (yellow post-it), association (green).
- Old site reference: `meetup.html`, `association.html`; `.page-hero`.

### DarkHero, StatusChip
- Role: SoCraTes hero. Props: `photo`, eyebrow, title, lead, buttons, status text, `facts`.
- Layout: `bg-green-deep`, `pt-30 pb-18`. Photo layer at `opacity-45`, `saturate-85`, position `center 35%`, with a vertical gradient to green-deep on top. Sage zellige corner. Text `max-w-[820px]`; `h1` white and larger; emphasis sage without underline. Facts: glassy cells (`bg-white/7`), sage numbers.
- Status chip: inline-flex, `rounded-[18px]`, translucent green fill, sage border, cream `0.92rem` text, `text-wrap: balance` (`text-balance`), 14px sage khatam before the text.
- Pages: socrates.
- Old site reference: `socrates.html`; `.hero-dark`, `.status-chip`.

### FactList
- Role: row of numbered facts. Props: `items: { value, label }[]`, `tone: "light" | "dark"`.
- Layout: two columns by default, four columns from `sm`; always two inside `PageHero`. Cell: white, `border border-line`, `rounded-sm`, number `font-display` 1.6rem green `whitespace-nowrap`, label `0.84rem text-ink-soft`. Dark: `bg-white/7`, sage numbers.
- Content: association facts come from stats helpers (events count, distinct hosts, SoCraTes editions, followers formatted `fr-FR`).
- Pages: meetup, association, socrates.
- Old site reference: `.facts`.

### LogoWall, LogoTile, LogoSticker, Monogram
- Role: partner logos with a "your logo here" post-it. `LogoWall` takes `compact`.
- Built for the home page: see `PartnersSection, LogoWall, LogoTile, LogoSticker, LogoImage` in Built. Left to build: the `compact` variant (association) and the dark variant (socrates).
- Layout: centered wrapping flex, `gap-3.5`, fixed-width tiles (168px; compact 112px) so the last row stays centered. Tile: white, `border border-line`, `rounded-card`; logo 84px in a 92px white box; name `0.88rem` 600; role `0.74rem text-muted`. Linked tile hover: `motion-safe:` lift `-translate-y-0.75`, `shadow-lift`, logo opacity 1. Sticker: same footprint, yellow, `rounded-[2px]`, `-2deg` (hover `-0.5deg`), `font-hand` title 1.7rem. On dark: translucent tile, light text.
- Rule: show a logo only when the company has one and consent; an empty `logo`, or a logo file that fails to load, renders `Monogram` (the client component `LogoImage` swaps the image for the monogram on `error`, and on mount when the load already failed; `LogoRow` uses it too). Order by hosted plus sponsored count, descending. The SoCraTes wall shows sponsors only, with their years.
- Native HTML: `<a>` when the company has a link, `<div>` otherwise; sticker is one `<a>` with `aria-labelledby`.
- Pages: home (`#partenaires`), association (compact), socrates.
- Old site reference: `.logo-wall`, `.logo-tile`, `.sticker`, `.monogram`.

### CardGrid, Card
- Role: plain text cards. Props: `CardGrid` (`columns: 2 | 3 | 4`), `Card` (`title`, `text`, `href?`, `tone`).
- Layout: one column; two from `sm`; three or four from `lg` (a three-column grid centers an incomplete last row: use a 6-track grid where each card spans 2, or flex with fixed basis). Card: white, `border border-line`, `rounded-card`, `px-5.5 py-6`, `h3` 1.15rem, text `0.95rem text-ink-soft`, "more" link bold `0.9rem` with an arrow; external links `target="_blank" rel="noopener"`. Dark tone: translucent fill and border, `on-dark` text.
- Pages: meetup, socrates, association.
- Old site reference: `.cards`, `.card`, `.more`.

### StepRows, StepRow, TipList
- Role: meetup schedule rows with a photo, a time tag and tips.
- Layout: two equal columns from `md` (`gap-12`, `py-11`, top `border-line` except the first); even rows put the media on the right (`md:order-*`); one column with media first below. Image 4/3, `rounded-card`, `shadow-lift`. Time tag: ink pill at the top left. Kicker `font-hand` 1.6rem green; `h3` 1.8rem. Tips: mini post-its, yellow (even green), `font-hand` 1.25rem, `w-fit`, rotation `-0.6deg` and `0.8deg`.
- Pages: meetup (`#deroule`).
- Old site reference: `.step-row`, `.time-tag`, `.kicker`, `.tips`.

### ZoomSplit, NumberedList
- Role: photo beside a numbered list.
- Layout: two columns `md:grid-cols-[1fr_1.1fr]`, `gap-12`; image 4/3 at `-1.5deg` with `shadow-lift`. List item `grid-cols-[44px_1fr]`; counter in a 40px green-outlined circle, `font-display`, rotated `-6deg`.
- Native HTML: `<ol>`.
- Pages: meetup (`#marketplace`).
- Old site reference: `.zoom`, `.numbered`.

### OpenSpaceLaws
- Role: the open-space laws as numbered cards.
- Layout: one column; two from `md`, `gap-5`. Card: white, `rounded-card`, left padding 78px with a 38px green-outlined counter rotated `-8deg`; `h3` italic 1.25rem. The last item ("main law") spans both columns on `bg-green-deep`, sage counter, white `h3` 1.7rem, `pr-[15%]` from `md`.
- Native HTML: `<ol>`.
- Pages: socrates (`#regles`).
- Old site reference: `.laws`, `.law-main`.

### DayStrip
- Role: four days of the conference in one block.
- Layout: one bordered white block, `rounded-card`; one column, 2x2 from `sm`, four cells from `lg`, divided by 1px `border-line` lines (switch the divider side with the breakpoint). Day name `font-hand` 1.7rem green.
- Native HTML: `<ol>`, plus a note paragraph.
- Pages: socrates (`#deroule`).
- Old site reference: `.days`.

### EditionGrid, EditionCard
- Role: past SoCraTes editions.
- Layout: one column; two from `sm`; four from `lg`; `gap-5`. Cover 4/3: the photo, or a sage zellige pattern over green-deep with a radial vignette and the year in a double khatam star (`font-display` cream); yellow post-it badge at the top left rotated `-4deg`. Numbers `font-display` 1.4rem green.
- Pages: socrates (`#editions`).
- Old site reference: `.edition`, `.cover`, `.yr-badge`.

### FamilyGrid
- Role: logos of the SoCraTes family. `grid-cols-[repeat(auto-fill,minmax(120px,1fr))]`, `gap-3.5`; centered white tiles with a 72px logo, name bold, country muted. Native `<ul>`. Pages: socrates (`#famille`).
- Old site reference: `.family`.

### HistoryTimeline
- Role: association history with a vertical line.
- Layout: items `grid-cols-[48px_1fr]` (gap 28px) below `sm`, `grid-cols-[56px_1fr]` (gap 36px) from `sm`; a 2px `bg-line` vertical line behind the dots; 14px dot with a 3px red border on `paper`; year `font-display` green right aligned, 1.15rem below `sm`, 1.5rem from `sm`.
- Native HTML: `<ol>`.
- Pages: association (`#histoire`).
- Old site reference: `.history`.

### ArticleGrid, ArticleCard
- Role: news list; the whole card is a link. Props: `ArticleCard` (`article`, `lead`).
- Layout: one column; two from `sm`; three from `lg`, `gap-6`. Card: white, `shadow-card`, `rounded-card`; cover 16/10 on `paper-2`; kind label `0.72rem` uppercase green; hover `motion-safe:` lift and `shadow-lift`. The newest card (`lead`) spans the full row from `lg`, horizontal, cover 55 percent wide, `h3` 1.9rem, body `px-8.5 py-8`.
- Pages: news.
- Old site reference: `.article-card`, `.lead-card`.

### ArticleView, Prose
- Role: one article at `/actualites/[slug]/`; `Prose` renders the Markdown subset.
- Layout: `max-w-[760px]` centered; back link, meta line, `h1` (article size), lead, cover (`rounded-card`, `shadow-lift`, image max 520px high), prose, tags, links row with a top line.
- Prose: 1.08rem, line-height 1.7; `h2` 1.6rem, `h3` 1.5rem; lists indented 1.3rem; blockquote with a 3px sage left rule, Fraunces italic 1.25rem; code on `paper-2` with `rounded-[4px]` in `font-mono`; links underlined with offset 3px. Markdown subset: `#`, `##`, `###` become h2, h3, h4; `-` and `*` lists; numbered lists; `>` quotes; bold, italic, code; links open in a new tab. Render to React elements, never raw HTML. The "Les N photos" link opens the lightbox.
- Pages: news.
- Old site reference: `.article`, `.prose`, `md` in `assets/js/cms.js`.

### HostLayout (HostHero, ProcessSteps, ProofCard)
- Role: host page frame. Hero with a zellige corner (`pt-14 pb-6`); body `lg:grid-cols-[0.85fr_1.15fr]`, `gap-12`, `pb-22`; the aside is sticky at 100px from `lg` and static below. Steps: 38px solid green circles with white `font-display` digits. Proof card: white, 92x70 photo, text "Dernière édition : {host}, {date}, {n} inscrits."
- Native HTML: `<aside>`, `<ol>`.
- Pages: host.
- Old site reference: `accueillir.html`; `.host-hero`, `.host-layout`, `.steps`, `.proof`.

### HostFunnel (FunnelProgress, FunnelStep, FunnelNav, Recap, SuccessPanel)
- Role: four-step lead form. Client component.
- Steps: 1 Formule (radio choice cards from the offers). 2 L'événement (date with `min` = tomorrow and a help line for non-Saturday dates, optional second date, attendee pills, city select, capacity 10 to 1000, equipment checkbox pills, topics textarea). 3 Votre entreprise (name, sector, tech team size, URL, address). 4 Contact (recap, name, role, email, phone, contact preference pills, message, consent, honeypot).
- Look: white panel `rounded-[20px]`, `shadow-lift`, `p-8` (`px-4.5 py-5.5` below `sm`). Progress: four flexible 6px pill bars, `bg-line`, done = `bg-green`. Legend `font-display` 1.55rem. Nav bar with a top line; ghost button border `line`; primary pushed right; buttons stack full width below `sm`.
- Behavior: "Continuer" validates the step; invalid fields get an invalid style and `aria-invalid`, focus goes to the first one. On step change: bars and `aria-live="polite"` label update ("Étape 1 sur 4 · Formule"), "Retour" hidden on step 1, next label becomes "Envoyer ma demande" on step 4, recap renders, focus moves to the step legend (`tabIndex={-1}`) and the panel scrolls into view. Enter acts as "Continuer". Draft saves to `localStorage` key `msc-host-draft-v1` (consent and honeypot excluded) and restores with the step. `?formule={id}` preselects the offer and opens step 2. While sending the button is disabled and reads "Envoi…". Success shows a green post-it, clears the draft. Delivery chain: JSON POST to `site.form.endpoint`, then a prefilled `mailto:`, then an alert with the LinkedIn link. Capture `utm_*` and the referrer; a filled honeypot ends silently as success.
- Native HTML: `<form noValidate>`, `<fieldset>` and `<legend>` per step.
- Pages: host.
- Old site reference: `assets/js/funnel.js`; `.funnel`, `.progress`, `.choice-card`.

### Form primitives (Field, TextInput, Select, TextArea, ChoiceCard, PillGroup, Pill, ConsentCheckbox, Honeypot, FormAlert, FieldRow)
- `Field`: label (600 `0.93rem`, optional suffix "(facultatif)"), control, help (`0.83rem text-muted`), error (red `0.84rem`, shown when invalid; an empty-versus-format message swap). Controls: full width, `px-3.5 py-3`, `border-[1.5px] border-line`, `rounded-sm`, white. Focus: green border plus the 3px green halo, no outline. Invalid: red border (use `aria-invalid:border-red`). Textarea min 96px, vertical resize.
- `FieldRow`: one column, two from `sm`, `gap-4`.
- `ChoiceCard`: `<label>` around a visually hidden radio; grid `24px 1fr auto`, `border-[1.5px]`, `rounded-card`; checked (`has-checked:`) green border and `#f3faf5` fill with a green-centered dot; keyboard focus draws the green outline on the card (`has-focus-visible:`); below `sm` the price moves under the text.
- `Pill`: `<label>` around a hidden radio or checkbox with a span: `px-4 py-2.5`, `border-[1.5px] border-line`, white, 500 `0.93rem`; checked is `bg-ink text-white`; focus outline on the span (`peer`).
- `ConsentCheckbox`: grid `22px 1fr`, `0.88rem text-ink-soft`, 20px checkbox with `accent-green`; the text cites Moroccan law 09-08.
- `Honeypot`: off-screen wrapper, `aria-hidden`, input `tabIndex={-1}` and `autoComplete="off"`.
- `FormAlert`: hidden until shown, `#fdecec` fill, `text-red-dark`, `rounded-sm`, `role="alert"`.
- `Recap`: `bg-paper` box, `0.86rem`, a definition list in a `max-content 1fr` grid; hidden when empty.
- Old site reference: `.field`, `.pill`, `.consent`, `.hp`, `.form-alert`, `.recap`.

### SponsorForm, SponsorLayout
- Role: single-step sponsor lead form beside a FAQ, inside a dark section. Client.
- Layout: `lg:grid-cols-[0.9fr_1.1fr]`, `gap-12`, `mt-18`; the form panel stays white with ink text, `p-7`; submit button full width "Recevoir le dossier de partenariat".
- Behavior: validates required fields, email and phone on submit (Moroccan `0[5-7]` plus 8 digits, or international `+` or `00` plus 8 to 15 digits). Same invalid, focus, sending and success patterns as the host funnel. Level pills come from the packages plus "En nature" and "À discuter" (checked by default).
- Pages: socrates (`#sponsoring`).
- Old site reference: `.sponsor-layout`, `simpleForm` in `assets/js/pages.js`.

## Page-level notes

- Site and page content come from `content/*.json` through the loaders in `src/content/load.ts`. Titles that contain `<em>` go through `HeroEm`.
- `<body data-page>` is set from `PageId` in `src/app/layout.tsx` (still a TODO per route). Two old rules depended on it: khatam eyebrows on `socrates`, and the zellige corner on the first section of `news`. In the new code pass these as props (`marker="khatam"`, `zellige-corner`) and keep `data-page` for analytics and tests only.
- Contexts that change a component (dark surface, hero, compact) are variants of that component, not selectors on a parent.
