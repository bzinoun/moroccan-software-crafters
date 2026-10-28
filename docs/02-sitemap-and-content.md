# 02. Sitemap and content

Language: English for all public pages. French for `/fr/partenaires` (version 2) and the brochure. Sentence case everywhere. Every button says what happens when you press it.

## Sitemap

```
/                      Home
/meetups               Meetups: next one, how it works, past meetups
/meetups/<slug>        One past meetup (recap, host, photos)        [v2]
/socrates              SoCraTes 2027: dates, format, tickets, past editions
/socrates/<year>       One past edition (recap, sponsors, photos)   [v2]
/partners              Packs, tiers, process, logos, contact
/fr/partenaires        Same page in French                           [v2]
/about                 Community, organizers, history, SoCraTes family
/code-of-conduct       Code of conduct (applies to all events and online spaces)
/contact               Email, LinkedIn, WhatsApp join, Luma calendar
```

Navigation, in this order: Meetups, SoCraTes, Partners, About. One primary button in the header: "See the next event" (links to the next Luma event). Footer: contact, code of conduct, LinkedIn, Instagram, X, Luma, GitHub.

## Global elements

- Header: wordmark, four links, one button.
- Next-event banner on every page when an event is open for registration: date, host, "Register on Luma".
- Footer: "Moroccan Software Crafters Association. Software craftsmanship in Morocco since 2019." Then the links. Then "Code of conduct" and "Published under the Apache License 2.0" (keep the current license line).
- Logos: partners appear as logos with the years they supported, never as a wall of grey squares.

## Home (/)

Hero: a session board. The biggest card is the next event. Smaller cards are three recent session titles from the last meetup (from Notion, Topics field). See `04-brand-and-design.md`.

Headline: Where Moroccan engineers talk shop.

Sub-headline: A community of software crafters since 2019. Meetups every two months in Casablanca, and the SoCraTes Maroc conference once a year. Open space, no slides, no sales pitch.

Buttons: "See the next event" (Luma). "Become a partner" (/partners).

Section: What happens here

- Meetups. A Saturday morning at a partner's office. Lightning talks, a marketplace of topics, group discussions. About 50 people, by approval.
- SoCraTes Maroc. Three days and nights in Bouznika. The participants set the agenda. 60 people in 2027.
- Craft. TDD, clean architecture, testing, delivery. What works in production, said by people who ship.

Section: The numbers

- 4 editions of SoCraTes Maroc
- 14 meetups at 13 companies
- 5 partners who sponsored every edition since 2022
- 110 to 157 registrations per meetup for about 50 seats

Section: Partners who make it possible

Logos of the active partners with their years. Line under it: "Your company can host a meetup or sponsor the conference." Button: "See the partner packs".

Section: Last recap

Title, date, host, three themes, "Read the recap" (LinkedIn post until v2).

Section: Join

"Registrations open on Luma two weeks before each meetup. Seats are approved to keep the room mixed: companies, levels, and backgrounds." Button: "Follow us on Luma". Secondary: "Follow on LinkedIn".

## Meetups (/meetups)

Intro: One Saturday morning every two months, hosted by a partner company in Casablanca. Free for participants. About 50 seats, approved on Luma.

Next meetup block: date, time, host, address, "Register on Luma". If none is open: "The next meetup is announced on LinkedIn and Luma about three weeks before the date."

How a meetup works (this is a sequence, so numbered):

1. 9:30 Check-in and coffee. Bring your ID card: most hosts are corporate buildings.
2. 10:00 Welcome and host keynote, 15 minutes.
3. 10:20 Four to five lightning talks, 8 minutes each.
4. 11:00 Marketplace: propose a topic, vote with your feet.
5. 11:15 Group discussions in parallel.
6. 12:30 Closing, group photo, networking.

Themes we come back to: AI in software work, testing and delivery, architecture, DevOps, data, agile practice. Recent discussions: AI factories need tests, docs, and architecture first; human accountability for AI-written code; the security risks of vibe coding; MCP, skills, and spec-driven development.

Past meetups: a list from Notion. For each: date, host, venue, registrations, a one-line theme, link to the LinkedIn recap. Start with 2026 and go back to 2019.

