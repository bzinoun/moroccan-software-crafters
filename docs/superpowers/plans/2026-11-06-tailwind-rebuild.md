# Tailwind rebuild of the web/ shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the copied `style.css` in `web/` with Tailwind v4, rebuild the shell (skip link, header, burger, footer, hero) in utilities, and rewrite the project skills around the new design system.

**Architecture:** Tokens live in one `@theme` block in `web/src/app/globals.css`. Components use utility classes. Variants use `tailwind-variants` (`tv`) with `tailwind-merge` configured for our token names. Fonts load with `next/font/google` and feed `--font-*` tokens through `@theme inline`. The old site stays the visual reference.

**Tech Stack:** Tailwind 4.3.3, `@tailwindcss/postcss`, `tailwind-variants` 4.0.1, `tailwind-merge` 3.7.0, Prettier with `prettier-plugin-tailwindcss` 0.8.1, Next.js 16.4.3, Vitest.

**Spec:** the decisions of the 2026-11-06 grilling session, restated here as Global Constraints. Token values come from `.claude/skills/msca-design/TOKENS.md` (read it first, copy values exactly).

## Global Constraints

- Branch `web/tailwind`, from `skills/nextjs-prep`. Push to the `fork` remote.
- Use default Tailwind breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. No custom breakpoints, no `max-[Npx]:` values. The burger menu shows below `lg`.
- No `@apply` for components, no CSS Modules, no shadcn/ui, no `cva`. Reuse styles with React components and `tv()`.
- Write whole class names in code. Never build a class name from a string.
- Native HTML for interactive parts (`<details>`, `<dialog>`).
- Fonts: Fraunces 500 and 600 (italic 500), Inter 400 to 700, Caveat 500 and 600, with `next/font/google`. No request to Google at page load.
- Copy is French. No em dashes anywhere. The repo is public: no personal data.
- Local tests: run only the files a task touches (`pnpm vitest run <file>`), never the whole suite.
- Existing behavior stays: aria attributes, `data-page` TODO, skip link, French spacing, `assetUrl()`.

## Review Focus

- Tailwind scans unrelated folders and crashes Turbopack (`RangeError: Invalid code point`): the build must pass with `source(none)` and explicit `@source` paths.
- A custom token class conflicts with a default one (`shadow-lift` and `shadow-md`): `cn()` must keep the last one.
- `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters`: font files, images and links in `out/` must all carry the prefix.
- The closed burger panel must not be reachable by keyboard below `lg` (hidden, not only off-screen).
- Motion must respect `prefers-reduced-motion` (`motion-safe:` or `motion-reduce:`).

---

### Task 1: Tailwind foundation and `cn`

**Files:**
- Create: `web/postcss.config.mjs`, `web/src/lib/cn.ts`, `web/src/lib/cn.test.ts`, `web/src/app/fonts.ts`
- Modify: `web/package.json`, `web/src/app/globals.css` (replace content), `web/src/app/layout.tsx`
- Test: `web/src/lib/cn.test.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` (clsx plus the configured merge); `tv` re-exported from `@/lib/cn` as `createTV` result `tv`; `fonts` object with `fraunces`, `inter`, `caveat` (each has `.variable`); token names in `@theme`: `--color-{red,red-dark,green,green-dark,green-deep,cream,sage,sage-soft,on-dark,on-dark-muted,ink,ink-soft,muted,paper,paper-2,card,line,postit-yellow,postit-pink,postit-green,postit-blue,postit-orange}`, `--font-{display,body,hand}`, `--radius-card` (14px), `--radius-sm` (8px), `--shadow-card`, `--shadow-lift`, `--container-wrap` (1180px).

