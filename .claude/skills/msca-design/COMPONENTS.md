# MSCA component inventory

Two parts. "Built" lists what exists in `web/src/components/` with its real props and the classes that matter. "To build" lists the remaining components by role, so each page port picks the right one. Tokens are in `TOKENS.md`, Tailwind rules in `TAILWIND.md`.

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
- Props: `variant: "primary" | "ghost"` (default primary), `size: "md" | "sm"` (default md), `className`, plus native `<a>` props when `href` is set, native `<button>` props otherwise (`type` defaults to `button`).
- Renders `next/link` for an internal `href`, a plain `<a>` when `isExternal(href)`, a `<button>` without `href`.
- Classes that matter: pill (`rounded-full`), `border-2 border-transparent`, `font-body text-base leading-none font-semibold no-underline`, `motion-safe:` transition on `translate`, `background-color`, `box-shadow`, `hover:-translate-y-px`, `disabled:opacity-55 disabled:cursor-not-allowed`. Primary: `bg-red text-white` with the red shadow, `hover:bg-red-dark`. Ghost: `border-ink bg-transparent text-ink`, `hover:bg-ink hover:text-white`. Size `sm` repeats `leading-none` after its font size, because `tailwind-merge` drops an earlier `leading-*` when a text size follows.
- Dark surfaces (SoCraTes hero, dark sections, CTA band) need overrides at the call site with `className`: primary without shadow; ghost with white text and border, hover white fill with ink text (green text in the CTA band); inverted primary in the CTA band (white fill, red text). Add these as variants or `className` when the first dark surface is built.
- Old site reference: every page, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-row`.

### Container
`src/components/Container.tsx`. Props: native `<div>` props. Classes: `mx-auto w-[calc(100%-32px)] max-w-wrap`. Wraps the content of every section and the header and footer rows.

### Brand
`src/components/Brand.tsx`. Props: `site`, `line` (text under the name, default `site.tagline`; the footer passes `site.mission`), `size: "md" | "lg"` (logo 44px or 52px), `tone: "light" | "dark"`. A `tv` with slots `root`, `logo`, `name`, `line`. The tagline line is hidden below `sm` (`max-sm:hidden`). The name is `font-display` 600. Light tone hovers to `green-dark`; dark tone is white with `on-dark-muted` line.

### SkipLink
`src/components/SkipLink.tsx`. Props: `href` (default `#main`), `label` (default "Aller au contenu"). Off-screen at `-left-[999px]`, `focus:left-2`, ink background, white text, `z-100`. On the host page use `href="#funnel"` and label "Aller au formulaire".

### SiteHeader and NavToggle
`SiteHeader.tsx` (server): props `site`, `page`. `NavToggle.tsx` (client): props `children` (the nav links), owns the open state.
- Header: `sticky top-0 z-50`, `bg-paper/90` with `backdrop-blur`, `border-b border-line`, row `h-18` inside `Container`. Contains `Brand`, `NavToggle` with the links, and a small header `Button`.
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

### Home hero (placeholder)
`src/app/page.tsx`. Eyebrow, `h1`, lead, two buttons, `zellige-corner` on the section. The two-column grid starts at `lg`. The eyebrow and lead are inline utilities; extract `Eyebrow` and `Lead` when the next section needs them. The collage, post-it and hero note are still to build (see Home hero below).

## To build

Entries are ordered as the port reaches them. "Native HTML" says what to use instead of JS.

### Eyebrow, Lead, SectionHead, SectionFoot
- Role: small red label, intro paragraph, the head block of a section, the centered foot with a button.
- Props: `Eyebrow` (`tone: "default" | "dark"`, `marker: "rule" | "khatam" | "none"`); `Lead` (`tone`); `SectionHead` (`center`, children: eyebrow, `h2` with `<em>`, lead); `SectionFoot`.
- States and variants: eyebrow rule hidden when the head is centered; khatam marker (14px) on SoCraTes pages and the home SoCraTes teaser; on dark surfaces the eyebrow is sage (cream in the SoCraTes hero) and the lead is `on-dark`.
- Responsive: none; head `max-w-[760px]`, `mb-11`.
- Native HTML: `<p>`, `<h2>`.
- Tailwind hints: extract the inline eyebrow classes from `page.tsx` (`before:` rule with `content-['']`).
- Old site reference: all pages; `.eyebrow`, `.lead`, `.section-head`, `.section-foot`.

### Section
- Role: page band. Props: `variant: "default" | "alt" | "dark"`, `tight` (boolean). Renders `<section>` with `Container` inside.
- Variants: `alt` is `bg-sage-soft`; `dark` is `bg-green-deep text-cream` with white `h2`/`h3`, sage eyebrow and emphasis, `on-dark` lead and sage focus ring (set `**:focus-visible:outline-sage`). Padding `py-22`, tight `py-14`. Pages alternate default and alt; at most one or two dark sections per page.
- Old site reference: all pages; `.section`, `.section.alt`, `.section.dark`, `.section.tight`.

