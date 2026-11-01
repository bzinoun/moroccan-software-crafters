# Moroccan Software Crafters site

This repo holds two versions of the community site:

- **Root (live):** plain HTML, `assets/css/style.css`, `assets/js/*.js`, served as is by GitHub Pages from `main`. See `README.md`.
- **`web/` (in progress):** the Next.js port. Its own `web/CLAUDE.md` has the status, commands and gotchas. Work on the port from there.

`content/*.json` is the single source of truth for both versions. A content edit there shows on both.

## Rules for all work in this repo

- Site copy is French, sentence case, no exclamation marks in body text, numbers with their year.
- Never use em dashes in copy, code comments, docs or commit messages.
- The repo is public: no personal data (emails, phone numbers, attendee lists), no internal notes, no secrets. Form endpoint ids go in `content/site.json`; tokens go in GitHub secrets.
- Show a partner logo or a photo only with the partner's consent.
- Credit the whole organizer team for the meetups and SoCraTes Maroc, never one person.
- Contributions go through a fork and a pull request to `bzinoun/moroccan-software-crafters`.

## Skills in `.claude/skills/`

`msca-design` (look and components), `msca-nextjs` (the port), and two Vercel React skills listed in `.claude/skills/THIRD_PARTY.md`.
