# MSCA design tokens

Source of truth: `assets/css/style.css`. Every value below is copied verbatim from it. When this file and the stylesheet differ, the stylesheet wins; update this file.

## Color custom properties (`:root`)

| Property | Value | Role |
|---|---|---|
| `--red` | `#c1272d` | Main accent: `.btn-primary` fill, eyebrow text and rule, `h1 em` / `h2 em`, nav hover and active underline, agenda step numbers, history dots, form errors, `.field.invalid` border |
| `--red-dark` | `#9b1c22` | `.btn-primary:hover`, `.badge--socrates` text, `.form-alert` text |
| `--green` | `#1b6b3a` | Links, focus ring, data numbers (`.facts b`, `.stats b`, prices, years), `.cta-band` background, `.offer.highlight` border, checked inputs, progress bars, numbered circles |
| `--green-dark` | `#14532e` | `a:hover`, monogram text, `.badge--meetup` text, `.sticker-cta` |
| `--green-deep` | `#0f3f23` | Dark surfaces: `.hero-dark`, `.section.dark`, `.site-footer`, `.law-main`, edition cover |
| `--cream` | `#f3eedf` | Text on dark surfaces (hero-dark, `.section.dark`, footer nav links, edition year) |
| `--sage` | `#a9bba3` | Accent on dark (em in dark headings, eyebrows, prices, flags, focus ring on dark), hand-drawn underline stroke, blockquote rule, khatam glyph |
| `--sage-soft` | `#e1e8df` | `.section.alt` background |
| `--on-dark` | `#d3dccf` | Body text on dark (`.section.dark .lead`, card p, faq p, footer text) |
| `--on-dark-muted` | `#b9c6b4` | Secondary text on dark (footer small/legal, offer tagline/limit/h4) |
| `--ink` | `#1d1b19` | Body text, ghost button border, pressed chip and pill fill, `.time-tag` fill, skip-link |
| `--ink-soft` | `#4b4742` | Lead text, card body text, nav links |
| `--muted` | `#6a645c` | Meta text, hints, help, notes |
| `--paper` | `#fbf7f0` | Page background (`body`), mobile nav panel, recap box, history dot fill |
| `--paper-2` | `#f3ece1` | `.stats` band, image placeholders, `.tags li`, inline `code` |
| `--card` | `#ffffff` | Card surfaces |
| `--line` | `#e4dbcd` | Every 1px border and divider, progress track |
| `--postit-yellow` | `#ffe774` | Default post-it, sticker tile, tips, `.yr-badge`, `ul.give` bullet |
| `--postit-pink` | `#ffb3cf` | `.postit.pink` |
| `--postit-green` | `#b9eba0` | `.postit.green`, offer bullet, even tips |
| `--postit-blue` | `#a9dcf5` | `.postit.blue` |
| `--postit-orange` | `#ffc98a` | `.postit.orange` |

Post-it color cycle used by JS for topic walls: `["", "pink", "green", "blue", "orange"]` (index modulo 5; `""` is yellow).

### Literal colors in the stylesheet (port them verbatim, same selectors)

| Value | Where |
|---|---|
| `#fff` | Text on red/green/ink buttons, polaroid frame, input background, `.hero-dark h1`, `.section.dark h2/h3` |
| `rgba(251, 247, 240, .9)` | `.site-header` background (with `backdrop-filter: saturate(1.4) blur(10px)`) |
| `rgba(193, 39, 45, .28)` | `.btn-primary` shadow tint |
| `#e6f2ea` / `#fbe4e5` / `#fff4cc` / `#e3f1fa` | Badge backgrounds: meetup / socrates / codesnack / online |
| `#7a5b00` / `#1f5f80` | Badge text: codesnack / online |
| `#e6f2ea` | Monogram background |
| `#e9dcc3`, `#b58a55`, `#c9b48f` | Cork board: background, 10px frame, dot pattern fill |
| `#d9efe2` | `.cta-band p` |
| `#e4ddd2` | `.hero-dark .lead` |
| `#cfc7bb` | `.hero-dark .facts span` |
| `#f3eee6`, `#bdb4a7` | `.section.dark .logo-tile` text, `.section.dark .logo-role` |
| `#e8e2d9` | Lightbox caption |
| `rgba(15, 13, 12, .94)` | Lightbox backdrop |
| `rgba(29, 27, 25, .78)` | Photo count pill on `.feature-card .thumb` |
| `#d9cfbd` | `a.logo-tile:hover` border |
| `#cbbfa9` | `.choice-card:hover` border |
| `#b9ad99` | `.choice-card .dot` border |
| `#f3faf5` | `.choice-card` checked background |
| `#c9a400` | `ul.give` bullet border |
| `#fdecec` | `.form-alert` background |
| `rgba(255, 255, 255, .05 / .06 / .07)` | Card, logo tile, facts fill on dark |
| `rgba(255, 255, 255, .14 / .15 / .16)` | Borders on dark |
| `rgba(15, 63, 35, .85)`, `rgba(169, 187, 163, .55)` | `.status-chip` fill and border |
| `rgba(169, 187, 163, .1)`, `rgba(169, 187, 163, .35)` | `.sponsor-call` fill and border |