- [ ] **Step 1: Write the failing test** in `cn.test.ts`: `cn("px-2", "px-4")` is `"px-4"`; `cn("shadow-md", "shadow-lift")` is `"shadow-lift"`; `cn("text-ink", false, "text-red")` is `"text-red"`; `tv({ base: "p-1", variants: { tone: { a: "bg-red", b: "bg-green" } } })({ tone: "b" })` contains `bg-green` and not `bg-red`.
- [ ] **Step 2: Run** `pnpm vitest run src/lib/cn.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Install** `pnpm add tailwindcss @tailwindcss/postcss tailwind-variants tailwind-merge clsx`. Write `postcss.config.mjs` with `'@tailwindcss/postcss': {}`.
- [ ] **Step 4: Implement `cn` and `tv`** in `cn.ts` with `extendTailwindMerge` and the custom shadow, radius and container token names. Make the test pass.
- [ ] **Step 5: Replace `globals.css`**: `@import "tailwindcss" source(none);`, `@source "../**/*.{ts,tsx}";`, then `@theme` with `--color-*: initial;` and the tokens listed above (values from `TOKENS.md`), and `@theme inline` mapping `--font-display`, `--font-body`, `--font-hand` to the `next/font` variables. Add a `@layer base` block only for what `TOKENS.md` lists as global element styles (body background and color, focus ring, `img`, heading font).
- [ ] **Step 6: Write `fonts.ts`** with the three `next/font/google` fonts (variables `--font-fraunces`, `--font-inter`, `--font-caveat`, `display: "swap"`). In `layout.tsx` add the three `.variable` classes on `<html>` and delete the Google Fonts `<link>` tags and their eslint-disable comment.
- [ ] **Step 7: Verify** `pnpm build` passes and `grep -c fonts.googleapis web/out/index.html` prints `0`. Run `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters pnpm build` and check that `grep -o 'src="[^"]*woff2' ` style paths and `<link href` in `out/index.html` start with the prefix.
- [ ] **Step 8: Commit** `Add Tailwind v4 foundation with the site tokens`.

### Task 2: Button and shell components

**Files:**
- Create: `web/src/components/Button.tsx`, `web/src/components/Button.test.tsx`, `web/src/components/Brand.tsx`
- Modify: `SiteHeader.tsx`, `NavToggle.tsx`, `NavToggle.test.tsx`, `SiteFooter.tsx`, `SkipLink.tsx`, `src/app/page.tsx`, `src/app/layout.tsx`, plus their existing tests where they assert old class names
- Test: the files above

**Interfaces:**
- Consumes: `cn`, `tv` from Task 1.
- Produces: `<Button variant="primary" | "ghost" size="md" | "sm" href?: string>` rendering `<a>` (via `next/link` or `<a>` for external) when `href` is set, else `<button>`; `<Brand site size="md" | "lg" tone="light" | "dark">`.

- [ ] **Step 1: Write failing tests.** `Button.test.tsx`: primary renders role `link` with its label and `href`; `variant="ghost"` renders a different class list than primary; a caller `className` with a conflicting padding wins over the default. Change `NavToggle.test.tsx` so the open state is read from `aria-expanded` on the button and `data-open="true"` on the nav (replace every `toHaveClass("open")`).
- [ ] **Step 2: Run** the two test files. Expected: FAIL.
- [ ] **Step 3: Implement `Button`** with `tv` (primary red pill with `hover:` red-dark, ghost outlined pill, `sm` size used in the header). Values come from the "Buttons" section of `COMPONENTS.md`.
- [ ] **Step 4: Implement `Brand`**, then rebuild `SiteHeader` (sticky, `z-50`, translucent paper with blur, 72px high, `lg:` nav row, `max-lg:` absolute panel with separators, `aria-current` styling through `aria-[current=page]:`), `NavToggle` (burger spans morph with `group-aria-expanded:`; the nav is `max-lg:hidden` until `data-open="true"`; a link click closes it), `SiteFooter`, `SkipLink`, and the hero in `page.tsx`. Keep the DOM order, aria attributes and `<em>` handling from the current code. Use `motion-safe:` for transitions.
- [ ] **Step 5: Run** all component test files one by one (`Button`, `SiteHeader`, `NavToggle`, `SiteFooter`, `HeroEm`). Expected: PASS. Run `pnpm typecheck` and `pnpm lint`.
- [ ] **Step 6: Commit** `Rebuild the site shell in Tailwind`.

### Task 3: Visual check against the old site

**Files:** none (verification only).

- [ ] **Step 1:** serve the root site (`python3 -m http.server 8000`) and the app (`pnpm dev`).
- [ ] **Step 2:** in Chrome, compare header, hero and footer at 375, 768, 1024 and 1280 px, and the open burger panel at 375 px. List every visible difference (spacing, color, font, weight, shadow). Fix each in the component, re-check, repeat until none remains.
- [ ] **Step 3:** with the keyboard, check that the closed panel links cannot take focus below `lg`, and that the focus ring shows on every control.
- [ ] **Step 4:** stop both servers. Commit any fix with a message that names the component.

### Task 4: Prettier

**Files:**
- Create: `web/.prettierrc.json`, `web/.prettierignore`
- Modify: `web/package.json`

- [ ] **Step 1:** `pnpm add -D prettier prettier-plugin-tailwindcss`. Config: `plugins: ["prettier-plugin-tailwindcss"]` (last), `tailwindStylesheet: "./src/app/globals.css"`, `tailwindFunctions: ["tv", "cn"]`. Ignore `.next`, `out`, `public`, `pnpm-lock.yaml`, `CLAUDE.md`, `AGENTS.md`.
- [ ] **Step 2:** add scripts `format` (`prettier --write .`) and `format:check` (`prettier --check .`).
- [ ] **Step 3:** run `pnpm format`, then `pnpm typecheck`, `pnpm lint` and the component tests from Task 2. Expected: PASS.
- [ ] **Step 4: Commit** the config and scripts, then the formatting in a second commit named `Format web/ with Prettier`.

### Task 5: Rewrite skills and CLAUDE.md (independent of Tasks 1 to 4)

**Files:**
- Modify: `.claude/skills/msca-design/{SKILL.md,TOKENS.md,COMPONENTS.md}`, `.claude/skills/THIRD_PARTY.md`, `web/CLAUDE.md`, `CLAUDE.md`
- Create: `.claude/skills/msca-design/TAILWIND.md`
- Delete: `.claude/skills/msca-nextjs/`, `.claude/skills/vercel-react-best-practices/`

- [ ] **Step 1:** merge the structure rules of `msca-nextjs/SKILL.md` (shape, content loading, routes, forms, "done" criteria) into `web/CLAUDE.md`, keeping one home for each fact. Delete `msca-nextjs/`.
- [ ] **Step 2:** delete `vercel-react-best-practices/`; remove its row and its notes from `THIRD_PARTY.md`.
- [ ] **Step 3:** rewrite `TOKENS.md` as the `@theme` token table (token name, value, role). Rewrite `COMPONENTS.md` per component: React name, props and variants, Tailwind classes that matter, states, responsive behavior (default breakpoints), native HTML used, source section of the old site. Remove selectors and class names of the old stylesheet.
- [ ] **Step 4:** write `TAILWIND.md`: each rule is one line plus a link to tailwindcss.com. First rules: tokens in `@theme`, `@theme inline` for `next/font`, components over `@apply`, no CSS Modules, whole class names, `source(none)` with `@source`, default mobile-first breakpoints, `tv` and `cn` for variants.
- [ ] **Step 5:** rewrite `SKILL.md`: principles and rules for the new app, keep the decisions from the old comparison table as rules (red main accent, light theme only, and so on), remove the table and every reference to the private design doc. Update both `CLAUDE.md` files for the new commands (`format`, `format:check`) and the status list.
- [ ] **Step 6:** check with `grep -rn "docs/04\|style.css\|msca-nextjs" .claude CLAUDE.md web/CLAUDE.md` that no stale reference remains, except the one line in `web/CLAUDE.md` that says the root stylesheet is the visual reference. Check that no em dash character remains in the touched files.
- [ ] **Step 7: Commit** `Rewrite the design skill for Tailwind and merge the Next.js skill into CLAUDE.md`.

### Task 6: Push

- [ ] **Step 1:** run `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check` in `web/`. Expected: all pass.
- [ ] **Step 2:** `git push -u fork web/tailwind`. Report the PR link. Open no PR without the user's word.
