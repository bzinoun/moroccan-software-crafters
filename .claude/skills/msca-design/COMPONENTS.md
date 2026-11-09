# MSCA component inventory

One heading per component. Each entry gives the suggested React name, the classes, a markup skeleton, states, responsive behavior, pages, JS behavior and accessibility. Values are in `assets/css/style.css`; exact numbers are in `TOKENS.md`. Pages: `home` (index.html), `meetup`, `socrates`, `association`, `news` (actualites.html), `host` (accueillir.html). Each page sets `<body data-page="...">`; two selectors depend on it (khatam eyebrows on `socrates`, zellige corner on the first `news` section), so keep `data-page` on `<body>` or on an ancestor of `<main>`.

Most lists are rendered by `assets/js/home.js`, `pages.js` and `funnel.js` from `content/*.json`. Shared helpers live in `assets/js/cms.js` (`window.MSC`). In React, render the same markup from the same JSON at build time.

## Page shell and global behaviors

- **React:** `RootLayout`, `SkipLink`, `FrenchText` (or a content preprocessor).
- Order: `a.skip-link` then `header.site-header` then `main#main` then `footer.site-footer`. On `host` the skip link reads "Aller au formulaire" and targets `#funnel`; `<main>` has no id there.
- `.skip-link`: off-screen at `left: -999px`; `:focus` moves it to `left: 8px`. Ink background, white text, radius 6px.
- `<html lang="fr">`. All UI copy is French.
- French typography (`cms.js frenchSpacing`): in every text node outside `script, style, code, pre, textarea`, a space (normal or no-break) before `? ! : ;` becomes U+202F (narrow no-break space). A MutationObserver applies it to text rendered later. Reproduce it on all rendered strings (attributes and URLs stay unchanged). Static copy also uses `&#8239;` directly.
- `data-cms` / `data-cms-html` bind JSON strings to elements. `data-cms-html` marks headings whose JSON value contains `<em>` (the red emphasized word). Render those as trusted HTML or parse `<em>` into React elements.
- Images: `assets/img/meetups/<name>.jpg`, `assets/img/logos/<file>`, `assets/img/socrates/<id>.png`, `assets/img/logo.png`. Global `img { max-width: 100%; height: auto; display: block; }`.

## Site header and navigation

- **React:** `SiteHeader`, `Brand`, `MainNav`, `NavToggle`.
- **Classes:** `.site-header`, `.wrap`, `.brand`, `.nav-toggle`, `.nav`, `.nav.open`, `.nav-cta`, `.btn`.
- **Skeleton:**
  ```html
  <header class="site-header"><div class="wrap">
    <a class="brand" href="./"><img src="assets/img/logo.png" alt="" width="44" height="44">
      <span><strong>Moroccan Software Crafters</strong><small>Association à but non lucratif</small></span></a>
    <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <a href="meetup.html">Le meetup</a><a href="index.html#historique">Éditions</a><a href="socrates.html">SoCraTes</a>
      <a href="actualites.html">Actualités</a><a href="association.html">L'association</a>
      <a class="btn btn-primary nav-cta" href="accueillir.html">Accueillir un meetup</a>
    </nav>
    <a class="btn btn-primary" href="accueillir.html">Accueillir un meetup</a>
  </div></header>
  ```
- **Per-page CTA** (same in `.nav-cta` and the trailing button): `home`, `meetup`, `association`, `news`: primary "Accueillir un meetup" to `accueillir.html`. `socrates`: primary "Devenir partenaire" to `#sponsoring`. `host`: ghost "Les formules" to `index.html#offres`. On `home` the "Éditions" link is `#historique`.
- **Look:** sticky, `z-index: 50`, translucent paper with blur, 1px bottom line, 72px high. Brand logo 44px, name in Fraunces 1.05rem, tagline `.72rem` muted. Nav links `--ink-soft`, 500, 2px transparent bottom border. Header button smaller (`.6rem 1.05rem`, `.92rem`).
- **States:** link hover `--red`. Active link `aria-current="page"`: ink text, red bottom border. Burger `aria-expanded="true"`: spans morph to a cross (`translateY(±7px) rotate(±45deg)`, middle `opacity: 0`).
- **Active link rule (`initNav`):** `aria-current="page"` goes on a `.nav a` whose href file equals the current file and whose href has no `#`. Home has no matching link, so nothing is active there.
- **Mobile `(max-width: 1024px)`:** `.nav` hidden; `.nav-toggle` shown (44x44). Toggle click toggles `.nav.open` and `aria-expanded`. Open panel: absolute at `top: 72px`, full width, paper background, `--shadow-lift`, column links with 1px line separators, active link red text. Header button hidden; `.nav-cta` shown full width at the bottom of the panel (ghost variant keeps ink border). Click on any nav link closes the panel. `(max-width: 640px)`: `.brand small` hidden.
- **Pages:** all.

## Buttons

- **React:** `Button` with `variant: "primary" | "ghost"`, rendered as `<a>` or `<button>`; `ButtonRow`.
- **Classes:** `.btn`, `.btn-primary`, `.btn-green` (alias of primary, kept for highlighted home offer cards), `.btn-ghost`, `.btn-row`.
- **Look:** pill (`999px`), `padding: .85rem 1.35rem`, 2px transparent border, `600 1rem/1` Inter, inline-flex with `.5rem` gap.
- **Primary:** red fill, white text, red-tinted shadow. Hover `--red-dark`. No shadow inside `.section.dark` and `.hero-dark`.
- **Ghost:** transparent, ink text, ink 2px border. Hover ink fill, white text. On dark surfaces (`.hero-dark`, `.section.dark`, `.cta-band`): white text and border, hover white fill with ink text (`.cta-band`: green text).
- **States:** all buttons hover `translateY(-1px)`. `[disabled]`: `opacity: .55`, `cursor: not-allowed`, no transform. Focus: global green ring.
- **Row:** `.btn-row` flex wrap, gap `.8rem`. Centered rows use inline `style="justify-content:center"` (home partners section).
- **Pages:** all.

