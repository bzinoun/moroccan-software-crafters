# MSCA design tokens (Tailwind v4 `@theme`)

Single source: `src/app/globals.css`. When this file and the CSS differ, the CSS wins; update this file. A token named `--color-red` creates the utilities `bg-red`, `text-red`, `border-red`, `outline-red`, `fill-red` and their opacity forms (`bg-red/20`). Use the token name in a utility, never its hex value.

## Colors

`--color-*: initial` removes every stock Tailwind color. Only the tokens below exist, and white is `--color-white`. A color that is missing here is either added as a token (when two places use it) or written as an arbitrary value (`bg-[#fbe4e5]`) when it is used once.

| Token | Value | Role |
|---|---|---|
| `--color-white` | `#fff` | Text on red, green and ink fills, polaroid frame, input background, headings on dark surfaces, card surfaces |
| `--color-red` | `#c1272d` | Main accent: primary button fill, eyebrow text and rule, heading emphasis, active nav, step numbers, timeline dots, errors, invalid borders |
| `--color-red-dark` | `#9b1c22` | Primary button hover, SoCraTes badge text, form alert text |
| `--color-green` | `#1b6b3a` | Links, focus ring, data numbers, years, CTA band fill, highlighted offer border, checked inputs, progress, numbered circles |
| `--color-green-dark` | `#14532e` | Link hover, monogram text, meetup badge text, sticker CTA |
| `--color-green-deep` | `#0f3f23` | Dark surfaces: SoCraTes hero, dark sections, footer, law-main card, edition cover |
| `--color-green-soft` | `#e6f2ea` | Monogram tile, meetup badge background |
| `--color-cream` | `#f3eedf` | Text on dark surfaces (footer links, edition year) |
| `--color-sage` | `#a9bba3` | Accent on dark (emphasis, eyebrows, flags, focus ring), hand-drawn underline stroke, blockquote rule, khatam glyph |
| `--color-sage-soft` | `#e1e8df` | Alternate section background |
| `--color-on-dark` | `#d3dccf` | Body text on dark |
| `--color-on-dark-muted` | `#b9c6b4` | Secondary text on dark (footer legal, offer tagline) |
| `--color-ink` | `#1d1b19` | Body text, ghost button border, pressed chip and pill fill, time tag, skip link |
| `--color-ink-soft` | `#4b4742` | Lead text, card body text, nav links |
| `--color-muted` | `#6a645c` | Meta text, hints, help, notes |
| `--color-paper` | `#fbf7f0` | Page background, mobile nav panel, recap box, timeline dot fill |
| `--color-paper-2` | `#f3ece1` | Stats band, image placeholders, tag pills, inline code |
| `--color-line` | `#e4dbcd` | Every 1px border and divider, progress track |
| `--color-line-strong` | `#d9cfbd` | Hover and focus border of a logo tile |
| `--color-postit-yellow` | `#ffe774` | Default post-it, sticker, tips, edition badge, "give" bullets |
| `--color-postit-pink` | `#ffb3cf` | Pink post-it |
| `--color-postit-green` | `#b9eba0` | Green post-it, offer bullet, even tips |
| `--color-postit-blue` | `#a9dcf5` | Blue post-it |
| `--color-postit-orange` | `#ffc98a` | Orange post-it |

There is no card color token: use `bg-white` for a card surface.

Post-it cycle for topic walls: yellow, pink, green, blue, orange (index modulo 5).

Overlay values on dark surfaces use the opacity modifier on a token: `bg-white/5`, `border-white/16`.

**Dark surface rule (one value per role).** Card fill on a dark surface: `bg-white/5`. Card border on a dark surface: `border-white/16`. Use these two in every dark card (CardGrid, FactList, OfferGrid, PackageGrid, footer, FAQ, edition chips). Other dark overlays: `bg-white/12` and `hover:bg-white/25` (lightbox buttons), `bg-sage/10` with `border-sage/35` (sponsor call).

### Literal colors

A literal color used twice or more has a token (`--color-line-strong`, `--shadow-postit`). A literal that is an existing token at some opacity has no token of its own: write the opacity modifier.

