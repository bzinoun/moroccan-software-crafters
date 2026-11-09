# Tailwind rules for the app

Tailwind v4 (CSS first, no `tailwind.config`). Each rule is one line plus the doc page behind it. Links checked against tailwindcss.com on 2026-11-06.

## Tokens and theme

- Declare every design value as a variable in `@theme` in `globals.css`; the variable creates the utilities. [theme](https://tailwindcss.com/docs/theme#theme-variable-namespaces)
- Name variables by namespace (`--color-*`, `--radius-*`, `--shadow-*`, `--container-*`, `--font-*`) or no utility is generated. [theme](https://tailwindcss.com/docs/theme#theme-variable-namespaces)
- `--color-*: initial` drops the stock palette, so write `text-white` only because `--color-white` exists. [theme](https://tailwindcss.com/docs/theme#overriding-the-default-theme)
- Use `@theme inline` for a token that points at another variable (the `next/font` families), so the utility keeps the `var()` reference. [theme](https://tailwindcss.com/docs/theme#referencing-other-variables)
- Reference a token in custom CSS with `var(--color-red)`. [theme](https://tailwindcss.com/docs/theme#with-custom-css)
- A text-size, radius, shadow, container, easing or font token with a custom name needs the same name in the `tailwind-merge` config in `src/lib/cn.ts` (`twMergeConfig`, hand-synced with `@theme`). Without it `tailwind-merge` reads `text-s95` as a text color and drops the color class, or conflicting classes do not merge. `src/lib/cn.test.ts` reads `globals.css` and fails when a token is missing. [tailwind-variants](https://www.tailwind-variants.org/docs/introduction)

## Writing classes

- Write whole class names in source (`bg-red`, never `bg-${tone}`), because the scanner reads text and does not run code. [detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names)
- Map a prop to a complete class string with `tv()` variants. [tailwind-variants](https://www.tailwind-variants.org/docs/introduction)
- Merge a caller's `className` with `cn()`, so the later conflicting utility wins. [conflicting utilities](https://tailwindcss.com/docs/styling-with-utility-classes#conflicting-utility-classes)
- Repeat a class list by extracting a React component, not a CSS class. [managing duplication](https://tailwindcss.com/docs/styling-with-utility-classes#managing-duplication)
- Do not use `@apply` to build component classes. [functions and directives](https://tailwindcss.com/docs/functions-and-directives#apply-directive)
- Do not use CSS Modules; they cannot see `@theme` variables without extra setup and split the styling in two. [compatibility](https://tailwindcss.com/docs/compatibility#css-modules)
- Put a reusable one-off style that utilities cannot express in a `@utility` block (the `zellige-corner` pattern). [functions and directives](https://tailwindcss.com/docs/functions-and-directives#utility-directive)
- Put styling of bare elements in `@layer base` only (headings, links, focus ring). [adding custom styles](https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles)
- Use an arbitrary value (`px-[1.35rem]`) for a number that appears once; make a token when two places share it. [adding custom styles](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- Let `prettier-plugin-tailwindcss` sort classes (`pnpm format`); it also sorts the strings inside `tv()` and `cn()`. [editor setup](https://tailwindcss.com/docs/editor-setup#class-sorting-with-prettier)

## Responsive and states

- Design the base for a 375px screen and add `sm:`, `md:`, `lg:`, `xl:` upward; the unprefixed class is the mobile one. [responsive design](https://tailwindcss.com/docs/responsive-design#working-mobile-first)
- Use the default breakpoints only; do not add custom ones and do not write `max-[900px]:`. [responsive design](https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints)
- Use `max-lg:` to style only below a breakpoint. [responsive design](https://tailwindcss.com/docs/responsive-design#targeting-mobile-screens)
- Style state from ARIA and data attributes (`aria-[current=page]:`, `data-[open=true]:`, `aria-expanded`) so the markup carries the state. [hover, focus and other states](https://tailwindcss.com/docs/hover-focus-and-other-states#aria-states)
- Style a child from a parent state with `group` and `group-aria-expanded:` or `group-open:` (a native `<details>`), not with extra JS. [hover, focus and other states](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state)
- Prefix motion with `motion-safe:`. [hover, focus and other states](https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion)
- Add `content-['']` with any `before:` or `after:` utility that draws a box. [hover, focus and other states](https://tailwindcss.com/docs/hover-focus-and-other-states#before-and-after)
- Use `js:` and `not-js:` for what depends on JavaScript (the `js` variant is in `TOKENS.md`). Put every content of the page in the HTML.
- Hover utilities apply only on devices that support hover, so never put the only way to reach information behind `hover:`. [upgrade guide](https://tailwindcss.com/docs/upgrade-guide#hover-styles-on-mobile)

## v4 behavior that changes defaults

- Transform utilities set `translate`, `rotate` and `scale` separately; transition those names, not `transform`. [upgrade guide](https://tailwindcss.com/docs/upgrade-guide#individual-transform-properties)
- The default border color is `currentColor`; always pair `border` with a `border-line`-style color. [upgrade guide](https://tailwindcss.com/docs/upgrade-guide#default-border-color)
- Preflight resets margins, headings, lists and links; restore what the design needs in `@layer base`. [preflight](https://tailwindcss.com/docs/preflight)
- Buttons use the default cursor; add `cursor-pointer` to a clickable `Button`. [upgrade guide](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor)
- A `<dialog>` has no default margins; center it with explicit utilities, and use `open:flex` so the closed dialog stays `display: none`. [upgrade guide](https://tailwindcss.com/docs/upgrade-guide#dialog-margins-removed)
- `tailwind-merge` treats a text size as overriding the line height, so it drops a `leading-*` that comes before a `text-*` size in the same class string. Keep the size and its `leading-*` in one string, with the `leading-*` after the size (the `Button` `sm` size does), or write the line height as an arbitrary property (`[line-height:1.15]`, as `PostIt` does) when a caller can add a size.
- Half steps exist (`mb-2.5`, `px-4.5`), quarter steps do not (`mb-2.4` is not generated): write a rem literal (`mb-[0.6rem]`) for a value that is not a multiple of 0.25rem, and a half step for an even pixel value (`pt-5.5` for 22px).
- `grid-cols-2` is `repeat(2, minmax(0, 1fr))`, so a column cannot grow past its share and a long word overflows. Where a column must grow to its widest content (`FactList`: "9 h 30 → 14 h" at 375px), write `grid-cols-[repeat(2,1fr)]`. The value then takes `min-[360px]:whitespace-nowrap`, so below 360px it may wrap and the page does not scroll sideways.
- An empty `::before` or `::after` still draws a box: remove it with `before:hidden`, not by emptying the content.
- Tailwind's `outline-none` removes the outline that Windows forced-colors mode paints: use `outline-hidden` (a transparent outline).

## Source scanning

- `@import "tailwindcss" source(none)` turns off automatic scanning, and `@source` lists the folders to read (a crash on Turbopack made this necessary). [detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files#disabling-automatic-detection)
- Register a new source folder with `@source "../path"` and exclude files with `@source not`. [detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources)
- The scanner reads comments too: a Tailwind word such as `container`, `static`, `fixed`, `hidden`, `italic`, `grid`, `block`, `flex`, `border` or `shadow` in a comment (or in a string such as the font option `italic`) generates a class. Keep class-like words out of comments; `@source not` excludes the two files that cannot avoid them (`src/lib/cn.ts`, `src/app/fonts-italic.ts`) and the tests. After a change, look for a stray bare rule (`.static`, `.italic`) in the built CSS.
- The scan covers `src/`. Add a `@source` line when you create a folder with class names outside it. [detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files#how-classes-are-detected)
