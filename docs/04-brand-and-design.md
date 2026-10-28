# 04. Brand and design

## The idea in one sentence

The site looks like the thing that makes SoCraTes different: the session board. A wall of cards that the participants write, not a stage that someone else owns.

The brand already exists: green, red, black, cream, sage, a zellige corner pattern, a khatam badge, six LinkedIn templates, a logo. The site uses them. It does not invent a second brand.

## Design plan

### Color tokens

| Token | Hex | Role |
|---|---|---|
| `--green` | #1B6B3A | Primary: buttons, links, the SoCraTes mark |
| `--green-deep` | #0F3F23 | The session board background, footer |
| `--red` | #C1272D | One job only: the "open now" marker on the next event. Never for errors, never for decoration |
| `--black` | #000000 | Text. Real black on white and on cream, not a tinted near-black |
| `--cream` | #F3EEDF | Session cards and the pack tables. Not the page background |
| `--sage` | #A9BBA3 | Secondary surfaces: past events, quiet panels. Black text on it |
| `--white` | #FFFFFF | Page background |

Contrast: green on white 5.9:1, red on white 5.5:1, black on cream 19:1. All pass AA for text. Sage is a background only.

Why the page is white and not cream: a cream page with a serif headline and a warm accent is the default look of generated sites in 2026. Here cream is the color of the cards on the board, which is where it means something.

### Type

| Role | Family | Why |
|---|---|---|
| Display and board cards | Bricolage Grotesque, weights 600 to 800, variable width | Hand-written cards on a board are irregular. Bricolage has optical sizes and widths that let headlines breathe and card titles get condensed, in one family |
| Body and UI | IBM Plex Sans 400 and 500 | Clear at 16 px, made for engineers, and it has a sibling, IBM Plex Sans Arabic, if the site adds Arabic |
| Code and data | IBM Plex Mono | Session titles that contain code, prices in tables, dates |

Both families are on Google Fonts. Fallback stacks: `"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif` and `"IBM Plex Sans", system-ui, sans-serif`.

Scale (ratio 1.25, base 16 px): 16, 20, 25, 31, 39, 49, 61. Headlines at 49 on desktop and 39 on mobile. Body at 18 on desktop, 16 on mobile, line-height 1.55. Line length 60 to 72 characters. Sentence case for every heading and button. No all-caps labels anywhere.

### Layout

Left-aligned text. A 12-column grid, 1120 px maximum width, 24 px gutters, 20 px side margins on mobile. Sections are separated by space (96 px desktop, 56 px mobile) and by heading size, not by lines or background changes. Two exceptions carry a background: the board hero (deep green) and the footer (deep green).

Home, desktop:

```
+--------------------------------------------------------------------+
| Moroccan Software Crafters    Meetups  SoCraTes  Partners  About   |
|                                                  [See the next event]
+--------------------------------------------------------------------+
| ####### deep green board, zellige pattern in the top-right corner   |
|                                                                     |
|   Where Moroccan engineers talk shop.                               |
|   A community of software crafters since 2019 ...                   |
|   [See the next event]  Become a partner                            |
|                                                                     |
|   +----------------------+  +------------+  +------------+          |
|   | NEXT MEETUP  (red dot)|  | session    |  | session    |         |
|   | Sat 13 Dec, 9:30      |  | title from |  | title from |         |
|   | Host: ...             |  | last time  |  | last time  |         |
|   | Register on Luma      |  +------------+  +------------+         |
|   +----------------------+        +------------+                    |
|   cream cards, slight rotation    | session    |                    |
|                                   +------------+                    |
+--------------------------------------------------------------------+
|                                                                     |
| What happens here                                                   |
| Meetups ........   SoCraTes Maroc ........   Craft ........         |
|                                                                     |
| The numbers        4 editions   14 meetups   5 partners x 4   2-3x  |
|                                                                     |
| Partners who make it possible                                       |
| [logo 22-25] [logo 22-25] [logo 24,26] ...   See the partner packs  |
|                                                                     |
| Last recap  ..............................  Read the recap          |
|                                                                     |
| Join ......................  [Follow us on Luma]  Follow on LinkedIn|
+--------------------------------------------------------------------+
| deep green footer: contact, code of conduct, social, license        |
+--------------------------------------------------------------------+
```

Home, mobile: the board shows the next-event card full width and two session cards under it, no rotation.

