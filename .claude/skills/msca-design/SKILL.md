---
name: msca-design
description: Use when building or changing any UI of the MSCA / Moroccan Software Crafters site (pages, components, styles), including the Next.js port. Holds the design tokens, the component inventory and the rules for an identical look.
---

# MSCA design

The live site is the design source: `assets/css/style.css` (one stylesheet), the six HTML pages at the repo root, and the renderers in `assets/js/`. A rebuild looks identical to it, pixel for pixel.

## Design principles

- **Warm paper, real ink.** Page `--paper` (#fbf7f0), white cards with a 1px `--line` border, text `--ink` (#1d1b19). Light theme only.
- **Red leads, green carries data.** `--red` (#c1272d) is the main accent: primary buttons, eyebrows, the emphasized word in headings, active nav, errors. `--green` is for links, numbers, prices, focus rings and the CTA band. `--green-deep` is for dark sections, the SoCraTes hero and the footer.
- **A hand-made session board.** Post-its in five colors, polaroids, a cork board, Caveat handwriting, small rotations (-8deg to 5deg), a hand-drawn sage underline under `<em>` in titles.
- **Moroccan signature, used sparingly.** One zellige corner per hero (top right, masked). The khatam star marks SoCraTes content only.
- **Editorial type.** Fraunces for headings and numbers, Inter for text and UI, Caveat for handwritten notes.
- **French UI.** Copy in French with French typography: a narrow no-break space (U+202F) before `? ! : ;`. Middle dots ` · ` separate meta items.
- **Real people, real numbers.** Event photos only, numbers with their year. Tone: "nous" to "vous", short plain sentences, sentence case, technical words kept (TDD, open space, lightning talk), no exclamation marks in body text, no em dashes.

## Rules for every change

1. **Port the stylesheet verbatim.** Carry `style.css` over as the global stylesheet (for example `app/globals.css`) with every selector, value and media query unchanged. Components emit the same class names and the same DOM nesting, because many selectors are contextual (`.section.dark .offer`, `.hero-dark .btn-ghost`, `.cta-band .btn-primary`).
2. **Use the tokens.** Take colors, fonts, radii and shadows from the custom properties in `TOKENS.md`. Use the literal values the stylesheet already uses where no token exists. Every new rule reuses an existing value.
3. **Match an existing component first.** Look the need up in `COMPONENTS.md` and reuse that component and its variants. Create a new component only when nothing fits, and build it from existing classes and tokens.
4. **Keep the markup contracts.** Same `aria-*` attributes, `data-page` on `<body>`, `hidden` toggles, focus moves, `loading="lazy"`, empty `alt` on decorative photos.
5. **Keep the motion budget.** Hover lifts, image zooms and `.reveal` fade-ins only, each with its `prefers-reduced-motion` rule.
6. **Check at every breakpoint** in `TOKENS.md`, from 360px to 1180px+, against the static site side by side.

## Reference files

- Read `TOKENS.md` before you write or change any CSS value, font loading, breakpoint or transition.
- Read `COMPONENTS.md` before you build or change a component, a page section or any interactive behavior (nav, lightbox, filters, funnel, forms). It also gives the React component name for each pattern.

## Site wins over the design doc

`docs/04-brand-and-design.md` (in the organizers' planning pack) describes an earlier plan. The current site supersedes it on these points; keep the site behavior.

| Topic | Design doc | Current site (keep) |
|---|---|---|
| Red | Only the "open now" marker, never errors | Main accent: primary buttons, eyebrows, em, errors |
| Page and text color | White page, pure black text, cream only on cards | `--paper` page, `--ink` text, white cards |
| Fonts | Bricolage Grotesque, IBM Plex Sans and Mono, self-hosted | Fraunces, Inter, Caveat from Google Fonts |
| Type scale | Ratio 1.25, body 18px | Body 17px, `clamp()` headings |
| Grid | 12 columns, 1120px | `--wrap` 1180px, 16px gutters, per-component grids |
| Section separation | Space only, no background changes | `.section.alt` sage-soft bands, `.stats` band, dark sections |
| Cards | Only on the board, cream, 4px radius, black edge | White cards everywhere, 14px radius, `--line` border |
| Labels and links | No all-caps, no middle dots, no arrows | Uppercase eyebrows, ` · ` separators, `→` on card links and sticker |
| Buttons | Green primary, underlined text secondary, no outline | Red pill primary, outlined pill ghost |
| Partner packs | Tables | Offer cards |
| Timeline | No vertical line | `.history` has a line and red-ringed dots |
| Home hero | Deep green board with next-event card | Light hero with polaroid collage and post-it |
| Motion | One load animation | Hover lifts and `.reveal` fade-ins |
| Language | English | French UI |

Both agree on: the 3px green focus ring, `prefers-reduced-motion` support, one zellige corner per hero, khatam for SoCraTes only, no dark mode in version 1, event photos only.
