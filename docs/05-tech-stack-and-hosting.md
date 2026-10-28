# 05. Tech stack and hosting

## Decisions

| Area | Choice | Why |
|---|---|---|
| Framework | Astro, current stable major, pinned at setup | Static output, content collections for events and partners, zero JavaScript by default, built-in i18n routing |
| Styling | Plain CSS with custom properties from `04-brand-and-design.md` | A small site with a fixed token set does not need a utility framework. Fewer dependencies for volunteers to maintain |
| Hosting | GitHub Pages from the existing `SoCraTes-MA` organization | Already in place, free, the team knows GitHub |
| Deploy | GitHub Actions on push to `main` | No manual build step |
| Registrations | Luma only | One system, approval flow, check-in, exports |
| Partner contact form | Formspree free tier, with a `mailto:` fallback | GitHub Pages has no backend |
| Analytics | GoatCounter or Umami cloud, free tier | Privacy-friendly, no cookie banner, enough for 1,000 visits a month |
| Fonts | Self-hosted WOFF2 of Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono | No third-party request on page load |
| Source of content | Notion workspace, exported to the repo | The site and the sponsor files stay in sync |

The old repo `SoCraTes-MA/socrates-ma.github.io` (Hugo 0.92) is archived after launch. Its wiki stays.

## Repository

Name: `SoCraTes-MA/socrates-ma.github.io`, replaced in place so that the URL does not change. Branch `main` deploys. Work on branches and open a pull request; one other organizer reviews.

```
socrates-ma.github.io/
  astro.config.mjs
  package.json
  public/
    fonts/                 WOFF2 files
    img/                   logos, pattern SVGs, photos (WebP)
    robots.txt
  src/
    content/
      events/              one Markdown file per meetup or edition
      partners/            one JSON file per company
      people/              one JSON file per organizer
    content.config.ts      collection schemas
    layouts/Base.astro
    components/
      Header.astro  Footer.astro  NextEventCard.astro  SessionBoard.astro
      PackTable.astro  LogoRow.astro  Timeline.astro  StepList.astro
      RecapCard.astro  ContactForm.astro
    pages/
      index.astro
      meetups/index.astro  meetups/[slug].astro
      socrates/index.astro  socrates/[year].astro
      partners.astro
      about.astro
      code-of-conduct.astro
      contact.astro
      404.astro
      fr/partenaires.astro
    styles/tokens.css  base.css
  scripts/
    notion-export.mjs      pulls Events, Companies, People from Notion into src/content
  .github/workflows/deploy.yml
```

## Content model

Schemas live in `src/content.config.ts`. Field names match the Notion properties so that the export script is a direct mapping.

Event (`src/content/events/2026-10-24-sg-gscm.md`):

```yaml
---
title: "Meetup @SG GSCM"
type: meetup            # meetup | conference | code-snack | online
date: 2026-10-24
endDate:                # conferences only
city: Casablanca
venue: ""
host: sg-gscm           # partner id
sponsors: []            # partner ids, conferences only
lumaUrl: ""
lumaRegistrations: 110
lumaApproved: 49
participants:           # conferences only
linkedinAnnouncement: ""
linkedinRecap: ""
topics: "AI factory needs tests, docs, and architecture first; ..."
status: past            # upcoming | open | past
photos: []
---
Recap text in Markdown, version 2.
```

Partner (`src/content/partners/inwi.json`):

```json
{
  "id": "inwi",
  "name": "inwi",
  "roles": ["meetup-host", "conference-sponsor"],
  "status": "active",
  "years": { "sponsor": [2022, 2023, 2024, 2025], "host": [2022] },
  "website": "",
  "logo": "/img/partners/inwi.svg",
  "logoConsent": true
}
```

Person (`src/content/people/badr-eddine-zinoun.json`): name, role in the community, LinkedIn URL, photo path, photo consent.

Rule: a partner logo renders only when `logoConsent` is true. A person renders only with photo consent.

## Notion export

`scripts/notion-export.mjs` reads the three databases through the Notion API with an internal integration token and writes the files above. It runs by hand (`npm run export`) in version 1, and as a weekly GitHub Action in version 2. The token lives in a GitHub secret, never in the repo. The export never deletes a file; it overwrites fields and reports what changed.

