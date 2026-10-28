# CLAUDE.md: MSCA / SoCraTes Maroc website project

Context pack exported from the claude.ai Project "Moroccan software crafters" on 28 October 2026.

## What this project is

A volunteer team runs the Moroccan Software Crafters Association (MSCA): Sallah Kokaina (founder), Iliass JABALI, Badr-Eddine Zinoun, Mehdi Fracso and Rachid Baaziz (organizers), and Houssam Fakih (SoCraTes facilitator). The whole team runs the meetups and SoCraTes Maroc together. MSCA runs two brands: Moroccan Software Crafters (meetups, Casablanca, about every two months) and SoCraTes Maroc (annual open-space conference, Bouznika). The current task is a new community website to replace the one-page Hugo site at `socrates-ma.github.io` (repo `SoCraTes-MA/socrates-ma.github.io`). Target: version 1 live on 1 December 2026, the day the 2027 partner offers go out.

## Files in this pack

| Path | Content |
|---|---|
| `docs/README.md` | Index of the website design docs (draft v0.1, 25 Oct 2026) |
| `docs/01-website-brief.md` | Goals, audiences, metrics, scope, audit of the current site |
| `docs/02-sitemap-and-content.md` | Pages, copy, calls to action |
| `docs/03-partner-offer.md` | Packs, prices, seats, process, FAQ (source of the brochure) |
| `docs/04-brand-and-design.md` | Tokens, type, layout, components, tone |
| `docs/05-tech-stack-and-hosting.md` | Astro, GitHub Pages, content model, Notion export, runbooks |
| `docs/06-launch-plan.md` | Phases, tasks, QA checklist, risks |
| `context/community.md` | Facts about the association, events, sponsors, brand, 2027 plan |
| `context/people/*.md` | Organizers and partner contacts |
| `context/communication.md` | Language and style rules for community writing |

Read `docs/README.md` first, then `docs/05-tech-stack-and-hosting.md` before any code.

## Updates after the docs were written (apply these, they win over the docs)

1. Meetup offer changed on 27 Oct 2026. The three tiers Host 10,000 / Host+ 15,000 / Full service 20,000 MAD in `docs/03-partner-offer.md` are replaced by one main product, "Meetup clé en main": base 10,000 MAD (organization, content, communication, catering, recap post, logo, 5 min recruitment slot, job offers on the site, 30 to 40 devs; the company gives the room). Option A +5,000 MAD: talent list and insight notes. Option B +5,000 MAD: MSCA brings the room. Other models (company membership, sponsor bundle, workshops, BBL, free lane, merch) are in `context/community.md`. This list was still to be shared with the organizer group, so treat it as a proposal until confirmed.
2. Principle: companies pay, crafters never pay for access. No paid meetup tickets, no crafter subscription. The attendee list is never sold (Moroccan law 09-08).
3. Lead form first. A partner lead form (company, contact, format, preferred month, room available yes/no, options A/B) can go live before the rest of the site. It sends to the organizer group and to the Notion Companies database.
4. Repo audit findings: the current deploy pipeline is broken (it uses a retired Hugo runner), and the repo has leftover French content from a 2019 template copy.
5. Framework: Astro was recommended over Next.js. Reason: static hosting on GitHub Pages and no login features planned.

## Notion data sources

- Events `collection://17d72de3-6c73-4b60-a4e1-ce2891b60d10`
- Companies `collection://9faac7c6-794d-4b7c-8410-449fb7cc2393`
- Sponsorships `collection://e1aa50dd-e1c4-4ee0-88a8-828cc65e5f6f`
- Conference participants `collection://cd2b8a8d-71e5-4edb-9491-44644902ecaa`

Notion API notes: use data source ids (not database ids) for `/data_sources/{id}/query` and for page creation with `parent: {type: "data_source_id"}`. Throttle about 350 ms between calls to avoid 429 errors. The integration must be shared on each page through its Access tab; empty search results mean no access, not a bad token. Keep import scripts idempotent (match people on email, registrations on email + event).

## Working rules

- Never use em dashes in any text for this project.
- Site copy: English, sentence case, no exclamation marks in body text, numbers with a year. Partners page and brochure also in French (version 2).
- Show partner logos and photos only with consent (`logoConsent`, photo consent in Notion).
- Never commit secrets (Notion token, Formspree id). Use GitHub secrets.
- Organizer ideas in the group chat are proposals, not decisions, unless the docs or this file say "decided".
- Credit the whole team for the meetups and SoCraTes Maroc. Never write that one organizer runs them alone.
