# 01. Website brief

## One line

A site that sells the partner packs, fills the events, and shows seven years of proof, maintained by volunteers in under 15 minutes per event.

## Who we are (facts for the site)

- Legal name: Moroccan Software Crafters Association (MSCA). Two brands: Moroccan Software Crafters (meetups) and SoCraTes Maroc (annual conference).
- Values: software craftsmanship, TDD, clean architecture, technical excellence, community building.
- Since 2019: 2 Code Snacks, 1 online event, 14 meetups, 4 SoCraTes editions.
- Editions: 2022 Marrakech (Palais Ronsard, 30 people), 2023 Bouznika (45), 2024 Bouznika (50), 2025 Bouznika (50). The View Bouznika hosted 2023 to 2025.
- Meetup hosts: BDSI Maroc (BNP Paribas), Maltem Africa, inwi, McKinsey, Theodo Maroc (Nimbleways), LabelVie, Renault Digital, Oracle MADC, Jobzyn, InnovX, AXA Assurance Maroc, SG GSCM (ex-SG ATS).
- Sponsors who renewed four times: Gemography, Keiken, Maltem Africa / Valkima, inwi, McKinsey (knowledge partner).
- Recent meetups: 110 to 157 registrations on Luma for about 50 approved seats. Demand is 2 to 3 times the capacity.
- Part of the SoCraTes family: Germany (since 2011), France, UK, Canaries, Switzerland, Belgium, Italy.
- Channels: LinkedIn company page (moroccansoftwarecrafters), Instagram, X (SoCraTes_MA), Luma, WhatsApp group, socrates.maroc@gmail.com.

## Audiences and their jobs

| Audience | Who | What they need from the site | Primary action |
|---|---|---|---|
| Partners | CTO, engineering manager, HR, communication, purchasing at Moroccan tech companies | What they get, what it costs, how to sign, proof that others did | Contact us about a pack |
| Participants | Engineers, testers, architects, tech leads, students | Next event, how it works, how to get a seat, what past events were like | Register on Luma |
| Community | Organizers, speakers, the WhatsApp group, the SoCraTes family abroad | One link to share, the code of conduct, who runs this, how to help | Share the page, volunteer |

Partners come first. The 2027 budget depends on 12 conference packs and 8 meetup packs. Every other page supports that one: the events and the recaps are the proof that the packs work.

## Goals and metrics

| Goal | Metric | Target for 2027 |
|---|---|---|
| Sell packs | Partner contacts started from the site (form or mailto) | 20 by 15 February 2027 |
| Sell packs | Packs signed where the site or the brochure was the first touch | 4 of 12 |
| Fill events | Luma registrations that come from the site (UTM) | 30% of registrations |
| Show proof | Every event has a page with date, host, recap, and photo | 100% from 2022 on |
| Low maintenance | Time to publish a new event | Under 15 minutes |
| Reach | Site visits per month after launch | 1,000 |

The targets are hypotheses. Set the real baseline after one month of analytics.

## Scope

### Version 1, live by 1 December 2026

The pages that the offer needs:

- Home
- Partners: the packs, the tiers, the process, the logos, the contact
- SoCraTes 2027: date window, format, values, tickets, past editions
- Meetups: next meetup, how it works, past meetups, host a meetup
- About: community, organizers, history, SoCraTes family
- Code of conduct
- Contact

### Version 2, by 31 January 2027

- Recaps and insight notes, one page per event
- French version of the partners page
- Speakers and session archive from past meetups
- Newsletter or WhatsApp join flow
- Partner logos wall with years

### Out of scope

- Ticket payment on the site. Luma and bank transfer stay the payment paths.
- A members area or login.
- A blog with opinion pieces. Recaps only.
- Arabic version. The type system is ready for it, the content is not.

## Constraints

- Volunteer time. No agency, no paid design, no paid hosting.
- Hosted on GitHub Pages from the existing organization (SoCraTes-MA). A domain can come later.
- Bilingual by audience: English for the public site, French for the partners page and the brochure. Partner emails are in French; public posts are in English.
- The content must come from the Notion workspace (Events, Companies, Sponsorships, People) so that the site and the sponsor files do not diverge.
- Pack prices and seat rules are fixed for 2027. The site states them; it does not negotiate them.
- Photos need consent. The Notion participants database has a photo consent field; use only photos covered by it.

## Audit of the current site (socrates-ma.github.io)

| Finding | Effect | Fix |
|---|---|---|
| Hugo 0.92 with a Bootstrap "agency" template, one page | Looks like every other template site; no room for meetups or partners | Replace with Astro, multi-page |
| Conference only; no mention of the meetups or the association | 14 meetups are invisible; partners cannot find the host offer | Meetups page and Partners page |
| "Third edition" shown for both 2024 and 2025 | Credibility | Correct to 3rd (2024) and 4th (2025) |
| Pre-registration via Google Form | Two systems: Google Form and Luma | Luma only |
| Says "60 software crafts" for 2024 and 2025 | 50 attended; the 2027 target is 60 | State real numbers |
| No sponsor or host information | Every sponsor conversation starts from zero | Partners page with packs and process |
| No recap, no photos per edition | No proof of what happens | Recap page per event |
| Twitter links only, no LinkedIn CTA on the hero | LinkedIn is the main channel | LinkedIn and Luma first |
| English only | Fine for participants; partners sign in French | French partners page |

## Timeline

| Date | Milestone |
|---|---|
| 1 November 2026 | Brief, sitemap, and partner offer approved by the organizers |
| 8 November | Repo, design tokens, home and partners page in draft |
| 15 November | SoCraTes 2027, meetups, about, code of conduct pages in draft |
| 22 November | Review by two organizers and one partner contact |
| 1 December | Version 1 live; brochure PDF exported from the same content; offers sent |
| 31 January 2027 | Version 2 live: recaps, French partners page |
| After Ramadan 2027 | SoCraTes 2027 page switches from "register" to "recap" |
