# Moroccan Software Crafters site

The community site of the Moroccan Software Crafters meetups and SoCraTes Maroc, in French, built with Next.js and hosted on Vercel (prerendered pages, plus one Server Action for the lead forms).

## Stack

- Next.js 16 (App Router, `output: "export"`), React 19, TypeScript `strict`
- Tailwind CSS v4 with tokens in `src/app/globals.css`
- zod for the content schemas, Vitest and Testing Library for the tests
- Node 24 (`.nvmrc`) and pnpm (the version is pinned in `package.json`)

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve the production build at http://localhost:3000
pnpm clean    # remove .next and out
```

## Checks

```bash
pnpm format:check
pnpm typecheck      # runs next typegen and tsc --noEmit
pnpm lint
pnpm vitest run <file>   # a few test files while you work
pnpm test:coverage       # the whole suite with v8 coverage
pnpm check               # all of the above plus the whole suite and the build
```

`pnpm check` runs the whole test suite: CI runs it, so on a laptop run only the tests your change touches. `pnpm format` writes the formatting (Prettier sorts the Tailwind classes). Workflow files are checked with `actionlint` and `yamllint --strict -c .yamllint.yml .github .yamllint.yml`.

## Edit the content

All editable text lives in `content/*.json`. The pages only hold structure, and a broken edit fails the build.

| File                                               | Content                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `site.json`                                        | name, links, contact, form endpoint, navigation, footer, LinkedIn follower count   |
| `home.json`                                        | home page texts (hero, format, FAQ, closing band)                                  |
| `offers.json`                                      | the "host a meetup" offers (name, what is included)                                |
| `sponsoring.json`                                  | the SoCraTes partner call: arguments, trust logos, packages, in-kind, FAQ, form    |
| `events.json`                                      | all events (meetups, SoCraTes, Code Snacks) with photos, topics, links             |
| `companies.json`                                   | companies (name, logo, LinkedIn link); their roles are computed from `events.json` |
| `meetup.json`, `socrates.json`, `association.json` | texts of the matching pages                                                        |
| `articles.json`                                    | news: title, date, excerpt, image, body in simple Markdown                         |

Rules:

- A company `name` must match the `host` or `sponsors[]` value of the events exactly: this links the two.
- Every link is a route (`/meetup/#proposer`), a hash on the same page (`#sponsor-form`) or an `https` URL. Never write a `.html` link.
- The SoCraTes page takes its editions (dates, participants, partners) from the events of type `socrates` in `events.json`; an item of `socrates.json` only names its event by `id`.
- Article bodies accept `## Title`, paragraphs, `- lists`, `1. lists`, `> quote`, `**bold**`, `*italic*` and `[link](url)`.
- Photos live in `public/assets/img/meetups/` and are referenced by file name without extension (`"photo": "2026-10-sg-gscm-5"`). Logos live in `public/assets/img/logos/` (`"logo": "axa.png"`, empty means the monogram).
- Copy is French, sentence case, with no exclamation marks in body text and no em dashes.
- Show a partner logo or a photo only with the partner's consent. The repo is public: no personal data, no secrets.

To add a meetup:

1. Put the photos in `public/assets/img/meetups/` as `YYYY-MM-host-N.jpg`, at most 1600 px wide and without metadata.
2. Add the event at the top of `content/events.json` (newest first).
3. If the host is new, add it to `content/companies.json` with `id`, `name`, `display`, `logo` and `linkedin`. All five are required (`logo` and `linkedin` may be an empty string). Put the 240 by 240 px PNG logo in `public/assets/img/logos/`.
4. Optional: add a recap to `content/articles.json`.

## Forms

Both forms (host funnel and SoCraTes sponsor form) call the `saveLead` Server Action (`src/app/actions/save-lead.ts`), which validates the lead on the server and creates a page in the Notion "Leads" database. It needs two server variables in the Vercel project: `NOTION_TOKEN` (secret) and `NOTION_LEADS_DATA_SOURCE_ID`. Without them, or when Notion fails, the form shows its fallback: a prefilled e-mail to `contact.email` in `content/site.json`, else the LinkedIn page. The forms need JavaScript to send: a visitor without it reads the form and a note that points to LinkedIn.

## Deploy

Vercel builds every push: `main` goes to production at https://moroccan-software-crafters.vercel.app, other branches and pull requests get a preview URL. Pull requests also run `.github/workflows/ci.yml`: the `check` job (format, types, lint, tests, `pnpm audit`, build) and the `workflows` job (`actionlint`, `yamllint`). Dependabot opens weekly update pull requests.

If the domain changes, update `baseUrl` in `content/site.json`.

## Contribute

Work in a fork and open a pull request to `bzinoun/moroccan-software-crafters`. See `CLAUDE.md` for the structure, the rules and the gotchas.
