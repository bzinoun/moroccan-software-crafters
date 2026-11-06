---
name: msca-design
description: Use when building or changing any UI of the Moroccan Software Crafters site in `web/` (pages, components, styles, Tailwind). Holds the design principles, the `@theme` tokens, the Tailwind rules and the component inventory.
---

# MSCA design

The design system of the Next.js app in `web/`: Tailwind v4 tokens in `web/src/app/globals.css` and React components in `web/src/components/`. The old static site at the repo root (HTML pages, `assets/css`, `assets/js`) is only the visual reference while pages are ported; look at it in a browser to match a section, and write the new code from the files below.

## Reference files

- `TOKENS.md`: the `@theme` table (colors, radius, shadows, container, fonts), type scale, spacing, breakpoints, motion, base-layer rules. Read it before you write a color, size, breakpoint or transition.
- `TAILWIND.md`: Tailwind rules, each with its doc link. Read it before you write or change styling code.
- `COMPONENTS.md`: built components with their real props, and the components still to build. Read it before you build or change a component, a section or an interactive behavior.

## Design principles

- **Warm paper, real ink.** Page `paper`, white cards with a 1px `line` border, text `ink`. Light theme only; add no `dark:` variant.
- **Red leads, green carries data.** `red` is the main accent: primary buttons, eyebrows, the emphasized word in headings, active nav, errors. `green` is for links, numbers, prices, focus rings and the CTA band. `green-deep` is for dark sections, the SoCraTes hero and the footer.
- **A hand-made session board.** Post-its in five colors, polaroids, a cork board, Caveat handwriting, small rotations (`-8deg` to `5deg`), a hand-drawn sage underline under `<em>` in titles.
- **Moroccan signature, used sparingly.** One zellige corner per hero (`zellige-corner`, top right). The khatam star marks SoCraTes content only.
- **Editorial type.** Fraunces (`font-display`) for headings and numbers, Inter (`font-body`) for text and UI, Caveat (`font-hand`) for handwritten notes.
- **French UI.** Copy in French. Put a narrow no-break space (U+202F) before `? ! : ;`; `frenchSpacing()` does this for rendered strings. Middle dots ` · ` separate meta items.
- **Real people, real numbers.** Event photos only, numbers with their year. Tone: "nous" to "vous", short plain sentences, sentence case, technical words kept (TDD, open space, lightning talk), no exclamation marks in body text, no em dashes.

## Rules for every change

1. **Use tokens.** Take colors, fonts, radius, shadows and container width from `@theme` utilities (`bg-red`, `font-display`, `rounded-card`, `shadow-lift`, `max-w-wrap`). A value used once may be an arbitrary value; a value used twice becomes a token in `globals.css`, and `TOKENS.md` gets the row in the same commit.
2. **Style with utilities in components.** Use whole class names, `tv()` for variants and `cn()` to merge a caller's `className` (`src/lib/cn.ts`). Do not add `@apply`, CSS Modules or a component library. `globals.css` holds tokens, the base layer and `@utility` blocks only.
3. **Reuse a component first.** Look the need up in `COMPONENTS.md` and reuse that component and its variants. Create a new one only when nothing fits, and add its entry to the file. Contexts such as a dark surface become variants, not parent selectors.
4. **Build mobile first on the default breakpoints** (`sm`, `md`, `lg`, `xl`). Add no custom breakpoint and no `max-[Npx]:` value.
5. **Use native HTML for interactive parts**: `<details>` for the FAQ, `<dialog>` for the lightbox, `<button>` for actions, `<a>` for navigation, `<fieldset>` and `<legend>` for form steps.
6. **Keep the accessibility contracts.** Same `aria-*` states (`aria-current`, `aria-expanded`, `aria-pressed`, `aria-live`), a 3px green focus ring (sage on dark surfaces), empty `alt` on decorative photos, `loading="lazy"` below the fold, a skip link, a visible label on every form control.
7. **Keep the motion budget.** Hover lifts, image zooms and the reveal fade-in. Put every transition and animation behind `motion-safe:`; the hover offset itself (`hover:-translate-y-px`) always applies, as in `Button`.
8. **Show partner logos and photos only with consent.** An empty `logo` renders the monogram.
9. **Check each finished page in a browser** at 375, 768 and 1280 px against the old site, with computed styles (done criterion in `web/CLAUDE.md`).
