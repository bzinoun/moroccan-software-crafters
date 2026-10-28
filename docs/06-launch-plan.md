# 06. Launch plan

Target: version 1 live on 1 December 2026, the day the partner offers go out. Version 2 by 31 January 2027.

Owners are placeholders until the next organizer meeting. One organizer owns the site after launch; name that person first.

## Phases

| Phase | Dates | Output | Owner |
|---|---|---|---|
| 0. Approve | 26 Oct to 1 Nov | Brief, sitemap, partner offer corrected and approved in the WhatsApp group | Iliass |
| 1. Foundation | 2 to 8 Nov | Repo, Astro setup, tokens, fonts, layout, header, footer, deploy pipeline live with a placeholder home | Site owner |
| 2. Partners first | 2 to 8 Nov | Partners page with both tables, the process, the FAQ, the form. Brochure PDF from the same content | Iliass + site owner |
| 3. Events | 9 to 15 Nov | Meetups page, SoCraTes 2027 page, event files for all 14 meetups and 4 editions from Notion | Site owner + one organizer |
| 4. Community | 9 to 15 Nov | About, code of conduct, contact, 404. Organizer photos and bios | Each organizer sends own bio and photo |
| 5. Assets | 9 to 22 Nov | Logo SVGs, zellige and khatam SVGs, partner logos with consent, event photos with consent, OG images | Design owner |
| 6. Review | 16 to 22 Nov | Two organizers and one partner contact read every page. Fix list | All |
| 7. Launch | 23 to 30 Nov | QA checklist, replace the Hugo site, announce on LinkedIn | Site owner |
| 8. Version 2 | Dec to 31 Jan | Recap pages, French partners page, Notion export action, newsletter decision | Site owner |

## Task list for version 1

Foundation:
- Create the Astro project in the existing repo on a branch; keep the Hugo site on `main` until launch day.
- Add `tokens.css` and `base.css` from `04-brand-and-design.md`.
- Self-host the three fonts.
- Build `Base.astro`, `Header.astro`, `Footer.astro`.
- Add the deploy workflow and confirm a placeholder deploys to a preview branch.

Partners page:
- Write the two tables as components from `03-partner-offer.md`.
- Write the five-step process with the 2027 dates.
- Write the ten FAQ entries.
- Connect the Formspree form; test one submission reaches socrates.maroc@gmail.com.
- Export the brochure PDF from the same content; compare every price with the page.

Events:
- Create 18 event files from Notion: 14 meetups, 4 editions. Check the edition numbers: 2022 first, 2023 second, 2024 third, 2025 fourth.
- Build the next-event card and the session board. Use the SG GSCM topics for the first three session cards.
- Build the meetups agenda as a step list.
- Build the SoCraTes page with the tickets table and the four past editions.

Community:
- About page with the six people (five organizers and the founder).
- Code of conduct with the report path added.
- Contact page with the Luma calendar embed.

## QA checklist before launch

Content:
- Every price on the site matches `03-partner-offer.md` and the brochure.
- Every edition has the right ordinal and the right participant count.
- Every partner logo on the site has `logoConsent: true`.
- Every photo has a consent record in Notion.
- No "Learn more", no "Submit", no exclamation marks in body text.
- The dates line on `/socrates` says "to be confirmed" until the hotel confirms.

Technical:
- Lighthouse on home and partners: performance 90+, accessibility 100, SEO 100.
- Every page has title, description, canonical, and an OG image. Test with the LinkedIn post inspector.
- Keyboard: tab through the home page and the partners form with a visible focus ring.
- `prefers-reduced-motion`: the board does not move.
- 360 px, 768 px, 1280 px: no horizontal scroll, tables become cards on mobile.
- Links: no 404 inside the site; Luma links carry `utm_source=site`.
- The form sends, the success message shows, the spam honeypot works.
- `robots.txt` and `sitemap-index.xml` exist.
- Analytics receives a page view from a test visit.

Process:
- Two organizers can run the "publish a meetup" runbook without help.
- The old Hugo repo is archived with a note that points to the new one.

## Launch day, 1 December

1. Merge the Astro branch into `main`. The deploy replaces the Hugo site at the same URL.
2. Check the home, partners, and meetups pages on a phone.
3. Send the partner offers with the link to `/partners` and the brochure attached.
4. Post the launch on LinkedIn with the session board as the image and "See the partner packs" as the link.
5. Update the Luma calendar description and the LinkedIn page "About" with the site link.

## Risks

| Risk | Effect | Response |
|---|---|---|
| The hotel does not confirm the dates before 1 December | The SoCraTes page cannot show dates | Keep "after Ramadan 2027, to be confirmed". The packs do not depend on the date |
| Partner logos arrive late | Empty logo row at launch | Launch with names in text; add logos as they come |
| One organizer builds everything | Bus factor of one | The runbooks are the handover. Pair on the first two events |
| The brochure and the site diverge | A partner sees two prices | One source: the brochure is exported from the partner-offer content, never edited by hand |
| Organizer photos and bios are late | About page is half empty | Launch with names and roles; add photos in version 2 |
| Formspree free tier limit (50 submissions a month) | Lost partner contacts | The `mailto:` fallback is always visible under the form |
| Legal check on the organizer percentage changes the budget | No effect on the site | Prices on the site are the partner prices, not the internal split |

## After launch, monthly

- Export from Notion, check the next-event card, merge Dependabot updates: one hour, the site owner.
- Read the analytics goals: Luma clicks, partner forms, brochure downloads. Report in the organizer group.
