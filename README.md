# Moroccan Software Crafters site

The community site of the Moroccan Software Crafters meetups and SoCraTes Maroc, in French, built with Next.js and exported as static files to GitHub Pages.

## Stack

- Next.js 16 (App Router, `output: "export"`), React 19, TypeScript `strict`
- Tailwind CSS v4 with tokens in `src/app/globals.css`
- zod for the content schemas, Vitest and Testing Library for the tests
- pnpm (the version is pinned in `package.json`)

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static export in out/
```

To serve the export: `cd out && python3 -m http.server 8001`. To test the GitHub Pages base path, build with `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters pnpm build`.

## Checks

```bash
pnpm format:check
pnpm typecheck      # runs next typegen and tsc --noEmit
pnpm lint
pnpm vitest run <file>   # a few test files while you work; CI runs the full suite
```

`pnpm format` writes the formatting (Prettier sorts the Tailwind classes). Workflow files are checked with `actionlint .github/workflows/*.yml` and `yamllint -d relaxed .github/workflows/`.

## Edit the content

All editable text lives in `content/*.json`. The pages only hold structure, and a broken edit fails the build.

| File                                               | Content                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `site.json`                                        | name, links, contact, form endpoint, navigation, footer, LinkedIn follower count   |
| `home.json`                                        | home page texts (hero, format, FAQ, closing band)                                  |
| `offers.json`                                      | the "host a meetup" offers (name, price, what is included)                         |
| `sponsoring.json`                                  | the SoCraTes partner call: arguments, levels, FAQ, form                            |
| `events.json`                                      | all events (meetups, SoCraTes, Code Snacks) with photos, topics, links             |
| `companies.json`                                   | companies (name, logo, LinkedIn link); their roles are computed from `events.json` |
| `meetup.json`, `socrates.json`, `association.json` | texts of the matching pages                                                        |
| `articles.json`                                    | news: title, date, excerpt, image, body in simple Markdown                         |

Rules:

- A company `name` must match the `host` or `sponsors[]` value of the events exactly: this links the two.
- Article bodies accept `## Title`, paragraphs, `- lists`, `1. lists`, `> quote`, `**bold**`, `*italic*` and `[link](url)`.
- Photos live in `public/assets/img/meetups/` and are referenced by file name without extension (`"photo": "2026-10-sg-gscm-5"`). Logos live in `public/assets/img/logos/` (`"logo": "axa.png"`, empty means the monogram).
- Copy is French, sentence case, with no exclamation marks in body text and no em dashes.
- Show a partner logo or a photo only with the partner's consent. The repo is public: no personal data, no secrets.

To add a meetup:

1. Put the photos in `public/assets/img/meetups/` as `YYYY-MM-host-N.jpg`, at most 1600 px wide and without metadata.
2. Add the event at the top of `content/events.json` (newest first).
3. If the host is new, add it to `content/companies.json` with a 240 by 240 px PNG logo in `public/assets/img/logos/`.
4. Optional: add a recap to `content/articles.json`.

## Forms

GitHub Pages serves static files only, so the host and sponsoring forms post to a third-party service. Set `form.endpoint` in `content/site.json`. Without an endpoint, the forms open a prefilled e-mail to the contact address in `content/site.json`; without that too, they link to the LinkedIn page.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: checks, then a build with `NEXT_PUBLIC_BASE_PATH=/moroccan-software-crafters`, then a publish of `out/` to GitHub Pages at https://bzinoun.github.io/moroccan-software-crafters/. Pull requests run `.github/workflows/ci.yml` (same checks, no deploy).

Owner action, once: Settings > Pages > Source = "GitHub Actions". If the domain changes, update `baseUrl` in `content/site.json`.

## Contribute

Work in a fork and open a pull request to `bzinoun/moroccan-software-crafters`. See `CLAUDE.md` for the structure, the rules and the gotchas.

The former static HTML site is in git history at commit 1353207 (for example `git show 1353207:index.html`).