## Eyebrow, lead and section head

- **React:** `Eyebrow`, `Lead`, `SectionHead` (prop `center`), `SectionFoot`.
- **Skeleton:** `<div class="section-head [center]"><p class="eyebrow">…</p><h2>… <em>…</em></h2><p class="lead">…</p></div>`.
- **Eyebrow:** uppercase red label with a 22x2px red rule before it. In `.section-head.center` the rule is hidden. On `socrates` pages and in home `#socrates`, the rule becomes a 14px khatam star. On dark surfaces the eyebrow is sage (cream in `.hero-dark`) and the marker uses `currentColor`.
- **Heading emphasis:** `<em>` in `h1`/`h2` is italic red with the sage hand-drawn underline. In `.hero-dark` the em is sage with no underline; in `.section.dark h2` it is sage.
- **Section foot:** `p.section-foot` centered, `margin-top: 36px`, holds a ghost button or a `.btn-row`.
- **Pages:** all.

## Section wrapper

- **React:** `Section` with `variant: "default" | "alt" | "dark"` and `tight` flag; `Container` for `.wrap`.
- **Classes:** `.section` (88px vertical), `.section.tight` (56px), `.section.alt` (sage-soft background), `.section.dark` (green-deep background, cream text, white h2/h3, sage eyebrow and em, `--on-dark` lead, sage focus ring).
- Pages alternate default and `alt` sections; each page has at most one or two `dark` sections.
- **Pages:** all.

## Home hero with polaroid collage

- **React:** `HomeHero`, `PolaroidCollage`, `Polaroid`, `PostIt`.
- **Classes:** `.hero`, `.collage`, `.polaroid.p1|p2|p3`, `.postit`, `.hero-note`.
- **Skeleton:**
  ```html
  <section class="hero"><div class="wrap">
    <div><p class="eyebrow">…</p><h1>… <em>vraiment</em> …</h1><p class="lead">…</p>
      <div class="btn-row"><a class="btn btn-primary">…</a><a class="btn btn-ghost">…</a></div>
      <p class="hero-note" id="hero-note"></p></div>
    <div class="collage" aria-hidden="true">
      <figure class="polaroid p1"><img src="…" alt=""><figcaption>…</figcaption></figure> (p2, p3)
      <div class="postit">…</div></div>
  </div></section>
  ```
- **Look:** grid `1.05fr 1fr`, gap 48px. Collage 480px high; three absolutely positioned white-framed photos (`padding: 10px 10px 34px`, radius 3px, `--shadow-lift`) at `-3deg`, `4deg`, `-1.5deg`, captions in Caveat; yellow post-it top right at `5deg`. Zellige corner top right.
- **JS:** collage photos, captions and post-it text from `home.hero.collage` / `home.hero.postit`. Hero note: `home.hero.note`, else "Dernière édition : {date longue} chez {host}, {n} inscrits." from the latest meetup.
- **Responsive `(max-width: 900px)`:** one column; collage 380px; smaller polaroids; post-it 140px wide, 1.15rem.
- **A11y:** collage is decorative (`aria-hidden="true"`, `alt=""`).
- **Pages:** home.

## Post-it

- **React:** `PostIt` with `color: "yellow" | "pink" | "green" | "blue" | "orange"`.
- **Classes:** `.postit` plus optional `.pink`, `.green`, `.blue`, `.orange`.
- **Look:** Caveat 1.35rem, line-height 1.15, ink text, square corners, `padding: 16px 18px 20px`, width 170px, shadow `0 10px 18px rgba(0,0,0,.12)`. The parent context sets the rotation.
- **Used in:** home collage, page-hero figure, topic walls, success panels (green, 200px, 1.5rem, `-3deg`).

## Inner page hero

- **React:** `PageHero`.
- **Classes:** `.page-hero`, `.facts`, `figure .postit`.
- **Skeleton:** `<section class="page-hero"><div class="wrap"><div>eyebrow, h1 (with em), .lead, ul.facts</div><figure><img …><div class="postit [green]">…</div></figure></div></section>`.
- **Look:** grid `1.1fr .9fr`, gap 48px. Image 4/3, radius 14px, `--shadow-lift`, rotated `1.5deg`. Post-it overlaps bottom left (`left: -14px; bottom: -16px`, `-4deg`). Facts in 2 columns, `margin-top: 32px`. Zellige corner.
- **Responsive `(max-width: 900px)`:** one column.
- **Pages:** meetup (yellow post-it), association (green post-it).

## Dark hero (SoCraTes)