## Fonts

| Property | Value | Use |
|---|---|---|
| `--font-display` | `"Fraunces", Georgia, serif` | h1 to h4, big numbers, prices, legends, blockquote, brand name |
| `--font-body` | `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif` | Body, UI, buttons, inputs, `.tl-item h4`, `.offer h4` |
| `--font-hand` | `"Caveat", "Comic Sans MS", cursive` | Post-its, polaroid captions, `.kicker`, `.days .day`, sticker title and CTA, tips, `.yr-badge` |
| (inline) | `ui-monospace, SFMono-Regular, Menlo, monospace` | `.prose code` only |

Loading (every page `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Loaded faces: Caveat 500, 600. Fraunces roman 500, 600 and italic 500, optical size axis 9..144. Inter 400, 500, 600, 700. `display=swap`. In Next.js, `next/font/google` with the same families, weights, styles and the `opsz` axis gives the same faces; bind its CSS variables to `--font-display`, `--font-body`, `--font-hand` so the stylesheet stays unchanged.

## Type scale

Base: `body { font-size: 17px; line-height: 1.6; color: var(--ink); -webkit-font-smoothing: antialiased; }`.

Headings (global): `h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 600; line-height: 1.12; margin: 0 0 .5em; letter-spacing: -.01em; }`. `p { margin: 0 0 1em; }`.

| Role | Size | Other |
|---|---|---|
| `h1` | `clamp(2.3rem, 5vw, 3.9rem)` | |
| `.hero-dark h1` | `clamp(2.6rem, 6vw, 4.8rem)` | `#fff` |
| `.article h1` | `clamp(2rem, 4vw, 3rem)` | |
| `h2` | `clamp(1.8rem, 3.4vw, 2.6rem)` | |
| `h3` | `1.3rem` | Many components override (1.15rem to 1.9rem) |
| `h4` | `1.05rem` | |
| `h1 em`, `h2 em` | inherit | italic, `var(--red)`, sage hand-drawn underline (see Signature graphics) |
| `.lead` | `1.15rem` | `var(--ink-soft)`, `max-width: 60ch` |
| `.eyebrow` | `.8rem` | 600, `letter-spacing: .08em`, uppercase, `var(--red)`, 22x2px red rule before |
| `.btn` | `font: 600 1rem/1 var(--font-body)` | header button `.92rem` |
| `.nav a` | `.95rem` | 500 |
| `.prose` | `1.08rem` | `line-height: 1.7` |
| `.prose blockquote` | `1.25rem` | Fraunces italic |
| Big numbers | `.facts b 1.6rem`, `.stats b clamp(1.8rem, 3vw, 2.4rem)`, `.agenda` counter `1.9rem`, `.offer .price 1.5rem`, `.history .yr 1.5rem`, `.edition .nums b 1.4rem` | Fraunces 600, `var(--green)` (agenda counter `var(--red)`) |
| Hand font | `.postit 1.35rem`, `.polaroid figcaption 1.15rem`, `.kicker 1.6rem`, `.days .day 1.7rem`, `.sticker-title 1.7rem`, `.tips li 1.25rem`, `.yr-badge 1.3rem` | |
| Small UI | `.72rem` to `.9rem` | badges `.72rem` 700 uppercase `.05em`; meta `.8rem` to `.82rem` `var(--muted)` |

## Spacing

There are no spacing tokens. Reuse these exact values.

| Context | Value |
|---|---|
| `.section` | `padding: 88px 0` |
| `.section.tight` | `padding: 56px 0` |
| `.hero`, `.page-hero` | `padding: 64px 0 40px` |
| `.hero-dark` | `padding: 120px 0 72px` |
| `.host-hero` | `padding: 56px 0 24px` |
| `.stats` | `padding: 28px 0` |
| `.site-footer` | `padding: 56px 0 40px` |
| News first section | inline `padding-top: 56px` |
| `.section-head` | `max-width: 760px; margin-bottom: 44px` |
| `.section-foot` | `margin-top: 36px` |
| Two-column splits | `gap: 48px` (hero, page-hero, step-row, zoom, host-layout, sponsor-layout); `.socrates` `56px` |
| Grid gaps in use | `6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 32px`; `.btn-row` `.8rem` |

## Containers and widths