| Need | Utility |
|---|---|
| Logo tile hover and focus border | `hover:border-line-strong`, `focus-visible:border-line-strong` |
| Post-it and sticker shadow | `shadow-postit` |
| Photo count pill | `bg-ink/78` |
| Status chip fill and border | `bg-green-deep/85`, `border-sage/55` |
| Dark hero overlay | `bg-linear-to-b/srgb from-green-deep/45 via-green-deep/78 via-60% to-green-deep` |
| Input focus halo | `focus:ring-3 focus:ring-green/15` |
| Primary button glow | `shadow-[0_6px_18px] shadow-red/28` |

The opacity forms mix in `oklab` where the browser supports it. Check a component that uses one at three widths.

Literals used once stay arbitrary values (promote on second use):

| Value | Role |
|---|---|
| `#fbe4e5`, `#fff4cc`, `#e3f1fa` | Badge backgrounds: SoCraTes, code snack, online (the meetup badge uses `green-soft`) |
| `#7a5b00`, `#1f5f80` | Badge text: code snack, online |
| `#e9dcc3`, `#b58a55`, `#c9b48f` | Cork board: background, 10px frame, dot pattern fill |
| `#d9efe2` | CTA band paragraph |
| `#e4ddd2`, `#cfc7bb` | SoCraTes hero lead, hero fact labels |
| `#f3eee6`, `#bdb4a7` | Logo tile name and role on dark |
| `#e8e2d9`, `rgba(15,13,12,0.94)` | Lightbox caption, backdrop |
| `rgba(0,0,0,0.6)`, `rgba(0,0,0,0.65)` | Photo gallery caption scrim (black has no token) |
| `#cbbfa9`, `#b9ad99`, `#f3faf5` | Choice card hover border, choice dot border, checked choice fill |
| `#c9a400` | "Give" bullet border |
| `#fdecec` | Form alert fill |

## Radius

| Token | Value | Utility | Where |
|---|---|---|---|
| `--radius-card` | `14px` | `rounded-card` | Cards, offers, editions, feature and article cards, hero and split images, logo tiles, sponsor call, proof, choice card, days block |
| `--radius-sm` | `8px` | `rounded-sm` | Facts, timeline items, inputs, gallery items, recap, form alert. This replaces the stock `rounded-sm` |

Other radii stay as utilities or arbitrary values: `rounded-full` (buttons, chips, pills, tags, badges, count pill, progress bars, numbered circles), `rounded-[22px]` CTA band, `rounded-[20px]` funnel panel, `rounded-[18px]` status chip, `rounded-xl` logo row (12px), `rounded-[6px]` skip link and lightbox image, `rounded-[4px]` focus outline and inline code, `rounded-[3px]` polaroid, `rounded-[2px]` logo sticker. Post-its have square corners.

## Shadows