- **React:** `DarkHero`, `StatusChip`.
- **Classes:** `.hero-dark`, `.bg`, `.hero-text`, `.status-chip`, `.facts`.
- **Skeleton:** `<section class="hero-dark"><div class="bg" style="background-image:url(…)"></div><div class="wrap"><div class="hero-text">eyebrow, h1, .lead, .btn-row, p.status-chip</div><ul class="facts"></ul></div></section>`.
- **Look:** green-deep base; photo layer at `opacity: .45`, `saturate(.85)`, `background-position: center 35%`; `::after` vertical gradient to green-deep; sage zellige corner. Padding `120px 0 72px`. Text max 820px. h1 white, larger clamp. Facts glassy (`rgba(255,255,255,.07)` fill), sage numbers.
- **Status chip:** inline-flex pill-ish (radius 18px), translucent green fill, sage border, cream `.92rem` text, `text-wrap: balance`, 14px sage khatam before the text.
- **JS:** `#hero-bg` background from `socrates.hero.photo`; facts from `socrates.hero.facts`.
- **Pages:** socrates.

## Facts

- **React:** `FactList`.
- **Skeleton:** `<ul class="facts"><li><b>21</b><span>événements depuis 2019</span></li>…</ul>`.
- **Look:** 4-column grid, gap 14px; white cards with 1px line, radius 8px; number Fraunces 1.6rem green, `nowrap`; label `.84rem` ink-soft.
- **Responsive:** `(max-width: 700px)` 2 columns. Always 2 columns inside `.page-hero`.
- **JS:** association facts are computed by `MSC.stats` (events count, distinct hosts, SoCraTes editions, LinkedIn followers formatted `fr-FR`).
- **Pages:** meetup, association, socrates (dark variant).

## Stats band

- **React:** `StatsBand`.
- **Skeleton:** `<section class="stats" aria-label="Chiffres clés"><div class="wrap"><ul id="stats"><li><b>…</b><span>…</span></li></ul></div></section>`.
- **Look:** paper-2 band with 1px line top and bottom, 5 centered columns, numbers Fraunces green `clamp(1.8rem, 3vw, 2.4rem)`.
- **Responsive `(max-width: 760px)`:** 2 columns, last item spans the full row.
- **JS:** values from `home.stats`; a `key` reads `MSC.stats` (events, meetups, hosts, `~avg` registrations of the last 5 meetups, followers, socrates, since).
- **Pages:** home.

## Format agenda (numbered photo cards)

- **React:** `FormatAgenda`.
- **Skeleton:** `<ol class="agenda"><li><div class="shot"><img alt="" loading="lazy"></div><div class="body"><span class="time">…</span><h3>…</h3><p>…</p></div></li></ol>`.
- **Look:** 4 columns, gap 20px, white cards radius 14px. Photo 16/10. CSS counter prints `01`, `02`… in Fraunces 1.9rem red above the time. Time label `.78rem` uppercase green.
- **States:** `li:hover` zooms the photo to `scale(1.04)` over .5s.
- **Responsive:** 2 columns at 900px, 1 at 560px.
- **Pages:** home (`#format`).

## Topic wall and cork board

- **React:** `TopicWall` with `board` flag.
- **Skeleton:** `<div class="topic-wall [board]"><div class="postit [pink|green|blue|orange]">Topic<small>2026</small></div>…</div>`.
- **Look:** centered flex wrap, gap 14px, post-its auto width (max 240px, 1.25rem, `padding: 12px 16px 14px`), rotations odd `-2deg`, even `1.5deg`, every 3rd `-.5deg`. `<small>` in Inter `.7rem`. `.board`: cork texture `#e9dcc3` with dot SVG, 10px `#b58a55` frame, radius 14px, inset shadow, left-aligned, `padding: 36px 28px`.
- **JS:** topics deduplicated case-insensitively across events, newest first, colors cycle `["", "pink", "green", "blue", "orange"]`. Home: first `home.topics.limit` (10), small = year, `aria-label` on the wall. Meetup board: all topics, small = "year · host" (host or city).
- **Pages:** home (`#topics`), meetup (`#topic-board`).

## Filter chips

- **React:** `FilterChips`, `Chip`.
- **Skeleton:** `<div class="filters" role="group" aria-label="Filtrer les événements"><button class="chip" data-filter="all" aria-pressed="true">…</button>…</div>`.
- **Look:** pill, 1.5px line border, white, `500 .9rem`. `aria-pressed="true"`: ink fill, white text.
- **JS:** one chip pressed at a time; click sets `aria-pressed` and re-renders the timeline with the default limit.
- **Pages:** home (`#historique`).

## Featured event card

- **React:** `FeaturedEvents`, `FeatureCard`.
- **Skeleton:**
  ```html
  <article class="feature-card reveal">
    <button class="thumb" type="button" data-event="id" aria-label="Voir les 6 photos de …"><img alt="" loading="lazy"><span class="count">6 photos</span></button>
    <div class="body"><p class="meta">24 oct. 2026 · Casablanca · 110 inscrits</p><h3>…</h3><p>…</p><ul class="tags">…</ul>
      <div class="links"><a target="_blank" rel="noopener">Récap LinkedIn</a><a>Page Luma</a></div></div>
  </article>
  ```
- **Look:** 3-column grid (gap 24px, `margin-bottom: 56px`), white cards, `--shadow`, radius 14px. Thumb 16/10, `cursor: zoom-in`, dark count pill bottom right. Links bold `.9rem`, each min 44px high.
- **States:** thumb hover `scale(1.04)`.
- **JS:** first 3 meetups with photos; thumb click opens the lightbox on that event's photos.
- **Responsive:** `(max-width: 960px)` 1 column, card becomes a row (thumb 40% wide); `(max-width: 600px)` card stacks again, thumb 16/10.
- **Pages:** home.

## Tags