| Item | Value |
|---|---|
| `--wrap` | `1180px` |
| `.wrap` | `width: min(var(--wrap), 100% - 32px); margin-inline: auto;` (16px side gutter) |
| Header height | `72px` (`.site-header .wrap`) |
| `html` | `scroll-behavior: smooth; scroll-padding-top: 84px;` |
| Sticky offsets | `.year-group h3 top: 90px`, `.host-aside top: 100px` |
| Text measures | `.lead 60ch`, `.hero-dark .lead 64ch`, `.history p 62ch`, `.success p 46ch` |
| Block maxima | `.hero-dark .hero-text 820px`, `.faq 820px`, `.article 760px`, `.section-head 760px`, offers stacked `560px`, lightbox figure `min(1100px, 100%)` |

## Radii

| Value | Where |
|---|---|
| `--radius: 14px` | Cards, offers, editions, feature and article cards, images in heroes and splits, logo tiles, `.sponsor-call`, `.proof`, `.choice-card`, `.days`, logo-box img (literal `14px`) |
| `--radius-sm: 8px` | Facts, tl-item, inputs, gallery items, recap, form alert, `.editions li`, proof img (literal `8px`) |
| `999px` | Buttons, chips, pills, tags, badges, flags, count pill, time-tag, progress bars |
| `22px` | `.cta-band` |
| `20px` | `.funnel` |
| `18px` | `.status-chip` |
| `12px` | `.logo-row` img/monogram |
| `6px` | Skip link, lightbox image |
| `4px` | Focus outline, `.prose code` |
| `3px` | Polaroid, offer bullet squares |
| `2px` | Logo sticker post-it |
| `50%` | Numbered circles, choice dot, lightbox buttons, history dots |
| none | `.postit` (square corners) |

## Shadows

| Value | Where |
|---|---|
| `--shadow: 0 1px 2px rgba(29, 27, 25, .06), 0 8px 24px rgba(29, 27, 25, .08)` | `.feature-card`, `.article-card` at rest |
| `--shadow-lift: 0 2px 4px rgba(29, 27, 25, .08), 0 18px 40px rgba(29, 27, 25, .14)` | Hover lift, polaroids, hero/step/zoom images, funnel, mobile nav panel, `.offer.highlight`, article cover |
| `0 6px 18px rgba(193, 39, 45, .28)` | `.btn-primary` (removed on dark sections and in `.cta-band`) |
| `0 10px 18px rgba(0, 0, 0, .12)` | `.postit`, logo sticker |
| `0 6px 12px rgba(0, 0, 0, .08)` | `.tips li` |
| `0 4px 10px rgba(0, 0, 0, .2)` | `.yr-badge` |
| `0 20px 50px rgba(0, 0, 0, .35)` | `.socrates > img` (home dark section) |
| `inset 0 0 40px rgba(0, 0, 0, .12)` | `.topic-wall.board` |
| `0 0 0 3px rgba(27, 107, 58, .15)` | Input focus ring |

## Focus

`:focus-visible { outline: 3px solid var(--green); outline-offset: 2px; border-radius: 4px; }`. On dark surfaces (`.section.dark`, `.hero-dark`, `.site-footer`) `outline-color: var(--sage)`. Inputs replace the outline with border `var(--green)` plus the 3px focus shadow. Hidden radio/checkbox controls forward focus to their visual (`.choice-card:has(input:focus-visible)`, `.pill input:focus-visible + span`).

## Breakpoints (exact media queries)

| Query | Changes |
|---|---|
| `(max-width: 1024px)` | Burger nav; header button hidden; `.nav-cta` shown in panel |
| `(max-width: 960px)` | `.featured` 1 col with row cards; `.offers` 1 col max 560px; `.cards.c3`/`.c4` 2 cols; `.edition-grid` 2 cols; `.article-grid` 2 cols, lead card stacks; `.host-layout` 1 col, aside static |
| `(min-width: 961px)` | `.cards.c3` 6-track grid with centered last row |
| `(min-width: 601px) and (max-width: 960px)` | `.cards.c3` last odd card spans full row |
| `(max-width: 900px)` | `.hero` and `.page-hero` 1 col, collage shrinks; `.agenda` 2 cols; `.days` 2 cols; `.sponsor-layout` 1 col |
| `(max-width: 860px)` | `.socrates`, `.step-row`, `.zoom` 1 col |
| `(max-width: 800px)` | `.cta-band` 1 col, `padding: 40px 24px`, actions left |
| `(max-width: 760px)` | `.stats` 2 cols, last item full row; `.laws` 1 col |
| `(max-width: 700px)` | `.facts` 2 cols; `.year-group` and `.tl-item` stack |
| `(max-width: 640px)` | `.brand small` hidden |
| `(max-width: 600px)` | `.gallery` 2 columns; `.feature-card` column; all `.cards` 1 col; `.history` narrower; `.article-grid` 1 col; `.row` 1 col; `.funnel` `padding: 22px 18px` |
| `(max-width: 560px)` | `.agenda`, `.days`, `.edition-grid` 1 col |
| `(max-width: 520px)` | `.choice-card` price drops under text |
| `(max-width: 480px)` | `.funnel-nav` column, buttons full width |
| `(prefers-reduced-motion: reduce)` | `html` scroll auto; `.logo-tile` no transition; `.reveal` visible, no transition |