### HomeHero, PolaroidCollage, Polaroid
- Role: home hero with a photo collage and a post-it.
- Props: `HomeHero` (`hero` content, optional `note`); `PolaroidCollage` (photos with caption, one post-it); `Polaroid` (`src`, `caption`, `rotation`).
- Layout: two columns from `lg` (`lg:grid-cols-[1.05fr_1fr]`, `gap-12`). Collage is a relative box 480px high (380px below `lg`) with three absolutely positioned white-framed photos (padding 10px, 34px at the bottom, radius 3px, `shadow-lift`) rotated `-3deg`, `4deg`, `-1.5deg`, captions in `font-hand`; a yellow post-it at `5deg` at the top right. Zellige corner on the section.
- Hero note: `home.hero.note`, else "Dernière édition : {date longue} chez {host}, {n} inscrits." from the latest meetup.
- A11y: the collage is decorative (`aria-hidden`, empty `alt`).
- Old site reference: `index.html` hero; `.hero`, `.collage`, `.polaroid`, `.postit`, `.hero-note`.

### PostIt
- Role: the hand-made note. Props: `color: "yellow" | "pink" | "green" | "blue" | "orange"`, `className` (the parent sets rotation and width).
- Look: `font-hand` 1.35rem, line-height 1.15, ink text, square corners, `p-[16px_18px_20px]`, width 170px, post-it shadow, background from `bg-postit-*`.
- Used in: collage, page hero figure, topic walls, success panel (green, 200px, 1.5rem, `-3deg`).
- Old site reference: `.postit` and its color classes.

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

### StatsBand
- Role: key figures band under the hero. Props: `items`.
- Look: `bg-paper-2` with `border-y border-line`, five centered columns from `md`, two columns below with the last item spanning the row; numbers `font-display` green `clamp(1.8rem, 3vw, 2.4rem)`. `<section aria-label="Chiffres clés">`.
- Content: `home.stats`; a `key` reads a derived stat (events, meetups, hosts, average registrations of the last 5 meetups, followers, SoCraTes editions, since).
- Old site reference: `index.html`; `.stats`.

### FormatAgenda
- Role: four numbered photo cards. Props: `steps: { photo, time, title, text }[]`.
- Layout: one column, two from `sm`, four from `lg`; `gap-5`. White cards `rounded-card`, photo 16/10 that zooms on card hover (`group`, `motion-safe:` scale 1.04 over 500ms). Counter `01`, `02` in `font-display` 1.9rem red (a CSS counter or the index), time label `0.78rem` uppercase green.
- Native HTML: `<ol>` of `<li>`.
- Pages: home (`#format`).
- Old site reference: `.agenda`.

### TopicWall
- Role: post-its of past topics; with `board` it sits on a cork board.
- Props: `topics: { text, small }[]`, `board` (boolean), `label`.
- Look: centered wrapping flex, `gap-3.5`; post-its auto width up to 240px, 1.25rem, rotation by index (odd `-2deg`, even `1.5deg`, every third `-0.5deg`), color cycle from `TOKENS.md`; `<small>` Inter `0.7rem`. Board: cork background `#e9dcc3` with dot pattern, 10px `#b58a55` frame, `rounded-card`, inset shadow, left aligned, `px-7 py-9`.
- Content: topics deduplicated case-insensitively across events, newest first. Home: first `home.topics.limit`, small = year. Meetup board: all, small = "year · host".
- Pages: home, meetup.
- Old site reference: `.topic-wall`, `.board`.

### FilterChips
- Role: single-choice event filter. Client component. Props: `options`, `value`, `onChange`, `label`.
- Look: pill, `border-[1.5px] border-line`, white, 500 `0.9rem`; pressed (`aria-pressed="true"`) is `bg-ink text-white`.
- Native HTML: `<div role="group" aria-label>` of `<button aria-pressed>`.
- Pages: home (`#historique`).
- Old site reference: `.filters`, `.chip`.

### FeaturedEvents, FeatureCard
- Role: the three latest meetups with photos. Client for the lightbox trigger.
- Props: `FeatureCard` (`event`, `onOpenPhotos`).
- Layout: one column; from `lg` three columns, `gap-6`; `mb-14`. Card: white, `shadow-card`, `rounded-card`; thumb 16/10 with `cursor-zoom-in`, dark count pill at the bottom right, thumb zoom 1.04 on hover; body with meta line, `h3`, text, `TagList` (max 4), links (bold `0.9rem`, 44px high). Between `sm` and `lg` the card may be a row with a 40 percent thumb (old site did this below 960).
- Native HTML: `<article>`, thumb is a `<button>` with `aria-label="Voir les 6 photos de …"`, links `target="_blank" rel="noopener"`.
- Pages: home.
- Old site reference: `.feature-card`, `.thumb`.