- **React:** `TagList`.
- **Skeleton:** `<ul class="tags"><li>TDD</li>…</ul>`.
- **Look:** flex wrap, gap 6px, pills `.76rem` on paper-2, ink-soft text.
- **Pages:** home (feature cards max 4, timeline max 6), news (cards and article).

## Event timeline

- **React:** `EventTimeline`, `YearGroup`, `TimelineItem`, `EventBadge`.
- **Skeleton:**
  ```html
  <div class="timeline" id="timeline">
    <section class="year-group"><h3>2026</h3><ol>
      <li class="tl-item"><time datetime="2026-10-24">oct. 2026</time>
        <div><h4>…</h4><div class="where">Venue, City · 110 inscrits</div><ul class="tags">…</ul></div>
        <span class="badge badge--meetup">Meetup</span></li>
    </ol></section></div>
  <p class="section-foot" id="timeline-more" hidden><button class="btn btn-ghost" type="button" aria-controls="timeline" aria-expanded="false">Voir les {n} événements</button></p>
  ```
- **Look:** year groups `120px 1fr`, 1px top line; year Fraunces 2rem green, sticky at `top: 90px`. Items: grid `92px 1fr auto`, white, 1px line, radius 8px. Title in Inter 1.02rem 600.
- **Badge variants:** `.badge--meetup` (green on `#e6f2ea`), `--socrates` (red-dark on `#fbe4e5`), `--codesnack` (`#7a5b00` on `#fff4cc`), `--online` (`#1f5f80` on `#e3f1fa`). Labels: Meetup, SoCraTes, Code Snack, En ligne. `.72rem` 700 uppercase pill.
- **JS:** shows the first `home.history.limit` (6) events of the active filter, grouped by year. The "more" button shows all and moves focus to the first newly shown item (`tabIndex = -1`). The button stays visible only while items are hidden.
- **Responsive `(max-width: 700px)`:** groups and items stack; year not sticky; badge left-aligned.
- **Pages:** home.

## Photo gallery

- **React:** `PhotoGallery`, `GalleryItem`.
- **Skeleton:** `<div class="gallery"><button type="button" data-i="0" aria-label="Agrandir : {caption}"><img alt="{caption}" loading="lazy"><span class="cap">{caption}</span></button>…</div>` plus a `#gallery-more` section-foot ghost button "Voir toutes les photos".
- **Look:** masonry via CSS columns `columns: 4 240px; column-gap: 14px`; items reset with `all: unset`, radius 8px, `cursor: zoom-in`. Caption overlay with dark bottom gradient, hidden until hover or focus.
- **States:** hover `scale(1.03)`; hover and `:focus-visible` show `.cap`; explicit green focus ring.
- **JS:** all event photos flattened; caption "{title} · {date}". First `home.gallery.limit` (8) shown; "more" appends the rest and focuses the first appended item. Click opens the lightbox on the full list at that index.
- **Responsive `(max-width: 600px)`:** 2 columns, gap 10px.
- **Pages:** home.

## Lightbox

- **React:** `Lightbox` (portal, shared context with `open(items, index)`).
- **Skeleton (created by JS on first open):**
  ```html
  <div id="lightbox" class="lightbox open" role="dialog" aria-modal="true" aria-label="Photo agrandie">
    <button class="lb-close" aria-label="Fermer">×</button><button class="lb-prev" aria-label="Photo précédente">‹</button>
    <figure><img alt="{caption}"><figcaption>{caption}  ·  3 / 12</figcaption></figure>
    <button class="lb-next" aria-label="Photo suivante">›</button></div>
  ```
- **Look:** fixed full screen, `rgba(15,13,12,.94)`, `z-index: 200`. Image max height `calc(100vh - 140px)`, radius 6px. Round 48px translucent buttons (hover brighter); close top right, prev/next vertically centered at the edges.
- **JS:** opens with `.open`, locks `body` scroll, focuses close, restores focus on close. Escape closes, ArrowLeft/ArrowRight step with wraparound, backdrop click closes. Prev/next hidden for a single photo.
- **Pages:** home (featured, gallery), news (article "Les N photos" link).

## Logo wall with post-it sticker

- **React:** `LogoWall` (prop `compact`), `LogoTile`, `LogoSticker`, `Monogram`.
- **Skeleton:**
  ```html
  <div class="logo-wall [compact]">
    <a class="logo-tile" href="{linkedin}" target="_blank" rel="noopener" title="{name} · {role}">  <!-- div when no link -->
      <span class="logo-box [missing]"><img src="assets/img/logos/x.png" alt="{name}" width="120" height="120" loading="lazy"><span class="monogram" aria-hidden="true">AB</span></span>
      <span class="logo-name">{name}</span><span class="logo-role">Hôte de 2 meetups · Partenaire SoCraTes</span></a>
    <a class="logo-tile sticker" href="accueillir.html" aria-labelledby="{id}-t {id}-l" aria-describedby="{id}-d">
      <span class="sticker-title" id="{id}-t">Votre logo ici ?</span><span class="sticker-text" id="{id}-d">…</span>
      <span class="sticker-cta"><span id="{id}-l">Accueillir un meetup</span>&nbsp;<span aria-hidden="true">→</span></span></a>
  </div>
  ```