| Token | Value | Utility | Where |
|---|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(29,27,25,.06), 0 8px 24px rgba(29,27,25,.08)` | `shadow-card` | Feature and article cards at rest |
| `--shadow-lift` | `0 2px 4px rgba(29,27,25,.08), 0 18px 40px rgba(29,27,25,.14)` | `shadow-lift` | Hover lift, polaroids, hero and split images, funnel panel, mobile nav panel, highlighted offer, article cover |
| `--shadow-postit` | `0 10px 18px rgba(0,0,0,.12)` | `shadow-postit` | Post-it, logo sticker |

One-off shadows stay arbitrary values: tips `0_6px_12px_rgba(0,0,0,0.08)`, edition badge `0_4px_10px_rgba(0,0,0,0.2)`, SoCraTes photo `0_20px_50px_rgba(0,0,0,0.35)`, topic board `inset_0_0_40px_rgba(0,0,0,0.12)`. The primary button glow and the input focus halo use a colored shadow with the color from a token (see the literal color table above).

## Container

| Token | Value | Utility |
|---|---|---|
| `--container-wrap` | `1180px` | `max-w-wrap` |

`Container` is `mx-auto w-[calc(100%-32px)] max-w-wrap`: a 16px gutter on each side below 1212px.

## Fonts

Declared with `@theme inline` so each utility keeps the `var(--font-...)` reference that `next/font` sets on `<html>` (`src/app/fonts.ts`).

| Token | Stack | Utility | Use |
|---|---|---|---|
| `--font-display` | `var(--font-fraunces), Georgia, serif` | `font-display` | h1 to h4, big numbers, legends, blockquote, brand name |
| `--font-body` | `var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif` | `font-body` | Body, UI, buttons, inputs, small card titles |
| `--font-hand` | `var(--font-caveat), "Comic Sans MS", cursive` | `font-hand` | Post-its, polaroid captions, kickers, day names, sticker text, tips, edition badge |

Monospace for inline code: `font-mono` (stock stack). All three families are variable fonts, so any weight works. Fraunces roman loads with the `opsz` axis; Caveat is not preloaded (`preload: false`).

Fraunces italic is a separate font (`src/app/fonts-italic.ts`, variable `--font-fraunces-italic`) so that only the routes that show it preload its 82 KB file. The home, meetup, SoCraTes and association layouts and the article page import it and put its `.variable` class on the page wrapper. The accueillir and news list pages do not. Italic Fraunces text uses `h1 em` or `h2 em` (base layer), or the `font-display-italic` utility (laws title, article quotes): both read `--font-fraunces-italic` and fall back to the roman face when it is not set. Never write `font-display italic` for a new italic heading: the roman family has no italic face, so the browser would draw a slanted copy of the roman. A route that shows italic Fraunces imports the module in its layout or page. Trap: on `/accueillir/` and `/actualites/` an `<em>` in an `h1` or `h2` draws a slanted roman, because those routes do not load the italic face. Keep `<em>` out of the titles of those two routes, or import `fonts-italic` in their layout and put its `.variable` on the `PageFrame`.

## Type scale

Set in the base layer: body 17px, line-height 1.6, `-webkit-font-smoothing: antialiased`.

| Role | Size | Notes |
|---|---|---|
| `h1` | `clamp(2.3rem, 5vw, 3.9rem)` | base layer |
| `h2` | `clamp(1.8rem, 3.4vw, 2.6rem)` | base layer |
| `h3` | `1.3rem` | base layer; components override from 1.15rem to 1.9rem |
| `h4` | `1.05rem` | base layer |
| SoCraTes hero h1 | `clamp(2.6rem, 6vw, 4.8rem)` | white |
| Article h1 | `clamp(2rem, 4vw, 3rem)` | |
| Lead | `1.15rem`, `text-ink-soft`, `max-w-[60ch]` | |
| Eyebrow | `0.8rem`, 600, tracking `0.08em`, uppercase, red, 22x2px red rule before | |
| Button | 600, `1rem`, line-height 1 (header size `0.92rem`) | |
| Nav link | `0.95rem`, 500 | |
| Prose | `1.08rem`, line-height 1.7; blockquote `1.25rem` Fraunces italic | |
| Big numbers | 1.4rem to 2.4rem, Fraunces 600, green (agenda counter red) | stats `clamp(1.8rem, 3vw, 2.4rem)` |
| Hand font | 1.15rem to 1.7rem | post-it 1.35rem, kicker 1.6rem, day 1.7rem |
| Small UI | `0.72rem` to `0.9rem` | badges 0.72rem 700 uppercase tracking `0.05em`; meta 0.8rem muted |

### Type scale tokens

Each size used two or more times has a token in `@theme`. The name is the size in hundredths of a rem: `text-s95` is `0.95rem`. The names carry the value on purpose: one place for each size, no rounding. Merging near sizes (0.92, 0.93 and 0.95; 0.84 and 0.85; 1.2 and 1.25) into fewer roles is a design decision for later; then rename them by role.

A token sets the font size only (no paired line height): keep `leading-*` in its own utility.

| Size | Token | Size | Token |
|---|---|---|---|
| `0.72rem` | `text-s72` | `1.02rem` | `text-s102` |
| `0.74rem` | `text-s74` | `1.05rem` | `text-s105` |
| `0.76rem` | `text-s76` | `1.15rem` | `text-s115` |
| `0.78rem` | `text-s78` | `1.2rem` | `text-s120` |
| `0.8rem` | `text-s80` | `1.25rem` | `text-s125` |
| `0.82rem` | `text-s82` | `1.3rem` | `text-s130` |
| `0.84rem` | `text-s84` | `1.35rem` | `text-s135` |
| `0.85rem` | `text-s85` | `1.4rem` | `text-s140` |
| `0.88rem` | `text-s88` | `1.5rem` | `text-s150` |
| `0.9rem` | `text-s90` | `1.6rem` | `text-s160` |
| `0.92rem` | `text-s92` | `1.7rem` | `text-s170` |
| `0.93rem` | `text-s93` | `1.8rem` | `text-s180` |
| `0.95rem` | `text-s95` | `1.9rem` | `text-s190` |
| `0.98rem` | `text-s98` | | |

The token applies to every variant too (`sm:text-s150`, `[&_h2]:text-s160`). Sizes used once stay arbitrary: `0.68`, `0.7`, `0.75`, `0.83`, `0.86`, `1.08`, `1.1`, `1.55`, `2` rem and every `clamp(...)`. A test (`src/lib/cn.test.ts`) fails when a token of `globals.css` is missing in the merge config of `src/lib/cn.ts`: add a new `--text-*`, `--shadow-*`, `--radius-*`, `--container-*`, `--ease-*` or `--font-*` token in both places (`TAILWIND.md` says why).

Other arbitrary values that stay (no clean utility in Tailwind 4.3): `border-[1.5px]` (no half-pixel border utility), `rotate-[1.5deg]` and the other rotations with a decimal (`rotate-1.5` is not generated), and `grid-cols-[repeat(2,1fr)]` with `grid-cols-[repeat(4,1fr)]` (not `grid-cols-2` or `grid-cols-4`: those use `minmax(0,1fr)` tracks and a long fact would overflow, see `TAILWIND.md`). `motion-safe:ease-standard` is the easing utility (token `--ease-standard: ease`).

## Spacing and layout values

Tailwind's spacing scale applies. Values the layout uses:

| Context | Value |
|---|---|
| Section | `py-22` (88px); tight `py-14` (56px) |
| Hero, page hero | `pt-16 pb-10` |
| SoCraTes hero | `pt-30 pb-18` |
| Host hero | `pt-14 pb-6` |
| Stats band | `py-7` |
| Footer | `pt-14 pb-10` |
| Section head | `max-w-[760px]`, `mb-11` (44px) |
| Section foot | `mt-9` (36px) |
| Two-column splits | `gap-12` (48px) |
| Header height | `h-18` (72px) |
| Sticky offsets | year group 90px, host aside 100px |
| Text measures | lead `60ch`, SoCraTes lead `64ch`, history paragraph `62ch`, success paragraph `46ch` |
| Block maxima | SoCraTes hero text 820px, FAQ 820px, article 760px, offers stacked 560px, lightbox figure `min(1100px, 100%)` |

## Breakpoints

Tailwind defaults, mobile first. This is decided: no custom breakpoints and no `max-[Npx]:` values.

| Prefix | Min width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

A width that is not a default maps to the nearest default, and a layout may switch up to about 160 px away from that width. Use the `max-*` form only to hide or reshape below one breakpoint (the nav panel, the brand tagline `max-sm:hidden`).

| Width in the design | Use |
|---|---|
| 960, 900 | `lg` (columns from `lg`, one column below) |
| 860, 800, 760 | `md` |
| 700, 640, 600, 560, 520, 480 | `sm` (one column below 640, the `sm:` form applies from 640) |

## Motion

- Prefix every transition and animation with `motion-safe:`; the reduced-motion case then needs no extra rule. The smooth scroll in the base layer has its own reduced-motion rule.
- Tailwind v4 transforms use the individual properties: transition `translate`, `rotate` and `scale`, not `transform` (`motion-safe:transition-[translate,background-color,box-shadow]`).
- Durations: button 150ms, burger 200ms, tile and card lift 200ms, image zoom 400ms to 500ms, reveal 600ms, input border 150ms, progress 300ms. Easing `ease` (utility `ease-standard`).
- Effects in the budget: hover lifts (`hover:-translate-y-px` on buttons, `-translate-y-0.75` on tiles and cards with `shadow-lift`), image zooms (`group-hover:scale-105`-style, 1.03 to 1.04), the FAQ plus rotating 45 degrees, the reveal fade-in (opacity 0 and 16px down to rest).
- Fixed rotations are part of the look: polaroids `-3deg`, `4deg`, `-1.5deg`; collage post-it `5deg`; page hero image `1.5deg` and its post-it `-4deg`; zoom image `-1.5deg`; topic post-its (index from 0) even `-2deg`, odd `1.5deg`, every third (2, 5, 8...) `-0.5deg`; logo sticker `-2deg` (hover `-0.5deg`); tips `-0.6deg` and even `0.8deg`; numbered circles `-6deg`; law circles `-8deg`; edition badge `-4deg`; success post-it `-3deg`. Use `rotate-[Ndeg]` for these (`rotate-5` for a whole-degree step).

## Layering

Skip link `z-100`, sticky header `z-50`, the lightbox dialog in the browser top layer (no `z-index`), collage polaroids `z-2`/`z-4`/`z-3` and post-it `z-5`, zellige corner `-z-1` inside its own stacking context (`z-1` on the dark hero, see `zellige-corner-dark`).

## Base layer in `globals.css`

These rules apply to bare elements. A component never repeats them.

- `html`: smooth scroll, `scroll-padding-top: 84px`, `auto` under reduced motion.
- `body`: Inter, 17px, line-height 1.6, `ink` on `paper`, antialiased.
- `img`: `max-width: 100%`, `height: auto`, `display: block`.
- `a`: green and underlined (Tailwind's reset removes the underline; this restores the browser default). Hover turns it `green-dark`. A link that must not have an underline carries `no-underline`.
- `:focus-visible`: 3px green outline, offset 2px, radius 4px. On a dark surface set `**:focus-visible:outline-sage` on the surface.
- `h1` to `h4`: Fraunces 600, line-height 1.12, `margin: 0 0 0.5em`, tracking `-0.01em`, sizes from the type scale.
- `p`: `margin: 0 0 1em`.
- `h1 em`, `h2 em`: italic, weight 590, red, hand-drawn sage underline (SVG data URI, `100% x 0.32em` at the bottom left). Weight 590 was measured against a 500 italic with a synthetic bold: 97 percent of that ink at +2.7 percent width. On dark headings the emphasis is sage with no underline (override in the dark hero and dark sections).

## Signature graphics

- `--zellige-green` (custom property on `:root`) holds the 40x40 tile as an SVG data URI (stroke `#1b6b3a` at opacity `.28`, width 1.1). The utility `zellige-corner` (defined in `globals.css` with `@utility`) goes on a hero section. It sets `relative isolate` and draws a masked tile corner at the top right (`min(380px, 48vw)` square, radial mask fading out). One per hero. The dark hero uses the sage tile: `--zellige-sage` (stroke `#a9bba3`, opacity `.4`) next to the green one, selected by the utility `zellige-corner-dark` (put it next to `zellige-corner`), which also raises the corner to `z-index: 1` because at `-1` it sits under the photo layer and is invisible. The corner reads `--zellige-image` and `--zellige-z`, so a plain hero keeps the green tile at `-1`.
- Khatam star: eight-point star polygon `polygon(50% 0%, 64.6% 14.6%, 85.4% 14.6%, 85.4% 35.4%, 100% 50%, 85.4% 64.6%, 85.4% 85.4%, 64.6% 85.4%, 50% 100%, 35.4% 85.4%, 14.6% 85.4%, 14.6% 64.6%, 0% 50%, 14.6% 35.4%, 14.6% 14.6%, 35.4% 14.6%)`, used as `clip-path`. SoCraTes content only. Add it as a `@utility khatam` when first needed.
- Edition cover: double eight-point star SVG (fill `#1b6b3a`, strokes `#f3eedf` and `#a9bba3`) behind the year, on a sage zellige pattern over green-deep.
- Cork board dots: 6x6 SVG, circle `r=.6`, fill `#c9b48f` at opacity `.5`.
- Keep each SVG string in one place in `globals.css`.