Database ids: Events `17d72de3-6c73-4b60-a4e1-ce2891b60d10`, Companies `9faac7c6-794d-4b7c-8410-449fb7cc2393`, Sponsorships `e1aa50dd-e1c4-4ee0-88a8-828cc65e5f6f`, Conference participants `cd2b8a8d-71e5-4edb-9491-44644902ecaa`. The Sponsorships and participants databases hold amounts and personal data; the export reads only names, roles, years, and consent flags from them.

## Integrations

Luma:
- Each event page links to its Luma event. The next-event card uses the `lumaUrl` and `status` fields.
- Add `?utm_source=site` to every Luma link so that registrations from the site are measurable in Luma.
- The Luma calendar embed on the contact page shows all upcoming events. Get the calendar slug from the organizer who owns the Luma account.
- The talent list consent question is a Luma registration question, not a site feature.

Contact form:
- Formspree endpoint bound to socrates.maroc@gmail.com. Fields: company, name, role, pack of interest (select), message. Honeypot field for spam. Success message as in `04-brand-and-design.md`.
- The `mailto:` fallback has a prefilled subject: "Partner pack 2027".

Analytics:
- One script tag in `Base.astro`. Goals: Luma click, partner form sent, brochure download.

## Languages

Astro i18n with `defaultLocale: "en"` and `locales: ["en", "fr"]`, `prefixDefaultLocale: false`. Only `/fr/partenaires` exists in French in version 2. The header shows "FR" only on the partners page. Shared strings live in `src/i18n/en.json` and `fr.json`.

## SEO and sharing

- `@astrojs/sitemap` and a `robots.txt` that allows everything.
- Title, description, canonical, and Open Graph on every page from the layout.
- Open Graph image generated at build time with the session-card design, per page.
- `Event` structured data (schema.org) on event pages: name, startDate, location, organizer, offers for the conference.
- 404 page with the four main links.
- Old anchors (`#services`, `#portfolio`, `#about`, `#team`, `#contact`) do not need redirects; GitHub Pages serves the new home for the old URL.

## Deploy

`.github/workflows/deploy.yml` uses the official Astro GitHub Pages action: install, build, upload, deploy. Branch protection on `main`: one review required. A broken build does not deploy; the last good version stays online.

Domain: the site stays on `socrates-ma.github.io` for version 1. If the organizers want a domain, check these with a `.ma` registrar in this order: `socrates.ma`, `moroccansoftwarecrafters.ma`, `msca.ma`. Availability is not checked here. A `.ma` domain needs a Moroccan registrar and the association's documents. Add a `CNAME` file to `public/` and the four `A` records of GitHub Pages when the domain exists.

## Runbook: publish a meetup in under 15 minutes

1. Create the event on Luma: date, time, host, address, approval required, the consent question.
2. Copy the Luma URL.
3. In the repo, add `src/content/events/<date>-<host>.md` with `status: open` and the Luma URL. Copy the last file as a template.
4. If the host is new, add `src/content/partners/<host>.json` with `logoConsent` set after the host confirms.
5. Open a pull request. One organizer approves.
6. Merge. The deploy runs in about two minutes. Check the next-event card on the home page.
7. After the event: set `status: past`, add `lumaRegistrations`, `lumaApproved`, and the recap link. Merge.

## Runbook: update the SoCraTes page from registration to recap

1. Change `status` of the edition file to `past`.
2. Add `participants`, the sponsor ids, the recap link, and the photos with consent.
3. Move the "Dates" status line on `/socrates` to the next edition.
4. Export the sponsor logos from Notion after the November calls, with consent.

## Security and privacy

- No personal data in the repo beyond organizer names and consented photos. The talent list never touches the site.
- No cookies. The analytics tool runs without a consent banner.
- The Notion token and the Formspree id are secrets, not committed.
- Dependabot on for the repo; one organizer merges the updates monthly.
- Moroccan data protection law (loi 09-08) applies to the talent list and to any newsletter. Check the CNDP guidance before version 2 adds a newsletter.