- **Look:** centered flex wrap, gap 14px, fixed-width tiles (168px) so the last row stays centered. Tile: white, 1px line, radius 14px. Logo 84px in a 92px box, white pad, 1px line, radius 14px, opacity `.92`. Monogram fallback: Fraunces green-dark on `#e6f2ea`. Name `.88rem` 600, role `.74rem` muted.
- **Sticker:** same footprint as a tile, yellow post-it, radius 2px, no border, post-it shadow, `-2deg`. Title Caveat 1.7rem, text `.8rem`, CTA Caveat 1.3rem green-dark underlined.
- **Compact:** 112px tiles, 64px box, 60px logo, no role line, smaller sticker type.
- **On dark:** translucent tile, `#f3eee6` text.
- **States:** linked tile hover/focus `translateY(-3px)`, `--shadow-lift`, border `#d9cfbd`, logo opacity 1. Sticker hover/focus `rotate(-.5deg) translateY(-3px)`. Reduced motion: no tile transition.
- **JS (`renderLogoWall`):** tiles sorted by hosted + sponsored count, descending. Role label from counts. Image `error` (or zero natural width) adds `.missing` to show the monogram (initials of first two words). Sticker data from `companies.sticker.host` or `.sponsor`. SoCraTes wall: sponsors only, role line = years joined with " · ".
- **Pages:** home (`#partenaires`), association (compact), socrates (`#sponsors-wall`).

## Logo row

- **React:** `LogoRow`.
- **Skeleton:** `<div class="logo-row"><img alt="{name}" title="{name}" loading="lazy">… or <span class="monogram" title="{name}">AB</span></div>`.
- **Look:** centered wrap, gap 12px, 56px squares, radius 12px, white pad, 1px line.
- **JS:** company ids from `sponsoring.trust.ids`.
- **Pages:** home (`.sponsor-call` in `#socrates`), socrates (`#sponsoring`).

## SoCraTes teaser and sponsor call

- **React:** `SocratesTeaser`, `EditionChips`, `SponsorCall`.
- **Classes:** `.wrap.socrates`, `.editions`, `.sponsor-call`.
- **Skeleton:** `<section class="section dark" id="socrates"><div class="wrap socrates"><div>eyebrow, h2, .lead, ul.editions, .btn-primary, div.sponsor-call (eyebrow, h3, p, .logo-row, .btn-ghost)</div><img …></div></section>`.
- **Look:** grid `1.05fr .95fr`, gap 56px. Photo 4/3, `object-position: center 75%`, heavy shadow. Edition chips in 2 columns, translucent border, year Fraunces white. Sponsor call: radius 14px, sage-tinted fill and border, `padding: 24px 26px`.
- **JS:** editions = SoCraTes events oldest first, "{year} · {city}" and "1re édition · {n} crafters".
- **Responsive `(max-width: 860px)`:** one column.
- **Pages:** home; `.sponsor-call` also on socrates (inline `margin: 40px 0 56px`).

## Offer cards (meetup formulas and SoCraTes packages)

- **React:** `OfferGrid`, `OfferCard`.
- **Skeleton:**
  ```html
  <div class="offers">
    <article class="offer [highlight] reveal"><span class="flag">Nouveau</span><h3>…</h3><div class="price">… / Sur devis</div>
      <p class="limit">…</p><p class="tagline">…</p>
      <h4>Vous apportez</h4><ul class="give"><li>…</li></ul><h4>Nous apportons</h4><ul><li>…</li></ul>
      <a class="btn btn-green|btn-ghost" href="accueillir.html?formule={id}">Choisir cette formule</a></article>
  </div>
  <p class="offers-note">…</p>
  ```
- **Look:** 3 columns, gap 22px, stretch. Card white, 1.5px line, radius 14px, `padding: 28px 26px`, column flex. Highlight: green border + `--shadow-lift`, `.flag` green pill on the top edge (`top: -13px; left: 26px`). Price Fraunces 1.5rem green. `h4` small uppercase muted Inter. List bullets: 10px rounded squares, post-it green with green border; `ul.give` yellow with `#c9a400` border. Button pushed to the bottom.
- **On dark (`socrates #sponsoring`):** translucent card, sage highlight border, sage flag with green-deep text, sage price, muted sage text.
- **JS:** home offers from `content/offers.json` (highlight uses `btn-green`, link preselects the formula in the host funnel). SoCraTes packages from `sponsoring.packages` ("Ce qui est inclus", `.limit` line, button "Choisir ce niveau" to `#sponsor-form` with `data-level`; click checks the matching radio in the sponsor form).
- **Responsive `(max-width: 960px)`:** one column, max 560px centered, tagline min-height removed.
- **Pages:** home (`#offres`), socrates (`#packages`).

## Card and card grid

- **React:** `CardGrid` (prop `columns: 2 | 3 | 4`), `Card`.
- **Skeleton:** `<div class="cards c3"><article class="card reveal"><h3>…</h3><p>…</p><a class="more" href="…">En savoir plus →</a></article></div>`.
- **Look:** white, 1px line, radius 14px, `padding: 24px 22px`; h3 1.15rem; p `.95rem` ink-soft; `.more` bold `.9rem` link with trailing arrow. On dark: translucent fill and border, `--on-dark` text.
- **Grid logic:** `c3` on desktop uses a 6-track grid where each card spans 2 and an incomplete last row is centered; at 601 to 960px a lone last card spans the row. `c3`/`c4` become 2 columns at 960px, all become 1 column at 600px. External `href` gets `target="_blank" rel="noopener"`.
- **Pages:** meetup (who, propose, rules), socrates (pillars, formats, values, arguments, in-kind card), association (mission, principles, contribute).

## Meetup step rows with tips