## Progressive enhancement (`js` variant)

Decided: the HTML holds all the content, and a control that needs JavaScript hides without it.

An inline script in the `<head>` of the root layout adds the class `js` to `<html>` before the first paint (`src/app/js-class-script.ts`; the element has `suppressHydrationWarning` for that one class). `globals.css` defines the variant `js:` (the root element has the class `js`). Tailwind's own `not-js:` is its opposite (no JavaScript, or before the script runs, which is before the first paint).

- `js:hidden` collapses content for a visitor with JavaScript only: events and photos past the limit, the steps of the funnel that are not current. Without JavaScript they show.
- `not-js:hidden` hides a control that does nothing without JavaScript: filter chips, "show more" buttons, the funnel progress and navigation. A visitor without JavaScript never sees a dead control.
- A `js:` or `not-js:` utility can sit on an element that also has a display utility: the variants come after the display utilities in the built CSS.
- The mobile nav needs neither: it is a native `<details>`.
- The `<html>` classes from `next/font` stay on the element; the script only adds one class.
- Tests: jsdom loads no stylesheet, so a test that checks what a visitor sees calls `setJs()` from `src/components/home/js-mode.ts`.

## Dark mode

None. "Dark" means the dark section and SoCraTes hero surfaces inside the light theme. Add no `dark:` variant.