### TagList
- Role: pills of topics. Props: `tags`, `max`. `flex flex-wrap gap-1.5`; pill `bg-paper-2 text-ink-soft rounded-full`, `0.76rem`. Used in feature cards (max 4), timeline (max 6), news.
- Old site reference: `.tags`.

### EventTimeline, YearGroup, TimelineItem, EventBadge
- Role: events grouped by year with a "show all" button. Client component for the button state.
- Props: `EventBadge` (`kind: "meetup" | "socrates" | "codesnack" | "online"`, labels Meetup, SoCraTes, Code Snack, En ligne); `TimelineItem` (`event`).
- Layout: year group is one column; from `sm` a `120px 1fr` grid with a top `border-line`; year `font-display` 2rem green, sticky at 90px from `sm`. Item: white, `border border-line`, `rounded-sm`, grid `92px 1fr auto` from `sm`, stacked below. Title Inter 1.02rem 600. Badge: pill `0.72rem` 700 uppercase, colors from the badge colors in `TOKENS.md`.
- Behavior: shows the first `home.history.limit` events of the active filter; the "more" button shows all, moves focus to the first newly shown item (`tabIndex={-1}`), and disappears when nothing is hidden. Button has `aria-controls` and `aria-expanded`.
- Pages: home (`#historique`).
- Old site reference: `.timeline`, `.year-group`, `.tl-item`, `.badge--*`.

### PhotoGallery, GalleryItem
- Role: masonry of event photos opening the lightbox. Client.
- Props: `photos: { src, caption }[]`, `limit`.
- Layout: CSS columns (`columns-2 sm:columns-3 lg:columns-4`, `gap-2.5`, `gap-3.5` from `sm`); items `rounded-sm`, `cursor-zoom-in`; photo zoom 1.03 on hover; caption overlay with a dark gradient shown on `group-hover` and `group-focus-visible`; explicit green focus ring.
- Behavior: caption "{title} · {date}"; first `home.gallery.limit` shown; the "more" button appends the rest and focuses the first appended item.
- Native HTML: each item is a `<button aria-label="Agrandir : {caption}">`.
- Pages: home (`#galerie`).
- Old site reference: `.gallery`, `.cap`.

### Lightbox
- Role: full-screen photo viewer shared by the gallery, feature cards and articles.
- Use the native `<dialog>` with `showModal()` and `::backdrop` (backdrop `rgba(15,13,12,0.94)`); the dialog needs explicit full-screen utilities because Tailwind removes its default margins. Provide `open(items, index)` through a small context.
- Look: image max height `calc(100vh - 140px)`, `rounded-[6px]`; round 48px translucent buttons (close top right, previous and next centered at the edges, hidden for a single photo); caption "{caption} · 3 / 12".
- Behavior: Escape closes (native), ArrowLeft and ArrowRight step with wraparound, backdrop click closes, body scroll locks, focus goes to close and returns to the trigger. `aria-label="Photo agrandie"`, buttons labelled "Fermer", "Photo précédente", "Photo suivante".
- Pages: home, news.
- Old site reference: `.lightbox`, `.lb-close`.

### LogoWall, LogoTile, LogoSticker, Monogram
- Role: partner logos with a "your logo here" post-it. `LogoWall` takes `compact`.
- Props: `LogoTile` (`company`, `href?`, `role`); `LogoSticker` (`kind: "host" | "sponsor"`, text from `companies.sticker`); `Monogram` (initials of the first two words).
- Layout: centered wrapping flex, `gap-3.5`, fixed-width tiles (168px; compact 112px) so the last row stays centered. Tile: white, `border border-line`, `rounded-card`; logo 84px in a 92px white box; name `0.88rem` 600; role `0.74rem text-muted`. Linked tile hover: `motion-safe:` lift `-translate-y-0.75`, `shadow-lift`, logo opacity 1. Sticker: same footprint, yellow, `rounded-[2px]`, `-2deg` (hover `-0.5deg`), `font-hand` title 1.7rem. On dark: translucent tile, light text.
- Rule: show a logo only when the company has one and consent; an empty `logo` renders `Monogram`. Order by hosted plus sponsored count, descending. The SoCraTes wall shows sponsors only, with their years.
- Native HTML: `<a>` when the company has a link, `<div>` otherwise; sticker is one `<a>` with `aria-labelledby`.
- Pages: home (`#partenaires`), association (compact), socrates.
- Old site reference: `.logo-wall`, `.logo-tile`, `.sticker`, `.monogram`.