- **React:** `StepRows`, `StepRow`, `TipList`.
- **Skeleton:** `<div class="step-row" id="{id}"><div class="step-media"><img alt="" loading="lazy"><span class="time-tag">9 h 30</span></div><div class="step-body"><div class="kicker">…</div><h3>…</h3><p>…</p><ul class="tips"><li>…</li></ul></div></div>`.
- **Look:** 2 equal columns, gap 48px, 44px vertical padding, 1px top line (none on the first). Even rows put media on the right. Image 4/3, radius 14px, lifted. Time tag ink pill top left. Kicker Caveat 1.6rem green; h3 1.8rem. Tips are mini post-its: yellow (even green), Caveat 1.25rem, fit-content, `-.6deg` / `.8deg`.
- **Responsive `(max-width: 860px)`:** one column, media first.
- **Pages:** meetup (`#deroule`).

## Zoom split with numbered list

- **React:** `ZoomSplit`, `NumberedList`.
- **Skeleton:** `<div class="wrap zoom"><img …><div>eyebrow, h2, <ol class="numbered"><li><div><strong>…</strong><span>…</span></div></li></ol></div></div>`.
- **Look:** grid `1fr 1.1fr`, gap 48px; image 4/3 lifted at `-1.5deg`. List items `44px 1fr`; counter in a 40px green-outlined circle, Fraunces, `-6deg`.
- **Responsive `(max-width: 860px)`:** one column.
- **Pages:** meetup (`#marketplace`).

## Open-space laws

- **React:** `OpenSpaceLaws`.
- **Skeleton:** `<ol class="laws"><li><h3>…</h3><p>…</p></li>…<li class="law-main">…</li></ol>`.
- **Look:** 2 columns, gap 20px. Cards white, radius 14px, left padding 78px for a 38px green-outlined counter circle at `-8deg`. h3 italic 1.25rem. `.law-main` (last item, set by JS) spans both columns on green-deep with sage counter, white h3 1.7rem, `padding-right: 15%`.
- **Responsive `(max-width: 760px)`:** one column, law-main `padding-right: 26px`.
- **Pages:** socrates (`#regles`).

## Day strip

- **React:** `DayStrip`.
- **Skeleton:** `<ol class="days"><li><span class="day">Jeudi</span><h3>…</h3><p>…</p></li></ol><p class="days-note">…</p>`.
- **Look:** one bordered white block, radius 14px, 4 cells divided by 1px lines. Day name Caveat 1.7rem green.
- **Responsive:** 2x2 at 900px, stacked at 560px (dividers switch to top borders).
- **Pages:** socrates (`#deroule`).

## Edition cards

- **React:** `EditionGrid`, `EditionCard`.
- **Skeleton:** `<article class="edition reveal"><div class="cover"><img …> or <span class="yr">2025</span><span class="yr-badge">4e édition</span></div><div class="body"><h3>2025 · City</h3><span class="where">Venue · Dates</span><div class="nums"><div><b>50</b><span>crafters</span></div><div><b>6</b><span>partenaires</span></div></div><p>…</p></div></article>`.
- **Look:** 4 columns, gap 20px. Cover 4/3: without a photo, sage zellige pattern on green-deep with a radial vignette and the year inside a double khatam star (Fraunces, cream). `.yr-badge` yellow post-it label top left at `-4deg`. Numbers Fraunces 1.4rem green.
- **Responsive:** 2 columns at 960px, 1 at 560px.
- **Pages:** socrates (`#editions`).

## SoCraTes family grid

- **React:** `FamilyGrid`.
- **Skeleton:** `<ul class="family"><li><img src="assets/img/socrates/{id}.png" alt="" loading="lazy"><b>{name}</b><span>{country}</span></li></ul>`.
- **Look:** `repeat(auto-fill, minmax(120px, 1fr))`, gap 14px; centered white tiles, 72px logo.
- **Pages:** socrates (`#famille`).

## History timeline (association)

- **React:** `HistoryTimeline`.
- **Skeleton:** `<ol class="history"><li><span class="yr">2019</span><div><h3>…</h3><p>…</p></div></li></ol>`.
- **Look:** vertical 2px line at `left: 70px`; each item `56px 1fr`, gap 36px; red-ringed paper dot (14px, 3px red border) on the line; year right-aligned Fraunces 1.5rem green.
- **Responsive `(max-width: 600px)`:** line at 61px, columns `48px 1fr`, gap 28px, year 1.15rem.
- **Pages:** association (`#histoire`).

## Article cards and list

- **React:** `ArticleGrid`, `ArticleCard` (prop `lead`).
- **Skeleton:** `<a class="article-card [lead-card] reveal" href="actualites.html?a={slug}"><div class="cover"><img alt="" loading="lazy"></div><div class="body"><p class="meta"><b>Récap</b>24 octobre 2026</p><h3>…</h3><p>…</p><ul class="tags">…</ul></div></a>`.
- **Look:** 3 columns, gap 24px; whole card is a link, white, `--shadow`, radius 14px. Cover 16/10 on paper-2. Kind label uppercase green `.72rem`. First (newest) card is `.lead-card`: full row, horizontal, cover 55% wide, h3 1.9rem, body padding `32px 34px`.
- **States:** hover `translateY(-3px)` and `--shadow-lift`.
- **Responsive:** 2 columns at 960px (lead card stacks, cover 16/9), 1 at 600px.
- **Pages:** news (list view).

## Article detail and prose