Host a meetup block: "Your office, our format, 50 engineers in the room. Three packs from 10,000 MAD." Button: "See the meetup packs" (/partners#meetups).

## SoCraTes 2027 (/socrates)

Status line at the top, changed by hand: "Dates: after Ramadan 2027, to be confirmed. Bouznika. 60 people."

Intro: SoCraTes Maroc is the Moroccan edition of the International Conference for Software Craft and Testing. Three days and nights at a hotel by the sea. No speakers, no tracks: the participants propose the sessions each morning and the schedule fills itself. Facilitation in French and English.

What you get: 3 nights at The View Bouznika in full board, the open space on Friday and Saturday, evening activities, and 59 other people who care about the craft.

Tickets (table):

| Ticket | Price | For |
|---|---|---|
| Community | 4,000 MAD | Members of the community: past participants, meetup regulars. 15 seats. |
| Full | 4,500 MAD | Any individual |
| Company | 7,000 MAD | Paid by your employer, invoice provided |

"Prices include the hotel, the meals, and the sessions. Registration opens on Luma in January 2027. Seats are approved to keep the group diverse."

Format (short): Thursday afternoon arrival and world café. Friday and Saturday open space. Sunday morning closing. Rooms from Thursday 14:00 to Sunday 12:00.

Values: inclusiveness, safe environment, and the code of conduct. Link to /code-of-conduct.

Past editions (this is a timeline, so dated):

- 2025, 4th edition, The View Bouznika, 50 people, facilitator Houssam Fakih. Sponsors: Gemography, Keiken, Maltem Africa / Valkima, inwi, McKinsey, Done.
- 2024, 3rd edition, The View Bouznika, 50 people. Sponsors: Gemography, Keiken, Maltem Africa, inwi, InnovX, McKinsey.
- 2023, 2nd edition, Bouznika, 45 people. Sponsors: SG GSCM (ex-SG ATS), Gemography, inwi, Keiken, Maltem Africa, McKinsey, Nimbleways, Zenika.
- 2022, 1st edition, Palais Ronsard, Marrakech, 30 people. Sponsors: AXA, Gemography, inwi, Keiken, Maltem Africa, Nimbleways, McKinsey.

The SoCraTes family: Germany since 2011, France, UK, Canaries, Switzerland, Belgium, Italy, Finland (CodeFreeze), Romania, Crete. Keep the links from the current site.

Sponsor block: "Six companies make each edition possible. Two seats, a meetup, and a talent list are in every pack." Button: "See the conference packs" (/partners#socrates).

## Partners (/partners)

This page is the brochure in web form. Full content in `03-partner-offer.md`. Structure:

1. Why partner: three reasons with evidence (the audience, the format, the renewal rate).
2. SoCraTes 2027 packs: Pack and Supporter, side by side, with the seat rule.
3. Meetup packs: Host, Host+, Full service, side by side. Craft session as an add-on.
4. How it works: interview, quote, documents, signature, delivery. Five steps with dates.
5. Who already partners: logos with years and roles (host, sponsor, knowledge partner).
6. FAQ: ten questions.
7. Contact: "Talk to an organizer" (mailto socrates.maroc@gmail.com with a subject line) and a short form (company, name, role, which pack, message).

## About (/about)

- The association: MSCA, founded by Sallah Kokaina, non-profit, Mohammedia registration. What the association does with the money: the conference, the meetups, the facilitator.
- The team: the founder Sallah Kokaina, the organizers Iliass JABALI, Badr-Eddine Zinoun, Mehdi Fracso and Rachid Baaziz, and the SoCraTes facilitator Houssam Fakih. Photo, role in the community, LinkedIn. Say that the whole team runs the meetups and SoCraTes Maroc together.
- History: 2019 Code Snacks at BDSI Maroc; 2021 online during the pandemic; 2022 first SoCraTes in Marrakech; 2023 to 2025 Bouznika; 2026 three meetups and the 2027 plan.
- How to help: propose a lightning talk, host a meetup, join the organizers. Three mailto links with subject lines.

## Code of conduct (/code-of-conduct)

Keep the current text: inclusiveness, safe environment, the three rules (be welcoming, be respectful, be aware of your words), scope (events and all digital spaces). Add: how to report (email and a named organizer at each event), and what happens after a report.

## Contact (/contact)

Email, LinkedIn page, Instagram, X, Luma calendar, GitHub organization. "To join the WhatsApp group, come to a meetup and ask an organizer." Partner contact goes to /partners.

## Copy rules

- Say what we do before who we are.
- Numbers come from Notion and have a year. "50 people in 2025", not "dozens".
- No exclamation marks in body text. The current site has four on one page.
- Buttons: "Register on Luma", "See the partner packs", "Talk to an organizer", "Read the recap". Never "Learn more" or "Submit".
- Name companies and people only with their consent. The Notion People database has the consent fields.
- The word "SoCraTes" keeps its capitals. "Moroccan Software Crafters" is the meetup brand. "MSCA" is the legal name and appears in the footer and on invoices.