Partners, desktop: a short pitch, then the two conference packs as two columns of one table, then the three meetup tiers as one table with three columns, then the five process steps as a numbered list (it is a sequence), then logos, FAQ as an accordion, contact form at the end. On mobile the tables become stacked cards with the pack name as the card title and the rows as a definition list.

Meetups, desktop: next-event block at the top (same card as the board), the six-step agenda as a numbered list with times, the themes as a paragraph, past meetups as a plain dated list with the host and the recap link, host-a-meetup block at the end.

### Principles

1. One bold element per page. On the home it is the board. On the partners page it is the pack table. Everything else is quiet.
2. Structure means something. Numbers appear only for sequences: the meetup agenda and the partner process. Dates appear only on timelines: past editions and past meetups. Cards appear only on the board.
3. Real content, real numbers, with a year. The design never needs lorem ipsum because Notion has the data.
4. The pattern is a signature, not wallpaper. The zellige corner appears once per page, in the hero. The khatam badge marks SoCraTes content only.
5. Photos are of people at our events, with consent. No stock photos, no illustrations of laptops or rockets.

## Review against the generic defaults

| Default tell | What this plan does instead |
|---|---|
| Cream page, serif display, terracotta accent | White page, grotesque display, green and red from the flag and the brand |
| Near-black page with one acid accent | Not used |
| Broadsheet hairlines and zero radius | Space and type size separate sections; cards have a 4 px radius, tables none |
| Identical rounded cards with the same soft shadow | Cards exist only on the board, in cream, with a 1 px black edge and a slight rotation. Packs are tables |
| All-caps eyebrow labels, middle dots, labels with a spaced dash, arrows after links | None. Sentence case, commas, plain link text |
| Fade-and-slide on every section | One motion: the board cards settle into place on load, 400 ms, skipped under `prefers-reduced-motion` |

## Components

| Component | Where | Notes |
|---|---|---|
| Next-event card | Board hero, meetups page, banner on other pages | Cream card, red dot and "Open now" when registration is open, date in Plex Mono, host name, one button |
| Session card | Board hero | Cream, rotated between -2 and 2 degrees, title in Bricolage condensed, the host and date in small text. Content from the Topics field of the last event |
| Pack table | Partners page | Column per pack, row per item. Price row in Plex Mono at 31 px. "Yes" and "No" as text, not icons |
| Logo row | Home, partners, SoCraTes page | Logo at one height, name under it, years under the name. Grey logos are allowed only if the company asks |
| Timeline | SoCraTes page, about page | Year in Plex Mono on the left, text on the right. No vertical line |
| Step list | Meetups agenda, partner process | Numbered because it is a sequence. Time or date on the left |
| Recap card | Home, meetups | Date, host, three themes, one link |
| Button | Everywhere | Primary: green fill, white text. Secondary: black text with a 2 px black underline. No outline buttons. Text says what happens |
| Form | Partners contact | Five fields, labels above fields, one button "Send to the organizers". Success text: "Sent. An organizer answers within three working days." |
| Footer | Everywhere | Deep green, white text, four columns on desktop, one on mobile |

## Tone of voice

- Plain verbs, short sentences, sentence case.
- Speak as the organizers, "we", to the reader, "you".
- Say the number and the year. "50 people in 2025", not "a growing community".
- No exclamation marks in body text. No "join the movement". No emoji on the site; keep them for LinkedIn.
- Technical words stay technical: TDD, open space, lightning talk, marketplace. Explain them once, on the meetups page.

## Quality floor

- Responsive from 360 px. The board works at 360 px with stacked cards.
- Keyboard: every link and button has a visible focus ring, 3 px green outside the element.
- `prefers-reduced-motion`: no motion at all.
- Images have alt text that says what is in the photo, not "image".
- Every page has a title, a description, and an Open Graph image. The OG image is the session card with the page title on it, generated at build time.
- Dark mode: version 2. The tokens are ready; add the dark values under `prefers-color-scheme: dark`.

## Assets to prepare

| Asset | Source | Format |
|---|---|---|
| Logo and khatam badge | Canva brand files | SVG |
| Zellige corner | Canva brand files, the laser-engraving vector | SVG, one color |
| Partner logos | Ask each partner in the November call | SVG or PNG at 2x, on transparent |
| Event photos | Organizers' phones, consent checked in Notion | WebP, 1600 px wide |
| Organizer portraits | Each organizer | 800 x 800 px, same light, same crop |
| Fonts | Google Fonts | Self-hosted WOFF2 in the repo to avoid a third-party request |