- **React:** `ArticleView`, `Prose`.
- **Skeleton:** `<article class="article"><a class="back" href="actualites.html">← Toutes les actualités</a><p class="meta"><b>{kind}</b>{date}</p><h1>…</h1><p class="lead">…</p><div class="cover"><img alt=""></div><div class="prose">…</div><ul class="tags">…</ul><div class="links">…</div></article>`.
- **Look:** max 760px centered. Cover radius 14px, lifted, image max 520px high. `.links` bold row with top line. Prose 1.08rem/1.7; h2 1.6rem; h3 1.5rem; lists indented 1.3rem; blockquote with 3px sage left rule in Fraunces italic 1.25rem; code on paper-2; links underlined (offset 3px).
- **JS:** current site uses `?a={slug}` on the same page and hides `#news-head` and the list. Markdown subset (`MSC.md`): `#`/`##`/`###` become h2/h3/h4, `-`/`*` lists, numbered lists, `>` quotes, `**bold**`, `*italic*`, `` `code` ``, links (open in a new tab). "Les N photos" link opens the lightbox on the linked event.
- **Pages:** news (detail view).

## FAQ accordion

- **React:** `Faq`, `FaqItem`.
- **Skeleton:** `<div class="faq"><details><summary>Question</summary><p>Answer</p></details></div>`.
- **Look:** max 820px centered; items separated by 1px line; summary 600 1.05rem, flex with a green `+` at the end (marker hidden). Open: `+` rotates 45deg. On dark: translucent lines, `--on-dark` answers, sage `+`.
- **Behavior:** native `<details>`; no JS.
- **Pages:** home (`#faq`), meetup (`#faq`), socrates (sponsor FAQ beside the form).

## CTA band

- **React:** `CtaBand` (prop `variant: "default" | "green"`).
- **Skeleton:** `<div class="cta-band [green]"><div><h2>…</h2><p>…</p></div><div class="actions"><a class="btn btn-primary">…</a><a class="btn btn-ghost">…</a></div></div>` inside a `.section` or `.section.tight`.
- **Look:** green block, radius 22px, `padding: 56px 48px`, grid `1.4fr 1fr`. White h2, `#d9efe2` text. Primary button inverted: white fill with red text (hover paper, red-dark). Ghost: white outline, hover white fill green text. `.green` variant: same background, primary text green instead of red.
- **Responsive `(max-width: 800px)`:** one column, `padding: 40px 24px`, actions left.
- **Pages:** home (default), meetup (green), association (default).

## Site footer

- **React:** `SiteFooter`.
- **Skeleton:** `<footer class="site-footer"><div class="wrap"><a class="brand" href="./"><img alt="" width="52" height="52"><span><strong>…</strong><small>{mission}</small></span></a><nav aria-label="Liens de pied de page" id="footer-nav"><a>…</a></nav><p class="legal">…</p></div></footer>`.
- **Look:** green-deep, `.92rem` `--on-dark` text, flex wrap space-between, gap 32px. Brand white, 52px logo, muted sage tagline. Nav links cream, no underline; hover white and underlined. Legal line full width with translucent top border, `.84rem`.
- **JS:** nav links from `site.footer.links` (static HTML on home); `http(s)` links open in a new tab.
- **Pages:** all.

## Host page layout

- **React:** `HostHero`, `HostLayout`, `HostAside`, `ProcessSteps`, `ProofCard`.
- **Skeleton:** `<section class="host-hero"><div class="wrap">eyebrow, h1, .lead</div></section><div class="wrap host-layout"><aside class="host-aside"><ol class="steps"><li><b>1</b><div><strong>…</strong><span>…</span></div></li></ol><div class="proof"><img …><p id="proof-text">…</p></div><p>…</p></aside><div class="funnel" id="funnel">…</div></div>`.
- **Look:** host hero with zellige corner, `padding: 56px 0 24px`. Layout `.85fr 1.15fr`, gap 48px, bottom padding 88px. Aside sticky at `top: 100px`. Step numbers: 38px solid green circles, white Fraunces digits. Proof: white card with a 92x70 photo.
- **JS:** proof text "Dernière édition : {host}, {date}, {n} inscrits." from the latest meetup.
- **Responsive `(max-width: 960px)`:** one column, aside not sticky.
- **Pages:** host.

## Host funnel (4-step form)

- **React:** `HostFunnel`, `FunnelProgress`, `FunnelStep`, `FunnelNav`, `Recap`, `SuccessPanel`, plus the form primitives below.
- **Skeleton:**
  ```html
  <div class="funnel" id="funnel"><form id="host-form" novalidate>
    <div class="progress" aria-hidden="true"><span class="done"></span><span></span><span></span><span></span></div>
    <p class="progress-label" aria-live="polite">Étape 1 sur 4 · Formule</p>
    <fieldset class="step" data-step="1"><legend>…</legend><p class="hint">…</p>…</fieldset>  <!-- steps 2 to 4 hidden -->
    <div class="form-alert" role="alert"></div>
    <div class="funnel-nav"><button type="button" class="btn btn-ghost" id="prev">Retour</button><button type="button" class="btn btn-primary" id="next">Continuer</button></div>
  </form>
  <div class="success" hidden tabindex="-1"><div class="postit green">…</div><h2>…</h2><p>…</p><p><a class="btn btn-ghost">…</a></p></div></div>
  ```