## Motion

| Element | Transition | Effect |
|---|---|---|
| `.btn` | `transform .15s ease, background-color .15s ease, box-shadow .15s ease` | hover `translateY(-1px)` |
| `.nav-toggle span` | `transform .2s ease, opacity .2s ease` | burger to cross |
| `.agenda .shot img` | `transform .5s ease` | `li:hover` `scale(1.04)` |
| `.feature-card .thumb img` | `transform .4s ease` | hover `scale(1.04)` |
| `.gallery img` | `transform .4s ease` | hover `scale(1.03)` |
| `.gallery .cap` | `opacity .2s` | 0 to 1 on hover/focus |
| `.logo-tile` | `transform .2s, box-shadow .2s, border-color .2s` | `translateY(-3px)` + `--shadow-lift` |
| `.logo-box img` | `opacity .25s` | `.92` to `1` |
| `.article-card` | `transform .2s, box-shadow .2s` | `translateY(-3px)` + `--shadow-lift` |
| `.faq summary::after` | `transform .2s` | `+` rotates 45deg when open |
| Inputs | `border-color .15s, box-shadow .15s` | |
| `.choice-card` | `border-color .15s, background .15s` | |
| `.progress span` | `background .3s` | |
| `.reveal` | `opacity .6s ease, transform .6s ease` | from `opacity: 0; transform: translateY(16px)` to `.in` |

Static rotations (part of the look): polaroids `-3deg`, `4deg`, `-1.5deg`; collage post-it `5deg`; page-hero image `1.5deg`, its post-it `-4deg`; zoom image `-1.5deg`; topic post-its odd `-2deg`, even `1.5deg`, every 3rd `-.5deg`; logo sticker `-2deg` (hover `-.5deg`); tips `-.6deg` / even `.8deg`; numbered circles `-6deg`; law circles `-8deg`; `.yr-badge` `-4deg`; success post-it `-3deg`.

## Layering (z-index)

Skip link `100`, sticky header `50`, lightbox `200`, collage polaroids `2`/`4`/`3` and post-it `5`, zellige corner `-1` (inside `isolation: isolate`), `.hero-dark` zellige `1` and `.wrap` `1`.

## Signature graphics (custom properties and inline SVG)

- `--khatam`: `polygon(50% 0%, 64.6% 14.6%, 85.4% 14.6%, 85.4% 35.4%, 100% 50%, 85.4% 64.6%, 85.4% 85.4%, 64.6% 85.4%, 50% 100%, 35.4% 85.4%, 14.6% 85.4%, 14.6% 64.6%, 0% 50%, 14.6% 35.4%, 14.6% 14.6%, 35.4% 14.6%)`. Eight-point star used as `clip-path`. SoCraTes content only.
- `--zellige-green` / `--zellige-sage`: 40x40 SVG tile data URIs (stroke `#1b6b3a` at opacity `.28`, or `#a9bba3` at opacity `.4`, stroke-width `1.1`). Copy the full strings from `style.css` lines 217 and 218.
- Zellige corner: `::before` on `.hero`, `.page-hero`, `.host-hero`, `.hero-dark` and `[data-page="news"] main > .section:first-child`; `width: min(380px, 48vw); aspect-ratio: 1`, top right, background `var(--zellige-green) right top / 40px`, masked by `radial-gradient(circle at 100% 0, #000 0 30%, transparent 72%)`. On `.hero-dark` it uses `--zellige-sage`.
- Hand-drawn underline for `h1 em, h2 em`: SVG path data URI, stroke `#a9bba3`, width 5, `no-repeat left bottom / 100% .32em` (line 67).
- Edition cover khatam: double eight-point star SVG (fill `#1b6b3a`, strokes `#f3eedf` and `#a9bba3`) behind the year (line 493).
- Cork board dots: 6x6 SVG, circle `r=.6` fill `#c9b48f` opacity `.5` (line 276).

## Dark mode

None. The stylesheet has no `prefers-color-scheme` rule and no theme switch. "Dark" in this site means the `.hero-dark` and `.section.dark` surface variants inside the light theme.