### LogoRow
- Role: small row of sponsor logos. Props: `companies`. Centered wrap, `gap-3`, 56px squares, `rounded-xl`, white padding, `border border-line`. Pages: home (sponsor call), socrates (`#sponsoring`).
- Old site reference: `.logo-row`.

### SocratesTeaser, EditionChips, SponsorCall
- Role: dark home section about SoCraTes, with edition chips and a sponsor call box.
- Layout: two columns `md:grid-cols-[1.05fr_0.95fr]`, `gap-14`, inside `Section variant="dark"`. Photo 4/3, `object-position: center 75%`, heavy shadow. Edition chips in two columns: translucent border, year in `font-display` white; text "{year} · {city}" and "1re édition · {n} crafters" (editions oldest first). Sponsor call: `rounded-card`, sage tinted fill and border, `px-6.5 py-6`, contains eyebrow, `h3`, text, `LogoRow`, ghost button. `SponsorCall` also appears on the SoCraTes page with `my-10`.
- Pages: home (`#socrates`), socrates.
- Old site reference: `.socrates`, `.editions`, `.sponsor-call`.

### OfferGrid, OfferCard
- Role: meetup formulas and SoCraTes packages.
- Props: `OfferCard` (`offer`, `highlight`, `tone: "light" | "dark"`, `cta`).
- Layout: one column up to `lg`, max 560px centered; three columns from `lg`, `gap-5.5`, stretch. Card: white, `border-[1.5px] border-line`, `rounded-card`, `px-6.5 py-7`, flex column with the button at the bottom (`mt-auto`). Highlight: green border, `shadow-lift`, a green pill flag on the top edge (`-top-3.25 left-6.5`). Price `font-display` 1.5rem green. `h4` small uppercase `text-muted`. Bullets: 10px rounded squares, green post-it fill with a green border; the "give" list is yellow with a `#c9a400` border. Dark tone: translucent card, sage highlight border and flag, sage price.
- Behavior: the home button links to the host page with `?formule={id}`; SoCraTes packages select the matching level radio in the sponsor form.
- Pages: home (`#offres`), socrates (`#packages`).
- Old site reference: `.offers`, `.offer`, `.flag`, `.give`.

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

### Faq, FaqItem
- Role: question list. Props: `items: { question, answer }[]`, `tone`.
- Native HTML: `<details>` and `<summary>`; no JS. Look: `max-w-[820px]` centered, items separated by `border-line`; summary 600 1.05rem, flex with a green plus at the end (hide the default marker with `list-none` and `[&::-webkit-details-marker]:hidden`); the plus rotates 45 degrees under `group-open:` with a `motion-safe:` transition. Dark: translucent lines, `on-dark` answers, sage plus.
- Pages: home, meetup, socrates.
- Old site reference: `.faq`.

### CtaBand
- Role: green call-to-action block. Props: `variant: "default" | "green"`, title, text, two actions.
- Layout: `bg-green`, `rounded-[22px]`, `px-6 py-10` below `md`, `px-12 py-14` from `md`; one column, then `md:grid-cols-[1.4fr_1fr]`. White `h2`, `#d9efe2` text. Buttons: primary inverted (white fill, red text, hover paper then red-dark), ghost white outline (hover white fill, green text). `green` variant gives the primary green text.
- Pages: home, meetup (green), association.
- Old site reference: `.cta-band`.

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

### Reveal
- Role: fade-in on scroll. Client wrapper or hook.
- Behavior: `IntersectionObserver` with `rootMargin: "0px 0px -60px 0px"`; adds the visible state once and unobserves; without the API, everything is visible. Start at `opacity-0 translate-y-4`, end at rest, `motion-safe:transition` 600ms. Under reduced motion the content is always visible (do not hide it with a plain class that `motion-safe:` cannot undo: gate the hidden state itself with `motion-safe:`).
- Applied to: feature cards, offers, cards, editions, article cards.
- Old site reference: `.reveal`, `initReveal`.

## Page-level notes

- Site and page content come from `content/*.json` through the loaders in `src/content/load.ts`. Titles that contain `<em>` go through `HeroEm`.
- `<body data-page>` is set from `PageId` in `src/app/layout.tsx` (still a TODO per route). Two old rules depended on it: khatam eyebrows on `socrates`, and the zellige corner on the first section of `news`. In the new code pass these as props (`marker="khatam"`, `zellige-corner`) and keep `data-page` for analytics and tests only.
- Contexts that change a component (dark surface, hero, compact) are variants of that component, not selectors on a parent.