- **Look:** white panel, radius 20px, `--shadow-lift`, `padding: 32px`. Progress: 4 flexible 6px pill bars, `--line`, `.done` green. Legend Fraunces 1.55rem. Nav bar with top line; ghost button border is `--line`; primary pushed right.
- **Steps:** 1 Formule (`.choice-cards` radios from `offers.json`). 2 L'événement (date with `min` = tomorrow and a help line that flags non-Saturday dates, optional alternative date, attendee pills, city select, capacity 10 to 1000, equipment checkbox pills, topics textarea). 3 Votre entreprise (name, sector, tech team size, URL, address). 4 Contact (recap, name, role, email, phone, contact preference pills, message, consent, honeypot).
- **JS (`funnel.js`):** "Continuer" validates the current step; invalid fields get `.field.invalid` and `aria-invalid="true"`, focus goes to the first invalid control. On step change: bars and label update, "Retour" hidden on step 1, next label becomes "Envoyer ma demande" on step 4, recap renders, focus moves to the step `legend` (`tabindex="-1"`) and the funnel scrolls into view smoothly. Enter submits as "Continuer". Draft auto-saves to `localStorage` key `msc-host-draft-v1` (consent and honeypot excluded) and restores, step included. `?formule={id}` preselects the offer and opens step 2. While sending: button disabled, label "Envoi…". Success hides the form, shows and focuses `.success`, clears the draft. Delivery uses `MSC.sendLead` (JSON POST endpoint, else `mailto:`, else an alert with a LinkedIn link).
- **Responsive:** `(max-width: 600px)` padding `22px 18px`; `(max-width: 480px)` nav buttons stack full width.
- **Pages:** host.

## Form primitives

- **React:** `Field`, `TextInput`, `Select`, `TextArea`, `ChoiceCard`, `PillGroup`, `Pill`, `ConsentCheckbox`, `Honeypot`, `FormAlert`, `FieldRow`.
- **Field:** `<div class="field [invalid]"><label for="x">Label <span class="opt">(facultatif)</span></label><input …><p class="help">…</p><p class="error" [data-empty="…"]>…</p></div>`. Label 600 `.93rem`; `.label` span for group labels referenced by `aria-labelledby`. Inputs full width, `.75rem .9rem` padding, 1.5px line border, radius 8px, white. Focus: green border + 3px green halo, no outline. Invalid: red border, `.error` shown (red `.84rem`). `.help` muted `.83rem`. Textarea min 96px, vertical resize. `.error[data-empty]` swaps between the empty message and the format message.
- **Row:** `.row` 2 columns, gap 16px; 1 column at 600px.
- **Choice card:** `<label class="choice-card"><input type="radio" name="formule" required><span class="dot"></span><span><strong>…</strong><small>…</small></span><span class="price">…</span></label>`. Grid `24px 1fr auto`, 1.5px border, radius 14px. Input visually hidden. Hover border `#cbbfa9`. Checked (`:has(input:checked)`): green border, `#f3faf5` fill, dot with green center. Keyboard focus: green outline on the card. At 520px the price moves under the text.
- **Pills:** `<div class="pills" role="radiogroup|group" aria-labelledby="…"><label class="pill"><input type="radio|checkbox"><span>…</span></label></div>`. Pill span: `.55rem 1rem`, 1.5px line border, white, `500 .93rem`. Checked: ink fill, white text. Focus: green outline on the span.
- **Consent:** `label.consent` grid `22px 1fr`, `.88rem` ink-soft; 20px checkbox with `accent-color: var(--green)`. Text cites law 09-08.
- **Honeypot:** `.hp` off-screen with `aria-hidden="true"`, input `tabindex="-1"`, `autocomplete="off"`. A filled honeypot ends silently as success.
- **Form alert:** `.form-alert` hidden until `.show`; `#fdecec` fill, red-dark text, radius 8px, `role="alert"`.
- **Recap:** `.recap` paper box, `.86rem`, `dl` grid `max-content 1fr`; empty recap hidden.
- **Success:** centered; green post-it 200px at `-3deg`; text max 46ch.

## Sponsor form (single step)

- **React:** `SponsorForm`, `SponsorLayout`.
- **Skeleton:** `<div class="sponsor-layout"><div><h3>…</h3><p class="lead">…</p><div class="faq">…</div></div><div class="funnel" id="sponsor-funnel"><form id="sponsor-form" novalidate>fields, level pills, consent, honeypot, .form-alert, <button type="submit" class="btn btn-primary">Recevoir le dossier de partenariat</button></form><div class="success" hidden tabindex="-1">…</div></div></div>`.
- **Look:** grid `.9fr 1.1fr`, gap 48px, inline `margin-top: 72px`; funnel padding 28px; button full width. Sits in `.section.dark`, the funnel stays white with ink text.
- **JS (`pages.js simpleForm`):** validates required fields, email and phone (Moroccan `0[5-7]` + 8 digits, or international `+`/`00` + 8 to 15 digits) on submit; same invalid, focus, sending and success patterns as the host funnel. Level pills generated from packages plus "En nature" and "À discuter" (last one checked by default).
- **Responsive `(max-width: 900px)`:** one column.
- **Pages:** socrates (`#sponsoring`).

## Reveal on scroll

- **React:** `Reveal` wrapper or a `useReveal` hook that adds `in`.
- **Classes:** `.reveal`, `.reveal.in`.
- **Behavior (`initReveal`):** IntersectionObserver with `rootMargin: "0px 0px -60px 0px"` adds `.in` once and unobserves. Without IntersectionObserver every element gets `.in`. Reduced motion: always visible, no transition.
- **Applied to:** `.feature-card`, `.offer`, `.card`, `.edition`, `.article-card`.
