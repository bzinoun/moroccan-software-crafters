# Moroccan Software Crafters: new website

Design documents for the new website of the Moroccan Software Crafters Association (MSCA), the community behind the Moroccan Software Crafters meetups and the SoCraTes Maroc conference.

Status: draft v0.1, 25 October 2026. Written from the Notion workspace, the current site (socrates-ma.github.io), and the 2027 offer decided on 25 October 2026.

## Why a new site

The current site is a one-page Hugo template built for the conference only. It does not mention the meetups, the partner offer, or the community. It sends people to a Google Form. Two edition labels are wrong. The 2027 plan needs a site that sells the partner packs, fills the events through Luma, and shows proof: four editions, fourteen meetups, five sponsors who renewed four times.

## The documents

| File | What it answers | Read it when |
|---|---|---|
| `01-website-brief.md` | Why, for whom, what success looks like, what is in and out | Before any other doc |
| `02-sitemap-and-content.md` | The pages, the copy for each page, the calls to action | When you build pages |
| `03-partner-offer.md` | The packs, tiers, prices, seats, process, FAQ. Source of the brochure | When you write the partners page or the brochure |
| `04-brand-and-design.md` | Colors, type, layout, components, wireframes, tone | When you design or review a page |
| `05-tech-stack-and-hosting.md` | Astro, GitHub Pages, content model, Luma, forms, i18n, deploy, runbook | When you set up the repo |
| `06-launch-plan.md` | Phases, tasks, dates, QA checklist, risks | When you plan the work |

## Decisions already made

These come from the 25 October 2026 session and are inputs, not open questions:

- SoCraTes 2027: after Ramadan 2027 (dates to confirm), 3 nights at The View Bouznika, 60 people.
- Conference packs: 8 packs at 35,000 MAD (2 seats, 1 meetup, talent list, insight note) and 4 Supporter packs at 20,000 MAD (1 seat, no meetup, first-time sponsors only). Extra sponsor seats at 7,000 MAD.
- Tickets: community 4,000 MAD (cap 15), full 4,500 MAD, company 7,000 MAD.
- Meetups: 8 per year, 2 full-service. Tiers: Host 10,000, Host+ 15,000, Full service 20,000 MAD. Craft session as an add-on.
- Offers go out on 1 December 2026. Signed quotes by 15 February 2027.

## Open decisions for the site

1. Publish pack prices on the site, or keep them in the brochure only. Recommendation in `03-partner-offer.md`.
2. Domain name. The site stays on socrates-ma.github.io until a domain is chosen. Options in `05-tech-stack-and-hosting.md`.
3. Languages. Recommendation: English for the public site, French for the partners page and the brochure. See `02-sitemap-and-content.md`.
4. Who owns the site after launch. One organizer, named in `06-launch-plan.md`.

## How to use these docs

1. Read the brief. Correct the facts and the goals.
2. Approve the sitemap and the partner offer page. These two pages are needed by 1 December.
3. Set up the repo with `05-tech-stack-and-hosting.md`.
4. Build the pages from `02-sitemap-and-content.md` with the tokens in `04-brand-and-design.md`.
5. Run the QA checklist in `06-launch-plan.md` before launch.
