# Moroccan Software Crafters site

This repo holds two versions of the community site:

- **Root (live):** plain HTML with its own CSS and JS in `assets/`, served as is by GitHub Pages from `main`. See `README.md`.
- **`web/` (in progress):** the Next.js port, styled with Tailwind v4. Its own `web/CLAUDE.md` has the structure, status, commands and gotchas. Work on the port from there.

`content/*.json` is the single source of truth for both versions. A content edit there shows on both.

## Rules for all work in this repo

- Site copy is French, sentence case, no exclamation marks in body text, numbers with their year.
- Never use em dashes in copy, code comments, docs or commit messages.
- The repo is public: no personal data (emails, phone numbers, attendee lists), no internal notes, no secrets. Form endpoint ids go in `content/site.json`; tokens go in GitHub secrets.
- Show a partner logo or a photo only with the partner's consent.
- Credit the whole organizer team for the meetups and SoCraTes Maroc, never one person.
- Contributions go through a fork and a pull request to `bzinoun/moroccan-software-crafters`.

## Skills in `.claude/skills/`

- `msca-design`: the design system of the `web/` app (`SKILL.md` principles and rules, `TOKENS.md` the `@theme` table, `TAILWIND.md` Tailwind rules with doc links, `COMPONENTS.md` built and planned components).
- `vercel-composition-patterns`: React composition rules, third party, listed in `.claude/skills/THIRD_PARTY.md`.
